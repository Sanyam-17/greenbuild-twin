// ─── Device & Telemetry Types ───────────────────────────────────────
// Designed to map cleanly to a future Prisma schema.

export type DeviceStatus = "normal" | "warning" | "critical" | "offline";

export type DeviceType = "hvac" | "light" | "plug" | "sensor";

export interface DeviceReading {
  label: string;
  value: number;
  unit: string;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  position: [number, number, number]; // [x, y, z] in room-local coords
  reading?: DeviceReading;
  statusLabel?: string; // e.g. "ON", "ALERT", "HIGH USAGE", "OFFLINE"
}

export interface TelemetrySnapshot {
  co2_ppm: number;
  temperature_c: number;
  humidity_percent: number;
  power_w: number;
}

export interface TelemetryTrends {
  co2: "up" | "down" | "stable";
  temperature: "up" | "down" | "stable";
  humidity: "up" | "down" | "stable";
  power: "up" | "down" | "stable";
}

// ─── UI State ───────────────────────────────────────────────────────

export type ViewMode = "3d" | "2d";

export interface UIState {
  viewMode: ViewMode;
  ceilingVisible: boolean;
  selectedDeviceId: string | null;
  hoveredDeviceId: string | null;
}
