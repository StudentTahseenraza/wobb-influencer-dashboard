// src/components/dashboard/SearchBar/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearch, IoClose } from 'react-icons/io5';
import { useAppStore } from '@/store/appStore';
import { useDebounce } from '@/hooks/useDebounce';

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useAppStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(localQuery, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative max-w-2xl mx-auto"
    >
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <IoSearch size={20} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search influencers by name or username... (Press /)"
          className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          aria-label="Search influencers"
        />
        
        <AnimatePresence>
          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setLocalQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <IoClose size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};