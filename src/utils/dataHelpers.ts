// src/utils/dataHelpers.ts
import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  if (!data || !data.accounts) {
    console.warn(`No data found for platform: ${platform}`);
    return [];
  }
  return data.accounts.map((item) => {
    const profile = item.account.user_profile;
    // Ensure we have required fields
    return {
      ...profile,
      picture: profile.picture || '',
      fullname: profile.fullname || profile.username || 'Unknown',
      followers: profile.followers || 0,
      engagement_rate: profile.engagement_rate || 0,
      is_verified: profile.is_verified || false,
    };
  });
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query || !query.trim()) return profiles;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return profiles.filter((p) => {
    const username = (p.username || '').toLowerCase();
    const fullname = (p.fullname || '').toLowerCase();
    const handle = (p.handle || '').toLowerCase();
    
    return username.includes(normalizedQuery) || 
           fullname.includes(normalizedQuery) || 
           handle.includes(normalizedQuery);
  });
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    instagram: "Instagram",
    youtube: "YouTube",
    tiktok: "TikTok"
  };
  return labels[platform] || platform;
}