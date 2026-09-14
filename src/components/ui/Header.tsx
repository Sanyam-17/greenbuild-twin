"use client";

export default function Header() {
  return (
    <div className="absolute top-5 left-5 z-20">
      <div className="flex items-center gap-3">
        {/* Building icon */}
        <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M9 22V18h6v4" />
            <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight leading-tight">
            Building Digital Twin
          </h1>
          <p className="text-xs text-slate-400 tracking-wide">
            Live IoT Monitoring
          </p>
        </div>
      </div>
    </div>
  );
}
