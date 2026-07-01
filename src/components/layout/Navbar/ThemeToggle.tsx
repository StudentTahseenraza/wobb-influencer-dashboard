// src/components/layout/Navbar/ThemeToggle.tsx
import { motion } from 'framer-motion';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { useAppStore } from '@/store/appStore';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppStore();

  const handleToggle = () => {
    toggleTheme();
    // Force update
    const newTheme = theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <IoMoon size={20} className="text-yellow-400" />
        ) : (
          <IoSunny size={20} className="text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};