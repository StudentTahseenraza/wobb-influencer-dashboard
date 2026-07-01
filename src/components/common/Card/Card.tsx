// src/components/common/Card/Card.tsx
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'outline';
}

export const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  variant = 'default',
}: CardProps) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50',
    outline: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
  };
  
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={clsx(
        'rounded-xl shadow-sm transition-all duration-200',
        variants[variant],
        hoverable && 'cursor-pointer hover:shadow-lg hover:shadow-purple-500/10',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};