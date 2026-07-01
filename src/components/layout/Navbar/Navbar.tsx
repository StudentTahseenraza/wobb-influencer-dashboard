// src/components/layout/Navbar/Navbar.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { ThemeToggle } from './ThemeToggle';
import { IoList } from 'react-icons/io5';

export const Navbar = () => {
  const { selectedProfiles, toggleSidebar } = useAppStore();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Influencer Search
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="relative p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              aria-label="View selected profiles"
            >
              <IoList size={20} />
              {selectedProfiles.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">
                  {selectedProfiles.length}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};