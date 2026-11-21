import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['site', 'service', 'product'], default: 'site' },
    targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
    targetName: { type: String, default: '' },
    rating: { type: Number, required: [true, 'Please choose a rating.'], min: 1, max: 5 },
    comment: { type: String, required: [true, 'Please write a short review.'], trim: true, maxlength: 1000 },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
