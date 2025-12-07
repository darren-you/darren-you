import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Particles from './Particles';
import Trails from './Trails';
import TypewriterText from './TypewriterText';
import SocialLinks from './SocialLinks';
import RotatingStars from './RotatingStars';
import { CONFIG } from '../config';
import type { ParticleData } from '../types';

interface SceneProps {
  particleData: ParticleData | null;
}

const Scene: React.FC<SceneProps> = ({ particleData }) => {
  const [cameraZ, setCameraZ] = useState(CONFIG.camera.baseDistance);
  const [textY, setTextY] = useState(CONFIG.positions.textY);
  const [socialY, setSocialY] = useState(CONFIG.positions.socialY);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateLayout = () => {
         const height = window.innerHeight;
         const width = window.innerWidth;
         const aspectRatio = width / height;
         
         const { baseImageSize, textHeight, socialHeight, spacing, verticalScaleFactor, horizontalScaleFactor } = CONFIG.layout;
         
         const totalHeight = baseImageSize + spacing + textHeight + spacing + socialHeight;
         
         const verticalScale = height / (totalHeight * verticalScaleFactor);
         const horizontalScale = width / (baseImageSize * horizontalScaleFactor);
         
         let finalScale = Math.min(verticalScale, horizontalScale);
         
         if (width > CONFIG.responsive.desktop.breakpoint) {
           finalScale = Math.min(finalScale, CONFIG.responsive.desktop.maxScale);
         } else if (width > CONFIG.responsive.tablet.breakpoint) {
           finalScale = Math.min(finalScale, CONFIG.responsive.tablet.maxScale);
         } else {
           finalScale = Math.min(finalScale, CONFIG.responsive.mobile.maxScale);
         }
         
         const adjustedCameraZ = CONFIG.camera.baseDistance / finalScale;
         
         setCameraZ(adjustedCameraZ);
         setTextY(CONFIG.positions.textY);
         setSocialY(CONFIG.positions.socialY);
         setScale(finalScale);
         
         console.log('Layout updated:', {
           width,
           height,
           aspectRatio,
           finalScale,
           cameraZ: adjustedCameraZ,
         });
       };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, cameraZ], fov: CONFIG.camera.fov }}
      gl={{ 
        alpha: false, 
        antialias: false,
        powerPreference: "high-performance"
      }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#020205']} />
      
      <RotatingStars />

      {particleData && (
        <group scale={scale}>
          <Particles data={particleData} baseSize={CONFIG.particles.baseSize} />
          <Trails data={particleData} />
          <Suspense fallback={null}>
                  <TypewriterText 
                    text={CONFIG.text.content}
                    position={[0, textY, 0]}
                    speed={CONFIG.text.speed}
                    loop={CONFIG.text.loop}
                  />
                </Suspense>
          <SocialLinks 
            position={[0, socialY, 0]}
            links={CONFIG.social.links}
          />
        </group>
      )}

      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={CONFIG.bloom.luminanceThreshold}
          mipmapBlur 
          intensity={CONFIG.bloom.intensity}
          radius={CONFIG.bloom.radius}
        />
      </EffectComposer>

      <OrbitControls 
        enablePan={CONFIG.controls.enablePan}
        enableZoom={CONFIG.controls.enableZoom}
        enableRotate={CONFIG.controls.enableRotate}
        autoRotate={!particleData}
        autoRotateSpeed={CONFIG.controls.autoRotateSpeed}
        maxDistance={cameraZ * 1.5}
        minDistance={cameraZ * 0.5}
      />
    </Canvas>
  );
};

export default Scene;
