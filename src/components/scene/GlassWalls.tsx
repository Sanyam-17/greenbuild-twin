"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";

// ─── Wall segment builder ────────────────────────────────────────────
// Builds individual wall planes with cutouts for doors/windows by
// creating multiple segments around the openings.

interface WallSegmentProps {
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

function WallSegment({ width, height, position, rotation }: WallSegmentProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position} rotation={rotation}>
      {/* Glass wall plane */}
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color="#263a70"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.2}
          side={THREE.DoubleSide}
          envMapIntensity={1.0}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          transmission={0.8}
          ior={1.4}
        />
      </mesh>
      {/* Edge glow outline */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.PlaneGeometry(width, height)]}
        />
        <lineBasicMaterial color="#7dd3fc" linewidth={2} transparent opacity={0.95} />
      </lineSegments>
    </group>
  );
}

// ─── Opening outline (door / window) ─────────────────────────────────

interface OpeningOutlineProps {
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
  label: string;
}

function OpeningOutline({ width, height, position, rotation, label }: OpeningOutlineProps) {
  const points = useMemo(() => {
    const hw = width / 2;
    const hh = height / 2;
    return [
      new THREE.Vector3(-hw, -hh, 0),
      new THREE.Vector3(hw, -hh, 0),
      new THREE.Vector3(hw, hh, 0),
      new THREE.Vector3(-hw, hh, 0),
      new THREE.Vector3(-hw, -hh, 0),
    ];
  }, [width, height]);

  return (
    <group position={position} rotation={rotation}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#7dd3fc" linewidth={2} transparent opacity={1} />
      </line>
    </group>
  );
}

// ─── Full glass room ─────────────────────────────────────────────────

const ROOM_W = 8;   // x-axis
const ROOM_D = 6;   // z-axis
const ROOM_H = 3;   // y-axis

const DOOR_W = 1.2;
const DOOR_H = 2.4;
const WINDOW_W = 1.5;
const WINDOW_H = 1.2;
const WINDOW_Y = 1.5; // center height of windows

export default function GlassWalls({ ceilingVisible }: { ceilingVisible: boolean }) {
  const halfW = ROOM_W / 2;
  const halfD = ROOM_D / 2;
  const halfH = ROOM_H / 2;

  return (
    <group>
      {/* ── FRONT WALL (z = +halfD) — has door ────────────────────── */}
      {/* Left of door */}
      <WallSegment
        width={(ROOM_W - DOOR_W) / 2}
        height={ROOM_H}
        position={[-(DOOR_W / 2 + (ROOM_W - DOOR_W) / 4), halfH, halfD]}
        rotation={[0, 0, 0]}
      />
      {/* Right of door */}
      <WallSegment
        width={(ROOM_W - DOOR_W) / 2}
        height={ROOM_H}
        position={[(DOOR_W / 2 + (ROOM_W - DOOR_W) / 4), halfH, halfD]}
        rotation={[0, 0, 0]}
      />
      {/* Above door */}
      <WallSegment
        width={DOOR_W}
        height={ROOM_H - DOOR_H}
        position={[0, DOOR_H + (ROOM_H - DOOR_H) / 2, halfD]}
        rotation={[0, 0, 0]}
      />
      {/* Door opening outline */}
      <OpeningOutline
        width={DOOR_W}
        height={DOOR_H}
        position={[0, DOOR_H / 2, halfD + 0.01]}
        rotation={[0, 0, 0]}
        label="Door"
      />

      {/* ── BACK WALL (z = -halfD) — solid ────────────────────────── */}
      <WallSegment
        width={ROOM_W}
        height={ROOM_H}
        position={[0, halfH, -halfD]}
        rotation={[0, Math.PI, 0]}
      />

      {/* ── LEFT WALL (x = -halfW) — has window ──────────────────── */}
      {/* Below window */}
      <WallSegment
        width={ROOM_D}
        height={WINDOW_Y - WINDOW_H / 2}
        position={[-halfW, (WINDOW_Y - WINDOW_H / 2) / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      {/* Above window */}
      <WallSegment
        width={ROOM_D}
        height={ROOM_H - (WINDOW_Y + WINDOW_H / 2)}
        position={[-halfW, (WINDOW_Y + WINDOW_H / 2) + (ROOM_H - (WINDOW_Y + WINDOW_H / 2)) / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      {/* Left of window */}
      <WallSegment
        width={(ROOM_D - WINDOW_W) / 2}
        height={WINDOW_H}
        position={[-halfW, WINDOW_Y, -(WINDOW_W / 2 + (ROOM_D - WINDOW_W) / 4)]}
        rotation={[0, Math.PI / 2, 0]}
      />
      {/* Right of window */}
      <WallSegment
        width={(ROOM_D - WINDOW_W) / 2}
        height={WINDOW_H}
        position={[-halfW, WINDOW_Y, (WINDOW_W / 2 + (ROOM_D - WINDOW_W) / 4)]}
        rotation={[0, Math.PI / 2, 0]}
      />
      {/* Window 1 outline */}
      <OpeningOutline
        width={WINDOW_W}
        height={WINDOW_H}
        position={[-halfW - 0.01, WINDOW_Y, 0]}
        rotation={[0, Math.PI / 2, 0]}
        label="Window 1"
      />

      {/* ── RIGHT WALL (x = +halfW) — has window ─────────────────── */}
      {/* Below window */}
      <WallSegment
        width={ROOM_D}
        height={WINDOW_Y - WINDOW_H / 2}
        position={[halfW, (WINDOW_Y - WINDOW_H / 2) / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {/* Above window */}
      <WallSegment
        width={ROOM_D}
        height={ROOM_H - (WINDOW_Y + WINDOW_H / 2)}
        position={[halfW, (WINDOW_Y + WINDOW_H / 2) + (ROOM_H - (WINDOW_Y + WINDOW_H / 2)) / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {/* Left of window */}
      <WallSegment
        width={(ROOM_D - WINDOW_W) / 2}
        height={WINDOW_H}
        position={[halfW, WINDOW_Y, -(WINDOW_W / 2 + (ROOM_D - WINDOW_W) / 4)]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {/* Right of window */}
      <WallSegment
        width={(ROOM_D - WINDOW_W) / 2}
        height={WINDOW_H}
        position={[halfW, WINDOW_Y, (WINDOW_W / 2 + (ROOM_D - WINDOW_W) / 4)]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {/* Window 2 outline */}
      <OpeningOutline
        width={WINDOW_W}
        height={WINDOW_H}
        position={[halfW + 0.01, WINDOW_Y, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        label="Window 2"
      />

      {/* ── CEILING (toggle-able) ─────────────────────────────────── */}
      {ceilingVisible && (
        <WallSegment
          width={ROOM_W}
          height={ROOM_D}
          position={[0, ROOM_H, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      )}
    </group>
  );
}
