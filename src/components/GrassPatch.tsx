import { useMemo } from 'react';
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from 'three';

const bladeGeometry = new BufferGeometry();
const vertices = new Float32Array([
  -0.005, 0, 0,
   0.005, 0, 0,
   0,      1, 0,
]);
bladeGeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
bladeGeometry.setIndex([0, 1, 2]);
bladeGeometry.computeVertexNormals();

const SEASON_COLORS: Record<string, string> = {
  spring: '#4a8a3a',
  summer: '#5a9a4a',
  autumn: '#8a7a3a',
  winter: '#8a9a8a',
};

export function GrassPatch({
  season = 'spring',
  count = 50,
  minRadius = 0.35,
  maxRadius = 1.0,
  centerX = 0,
  centerZ = 0,
}: {
  season?: string;
  count?: number;
  minRadius?: number;
  maxRadius?: number;
  centerX?: number;
  centerZ?: number;
}) {
  const blades = useMemo(() => {
    const result: { x: number; z: number; rotY: number; tiltX: number; tiltZ: number; height: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = minRadius + Math.random() * (maxRadius - minRadius);
      result.push({
        x: centerX + Math.cos(angle) * dist,
        z: centerZ + Math.sin(angle) * dist,
        rotY: Math.random() * Math.PI * 2,
        tiltX: (Math.random() - 0.5) * 0.3,
        tiltZ: (Math.random() - 0.5) * 0.3,
        height: 0.04 + Math.random() * 0.1,
      });
    }
    return result;
  }, [count, minRadius, maxRadius, centerX, centerZ]);

  const color = SEASON_COLORS[season] ?? SEASON_COLORS.spring;

  return (
    <>
      {blades.map((b, i) => (
        <mesh key={i} geometry={bladeGeometry} position={[b.x, 0, b.z]} rotation={[b.tiltX, b.rotY, b.tiltZ]} scale={[1, b.height, 1]}>
          <meshStandardMaterial color={color} roughness={0.85} metalness={0} side={DoubleSide} />
        </mesh>
      ))}
    </>
  );
}
