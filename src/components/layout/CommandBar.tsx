import React from 'react';
import { Button } from '../ui/Button';
import {
  Add16Regular,
  ArrowDownload16Regular,
  ArrowClockwise16Regular,
  Options16Regular,
} from '@fluentui/react-icons';

export interface CommandBarAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'default' | 'ghost' | 'destructive';
}

export interface CommandBarProps {
  primaryAction?: CommandBarAction;
  secondaryActions?: CommandBarAction[];
  onRefresh?: () => void;
  onExport?: () => void;
  onColumnSettings?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  primaryAction,
  secondaryActions = [],
  onRefresh,
  onExport,
  onColumnSettings,
  children,
  className = '',
}) => {
  return (
    <div
      className={`h-10 bg-surface border-b border-border-subtle px-4 flex items-center justify-between gap-3 select-none ${className}`}
    >
      {/* Left Action Strip: Restrained ghost buttons with 16px icon + 14px label */}
      <div className="flex items-center gap-2">
        {primaryAction && (
          <Button
            variant="primary"
            size="sm"
            icon={primaryAction.icon || <Add16Regular />}
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
          >
            {primaryAction.label}
          </Button>
        )}

        {secondaryActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            icon={action.icon}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}

        {children}
      </div>

      {/* Right Utility Actions */}
      <div className="flex items-center gap-1">
        {onExport && (
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowDownload16Regular />}
            onClick={onExport}
            title="Export data"
          >
            Export
          </Button>
        )}
        {onColumnSettings && (
          <Button
            variant="ghost"
            size="sm"
            icon={<Options16Regular />}
            onClick={onColumnSettings}
            title="Column settings"
          >
            Columns
          </Button>
        )}
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            icon={<ArrowClockwise16Regular />}
            onClick={onRefresh}
            title="Refresh list"
          />
        )}
      </div>
    </div>
  );
};

