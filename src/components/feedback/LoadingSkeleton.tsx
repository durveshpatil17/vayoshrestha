import React from 'react';

export interface LoadingSkeletonProps {
  rows?: number;
  height?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 3,
  height = 'h-4',
  className = '',
}) => {
  return (
    <div className={`w-full space-y-3 p-4 animate-pulse ${className}`} aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`bg-border-subtle rounded-control ${height}`}
          style={{
            width: i === 0 ? '60%' : i === rows - 1 ? '40%' : '100%',
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );
};
