import { useGameStore } from '../stores/gameStore';
import { GrassPatch } from './GrassPatch';

export function Landscape() {
  const season = useGameStore((s) => s.envSeed.season);

  return (
    <group position={[0, -0.5, 0]}>
      <GrassPatch season={season} count={600} minRadius={0.35} maxRadius={0.6} centerX={0} centerZ={0} />
      <GrassPatch season={season} count={500} minRadius={0.5} maxRadius={0.9} centerX={0.3} centerZ={-0.2} />
      <GrassPatch season={season} count={500} minRadius={0.5} maxRadius={0.9} centerX={-0.25} centerZ={0.3} />
      <GrassPatch season={season} count={400} minRadius={0.4} maxRadius={0.8} centerX={0.2} centerZ={0.4} />
      <GrassPatch season={season} count={400} minRadius={0.4} maxRadius={0.8} centerX={-0.3} centerZ={-0.3} />
      <GrassPatch season={season} count={600} minRadius={0.7} maxRadius={1.2} centerX={0} centerZ={0} />
    </group>
  );
}
