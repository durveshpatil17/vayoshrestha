import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  helperText,
  error,
  className = '',
  id,
  required,
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);

  return (
    <div className={`w-full flex flex-col gap-1 text-left ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-label flex items-center gap-0.5">
          {label}
          {required && <span className="text-negative font-semibold">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          type="date"
          disabled={disabled}
          required={required}
          className={`w-full h-8 rounded-control bg-surface border text-sm text-text tabular-nums transition-colors duration-fast px-2.5 pr-8 ${
            error
              ? 'border-negative focus:border-negative focus:ring-2 focus:ring-negative/20'
              : disabled
              ? 'bg-surface-subtle border-border text-text-disabled cursor-not-allowed'
              : 'border-border hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent-tint'
          } focus:outline-none`}
          {...props}
        />
        <span className="absolute right-2.5 pointer-events-none text-text-tertiary flex items-center">
          <Calendar className="w-4 h-4 stroke-[1.5]" />
        </span>
      </div>
      {error ? (
        <p className="text-caption text-negative flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-4 h-4 stroke-[1.5] shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-caption text-text-secondary mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

