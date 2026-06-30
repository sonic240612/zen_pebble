import { CanvasTexture, RepeatWrapping } from 'three';

function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function fbm(x: number, y: number, octaves: number): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxVal = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency);
    maxVal += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value / maxVal;
}

export function createDirtTexture(size = 512): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const nx = x / size;
      const ny = y / size;

      const noise = fbm(nx * 4, ny * 4, 4);
      const coarse = fbm(nx * 2 + 10, ny * 2 + 10, 3);
      const speckle = fbm(nx * 16, ny * 16, 2);

      const r = Math.round(Math.max(0, Math.min(255, 140 + (noise - 0.5) * 50 + (coarse - 0.5) * 30 + (speckle - 0.5) * 20)));
      const g = Math.round(Math.max(0, Math.min(255, 120 + (noise - 0.5) * 40 + (coarse - 0.5) * 25 + (speckle - 0.5) * 15)));
      const b = Math.round(Math.max(0, Math.min(255, 85 + (noise - 0.5) * 30 + (coarse - 0.5) * 20 + (speckle - 0.5) * 10)));

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = 4;

  return texture;
}
