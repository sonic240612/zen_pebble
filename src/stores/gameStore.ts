import { create } from 'zustand';
import type { GameState, LandscapeType, SeasonType, WeatherType } from '../types';
import { getStage } from '../data/stages';

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'idle',
  startTime: 0,
  lastTickTime: 0,
  elapsed: 0,
  stage: 1,
  cycle: 0,
  failReason: null,
  envSeed: {
    landscape: 'pine_forest' as LandscapeType,
    season: 'spring' as SeasonType,
    weather: 'clear' as WeatherType,
  },

  start: () => {
    const now = performance.now();
    const landscapes: LandscapeType[] = ['pine_forest', 'bamboo_forest', 'lakeside', 'desert_dunes'];
    const seasons: SeasonType[] = ['spring', 'summer', 'autumn', 'winter'];
    const weathers: WeatherType[] = ['clear', 'cloudy', 'foggy', 'rainy', 'snowy'];

    const seed = Math.abs((now * 9301 + 49297) % 233280);
    const pick = <T,>(arr: T[], i: number) => arr[Math.floor(Math.abs(Math.sin(seed * (i + 1)) * 10000)) % arr.length];

    set({
      phase: 'countdown',
      startTime: 0,
      lastTickTime: 0,
      elapsed: 0,
      stage: 1,
      cycle: 0,
      failReason: null,
      envSeed: {
        landscape: pick(landscapes, 0),
        season: pick(seasons, 1),
        weather: pick(weathers, 2),
      },
    });
  },

  beginPlay: () => {
    const now = performance.now();
    set({
      phase: 'playing',
      startTime: now,
      lastTickTime: now,
      elapsed: 0,
    });
  },

  fail: (reason: string) => {
    set({ phase: 'failed', failReason: reason });
  },

  reset: () => {
    set({
      phase: 'idle',
      startTime: 0,
      lastTickTime: 0,
      elapsed: 0,
      stage: 1,
      cycle: 0,
      failReason: null,
    });
  },

  tick: (timestamp: number) => {
    const state = get();
    if (state.phase !== 'playing') return;

    const elapsed = timestamp - state.startTime;
    const { stage, cycle } = getStage(elapsed);

    set({
      lastTickTime: timestamp,
      elapsed,
      stage: stage.id,
      cycle,
    });
  },
}));
