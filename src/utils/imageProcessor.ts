import type { ParticleData } from '../types';
import { CONFIG } from '../config';

export const processImage = (imageElement: HTMLImageElement): ParticleData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  const targetSize = CONFIG.image.targetSize;
  
  let width = imageElement.width;
  let height = imageElement.height;

  const ratio = Math.min(targetSize / width, targetSize / height);
  width = Math.floor(width * ratio);
  height = Math.floor(height * ratio);

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imageElement, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];
  const brightIndices: number[] = [];

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(centerX, centerY);
  
  const scale = CONFIG.image.scale;

  let particleCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const a = data[i + 3] / 255;

      const brightness = (r + g + b) / 3;

      const dx = x - centerX;
      const dy = y - centerY;
      const originalDist = Math.sqrt(dx * dx + dy * dy);
      const normalizedDist = originalDist / maxRadius;

      if (normalizedDist <= 1.0 && a > 0.1) {
        let posX = (x - width / 2) * scale;
        let posY = -(y - height / 2) * scale; 
        const posZ = 0;

        let scatterAmount = 0;
        if (normalizedDist > CONFIG.particles.scatterThreshold) {
             const t = (normalizedDist - CONFIG.particles.scatterThreshold) / (1 - CONFIG.particles.scatterThreshold);
             scatterAmount = Math.pow(t, 2) * CONFIG.particles.scatterAmount * scale; 
        }

        const angle = Math.random() * Math.PI * 2;
        posX += Math.cos(angle) * scatterAmount;
        posY += Math.sin(angle) * scatterAmount;

        positions.push(posX, posY, posZ);
        
        if (normalizedDist > 0.85) {
            colors.push(
                Math.min(1.0, r * 1.3), 
                Math.min(1.0, g * 1.3), 
                Math.min(1.0, b * 1.3)
            );
        } else {
            colors.push(r, g, b);
        }
        
        let size = Math.random() * 0.5 + brightness * 1.5;
        if (normalizedDist > 0.85) {
            size = Math.random() * 2.5; 
        }
        sizes.push(size);

        const isBright = brightness > 0.7;
        const isRing = normalizedDist > 0.88;
        
        let keepForTrail = false;
        
        if (isRing) {
            if (Math.random() > 0.8) keepForTrail = true;
        } else if (isBright && normalizedDist > 0.5) {
             if (Math.random() > 0.98) keepForTrail = true;
        }

        if (keepForTrail) {
          brightIndices.push(particleCount);
        }

        particleCount++;
      }
    }
  }

  const MAX_TRAILS = 350;
  let finalBrightIndices = brightIndices;
  if (brightIndices.length > MAX_TRAILS) {
      finalBrightIndices = [];
      const step = Math.floor(brightIndices.length / MAX_TRAILS);
      for(let i=0; i<brightIndices.length; i+=step) {
          finalBrightIndices.push(brightIndices[i]);
      }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    sizes: new Float32Array(sizes),
    brightIndices: finalBrightIndices,
    count: particleCount,
    width,
    height
  };
};
