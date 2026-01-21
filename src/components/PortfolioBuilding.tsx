import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export type BuildingType = 'about' | 'techstack' | 'projects' | 'contact';

interface PortfolioBuildingProps {
  type: BuildingType;
  position: [number, number, number];
  playerPosition: [number, number, number];
  onInteract?: (type: BuildingType) => void;
}

const BUILDING_CONFIG: Record<BuildingType, {
  name: string;
  color: string;
  roofColor: string;
  icon: string;
  height: number;
}> = {
  about: {
    name: 'About Me',
    color: '#3b82f6',
    roofColor: '#1d4ed8',
    icon: '👤',
    height: 1.8,
  },
  techstack: {
    name: 'Tech Stack',
    color: '#10b981',
    roofColor: '#059669',
    icon: '💻',
    height: 2.0,
  },
  projects: {
    name: 'Projects',
    color: '#f59e0b',
    roofColor: '#d97706',
    icon: '🚀',
    height: 2.2,
  },
  contact: {
    name: 'Contact',
    color: '#ef4444',
    roofColor: '#dc2626',
    icon: '📧',
    height: 1.6,
  },
};

export function PortfolioBuilding({ type, position, playerPosition, onInteract }: PortfolioBuildingProps) {
  const config = BUILDING_CONFIG[type];
  const groupRef = useRef<THREE.Group>(null);
  const [isNearby, setIsNearby] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Check if player is nearby
  useFrame(() => {
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    );
    setIsNearby(distance < 2.5);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Base platform */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Building base */}
      <mesh
        position={[0, config.height / 2 + 0.1, 0]}
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onInteract?.(type)}
      >
        <boxGeometry args={[1.5, config.height, 1.5]} />
        <meshStandardMaterial
          color={config.color}
          emissive={hovered || isNearby ? config.color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : isNearby ? 0.15 : 0}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, config.height + 0.4, 0]} castShadow>
        <coneGeometry args={[1.2, 0.6, 4]} />
        <meshStandardMaterial color={config.roofColor} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.4, 0.76]}>
        <boxGeometry args={[0.5, 0.7, 0.02]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>

      {/* Door frame */}
      <mesh position={[0, 0.4, 0.77]}>
        <boxGeometry args={[0.6, 0.8, 0.01]} />
        <meshStandardMaterial color="#2d1f14" />
      </mesh>

      {/* Windows */}
      {[[-0.4, 1], [0.4, 1], [-0.4, 1.5], [0.4, 1.5]].map(([x, y], i) => (
        <group key={i}>
          <mesh position={[x, y, 0.76]}>
            <boxGeometry args={[0.25, 0.25, 0.02]} />
            <meshStandardMaterial
              color="#bfdbfe"
              emissive="#60a5fa"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Sign with icon */}
      <mesh position={[0, config.height + 0.9, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* HTML label */}
      <Html position={[0, config.height + 1.2, 0]} center>
        <div
          className={`pointer-events-none select-none transition-all duration-300 ${
            isNearby ? 'opacity-100 scale-100' : 'opacity-70 scale-90'
          }`}
        >
          <div className="text-center">
            <div className="text-3xl mb-1">{config.icon}</div>
            <div
              className={`px-3 py-1 rounded-lg text-white text-sm font-bold whitespace-nowrap ${
                isNearby ? 'bg-black/80' : 'bg-black/50'
              }`}
            >
              {config.name}
            </div>
            {isNearby && (
              <div className="mt-1 text-xs text-yellow-400 bg-black/70 px-2 py-0.5 rounded animate-pulse">
                Press E to enter
              </div>
            )}
          </div>
        </div>
      </Html>

      {/* Glow effect when nearby */}
      {isNearby && (
        <pointLight
          position={[0, 1, 0]}
          color={config.color}
          intensity={0.5}
          distance={3}
        />
      )}
    </group>
  );
}
