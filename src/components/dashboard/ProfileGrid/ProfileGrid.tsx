// src/components/dashboard/ProfileGrid/ProfileGrid.tsx
import type { Platform, UserProfileSummary } from '@/types';
import { ProfileCard } from '../ProfileCard/ProfileCard';
import { SkeletonCard } from '@/components/common/Skeleton/SkeletonCard';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { AnimatePresence } from 'framer-motion';

interface ProfileGridProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  loading?: boolean;
}

export const ProfileGrid = ({
  profiles,
  platform,
  searchQuery,
  loading = false,
}: ProfileGridProps) => {
  if (loading) {
    return (
      <div className="space-y-3 max-w-2xl mx-auto">
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No profiles found"
        description={searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
      />
    );
  }

  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      <AnimatePresence mode="popLayout">
        {profiles.map((profile: UserProfileSummary, index: number) => (
          <ProfileCard
            key={profile.user_id}
            profile={profile}
            platform={platform}
            searchQuery={searchQuery}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};