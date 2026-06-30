import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Color, FogExp2, type DirectionalLight } from 'three';
import { useGameStore } from '../stores/gameStore';
import { STAGES, getStageProgress } from '../data/stages';
import { Pebble } from './Pebble';
import { Sky } from './Sky';
import { Ground } from './Ground';
import { EnvironmentFX } from './EnvironmentFX';
import { Landscape } from './Landscape';
import { Celestial } from './Celestial';

function SceneLighting() {
  const ambientRef = useRef(null);
  const sunRef = useRef<DirectionalLight>(null);
  const fillRef = useRef<DirectionalLight>(null);

  useFrame(() => {
    const state = useGameStore.getState();
    const stageId = state.stage;
    const elapsed = state.elapsed;
    const stageIdx = STAGES.findIndex((s) => s.id === stageId);
    const currentStage = STAGES[stageIdx] ?? STAGES[0];
    const nextStage = stageIdx < STAGES.length - 1 ? STAGES[stageIdx + 1] : STAGES[0];
    const progress = getStageProgress(elapsed);

    const ambIntensity = currentStage.ambientIntensity + (nextStage.ambientIntensity - currentStage.ambientIntensity) * progress;
    const sunIntensity = currentStage.sunIntensity + (nextStage.sunIntensity - currentStage.sunIntensity) * progress;

    if (ambientRef.current) {
      (ambientRef.current as any).intensity += (ambIntensity - (ambientRef.current as any).intensity) * 0.05;
    }
    if (sunRef.current) {
      sunRef.current.intensity += (sunIntensity - sunRef.current.intensity) * 0.05;
    }

    const weather = state.envSeed.weather;
    const weatherTint = weather === 'rainy' ? '#8899cc' : weather === 'snowy' ? '#ddeeff' : weather === 'foggy' ? '#bbbbcc' : weather === 'cloudy' ? '#eeeedd' : '#ffffff';
    if (ambientRef.current) {
      (ambientRef.current as any).color.lerp(new Color(weatherTint), 0.01);
    }

    const sunAngle = (elapsed % (48 * 60 * 60 * 1000)) / (48 * 60 * 60 * 1000) * Math.PI * 2;
    if (sunRef.current) {
      sunRef.current.position.x = Math.cos(sunAngle) * 5;
      sunRef.current.position.y = Math.sin(sunAngle) * 5 + 1;
      sunRef.current.position.z = Math.sin(sunAngle * 0.7) * 3;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.4} color="#ffffff" />
      <directionalLight ref={sunRef} position={[3, 5, 2]} intensity={0.6} color="#ffffff" />
      <directionalLight ref={fillRef} position={[-2, 1, -3]} intensity={0.2} color="#aaccff" />
    </>
  );
}

function SceneFog() {
  const weather = useGameStore((s) => s.envSeed.weather);
  if (weather !== 'foggy') return null;
  return <primitive object={new FogExp2('#c0c8d0', 0.08)} attach="fog" />;
}

function Scene() {
  return (
    <>
      <SceneLighting />
      <SceneFog />

      <Sky />
      <Ground />
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
