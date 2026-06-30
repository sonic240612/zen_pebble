import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PlaneGeometry, MeshStandardMaterial, Color, type Mesh } from 'three';
import { useGameStore } from '../stores/gameStore';
import { STAGES } from '../data/stages';
import { applySeasonTint } from '../data/seasonColors';

export function Ground() {
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => new PlaneGeometry(20, 20), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const state = useGameStore.getState();
    const stage = state.stage;
    const season = state.envSeed.season;
    const currentStage = STAGES.find((s) => s.id === stage) ?? STAGES[1];

    const seasonGround = applySeasonTint(currentStage.fogColor, season, 0.2);

    (meshRef.current.material as MeshStandardMaterial)
      .color.lerp(new Color(seasonGround).multiplyScalar(0.4), 0.03);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <meshStandardMaterial color="#5d6d7e" roughness={0.9} metalness={0} />
    </mesh>
  );
}
