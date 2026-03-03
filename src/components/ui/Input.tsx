'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, showPasswordToggle, type = 'text', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="font-inter text-[14px] text-[var(--grey-800)] tracking-[0.14px]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full h-[48px] px-[21px] py-[16px] 
              border rounded-[12px] 
              font-inter text-[16px]
              placeholder:text-[var(--neutral-500)]
              text-[var(--grey-800)]
              focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent
              transition-all duration-200
              ${error ? 'border-[var(--error)] border-2' : 'border-[var(--border-01)]'}
              ${icon || showPasswordToggle ? 'pr-[50px]' : ''}
              ${className}
            `}
            {...props}
          />
          {(icon || showPasswordToggle) && (
            <div className="absolute right-[21px] top-1/2 -translate-y-1/2 flex items-center">
              {showPasswordToggle ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[var(--neutral-500)] hover:text-[var(--grey-800)] transition-colors"
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              ) : (
                icon
              )}
            </div>
          )}
        </div>
        {error && <span className="text-[var(--error)] text-[12px] font-inter">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
