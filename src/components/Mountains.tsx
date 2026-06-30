import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Shape, ShapeGeometry, MeshStandardMaterial, Color, type Mesh, DoubleSide } from 'three';
import { useGameStore } from '../stores/gameStore';
import { STAGES } from '../data/stages';
import { applySeasonTint } from '../data/seasonColors';

type MountainLayer = { z: number; colorBase: string; opacity: number; heightMult: number; seed: number };

const LAYERS: MountainLayer[] = [
  { z: -1.5, colorBase: '#8a9aa8', opacity: 0.3, heightMult: 0.65, seed: 1 },
  { z: -0.8, colorBase: '#6a7a88', opacity: 0.5, heightMult: 0.8, seed: 2 },
  { z: -0.3, colorBase: '#4a5a68', opacity: 0.95, heightMult: 1.0, seed: 3 },
];

function createMountainGeometry(peaks: number, seed: number): ShapeGeometry {
  const rng = (i: number) => {
    const n = Math.sin(seed * 1000 + i * 37.1) * 43758.5453;
    return n - Math.floor(n);
  };
  const shape = new Shape();
  const halfW = 7;
  shape.moveTo(-halfW, -1.5);
  for (let i = 0; i <= peaks; i++) {
    const x = -halfW + (halfW * 2 / peaks) * i;
    const y = 0.4 + rng(i) * 1.1;
    shape.lineTo(x, y);
  }
  shape.lineTo(halfW, -1.5);
  shape.closePath();
  return new ShapeGeometry(shape);
}

function MountainLayer({ layer }: { layer: MountainLayer }) {
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => createMountainGeometry(14, layer.seed), [layer.seed]);

  useFrame(() => {
    if (!meshRef.current) return;
    const state = useGameStore.getState();
    const stageId = state.stage;
    const season = state.envSeed.season;
    const currentStage = STAGES.find((s) => s.id === stageId) ?? STAGES[0];

    const seasonTinted = applySeasonTint(layer.colorBase, season, 0.15);

    const mat = meshRef.current.material as MeshStandardMaterial;
    mat.color.lerp(new Color(seasonTinted), 0.02);
    const targetOpacity = layer.opacity * Math.max(0.4, currentStage.ambientIntensity * 1.8);
    mat.opacity += (targetOpacity - mat.opacity) * 0.01;
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
