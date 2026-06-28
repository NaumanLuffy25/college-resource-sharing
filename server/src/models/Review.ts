import mongoose, { Schema, Model } from 'mongoose';
import { IReview } from '../types';

const reviewSchema = new Schema<IReview>(
  {
    resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

reviewSchema.index({ resource: 1, user: 1 }, { unique: true });
reviewSchema.index({ resource: 1 });
reviewSchema.index({ user: 1 });

export const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);
