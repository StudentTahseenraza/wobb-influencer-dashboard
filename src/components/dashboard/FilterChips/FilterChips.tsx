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
    <div className="flex flex-wrap gap-3 justify-center">
      {platforms.map((platform: Platform) => {
        const isSelected = selectedPlatform === platform;
        return (
          <motion.button
            key={platform}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPlatform(platform)}
            className={clsx(
              'filter-chip',
              isSelected && 'active'
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