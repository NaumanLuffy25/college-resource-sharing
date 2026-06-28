import React from 'react';
import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn('animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800', className)} />
      ))}
    </div>
  );
};

export const ResourceCardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
    <Skeleton className="h-4 w-3/4 mb-3" />
    <Skeleton className="h-3 w-full mb-2" />
    <Skeleton className="h-3 w-2/3 mb-4" />
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
    <Skeleton className="h-8 w-full rounded-xl" />
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
    <Skeleton className="h-4 w-24 mb-2" />
    <Skeleton className="h-8 w-16 mb-1" />
    <Skeleton className="h-3 w-32" />
  </div>
);
