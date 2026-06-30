import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Float32BufferAttribute, PointsMaterial, Points, Color, AdditiveBlending } from 'three';
import { useGameStore } from '../stores/gameStore';

function createParticles(count: number, spread: number): BufferGeometry {
  const geo = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.random() * spread;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.random() * spread * 0.6 - spread * 0.3;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    sizes[i] = 0.01 + Math.random() * 0.02;
    speeds[i] = 0.2 + Math.random() * 0.4;
  }

  geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geo.setAttribute('size', new Float32BufferAttribute(sizes, 1));
  geo.userData = { speeds };

  return geo;
}

export function EnvironmentFX() {
  const pointsRef = useRef<Points>(null);
  const phase = useGameStore((s) => s.phase);

  const { geometry, material } = useMemo(() => {
    const geo = createParticles(300, 4);
    const mat = new PointsMaterial({
      color: new Color('#ffffff'),
      size: 0.02,
      transparent: true,
      opacity: 0.4,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || phase !== 'playing') return;

    const pos = pointsRef.current.geometry.attributes.position;
    const speeds = pointsRef.current.geometry.userData.speeds;

    if (!speeds) return;

    const elapsed = useGameStore.getState().elapsed;
    const slowDelta = Math.min(delta, 0.05);

    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i);
      y -= speeds[i] * slowDelta * 0.3;

      if (y < -1.5) {
        y = 1.5;
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 4;
        pos.setX(i, r * Math.cos(theta));
        pos.setZ(i, r * Math.sin(theta));
      }

      pos.setY(i, y);
    }

    pos.needsUpdate = true;

    material.opacity = 0.3 + Math.sin(elapsed * 0.00003) * 0.1;
  });

  return (
    <primitive object={new Points(geometry, material)} ref={pointsRef} />
  );
}
