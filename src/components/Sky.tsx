import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { SphereGeometry, ShaderMaterial, Color, BackSide } from 'three';
import { useGameStore } from '../stores/gameStore';
import { STAGES, getStage, lerpColor } from '../data/stages';
import { applySeasonTint } from '../data/seasonColors';

const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float offset;
  uniform float exponent;
  varying vec3 vWorldPosition;

  void main() {
    float h = normalize(vWorldPosition + offset).y;
    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
  }
`;

export function Sky() {
  const ref = useRef<ShaderMaterial>(null);
  const elapsed = useGameStore((s) => s.elapsed);

  const geometry = useMemo(() => new SphereGeometry(100, 32, 15), []);

  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        topColor: { value: new Color('#2c3e50') },
        bottomColor: { value: new Color('#bdc3c7') },
        offset: { value: 10 },
        exponent: { value: 0.6 },
      },
      vertexShader,
      fragmentShader,
      side: BackSide,
    });
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const state = useGameStore.getState();
    const stageId = state.stage;
    const season = state.envSeed.season;
    const currentStage = STAGES.find((s) => s.id === stageId) ?? STAGES[0];

    const seasonTop = applySeasonTint(currentStage.skyTop, season, 0.1);
    const seasonBottom = applySeasonTint(currentStage.skyBottom, season, 0.08);

    ref.current.uniforms.topColor.value.lerp(new Color(seasonTop), 0.05);
    ref.current.uniforms.bottomColor.value.lerp(new Color(seasonBottom), 0.05);
  });

  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        ref={ref}
        uniforms={material.uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={BackSide}
      />
    </mesh>
  );
}
