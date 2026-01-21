import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export type BuildingType = 'about' | 'techstack' | 'projects' | 'contact';

interface SpaceBuildingProps {
  type: BuildingType;
  position: [number, number, number];
  playerPosition: [number, number, number];
  onInteract?: (type: BuildingType) => void;
}

const BUILDING_CONFIG: Record<BuildingType, {
  name: string;
  primaryColor: string;
  glowColor: string;
  icon: string;
  height: number;
}> = {
  about: {
    name: 'About Me',
    primaryColor: '#3b82f6',
    glowColor: '#60a5fa',
    icon: '👨‍🚀',
    height: 2.2,
  },
  techstack: {
    name: 'Tech Stack',
    primaryColor: '#10b981',
    glowColor: '#34d399',
    icon: '🛰️',
    height: 2.4,
  },
  projects: {
    name: 'Projects',
    primaryColor: '#f59e0b',
    glowColor: '#fbbf24',
    icon: '🚀',
    height: 2.6,
  },
  contact: {
    name: 'Contact',
    primaryColor: '#ef4444',
    glowColor: '#f87171',
    icon: '📡',
    height: 2.0,
  },
};

export function SpaceBuilding({ type, position, playerPosition, onInteract }: SpaceBuildingProps) {
  const config = BUILDING_CONFIG[type];
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const [isNearby, setIsNearby] = useState(false);

  // Animation and proximity check
  useFrame((state) => {
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    );
    setIsNearby(distance < 2.5);

    // Rotate the ring
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }

    // Pulse the beacon
    if (beaconRef.current) {
      const material = beaconRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Landing pad base */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.06, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Landing pad lights */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.5, 0.08, Math.sin(angle) * 1.5]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={config.glowColor}
              emissive={config.glowColor}
              emissiveIntensity={isNearby ? 1 : 0.3}
            />
          </mesh>
        );
      })}

      {/* Main dome structure */}
      <mesh position={[0, config.height / 2 + 0.06, 0]} castShadow>
        <sphereGeometry args={[1, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#e5e5e5"
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Dome colored accent ring */}
      <mesh ref={ringRef} position={[0, config.height * 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.08, 8, 24]} />
        <meshStandardMaterial
          color={config.primaryColor}
          emissive={config.primaryColor}
          emissiveIntensity={isNearby ? 0.5 : 0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Base cylinder */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1, 0.6, 16]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Airlock entrance */}
      <group position={[0, 0.35, 0.85]} rotation={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.6, 0.2]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Airlock light */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.3, 0.05, 0.05]} />
          <meshStandardMaterial
            color={isNearby ? '#00ff00' : '#ff0000'}
            emissive={isNearby ? '#00ff00' : '#ff0000'}
            emissiveIntensity={1}
          />
        </mesh>
      </group>

      {/* Windows with glow */}
      {[45, 135, 225, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <mesh
            key={i}
            position={[Math.cos(rad) * 0.75, config.height * 0.4, Math.sin(rad) * 0.75]}
            rotation={[0, -rad + Math.PI, 0]}
          >
            <planeGeometry args={[0.25, 0.25]} />
            <meshStandardMaterial
              color="#88ccff"
              emissive="#88ccff"
              emissiveIntensity={0.8}
              transparent
              opacity={0.9}
            />
          </mesh>
        );
      })}

      {/* Communication tower */}
      <group position={[0, config.height, 0]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.08, 0.6, 6]} />
          <meshStandardMaterial color="#444" metalness={0.8} />
        </mesh>
        {/* Antenna dish */}
        <mesh position={[0, 0.4, 0]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.2, 0.15, 12, 1, true]} />
          <meshStandardMaterial color="#888" metalness={0.7} side={THREE.DoubleSide} />
        </mesh>
        {/* Beacon light */}
        <mesh ref={beaconRef} position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color={config.glowColor}
            emissive={config.glowColor}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Holographic label */}
      <Html position={[0, config.height + 0.9, 0]} center>
        <div
          className={`pointer-events-none select-none transition-all duration-300 ${
            isNearby ? 'opacity-100 scale-100' : 'opacity-60 scale-90'
          }`}
        >
          <div className="text-center">
            <div className="text-4xl mb-1 drop-shadow-lg">{config.icon}</div>
            <div
              className={`px-4 py-1.5 rounded-lg text-white text-sm font-bold whitespace-nowrap border ${
                isNearby ? 'bg-black/80 border-cyan-400' : 'bg-black/50 border-gray-600'
              }`}
              style={{
                textShadow: '0 0 10px rgba(100, 200, 255, 0.5)',
                boxShadow: isNearby ? `0 0 20px ${config.glowColor}40` : 'none',
              }}
            >
              {config.name}
            </div>
            {isNearby && (
              <div
                className="mt-2 text-xs text-cyan-400 bg-black/70 px-3 py-1 rounded animate-pulse border border-cyan-400/50"
                style={{ textShadow: '0 0 5px #00ffff' }}
              >
                ⌨️ Press E to enter
              </div>
            )}
          </div>
        </div>
      </Html>

      {/* Proximity glow effect */}
      {isNearby && (
        <pointLight
          position={[0, 1, 0]}
          color={config.glowColor}
          intensity={0.8}
          distance={4}
        />
      )}
    </group>
  );
}
