import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CONFIG } from '../config';

function RotatingStars() {
  const starsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += CONFIG.stars.rotationSpeed;
      starsRef.current.rotation.x += CONFIG.stars.rotationSpeed * 0.5;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars 
        radius={CONFIG.stars.radius} 
        depth={CONFIG.stars.depth} 
        count={CONFIG.stars.count} 
        factor={CONFIG.stars.factor} 
        saturation={CONFIG.stars.saturation} 
        fade 
        speed={CONFIG.stars.speed} 
      />
    </group>
  );
}

export default RotatingStars;
