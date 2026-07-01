// src/App.tsx
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/common/ErrorBoundary/ErrorBoundary";
import { LoadingSpinner } from "./components/common/LoadingSpinner/LoadingSpinner";
import { useAppStore } from "@/store/appStore";

const SearchPage = lazy(() => import("@/pages/SearchPage"));
const ProfileDetailPage = lazy(() => import("@/pages/ProfileDetailPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { theme } = useAppStore();

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster 
        position="top-right"
        richColors
        toastOptions={{
          duration: 3000,
          className: 'font-sans',
        }}
      />
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;