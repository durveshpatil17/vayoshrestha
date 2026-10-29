import React, { useState } from 'react';
import { PopoverRoot, PopoverTrigger, PopoverContent } from './Popover';
import { ChevronDown, X, Check } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select items...',
  disabled = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeOption = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div className={`w-full flex flex-col gap-1 text-left ${className}`}>
      {label && <label className="text-label">{label}</label>}

      <PopoverRoot open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`min-h-8 w-full rounded-control bg-surface border border-border hover:border-border-strong text-sm text-text px-2 py-1 flex items-center justify-between gap-2 transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-1 ${
              disabled ? 'bg-surface-subtle text-text-disabled cursor-not-allowed' : ''
            }`}
          >
            <div className="flex flex-wrap items-center gap-1 min-w-0">
              {value.length === 0 ? (
                <span className="text-text-disabled text-sm">{placeholder}</span>
              ) : (
                value.map((val) => {
                  const opt = options.find((o) => o.value === val);
                  return (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 bg-accent-tint text-accent text-xs px-1.5 py-0.5 rounded-chip border border-accent/20"
                    >
                      <span>{opt ? opt.label : val}</span>
                      <span
                        role="button"
                        onClick={(e) => removeOption(val, e)}
                        className="hover:text-accent-active p-0.5 rounded"
                      >
                        <X className="w-3 h-3 stroke-[1.5]" />
                      </span>
                    </span>
                  );
                })
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-text-tertiary shrink-0 stroke-[1.5]" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-72 p-1">
          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {options.map((opt) => {
              const selected = value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className={`h-8 px-2.5 flex items-center justify-between rounded-control text-sm cursor-pointer transition-colors ${
                    selected
                      ? 'bg-surface-selected text-accent'
                      : 'text-text hover:bg-surface-hover'
                  }`}
                >
                  <span>{opt.label}</span>
                  {selected && <Check className="w-4 h-4 text-accent stroke-[1.5]" />}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>
  );
};

