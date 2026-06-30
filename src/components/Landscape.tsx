import { useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';

function PineForest() {
  const trees = useMemo(() => {
    const result: { x: number; z: number; h: number; s: number }[] = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.2 + Math.random() * 1.5;
      result.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        h: 0.3 + Math.random() * 0.6,
        s: 0.08 + Math.random() * 0.1,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {trees.map((t, i) => (
        <mesh key={i} position={[t.x, -0.3, t.z]}>
          <coneGeometry args={[t.s, t.h, 5]} />
          <meshStandardMaterial color="#2d4a2e" roughness={0.9} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

function BambooForest() {
  const stalks = useMemo(() => {
    const result: { x: number; z: number; h: number }[] = [];
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.0 + Math.random() * 2.0;
      result.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        h: 0.6 + Math.random() * 0.8,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {stalks.map((s, i) => (
        <mesh key={i} position={[s.x, -0.3, s.z]}>
          <cylinderGeometry args={[0.012, 0.02, s.h, 4]} />
          <meshStandardMaterial color="#5a7a4a" roughness={0.8} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Lakeside() {
  return (
    <group>
      <mesh position={[0, -0.48, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 1.5]} />
        <meshStandardMaterial
          color="#4a7a8a"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>
      <mesh position={[0, -0.48, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 1.5]} />
        <meshStandardMaterial
          color="#4a7a8a"
          transparent
          opacity={0.15}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

function DesertDunes() {
  const dunes = useMemo(() => {
    const result: { x: number; z: number; w: number; h: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.8 + Math.random() * 1.8;
      result.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        w: 0.4 + Math.random() * 0.6,
        h: 0.1 + Math.random() * 0.2,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {dunes.map((d, i) => (
        <mesh key={i} position={[d.x, -0.5, d.z]} rotation={[Math.random() * 0.3, Math.random() * Math.PI, 0]}>
          <sphereGeometry args={[d.w, 8, 6]} />
          <meshStandardMaterial color="#c4a874" roughness={0.9} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

export function Landscape() {
  const landscape = useGameStore((s) => s.envSeed.landscape);

  switch (landscape) {
    case 'pine_forest':
      return <PineForest />;
    case 'bamboo_forest':
      return <BambooForest />;
    case 'lakeside':
      return <Lakeside />;
    case 'desert_dunes':
      return <DesertDunes />;
    default:
      return null;
  }
}
