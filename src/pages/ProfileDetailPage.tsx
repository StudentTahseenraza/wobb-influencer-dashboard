// src/pages/ProfileDetailPage.tsx
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { SelectedProfilesSidebar } from "@/components/layout/Sidebar/SelectedProfilesSidebar";
import { Avatar } from "@/components/common/Avatar/Avatar";
import { Badge } from "@/components/common/Badge/Badge";
import { AddToListButton } from "@/components/AddToListButton";
import { SkeletonProfile } from "@/components/common/Skeleton/SkeletonCard";
import type { FullUserProfile, ProfileDetailResponse, UserProfileSummary } from "@/types";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { extractProfiles } from "@/utils/dataHelpers";
import { toast } from "sonner";
import { IoWarning } from "react-icons/io5";

function formatFollowersDetail(count: number) {
  if (!count && count !== 0) return "N/A";
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export default function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [basicProfile, setBasicProfile] = useState<FullUserProfile | null>(null);
  const [isBasicInfo, setIsBasicInfo] = useState(false);

  useEffect(() => {
    if (!username || username === 'undefined') {
      setError("No username provided");
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setBasicProfile(null);
    setIsBasicInfo(false);

    loadProfileByUsername(username)
      .then((data: ProfileDetailResponse | null) => {
        if (isMounted) {
          if (data) {
            setProfileData(data);
            setIsBasicInfo(false);
            setLoading(false);
          } else {
            const basic = getProfileFromSearch(username, platform);
            if (basic) {
              setBasicProfile(basic);
              setIsBasicInfo(true);
              setError("Detailed profile not available. Showing basic information from search results.");
            } else {
              setError(`Profile "${username}" not found`);
            }
            setLoading(false);
          }
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          console.error("Error loading profile:", err);
          setError("Failed to load profile. Please try again.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [username, platform]);

  const getProfileFromSearch = (username: string, platform: string): FullUserProfile | null => {
    try {
      const platforms = [platform, 'instagram', 'youtube', 'tiktok'];
      for (const p of platforms) {
        try {
          const profiles = extractProfiles(p as any);
          const found = profiles.find((prof: UserProfileSummary) => 
            prof.username.toLowerCase() === username.toLowerCase()
          );
          if (found) {
            return {
              ...found,
              description: found.fullname || `${found.username} on ${p}`,
              posts_count: 0, // UserProfileSummary doesn't have posts_count
              avg_likes: 0,   // UserProfileSummary doesn't have avg_likes
              picture: found.picture || '',
            };
          }
        } catch {
          continue;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `Check out ${username}`, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Profile link copied!');
    }
  };

  if (!username || username === 'undefined') {
    return (
      <>
        <Navbar />
        <Layout title="Invalid Profile">
          <div className="max-w-3xl mx-auto">
            <div className="card p-8 text-center">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Invalid Profile
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                No username provided
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                ← Back to search
              </Link>
            </div>
          </div>
        </Layout>
        <SelectedProfilesSidebar />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Layout title={`Loading @${username}...`}>
          <div className="max-w-3xl mx-auto">
            <SkeletonProfile />
          </div>
        </Layout>
        <SelectedProfilesSidebar />
      </>
    );
  }

  if (isBasicInfo && basicProfile) {
    const user = basicProfile;
    const avatarSrc = user.picture || '';
    
    return (
      <>
        <Navbar />
        <Layout title={user.fullname || user.username}>
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="text-sm text-purple-600 hover:underline mb-6 inline-block">
              ← Back to search
            </Link>

            <div className="card p-6 md:p-8">
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
                <IoWarning className="text-yellow-500 dark:text-yellow-400 text-xl mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    ⚠️ Detailed Profile Not Available
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5">
                    Showing basic information from search results. For full details, please check back later.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar 
                  src={avatarSrc} 
                  alt={user.fullname || user.username || 'Profile'}
                  size="xl"
                  fallback={user.username?.substring(0, 2).toUpperCase() || '??'}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                      @{user.username}
                    </h2>
                    {user.is_verified && (
                      <Badge variant="verified">Verified</Badge>
                    )}
                    <Badge variant="primary">{platform}</Badge>
                    <Badge variant="warning" size="sm">Basic Info</Badge>
                  </div>
                  
                  <p className="text-lg text-[var(--text-secondary)] mt-1">
                    {user.fullname || user.username}
                  </p>

                  {user.description && (
                    <p className="mt-3 text-[var(--text-secondary)]">
                      {user.description}
                    </p>
                  )}

                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Followers</div>
                      <div className="font-bold text-lg text-[var(--text-primary)]">
                        {formatFollowersDetail(user.followers)}
                      </div>
                    </div>
                    {user.engagement_rate !== undefined && user.engagement_rate > 0 && (
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Engagement</div>
                        <div className="font-bold text-lg text-[var(--text-primary)]">
                          {(user.engagement_rate * 100).toFixed(2)}%
                        </div>
                      </div>
                    )}
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Platform</div>
                      <div className="font-bold text-lg text-[var(--text-primary)] capitalize">
                        {platform}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {user.url && (
                      <a
                        href={user.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)] transition-colors text-sm font-medium"
                      >
                        View Profile →
                      </a>
                    )}
                    
                    <button
                      onClick={handleShare}
                      className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)] transition-colors text-sm font-medium"
                    >
                      Share Profile
                    </button>
                    
                    <AddToListButton profile={user} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
        <SelectedProfilesSidebar />
      </>
    );
  }

  if (error && !basicProfile) {
    return (
      <>
        <Navbar />
        <Layout title={`@${username}`}>
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="text-sm text-purple-600 hover:underline mb-6 inline-block">
              ← Back to search
            </Link>

            <div className="card p-8 text-center">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Profile Not Found
              </h2>
              <p className="text-[var(--text-secondary)] mb-2">
                {error}
              </p>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Try searching for another influencer
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                ← Back to search
              </Link>
            </div>
          </div>
        </Layout>
        <SelectedProfilesSidebar />
      </>
    );
  }

  if (profileData) {
    const user: FullUserProfile = profileData.data.user_profile;
    const avatarSrc = user.picture || '';

    return (
      <>
        <Navbar />
        <Layout title={user.fullname || user.username}>
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="text-sm text-purple-600 hover:underline mb-6 inline-block">
              ← Back to search
            </Link>

            <div className="card p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar 
                  src={avatarSrc} 
                  alt={user.fullname || user.username || 'Profile'}
                  size="xl"
                  fallback={user.username?.substring(0, 2).toUpperCase() || '??'}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                      @{user.username}
                    </h2>
                    {user.is_verified && (
                      <Badge variant="verified">Verified</Badge>
                    )}
                    <Badge variant="primary">{platform}</Badge>
                  </div>
                  
                  <p className="text-lg text-[var(--text-secondary)] mt-1">
                    {user.fullname || user.username}
                  </p>

                  {user.description && (
                    <p className="mt-3 text-[var(--text-secondary)]">
                      {user.description}
                    </p>
                  )}

                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Followers</div>
                      <div className="font-bold text-lg text-[var(--text-primary)]">
                        {formatFollowersDetail(user.followers)}
                      </div>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Engagement</div>
                      <div className="font-bold text-lg text-[var(--text-primary)]">
                        {user.engagement_rate !== undefined && user.engagement_rate !== null
                          ? (user.engagement_rate * 100).toFixed(2) + "%"
                          : "N/A"}
                      </div>
                    </div>
                    {user.posts_count !== undefined && user.posts_count > 0 && (
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Posts</div>
                        <div className="font-bold text-lg text-[var(--text-primary)]">
                          {user.posts_count.toLocaleString()}
                        </div>
                      </div>
                    )}
                    {user.avg_likes !== undefined && user.avg_likes > 0 && (
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-center">
                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Avg Likes</div>
                        <div className="font-bold text-lg text-[var(--text-primary)]">
                          {formatFollowersDetail(user.avg_likes)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {user.url && (
                      <a
                        href={user.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)] transition-colors text-sm font-medium"
                      >
                        View Profile →
                      </a>
                    )}
                    
                    <button
                      onClick={handleShare}
                      className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)] transition-colors text-sm font-medium"
                    >
                      Share Profile
                    </button>
                    
                    <AddToListButton profile={user} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
        <SelectedProfilesSidebar />
      </>
    );
  }

  return null;
}