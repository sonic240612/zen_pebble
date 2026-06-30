import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PlaneGeometry, MeshStandardMaterial, Color, type Mesh } from 'three';
import { useGameStore } from '../stores/gameStore';
import { STAGES } from '../data/stages';
import { getDirtColor } from '../data/seasonColors';
import { createDirtTexture } from '../utils/textures';

export function Ground() {
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => new PlaneGeometry(20, 20), []);

  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      color: '#7a6a4a',
      roughness: 0.95,
      metalness: 0,
      map: createDirtTexture(),
    });
    return mat;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const state = useGameStore.getState();
    const stage = state.stage;
    const season = state.envSeed.season;
    const currentStage = STAGES.find((s) => s.id === stage) ?? STAGES[1];

    const dirtColor = getDirtColor(season, currentStage.ambientIntensity);

    (meshRef.current.material as MeshStandardMaterial)
      .color.lerp(new Color(dirtColor), 0.03);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} />
  );
}
