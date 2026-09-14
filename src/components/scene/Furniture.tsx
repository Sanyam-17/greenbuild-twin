"use client";

import * as THREE from "three";

function GlassBlock({ position, scale, color = "#77e8ff" }: { position: [number, number, number]; scale: [number, number, number]; color?: string }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={scale} />
      <meshPhysicalMaterial color={color} transparent opacity={0.48} roughness={0.18} metalness={0.28} transmission={0.55} ior={1.35} clearcoat={1} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...scale)]} />
        <lineBasicMaterial color="#9df5ff" transparent opacity={0.8} />
      </lineSegments>
    </mesh>
  );
}

function Bed() {
  return (
    <group position={[-2.15, 0, -1.55]}>
      <GlassBlock position={[0, 0.32, 0]} scale={[2.5, 0.28, 1.65]} />
      <GlassBlock position={[0, 0.58, -0.56]} scale={[2.5, 0.38, 0.18]} color="#baf8ff" />
      <GlassBlock position={[-0.65, 0.52, 0.1]} scale={[0.78, 0.12, 0.62]} color="#d5fbff" />
      <GlassBlock position={[0.2, 0.52, 0.1]} scale={[0.78, 0.12, 0.62]} color="#d5fbff" />
    </group>
  );
}

function Sofa() {
  return (
    <group position={[2.05, 0, -1.62]}>
      <GlassBlock position={[0, 0.38, 0]} scale={[2.15, 0.35, 0.78]} color="#63d9ec" />
      <GlassBlock position={[0, 0.92, -0.27]} scale={[2.15, 0.85, 0.22]} color="#8deaf7" />
      <GlassBlock position={[-0.96, 0.65, 0]} scale={[0.2, 0.75, 0.82]} />
      <GlassBlock position={[0.96, 0.65, 0]} scale={[0.2, 0.75, 0.82]} />
    </group>
  );
}

function Desk() {
  return (
    <group position={[2.1, 0, 1.75]}>
      <GlassBlock position={[0, 1.05, 0]} scale={[1.9, 0.14, 0.72]} color="#baf8ff" />
      {[-0.72, 0.72].map((x) => <GlassBlock key={x} position={[x, 0.52, 0]} scale={[0.12, 1, 0.58]} />)}
      <GlassBlock position={[0, 1.3, -0.26]} scale={[1.15, 0.55, 0.08]} color="#8deaf7" />
      <GlassBlock position={[0, 1.2, 0.06]} scale={[0.46, 0.05, 0.28]} color="#d5fbff" />
    </group>
  );
}

function Cabinet() {
  return (
    <group position={[-2.7, 0, 1.75]}>
      <GlassBlock position={[0, 0.75, 0]} scale={[0.72, 1.5, 0.58]} color="#5ac9dc" />
      {[0.1, 0.48, 0.86, 1.24].map((y) => <mesh key={y} position={[0, y, -0.31]}><boxGeometry args={[0.54, 0.025, 0.025]} /><meshBasicMaterial color="#d7fcff" /></mesh>)}
    </group>
  );
}

export default function Furniture() {
  return <group><Bed /><Sofa /><Desk /><Cabinet /></group>;
}
