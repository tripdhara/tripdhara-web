import mongoose from 'mongoose';
import { DEFAULTS } from '../Constants/index.js';

const AuditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: DEFAULTS.TRUE },
    action: { type: String, required: DEFAULTS.TRUE, uppercase: DEFAULTS.TRUE, trim: DEFAULTS.TRUE },
    target: { type: String, required: DEFAULTS.TRUE, uppercase: DEFAULTS.TRUE, trim: DEFAULTS.TRUE },
    targetId: { type: String },
    details: { type: mongoose.Schema.Types.Mixed, default: DEFAULTS.NULL },
    ipAddress: { type: String },
    ipLocation: {
        city: { type: String, default: DEFAULTS.NULL },
        region: { type: String, default: DEFAULTS.NULL },
        country: { type: String, default: DEFAULTS.NULL },
        countryCode: { type: String, default: DEFAULTS.NULL },
        isp: { type: String, default: DEFAULTS.NULL },
        asn: { type: String, default: DEFAULTS.NULL },
        summary: { type: String, default: DEFAULTS.NULL }
    },
    device: { type: mongoose.Schema.Types.Mixed, default: DEFAULTS.NULL },
    userAgent: { type: String },
    previousState: { type: mongoose.Schema.Types.Mixed, default: DEFAULTS.NULL },
    newState: { type: mongoose.Schema.Types.Mixed, default: DEFAULTS.NULL },
    diff: [{
        field: { type: String },
        old: { type: mongoose.Schema.Types.Mixed },
        new: { type: mongoose.Schema.Types.Mixed }
    }],
    security: {
        threatScore: { type: Number, default: 0 },
        riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
        isProxyOrHosting: { type: Boolean, default: false },
        riskFlags: [{ type: String }],
        anomaly: { type: mongoose.Schema.Types.Mixed, default: DEFAULTS.NULL }
    },
    isRolledBack: { type: Boolean, default: false },
    rolledBackAt: { type: Date, default: DEFAULTS.NULL },
    rolledBackBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: DEFAULTS.NULL }
}, {
    timestamps: DEFAULTS.TRUE,
    toJSON: { virtuals: DEFAULTS.TRUE, getters: DEFAULTS.TRUE, minimize: DEFAULTS.FALSE },
    toObject: { virtuals: DEFAULTS.TRUE, getters: DEFAULTS.TRUE, minimize: DEFAULTS.FALSE }
});

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ action: 1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
