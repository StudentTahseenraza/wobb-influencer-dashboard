// src/components/common/EmptyState/EmptyState.tsx
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      {icon && (
        <div className="text-6xl mb-4">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </motion.div>
  );
};