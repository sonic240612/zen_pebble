import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { STAGES, getStageProgress, CYCLE_DURATION } from '../data/stages';
import { formatDurationShort, formatDuration } from '../utils/time';
import { LANDSCAPES, SEASONS, WEATHERS } from '../data/variations';
import './HUD.css';

export function HUD() {
  const elapsed = useGameStore((s) => s.elapsed);
  const stage = useGameStore((s) => s.stage);
  const cycle = useGameStore((s) => s.cycle);
  const envSeed = useGameStore((s) => s.envSeed);

  const currentStage = STAGES.find((s) => s.id === stage) ?? STAGES[0];
  const stageIdx = STAGES.indexOf(currentStage);
  const nextStage = stageIdx < STAGES.length - 1 ? STAGES[stageIdx + 1] : null;
  const progress = getStageProgress(elapsed);

  const prevStageRef = useRef(stage);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (prevStageRef.current !== stage) {
      prevStageRef.current = stage;
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const timeToNext = nextStage
    ? formatDuration(nextStage.threshold - (elapsed % CYCLE_DURATION))
    : null;

  const landscapeLabel = LANDSCAPES[envSeed.landscape]?.desc ?? envSeed.landscape;
  const seasonLabel = SEASONS[envSeed.season]?.desc ?? envSeed.season;
  const weatherLabel = WEATHERS[envSeed.weather]?.desc ?? envSeed.weather;

  return (
    <div className="hud">
      <div className="hud-timer">
        {formatDurationShort(elapsed)}
      </div>
      <div className="hud-info">
        <span className={`hud-stage ${transitioning ? 'hud-stage-transition' : ''}`}>
          {currentStage.name}
        </span>
        {cycle > 0 && <span className="hud-cycle">Cycle {cycle + 1}</span>}
      </div>
      <div className="hud-environment">
        <span className="env-item">{landscapeLabel}</span>
        <span className="dot">·</span>
        <span className="env-item">{seasonLabel}</span>
        <span className="dot">·</span>
        <span className="env-item weather-icon">
          {envSeed.weather === 'rainy' ? '🌧' : envSeed.weather === 'snowy' ? '❄' : envSeed.weather === 'foggy' ? '🌫' : envSeed.weather === 'cloudy' ? '☁' : '☀'}
        </span>
        <span className="env-item">{weatherLabel}</span>
      </div>
      <div className="hud-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        {nextStage && (
          <div className="hud-next-stage">
            <span>{nextStage.name}까지</span>
            <span className="time-to-next">{timeToNext}</span>
          </div>
        )}
      </div>
    </div>
  );
}
