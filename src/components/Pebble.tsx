import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { IcosahedronGeometry, MeshStandardMaterial, Color, type Mesh } from 'three';
import { useGameStore } from '../stores/gameStore';

export function Pebble() {
  const meshRef = useRef<Mesh>(null);
  const phase = useGameStore((s) => s.phase);
  const elapsed = useGameStore((s) => s.elapsed);

  const geometry = useMemo(() => {
    const geo = new IcosahedronGeometry(0.35, 3);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const scale = 1 + (Math.sin(x * 3.7 + y * 5.1 + z * 2.3) * 0.15)
                       + (Math.cos(y * 4.2 + z * 3.8 + x * 1.9) * 0.08);
      pos.setXYZ(i, x * scale, y * scale, z * scale);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  const material = useMemo(() => {
    return new MeshStandardMaterial({
      color: new Color('#8a8a8a'),
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true,
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
    <mesh ref={meshRef} geometry={geometry} material={material} />
  );
}
