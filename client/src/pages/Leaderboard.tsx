import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Upload,
  Download,
  Star,
  TrendingUp,
  Crown,
  Award,
  Users,
  FileText,
} from 'lucide-react';
import { bookmarkAPI } from '../api';
import { User } from '../types';
import { Card, CardHeader, CardTitle } from '../components/ui';
import { Badge } from '../components/ui';
import { Skeleton } from '../components/ui';
import { getDepartmentColor } from '../utils';

interface LeaderboardData {
  topUploaders: User[];
  topDownloaded: any[];
  topRated: User[];
}

const TABS = [
  { id: 'uploaders', label: 'Top Uploaders', icon: Upload },
  { id: 'downloaded', label: 'Most Downloaded', icon: Download },
  { id: 'rated', label: 'Highest Rated', icon: Star },
] as const;

const medalColors = [
  'bg-yellow-400 text-yellow-900',
  'bg-gray-300 text-gray-700',
  'bg-orange-400 text-orange-900',
];

const medalIcons = [Crown, Award, Medal];

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'uploaders' | 'downloaded' | 'rated'>('uploaders');
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await bookmarkAPI.getLeaderboard();
        setData(res.data.data || res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getUploadersList = () => data?.topUploaders || [];
  const getDownloadedList = () => data?.topDownloaded || [];
  const getRatedList = () => data?.topRated || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-3">
            <Trophy size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Leaderboard</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Celebrating our top contributors and resources
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="inline-flex gap-1 rounded-2xl bg-white p-1 shadow-sm dark:bg-gray-900">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <Card padding="sm">
            {activeTab === 'uploaders' && (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {getUploadersList().length === 0 && (
                  <p className="py-12 text-center text-sm text-gray-500">No data available</p>
                )}
                {getUploadersList().map((user, idx) => {
                  const MedalIcon = idx < 3 ? medalIcons[idx] : null;
                  return (
                    <div
                      key={user._id}
                      className={`flex items-center gap-4 px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                        idx < 3 ? 'bg-gradient-to-r from-transparent to-transparent' : ''
                      }`}
                    >
                      <div className="w-10 text-center">
                        {idx < 3 && MedalIcon ? (
                          <div
                            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${medalColors[idx]}`}
                          >
                            <MedalIcon size={16} />
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-gray-400 dark:text-gray-500">
                            #{idx + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {user.department}
                        </p>
                      </div>
                      <Badge className={getDepartmentColor(user.department)}>
                        {user.department}
                      </Badge>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {user.uploadCount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">uploads</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'downloaded' && (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {getDownloadedList().length === 0 && (
                  <p className="py-12 text-center text-sm text-gray-500">No data available</p>
                )}
                {getDownloadedList().map((item: any, idx: number) => {
                  const resource = item.resource || item;
                  const MedalIcon = idx < 3 ? medalIcons[idx] : null;
                  return (
                    <div
                      key={resource._id || idx}
                      className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="w-10 text-center">
                        {idx < 3 && MedalIcon ? (
                          <div
                            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${medalColors[idx]}`}
                          >
                            <MedalIcon size={16} />
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-gray-400 dark:text-gray-500">
                            #{idx + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                        <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {resource.title}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          by{' '}
                          {typeof resource.uploadedBy === 'object'
                            ? resource.uploadedBy?.name
                            : resource.author || 'Unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {item.downloadCount || resource.downloads || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">downloads</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'rated' && (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {getRatedList().length === 0 && (
                  <p className="py-12 text-center text-sm text-gray-500">No data available</p>
                )}
                {getRatedList().map((user, idx) => {
                  const MedalIcon = idx < 3 ? medalIcons[idx] : null;
                  return (
                    <div
                      key={user._id}
                      className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="w-10 text-center">
                        {idx < 3 && MedalIcon ? (
                          <div
                            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${medalColors[idx]}`}
                          >
                            <MedalIcon size={16} />
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-gray-400 dark:text-gray-500">
                            #{idx + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {user.department}
                        </p>
                      </div>
                      <Badge className={getDepartmentColor(user.department)}>
                        {user.department}
                      </Badge>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          {(user as any).averageRating?.toFixed(1) || (user as any).averageGivenRating?.toFixed(1) || '0.0'}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">avg rating</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
