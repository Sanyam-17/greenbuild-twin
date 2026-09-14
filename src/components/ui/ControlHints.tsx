"use client";

const CONTROLS = [
  {
    label: "Rotate",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M2.5 22v-6h6" />
        <path d="M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
      </svg>
    ),
  },
  {
    label: "Zoom",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
      </svg>
    ),
  },
  {
    label: "Pan",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3" />
        <path d="M2 12h20M12 2v20" />
      </svg>
    ),
  },
];

export default function ControlHints() {
  return (
    <div className="absolute bottom-5 left-5 z-20">
      <div className="glass-panel p-3 space-y-2.5">
        {CONTROLS.map((c) => (
          <div key={c.label} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-accent-cyan">
              {c.icon}
            </div>
            <span className="text-xs text-slate-300">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
