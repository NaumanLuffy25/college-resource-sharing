import { Response } from 'express';
import { Resource } from '../models/Resource';
import { Review } from '../models/Review';
import { Download } from '../models/Download';
import { User } from '../models/User';
import { Bookmark } from '../models/Bookmark';
import { AuthRequest } from '../types';
import { RecommendationService } from '../services/recommendationService';

export const uploadResource = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { title, description, department, semester, subject, resourceType, tags, author } = req.body;

    const resource = await Resource.create({
      title,
      description,
      fileUrl: `/uploads/resources/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      department,
      semester: parseInt(semester),
      subject,
      resourceType,
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : tags) : [],
      author,
      uploadedBy: req.user!._id,
      isApproved: req.user!.role === 'admin' || req.user!.role === 'moderator',
    });

    await User.findByIdAndUpdate(req.user!._id, { $inc: { uploadCount: 1 } });

    res.status(201).json({ success: true, resource });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getResources = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1, limit = 12, search, department, semester, subject,
      resourceType, fileType, sortBy = 'createdAt', order = 'desc',
      minRating, tags,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = { isActive: true, isApproved: true };

    if (search) {
      query.$text = { $search: search as string };
    }
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester as string);
    if (subject) query.subject = subject;
    if (resourceType) query.resourceType = resourceType;
    if (fileType) query.fileType = { $regex: fileType, $options: 'i' };
    if (minRating) query.averageRating = { $gte: parseFloat(minRating as string) };
    if (tags) query.tags = { $in: (tags as string).split(',').map((t: string) => t.trim().toLowerCase()) };

    const sort: any = {};
    sort[sortBy as string] = order === 'desc' ? -1 : 1;

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name avatar department')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Resource.countDocuments(query);

    res.json({
      success: true,
      resources,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getResourceById = async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name avatar department uploadCount');

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    await Resource.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    const reviews = await Review.find({ resource: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const isBookmarked = req.user
      ? !!(await Bookmark.findOne({ user: req.user._id, resource: req.params.id }))
      : false;

    res.json({ success: true, resource, reviews, isBookmarked });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const updateResource = async (req: AuthRequest, res: Response) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.uploadedBy.toString() !== req.user!._id.toString() && req.user!.role === 'student') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this resource' });
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, resource });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const deleteResource = async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.uploadedBy.toString() !== req.user!._id.toString() && req.user!.role === 'student') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndUpdate(req.params.id, { isActive: false });
    await User.findByIdAndUpdate(resource.uploadedBy, { $inc: { uploadCount: -1 } });

    res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const downloadResource = async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (!resource.isApproved) {
      return res.status(403).json({ success: false, message: 'Resource not yet approved' });
    }

    await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
    await User.findByIdAndUpdate(resource.uploadedBy, { $inc: { downloadCount: 1 } });

    await Download.create({ user: req.user!._id, resource: req.params.id });

    const filePath = require('path').join(__dirname, '../..', resource.fileUrl);
    res.download(filePath, resource.fileName);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const resourceId = req.params.id;

    const existingReview = await Review.findOne({ resource: resourceId, user: req.user!._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this resource' });
    }

    const review = await Review.create({
      resource: resourceId,
      user: req.user!._id,
      rating: parseInt(rating),
      comment,
    });

    const allReviews = await Review.find({ resource: resourceId });
    const avgRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;

    await Resource.findByIdAndUpdate(resourceId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalRatings: allReviews.length,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({ success: true, review: populatedReview });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getMyResources = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const resources = await Resource.find({ uploadedBy: req.user!._id, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments({ uploadedBy: req.user!._id, isActive: true });

    res.json({ success: true, resources, total, page, pages: Math.ceil(total / limit) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const recommendations = await RecommendationService.getPersonalizedRecommendations(req.user!._id, 10);
    res.json({ success: true, recommendations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getSimilarResources = async (req: AuthRequest, res: Response) => {
  try {
    const similar = await RecommendationService.getSimilarResources(req.params.id, 6);
    res.json({ success: true, similar });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getTrending = async (req: AuthRequest, res: Response) => {
  try {
    const trending = await RecommendationService.getTrendingResources(10);
    res.json({ success: true, trending });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const [uploadCount, totalDownloads, bookmarkCount, recentResources, recentDownloads] = await Promise.all([
      Resource.countDocuments({ uploadedBy: userId, isActive: true }),
      Download.countDocuments({ user: userId }),
      Bookmark.countDocuments({ user: userId }),
      Resource.find({ uploadedBy: userId, isActive: true }).sort({ createdAt: -1 }).limit(5),
      Download.find({ user: userId }).populate('resource', 'title fileType').sort({ downloadedAt: -1 }).limit(5),
    ]);

    const downloadStats = await Download.aggregate([
      { $match: { user: userId } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$downloadedAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    res.json({
      success: true,
      stats: { uploadCount, totalDownloads, bookmarkCount },
      recentResources,
      recentDownloads,
      downloadStats,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const approveResource = async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({ success: true, resource });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getPendingResources = async (req: AuthRequest, res: Response) => {
  try {
    const resources = await Resource.find({ isApproved: false, isActive: true })
      .populate('uploadedBy', 'name email department')
      .sort({ createdAt: -1 });

    res.json({ success: true, resources });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalResources, totalDownloads, pendingApprovals] = await Promise.all([
      User.countDocuments(),
      Resource.countDocuments({ isActive: true }),
      Download.countDocuments(),
      Resource.countDocuments({ isApproved: false, isActive: true }),
    ]);

    const departmentStats = await Resource.aggregate([
      { $match: { isActive: true, isApproved: true } },
      { $group: { _id: '$department', count: { $sum: 1 }, downloads: { $sum: '$downloads' } } },
      { $sort: { count: -1 } },
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const topContributors = await User.find().sort({ uploadCount: -1 }).limit(10);

    const dailyUploads = await Resource.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalResources, totalDownloads, pendingApprovals },
      departmentStats,
      recentUsers,
      topContributors,
      dailyUploads,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
