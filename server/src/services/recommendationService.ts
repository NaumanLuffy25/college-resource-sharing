import { Resource } from '../models/Resource';
import { Download } from '../models/Download';
import { Review } from '../models/Review';
import { User } from '../models/User';

export class RecommendationService {
  static async getPersonalizedRecommendations(userId: string, limit: number = 10) {
    const user = await User.findById(userId);
    if (!user) return [];

    const downloadHistory = await Download.find({ user: userId }).populate('resource');
    const downloadedResourceIds = downloadHistory.map((d: any) => d.resource?._id).filter(Boolean);
    const downloadedResources = downloadHistory.map((d: any) => d.resource).filter(Boolean);

    const userDepartments = [...new Set(downloadedResources.map((r: any) => r.department))];
    const userSubjects = [...new Set(downloadedResources.map((r: any) => r.subject))];
    const userTags = [...new Set(downloadedResources.flatMap((r: any) => r.tags || []))];
    const userTypes = [...new Set(downloadedResources.map((r: any) => r.resourceType))];

    const tagScoreQuery = userTags.length > 0 ? [
      { $match: { _id: { $nin: downloadedResourceIds }, isActive: true, isApproved: true } },
      { $addFields: { tagMatches: { $size: { $setIntersection: ['$tags', userTags] } } } },
      { $match: { tagMatches: { $gt: 0 } } },
      { $sort: { tagMatches: -1, averageRating: -1, downloads: -1 } },
      { $limit: limit },
    ] : [];

    const tagBased = tagScoreQuery.length > 0 ? await Resource.aggregate(tagScoreQuery) : [];

    const subjectBased = await Resource.find({
      _id: { $nin: [...downloadedResourceIds, ...tagBased.map((r: any) => r._id)] },
      subject: { $in: userSubjects },
      isActive: true,
      isApproved: true,
    })
      .sort({ averageRating: -1, downloads: -1 })
      .limit(Math.ceil(limit / 3));

    const deptBased = await Resource.find({
      _id: { $nin: [...downloadedResourceIds, ...tagBased.map((r: any) => r._id), ...subjectBased.map((r: any) => r._id)] },
      department: { $in: userDepartments.length > 0 ? userDepartments : [user.department] },
      isActive: true,
      isApproved: true,
    })
      .sort({ averageRating: -1, downloads: -1 })
      .limit(Math.ceil(limit / 4));

    const popular = await Resource.find({
      _id: { $nin: [...downloadedResourceIds, ...tagBased.map((r: any) => r._id), ...subjectBased.map((r: any) => r._id), ...deptBased.map((r: any) => r._id)] },
      isActive: true,
      isApproved: true,
    })
      .sort({ downloads: -1, views: -1 })
      .limit(limit - tagBased.length - subjectBased.length - deptBased.length);

    const allRecommendations = [...tagBased, ...subjectBased, ...deptBased, ...popular];
    const uniqueRecommendations = allRecommendations.filter(
      (r: any, i: number, arr: any[]) => arr.findIndex((x: any) => x._id.toString() === r._id.toString()) === i
    );

    return uniqueRecommendations.slice(0, limit);
  }

  static async getSimilarResources(resourceId: string, limit: number = 6) {
    const resource = await Resource.findById(resourceId);
    if (!resource) return [];

    const similar = await Resource.find({
      _id: { $ne: resourceId },
      isActive: true,
      isApproved: true,
      $or: [
        { subject: resource.subject },
        { tags: { $in: resource.tags } },
        { department: resource.department, semester: resource.semester },
      ],
    })
      .sort({ averageRating: -1, downloads: -1 })
      .limit(limit);

    return similar;
  }

  static async getTrendingResources(limit: number = 10) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const trending = await Resource.aggregate([
      { $match: { isActive: true, isApproved: true, createdAt: { $gte: oneWeekAgo } } },
      {
        $addFields: {
          trendingScore: {
            $add: [
              { $multiply: ['$downloads', 2] },
              { $multiply: ['$views', 0.5] },
              { $multiply: ['$averageRating', 20] },
            ],
          },
        },
      },
      { $sort: { trendingScore: -1 } },
      { $limit: limit },
    ]);

    if (trending.length < limit) {
      const additional = await Resource.find({
        _id: { $nin: trending.map((r: any) => r._id) },
        isActive: true,
        isApproved: true,
      })
        .sort({ downloads: -1, averageRating: -1 })
        .limit(limit - trending.length);

      trending.push(...additional);
    }

    return trending.slice(0, limit);
  }

  static async getTopRatedResources(limit: number = 10) {
    return Resource.find({ isActive: true, isApproved: true, totalRatings: { $gte: 3 } })
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(limit);
  }

  static async getMostDownloadedResources(limit: number = 10) {
    return Resource.find({ isActive: true, isApproved: true })
      .sort({ downloads: -1 })
      .limit(limit);
  }
}
