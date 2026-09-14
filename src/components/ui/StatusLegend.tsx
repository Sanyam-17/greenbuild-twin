"use client";

const STATUSES = [
  { label: "Normal", color: "#22c55e" },
  { label: "Warning", color: "#f59e0b" },
  { label: "Critical", color: "#ef4444" },
  { label: "Offline", color: "#6b7280" },
];

export default function StatusLegend() {
  return (
    <div className="absolute top-5 right-5 z-20">
      <div className="glass-panel p-3 min-w-[140px]">
        <h3 className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-2.5">
          Device Status
        </h3>
        <div className="space-y-2">
          {STATUSES.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: s.color,
                  boxShadow: `0 0 6px ${s.color}60`,
                }}
              />
              <span className="text-xs text-slate-300">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
