import { useGameStore } from '../stores/gameStore';
import { GrassPatch } from './GrassPatch';

export function Landscape() {
  const season = useGameStore((s) => s.envSeed.season);

  return (
    <group position={[0, -0.5, 0]}>
      {/* 중심 — 돌 주변 집중 */}
      <GrassPatch season={season} count={300} minRadius={0.3} maxRadius={1.0} centerX={0} centerZ={0} />
      {/* 8방향으로 퍼뜨리기 */}
      <GrassPatch season={season} count={200} minRadius={0.3} maxRadius={1.2} centerX={1.2} centerZ={0} />
      <GrassPatch season={season} count={200} minRadius={0.3} maxRadius={1.2} centerX={-1.2} centerZ={0} />
      <GrassPatch season={season} count={200} minRadius={0.3} maxRadius={1.2} centerX={0} centerZ={1.2} />
      <GrassPatch season={season} count={200} minRadius={0.3} maxRadius={1.2} centerX={0} centerZ={-1.2} />
      {/* 대각선 방향 */}
      <GrassPatch season={season} count={150} minRadius={0.3} maxRadius={1.0} centerX={1.0} centerZ={1.0} />
      <GrassPatch season={season} count={150} minRadius={0.3} maxRadius={1.0} centerX={-1.0} centerZ={1.0} />
      <GrassPatch season={season} count={150} minRadius={0.3} maxRadius={1.0} centerX={1.0} centerZ={-1.0} />
      <GrassPatch season={season} count={150} minRadius={0.3} maxRadius={1.0} centerX={-1.0} centerZ={-1.0} />
      {/* 먼 거리 채움 */}
      <GrassPatch season={season} count={100} minRadius={0.5} maxRadius={1.5} centerX={2.0} centerZ={0.5} />
      <GrassPatch season={season} count={100} minRadius={0.5} maxRadius={1.5} centerX={-2.0} centerZ={-0.5} />
    </group>
  );
}
