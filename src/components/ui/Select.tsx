import React from 'react';
import { ChevronDown16Regular, ErrorCircle16Regular } from '@fluentui/react-icons';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, className = '', id, required, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1 text-left">
        {label && (
          <label htmlFor={selectId} className="text-label flex items-center gap-0.5">
            {label}
            {required && <span className="text-negative font-medium">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            required={required}
            className={`w-full h-8 appearance-none rounded-control bg-surface border text-sm text-text transition-colors duration-fast pl-2.5 pr-8 ${
              error
                ? 'border-negative focus:border-negative focus:ring-2 focus:ring-negative/20'
                : disabled
                ? 'bg-surface-subtle border-border text-text-disabled cursor-not-allowed'
                : 'border-border hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent-tint'
            } focus:outline-none ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute right-2.5 pointer-events-none text-text-tertiary flex items-center">
            <ChevronDown16Regular />
          </span>
        </div>
        {error ? (
          <p className="text-caption text-negative flex items-center gap-1 mt-0.5">
            <ErrorCircle16Regular className="shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-caption text-text-secondary mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
