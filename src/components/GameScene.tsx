import { Canvas } from '@react-three/fiber';
import { FogExp2 } from 'three';
import { useGameStore } from '../stores/gameStore';
import { Pebble } from './Pebble';
import { Sky } from './Sky';
import { Ground } from './Ground';
import { EnvironmentFX } from './EnvironmentFX';
import { Landscape } from './Landscape';
import { Celestial } from './Celestial';
import { Mountains } from './Mountains';

function SceneFog() {
  const weather = useGameStore((s) => s.envSeed.weather);
  if (weather !== 'foggy') return null;
  return <primitive object={new FogExp2('#c0c8d0', 0.08)} attach="fog" />;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={0.6} />
      <directionalLight position={[-2, 1, -3]} intensity={0.2} />
      <SceneFog />

      <Sky />
      <Ground />
      <Mountains />
      <EnvironmentFX />
      <Landscape />
      <Celestial />
      <Pebble />
    </>
  );
}

export function GameScene() {
  const phase = useGameStore((s) => s.phase);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 2.0], fov: 45, near: 0.1, far: 200 }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor('#e8e4df');
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
