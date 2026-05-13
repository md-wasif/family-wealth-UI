"use client";

import React, { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import PinScreen from "@/components/features/security/pin-screen";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user session exists (skipped PIN or already entered)
    const session = sessionStorage.getItem("fw-session");
    if (session) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (pin: string | null) => {
    // Store session in sessionStorage (expires on tab close)
    sessionStorage.setItem("fw-session", "active");
    setIsAuthenticated(true);
  };

  if (loading) return null;

  if (!isAuthenticated) {
    return <PinScreen onSuccess={handleAuthSuccess} />;
  }

  return <DashboardShell />;
}
