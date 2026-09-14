"use client";

import { useDeviceStore } from "@/store/useDeviceStore";

const TREND_ICONS = {
  up: "↑",
  down: "↓",
  stable: "→",
};

const TREND_COLORS = {
  up: "text-red-400",
  down: "text-emerald-400",
  stable: "text-slate-400",
};

// For power, up is bad (more consumption)
// For temperature, both directions can be concerning

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  unit: string;
  trend: "up" | "down" | "stable";
  invertTrend?: boolean; // if true, up=good, down=bad
}

function StatItem({ icon, label, value, unit, trend, invertTrend }: StatItemProps) {
  const trendColor = invertTrend
    ? trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-red-400"
      : "text-slate-400"
    : TREND_COLORS[trend];

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-cyan shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-400 leading-none mb-0.5">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-white font-semibold text-sm tabular-nums">{value}</span>
          <span className="text-slate-500 text-xs">{unit}</span>
          <span className={`text-xs font-medium ml-auto ${trendColor}`}>
            {TREND_ICONS[trend]}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── SVG icons ───────────────────────────────────────────────────────

const Co2Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);

const TempIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);

const HumidityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const PowerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// ─── Stat Panel ──────────────────────────────────────────────────────

export default function StatPanel() {
  const telemetry = useDeviceStore((s) => s.telemetry);
  const trends = useDeviceStore((s) => s.trends);

  return (
    <div className="absolute top-20 left-5 z-20">
      <div className="glass-panel w-52 p-3 space-y-0.5">
        <StatItem
          icon={<Co2Icon />}
          label="CO₂"
          value={Math.round(telemetry.co2_ppm)}
          unit="ppm"
          trend={trends.co2}
        />
        <div className="border-t border-white/5" />
        <StatItem
          icon={<TempIcon />}
          label="Temperature"
          value={telemetry.temperature_c.toFixed(1)}
          unit="°C"
          trend={trends.temperature}
        />
        <div className="border-t border-white/5" />
        <StatItem
          icon={<HumidityIcon />}
          label="Humidity"
          value={Math.round(telemetry.humidity_percent)}
          unit="%"
          trend={trends.humidity}
        />
        <div className="border-t border-white/5" />
        <StatItem
          icon={<PowerIcon />}
          label="Power"
          value={Math.round(telemetry.power_w)}
          unit="W"
          trend={trends.power}
          invertTrend
        />
      </div>
    </div>
  );
}
