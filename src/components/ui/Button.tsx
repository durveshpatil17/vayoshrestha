import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'default'
  | 'ghost'
  | 'destructive'
  | 'destructive-confirm'
  | 'outline'
  | 'secondary'
  | 'danger';

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
    // 8px radius on controls, 14px/600 font
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-control transition-colors duration-150 ease-in-out select-none focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 disabled:cursor-not-allowed text-sm';

    // Normalize legacy aliases
    let normalized = variant;
    if (variant === 'outline' || variant === 'secondary') {
      normalized = 'default';
    } else if (variant === 'danger') {
      normalized = 'destructive';
    }

    const variantStyles: Record<string, string> = {
      primary:
        'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)] disabled:bg-surface-subtle disabled:text-text-disabled',
      default:
        'bg-surface text-[var(--text)] border border-[var(--border)] hover:bg-surface-hover hover:border-[var(--border-strong)] active:bg-[var(--accent-tint)] disabled:bg-surface-subtle disabled:text-text-disabled disabled:border-border-subtle',
      ghost:
        'bg-transparent hover:bg-surface-hover text-[var(--text-secondary)] active:bg-[var(--accent-tint)] disabled:text-text-disabled',
      destructive:
        'bg-surface text-[var(--negative)] border border-[var(--negative)] hover:bg-[var(--negative-tint)] active:bg-[var(--negative-tint)] disabled:bg-surface-subtle disabled:text-text-disabled disabled:border-border-subtle',
      'destructive-confirm':
        'bg-[var(--negative)] text-white hover:opacity-90 active:opacity-95 disabled:bg-surface-subtle disabled:text-text-disabled',
    };

    const sizeStyles: Record<string, string> = {
      sm: 'h-8 px-3 gap-1.5 text-xs',
      md: 'h-10 px-4 gap-2 text-sm',
      lg: 'h-11 px-5 gap-2.5 text-sm',
      icon: 'w-10 h-10 p-0 shrink-0 text-sm',
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
            className="w-4 h-4 animate-spin shrink-0"
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
          icon && <span className="inline-flex shrink-0 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[1.5]">{icon}</span>
        )}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
