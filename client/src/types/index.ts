export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  semester: number;
  role: 'student' | 'moderator' | 'admin';
  interests: string[];
  uploadCount: number;
  downloadCount: number;
  bookmarks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
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
  resourceType: string;
  tags: string[];
  author: string;
  uploadedBy: User | string;
  downloads: number;
  views: number;
  averageRating: number;
  totalRatings: number;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  trendingScore?: number;
}

export interface Review {
  _id: string;
  resource: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  _id: string;
  user: string;
  resource: Resource;
  collection: string;
  createdAt: string;
}

export interface DashboardStats {
  uploadCount: number;
  totalDownloads: number;
  bookmarkCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalResources: number;
  totalDownloads: number;
  pendingApprovals: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  resources?: T[];
  total: number;
  page: number;
  pages: number;
}
