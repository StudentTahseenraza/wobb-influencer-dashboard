// src/components/common/Badge/Badge.tsx
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'verified';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: BadgeProps) => {
  const variants = {
    primary: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    verified: 'bg-blue-500 text-white',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  
  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-medium',
      variants[variant],
      sizes[size],
      className
    )}>
      {variant === 'verified' && (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
      {children}
    </span>
  );
};