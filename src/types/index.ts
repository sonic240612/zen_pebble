export type GamePhase = 'idle' | 'countdown' | 'playing' | 'failing' | 'failed';

export interface StageDef {
  id: number;
  name: string;
  nameEn: string;
  threshold: number; // ms
  skyTop: string;
  skyBottom: string;
  fogColor: string;
  ambientIntensity: number;
  sunIntensity: number;
}

export type LandscapeType = 'pine_forest' | 'bamboo_forest' | 'lakeside' | 'desert_dunes';
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';
export type WeatherType = 'clear' | 'cloudy' | 'foggy' | 'rainy' | 'snowy';
export type CelestialType = 'meteor_shower' | 'eclipse' | 'aurora' | 'rainbow' | 'moon_halo' | 'nebula' | 'comet' | 'planet_align';

export interface EnvironmentSeed {
  landscape: LandscapeType;
  season: SeasonType;
  weather: WeatherType;
}

export interface GameState {
  phase: GamePhase;
  startTime: number;
  lastTickTime: number;
  elapsed: number;
  stage: number;
  cycle: number;
  failReason: string | null;
  envSeed: EnvironmentSeed;

  start: () => void;
  beginPlay: () => void;
  fail: (reason: string) => void;
  reset: () => void;
  tick: (timestamp: number) => void;
}
