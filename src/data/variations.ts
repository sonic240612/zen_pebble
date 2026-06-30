import type { LandscapeType, SeasonType, WeatherType, CelestialType } from '../types';

export const LANDSCAPES: Record<LandscapeType, { name: string; desc: string }> = {
  pine_forest: { name: '소나무숲', desc: 'Pine Forest' },
  bamboo_forest: { name: '대나무숲', desc: 'Bamboo Forest' },
  lakeside: { name: '호수변', desc: 'Lakeside' },
  desert_dunes: { name: '사막 언덕', desc: 'Desert Dunes' },
};

export const SEASONS: Record<SeasonType, { name: string; desc: string }> = {
  spring: { name: '봄', desc: 'Spring' },
  summer: { name: '여름', desc: 'Summer' },
  autumn: { name: '가을', desc: 'Autumn' },
  winter: { name: '겨울', desc: 'Winter' },
};

export const WEATHERS: Record<WeatherType, { name: string; desc: string }> = {
  clear: { name: '맑음', desc: 'Clear' },
  cloudy: { name: '구름', desc: 'Cloudy' },
  foggy: { name: '안개', desc: 'Foggy' },
  rainy: { name: '비', desc: 'Rainy' },
  snowy: { name: '눈', desc: 'Snowy' },
};

export const CELESTIALS: CelestialType[] = [
  'meteor_shower', 'eclipse', 'aurora', 'rainbow',
  'moon_halo', 'nebula', 'comet', 'planet_align',
];

export function pickRandom<T>(arr: T[], seedOffset = 0): T {
  const idx = Math.abs(hash(seedOffset)) % arr.length;
  return arr[idx];
}

function hash(n: number): number {
  n = ((n >> 16) ^ n) * 0x45d9f3b;
  n = ((n >> 16) ^ n) * 0x45d9f3b;
  n = (n >> 16) ^ n;
  return n;
}
