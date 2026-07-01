// src/App.tsx
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { NotFound } from "@/pages/NotFound";

// Lazy load pages for performance
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const ProfileDetailPage = lazy(() => import("@/pages/ProfileDetailPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ✅ FIX: Scroll restoration
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/profile/:username" element={<ProfileDetailPage />} />
              {/* ✅ FIX: 404 handling */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
          <Toaster 
            position="top-right"
            richColors
            toastOptions={{
              duration: 3000,
              className: 'font-sans',
            }}
          />
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;