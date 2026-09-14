"use client";

import { useDeviceStore } from "@/store/useDeviceStore";

export default function Compass() {
  return (
    <div className="w-16 h-16 relative">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
        {/* Cardinal labels */}
        <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-accent-cyan">N</span>
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-slate-500">S</span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-slate-500">W</span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-slate-500">E</span>

        {/* Compass needle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28">
            {/* North arrow (cyan) */}
            <polygon points="14,3 11,14 14,12 17,14" fill="#00e5ff" opacity="0.9" />
            {/* South arrow (dark) */}
            <polygon points="14,25 11,14 14,16 17,14" fill="#334155" opacity="0.7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function ViewToggle() {
  const viewMode = useDeviceStore((s) => s.ui.viewMode);
  const setViewMode = useDeviceStore((s) => s.setViewMode);

  return (
    <div className="flex rounded-lg overflow-hidden border border-white/10">
      <button
        onClick={() => setViewMode("2d")}
        className={`px-3.5 py-1.5 text-xs font-medium transition-all ${
          viewMode === "2d"
            ? "bg-accent-cyan text-navy-900"
            : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
        }`}
      >
        2D
      </button>
      <button
        onClick={() => setViewMode("3d")}
        className={`px-3.5 py-1.5 text-xs font-medium transition-all ${
          viewMode === "3d"
            ? "bg-accent-cyan text-navy-900"
            : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
        }`}
      >
        3D
      </button>
    </div>
  );
}

export function WallsTransparencyToggle() {
  const wallsTransparent = useDeviceStore((s) => s.ui.wallsTransparent);
  const toggleWallsTransparency = useDeviceStore((s) => s.toggleWallsTransparency);

  return (
    <button
      onClick={toggleWallsTransparency}
      aria-pressed={wallsTransparent}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
        wallsTransparent
          ? "bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan"
          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
      }`}
    >
      {wallsTransparent ? "Solid Walls" : "Transparent Walls"}
    </button>
  );
}

export function CeilingToggle() {
  const ceilingVisible = useDeviceStore((s) => s.ui.ceilingVisible);
  const toggleCeiling = useDeviceStore((s) => s.toggleCeiling);

  return (
    <button
      onClick={toggleCeiling}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
        ceilingVisible
          ? "bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan"
          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
      }`}
    >
      {ceilingVisible ? "Hide Ceiling" : "Show Ceiling"}
    </button>
  );
}
