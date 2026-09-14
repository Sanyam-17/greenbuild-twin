import { create } from "zustand";
import { Device, DeviceStatus, TelemetrySnapshot, TelemetryTrends, UIState, ViewMode } from "@/lib/types";

// ─── Initial mock device data ────────────────────────────────────────

const INITIAL_DEVICES: Device[] = [
  {
    id: "dev-ac-01",
    name: "AC Unit",
    type: "hvac",
    status: "normal",
    position: [-3.7, 2.1, -1.2],
    reading: { label: "Power", value: 320, unit: "W" },
    statusLabel: "ON",
  },
  {
    id: "dev-light-01",
    name: "Ceiling Light",
    type: "light",
    status: "warning",
    position: [1.2, 2.6, -1.4],
    reading: { label: "Power", value: 85, unit: "W" },
    statusLabel: "HIGH USAGE",
  },
  {
    id: "dev-sensor-01",
    name: "CO₂ / Temp Sensor",
    type: "sensor",
    status: "critical",
    position: [0.5, 1.1, 0.2],
    reading: { label: "CO₂", value: 780, unit: "ppm" },
    statusLabel: "ALERT",
  },
  {
    id: "dev-plug-01",
    name: "Smart Plug",
    type: "plug",
    status: "offline",
    position: [2.3, 0.35, 1.6],
    reading: { label: "Power", value: 0, unit: "W" },
    statusLabel: "OFFLINE",
  },
];

const INITIAL_TELEMETRY: TelemetrySnapshot = {
  co2_ppm: 780,
  temperature_c: 24.2,
  humidity_percent: 56,
  power_w: 320,
};

// ─── Store interface ─────────────────────────────────────────────────

interface DeviceStore {
  // Data
  devices: Device[];
  telemetry: TelemetrySnapshot;
  trends: TelemetryTrends;

  // UI state
  ui: UIState;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  toggleCeiling: () => void;
  toggleWallsTransparency: () => void;
  selectDevice: (id: string | null) => void;
  hoverDevice: (id: string | null) => void;

  // Mock simulation
  startSimulation: () => () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function randomInRange(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function jitter(value: number, range: number, min: number, max: number, decimals = 1): number {
  const delta = (Math.random() - 0.5) * 2 * range;
  return parseFloat(Math.min(max, Math.max(min, value + delta)).toFixed(decimals));
}

function getTrend(oldVal: number, newVal: number): "up" | "down" | "stable" {
  const diff = newVal - oldVal;
  if (Math.abs(diff) < 0.5) return "stable";
  return diff > 0 ? "up" : "down";
}

function randomStatus(): DeviceStatus {
  const r = Math.random();
  if (r < 0.6) return "normal";
  if (r < 0.8) return "warning";
  if (r < 0.95) return "critical";
  return "offline";
}

const STATUS_LABELS: Record<DeviceStatus, string[]> = {
  normal: ["ON", "ACTIVE", "OK"],
  warning: ["HIGH USAGE", "WARN", "CHECK"],
  critical: ["ALERT", "CRITICAL", "FAULT"],
  offline: ["OFFLINE", "N/A", "DISCONNECTED"],
};

// ─── Store ───────────────────────────────────────────────────────────

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: INITIAL_DEVICES,
  telemetry: INITIAL_TELEMETRY,
  trends: {
    co2: "down",
    temperature: "down",
    humidity: "up",
    power: "up",
  },

  ui: {
    viewMode: "3d",
    ceilingVisible: false,
    wallsTransparent: false,
    selectedDeviceId: null,
    hoveredDeviceId: null,
  },

  setViewMode: (mode) =>
    set((s) => ({ ui: { ...s.ui, viewMode: mode } })),

  toggleCeiling: () =>
    set((s) => ({ ui: { ...s.ui, ceilingVisible: !s.ui.ceilingVisible } })),

  toggleWallsTransparency: () =>
    set((s) => ({ ui: { ...s.ui, wallsTransparent: !s.ui.wallsTransparent } })),

  selectDevice: (id) =>
    set((s) => ({
      ui: { ...s.ui, selectedDeviceId: s.ui.selectedDeviceId === id ? null : id },
    })),

  hoverDevice: (id) =>
    set((s) => ({ ui: { ...s.ui, hoveredDeviceId: id } })),

  startSimulation: () => {
    const interval = setInterval(() => {
      const state = get();
      const oldTelemetry = state.telemetry;

      // Jitter telemetry values within realistic bounds
      const newTelemetry: TelemetrySnapshot = {
        co2_ppm: jitter(oldTelemetry.co2_ppm, 25, 400, 1200, 0),
        temperature_c: jitter(oldTelemetry.temperature_c, 0.3, 18, 30, 1),
        humidity_percent: jitter(oldTelemetry.humidity_percent, 2, 30, 70, 0),
        power_w: jitter(oldTelemetry.power_w, 30, 0, 2000, 0),
      };

      const newTrends: TelemetryTrends = {
        co2: getTrend(oldTelemetry.co2_ppm, newTelemetry.co2_ppm),
        temperature: getTrend(oldTelemetry.temperature_c, newTelemetry.temperature_c),
        humidity: getTrend(oldTelemetry.humidity_percent, newTelemetry.humidity_percent),
        power: getTrend(oldTelemetry.power_w, newTelemetry.power_w),
      };

      // Occasionally flip a device status (10% chance per tick per device)
      const newDevices = state.devices.map((d) => {
        if (Math.random() < 0.1) {
          const newStatus = randomStatus();
          const labels = STATUS_LABELS[newStatus];
          return {
            ...d,
            status: newStatus,
            statusLabel: labels[Math.floor(Math.random() * labels.length)],
            reading: d.reading
              ? {
                  ...d.reading,
                  value:
                    d.type === "sensor"
                      ? newTelemetry.co2_ppm
                      : d.type === "hvac"
                      ? newTelemetry.power_w
                      : randomInRange(0, 200, 0),
                }
              : undefined,
          };
        }
        return d;
      });

      set({
        telemetry: newTelemetry,
        trends: newTrends,
        devices: newDevices,
      });
    }, 2500);

    return () => clearInterval(interval);
  },
}));
