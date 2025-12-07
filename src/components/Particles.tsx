import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './ParticleShader';
import { CONFIG } from '../config';
import type { ParticleData } from '../types';

interface ParticlesProps {
  data: ParticleData;
  baseSize?: number;
}

const Particles: React.FC<ParticlesProps> = ({ data, baseSize = 3.0 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const startTimeRef = useRef<number>(0);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: baseSize },
        uRotationSpeed: { value: CONFIG.particles.rotationSpeed },
        uRotationInnerRadius: { value: CONFIG.particles.rotationInnerRadius },
        uRotationOuterRadius: { value: CONFIG.particles.rotationOuterRadius },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [baseSize]);

  useEffect(() => {
    startTimeRef.current = performance.now() / 1000;
  }, [data]);

  useFrame((state) => {
    if (pointsRef.current) {
      const currentTime = state.clock.getElapsedTime();
      const relativeTime = currentTime - startTimeRef.current;
      
      (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = relativeTime;
      (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uSize.value = baseSize;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(data.sizes, 1));
    geo.center();
    return geo;
  }, [data]);

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
};

export default Particles;
