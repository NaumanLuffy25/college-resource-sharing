import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  department: string;
  semester: number;
  role: 'student' | 'moderator' | 'admin';
  interests: string[];
  uploadCount: number;
  downloadCount: number;
  bookmarks: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IResource extends Document {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  department: string;
  semester: number;
  subject: string;
  resourceType: 'notes' | 'lab' | 'assignment' | 'question_paper' | 'project_report' | 'study_material' | 'presentation' | 'mini_project';
  tags: string[];
  author: string;
  uploadedBy: string;
  downloads: number;
  views: number;
  averageRating: number;
  totalRatings: number;
  isApproved: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview extends Document {
  _id: string;
  resource: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookmark extends Document {
  _id: string;
  user: string;
  resource: string;
  collection: string;
  createdAt: Date;
}

export interface IDownload extends Document {
  _id: string;
  user: string;
  resource: string;
  downloadedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}
