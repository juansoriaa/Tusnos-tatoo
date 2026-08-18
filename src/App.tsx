import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Landing from "./components/Landing";

const ArtistProfile = lazy(() => import("./components/ArtistProfile"));
const SuperAdmin = lazy(() => import("./components/SuperAdmin"));
const DemoDashboard = lazy(() => import("./components/DemoDashboard"));
const DemoPortfolio = lazy(() => import("./components/DemoPortfolio"));
const DemoWaitlist = lazy(() => import("./components/DemoWaitlist"));
const DemoMetrics = lazy(() => import("./components/DemoMetrics"));

const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </HelmetProvider>
  );
}
