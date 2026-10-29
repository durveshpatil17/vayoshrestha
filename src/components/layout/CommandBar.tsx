import React from 'react';
import { Button } from '../ui/Button';
import { Plus, Download, RefreshCw, SlidersHorizontal } from 'lucide-react';

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
            icon={primaryAction.icon || <Plus className="w-4 h-4 stroke-[1.5]" />}
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
            icon={<Download className="w-4 h-4 stroke-[1.5]" />}
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
            icon={<SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />}
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
            icon={<RefreshCw className="w-4 h-4 stroke-[1.5]" />}
            onClick={onRefresh}
            title="Refresh list"
          />
        )}
      </div>
    </div>
  );
};

