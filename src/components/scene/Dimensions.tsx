"use client";

import { Html, Line } from "@react-three/drei";

function Dimension({ start, end, label, offset }: { start: [number, number, number]; end: [number, number, number]; label: string; offset: [number, number, number] }) {
  const a: [number, number, number] = [start[0] + offset[0], start[1] + offset[1], start[2] + offset[2]];
  const b: [number, number, number] = [end[0] + offset[0], end[1] + offset[1], end[2] + offset[2]];
  return <group><Line points={[a, b]} color="#00e5ff" lineWidth={1.2} transparent opacity={0.9} /><Line points={[[a[0], a[1] - 0.12, a[2]], [a[0], a[1] + 0.12, a[2]]]} color="#00e5ff" lineWidth={1} /><Line points={[[b[0], b[1] - 0.12, b[2]], [b[0], b[1] + 0.12, b[2]]]} color="#00e5ff" lineWidth={1} /><Html position={[(a[0] + b[0]) / 2, a[1] + 0.08, (a[2] + b[2]) / 2]} center distanceFactor={9}><span className="dimension-label">{label}</span></Html></group>;
}

export default function Dimensions() {
  return <group>
    <Dimension start={[-4, 0, 3]} end={[4, 0, 3]} label="8.00 m" offset={[0, 0.06, 0]} />
    <Dimension start={[4.5, 0, -3]} end={[4.5, 0, 3]} label="6.00 m" offset={[0, 0.06, 0]} />
    <Dimension start={[-2.15, 0, -2.5]} end={[0.35, 0, -2.5]} label="2.50 m" offset={[0, 0.04, 0]} />
  </group>;
}
