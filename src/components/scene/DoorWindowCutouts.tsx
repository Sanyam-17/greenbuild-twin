"use client";

import { Html } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

// ─── Opening label positions ─────────────────────────────────────────

const ROOM_W = 8;
const ROOM_D = 6;
const ROOM_H = 3;
const halfW = ROOM_W / 2;
const halfD = ROOM_D / 2;

interface LabeledOpeningProps {
  label: string;
  position: [number, number, number];
  width: number;
  height: number;
  rotation: [number, number, number];
}

function LabeledOpening({ label, position, width, height, rotation }: LabeledOpeningProps) {
  const points = useMemo(() => {
    const hw = width / 2;
    const hh = height / 2;
    return new Float32Array([
      -hw, -hh, 0,
      hw, -hh, 0,
      hw, hh, 0,
      -hw, hh, 0,
      -hw, -hh, 0,
    ]);
  }, [width, height]);

  return (
    <group position={position} rotation={rotation}>
      {/* Glowing outline */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[points, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00e5ff" linewidth={2} />
      </line>

      {/* Label */}
      <Html position={[0, -height / 2 - 0.15, 0.05]} center distanceFactor={10}>
        <div
          style={{
            color: "#00e5ff",
            fontSize: "10px",
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            opacity: 0.7,
            textShadow: "0 0 8px rgba(0,229,255,0.5)",
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

export default function DoorWindowCutouts() {
  return (
    <group>
      {/* Door — front wall center */}
      <LabeledOpening
        label="Door"
        position={[0, 1.2, halfD + 0.02]}
        width={1.2}
        height={2.4}
        rotation={[0, 0, 0]}
      />

      {/* Window 1 — left wall */}
      <LabeledOpening
        label="Window 1"
        position={[-halfW - 0.02, 1.5, 0]}
        width={1.5}
        height={1.2}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Window 2 — right wall */}
      <LabeledOpening
        label="Window 2"
        position={[halfW + 0.02, 1.5, 0]}
        width={1.5}
        height={1.2}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
}
