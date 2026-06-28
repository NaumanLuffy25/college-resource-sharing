import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  BookOpen,
  Download,
  Bookmark,
  TrendingUp,
  Clock,
  ArrowUpRight,
  FileText,
  BarChart3,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { resourceAPI } from '../api';
import { Resource, DashboardStats } from '../types';
import { Card, CardHeader, CardTitle, CardContent, Button, Skeleton, StatCardSkeleton } from '../components/ui';
import { formatFileSize, formatDate, formatNumber, getResourceTypeLabel, getDepartmentColor } from '../utils';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUploads, setRecentUploads] = useState<Resource[]>([]);
  const [recentDownloads, setRecentDownloads] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, uploadsRes] = await Promise.all([
          resourceAPI.getDashboardStats(),
          resourceAPI.getMyResources({ limit: 5, sort: '-createdAt' }),
        ]);
        setStats(statsRes.data.data);
        setRecentUploads(uploadsRes.data.resources || uploadsRes.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = stats
    ? [
        { label: 'My Uploads', value: stats.uploadCount, icon: Upload, color: 'bg-blue-500' },
        { label: 'Total Downloads', value: stats.totalDownloads, icon: Download, color: 'bg-emerald-500' },
        { label: 'Bookmarks', value: stats.bookmarkCount, icon: Bookmark, color: 'bg-amber-500' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Here&apos;s an overview of your academic resources.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
            : statCards.map((stat) => (
                <Card key={stat.label} hover className="relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {formatNumber(stat.value)}
                      </p>
                    </div>
                    <div className={`rounded-xl p-3 ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </Card>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Uploads</CardTitle>
                  <Link to="/my-resources">
                    <Button variant="ghost" size="sm">
                      View all <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-40 w-full" />
                ) : recentUploads.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No uploads yet</p>
                    <Link to="/upload">
                      <Button variant="outline" size="sm" className="mt-3">
                        Upload your first resource
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentUploads.map((resource) => (
                      <Link
                        key={resource._id}
                        to={`/resources/${resource._id}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {resource.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {getResourceTypeLabel(resource.resourceType)} &middot; {formatDate(resource.createdAt)}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDepartmentColor(resource.department)}`}>
                          {resource.department}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <Link to="/resources">
                    <Button variant="ghost" size="sm">
                      Browse more <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-40 w-full" />
                ) : (
                  <div className="space-y-3">
                    {recentUploads.slice(0, 3).map((resource) => (
                      <div
                        key={resource._id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {resource.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatNumber(resource.downloads)} downloads &middot; {resource.views} views
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Download Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 flex flex-col items-center justify-center border border-primary-200/50 dark:border-primary-700/30">
                  <BarChart3 className="h-12 w-12 text-primary-400 dark:text-primary-500 mb-3" />
                  <p className="text-sm font-medium text-primary-700 dark:text-primary-400">
                    Download chart coming soon
                  </p>
                  <div className="flex gap-1 mt-4">
                    {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
                      <div
                        key={i}
                        className="w-3 rounded-t bg-primary-300/60 dark:bg-primary-600/40"
                        style={{ height: `${h * 0.4}px` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link to="/upload" className="block">
                    <Button variant="primary" className="w-full justify-start" icon={<Upload className="h-4 w-4" />}>
                      Upload Resource
                    </Button>
                  </Link>
                  <Link to="/resources" className="block">
                    <Button variant="secondary" className="w-full justify-start" icon={<BookOpen className="h-4 w-4" />}>
                      Browse Resources
                    </Button>
                  </Link>
                  <Link to="/bookmarks" className="block">
                    <Button variant="ghost" className="w-full justify-start" icon={<Bookmark className="h-4 w-4" />}>
                      My Bookmarks
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Most downloaded this week
                </p>
                <div className="space-y-2">
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
                    : recentUploads.slice(0, 3).map((r, i) => (
                        <Link
                          key={r._id}
                          to={`/resources/${r._id}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <span className="text-lg font-bold text-gray-300 dark:text-gray-600 w-6">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {r.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatNumber(r.downloads)} downloads
                            </p>
                          </div>
                        </Link>
                      ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
