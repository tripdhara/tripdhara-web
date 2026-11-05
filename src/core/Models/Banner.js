import mongoose from 'mongoose';
import { DEFAULTS } from '../Constants/index.js';

const BannerSchema = new mongoose.Schema({
  title: { type: String, trim: DEFAULTS.TRUE },
  imageUrl: { type: String, required: DEFAULTS.TRUE },
  link: { type: String, default: DEFAULTS.NULL },
  position: { type: Number, default: 0 },
  isActive: { type: Boolean, default: DEFAULTS.TRUE }
}, {
  timestamps: DEFAULTS.TRUE,
  toJSON: { virtuals: DEFAULTS.TRUE, getters: DEFAULTS.TRUE, minimize: DEFAULTS.FALSE },
  toObject: { virtuals: DEFAULTS.TRUE, getters: DEFAULTS.TRUE, minimize: DEFAULTS.FALSE }
});

// Compound index for active banners ordered by position
BannerSchema.index({ isActive: 1, position: 1 });

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
