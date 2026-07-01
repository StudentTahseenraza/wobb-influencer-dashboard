// src/components/layout/Sidebar/SelectedProfilesSidebar.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { Avatar } from '@/components/common/Avatar/Avatar';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { IoClose, IoTrash, IoDownload } from 'react-icons/io5';
import { toast } from 'sonner';
import { useEffect } from 'react';
import type { UserProfileSummary } from '@/types';

export const SelectedProfilesSidebar = () => {
  const { 
    selectedProfiles, 
    sidebarOpen, 
    toggleSidebar,
    removeProfile,
    clearSelectedProfiles,
    setSidebarOpen
  } = useAppStore();

  const handleClearAll = () => {
    if (selectedProfiles.length === 0) return;
    clearSelectedProfiles();
    toast.success('Cleared all selected profiles');
  };

  const handleExport = () => {
    if (selectedProfiles.length === 0) {
      toast.warning('No profiles to export');
      return;
    }
    const data = JSON.stringify(selectedProfiles, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected-influencers-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('List exported successfully!');
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
          />
          
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-[var(--bg-card)] shadow-2xl z-50 flex flex-col border-l border-[var(--border-color)]"
          >
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Selected Profiles
                <span className="ml-2 text-sm font-normal text-[var(--text-secondary)]">
                  ({selectedProfiles.length})
                </span>
              </h2>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[var(--text-primary)]"
              >
                <IoClose size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedProfiles.length === 0 ? (
                <EmptyState
                  icon="📋"
                  title="No profiles selected"
                  description="Browse influencers and add them to your list"
                />
              ) : (
                selectedProfiles.map((profile: UserProfileSummary, index: number) => (
                  <motion.div
                    key={profile.user_id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <Avatar 
                      src={profile.picture} 
                      alt={profile.fullname || profile.username}
                      size="sm"
                      fallback={profile.username?.substring(0, 2).toUpperCase()}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--text-primary)] truncate">
                        @{profile.username}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] truncate">
                        {profile.fullname}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeProfile(profile.user_id);
                        toast.success(`Removed @${profile.username}`);
                      }}
                      className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-[var(--text-secondary)]"
                      aria-label={`Remove ${profile.username}`}
                    >
                      <IoClose size={20} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-[var(--border-color)] space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handleClearAll}
                  disabled={selectedProfiles.length === 0}
                  className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[var(--text-primary)]"
                >
                  <IoTrash className="w-4 h-4" />
                  Clear All
                </button>
                <button
                  onClick={handleExport}
                  disabled={selectedProfiles.length === 0}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <IoDownload className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};