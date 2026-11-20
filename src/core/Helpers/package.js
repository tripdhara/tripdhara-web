import Vendor from '@/core/Models/Vendor.js';
import Package from '@/core/Models/Package.js';
import InventoryService from '@/core/Services/Vendor/InventoryService.js';
import { CATEGORY_MAP, SCHEMA_KEYS } from '@/core/Constants/categories.js';
import { RESPONSE_MESSAGES } from '@/core/Constants/index.js';
import { slugify } from './stringUtils.js';
import { sellingPrice } from './sellingPrice.js';
import { mapToGeoJSON } from './geoUtils.js';
import { uploadToCloudinary } from './cloudinary.js';
import AppError from '@/core/Helpers/AppError.js';
import { notifyIndexNow } from './indexNow.js';
import { getLocationPoint } from './addressHelper.js';
import { getLogger } from '@/core/Lib/logger.js';
import { getPackageBy, getBusinessById, getBusinessByUserId } from './queryHelpers.js';

/**
 * Recursively flattens nested objects into dot notation for partial Mongoose subdocument updates.
 * @param {Object} obj - Nested object to flatten
 * @param {string} prefix - Key prefix
 * @returns {Object} Flattened object with dot-notation keys
 */
export function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (obj[k] !== null && typeof obj[k] === 'object' && obj[k].constructor === Object) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}

/**
 * Processes photo inputs, uploading files/buffers to Cloudinary or formatting URL objects.
 * @param {Array|Object|string} photos - Photo input(s)
 * @param {string} uploadPath - Cloudinary folder path
 * @returns {Promise<Array>} Standardized photo array
 */
export async function processItemPhotos(photos, uploadPath) {
    if (!photos) return [];
    const photoArray = Array.isArray(photos) ? photos : [photos];
    const uploadResults = [];

    for (const photo of photoArray) {
        if (photo && typeof photo === 'object' && (photo instanceof File || photo.size > 0)) {
            try {
                const uploaded = await uploadToCloudinary(photo, uploadPath);
                uploadResults.push({ url: uploaded.url, type: 'image' });
            } catch (err) {
                getLogger().error({ err }, '[MEDIA_UPLOAD] Image upload failed');
            }
        } else if (typeof photo === 'object' && photo.url) {
            uploadResults.push(photo);
        } else if (typeof photo === 'string' && photo.startsWith('http')) {
            uploadResults.push({ url: photo, type: 'image' });
        }
    }

    return uploadResults;
}

/**
 * Finds or initializes a vendor's package catalog document.
 * @param {string} userId - User ID
 * @param {string} vendorId - Vendor ID
 * @param {boolean} [lean=false] - Whether to return a lean JS object
 * @returns {Promise<Object>} Package catalog document or object
 */
export async function findOrCreateCatalog(userId, vendorId, lean = false) {
    if (!userId || !vendorId) throw AppError.badRequest(RESPONSE_MESSAGES.VALIDATION.REQUIRED_FIELDS);
    let pkg = lean ? await getPackageBy({ user: userId, vendor: vendorId }) : await Package.findOne({ user: userId, vendor: vendorId });
    if (!pkg) {
        const initialData = { user: userId, vendor: vendorId };
        Object.values(SCHEMA_KEYS).forEach(key => { initialData[key] = []; });
        const createdPkg = await Package.create(initialData);
        pkg = lean ? (createdPkg.toObject ? createdPkg.toObject() : createdPkg) : createdPkg;
    }
    return pkg;
}

/**
 * Unified item helper to handle authorization, catalog retrieval, photo upload,
 * creation or update, pricing/location formatting, saving, and inventory initialization.
 *
 * @param {string} userId - User ID of the vendor
 * @param {string} businessId - Business/Vendor ID
 * @param {string} category - Service/item category slug
 * @param {Object} itemDataOrUpdates - Body payload or updates
 * @param {string|null} itemId - Item ID (null for creation, string for updates)
 * @returns {Promise<Object>} Formatted saved item
 */

export async function item(userId, category, payload, itemId = null) {
    const business = await getBusinessByUserId(userId, 'category');
    if (!business) throw AppError.notFound(RESPONSE_MESSAGES.VENDOR.NOT_FOUND);

    const vendorCategory = business.category?.find(c => c.slug === category);
    if (!vendorCategory) throw AppError.forbidden(RESPONSE_MESSAGES.VENDOR.UNAUTHORIZED_CATEGORY);

    const businessId = business._id.toString();

    const schemaKey = CATEGORY_MAP[category];
    if (!schemaKey) throw AppError.badRequest(RESPONSE_MESSAGES.CATEGORY.INVALID);

    let pkg = await getPackageBy({ user: userId, vendor: businessId }, '', null, { lean: false });
    if (!pkg) pkg = await Package.create({ user: userId, vendor: businessId });

    if (payload.photos) payload.photos = payload.photos.map(p => p.url ? p : { url: p });

    let itemDoc;

    if (itemId) {
        itemDoc = pkg[schemaKey].id(itemId);
        if (!itemDoc) throw AppError.notFound(RESPONSE_MESSAGES.ITEM.NOT_FOUND);

        if (payload.pricing) payload.pricing = await sellingPrice(payload.pricing, category, itemDoc.pricing);

        const flatUpdates = flattenObject(payload);
        Object.entries(flatUpdates).forEach(([key, val]) => itemDoc.set(key, val));
    } else {
        if (payload.pricing) payload.pricing = await sellingPrice(payload.pricing, category);
        itemDoc = pkg[schemaKey].create(payload);
        pkg[schemaKey].push(itemDoc);
    }

    // 5. Apply Pre-save Formatting
    if (itemDoc.title) itemDoc.slug = slugify(itemDoc.title);
    if (itemDoc.location) mapToGeoJSON(itemDoc.location);
    if (itemDoc.details && itemDoc.details.startPoint) mapToGeoJSON(itemDoc.details.startPoint);
    if (itemDoc.details && itemDoc.details.endPoint) mapToGeoJSON(itemDoc.details.endPoint);

    await pkg.save();

    const savedItem = pkg[schemaKey].id(itemDoc._id);

    if (!itemId && savedItem) await InventoryService.initializeFromItem(businessId, savedItem._id, schemaKey);

    notifyIndexNow([`https://tripdhara.in/packages/${savedItem._id}`]).catch(() => { });
    const base = normalizePackageItem(savedItem);
    return {
        ...base,
        availability: savedItem.availability,
        category_id: vendorCategory._id.toString(),
        category_name: vendorCategory.name,
        category_slug: vendorCategory.slug
    };
}

/**
 * Core helper to normalize common package item properties (DRY single source of truth).
 */

export function normalizePackageItem(item, reviews = []) {
    if (!item) return null;
    const reviewList = reviews.length ? reviews : (item.reviews ?? []);
    let rating = item.rating ?? { average: 0, count: 0 };
    if (reviewList.length) {
        const totalRating = reviewList.reduce((acc, r) => acc + Number(r.rating), 0);
        rating = {
            average: Math.round((totalRating / reviewList.length) * 10) / 10,
            count: reviewList.length
        };
    }

    return {
        id: item._id?.toString(),
        title: item.title,
        slug: item.slug,
        isActive: Boolean(item.isActive),
        pricing: {
            basePrice: item.pricing?.basePrice,
            gst: item.pricing?.gst,
            sellingPrice: item.pricing?.sellingPrice
        },
        address: item.location?.address,
        location: getLocationPoint(item.location),
        image: item.photos?.[0]?.url,
        rating,
        reviews: reviewList
    };
}

/**
 * Formats package items grouped by schema keys.
 */
export function itemsFormate(packages) {
    const items = {};
    if (!packages) return items;
    Object.values(SCHEMA_KEYS).forEach(key => {
        const catItems = packages[key];
        items[key] = Array.isArray(catItems) ? catItems.map(item => vendorPackageItem(item)) : [];
    });
    return items;
}

/**
 * Formats a raw package item into standardized public API response shape with wishlist indicator.
 * @param {Object} item - Package item object
 * @param {Map} wishlistMap - Map of user wishlisted item IDs
 * @param {Array} reviews - Optional reviews array
 * @returns {Object} Standardized package item output
 */
export function formatPackageItem(item, wishlistMap = new Map(), reviews = []) {
    const base = normalizePackageItem(item, reviews);

    if (!base) return null;

    const { itemObj, id, title, pricing, address, location, image, rating, reviews: reviewList } = base;
    const isWishlisted = id ? wishlistMap.has(id) : false;
    const categoryId = (itemObj.categoryId || itemObj.category_id || itemObj.catalogId)?.toString() || '';
    return {
        id,
        title,
        categoryName: itemObj.categoryName || itemObj.category || itemObj.category_name || '',
        categoryId,
        pricing,
        address,
        location,
        image: itemObj.photos?.[0]?.url || itemObj.photos?.url || '',
        rating,
        // reviews: reviewList,
        wishlist: isWishlisted
    };
}

/**
 * Formats a raw vendor catalog item into standardized vendor API response shape.
 * @param {Object} item - Vendor package item (Mongoose doc or object)
 * @param {string} [categorySlug=''] - Category slug
 * @param {Array} [vendorCategories=[]] - Vendor categories array from Vendor model
 * @returns {Object} Standardized vendor package item
 */
export function vendorPackagePayload(item, categorySlug = '', vendorCategories = []) {
    const base = normalizePackageItem(item);
    if (!base) return null;

    const { id, title, slug, isActive, pricing, address, location, image } = base;
    const category = vendorCategories.find(c => c.slug === categorySlug) || {};

    return {
        id,
        title,
        slug,
        isActive,
        pricing,
        address,
        location,
        image,
        category: {
            id: category._id?.toString() || '',
            name: category.name || categorySlug,
            slug: categorySlug
        }
    };
}

/**
 * Formats a single vendor package item response with calculated rating & reviews.
 */
export function vendorPackageItem(item, reviews = []) {
    const base = normalizePackageItem(item, reviews);
    if (!base) return null;

    const { itemObj, address, location, rating, reviews: reviewList } = base;

    return {
        ...itemObj,
        address,
        location,
        rating,
        reviews: reviewList
    };
}
