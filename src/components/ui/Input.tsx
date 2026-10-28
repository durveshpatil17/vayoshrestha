import React from 'react';
import { ErrorCircle16Regular } from '@fluentui/react-icons';

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
      <div className="w-full flex flex-col gap-1 text-left">
        {label && (
          <label htmlFor={inputId} className="text-label flex items-center gap-0.5">
            {label}
            {required && <span className="text-negative font-medium">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-2.5 text-text-tertiary pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            className={`w-full h-8 rounded-control bg-surface border text-sm text-text placeholder:text-text-disabled transition-colors duration-fast px-2.5 ${
              error
                ? 'border-negative focus:border-negative focus:ring-2 focus:ring-negative/20'
                : readOnly
                ? 'bg-surface-subtle border-border cursor-default text-text'
                : disabled
                ? 'bg-surface-subtle border-border text-text-disabled cursor-not-allowed'
                : 'border-border hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent-tint'
            } focus:outline-none ${leftIcon ? 'pl-8' : ''} ${rightIcon ? 'pr-8' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-2.5 text-text-tertiary flex items-center">
              {rightIcon}
            </span>
          )}
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

Input.displayName = 'Input';
