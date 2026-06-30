import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, BufferGeometry, Float32BufferAttribute, InstancedMesh, Object3D, MeshStandardMaterial } from 'three';
import { useGameStore } from '../stores/gameStore';

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

const GROW_DURATION = 30 * 60 * 1000;

export function GrassPatch({
  season = 'spring',
  count = 300,
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
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const lastVisibleCount = useRef(0);

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

  useEffect(() => {
    if (!ref.current) return;
    const mesh = ref.current;
    for (let i = 0; i < blades.length; i++) {
      const b = blades[i];
      dummy.position.set(b.x, 0, b.z);
      dummy.rotation.set(b.tiltX, b.rotY, b.tiltZ);
      dummy.scale.set(1, b.height, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.count = 0;
    lastVisibleCount.current = 0;
  }, [blades, dummy]);

  useFrame(() => {
    if (!ref.current) return;
    const state = useGameStore.getState();
    if (state.phase !== 'playing') return;
    const progress = Math.min(1, state.elapsed / GROW_DURATION);
    const visibleCount = Math.floor(progress * count);

    if (visibleCount !== lastVisibleCount.current) {
      ref.current.count = visibleCount;
      lastVisibleCount.current = visibleCount;
    }
  });

  const color = SEASON_COLORS[season] ?? SEASON_COLORS.spring;

  return (
    <instancedMesh ref={ref} args={[bladeGeometry, undefined, count]}>
      <meshStandardMaterial color={color} roughness={0.85} metalness={0} side={DoubleSide} />
    </instancedMesh>
  );
}
