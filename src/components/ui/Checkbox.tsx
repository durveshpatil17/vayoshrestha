import React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onCheckedChange,
  label,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <RadixCheckbox.Root
        id={id}
        checked={checked}
        onCheckedChange={(val) => onCheckedChange?.(val === true)}
        disabled={disabled}
        className="w-4 h-4 rounded-chip border border-border-strong bg-surface hover:border-accent focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 data-[state=checked]:bg-accent data-[state=checked]:border-accent flex items-center justify-center transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RadixCheckbox.Indicator className="text-white flex items-center justify-center">
          <Check className="w-3.5 h-3.5 stroke-[2]" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm text-text cursor-pointer ${
            disabled ? 'text-text-disabled cursor-not-allowed' : ''
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

