"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useDeviceStore } from "@/store/useDeviceStore";
import Header from "@/components/ui/Header";
import StatPanel from "@/components/ui/StatPanel";
import StatusLegend from "@/components/ui/StatusLegend";
import ControlHints from "@/components/ui/ControlHints";
import Compass, { ViewToggle, CeilingToggle } from "@/components/ui/Compass";

// Dynamic import for R3F (no SSR — Three.js needs the DOM)
const RoomScene = dynamic(() => import("@/components/scene/RoomScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-navy-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        <p className="text-xs text-slate-500">Loading 3D Scene...</p>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  const startSimulation = useDeviceStore((s) => s.startSimulation);

  // Start mock data simulation on mount
  useEffect(() => {
    const cleanup = startSimulation();
    return cleanup;
  }, [startSimulation]);

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 3D Scene (full viewport canvas) */}
      <RoomScene />

      {/* ── Dashboard Chrome (HTML overlays) ──────────────────────── */}

      {/* Top-left: Header */}
      <div className="animate-fade-in">
        <Header />
      </div>

      {/* Left: Telemetry stat cards */}
      <div className="animate-fade-in-delay-1">
        <StatPanel />
      </div>

      {/* Top-right: Device status legend */}
      <div className="animate-fade-in-delay-1">
        <StatusLegend />
      </div>

      {/* Bottom-left: Control hints */}
      <div className="animate-fade-in-delay-2">
        <ControlHints />
      </div>

      {/* Bottom-right: Compass + View toggle + Ceiling toggle */}
      <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end gap-3 animate-fade-in-delay-3">
        <Compass />
        <ViewToggle />
        <CeilingToggle />
      </div>

      {/* Live indicator pulse */}
      <div className="absolute top-7 left-[210px] z-20 flex items-center gap-1.5 animate-fade-in">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] text-emerald-400/70 font-medium uppercase tracking-wider">
          Live
        </span>
      </div>
    </main>
  );
}
