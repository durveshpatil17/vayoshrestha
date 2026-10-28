import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

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
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="text-label flex items-center gap-1 font-semibold text-text-secondary text-xs">
            {label}
            {required && <span className="text-negative font-semibold">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            required={required}
            className={`w-full h-10 appearance-none rounded-control bg-surface border text-sm text-text transition-colors pl-3 pr-10 ${
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
          <span className="absolute right-3 pointer-events-none text-text-tertiary flex items-center">
            <ChevronDown className="w-5 h-5 stroke-[1.5]" />
          </span>
        </div>
        {error ? (
          <p className="text-xs text-negative flex items-center gap-1.5 mt-0.5">
            <AlertCircle className="w-4 h-4 shrink-0 stroke-[1.5]" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-text-secondary mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
