import React from 'react';

export interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 4, className = '' }) => {
  return (
    <div className={`w-full space-y-3 animate-pulse ${className}`}>
      <div className="h-6 bg-bg-subtle rounded w-1/3 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-4 bg-bg-subtle rounded w-1/4" />
          <div className="h-4 bg-bg-subtle rounded w-1/3" />
          <div className="h-4 bg-bg-subtle rounded w-1/5" />
          <div className="h-4 bg-bg-subtle rounded flex-1" />
        </div>
      ))}
    </div>
  );
};
