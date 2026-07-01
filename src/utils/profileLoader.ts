// src/utils/profileLoader.ts
import type { ProfileDetailResponse } from "@/types";

// Dynamically import all profile JSON files
const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  if (!username) {
    return null;
  }

  // Try exact match first
  const exactPath = `../assets/data/profiles/${username}.json`;
  let loader = profileModules[exactPath];

  // If not found, try case-insensitive match
  if (!loader) {
    const keys = Object.keys(profileModules);
    const match = keys.find(key => {
      const fileName = key.split('/').pop()?.replace('.json', '') || '';
      return fileName.toLowerCase() === username.toLowerCase();
    });
    if (match) {
      loader = profileModules[match];
    }
  }

  // If still not found, try contains match
  if (!loader) {
    const keys = Object.keys(profileModules);
    const match = keys.find(key => {
      const fileName = key.split('/').pop()?.replace('.json', '') || '';
      return fileName.toLowerCase().includes(username.toLowerCase()) || 
             username.toLowerCase().includes(fileName.toLowerCase());
    });
    if (match) {
      loader = profileModules[match];
    }
  }

  if (!loader) {
    return null;
  }

  try {
    const result = await loader();
    const data = (result as { default?: unknown }).default ?? result;
    
    let userProfile = null;
    
    // Type-safe check for data structure
    if (data && typeof data === 'object') {
      // Check for { data: { user_profile: {...} } }
      const dataObj = data as Record<string, unknown>;
      
      if (dataObj.data && typeof dataObj.data === 'object') {
        const innerData = dataObj.data as Record<string, unknown>;
        if (innerData.user_profile && typeof innerData.user_profile === 'object') {
          userProfile = innerData.user_profile;
        }
      }
      
      // Check for { user_profile: {...} }
      if (!userProfile && dataObj.user_profile && typeof dataObj.user_profile === 'object') {
        userProfile = dataObj.user_profile;
      }
      
      // Check for { data: { success: true, user_profile: {...} } }
      if (!userProfile && dataObj.data && typeof dataObj.data === 'object') {
        const innerData = dataObj.data as Record<string, unknown>;
        if (innerData.success && innerData.user_profile && typeof innerData.user_profile === 'object') {
          userProfile = innerData.user_profile;
        }
      }
    }
    
    if (!userProfile) {
      return null;
    }
    
    // Ensure required fields exist
    const profile = {
      ...userProfile as Record<string, unknown>,
      picture: (userProfile as Record<string, unknown>)?.picture || '',
      fullname: (userProfile as Record<string, unknown>)?.fullname || 
                (userProfile as Record<string, unknown>)?.username || username,
      followers: (userProfile as Record<string, unknown>)?.followers || 0,
      engagement_rate: (userProfile as Record<string, unknown>)?.engagement_rate || 0,
      is_verified: (userProfile as Record<string, unknown>)?.is_verified || false,
    };
    
    return {
      data: {
        success: true,
        user_profile: profile as any,
      },
    } as ProfileDetailResponse;
    
  } catch (error) {
    console.error(`Error loading profile ${username}:`, error);
    return null;
  }
}

export function getProfilePaths(): string[] {
  return Object.keys(profileModules).map(path => {
    const filename = path.split('/').pop() || '';
    return filename.replace('.json', '');
  });
}

export function getAvailableProfiles(): string[] {
  return getProfilePaths();
}