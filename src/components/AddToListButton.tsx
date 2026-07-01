// src/components/AddToListButton.tsx
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
import type { UserProfileSummary } from '@/types';
import { IoCheckmark, IoAdd } from 'react-icons/io5';

interface AddToListButtonProps {
  profile: UserProfileSummary;
  variant?: 'icon' | 'full';
  className?: string;
}

export const AddToListButton = ({ 
  profile, 
  variant = 'full',
  className = ''
}: AddToListButtonProps) => {
  const { addProfile, removeProfile, isProfileSelected, selectedProfiles } = useAppStore();
  
  const isSelected = isProfileSelected(profile.user_id);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSelected) {
      removeProfile(profile.user_id);
      toast.success(`Removed @${profile.username} from list`);
    } else {
      if (selectedProfiles.length >= 50) {
        toast.error('Maximum 50 profiles allowed');
        return;
      }
      addProfile(profile);
      toast.success(`Added @${profile.username} to list`);
    }
  };
  
  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className={`p-2 rounded-full transition-colors ${
          isSelected 
            ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400'
        } ${className}`}
        aria-label={isSelected ? 'Remove from list' : 'Add to list'}
      >
        {isSelected ? <IoCheckmark size={20} /> : <IoAdd size={20} />}
      </motion.button>
    );
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
      } ${className}`}
    >
      {isSelected ? '✓ Added' : 'Add to List'}
    </motion.button>
  );
};