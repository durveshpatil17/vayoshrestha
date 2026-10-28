import React from 'react';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  value,
  onChange,
  options,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`inline-flex items-center h-8 bg-surface-subtle border border-border-subtle rounded-control p-0.5 select-none ${className}`}
      role="tablist"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`h-7 px-3 flex items-center gap-1.5 rounded-control text-xs font-medium transition-all duration-fast ${
              isActive
                ? 'bg-surface text-text  border border-border'
                : 'text-text-secondary hover:text-text border border-transparent'
            } focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-1`}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

