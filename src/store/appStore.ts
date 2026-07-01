// src/store/appStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Platform, UserProfileSummary } from '@/types';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPlatform: Platform;
  setSelectedPlatform: (platform: Platform) => void;
  
  // Selected Profiles
  selectedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  clearSelectedProfiles: () => void;
  isProfileSelected: (userId: string) => boolean;
  
  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      // Search & Filters
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedPlatform: 'instagram' as Platform,
      setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
      
      // Selected Profiles
      selectedProfiles: [],
      addProfile: (profile) => {
        const { selectedProfiles } = get();
        const exists = selectedProfiles.some(p => p.user_id === profile.user_id);
        if (!exists) {
          set({ selectedProfiles: [...selectedProfiles, profile] });
        }
      },
      removeProfile: (userId) => {
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(p => p.user_id !== userId)
        }));
      },
      clearSelectedProfiles: () => set({ selectedProfiles: [] }),
      isProfileSelected: (userId) => {
        return get().selectedProfiles.some(p => p.user_id === userId);
      },
      
      // UI State
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'influencer-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        selectedProfiles: state.selectedProfiles,
        searchQuery: state.searchQuery,
        selectedPlatform: state.selectedPlatform,
      }),
    }
  )
);