import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Shape, ShapeGeometry, MeshStandardMaterial, Color, type Mesh, DoubleSide } from 'three';
import { useGameStore } from '../stores/gameStore';
import { STAGES } from '../data/stages';
import { applySeasonTint } from '../data/seasonColors';

type MountainLayer = { z: number; colorBase: string; opacity: number; heightMult: number };

const LAYERS: MountainLayer[] = [
  { z: -6, colorBase: '#8a9aa8', opacity: 0.25, heightMult: 0.7 },
  { z: -3.5, colorBase: '#6a7a88', opacity: 0.35, heightMult: 0.85 },
  { z: -2, colorBase: '#4a5a68', opacity: 0.55, heightMult: 1.0 },
];

function createMountainGeometry(peaks: number): ShapeGeometry {
  const shape = new Shape();
  const startX = -5;
  shape.moveTo(startX, -1);
  for (let i = 0; i <= peaks; i++) {
    const x = startX + (10 / peaks) * i;
    const y = 0.15 + Math.random() * 0.55;
    shape.lineTo(x, y);
  }
  shape.lineTo(5, -1);
  shape.closePath();
  return new ShapeGeometry(shape);
}

function MountainLayer({ layer }: { layer: MountainLayer }) {
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => createMountainGeometry(12), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const state = useGameStore.getState();
    const stageId = state.stage;
    const season = state.envSeed.season;
    const currentStage = STAGES.find((s) => s.id === stageId) ?? STAGES[0];

    const seasonTinted = applySeasonTint(layer.colorBase, season, 0.15);

    const mat = meshRef.current.material as MeshStandardMaterial;
    mat.color.lerp(new Color(seasonTinted), 0.02);
    mat.opacity += (layer.opacity * currentStage.ambientIntensity * 1.5 - mat.opacity) * 0.01;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, -0.5, layer.z]}
      scale={[1, layer.heightMult, 1]}
    >
      <meshStandardMaterial
        color={layer.colorBase}
        transparent
        opacity={layer.opacity}
        side={DoubleSide}
        roughness={1}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  );
}

export function Mountains() {
  return (
    <>
      {LAYERS.map((layer, i) => (
        <MountainLayer key={i} layer={layer} />
      ))}
    </>
  );
}
