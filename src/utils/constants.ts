// src/utils/constants.ts
export const APP_NAME = 'Influencer Search';
export const MAX_SELECTED_PROFILES = 50;
export const SEARCH_DEBOUNCE_DELAY = 300;
export const STORAGE_KEYS = {
  THEME: 'app-theme',
  SELECTED_PROFILES: 'selected-profiles',
  SEARCH_HISTORY: 'search-history',
} as const;

export const SOCIAL_PLATFORMS = {
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
} as const;

export const PLATFORM_COLORS = {
  instagram: '#E4405F',
  youtube: '#FF0000',
  tiktok: '#000000',
} as const;