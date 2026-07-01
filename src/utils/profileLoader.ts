// src/utils/profileLoader.ts
import type { ProfileDetailResponse } from "@/types";

// Dynamically import all profile JSON files
const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];

  if (!loader) {
    console.warn(`Profile not found: ${username}`);
    return null;
  }

  try {
    const result = await loader();
    const data = (result as { default?: ProfileDetailResponse }).default ?? result;
    return data as ProfileDetailResponse;
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