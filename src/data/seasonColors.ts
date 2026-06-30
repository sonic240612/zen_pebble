import type { SeasonType } from '../types';

export const SEASON_TINTS: Record<SeasonType, {
  label: string;
  skyTint: string;
  groundTint: string;
  lightTint: string;
  hueShift: number;
}> = {
  spring: {
    label: 'Spring',
    skyTint: '#ffe4f0',
    groundTint: '#b8d4a0',
    lightTint: '#ffe8e8',
    hueShift: 0.05,
  },
  summer: {
    label: 'Summer',
    skyTint: '#ffffff',
    groundTint: '#6aab5e',
    lightTint: '#fff8e0',
    hueShift: 0,
  },
  autumn: {
    label: 'Autumn',
    skyTint: '#f5e0c0',
    groundTint: '#c49a6c',
    lightTint: '#ffe0a0',
    hueShift: -0.05,
  },
  winter: {
    label: 'Winter',
    skyTint: '#e0ecff',
    groundTint: '#d0d8e0',
    lightTint: '#e8f0ff',
    hueShift: 0.1,
  },
};

export function applySeasonTint(baseColor: string, season: SeasonType, amount = 0.15): string {
  const tint = SEASON_TINTS[season];
  const parse = (c: string) => {
    const hex = c.replace('#', '');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  };
  const [br, bg, bb] = parse(baseColor);
  const [tr, tg, tb] = parse(tint.skyTint);
  const r = Math.round(br + (tr - br) * amount);
  const g = Math.round(bg + (tg - bg) * amount);
  const b = Math.round(bb + (tb - bb) * amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const DIRT_COLORS: Record<SeasonType, [number, number, number]> = {
  spring: [90, 74, 48],
  summer: [122, 106, 74],
  autumn: [138, 106, 58],
  winter: [106, 106, 90],
};

export function getDirtColor(season: SeasonType, brightness: number): string {
  const [r, g, b] = DIRT_COLORS[season];
  const factor = Math.max(0.2, Math.min(1, brightness));
  const rr = Math.round(r * factor);
  const gg = Math.round(g * factor);
  const bb = Math.round(b * factor);
  return `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`;
}
