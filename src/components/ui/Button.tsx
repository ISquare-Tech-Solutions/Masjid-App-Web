'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'font-inter font-medium rounded-[12px] transition-all duration-200 flex items-center justify-center gap-2';

    const variants = {
      primary: 'bg-[var(--brand)] text-white hover:bg-[#065d29] disabled:opacity-50',
      secondary: 'bg-[var(--neutral-100)] text-[var(--grey-800)] hover:bg-[var(--neutral-300)]',
      outline:
        'border border-[var(--border-01)] bg-white text-[var(--grey-800)] hover:bg-[var(--neutral-100)]',
      ghost: 'bg-transparent text-[var(--grey-800)] hover:bg-[var(--neutral-100)]',
    };

    const sizes = {
      sm: 'text-[14px] px-4 py-2',
      md: 'text-[16px] px-6 py-3',
      lg: 'text-[20px] px-8 py-4',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
