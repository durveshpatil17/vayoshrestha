import React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';

export const PopoverRoot = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverClose = RadixPopover.Close;

export interface PopoverContentProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  align = 'start',
  side = 'bottom',
  className = '',
}) => {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align={align}
        side={side}
        sideOffset={4}
        className={`z-50 bg-surface border border-border rounded-control shadow-menu p-3 focus:outline-none animate-in fade-in-0 zoom-in-95 duration-fast ${className}`}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
};

