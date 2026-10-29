import React from 'react';

export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg'; // md = 28px standard
  className?: string;
}

function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className = '',
}) => {
  const sizeClasses: Record<string, string> = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-7 h-7 text-xs', // 28px
    lg: 'w-9 h-9 text-sm',
  };

  const initials = getInitials(name);

  return (
    <div
      className={`rounded-full bg-neutral-tint text-text font-semibold flex items-center justify-center shrink-0 border border-border-subtle select-none ${sizeClasses[size]} ${className}`}
      title={name}
      aria-label={name}
    >
      <span>{initials}</span>
    </div>
  );
};

