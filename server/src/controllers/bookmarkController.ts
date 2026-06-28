import { Response } from 'express';
import { Bookmark } from '../models/Bookmark';
import { AuthRequest } from '../types';

export const addBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const { resource, collection = 'default' } = req.body;

    const existing = await Bookmark.findOne({ user: req.user!._id, resource });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already bookmarked' });
    }

    const bookmark = await Bookmark.create({ user: req.user!._id, resource, collection });
    res.status(201).json({ success: true, bookmark });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const removeBookmark = async (req: AuthRequest, res: Response) => {
  try {
    await Bookmark.findOneAndDelete({ user: req.user!._id, resource: req.params.resourceId });
    res.json({ success: true, message: 'Bookmark removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const { collection } = req.query;
    const query: any = { user: req.user!._id };
    if (collection) query.collection = collection;

    const bookmarks = await Bookmark.find(query)
      .populate({ path: 'resource', populate: { path: 'uploadedBy', select: 'name avatar' } })
      .sort({ createdAt: -1 });

    const collections = await Bookmark.distinct('collection', { user: req.user!._id });

    res.json({ success: true, bookmarks, collections });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const { User } = require('../models/User');

    const topUploaders = await User.find()
      .sort({ uploadCount: -1 })
      .limit(20)
      .select('name avatar department uploadCount downloadCount');

    const topDownloaded = await (require('../models/Resource')).Resource.aggregate([
      { $match: { isActive: true, isApproved: true } },
      { $group: { _id: '$uploadedBy', totalDownloads: { $sum: '$downloads' }, resourceCount: { $sum: 1 } } },
      { $sort: { totalDownloads: -1 } },
      { $limit: 20 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', avatar: '$user.avatar', department: '$user.department', totalDownloads: 1, resourceCount: 1 } },
    ]);

    const topRated = await User.find({ averageRating: { $gt: 0 } })
      .sort({ averageRating: -1 })
      .limit(20)
      .select('name avatar department averageRating');

    res.json({ success: true, topUploaders, topDownloaded, topRated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
