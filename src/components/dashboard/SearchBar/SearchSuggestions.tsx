// src/components/dashboard/SearchBar/SearchSuggestions.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { useState, useEffect } from 'react';

export const SearchSuggestions = () => {
  const { searchQuery, setSearchQuery } = useAppStore();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (query: string) => {
    if (!query || query.length < 2) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSelect = (query: string) => {
    setSearchQuery(query);
    saveSearch(query);
  };

  if (!searchQuery && recentSearches.length === 0) return null;

  return (
    <AnimatePresence>
      {!searchQuery && recentSearches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 max-w-2xl mx-auto"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recent searches:</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((query) => (
              <button
                key={query}
                onClick={() => handleSelect(query)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};