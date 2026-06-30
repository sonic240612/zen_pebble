import { useGameStore } from '../stores/gameStore';
import { STAGES } from '../data/stages';
import { formatDurationShort } from '../utils/time';
import './HUD.css';

export function HUD() {
  const elapsed = useGameStore((s) => s.elapsed);
  const stage = useGameStore((s) => s.stage);
  const cycle = useGameStore((s) => s.cycle);
  const envSeed = useGameStore((s) => s.envSeed);

  const currentStage = STAGES.find((s) => s.id === stage) ?? STAGES[0];
  const stageIdx = STAGES.indexOf(currentStage);
  const nextStage = stageIdx < STAGES.length - 1 ? STAGES[stageIdx + 1] : null;

  return (
    <div className="hud">
      <div className="hud-timer">
        {formatDurationShort(elapsed)}
      </div>
      <div className="hud-info">
        <span className="hud-stage">{currentStage.nameEn}</span>
        {cycle > 0 && <span className="hud-cycle">Cycle {cycle + 1}</span>}
      </div>
      <div className="hud-environment">
        <span>{envSeed.landscape.replace('_', ' ')}</span>
        <span className="dot">·</span>
        <span>{envSeed.season}</span>
        <span className="dot">·</span>
        <span>{envSeed.weather}</span>
      </div>
      <div className="hud-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${nextStage ? ((elapsed - currentStage.threshold) / Math.max(nextStage.threshold - currentStage.threshold, 1)) * 100 : 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
