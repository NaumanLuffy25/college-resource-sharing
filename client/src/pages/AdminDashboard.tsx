import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Eye,
  Building2,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { resourceAPI } from '../api';
import { Resource, AdminStats } from '../types';
import { Button, Card, CardHeader, CardTitle, Badge, Skeleton } from '../components/ui';
import { formatDate, getResourceTypeLabel, getDepartmentColor } from '../utils';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [statsRes, pendingRes] = await Promise.all([
        resourceAPI.getAdminStats(),
        resourceAPI.getPending(),
      ]);
      setStats(statsRes.data.data || statsRes.data);
      setPending(pendingRes.data.data || pendingRes.data.resources || pendingRes.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await resourceAPI.approve(id);
      setPending((prev) => prev.filter((r) => r._id !== id));
      setStats((s) =>
        s ? { ...s, pendingApprovals: Math.max(0, s.pendingApprovals - 1) } : s
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve resource');
    } finally {
      setApprovingId(null);
    }
  };

  const statCards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
        { label: 'Total Resources', value: stats.totalResources, icon: FileText, color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
        { label: 'Total Downloads', value: stats.totalDownloads, icon: Download, color: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Platform overview and management
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<RefreshCw size={16} />}
            onClick={fetchData}
            isLoading={isLoading}
          >
            Refresh
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))
            : statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.label} hover padding="sm">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-xl p-3 ${card.color}`}>
                        <Icon size={22} className={card.iconColor} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {card.value.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-primary-600" />
                <CardTitle>Daily Uploads</CardTitle>
              </div>
            </CardHeader>
            <div className="flex h-48 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-center">
                <TrendingUp size={32} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Chart placeholder — integrate with charting library
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-primary-600" />
                <CardTitle>Departments</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {[
                { name: 'Computer Science', count: 142, color: 'bg-blue-500' },
                { name: 'Information Technology', count: 98, color: 'bg-purple-500' },
                { name: 'Electronics', count: 67, color: 'bg-cyan-500' },
                { name: 'Mechanical', count: 54, color: 'bg-orange-500' },
                { name: 'Civil', count: 41, color: 'bg-green-500' },
                { name: 'Electrical', count: 38, color: 'bg-yellow-500' },
              ].map((dept) => (
                <div key={dept.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {dept.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{dept.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-full rounded-full ${dept.color}`}
                      style={{ width: `${Math.min(100, (dept.count / 142) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-amber-600" />
                <CardTitle>Pending Approvals</CardTitle>
                {stats && stats.pendingApprovals > 0 && (
                  <Badge variant="warning">{stats.pendingApprovals}</Badge>
                )}
              </div>
            </div>
          </CardHeader>

          {pending.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <CheckCircle2 size={40} className="mb-3 text-emerald-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                All caught up!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No resources pending approval
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {pending.map((resource) => (
                <div
                  key={resource._id}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="shrink-0 text-gray-400" />
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {resource.title}
                      </p>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        by{' '}
                        {typeof resource.uploadedBy === 'object'
                          ? (resource.uploadedBy as any)?.name
                          : 'Unknown'}
                      </span>
                      <span>&middot;</span>
                      <Badge className={getDepartmentColor(resource.department)}>
                        {resource.department}
                      </Badge>
                      <Badge>{getResourceTypeLabel(resource.resourceType)}</Badge>
                      <span>&middot;</span>
                      <span>{formatDate(resource.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Eye size={14} />}
                      onClick={() => window.open(`/resources/${resource._id}`, '_blank')}
                    >
                      View
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<CheckCircle2 size={14} />}
                      isLoading={approvingId === resource._id}
                      onClick={() => handleApprove(resource._id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<XCircle size={14} />}
                      onClick={() => {}}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
