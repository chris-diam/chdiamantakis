import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TileType } from '../types';

interface Tile3DProps {
  type: TileType;
  position: [number, number, number];
  variant?: number;
}

// Colors for different tile types
const TILE_COLORS = {
  grass: '#4ade80',
  grassDark: '#22c55e',
  water: '#38bdf8',
  waterDeep: '#0ea5e9',
  path: '#d4a574',
  pathDark: '#b8956e',
  sand: '#fcd34d',
};

// Grass tile with slight variations
function GrassTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const color = variant % 3 === 0 ? TILE_COLORS.grass : TILE_COLORS.grassDark;
  const height = 0.1 + (variant % 5) * 0.02;

  return (
    <group position={position}>
      {/* Base grass block */}
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <boxGeometry args={[1, height, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Random grass blades */}
      {variant % 4 === 0 && (
        <>
          <mesh position={[0.2, height + 0.1, 0.2]} rotation={[0, variant, 0.1]}>
            <coneGeometry args={[0.03, 0.2, 4]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
          <mesh position={[-0.3, height + 0.08, 0.1]} rotation={[0, variant * 2, -0.1]}>
            <coneGeometry args={[0.025, 0.15, 4]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </>
      )}

      {/* Occasional flowers */}
      {variant % 7 === 0 && (
        <mesh position={[0.1, height + 0.08, -0.2]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={variant % 2 === 0 ? '#f472b6' : '#fbbf24'} />
        </mesh>
      )}
    </group>
  );
}

// Water tile with animation
function WaterTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = -0.05 + Math.sin(state.clock.elapsedTime * 2 + variant) * 0.02;
    }
  });

  return (
    <group position={position}>
      {/* Water surface */}
      <mesh ref={meshRef} position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial
          color={TILE_COLORS.water}
          transparent
          opacity={0.8}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>
      {/* Dark bottom */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={TILE_COLORS.waterDeep} />
      </mesh>
    </group>
  );
}

// Tree tile
function TreeTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const treeHeight = 0.8 + (variant % 3) * 0.3;
  const treeRef = useRef<THREE.Group>(null);

  // Gentle swaying
  useFrame((state) => {
    if (treeRef.current) {
      treeRef.current.rotation.z = Math.sin(state.clock.elapsedTime + variant) * 0.02;
    }
  });

  return (
    <group position={position}>
      {/* Ground */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={TILE_COLORS.grass} />
      </mesh>

      {/* Tree */}
      <group ref={treeRef} position={[0, 0.1, 0]}>
        {/* Trunk */}
        <mesh position={[0, treeHeight / 3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, treeHeight / 1.5, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Foliage layers */}
        <mesh position={[0, treeHeight * 0.6, 0]} castShadow>
          <coneGeometry args={[0.4, treeHeight * 0.5, 8]} />
          <meshStandardMaterial color="#166534" />
        </mesh>
        <mesh position={[0, treeHeight * 0.85, 0]} castShadow>
          <coneGeometry args={[0.3, treeHeight * 0.4, 8]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
        <mesh position={[0, treeHeight * 1.05, 0]} castShadow>
          <coneGeometry args={[0.2, treeHeight * 0.3, 8]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
      </group>
    </group>
  );
}

// Path/dirt tile
function PathTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[1, 0.06, 1]} />
        <meshStandardMaterial color={variant % 2 === 0 ? TILE_COLORS.path : TILE_COLORS.pathDark} />
      </mesh>
      {/* Small pebbles */}
      {variant % 3 === 0 && (
        <>
          <mesh position={[0.2, 0.08, 0.15]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#9ca3af" />
          </mesh>
          <mesh position={[-0.25, 0.07, -0.2]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#6b7280" />
          </mesh>
        </>
      )}
    </group>
  );
}

// Rock tile
function RockTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const rockHeight = 0.3 + (variant % 3) * 0.15;

  return (
    <group position={position}>
      {/* Ground */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={TILE_COLORS.grass} />
      </mesh>

      {/* Rock */}
      <mesh position={[0, rockHeight / 2 + 0.1, 0]} castShadow>
        <dodecahedronGeometry args={[rockHeight, 0]} />
        <meshStandardMaterial color="#6b7280" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Building tile
function BuildingTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const buildingHeight = 1.2 + (variant % 2) * 0.4;
  const roofColor = variant % 3 === 0 ? '#dc2626' : variant % 3 === 1 ? '#2563eb' : '#16a34a';

  return (
    <group position={position}>
      {/* Ground */}
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[1, 0.05, 1]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>

      {/* Building base */}
      <mesh position={[0, buildingHeight / 2 + 0.05, 0]} castShadow>
        <boxGeometry args={[0.85, buildingHeight, 0.85]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, buildingHeight + 0.25, 0]} castShadow>
        <coneGeometry args={[0.6, 0.4, 4]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.25, 0.43]}>
        <boxGeometry args={[0.2, 0.4, 0.02]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Windows */}
      <mesh position={[0.25, 0.6, 0.43]}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#bfdbfe" />
      </mesh>
      <mesh position={[-0.25, 0.6, 0.43]}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#bfdbfe" />
      </mesh>
    </group>
  );
}

// Fence tile
function FenceTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  return (
    <group position={position}>
      {/* Ground */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={TILE_COLORS.grass} />
      </mesh>

      {/* Fence posts */}
      <mesh position={[-0.35, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#a16207" />
      </mesh>
      <mesh position={[0.35, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#a16207" />
      </mesh>

      {/* Horizontal bars */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.8, 0.06, 0.04]} />
        <meshStandardMaterial color="#ca8a04" />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.06, 0.04]} />
        <meshStandardMaterial color="#ca8a04" />
      </mesh>
    </group>
  );
}

// Flower tile (special grass with flowers)
function FlowerTile({ position, variant = 0 }: { position: [number, number, number]; variant?: number }) {
  const colors = ['#f472b6', '#fb923c', '#a855f7', '#3b82f6', '#ef4444'];

  return (
    <group position={position}>
      {/* Grass base */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={TILE_COLORS.grass} />
      </mesh>

      {/* Multiple flowers */}
      {[[-0.2, 0.2], [0.25, -0.15], [-0.1, -0.3], [0.3, 0.25]].map(([x, z], i) => (
        <group key={i} position={[x, 0.1, z]}>
          {/* Stem */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.2, 4]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
          {/* Flower head */}
          <mesh position={[0, 0.22, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={colors[(variant + i) % colors.length]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Tile3D({ type, position, variant = 0 }: Tile3DProps) {
  switch (type) {
    case 'grass':
      return <GrassTile position={position} variant={variant} />;
    case 'water':
      return <WaterTile position={position} variant={variant} />;
    case 'tree':
      return <TreeTile position={position} variant={variant} />;
    case 'path':
      return <PathTile position={position} variant={variant} />;
    case 'rock':
      return <RockTile position={position} variant={variant} />;
    case 'building':
      return <BuildingTile position={position} variant={variant} />;
    case 'fence':
      return <FenceTile position={position} variant={variant} />;
    case 'flower':
      return <FlowerTile position={position} variant={variant} />;
    default:
      return <GrassTile position={position} variant={variant} />;
  }
}
