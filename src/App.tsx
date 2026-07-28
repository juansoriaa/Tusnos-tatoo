import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Landing from "./components/Landing";
import Preload from "./components/Preload";
import ArtistProfile from "./components/ArtistProfile";
import SuperAdmin from "./components/SuperAdmin";
import DemoDashboard from "./components/DemoDashboard";
import DemoPortfolio from "./components/DemoPortfolio";
import DemoWaitlist from "./components/DemoWaitlist";
import DemoMetrics from "./components/DemoMetrics";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo/preload" element={<Preload />} />
          <Route path="/demo/preload/:id" element={<Preload />} />
          <Route path="/demo/profile" element={<ArtistProfile />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/turnos-tatoo/:id" element={<ArtistProfile />} />
          <Route path="/turnos-tatoo/:id/preload" element={<Preload />} />
          <Route path="/superadmin" element={<SuperAdmin />} />
          <Route path="/demo/dashboard" element={<DemoDashboard />} />
          <Route path="/demo/portfolio" element={<DemoPortfolio />} />
          <Route path="/demo/waitlist" element={<DemoWaitlist />} />
          <Route path="/demo/metrics" element={<DemoMetrics />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
