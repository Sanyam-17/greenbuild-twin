"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Device, DeviceStatus } from "@/lib/types";

const STATUS_COLORS: Record<DeviceStatus, string> = {
  normal: "#22c55e",
  warning: "#f59e0b",
  critical: "#ef4444",
  offline: "#6b7280",
};

interface DeviceMarkerProps {
  device: Device;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export default function DeviceMarker({
  device,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: DeviceMarkerProps) {
  const markerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const [localHover, setLocalHover] = useState(false);

  const color = STATUS_COLORS[device.status];
  const active = isSelected || isHovered || localHover;

  useFrame((state) => {
    if (markerRef.current) {
      const mat = markerRef.current.material as THREE.MeshStandardMaterial;
      if (device.status === "critical") {
        mat.emissiveIntensity = Math.sin(state.clock.elapsedTime * 4) * 0.35 + 0.8;
      } else if (device.status === "warning") {
        mat.emissiveIntensity = Math.sin(state.clock.elapsedTime * 2.5) * 0.25 + 0.65;
      } else {
        mat.emissiveIntensity = active ? 0.9 : 0.6;
      }
    }

    if (glowRef.current) {
      if (device.status === "critical") {
        glowRef.current.intensity = Math.sin(state.clock.elapsedTime * 4) * 0.6 + 1.2;
      } else {
        glowRef.current.intensity = active ? 1.2 : 0.7;
      }
    }
  });

  // Render high-detail low-poly device models
  const renderDetailedDeviceModel = () => {
    switch (device.type) {
      case "hvac":
        // Wall-mounted split AC unit
        return (
          <group position={[0, -0.25, 0]}>
            {/* Main AC body casing */}
            <RoundedBox args={[1.3, 0.45, 0.45]} radius={0.06} smoothness={4}>
              <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.4} />
            </RoundedBox>

            {/* Front louver vent slot */}
            <mesh position={[0, -0.12, 0.226]}>
              <planeGeometry args={[1.1, 0.08]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.12, 0.228]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[1.08, 0.015, 0.05]} />
              <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.6} />
            </mesh>

            {/* Brand/LED display bar */}
            <mesh position={[0.45, 0.08, 0.226]}>
              <planeGeometry args={[0.15, 0.06]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>

            {/* Status light LED */}
            <mesh position={[0.3, 0.08, 0.227]}>
              <circleGeometry args={[0.02, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>

            {/* Wall mounting plate back */}
            <mesh position={[0, 0, -0.23]}>
              <boxGeometry args={[1.32, 0.47, 0.02]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        );

      case "light":
        // Suspended ceiling LED panel
        return (
          <group position={[0, -0.2, 0]}>
            {/* Outer metallic frame */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.1, 0.12, 1.1]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.7} />
            </mesh>

            {/* Inner glowing LED diffuser face */}
            <mesh position={[0, -0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.95, 0.95]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>

            {/* Hanging suspension corner brackets */}
            {[-0.45, 0.45].map((x) =>
              [-0.45, 0.45].map((z) => (
                <mesh key={`${x}-${z}`} position={[x, 0.08, z]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
                  <meshStandardMaterial color="#64748b" metalness={0.8} />
                </mesh>
              ))
            )}
          </group>
        );

      case "plug":
        // Smart plug outlet box resting on floor
        return (
          <group position={[0, -0.18, 0]}>
            {/* Outlet casing */}
            <RoundedBox args={[0.45, 0.35, 0.4]} radius={0.06} smoothness={4}>
              <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.2} />
            </RoundedBox>

            {/* Front socket faceplate */}
            <mesh position={[0, 0, 0.201]}>
              <planeGeometry args={[0.38, 0.28]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
            </mesh>

            {/* Socket plug holes */}
            <mesh position={[-0.08, 0.04, 0.202]}>
              <circleGeometry args={[0.025, 12]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
            <mesh position={[0.08, 0.04, 0.202]}>
              <circleGeometry args={[0.025, 12]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
            <mesh position={[0, -0.05, 0.202]}>
              <circleGeometry args={[0.022, 12]} />
              <meshBasicMaterial color="#334155" />
            </mesh>

            {/* Power button on top */}
            <mesh position={[0, 0.176, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.6} />
            </mesh>
          </group>
        );

      case "sensor":
      default:
        // CO2 / Temp Sensor box
        return (
          <group position={[0, -0.2, 0]}>
            {/* Upper sensor body */}
            <RoundedBox args={[0.38, 0.38, 0.38]} radius={0.05} smoothness={4}>
              <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.3} />
            </RoundedBox>

            {/* Front sensor vent grill pattern */}
            <mesh position={[0, 0.04, 0.191]}>
              <planeGeometry args={[0.24, 0.14]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>

            {/* Small OLED status screen */}
            <mesh position={[0, -0.08, 0.191]}>
              <planeGeometry args={[0.22, 0.07]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>

            {/* Alert indicator dot */}
            <mesh position={[0.12, 0.12, 0.192]}>
              <circleGeometry args={[0.018, 12]} />
              <meshBasicMaterial color={color} />
            </mesh>
          </group>
        );
    }
  };

  const stemHeight =
    device.type === "hvac" ? 0.6 : device.type === "light" ? 0.45 : device.type === "plug" ? 0.55 : 0.95;

  return (
    <group position={[device.position[0], device.position[1], device.position[2]]}>
      {/* 3D appliance object */}
      {renderDetailedDeviceModel()}

      {/* Stainless steel pin stem extending up */}
      <mesh position={[0, stemHeight / 2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, stemHeight, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Top glowing marker sphere */}
      <group position={[0, stemHeight, 0]}>
        <mesh
          ref={markerRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setLocalHover(true);
            onHover(device.id);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setLocalHover(false);
            onHover(null);
            document.body.style.cursor = "default";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(device.id);
          }}
          scale={active ? 1.3 : 1.0}
        >
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Emissive glow light */}
        <pointLight ref={glowRef} color={color} intensity={0.9} distance={2.0} decay={2} />

        {/* Always-on HTML status badge chip (matching reference photo chip style) */}
        <Html position={[0.38, 0.05, 0]} style={{ pointerEvents: "auto" }} distanceFactor={9.5}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(device.id);
            }}
            className="cursor-pointer transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(10, 17, 36, 0.92)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: `1px solid ${active ? color : "rgba(255, 255, 255, 0.14)"}`,
              borderRadius: "8px",
              padding: "6px 12px",
              whiteSpace: "nowrap",
              fontFamily: "Inter, system-ui, sans-serif",
              boxShadow: active
                ? `0 0 18px ${color}60, 0 6px 16px rgba(0,0,0,0.5)`
                : "0 4px 14px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ color: "#f8fafc", fontWeight: 600, fontSize: "12px", lineHeight: "1.2" }}>
              {device.name}
            </div>
            <div
              style={{
                color: color,
                fontWeight: 700,
                fontSize: "10px",
                letterSpacing: "0.06em",
                marginTop: "2px",
                textTransform: "uppercase",
              }}
            >
              {device.statusLabel}
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
