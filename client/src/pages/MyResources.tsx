import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Trash2,
  Edit3,
  Upload,
  Download,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  MoreVertical,
  Calendar,
  File,
} from 'lucide-react';
import { resourceAPI } from '../api';
import { Resource } from '../types';
import { Button } from '../components/ui';
import { Card } from '../components/ui';
import { Badge } from '../components/ui';
import { Modal } from '../components/ui';
import { Skeleton, ResourceCardSkeleton } from '../components/ui';
import { formatFileSize, formatDate, getResourceTypeLabel, getDepartmentColor } from '../utils';

const MyResources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: '',
    title: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchResources = async (p: number) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await resourceAPI.getMyResources({ page: p, limit: 12 });
      const data = res.data;
      setResources(data.resources || data.data || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(page);
  }, [page]);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await resourceAPI.delete(deleteModal.id);
      setResources((prev) => prev.filter((r) => r._id !== deleteModal.id));
      setTotal((prev) => prev - 1);
      setDeleteModal({ open: false, id: '', title: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete resource');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">My Resources</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your uploaded resources &middot; {total} total
            </p>
          </div>
          <Link to="/upload">
            <Button icon={<Upload size={18} />}>Upload Resource</Button>
          </Link>
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
        ) : resources.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
              <FolderOpen size={48} className="text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              No resources yet
            </h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              You haven&apos;t uploaded any resources. Start sharing your study materials with fellow students.
            </p>
            <Link to="/upload">
              <Button icon={<Upload size={18} />}>Upload Your First Resource</Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <Card key={resource._id} hover className="relative flex flex-col">
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
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === resource._id ? null : resource._id)
                        }
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === resource._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                            <Link
                              to={`/resources/${resource._id}/edit`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Edit3 size={14} /> Edit
                            </Link>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setDeleteModal({
                                  open: true,
                                  id: resource._id,
                                  title: resource.title,
                                });
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="mb-4 line-clamp-2 flex-1 text-xs text-gray-500 dark:text-gray-400">
                    {resource.description}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-1.5">
                    <Badge>{getResourceTypeLabel(resource.resourceType)}</Badge>
                    <Badge className={getDepartmentColor(resource.department)}>
                      {resource.department}
                    </Badge>
                    {resource.isApproved ? (
                      <Badge variant="success">Approved</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
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

                  <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <File size={12} /> {formatFileSize(resource.fileSize)}
                    </span>
                    <span className="truncate ml-2">{resource.fileName}</span>
                  </div>
                </Card>
              ))}
            </div>

            {pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<ChevronLeft size={16} />}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>
                <span className="px-4 text-sm text-gray-600 dark:text-gray-400">
                  Page {page} of {pages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === pages}
                  onClick={() => setPage((p) => p + 1)}
                  icon={<ChevronRight size={16} />}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: '', title: '' })}
        title="Delete Resource"
      >
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            &ldquo;{deleteModal.title}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ open: false, id: '', title: '' })}
          >
            Cancel
          </Button>
          <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyResources;
