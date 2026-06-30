import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferGeometry, Float32BufferAttribute, PointsMaterial,
  Points, Color, AdditiveBlending, LineBasicMaterial,
  LineSegments, BufferAttribute, SphereGeometry, MeshStandardMaterial,
  type Mesh, Group
} from 'three';
import { useGameStore } from '../stores/gameStore';

function DustFX() {
  const pointsRef = useRef<Points>(null);

  const { geometry, material } = useMemo(() => {
    const count = 200;
    const geo = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 3;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.random() * 3 - 0.5;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = 0.005 + Math.random() * 0.01;
      speeds[i] = 0.1 + Math.random() * 0.2;
    }

    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    geo.userData = { speeds };

    const mat = new PointsMaterial({
      color: new Color('#ffffff'),
      size: 0.015,
      transparent: true,
      opacity: 0.3,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const speeds = pointsRef.current.geometry.userData.speeds;
    if (!speeds) return;

    const slowDelta = Math.min(delta, 0.05);
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i);
      y += Math.sin(performance.now() * 0.001 + i) * 0.0001;
      y -= speeds[i] * slowDelta * 0.1;
      if (y < -1.5) {
        y = 1.5;
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 3;
        pos.setX(i, r * Math.cos(theta));
        pos.setZ(i, r * Math.sin(theta));
      }
      pos.setY(i, y);
    }
    pos.needsUpdate = true;

    const elapsed = useGameStore.getState().elapsed;
    material.opacity = 0.2 + Math.sin(elapsed * 0.00005) * 0.1;
  });

  return <primitive object={new Points(geometry, material)} ref={pointsRef} />;
}

function RainFX() {
  const count = 1200;
  const spread = 4;
  const height = 3.5;

  const ref = useRef<LineSegments>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 6);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = Math.random() * height - height / 2;
      const z = (Math.random() - 0.5) * spread;
      const len = 0.03 + Math.random() * 0.06;
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y - len;
      positions[i * 6 + 5] = z;
      speeds[i] = 5 + Math.random() * 4;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.userData = { speeds };

    const mat = new LineBasicMaterial({
      color: 0xaabbff,
      transparent: true,
      opacity: 0.35,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const speeds = ref.current.geometry.userData.speeds;
    if (!speeds) return;
    const slowDelta = Math.min(delta, 0.05);

    for (let i = 0; i < count; i++) {
      let y1 = pos.getY(i * 2);
      let y2 = pos.getY(i * 2 + 1);
      y1 -= speeds[i] * slowDelta;
      y2 -= speeds[i] * slowDelta;
      if (y1 < -height / 2) {
        const x = (Math.random() - 0.5) * spread;
        const z = (Math.random() - 0.5) * spread;
        y1 = height / 2;
        y2 = y1 - (0.03 + Math.random() * 0.06);
        pos.setXYZ(i * 2, x, y1, z);
        pos.setXYZ(i * 2 + 1, x, y2, z);
      } else {
        pos.setY(i * 2, y1);
        pos.setY(i * 2 + 1, y2);
      }
    }
    pos.needsUpdate = true;
  });

  return <lineSegments ref={ref} geometry={geometry} material={material} />;
}

function SnowFX() {
  const count = 400;
  const spread = 3.5;
  const height = 3;

  const ref = useRef<Points>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const wobbleOffsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = Math.random() * height - height / 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      sizes[i] = 0.015 + Math.random() * 0.025;
      speeds[i] = 0.3 + Math.random() * 0.5;
      wobbleOffsets[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    geo.userData = { speeds, wobbleOffsets };

    const mat = new PointsMaterial({
      color: new Color('#ffffff'),
      size: 0.03,
      transparent: true,
      opacity: 0.7,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const { speeds, wobbleOffsets } = ref.current.geometry.userData;
    if (!speeds) return;
    const slowDelta = Math.min(delta, 0.05);
    const now = performance.now() * 0.001;

    for (let i = 0; i < count; i++) {
      let y = pos.getY(i);
      y -= speeds[i] * slowDelta;
      if (y < -height / 2) {
        y = height / 2;
        pos.setX(i, (Math.random() - 0.5) * spread);
        pos.setZ(i, (Math.random() - 0.5) * spread);
      }
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(now * 0.5 + wobbleOffsets[i]) * 0.002);
      pos.setZ(i, pos.getZ(i) + Math.cos(now * 0.3 + wobbleOffsets[i]) * 0.002);
    }
    pos.needsUpdate = true;
  });

  return <primitive object={new Points(geometry, material)} ref={ref} />;
}

function FogFX() {
  const ref = useRef<Points>(null);

  const { geometry, material } = useMemo(() => {
    const count = 500;
    const geo = new BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * 2.5;
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.3) * 1.2;
      positions[i * 3 + 2] = r * Math.sin(theta);
      sizes[i] = 0.04 + Math.random() * 0.08;
      speeds[i] = 0.02 + Math.random() * 0.05;
    }

    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    geo.userData = { speeds };

    const mat = new PointsMaterial({
      color: new Color('#ccddee'),
      size: 0.08,
      transparent: true,
      opacity: 0.15,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const speeds = ref.current.geometry.userData.speeds;
    if (!speeds) return;
    const slowDelta = Math.min(delta, 0.05);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + speeds[i] * slowDelta * 0.5;
      pos.setX(i, x > 2 ? -2 : x);
      const y = pos.getY(i) + Math.sin(performance.now() * 0.0005 + i) * 0.0002;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return <primitive object={new Points(geometry, material)} ref={ref} />;
}

function CloudFX() {
  const groupRef = useRef<Group>(null);

  const clouds = useMemo(() => {
    const result: { x: number; y: number; z: number; scale: number; speed: number }[] = [];
    for (let i = 0; i < 6; i++) {
      result.push({
        x: (Math.random() - 0.5) * 10,
        y: 1.5 + Math.random() * 1.5,
        z: (Math.random() - 0.5) * 6 - 3,
        scale: 0.3 + Math.random() * 0.6,
        speed: 0.02 + Math.random() * 0.03,
      });
    }
    return result;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const slowDelta = Math.min(delta, 0.05);
    groupRef.current.children.forEach((child, i) => {
      if (i < clouds.length) {
        child.position.x += clouds[i].speed * slowDelta;
        if (child.position.x > 6) child.position.x = -6;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} scale={c.scale}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function EnvironmentFX() {
  const weather = useGameStore((s) => s.envSeed.weather);

  switch (weather) {
    case 'rainy':
      return <RainFX />;
    case 'snowy':
      return <SnowFX />;
    case 'foggy':
      return <FogFX />;
    case 'cloudy':
      return <CloudFX />;
    default:
      return <DustFX />;
  }
}
