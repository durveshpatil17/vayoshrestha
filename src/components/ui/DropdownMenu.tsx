import React from 'react';
import * as RadixDropdown from '@radix-ui/react-dropdown-menu';

export const DropdownMenuRoot = RadixDropdown.Root;
export const DropdownMenuTrigger = RadixDropdown.Trigger;

export interface DropdownMenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  icon,
  onClick,
  disabled = false,
  destructive = false,
  className = '',
}) => {
  return (
    <RadixDropdown.Item
      disabled={disabled}
      onClick={onClick}
      className={`h-8 px-3 flex items-center gap-2 text-sm rounded-control cursor-pointer outline-none transition-colors duration-fast ${
        destructive
          ? 'text-negative hover:bg-negative-tint focus:bg-negative-tint'
          : 'text-text hover:bg-surface-hover focus:bg-surface-hover'
      } disabled:text-text-disabled disabled:cursor-not-allowed ${className}`}
    >
      {icon && <span className="shrink-0 text-text-secondary">{icon}</span>}
      <span className="truncate">{children}</span>
    </RadixDropdown.Item>
  );
};

export const DropdownMenuContent: React.FC<{
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}> = ({ children, align = 'start', className = '' }) => {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        align={align}
        sideOffset={4}
        className={`z-50 min-w-44 bg-surface border border-border rounded-control shadow-menu p-1 focus:outline-none animate-in fade-in-0 zoom-in-95 duration-fast ${className}`}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  );
};

export const DropdownMenuSeparator = () => (
  <RadixDropdown.Separator className="h-px bg-border-subtle my-1" />
);

