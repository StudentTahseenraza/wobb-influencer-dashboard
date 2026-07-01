// src/components/common/Skeleton/SkeletonCard.tsx

export const SkeletonCard = () => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </div>
  );
};

export const SkeletonProfile = () => {
  return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="flex gap-6 items-start">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};