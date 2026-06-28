import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Download,
  Eye,
  FileText,
  Filter,
} from 'lucide-react';
import { resourceAPI } from '../api';
import { Resource } from '../types';
import { Card, Button, Input, Badge, ResourceCardSkeleton } from '../components/ui';
import {
  formatFileSize,
  formatDate,
  formatNumber,
  getResourceTypeLabel,
  getDepartmentColor,
} from '../utils';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Electrical',
  'Mechanical',
  'Civil',
];

const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const RESOURCE_TYPES = [
  'notes',
  'lab',
  'assignment',
  'question_paper',
  'project_report',
  'study_material',
  'presentation',
  'mini_project',
];

const FILE_TYPES = ['pdf', 'docx', 'pptx', 'zip', 'image'];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: '-downloads', label: 'Most Downloads' },
  { value: '-averageRating', label: 'Highest Rated' },
  { value: '-views', label: 'Most Viewed' },
  { value: 'title', label: 'Title A-Z' },
];

const getFileTypeIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('docx')) return '📝';
  if (fileType.includes('presentation') || fileType.includes('pptx')) return '📊';
  if (fileType.includes('zip')) return '📦';
  if (fileType.includes('image')) return '🖼️';
  return '📁';
};

const ResourceGridCard: React.FC<{ resource: Resource }> = ({ resource }) => (
  <Link to={`/resources/${resource._id}`}>
    <Card hover className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{getFileTypeIcon(resource.fileType)}</span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDepartmentColor(resource.department)}`}>
          {resource.department}
        </span>
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
        {resource.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
        {resource.description}
      </p>
      <div className="flex items-center gap-2 mb-3">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {resource.averageRating?.toFixed(1) || '0.0'}
        </span>
        <span className="text-xs text-gray-400">({resource.totalRatings})</span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
        <span className="flex items-center gap-1">
          <Download className="h-3 w-3" />
          {formatNumber(resource.downloads)}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {formatNumber(resource.views)}
        </span>
        <Badge variant="default">{resource.semester} Sem</Badge>
      </div>
    </Card>
  </Link>
);

const ResourceListCard: React.FC<{ resource: Resource }> = ({ resource }) => (
  <Link to={`/resources/${resource._id}`}>
    <Card hover className="flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
        {getFileTypeIcon(resource.fileType)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {resource.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {resource.author} &middot; {formatDate(resource.createdAt)}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDepartmentColor(resource.department)}`}>
          {resource.department}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {resource.averageRating?.toFixed(1) || '0.0'}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Download className="h-3 w-3" />
          {formatNumber(resource.downloads)}
        </div>
      </div>
    </Card>
  </Link>
);

const BrowseResources: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const department = searchParams.get('department') || '';
  const semester = searchParams.get('semester') || '';
  const subject = searchParams.get('subject') || '';
  const resourceType = searchParams.get('resourceType') || '';
  const fileType = searchParams.get('fileType') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const view = searchParams.get('view') || 'grid';

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== 'page') params.set('page', '1');
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page,
        limit: 12,
        sort,
      };
      if (search) params.search = search;
      if (department) params.department = department;
      if (semester) params.semester = semester;
      if (subject) params.subject = subject;
      if (resourceType) params.resourceType = resourceType;
      if (fileType) params.fileType = fileType;

      const res = await resourceAPI.getAll(params);
      setResources(res.data.resources || res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [search, department, semester, subject, resourceType, fileType, sort, page]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = department || semester || subject || resourceType || fileType;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Browse Resources</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Find study materials, notes, and more from your peers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources by title, subject, or author..."
              value={search}
              onChange={(e) => updateParams('search', e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
              icon={<SlidersHorizontal className="h-4 w-4" />}
            >
              Filters {hasActiveFilters && `(${[department, semester, subject, resourceType, fileType].filter(Boolean).length})`}
            </Button>
            <div className="flex rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => updateParams('view', 'grid')}
                className={`px-3 py-2 ${
                  view === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => updateParams('view', 'list')}
                className={`px-3 py-2 ${
                  view === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} icon={<X className="h-3 w-3" />}>
                  Clear all
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => updateParams('department', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => updateParams('semester', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All Semesters</option>
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Resource Type
                </label>
                <select
                  value={resourceType}
                  onChange={(e) => updateParams('resourceType', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All Types</option>
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>{getResourceTypeLabel(t)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  File Type
                </label>
                <select
                  value={fileType}
                  onChange={(e) => updateParams('fileType', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All Files</option>
                  {FILE_TYPES.map((f) => (
                    <option key={f} value={f}>.{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={subject}
                  onChange={(e) => updateParams('subject', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Sort By
                </label>
                <select
                  value={sort}
                  onChange={(e) => updateParams('sort', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {loading ? 'Loading...' : `${resources.length} resource${resources.length !== 1 ? 's' : ''} found`}
          </p>
          {!showFilters && (
            <select
              value={sort}
              onChange={(e) => updateParams('sort', e.target.value)}
              className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No resources found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search or filters.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {resources.map((resource) =>
              view === 'grid' ? (
                <ResourceGridCard key={resource._id} resource={resource} />
              ) : (
                <ResourceListCard key={resource._id} resource={resource} />
              )
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateParams('page', String(page - 1))}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Prev
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => updateParams('page', String(pageNum))}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                    page === pageNum
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => updateParams('page', String(page + 1))}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseResources;
