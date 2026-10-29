import React from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-10 px-3 rounded-control bg-surface border text-sm text-text tabular-nums transition-colors placeholder:text-text-disabled focus:outline-none ${
          error
            ? 'border-negative focus:border-negative focus:ring-2 focus:ring-negative/20'
            : 'border-border hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent/20'
        } disabled:bg-surface-subtle disabled:text-text-disabled disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);
TextInput.displayName = 'TextInput';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`w-full h-10 pl-3 pr-9 rounded-control bg-surface border text-sm text-text transition-colors appearance-none focus:outline-none cursor-pointer ${
            error
              ? 'border-negative focus:border-negative focus:ring-2 focus:ring-negative/20'
              : 'border-border hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent/20'
          } disabled:bg-surface-subtle disabled:text-text-disabled disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="w-4 h-4 text-text-secondary pointer-events-none absolute right-3 top-3 stroke-[1.5]" />
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, rows = 3, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full p-3 rounded-control bg-surface border text-sm text-text transition-colors placeholder:text-text-disabled focus:outline-none leading-relaxed ${
          error
            ? 'border-negative focus:border-negative focus:ring-2 focus:ring-negative/20'
            : 'border-border hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent/20'
        } disabled:bg-surface-subtle disabled:text-text-disabled disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          type="date"
          className={`w-full h-10 pl-3 pr-9 rounded-control bg-surface border text-sm text-text tabular-nums transition-colors focus:outline-none ${
            error
              ? 'border-negative focus:border-negative focus:ring-2 focus:ring-negative/20'
              : 'border-border hover:border-border-strong focus:border-accent focus:ring-2 focus:ring-accent/20'
          } disabled:bg-surface-subtle disabled:text-text-disabled disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        <Calendar className="w-4 h-4 text-text-secondary pointer-events-none absolute right-3 top-3 stroke-[1.5]" />
      </div>
    );
  }
);
DateInput.displayName = 'DateInput';

