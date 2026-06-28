import mongoose, { Schema, Model } from 'mongoose';
import { IDownload } from '../types';

const downloadSchema = new Schema<IDownload>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

downloadSchema.index({ user: 1 });
downloadSchema.index({ resource: 1 });
downloadSchema.index({ downloadedAt: -1 });

export const Download: Model<IDownload> = mongoose.model<IDownload>('Download', downloadSchema);
