import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

export const TooltipProvider = RadixTooltip.Provider;

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 150,
}) => {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={4}
          className="z-50 px-2 py-1 bg-text text-white text-xs rounded-chip shadow-menu animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 max-w-xs text-center"
        >
          {content}
          <RadixTooltip.Arrow className="fill-text" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
};

