import mongoose, { Schema, Model } from 'mongoose';
import { IResource } from '../types';

const resourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileType: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    subject: { type: String, required: true, trim: true },
    resourceType: {
      type: String,
      required: true,
      enum: ['notes', 'lab', 'assignment', 'question_paper', 'project_report', 'study_material', 'presentation', 'mini_project'],
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    author: { type: String, required: true, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ department: 1, semester: 1 });
resourceSchema.index({ subject: 1 });
resourceSchema.index({ resourceType: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ createdAt: -1 });
resourceSchema.index({ downloads: -1 });
resourceSchema.index({ averageRating: -1 });

export const Resource: Model<IResource> = mongoose.model<IResource>('Resource', resourceSchema);
