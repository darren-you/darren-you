import { useState, useEffect, useRef} from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TypewriterTextProps {
  text: string;
  position?: [number, number, number];
  speed?: number;
  loop?: boolean;
  pauseDuration?: number;
}

function TypewriterText({ 
  text, 
  position = [0, -90, 0],
  speed = 100, 
  loop = true, 
  pauseDuration = 2000 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        if (loop) {
          setIsDeleting(true);
        }
      }, pauseDuration);
      return () => clearTimeout(pauseTimeout);
    }

    if (!isDeleting && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && currentIndex === text.length && loop) {
      setIsPaused(true);
    } else if (isDeleting && displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
      }, speed / 2);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setCurrentIndex(0);
    }
  }, [currentIndex, displayText, isDeleting, isPaused, text, speed, loop, pauseDuration]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      <Text
        fontSize={4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.15}
        outlineColor="#666666"
      >
        {displayText + (showCursor ? '|' : '')}
      </Text>
      
      <mesh position={[0, -4, -0.5]}>
        <planeGeometry args={[Math.max(displayText.length * 3 + 15, 80), 10]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default TypewriterText;
