import { randomBytes, randomInt } from 'crypto';
import mongoose from "mongoose";
import AppError from "@/core/Helpers/AppError.js";
import { getUserById } from "@/core/Helpers/queryHelpers.js";
import InventoryService from "@/core/Services/Traveller/InventoryService.js";
import Booking from "@/core/Models/Booking.js";
import { bookingPayload } from "@/core/Helpers/bookingHelper.js";
import NotificationService from "@/core/Services/General/NotificationService.js";
import { getAppConfig } from "@/core/Lib/appConfig.js";
import { Package } from "@/core/Models/index.js";
import Category from '@/core/Models/Category.js';
import { schemaKey } from '@/core/Helpers/Package/shared.js';
import { getCategoriesBy } from '@/core/Helpers/queryHelpers.js';
import { RESPONSE_MESSAGES, BOOKING_STATUS, PAYMENT_STATUS } from "@/core/Constants/index.js";

const generateNumericOTP = () => randomInt(100000, 1000000).toString();
const generateBookingCode = () => `TD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${randomBytes(4).toString('hex').toUpperCase()}`;

export const initiateBooking = async ({ userId, body, itemId }) => {
    if (!itemId && !mongoose.Types.ObjectId.isValid(itemId)) throw AppError.notFound(RESPONSE_MESSAGES.PACKAGE.NOT_FOUND);
    const targetItemId = new mongoose.Types.ObjectId(itemId);

    const session = await mongoose.startSession() || null;
    let finalResponse;

    try {
        await session.withTransaction(async () => {
            const config = await getAppConfig();
            const checkInDate = new Date(body.startDate);
            const checkOutDate = new Date(body.endDate);
            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) throw AppError.badRequest("Invalid startDate or endDate format. Use YYYY-MM-DD.");

            const categories = await getCategoriesBy({ isActive: true })
            const orConditions = categories.map(cat => ({ [`${schemaKey(cat.name)}._id`]: targetItemId }));

            // Single MongoDB Aggregation Pipeline to fetch Package Item + Vendor + BankDetails
            const pipeline = [
                { $match: { $or: orConditions } },
                { $limit: 1 },
                {
                    $project: {
                        vendor: 1,
                        items: {
                            $concatArrays: categories.map(({ _id, name, slug }) => {
                                const key = schemaKey(name);
                                return {
                                    $map: {
                                        input: { $ifNull: [`$${key}`, []] },
                                        as: "item",
                                        in: {
                                            $mergeObjects: [
                                                "$$item",
                                                {
                                                    category_name: name,
                                                    category_slug: slug,
                                                    category_id: { $toString: _id }
                                                }
                                            ]
                                        }
                                    }
                                };
                            })
                        },
                    }
                },
                { $unwind: "$items" },
                {
                    $match: {
                        "items._id": targetItemId,
                        "items.isActive": { $ne: false }
                    }
                },
                // Stage 4: Lookup Vendor details + BankDetails for payout
                {
                    $lookup: {
                        from: 'vendors',
                        localField: 'vendor',
                        foreignField: '_id',
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    businessName: 1,
                                    ownerName: 1,
                                    isOperating: 1,
                                    isApproved: 1,
                                    bankDetails: 1
                                }
                            }
                        ],
                        as: 'vendorDoc'
                    }
                },
                { $unwind: "$vendorDoc" },
                // Stage 5: Final Clean Projection
                {
                    $project: {
                        _id: 0,
                        catalog_id: { $toString: "$_id" },
                        category_id: "$items.category_id",
                        category_slug: "$items.category_slug",
                        category_name: "$items.category_name",
                        item: {
                            id: { $toString: "$items._id" },
                            title: "$items.title",
                            photo: {
                                $ifNull: [
                                    { $arrayElemAt: ["$items.photos.url", 0] },
                                    { $arrayElemAt: ["$items.photos", 0] }
                                ]
                            },
                            pricing: "$items.pricing",
                            isActive: "$items.isActive"
                        },
                        business: {
                            id: { $toString: "$vendorDoc._id" },
                            businessName: "$vendorDoc.businessName",
                            ownerName: "$vendorDoc.ownerName",
                            isOperating: "$vendorDoc.isOperating",
                            bankDetails: "$vendorDoc.bankDetails"
                        }
                    }
                }
            ];

            const [result] = await Package.aggregate(pipeline).session(session);
            if (!result || !result.item) throw AppError.notFound(RESPONSE_MESSAGES.PACKAGE.NOT_FOUND);

            let category = result.category_slug;
            if (result.category_slug === 'bungee-jumping') {
                category = 'bungeeJumping';
            } else if (result.category_slug === 'chardham-tour') {
                category = 'chardhamTour';
            } else if (result.category_slug === 'bike-scooter-rental') {
                category = 'vehicleRental';
            }

            const itemDetails = result.item;
            const pricingRules = itemDetails.pricing
            const businessDetails = result.business;
            const bankDetails = businessDetails.bankDetails;

            const travellerProfile = await getUserById(userId, '', null, { session });
            if (!travellerProfile) throw AppError.notFound(RESPONSE_MESSAGES.USER.NOT_FOUND);

            let itemBaseprice = pricingRules.basePrice || 0;

            let itemGST = 0;
            if (pricingRules.gst) {
                itemGST = parseFloat(pricingRules.gst);
            } else if (pricingRules.gst !== undefined && pricingRules.gst !== null && pricingRules.gst !== '') {
                const taxKey = `tax_${category.replace(/-/g, '_')}`;
                itemGST = parseFloat(config.tax[taxKey] || 0);
            }

            let itemServiceTax = 0;
            if (pricingRules.serviceTax) {
                itemServiceTax = parseFloat(pricingRules.serviceTax);
            } else if (pricingRules.serviceTax === undefined || pricingRules.serviceTax === null || pricingRules.serviceTax == '') {
                itemServiceTax = parseFloat(config.tax.service_tax || 0);
            }

            const adultsCount = parseInt(body.adults) || 1;
            const childrenCount = parseInt(body.children) || 0;
            const isSelfIncluded = body.includeMe === 'true' || body.includeMe === true;
            const guestDetails = body.guestDetails || [];

            const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
            const totalNights = Math.max(1, Math.round(timeDiff / (1000 * 60 * 60 * 24)));
            const requestedUnits = parseInt(body.units) > 0 ? parseInt(body.units) : 1;

            let calculatedSubTotal = 0;
            let requiredUnits = requestedUnits;

            const STAY_CATEGORIES = ['homestay', 'hotel', 'camping'];
            const ACTIVITY_CATEGORIES = ['trekking', 'rafting', 'bungeeJumping', 'bungee-jumping'];
            const RENTAL_CATEGORIES = ['bike-scooter-rental', 'chardham-tour', 'vehicleRental', 'chardhamTour'];

            if (STAY_CATEGORIES.includes(category)) {
                if (category === 'homestay') {
                    requiredUnits = 1;
                } else {
                    const maxCapacityPerUnit = parseInt(pricingRules.maxAdults) > 0 ? parseInt(pricingRules.maxAdults) : 2;
                    requiredUnits = Math.max(requestedUnits, Math.ceil(adultsCount / maxCapacityPerUnit));
                }
                calculatedSubTotal = itemBaseprice * totalNights * requiredUnits;
            } else if (ACTIVITY_CATEGORIES.includes(category)) {
                const maxFreeChildren = parseInt(pricingRules.maxChildren) || 0;
                const childRate = pricingRules.childPrice || 0;
                const chargeableChildren = childrenCount > maxFreeChildren ? childrenCount - maxFreeChildren : 0;
                calculatedSubTotal = (itemBaseprice * adultsCount) + (childRate * chargeableChildren);
                requiredUnits = adultsCount + childrenCount;
            } else {
                const isRentalOrTour = RENTAL_CATEGORIES.includes(category);
                const durationMultiplier = isRentalOrTour ? totalNights : 1;
                calculatedSubTotal = itemBaseprice * requiredUnits * durationMultiplier;
            }

            const toCent = (num) => Math.round((Number(num) + Number.EPSILON) * 100) / 100;

            calculatedSubTotal = toCent(calculatedSubTotal);
            let d = pricingRules.discountType;
            let discountAmount = 0;
            if (d === "percentage") {
                discountAmount = calculatedSubTotal * ((pricingRules.discount || 0) / 100);
            } else if (d === "flat") {
                discountAmount = pricingRules.discount || 0;
            }

            const appliedDiscount = toCent(discountAmount);
            const taxableAmount = Math.max(0, toCent(calculatedSubTotal - appliedDiscount));

            let tax = 0;
            if (itemGST) tax = taxableAmount * (itemGST / 100);
            const calculatedTax = toCent(tax);

            let serviceFee = 0;
            if (itemServiceTax) {
                const baseServiceFee = taxableAmount * (itemServiceTax / 100);
                const gstOnServiceFee = baseServiceFee * ((config?.tax?.gst || 18) / 100);
                serviceFee = baseServiceFee + gstOnServiceFee;
            }
            const appliedServiceFee = toCent(serviceFee);

            const baseAmount = itemBaseprice || 0;
            const appliedCouponCode = null;
            const appliedCouponAmount = 0;
            const appliedTaxRate = itemGST || 0;
            const grandTotal = Math.max(0, toCent(calculatedSubTotal + calculatedTax + appliedServiceFee - appliedDiscount - appliedCouponAmount));

            // Inventory check
            const availabilityStatus = await InventoryService.checkAvailabilityRange(businessDetails.id, itemId, category, checkInDate, checkOutDate, requiredUnits);
            if (!availabilityStatus.available) throw AppError.badRequest(RESPONSE_MESSAGES.BOOKING.SLOTS_NOT_AVAILABLE);

            let newBooking;
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts) {
                try {
                    const bookingCode = generateBookingCode();
                    const [createdBooking] = await Booking.create([{
                        bookingCode,
                        user: userId,
                        vendor: businessDetails.id,
                        package: result.catalog_id,
                        item: {
                            itemId: itemDetails.id,
                            itemType: result.category_slug,
                            title: itemDetails.title,
                            url: itemDetails.photo
                        },
                        traveller: {
                            name: travellerProfile.name,
                            phone: travellerProfile.phone,
                            email: travellerProfile.email
                        },
                        startDate: checkInDate,
                        endDate: checkOutDate,
                        occupancy: {
                            adults: adultsCount,
                            children: childrenCount,
                            includeMe: isSelfIncluded,
                            guestDetails,
                            units: requiredUnits
                        },
                        pricing: {
                            basePrice: baseAmount,
                            subTotal: calculatedSubTotal,
                            discount: appliedDiscount,
                            coupon: appliedCouponCode,
                            couponAmount: Math.round(appliedCouponAmount),
                            taxRate: appliedTaxRate,
                            serviceFee: appliedServiceFee,
                            tax: calculatedTax,
                            total: grandTotal
                        },
                        payout: {
                            amount: 0,
                            bankDetails: {
                                accountHolderName: bankDetails?.accountHolderName || null,
                                accountNumber: bankDetails?.accountNumber || null,
                                ifscCode: bankDetails?.ifscCode || null,
                                bankName: bankDetails?.bankName || null,
                                razorpayContactId: bankDetails?.razorpayContactId || null,
                                razorpayFundAccountId: bankDetails?.razorpayFundAccountId || null
                            },
                            businessName: businessDetails.businessName,
                            ownerName: businessDetails.ownerName
                        },
                        status: BOOKING_STATUS.PENDING,
                        paymentStatus: PAYMENT_STATUS.UNPAID,
                        timeline: [{
                            status: 'Booking Initiated',
                            remarks: `Booking record ${bookingCode} created for ${requiredUnits} units. Awaiting payment.`,
                            actor: userId
                        }]
                    }], { session });

                    newBooking = createdBooking;
                    break;
                } catch (err) {
                    if (err.code === 11000 && err.message.includes('bookingCode')) {
                        attempts++;
                        if (attempts >= maxAttempts) {
                            throw AppError.internal('Unable to generate a unique booking code. Please try again.');
                        }
                    } else {
                        throw err;
                    }
                }
            }

            const finalCheck = await InventoryService.checkAvailabilityRange(businessDetails.id, itemId, category, checkInDate, checkOutDate, requiredUnits, session, newBooking._id);
            if (!finalCheck.available) throw AppError.conflict(`Inventory Conflict: Slots became unavailable.`);

            NotificationService.notifyBookingStatus(newBooking._id, 'created');

            const bookingObj = newBooking.toObject ? newBooking.toObject() : newBooking;
            bookingObj.user = travellerProfile;
            bookingObj.vendor = businessDetails;
            finalResponse = bookingPayload(bookingObj);
        });

        return finalResponse;
    } catch (error) {
        throw (error instanceof AppError ? error : AppError.badRequest(error.message || 'Booking failed'));
    } finally {
        session.endSession();
    }
}

export default { initiateBooking };