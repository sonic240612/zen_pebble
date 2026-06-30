import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  SphereGeometry, MeshStandardMaterial, MeshBasicMaterial, Color, AdditiveBlending,
  PointsMaterial, BufferGeometry, Float32BufferAttribute, Points, type Mesh,
} from 'three';
import { useGameStore } from '../stores/gameStore';

const CYCLE = 60 * 60 * 1000;

function SunMoon() {
  const sunRef = useRef<Mesh>(null);
  const sunGlowRef = useRef<Mesh>(null);
  const moonRef = useRef<Mesh>(null);
  const moonGlowRef = useRef<Mesh>(null);

  const { sunGeo, sunGlowGeo, sunMat, sunGlowMat, moonGeo, moonGlowGeo, moonMat, moonGlowMat } = useMemo(() => ({
    sunGeo: new SphereGeometry(0.12, 16, 16),
    sunGlowGeo: new SphereGeometry(0.35, 16, 16),
    sunMat: new MeshStandardMaterial({ color: '#ffdd66', emissive: '#ff8800', emissiveIntensity: 3 }),
    sunGlowMat: new MeshBasicMaterial({ color: '#ffaa44', transparent: true, opacity: 0.2, blending: AdditiveBlending, depthWrite: false }),
    moonGeo: new SphereGeometry(0.08, 12, 12),
    moonGlowGeo: new SphereGeometry(0.22, 12, 12),
    moonMat: new MeshStandardMaterial({ color: '#ddeeff', emissive: '#99aacc', emissiveIntensity: 0.5, roughness: 0.8 }),
    moonGlowMat: new MeshBasicMaterial({ color: '#aabbdd', transparent: true, opacity: 0.12, blending: AdditiveBlending, depthWrite: false }),
  }), []);

  useFrame(() => {
    const state = useGameStore.getState();
    const elapsed = state.elapsed;
    const stageId = state.stage;
    const weather = state.envSeed.weather;

    const sunAngle = (elapsed % CYCLE) / CYCLE * Math.PI * 2;
    const sunX = Math.cos(sunAngle) * 6;
    const sunY = Math.sin(sunAngle) * 4 + 1.5;
    const sunZ = Math.sin(sunAngle * 0.7) * 3;

    const isNight = stageId >= 6;
    const isCovered = weather === 'cloudy' || weather === 'rainy' || weather === 'foggy';

    const sunVisible = !isNight && !isCovered && sunY > -0.3;
    if (sunRef.current) sunRef.current.visible = sunVisible;
    if (sunGlowRef.current) sunGlowRef.current.visible = sunVisible;

    if (sunRef.current) sunRef.current.position.set(sunX, sunY, sunZ);
    if (sunGlowRef.current) sunGlowRef.current.position.set(sunX, sunY, sunZ);

    const moonAngle = sunAngle + Math.PI;
    const moonX = Math.cos(moonAngle) * 5;
    const moonY = Math.sin(moonAngle) * 3 + 1;
    const moonZ = Math.sin(moonAngle * 0.7) * 2.5;

    const moonVisible = isNight && !isCovered;
    if (moonRef.current) moonRef.current.visible = moonVisible;
    if (moonGlowRef.current) moonGlowRef.current.visible = moonVisible;

    if (moonRef.current) moonRef.current.position.set(moonX, moonY, moonZ);
    if (moonGlowRef.current) moonGlowRef.current.position.set(moonX, moonY, moonZ);
  });

  return (
    <>
      <mesh ref={sunGlowRef} geometry={sunGlowGeo} material={sunGlowMat} />
      <mesh ref={sunRef} geometry={sunGeo} material={sunMat} />
      <mesh ref={moonGlowRef} geometry={moonGlowGeo} material={moonGlowMat} />
      <mesh ref={moonRef} geometry={moonGeo} material={moonMat} />
    </>
  );
}

function Stars() {
  const ref = useRef<Points>(null);

  const { geometry, material } = useMemo(() => {
    const count = 1200;
    const geo = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 20 + Math.random() * 50;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.6 + 5;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = 0.02 + Math.random() * 0.06;
    }

    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('size', new Float32BufferAttribute(sizes, 1));

    const mat = new PointsMaterial({
      color: new Color('#ffffff'),
      size: 0.04,
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
    const targetOpacity = isNight ? 0.9 : 0;
    material.opacity += (targetOpacity - material.opacity) * 0.02;
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
