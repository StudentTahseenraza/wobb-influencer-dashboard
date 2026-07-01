// src/components/dashboard/SearchBar/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearch, IoClose } from 'react-icons/io5';
import { useAppStore } from '@/store/appStore';
import { useDebounce } from '@/hooks/useDebounce';

export const SearchBar = () => {
  const { searchQuery, setSearchQuery, theme } = useAppStore();
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

  // Determine theme-based classes
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative max-w-2xl mx-auto"
    >
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <IoSearch 
            size={20} 
            className={`transition-colors duration-200 ${
              isFocused 
                ? 'text-purple-500 dark:text-purple-400' 
                : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search influencers by name or username... (Press /)"
          className={`w-full py-3.5 pl-11 pr-11 rounded-xl border-2 transition-all duration-200 outline-none ${
            isFocused
              ? "border-purple-500 ring-2 ring-purple-500/20"
              : isDark 
                ? "border-gray-700 bg-gray-800 text-white placeholder:text-gray-500" 
                : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
          }`}
          aria-label="Search influencers"
        />
        
        {/* Clear button */}
        <AnimatePresence>
          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setLocalQuery('')}
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Clear search"
            >
              <IoClose size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Keyboard shortcut hint */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-2 text-sm flex items-center gap-4 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <span>Press <kbd className={`px-2 py-1 rounded text-xs font-mono ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>Esc</kbd> to clear</span>
            <span className="text-xs opacity-60">
              {searchQuery ? `${searchQuery.length} characters` : 'Start typing to search'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};