// src/components/common/Button/Button.tsx

import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30 focus:ring-purple-500 dark:from-purple-500 dark:to-indigo-500",

    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",

    outline:
      "border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-500 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950/20",

    ghost:
      "text-gray-600 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-400 dark:hover:bg-gray-800",

    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",

    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5",
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}

      {children}
    </motion.button>
  );
};

export default Button;