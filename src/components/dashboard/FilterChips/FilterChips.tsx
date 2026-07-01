// src/components/dashboard/FilterChips/FilterChips.tsx
import { motion } from 'framer-motion';
import type { Platform } from '@/types';
import { getPlatformLabel } from '@/utils/dataHelpers';
import { useAppStore } from '@/store/appStore';
import { clsx } from 'clsx';

interface FilterChipsProps {
  platforms: Platform[];
}

export const FilterChips = ({ platforms }: FilterChipsProps) => {
  const { selectedPlatform, setSelectedPlatform } = useAppStore();

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {platforms.map((platform: Platform) => {
        const isSelected = selectedPlatform === platform;
        return (
          <motion.button
            key={platform}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPlatform(platform)}
            className={clsx(
              'px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm',
              isSelected
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
            aria-pressed={isSelected}
          >
            {getPlatformLabel(platform)}
          </motion.button>
        );
      })}
    </div>
  );
};