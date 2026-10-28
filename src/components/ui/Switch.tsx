import React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  onCheckedChange,
  label,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <RadixSwitch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="w-[36px] h-[20px] bg-border-strong rounded-full relative transition-colors duration-dur focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 data-[state=checked]:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RadixSwitch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-dur translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[18px]" />
      </RadixSwitch.Root>
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

