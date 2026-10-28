import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'default'
  | 'ghost'
  | 'destructive'
  | 'destructive-confirm'
  | 'outline' // alias for default
  | 'secondary' // alias for default
  | 'danger'; // alias for destructive

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      isLoading = false,
      children,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // 32px height, 6px radius, 14px/500 font
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-control transition-colors duration-fast ease-in-out select-none focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 disabled:cursor-not-allowed text-sm';

    // Normalize legacy aliases
    let normalized = variant;
    if (variant === 'outline' || variant === 'secondary') {
      normalized = 'default';
    } else if (variant === 'danger') {
      normalized = 'destructive';
    }

    const variantStyles: Record<string, string> = {
      primary:
        'bg-accent text-text-on-accent hover:bg-accent-hover active:bg-accent-active disabled:bg-surface-subtle disabled:text-text-disabled',
      default:
        'bg-surface text-accent border border-border-strong hover:bg-surface-hover hover:border-accent active:bg-accent-tint disabled:bg-surface-subtle disabled:text-text-disabled disabled:border-border-subtle',
      ghost:
        'bg-transparent text-accent hover:bg-surface-hover active:bg-accent-tint disabled:text-text-disabled',
      destructive:
        'bg-surface text-negative border border-negative hover:bg-negative-tint active:bg-negative-tint/80 disabled:bg-surface-subtle disabled:text-text-disabled disabled:border-border-subtle',
      'destructive-confirm':
        'bg-negative text-text-on-accent hover:opacity-90 active:opacity-95 disabled:bg-surface-subtle disabled:text-text-disabled',
    };

    const sizeStyles: Record<string, string> = {
      sm: 'h-7 px-2.5 gap-1.5 text-xs',
      md: 'h-8 px-3 gap-1.5 text-sm',
      lg: 'h-9 px-4 gap-2 text-sm',
      icon: 'w-8 h-8 p-0 shrink-0 text-sm',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[normalized] || variantStyles.default} ${sizeStyles[size] || sizeStyles.md} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="w-3.5 h-3.5 animate-spin shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
            <path
              d="M8 2a6 6 0 0 1 6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          icon && <span className="inline-flex shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
