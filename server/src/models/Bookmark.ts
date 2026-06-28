import mongoose, { Schema, Model } from 'mongoose';
import { IBookmark } from '../types';

const bookmarkSchema = new Schema<IBookmark>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
    collection: { type: String, default: 'default', trim: true },
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, resource: 1 }, { unique: true });
bookmarkSchema.index({ user: 1, collection: 1 });

export const Bookmark: Model<IBookmark> = mongoose.model<IBookmark>('Bookmark', bookmarkSchema);
