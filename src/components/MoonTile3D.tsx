import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TileType } from '../types';

interface MoonTile3DProps {
  type: TileType;
  position: [number, number, number];
  variant?: number;
}

// Moon color palette
const MOON_COLORS = {
  dust: '#8a8a8a',
  dustLight: '#9e9e9e',
  dustDark: '#6b6b6b',
  rock: '#5a5a5a',
  rockDark: '#3d3d3d',
  crater: '#4a4a4a',
  ice: '#b8d4e3',
  crystal: '#7fdbff',
};

// Lunar dust/regolith surface
function MoonDustTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const color = variant % 3 === 0 ? MOON_COLORS.dust : variant % 3 === 1 ? MOON_COLORS.dustLight : MOON_COLORS.dustDark;
  const height = 0.08 + (variant % 5) * 0.01;

  return (
    <group position={position}>
      {/* Base moon surface */}
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <boxGeometry args={[1, height, 1]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Random small rocks */}
      {variant % 4 === 0 && (
        <>
          <mesh position={[0.3, height + 0.03, 0.2]}>
            <dodecahedronGeometry args={[0.04, 0]} />
            <meshStandardMaterial color={MOON_COLORS.rock} roughness={0.8} />
          </mesh>
          <mesh position={[-0.2, height + 0.02, -0.3]}>
            <dodecahedronGeometry args={[0.03, 0]} />
            <meshStandardMaterial color={MOON_COLORS.rockDark} roughness={0.8} />
          </mesh>
        </>
      )}

      {/* Footprints (occasional) */}
      {variant % 11 === 0 && (
        <mesh position={[0, height + 0.001, 0]} rotation={[-Math.PI / 2, 0, variant * 0.5]}>
          <planeGeometry args={[0.15, 0.25]} />
          <meshStandardMaterial color={MOON_COLORS.dustDark} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

// Moon rock formation (not walkable, replaces trees)
function MoonRockTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const rockHeight = 0.5 + (variant % 3) * 0.3;

  return (
    <group position={position}>
      {/* Ground */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1, 0.08, 1]} />
        <meshStandardMaterial color={MOON_COLORS.dust} roughness={0.9} />
      </mesh>

      {/* Main rock */}
      <mesh position={[0, rockHeight / 2 + 0.08, 0]} castShadow>
        <dodecahedronGeometry args={[rockHeight * 0.5, 1]} />
        <meshStandardMaterial color={MOON_COLORS.rock} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Secondary rocks */}
      <mesh position={[0.25, 0.2, 0.2]} castShadow>
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial color={MOON_COLORS.rockDark} roughness={0.9} />
      </mesh>
      <mesh position={[-0.2, 0.15, -0.15]} castShadow>
        <dodecahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color={MOON_COLORS.rock} roughness={0.85} />
      </mesh>
    </group>
  );
}

// Path on moon surface (compacted regolith)
function MoonPathTile({ position }: { position: [number, number, number]; variant?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[1, 0.04, 1]} />
        <meshStandardMaterial color={MOON_COLORS.dustDark} roughness={0.95} />
      </mesh>

      {/* Track marks */}
      <mesh position={[-0.2, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 0.9]} />
        <meshStandardMaterial color={MOON_COLORS.crater} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0.2, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 0.9]} />
        <meshStandardMaterial color={MOON_COLORS.crater} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Ice/water substitute - frozen water deposits
function IceTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Subtle shimmer effect
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 2 + variant) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Ice surface */}
      <mesh ref={meshRef} position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[1, 0.04, 1]} />
        <meshStandardMaterial
          color={MOON_COLORS.ice}
          roughness={0.2}
          metalness={0.3}
          emissive={MOON_COLORS.ice}
          emissiveIntensity={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Ice crystals */}
      {variant % 3 === 0 && (
        <>
          <mesh position={[0.2, 0.1, 0.15]} rotation={[0.3, variant, 0.2]}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial
              color={MOON_COLORS.crystal}
              transparent
              opacity={0.7}
              emissive={MOON_COLORS.crystal}
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[-0.25, 0.08, -0.2]} rotation={[0.2, variant * 2, 0.1]}>
            <octahedronGeometry args={[0.04, 0]} />
            <meshStandardMaterial
              color={MOON_COLORS.crystal}
              transparent
              opacity={0.6}
              emissive={MOON_COLORS.crystal}
              emissiveIntensity={0.3}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

// Moon base building (replaces regular buildings)
function MoonBaseTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const buildingHeight = 1.0 + (variant % 2) * 0.3;

  return (
    <group position={position}>
      {/* Landing pad base */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.06, 8]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Dome structure */}
      <mesh position={[0, buildingHeight / 2 + 0.06, 0]} castShadow>
        <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ddd" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Base cylinder */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.45, 0.4, 8]} />
        <meshStandardMaterial color="#888" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Airlock door */}
      <mesh position={[0, 0.2, 0.42]}>
        <boxGeometry args={[0.25, 0.35, 0.05]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Window lights */}
      <mesh position={[0.25, 0.4, 0.35]}>
        <boxGeometry args={[0.1, 0.1, 0.02]} />
        <meshStandardMaterial color="#ffff88" emissive="#ffff88" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.25, 0.4, 0.35]}>
        <boxGeometry args={[0.1, 0.1, 0.02]} />
        <meshStandardMaterial color="#88ffff" emissive="#88ffff" emissiveIntensity={1} />
      </mesh>

      {/* Antenna */}
      <mesh position={[0.3, buildingHeight + 0.2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 4]} />
        <meshStandardMaterial color="#666" metalness={0.8} />
      </mesh>
      <mesh position={[0.3, buildingHeight + 0.4, 0]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// Fence replacement - energy barrier posts
function EnergyBarrierTile({ position }: { position: [number, number, number]; variant?: number }) {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beamRef.current) {
      const material = beamRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Ground */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1, 0.08, 1]} />
        <meshStandardMaterial color={MOON_COLORS.dust} roughness={0.9} />
      </mesh>

      {/* Posts */}
      <mesh position={[-0.35, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.6, 6]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.35, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.6, 6]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Energy beam */}
      <mesh ref={beamRef} position={[0, 0.35, 0]}>
        <boxGeometry args={[0.6, 0.08, 0.02]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

// Crystal formation (replaces flowers)
function CrystalTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12', '#9b59b6'];
  const crystalColor = colors[variant % colors.length];

  return (
    <group position={position}>
      {/* Ground */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1, 0.08, 1]} />
        <meshStandardMaterial color={MOON_COLORS.dust} roughness={0.9} />
      </mesh>

      {/* Crystal formations */}
      {[[-0.2, 0.2], [0.25, -0.15], [-0.1, -0.3], [0.3, 0.25]].map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, 0.15 + i * 0.05, z]}
          rotation={[0.1 * i, variant + i, 0.1 * (i - 1)]}
          castShadow
        >
          <octahedronGeometry args={[0.08 + i * 0.02, 0]} />
          <meshStandardMaterial
            color={crystalColor}
            emissive={crystalColor}
            emissiveIntensity={0.4}
            transparent
            opacity={0.8}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Large moon rock (replaces regular rock)
function LargeMoonRockTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const rockSize = 0.35 + (variant % 3) * 0.1;

  return (
    <group position={position}>
      {/* Ground */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1, 0.08, 1]} />
        <meshStandardMaterial color={MOON_COLORS.dust} roughness={0.9} />
      </mesh>

      {/* Main rock */}
      <mesh position={[0, rockSize + 0.08, 0]} castShadow>
        <icosahedronGeometry args={[rockSize, 1]} />
        <meshStandardMaterial color={MOON_COLORS.rock} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Impact marks */}
      <mesh position={[0.15, 0.06, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.08, 8]} />
        <meshStandardMaterial color={MOON_COLORS.crater} />
      </mesh>
    </group>
  );
}

export function MoonTile3D({ type, position, variant = 0 }: MoonTile3DProps) {
  switch (type) {
    case 'grass':
      return <MoonDustTile position={position} variant={variant} />;
    case 'water':
      return <IceTile position={position} variant={variant} />;
    case 'tree':
      return <MoonRockTile position={position} variant={variant} />;
    case 'path':
      return <MoonPathTile position={position} variant={variant} />;
    case 'rock':
      return <LargeMoonRockTile position={position} variant={variant} />;
    case 'building':
      return <MoonBaseTile position={position} variant={variant} />;
    case 'fence':
      return <EnergyBarrierTile position={position} variant={variant} />;
    case 'flower':
      return <CrystalTile position={position} variant={variant} />;
    default:
      return <MoonDustTile position={position} variant={variant} />;
  }
}
