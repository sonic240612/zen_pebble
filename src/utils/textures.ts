import { CanvasTexture, RepeatWrapping } from 'three';

export function createDirtTexture(size = 512): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  // Base soil color
  const baseR = 120, baseG = 90, baseB = 60;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      
      // 1. Base color with slight variation
      const noise = (Math.random() - 0.5) * 30;
      let r = baseR + noise;
      let g = baseG + noise;
      let b = baseB + noise;

      // 2. "Grain" - add high frequency noise for a gritty feel
      const grit = (Math.random() - 0.5) * 60;
      r += grit;
      g += grit;
      b += grit;

      // 3. "Clumps" - use a few random circles to simulate soil clumps
      // We can simulate this by adding larger-scale random spots
      // In a real loop, this is slow, but for 512x512 it's okay.
      // To make it look like the image, we need these clumps.
      
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Add some "organic" clumps over the top
  for (let i = 0; i < 1000; i++) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const radius = Math.random() * 3 + 1;
    const alpha = Math.random() * 0.3;
    const shade = Math.random() > 0.5 ? 'rgba(60, 40, 20, ' + alpha + ')' : 'rgba(160, 140, 110, ' + alpha + ')';
    
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = 4;

  return texture;
}
