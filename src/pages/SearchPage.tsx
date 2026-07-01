// src/pages/SearchPage.tsx
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { SelectedProfilesSidebar } from "@/components/layout/Sidebar/SelectedProfilesSidebar";
import { Hero } from "@/components/dashboard/Hero/Hero";
import { SearchBar } from "@/components/dashboard/SearchBar/SearchBar";
import { SearchSuggestions } from "@/components/dashboard/SearchBar/SearchSuggestions";
import { FilterChips } from "@/components/dashboard/FilterChips/FilterChips";
import { ProfileGrid } from "@/components/dashboard/ProfileGrid/ProfileGrid";
import { useAppStore } from "@/store/appStore";
import { PLATFORMS, extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export default function SearchPage() {
  const { selectedPlatform, searchQuery, setLoading, isLoading } = useAppStore();
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const allProfiles = extractProfiles(selectedPlatform);
      const filtered = filterProfiles(allProfiles, searchQuery);
      setProfiles(filtered);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedPlatform, searchQuery, setLoading]);

  return (
    <>
      <Navbar />
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Hero />
          <SearchBar />
          <SearchSuggestions />
          
          <div className="mt-8">
            <FilterChips platforms={PLATFORMS} />
          </div>
          
          <div className="mt-8">
            <ProfileGrid
              profiles={profiles}
              platform={selectedPlatform}
              searchQuery={searchQuery}
              loading={isLoading}
            />
          </div>
        </div>
      </Layout>
      <SelectedProfilesSidebar />
    </>
  );
}