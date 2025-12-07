import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { CONFIG } from '../config';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface SocialLinksProps {
  position?: [number, number, number];
  links: SocialLink[];
}

function SocialLinks({ 
  position = [0, -110, 0],
  links 
}: SocialLinksProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + Math.PI) * 2;
    }
  });

  const handleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {links.map((link, index) => {
        const xOffset = (index - (links.length - 1) / 2) * CONFIG.social.spacing;
        const isHovered = hoveredIndex === index;
        
        return (
          <group key={index} position={[xOffset, 0, 0]}>
            <Text
              position={[0, 0, 0]}
              fontSize={CONFIG.social.fontSize}
              color={isHovered ? "#ffffff" : "#aaaaaa"}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.1}
              outlineColor={isHovered ? "#ffffff" : "#555555"}
              onPointerEnter={() => setHoveredIndex(index)}
              onPointerLeave={() => setHoveredIndex(null)}
              onClick={() => handleClick(link.url)}
            >
              {link.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export default SocialLinks;
