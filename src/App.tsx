import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";

function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      const module = await factory();
      sessionStorage.removeItem('chunk_retry_attempted');
      return module;
    } catch (error: any) {
      const msg = (error?.message || String(error)).toLowerCase();
      const isChunkError = 
        msg.includes('failed to fetch') ||
        msg.includes('dynamically imported module') ||
        msg.includes('importing a module script failed') ||
        msg.includes('load failed') ||
        msg.includes('mime type') ||
        msg.includes('unable to preload css') ||
        error?.name === 'ChunkLoadError';

      const alreadyAttempted = sessionStorage.getItem('chunk_retry_attempted');
      if (isChunkError && !alreadyAttempted && navigator.onLine) {
        sessionStorage.setItem('chunk_retry_attempted', 'true');
        window.location.reload();
        return new Promise(() => {}); // prevent crashing while reloading
      }
      throw error;
    }
  });
}

const Landing = lazyWithRetry(() => import("./components/Landing"));
import ArtistProfile from "./components/ArtistProfile";
const SuperAdmin = lazyWithRetry(() => import("./components/SuperAdmin"));
const DemoDashboard = lazyWithRetry(() => import("./components/DemoDashboard"));
const DemoPortfolio = lazyWithRetry(() => import("./components/DemoPortfolio"));
const DemoWaitlist = lazyWithRetry(() => import("./components/DemoWaitlist"));
const DemoMetrics = lazyWithRetry(() => import("./components/DemoMetrics"));

const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              
              <Route path="/demo/profile" element={<ArtistProfile />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/:id" element={<ArtistProfile />} />
              
              <Route path="/superadmin" element={<SuperAdmin />} />
              <Route path="/demo/dashboard" element={<DemoDashboard />} />
              <Route path="/:id/dashboard" element={<DemoDashboard />} />
              <Route path="/demo/portfolio" element={<DemoPortfolio />} />
              <Route path="/:id/portfolio" element={<DemoPortfolio />} />
              <Route path="/demo/waitlist" element={<DemoWaitlist />} />
              <Route path="/:id/waitlist" element={<DemoWaitlist />} />
              <Route path="/demo/metrics" element={<DemoMetrics />} />
              <Route path="/:id/metrics" element={<DemoMetrics />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  );
}
