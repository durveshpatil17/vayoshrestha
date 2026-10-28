import React from 'react';
import * as RadixRadio from '@radix-ui/react-radio-group';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  name?: string;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  options,
  name,
  className = '',
}) => {
  return (
    <RadixRadio.Root
      value={value}
      onValueChange={onValueChange}
      name={name}
      className={`flex flex-col gap-2 ${className}`}
    >
      {options.map((opt) => (
        <div key={opt.value} className="inline-flex items-center gap-2 select-none">
          <RadixRadio.Item
            id={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            className="w-4 h-4 rounded-full border border-border-strong bg-surface hover:border-accent focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 data-[state=checked]:border-accent flex items-center justify-center transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RadixRadio.Indicator className="w-2 h-2 rounded-full bg-accent" />
          </RadixRadio.Item>
          <label
            htmlFor={opt.value}
            className={`text-sm text-text cursor-pointer ${
              opt.disabled ? 'text-text-disabled cursor-not-allowed' : ''
            }`}
          >
            {opt.label}
          </label>
        </div>
      ))}
    </RadixRadio.Root>
  );
};

