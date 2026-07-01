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
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { toast } from "sonner";

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

  useEffect(() => {
    if (!username) {
      setError("No username provided");
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    loadProfileByUsername(username)
      .then((data: ProfileDetailResponse | null) => {
        if (isMounted) {
          if (data) {
            setProfileData(data);
          } else {
            setError(`Profile "${username}" not found`);
          }
          setLoading(false);
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
  }, [username]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `Check out ${username}`, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Profile link copied!');
    }
  };

  if (!username) {
    return (
      <>
        <Navbar />
        <Layout title="Invalid Profile">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Invalid profile URL</p>
            <Link to="/" className="text-purple-600 hover:underline">
              ← Back to search
            </Link>
          </div>
        </Layout>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Layout title={`Loading @${username}...`}>
          <SkeletonProfile />
        </Layout>
      </>
    );
  }

  if (error || !profileData) {
    return (
      <>
        <Navbar />
        <Layout title={`@${username}`}>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-red-600 mb-4">{error || `Profile "${username}" not found`}</p>
            <Link to="/" className="text-purple-600 hover:underline">
              ← Back to search
            </Link>
          </div>
        </Layout>
      </>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  return (
    <>
      <Navbar />
      <Layout title={user.fullname}>
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="text-sm text-purple-600 hover:underline mb-6 inline-block">
            ← Back to search
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar src={user.picture} size="xl" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    @{user.username}
                  </h2>
                  {user.is_verified && (
                    <Badge variant="verified">Verified</Badge>
                  )}
                  <Badge variant="primary">{platform}</Badge>
                </div>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {user.fullname}
                </p>

                {user.description && (
                  <p className="mt-3 text-gray-700 dark:text-gray-300">
                    {user.description}
                  </p>
                )}

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Followers</div>
                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                      {formatFollowersDetail(user.followers)}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Engagement</div>
                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                      {user.engagement_rate !== undefined && user.engagement_rate !== null
                        ? (user.engagement_rate * 100).toFixed(2) + "%"
                        : "N/A"}
                    </div>
                  </div>
                  {user.posts_count !== undefined && user.posts_count > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Posts</div>
                      <div className="font-bold text-lg text-gray-900 dark:text-white">
                        {user.posts_count}
                      </div>
                    </div>
                  )}
                  {user.avg_likes !== undefined && user.avg_likes > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Avg Likes</div>
                      <div className="font-bold text-lg text-gray-900 dark:text-white">
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
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      View Profile →
                    </a>
                  )}
                  
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
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