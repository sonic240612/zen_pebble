import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { SphereGeometry, MeshStandardMaterial, Color, type Mesh } from 'three';
import { useGameStore } from '../stores/gameStore';

export function Pebble() {
  const meshRef = useRef<Mesh>(null);
  const phase = useGameStore((s) => s.phase);

  const geometry = useMemo(() => {
    const geo = new SphereGeometry(0.28, 64, 48);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const n = Math.sqrt(x * x + y * y + z * z);
      const nx = x / n, ny = y / n, nz = z / n;

      const noise = Math.sin(nx * 2.1 + ny * 1.3 + nz * 2.5) * 0.08
                  + Math.cos(nx * 3.7 - nz * 4.1) * 0.05
                  + Math.sin(ny * 2.8 + nz * 1.9) * 0.06;

      const bottomFlatness = 1 - Math.pow(Math.max(0, -ny), 2) * 0.2;
      const topPeak = 1 + Math.pow(Math.max(0, ny), 3) * 0.1;

      const r = (1 + noise) * bottomFlatness * topPeak;
      pos.setXYZ(i, x * r * 1.05, y * r * 0.85, z * r * 0.98);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  const material = useMemo(() => {
    return new MeshStandardMaterial({
      color: new Color('#888888'),
      roughness: 0.7,
      metalness: 0.02,
      flatShading: false,
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    if (phase === 'failing') {
      const failElapsed = performance.now() - useGameStore.getState().elapsed;
      const progress = Math.min(failElapsed / 1500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      meshRef.current.scale.setScalar(1 + eased * 0.15);

      const mat = meshRef.current.material as MeshStandardMaterial;
      mat.opacity = 1 - eased * 0.3;
      mat.transparent = true;
    } else {
      meshRef.current.scale.setScalar(1);
      const mat = meshRef.current.material as MeshStandardMaterial;
      mat.opacity = 1;
      mat.transparent = false;
    }

    if (phase === 'failed') {
      const mat = meshRef.current.material as MeshStandardMaterial;
      mat.opacity = 1;
      mat.transparent = false;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} position={[0, -0.25, 0]} />
  );
}
