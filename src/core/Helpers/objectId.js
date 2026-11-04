import mongoose from 'mongoose';

/**
 * Safely converts a string ID to a mongoose.Types.ObjectId.
 * Returns null if the ID is missing or invalid.
 *
 * @param {string|mongoose.Types.ObjectId} id
 * @returns {mongoose.Types.ObjectId|null}
 */
export const toObjectId = (id) => {
    if (id && mongoose.Types.ObjectId.isValid(id)) return new mongoose.Types.ObjectId(id);
    return null;
};

toObjectId.toObjectId = toObjectId;

export default toObjectId;
