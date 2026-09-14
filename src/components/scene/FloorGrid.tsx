"use client";

import { Grid } from "@react-three/drei";

export default function FloorGrid() {
  return (
    <group>
      {/* Glossy reflective floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial
          color="#182236"
          roughness={0.25}
          metalness={0.4}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Larger surrounding dark pedestal floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#080d1a"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* High contrast crisp architectural grid overlay */}
      <Grid
        args={[8, 6]}
        position={[0, 0.004, 0]}
        cellSize={0.5}
        cellThickness={0.8}
        cellColor="#38455e"
        sectionSize={2}
        sectionThickness={1.5}
        sectionColor="#506282"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />
    </group>
  );
}
