// src/components/dashboard/Hero/Hero.tsx
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12"
    >
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
        Find Your Perfect Influencer
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Discover and curate top creators across Instagram, YouTube, and TikTok
      </p>
    </motion.div>
  );
};