import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label: string;
  id?: string;
  htmlFor?: string;
  description?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  htmlFor,
  description,
  helperText,
  error,
  required = false,
  children,
  className = '',
}) => {
  const targetId = id || htmlFor;
  const effectiveHelper = error || description || helperText;

  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      <label
        htmlFor={targetId}
        className="block text-sm font-semibold text-text select-none"
      >
        {label}
        {required && <span className="text-negative ml-1">*</span>}
      </label>

      <div>{children}</div>

      {effectiveHelper && (
        <div className="min-h-4">
          {error ? (
            <p className="text-xs text-negative flex items-center gap-1 font-normal">
              <AlertCircle className="w-3.5 h-3.5 stroke-[1.5] shrink-0" />
              <span>{error}</span>
            </p>
          ) : (
            <p className="text-xs text-text-secondary font-normal">
              {effectiveHelper}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
