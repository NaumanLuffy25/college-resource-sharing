import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  Bookmark,
  BookmarkCheck,
  Eye,
  Calendar,
  User,
  FileText,
  ArrowLeft,
  Tag,
  Send,
  Star,
  Info,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { resourceAPI, bookmarkAPI } from '../api';
import { Resource, Review } from '../types';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Skeleton, StarRating } from '../components/ui';
import {
  formatFileSize,
  formatDate,
  formatNumber,
  getResourceTypeLabel,
  getDepartmentColor,
} from '../utils';

const getFileTypeIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('docx')) return '📝';
  if (fileType.includes('presentation') || fileType.includes('pptx')) return '📊';
  if (fileType.includes('zip')) return '📦';
  if (fileType.includes('image')) return '🖼️';
  return '📁';
};

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [resource, setResource] = useState<Resource | null>(null);
  const [similarResources, setSimilarResources] = useState<Resource[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchResource = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [res, similarRes] = await Promise.all([
        resourceAPI.getById(id),
        resourceAPI.getSimilar(id).catch(() => ({ data: { data: [] } })),
      ]);
      setResource(res.data.data);
      setSimilarResources(similarRes.data.data || []);
      if (user) {
        setIsBookmarked(user.bookmarks?.includes(id) || false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load resource');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  const handleDownload = async () => {
    if (!id) return;
    try {
      setDownloadLoading(true);
      const res = await resourceAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resource?.fileName || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      if (resource) {
        setResource({ ...resource, downloads: resource.downloads + 1 });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Download failed');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!id) return;
    try {
      if (isBookmarked) {
        await bookmarkAPI.remove(id);
      } else {
        await bookmarkAPI.add({ resourceId: id });
      }
      setIsBookmarked(!isBookmarked);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Bookmark action failed');
    }
  };

  const handleSubmitReview = async () => {
    if (!id || !rating) return;
    try {
      setSubmittingReview(true);
      await resourceAPI.addReview(id, { rating, comment });
      setRating(0);
      setComment('');
      setReviewSuccess('Review submitted successfully!');
      fetchResource();
      setTimeout(() => setReviewSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Resource not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Link to="/resources">
            <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!resource) return null;

  const reviews: Review[] = (resource as any).reviews || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {reviewSuccess && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
            {reviewSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl">
                  {getFileTypeIcon(resource.fileType)}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {resource.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getDepartmentColor(resource.department)}`}>
                      {resource.department}
                    </span>
                    <Badge variant="primary">{getResourceTypeLabel(resource.resourceType)}</Badge>
                    <Badge>Semester {resource.semester}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {resource.subject}
                  </p>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {resource.description}
                </p>
              </div>

              {resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {resource.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{resource.totalRatings} ratings</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Download className="h-4 w-4 text-gray-400" />
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatNumber(resource.downloads)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Downloads</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatNumber(resource.views)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {formatDate(resource.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded</p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {user && (
                  <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Leave a review
                    </p>
                    <div className="mb-3">
                      <StarRating rating={rating} onRate={setRating} size="lg" />
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this resource..."
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none mb-3"
                      rows={3}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSubmitReview}
                      disabled={!rating}
                      isLoading={submittingReview}
                      icon={<Send className="h-4 w-4" />}
                    >
                      Submit Review
                    </Button>
                  </div>
                )}

                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                    <Star className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="p-4 rounded-xl border border-gray-100 dark:border-gray-800"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {review.user?.name || 'Anonymous'}
                              </span>
                              <StarRating rating={review.rating} readonly size="sm" />
                              <span className="text-xs text-gray-400">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleDownload}
                  isLoading={downloadLoading}
                  icon={<Download className="h-5 w-5" />}
                >
                  Download File
                </Button>
                <Button
                  variant={isBookmarked ? 'outline' : 'secondary'}
                  size="lg"
                  className="w-full"
                  onClick={handleBookmark}
                  icon={isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                >
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  File Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">File Name</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium truncate ml-2 max-w-[180px]">
                      {resource.fileName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">File Size</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {formatFileSize(resource.fileSize)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">File Type</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium uppercase">
                      {resource.fileType.split('/').pop()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Author
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {resource.author}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {typeof resource.uploadedBy === 'object'
                        ? (resource.uploadedBy as any)?.department
                        : ''}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {similarResources.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Similar Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarResources.slice(0, 3).map((r) => (
                <Link key={r._id} to={`/resources/${r._id}`}>
                  <Card hover className="h-full">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getFileTypeIcon(r.fileType)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {r.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {r.author} &middot; {getResourceTypeLabel(r.resourceType)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {r.averageRating?.toFixed(1) || '0.0'}
                          </span>
                          <span className="text-xs text-gray-400">|</span>
                          <Download className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {formatNumber(r.downloads)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetail;
