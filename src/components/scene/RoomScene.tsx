"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import GlassWalls from "./GlassWalls";
import FloorGrid from "./FloorGrid";
import DoorWindowCutouts from "./DoorWindowCutouts";
import DeviceMarker from "./DeviceMarker";
import { useDeviceStore } from "@/store/useDeviceStore";

// ─── Scene lighting ──────────────────────────────────────────────────

function SceneLighting() {
  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={0.25} color="#4a6fa5" />

      {/* Main directional — slightly warm, from upper-right */}
      <directionalLight
        position={[6, 8, 4]}
        intensity={0.6}
        color="#c5d5f0"
        castShadow={false}
      />

      {/* Rim light — cool, from behind-left for glass edge highlights */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.35}
        color="#00bcd4"
      />

      {/* Fill from below for glass wall visibility */}
      <directionalLight
        position={[0, -2, 0]}
        intensity={0.1}
        color="#1a237e"
      />

      {/* Subtle point lights near walls for rim effect */}
      <pointLight position={[-4.5, 1.5, 0]} intensity={0.3} color="#00e5ff" distance={5} decay={2} />
      <pointLight position={[4.5, 1.5, 0]} intensity={0.3} color="#00e5ff" distance={5} decay={2} />
    </>
  );
}

// ─── Camera controller ───────────────────────────────────────────────

function CameraController() {
  const viewMode = useDeviceStore((s) => s.ui.viewMode);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      if (viewMode === "2d") {
        // Top-down orthographic-like view
        controlsRef.current.object.position.set(0, 12, 0.01);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.enableRotate = false;
        controlsRef.current.update();
      } else {
        // Isometric-leaning perspective
        controlsRef.current.object.position.set(8, 7, 8);
        controlsRef.current.target.set(0, 1, 0);
        controlsRef.current.enableRotate = true;
        controlsRef.current.update();
      }
    }
  }, [viewMode]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={5}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2.1}
      target={[0, 1, 0]}
    />
  );
}

// ─── Device markers layer ────────────────────────────────────────────

function DeviceMarkers() {
  const devices = useDeviceStore((s) => s.devices);
  const selectedId = useDeviceStore((s) => s.ui.selectedDeviceId);
  const hoveredId = useDeviceStore((s) => s.ui.hoveredDeviceId);
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const hoverDevice = useDeviceStore((s) => s.hoverDevice);

  return (
    <group>
      {devices.map((device) => (
        <DeviceMarker
          key={device.id}
          device={device}
          isSelected={selectedId === device.id}
          isHovered={hoveredId === device.id}
          onSelect={selectDevice}
          onHover={hoverDevice}
        />
      ))}
    </group>
  );
}

// ─── Main scene ──────────────────────────────────────────────────────

export default function RoomScene() {
  const ceilingVisible = useDeviceStore((s) => s.ui.ceilingVisible);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{
          position: [8, 7, 8],
          fov: 35,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: "#0a1128" }}
        onPointerMissed={() => {
          useDeviceStore.getState().selectDevice(null);
        }}
      >
        <Suspense fallback={null}>
          <SceneLighting />
          <CameraController />
          <FloorGrid />
          <GlassWalls ceilingVisible={ceilingVisible} />
          <DoorWindowCutouts />
          <DeviceMarkers />
          <fog attach="fog" args={["#0a1128", 15, 30]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
