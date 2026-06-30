import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PlaneGeometry, MeshStandardMaterial, Color, type Mesh } from 'three';
import { useGameStore } from '../stores/gameStore';
import { STAGES } from '../data/stages';

export function Ground() {
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => new PlaneGeometry(20, 20), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const stage = useGameStore.getState().stage;
    const currentStage = STAGES.find((s) => s.id === stage) ?? STAGES[1];

    (meshRef.current.material as MeshStandardMaterial)
      .color.lerp(new Color(currentStage.fogColor).multiplyScalar(0.4), 0.01);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <meshStandardMaterial color="#5d6d7e" roughness={0.9} metalness={0} />
    </mesh>
  );
}
