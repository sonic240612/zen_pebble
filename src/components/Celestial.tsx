import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  SphereGeometry, MeshStandardMaterial, Color, AdditiveBlending,
  PointsMaterial, BufferGeometry, Float32BufferAttribute, Points,
  type Mesh,
} from 'three';
import { useGameStore } from '../stores/gameStore';
import { STAGES } from '../data/stages';

const CYCLE = 48 * 60 * 60 * 1000;

function SunMoon() {
  const sunRef = useRef<Mesh>(null);
  const moonRef = useRef<Mesh>(null);
  const [sunGeo, sunMat] = useMemo(() => [
    new SphereGeometry(0.06, 16, 16),
    new MeshStandardMaterial({ color: '#ffdd88', emissive: '#ffaa44', emissiveIntensity: 2 }),
  ], []);
  const [moonGeo, moonMat] = useMemo(() => [
    new SphereGeometry(0.04, 12, 12),
    new MeshStandardMaterial({ color: '#ddeeff', emissive: '#8899bb', emissiveIntensity: 0.3, roughness: 0.8 }),
  ], []);

  useFrame(() => {
    const state = useGameStore.getState();
    const elapsed = state.elapsed;
    const stageId = state.stage;
    const weather = state.envSeed.weather;

    const sunAngle = (elapsed % CYCLE) / CYCLE * Math.PI * 2;
    const sunX = Math.cos(sunAngle) * 5;
    const sunY = Math.sin(sunAngle) * 5 + 1;
    const sunZ = Math.sin(sunAngle * 0.7) * 3;

    const isNight = stageId >= 6;
    const isCloudy = weather === 'cloudy' || weather === 'rainy' || weather === 'foggy';

    if (sunRef.current) {
      sunRef.current.position.set(sunX, sunY, sunZ);
      const visible = sunY > -0.5 && !isCloudy;
      sunRef.current.visible = visible;
    }

    if (moonRef.current) {
      const moonAngle = sunAngle + Math.PI;
      const moonX = Math.cos(moonAngle) * 4;
      const moonY = Math.sin(moonAngle) * 3 + 0.5;
      const moonZ = Math.sin(moonAngle * 0.7) * 2.5;
      moonRef.current.position.set(moonX, moonY, moonZ);
      moonRef.current.visible = isNight && !isCloudy;
    }
  });

  return (
    <>
      <mesh ref={sunRef} geometry={sunGeo} material={sunMat} />
      <mesh ref={moonRef} geometry={moonGeo} material={moonMat} />
    </>
  );
}

function Stars() {
  const ref = useRef<Points>(null);

  const { geometry, material } = useMemo(() => {
    const count = 600;
    const geo = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 30 + Math.random() * 40;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi));
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = 0.02 + Math.random() * 0.04;
    }

    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('size', new Float32BufferAttribute(sizes, 1));

    const mat = new PointsMaterial({
      color: new Color('#ffffff'),
      size: 0.03,
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame(() => {
    const stageId = useGameStore.getState().stage;
    const isNight = stageId >= 6;
    material.opacity += (isNight ? 0.8 : 0) - material.opacity * 0.02;
  });

  return <primitive object={new Points(geometry, material)} ref={ref} />;
}

export function Celestial() {
  return (
    <>
      <SunMoon />
      <Stars />
    </>
  );
}
