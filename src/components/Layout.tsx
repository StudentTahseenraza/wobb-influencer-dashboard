// src/components/Layout.tsx
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}