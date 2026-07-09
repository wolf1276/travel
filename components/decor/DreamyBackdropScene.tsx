'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';

const COLORS = ['#e8a3b3', '#c68ea0', '#b7c9a3', '#c9b8d9', '#e0b09a'];

function Bits({ count }: { count: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4] as [
          number,
          number,
          number,
        ],
        scale: 0.12 + Math.random() * 0.22,
        color: COLORS[i % COLORS.length],
        speed: 0.6 + Math.random() * 0.8,
      })),
    [count],
  );

  return (
    <>
      {bits.map((bit) => (
        <Float key={bit.id} speed={bit.speed} rotationIntensity={0.6} floatIntensity={1.4}>
          <mesh position={bit.position} scale={bit.scale}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={bit.color} transparent opacity={0.55} roughness={0.6} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export function DreamyBackdropScene({ count = 16 }: { count?: number }) {
  return (
    <Canvas
      dpr={1}
      gl={{ antialias: false, alpha: true }}
      camera={{ position: [0, 0, 8], fov: 35 }}
      className="!absolute !inset-0"
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={0.5} />
      <Bits count={count} />
    </Canvas>
  );
}
