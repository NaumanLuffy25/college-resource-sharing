import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  BookmarkX,
  FileText,
  Download,
  Star,
  Eye,
  Calendar,
  FolderOpen,
  Search,
} from 'lucide-react';
import { bookmarkAPI } from '../api';
import { Bookmark as BookmarkType } from '../types';
import { Button } from '../components/ui';
import { Card } from '../components/ui';
import { Badge } from '../components/ui';
import { Input } from '../components/ui';
import { Skeleton, ResourceCardSkeleton } from '../components/ui';
import { formatFileSize, formatDate, getResourceTypeLabel, getDepartmentColor } from '../utils';

const COLLECTIONS = ['All', 'Favorites', 'Study', 'Reference', 'Projects'];

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCollection, setActiveCollection] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: any = { limit: 100 };
      if (activeCollection !== 'All') params.collection = activeCollection;
      const res = await bookmarkAPI.getAll(params);
      setBookmarks(res.data.data || res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bookmarks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [activeCollection]);

  const handleRemove = async (resourceId: string) => {
    setRemovingId(resourceId);
    try {
      await bookmarkAPI.remove(resourceId);
      setBookmarks((prev) => prev.filter((b) => b.resource._id !== resourceId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove bookmark');
    } finally {
      setRemovingId(null);
    }
  };

  const filtered = bookmarks.filter((b) =>
    searchQuery
      ? b.resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.resource.subject.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Bookmarks</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your saved resources &middot; {bookmarks.length} bookmarks
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {COLLECTIONS.map((col) => (
              <button
                key={col}
                onClick={() => setActiveCollection(col)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCollection === col
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                {col}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search bookmarks..."
              icon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
              <BookmarkX size={48} className="text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {searchQuery ? 'No matches found' : 'No bookmarks yet'}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'Try adjusting your search or collection filter.'
                : 'Start bookmarking resources to save them for later.'}
            </p>
            {!searchQuery && (
              <Link to="/browse">
                <Button icon={<Search size={18} />}>Browse Resources</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((bookmark) => {
              const resource = bookmark.resource;
              return (
                <Card key={bookmark._id} hover className="flex flex-col">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary-100 p-2.5 dark:bg-primary-900/30">
                        <FileText size={20} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/resources/${resource._id}`}
                          className="group block truncate text-sm font-semibold text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
                        >
                          {resource.title}
                        </Link>
                        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                          {resource.subject}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      isLoading={removingId === resource._id}
                      onClick={() => handleRemove(resource._id)}
                      className="shrink-0 text-gray-400 hover:text-red-500"
                      icon={<BookmarkX size={16} />}
                    />
                  </div>

                  <p className="mb-4 line-clamp-2 flex-1 text-xs text-gray-500 dark:text-gray-400">
                    {resource.description}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-1.5">
                    <Badge>{getResourceTypeLabel(resource.resourceType)}</Badge>
                    <Badge className={getDepartmentColor(resource.department)}>
                      {resource.department}
                    </Badge>
                    <Badge variant="primary">Sem {resource.semester}</Badge>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Download size={12} /> {resource.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {resource.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={12} /> {resource.averageRating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(resource.createdAt)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
