// src/components/dashboard/ProfileCard/ProfileCard.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Platform, UserProfileSummary } from '@/types';
import { Avatar } from '@/components/common/Avatar/Avatar';
import { AddToListButton } from '@/components/AddToListButton';
import { formatFollowers } from '@/utils/formatters';
import { toast } from 'sonner';

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  index: number;
}

export const ProfileCard = ({
  profile,
  platform,
  index,
}: ProfileCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleCopyUsername = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(profile.username);
    toast.success('Username copied!');
  };

  const avatarSrc = profile.picture || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      className="profile-card"
    >
      <div className="flex items-center gap-4">
        <Avatar 
          src={avatarSrc} 
          alt={profile.fullname || profile.username}
          size="md"
          fallback={profile.username?.substring(0, 2).toUpperCase()}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[var(--text-primary)] truncate">
              @{profile.username}
            </span>
            {profile.is_verified && (
              <span className="badge badge-verified">✓ Verified</span>
            )}
            <span className="badge badge-platform">{platform}</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] truncate">
            {profile.fullname || profile.username}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {formatFollowers(profile.followers || 0)} followers
            </span>
            {profile.engagement_rate !== undefined && profile.engagement_rate > 0 && (
              <span className="badge badge-engagement">
                {(profile.engagement_rate * 100).toFixed(1)}% engagement
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopyUsername}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Copy username"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </motion.button>
          <AddToListButton profile={profile} variant="icon" />
        </div>
      </div>
    </motion.div>
  );
};