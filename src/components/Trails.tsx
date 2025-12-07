import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from '../config';
import type { ParticleData } from '../types';

interface TrailsProps {
  data: ParticleData;
}

const TRAIL_LENGTH = 15;

const Trails: React.FC<TrailsProps> = ({ data }) => {
  const linesRef = useRef<any>(null); 
  const startTimeRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const { brightIndices } = data;

  useEffect(() => {
    startTimeRef.current = performance.now() / 1000;
    frameCountRef.current = 0;
  }, [data]);

  const history = useMemo(() => {
    return brightIndices.map((pIdx) => {
      const ox = data.positions[pIdx * 3];
      const oy = data.positions[pIdx * 3 + 1];
      const oz = data.positions[pIdx * 3 + 2];
      
      const arr = [];
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        arr.push(new THREE.Vector3(ox, oy, oz));
      }
      return arr;
    });
  }, [brightIndices, data.positions]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const totalPoints = brightIndices.length * TRAIL_LENGTH;
    const posArray = new Float32Array(totalPoints * 3);
    const colorArray = new Float32Array(totalPoints * 3);
    
    geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    for (let i = 0; i < brightIndices.length; i++) {
      const pIdx = brightIndices[i];
      const r = data.colors[pIdx * 3];
      const g = data.colors[pIdx * 3 + 1];
      const b = data.colors[pIdx * 3 + 2];
      
      for (let j = 0; j < TRAIL_LENGTH; j++) {
        const idx = (i * TRAIL_LENGTH + j);
        colorArray[idx * 3] = r;
        colorArray[idx * 3 + 1] = g;
        colorArray[idx * 3 + 2] = b;
      }
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    return geo;
  }, [brightIndices, data.colors]);

  const indices = useMemo(() => {
    const indicesArr = [];
    for (let i = 0; i < brightIndices.length; i++) {
      for (let j = 0; j < TRAIL_LENGTH - 1; j++) {
        const start = i * TRAIL_LENGTH + j;
        indicesArr.push(start, start + 1);
      }
    }
    return indicesArr;
  }, [brightIndices.length]);

  useEffect(() => {
    geometry.setIndex(indices);
  }, [geometry, indices]);

  const [opacity, setOpacity] = useState(0);

  useFrame((state) => {
    const obj = linesRef.current;
    if (!obj || !obj.geometry || !obj.geometry.attributes || !obj.geometry.attributes.position) {
      return;
    }

    const currentTime = state.clock.getElapsedTime();
    const time = currentTime - startTimeRef.current;
    
    frameCountRef.current++;
    
    const trailFillDelay = Math.min(1, frameCountRef.current / (TRAIL_LENGTH * 2));
    const fadeIn = Math.max(0, Math.min(1, time / 0.5));
    
    setOpacity(fadeIn * trailFillDelay * 0.3);
    
    const positionsAttr = obj.geometry.attributes.position;
    
    for (let i = 0; i < brightIndices.length; i++) {
      const pIdx = brightIndices[i];
      
      const ox = data.positions[pIdx * 3];
      const oy = data.positions[pIdx * 3 + 1];
      const oz = data.positions[pIdx * 3 + 2];
      
      let dist = Math.sqrt(ox*ox + oy*oy);
      let angle = Math.atan2(oy, ox);
      
      const rotationStrength = Math.max(0, Math.min(1, (dist - CONFIG.particles.rotationInnerRadius) / (CONFIG.particles.rotationOuterRadius - CONFIG.particles.rotationInnerRadius)));
      
      const angleOffset = time * CONFIG.particles.rotationSpeed * rotationStrength * fadeIn;
      
      angle += angleOffset;
      
      let x = Math.cos(angle) * dist;
      let y = Math.sin(angle) * dist;
      let z = oz;

      const wave1 = Math.sin(y * 0.02 + time * 0.5) * 2.0 * fadeIn;
      const wave2 = Math.cos(x * 0.02 + time * 0.4) * 2.0 * fadeIn;
      const shimmer = Math.sin(z * 0.1 + time * 2.0) * 0.5 * fadeIn;

      x += wave1 + shimmer;
      y += wave2 + shimmer;
      z += Math.sin(dist * 0.05 - time) * 4.0 * fadeIn;
      
      const trail = history[i];
      if (trail) {
        for (let k = TRAIL_LENGTH - 1; k > 0; k--) {
          if (trail[k] && trail[k - 1]) {
            trail[k].copy(trail[k - 1]);
          }
        }
        if (trail[0]) {
          trail[0].set(x, y, z);
        }

        for (let k = 0; k < TRAIL_LENGTH; k++) {
          const idx = (i * TRAIL_LENGTH + k);
          if (trail[k]) {
            positionsAttr.setXYZ(idx, trail[k].x, trail[k].y, trail[k].z);
          }
        }
      }
    }
    
    positionsAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial 
        vertexColors 
        transparent 
        opacity={opacity} 
        blending={THREE.AdditiveBlending} 
      />
    </lineSegments>
  );
};

export default Trails;
