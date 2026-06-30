import type { StageDef } from '../types';

export const STAGES: StageDef[] = [
  {
    id: 1,
    name: '새벽',
    nameEn: 'Dawn',
    threshold: 0,
    skyTop: '#2c3e50',
    skyBottom: '#bdc3c7',
    fogColor: '#d5dbdb',
    ambientIntensity: 0.3,
    sunIntensity: 0.1,
  },
  {
    id: 2,
    name: '아침',
    nameEn: 'Morning',
    threshold: 3 * 60 * 1000,
    skyTop: '#87ceeb',
    skyBottom: '#f5deb3',
    fogColor: '#f0e6d3',
    ambientIntensity: 0.5,
    sunIntensity: 0.4,
  },
  {
    id: 3,
    name: '낮',
    nameEn: 'Day',
    threshold: 8 * 60 * 1000,
    skyTop: '#4a90d9',
    skyBottom: '#87ceeb',
    fogColor: '#e8f0f8',
    ambientIntensity: 0.8,
    sunIntensity: 0.8,
  },
  {
    id: 4,
    name: '오후',
    nameEn: 'Afternoon',
    threshold: 15 * 60 * 1000,
    skyTop: '#f39c12',
    skyBottom: '#f1c40f',
    fogColor: '#fdebd0',
    ambientIntensity: 0.7,
    sunIntensity: 0.6,
  },
  {
    id: 5,
    name: '황혼',
    nameEn: 'Dusk',
    threshold: 22 * 60 * 1000,
    skyTop: '#e74c3c',
    skyBottom: '#8e44ad',
    fogColor: '#e8daef',
    ambientIntensity: 0.4,
    sunIntensity: 0.2,
  },
  {
    id: 6,
    name: '밤',
    nameEn: 'Night',
    threshold: 30 * 60 * 1000,
    skyTop: '#0a0a2e',
    skyBottom: '#1a1a3e',
    fogColor: '#1a1a2e',
    ambientIntensity: 0.15,
    sunIntensity: 0.05,
  },
  {
    id: 7,
    name: '깊은 밤',
    nameEn: 'Deep Night',
    threshold: 40 * 60 * 1000,
    skyTop: '#050510',
    skyBottom: '#0d0d2b',
    fogColor: '#0a0a1e',
    ambientIntensity: 0.05,
    sunIntensity: 0.02,
  },
  {
    id: 8,
    name: '새벽 복귀',
    nameEn: 'Dawn Return',
    threshold: 60 * 60 * 1000,
    skyTop: '#1a1a3e',
    skyBottom: '#5d6d7e',
    fogColor: '#2c3e50',
    ambientIntensity: 0.2,
    sunIntensity: 0.1,
  },
];

export const CYCLE_DURATION = 60 * 60 * 1000;

export function getStage(elapsed: number): { stage: StageDef; cycle: number } {
  const cycle = Math.floor(elapsed / CYCLE_DURATION);
  const cycleElapsed = elapsed % CYCLE_DURATION;

  let stage = STAGES[0];
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (cycleElapsed >= STAGES[i].threshold) {
      stage = STAGES[i];
      break;
    }
  }

  return { stage, cycle };
}

export function getStageProgress(elapsed: number): number {
  const cycleElapsed = elapsed % CYCLE_DURATION;
  const { stage } = getStage(elapsed);

  const stageIdx = STAGES.indexOf(stage);
  const currentThreshold = stage.threshold;
  const nextThreshold = stageIdx < STAGES.length - 1
    ? STAGES[stageIdx + 1].threshold
    : CYCLE_DURATION;

  const duration = nextThreshold - currentThreshold;
  if (duration <= 0) return 1;

  return Math.min((cycleElapsed - currentThreshold) / duration, 1);
}

export function lerpColor(a: string, b: string, t: number): string {
  const parse = (c: string) => {
    const hex = c.replace('#', '');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}
