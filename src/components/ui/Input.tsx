import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      className = '',
      id,
      readOnly,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-label flex items-center gap-1 font-semibold text-text-secondary text-xs">
            {label}
            {required && <span className="text-negative font-semibold">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-text-tertiary pointer-events-none flex items-center [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[1.5]">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            className={`w-full h-10 rounded-control bg-surface border text-sm text-text placeholder:text-text-disabled transition-colors px-3 ${
              error
                ? 'border-negative focus:border-negative focus:ring-2 focus:ring-negative/20'
                : readOnly
                ? 'bg-surface-subtle border-border cursor-default text-text'
                : disabled
                ? 'bg-surface-subtle border-border text-text-disabled cursor-not-allowed'
                : 'border-border hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent-tint'
            } focus:outline-none ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-text-tertiary flex items-center [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[1.5]">
              {rightIcon}
            </span>
          )}
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

Input.displayName = 'Input';
