// src/components/common/LoadingSpinner/LoadingSpinner.tsx
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner = ({
  size = 'md',
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };
  
  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={clsx(
        'rounded-full border-t-transparent border-purple-600 dark:border-purple-400',
        sizes[size],
        className
      )}
    />
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};