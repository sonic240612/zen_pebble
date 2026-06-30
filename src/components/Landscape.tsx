import { useGameStore } from '../stores/gameStore';
import { GrassPatch } from './GrassPatch';

export function Landscape() {
  const season = useGameStore((s) => s.envSeed.season);

  return (
    <group position={[0, -0.5, 0]}>
      <GrassPatch season={season} count={40} minRadius={0.35} maxRadius={0.7} centerX={0} centerZ={0} />
      <GrassPatch season={season} count={30} minRadius={0.6} maxRadius={1.0} centerX={0.3} centerZ={-0.2} />
      <GrassPatch season={season} count={25} minRadius={0.5} maxRadius={0.9} centerX={-0.25} centerZ={0.3} />
    </group>
  );
}
