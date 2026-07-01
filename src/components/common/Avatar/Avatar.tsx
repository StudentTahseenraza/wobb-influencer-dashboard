// src/components/common/Avatar/Avatar.tsx
import { clsx } from 'clsx';
import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

export const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  fallback,
}: AvatarProps) => {
  const [error, setError] = useState(false);
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };
  
  // Generate fallback text from alt
  const getFallbackText = () => {
    if (fallback) return fallback;
    const words = alt.split(' ');
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return alt.substring(0, 2).toUpperCase();
  };

  // If image fails to load or no src, show fallback
  if (error || !src || src === '') {
    return (
      <div 
        className={clsx(
          'avatar-fallback rounded-full flex items-center justify-center font-bold',
          sizes[size],
          className
        )}
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
        }}
      >
        {getFallbackText()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        'rounded-full object-cover border-2 border-gray-200 dark:border-gray-700',
        sizes[size],
        className
      )}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};