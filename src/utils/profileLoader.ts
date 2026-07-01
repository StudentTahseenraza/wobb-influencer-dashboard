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
    let data = (result as { default?: unknown }).default ?? result;
    
    let userProfile = null;
    
    if (data && typeof data === 'object') {
      if (data.data && data.data.user_profile) {
        userProfile = data.data.user_profile;
      } else if (data.user_profile) {
        userProfile = data.user_profile;
      } else if (data.data && data.data.success && data.data.user_profile) {
        userProfile = data.data.user_profile;
      }
    }
    
    if (!userProfile) {
      return null;
    }
    
    const profile = {
      ...userProfile,
      picture: userProfile.picture || '',
      fullname: userProfile.fullname || userProfile.username || username,
      followers: userProfile.followers || 0,
      engagement_rate: userProfile.engagement_rate || 0,
      is_verified: userProfile.is_verified || false,
    };
    
    return {
      data: {
        success: true,
        user_profile: profile,
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