// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
        >
          Go Back Home
        </Link>
      </motion.div>
    </Layout>
  );
}