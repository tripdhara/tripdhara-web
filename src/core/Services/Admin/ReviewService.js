import Review from '@/core/Models/Review.js';
import Vendor from '@/core/Models/Vendor.js';
import AuditService from '@/core/Services/Admin/AuditService.js';
import AppError from '@/core/Helpers/AppError.js';
import { getReviewsBy, updateById, deleteById } from '@/core/Helpers/queryHelpers.js';
import mongoose from 'mongoose';

/**
 * ReviewService (Admin Role)
 * Administration of user feedback, system-wide ratings, and service testimonials.
 */
class ReviewService {
  async getAllReviews(filter = {}) {
    const query = {};
    if (filter.vendor) {
      if (mongoose.Types.ObjectId.isValid(filter.vendor)) {
        const vendorIdObj = new mongoose.Types.ObjectId(filter.vendor);
        const vendorDoc = await Vendor.findOne({
          $or: [
            { _id: vendorIdObj },
            { user: vendorIdObj }
          ]
        }).select('_id').lean();
        query.vendor = vendorDoc ? vendorDoc._id : vendorIdObj;
      } else {
        query.vendor = filter.vendor;
      }
    }

    return await getReviewsBy(
      query,
      '',
      [
        { path: 'user', select: 'name email phone avatar' },
        { path: 'vendor', select: 'businessName ownerName' },
        { path: 'booking', select: 'bookingCode' }
      ],
      { createdAt: -1 }
    );
  }

  async toggleReviewVisibility(reviewId, isVisible, req = null) {
    const review = await updateById(Review, reviewId, { isVisible });
    if (!review) throw new AppError('Review not found', 404);
    if (req && req.user) {
      await AuditService.logAction(req.user.id, 'UPDATE_VISIBILITY', 'REVIEW', reviewId, { isVisible }, req);
    }
    return review;
  }

  async deleteReview(reviewId, req = null) {
    const review = await deleteById(Review, reviewId);
    if (!review) throw new AppError('Review not found', 404);
    if (req && req.user) await AuditService.logAction(req.user.id, 'DELETE', 'REVIEW', reviewId, {}, req);
    return review;
  }
}

export default new ReviewService();
