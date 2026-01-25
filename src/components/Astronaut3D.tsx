import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Character, Direction } from '../types';

// Suit colors - primary color of the spacesuit
const SUIT_COLORS = [
  '#ffffff', // Classic white
  '#e63946', // Red
  '#457b9d', // Blue
  '#2a9d8f', // Teal
  '#e9c46a', // Gold
  '#f4a261', // Orange
  '#9b5de5', // Purple
  '#00f5d4', // Cyan
  '#ff006e', // Pink
  '#8338ec', // Violet
];

// Visor colors - helmet visor tint
const VISOR_COLORS = [
  '#ffd700', // Gold reflective
  '#00bfff', // Blue reflective
  '#ff6b6b', // Red tint
  '#50fa7b', // Green tint
  '#bd93f9', // Purple tint
  '#ff79c6', // Pink tint
  '#f1fa8c', // Yellow tint
  '#8be9fd', // Cyan tint
];

// Accent colors - stripes and details
const ACCENT_COLORS = [
  '#1a1a2e', // Dark blue
  '#e63946', // Red
  '#ffd700', // Gold
  '#00bfff', // Blue
  '#50fa7b', // Green
  '#ff79c6', // Pink
  '#f1fa8c', // Yellow
  '#ffffff', // White
];

// Backpack styles
const BACKPACK_STYLES = ['standard', 'heavy', 'slim', 'none'];

interface Astronaut3DProps {
  character: Character;
  direction: Direction;
  isMoving: boolean;
  scale?: number;
}

export function Astronaut3D({ character, direction, isMoving, scale = 1 }: Astronaut3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  // Map character properties to astronaut customization
  // skinColor -> suit primary color
  // hairColor -> visor color
  // shirtColor -> accent color
  // pantsColor -> backpack style indicator
  // hairStyle -> helmet decoration
  const suitColor = useMemo(() => new THREE.Color(SUIT_COLORS[character.skinColor % SUIT_COLORS.length]), [character.skinColor]);
  const visorColor = useMemo(() => new THREE.Color(VISOR_COLORS[character.hairColor % VISOR_COLORS.length]), [character.hairColor]);
  const accentColor = useMemo(() => new THREE.Color(ACCENT_COLORS[character.shirtColor % ACCENT_COLORS.length]), [character.shirtColor]);
  const backpackStyle = BACKPACK_STYLES[character.pantsColor % BACKPACK_STYLES.length];

  // Calculate rotation based on direction
  const rotation = useMemo(() => {
    switch (direction) {
      case 'up': return Math.PI;
      case 'down': return 0;
      case 'left': return -Math.PI / 2;  // Face left (-X direction)
      case 'right': return Math.PI / 2;   // Face right (+X direction)
      default: return 0;
    }
  }, [direction]);

  // Animation - moon gravity style (slower, bouncier)
  useFrame((state) => {
    if (!groupRef.current) return;

    // Smooth rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      rotation,
      0.12
    );

    // Walking animation - slower for moon gravity feel
    if (isMoving) {
      const time = state.clock.elapsedTime * 4; // Slower walk
      const legSwing = Math.sin(time) * 0.35;
      const armSwing = Math.sin(time) * 0.25;

      if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;

      // Bouncy moon walk
      groupRef.current.position.y = Math.abs(Math.sin(time)) * 0.08;
    } else {
      // Reset to idle
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.08);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.08);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.08);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.08);

      // Gentle floating idle
      const float = Math.sin(state.clock.elapsedTime * 1.5) * 0.015;
      groupRef.current.position.y = float;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Torso - bulky spacesuit body */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.22, 0.35, 8, 16]} />
        <meshStandardMaterial color={suitColor} metalness={0.1} roughness={0.6} />
      </mesh>

      {/* Torso accent stripes */}
      <mesh position={[0, 0.7, 0.18]}>
        <boxGeometry args={[0.1, 0.4, 0.08]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* Life support chest panel */}
      <mesh position={[0, 0.75, 0.2]}>
        <boxGeometry args={[0.2, 0.15, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Panel lights */}
      <mesh position={[-0.05, 0.78, 0.23]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#50fa7b" emissive="#50fa7b" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.05, 0.78, 0.23]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#00bfff" emissive="#00bfff" emissiveIntensity={2} />
      </mesh>

      {/* Helmet */}
      <group position={[0, 1.15, 0]}>
        {/* Helmet base */}
        <mesh>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color={suitColor} metalness={0.2} roughness={0.5} />
        </mesh>

        {/* Visor */}
        <mesh position={[0, -0.02, 0.12]} rotation={[0.2, 0, 0]}>
          <sphereGeometry args={[0.22, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={visorColor}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
            envMapIntensity={2}
          />
        </mesh>

        {/* Visor frame */}
        <mesh position={[0, 0.05, 0.2]}>
          <torusGeometry args={[0.18, 0.02, 8, 24, Math.PI]} />
          <meshStandardMaterial color={accentColor} metalness={0.5} />
        </mesh>

        {/* Helmet antenna (if hairStyle indicates) */}
        {character.hairStyle % 3 === 0 && (
          <group position={[0.2, 0.15, 0]}>
            <mesh>
              <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
              <meshStandardMaterial color="#444" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
            </mesh>
          </group>
        )}

        {/* Helmet light (if hairStyle indicates) */}
        {character.hairStyle % 3 === 1 && (
          <mesh position={[0, 0.25, 0.1]}>
            <boxGeometry args={[0.08, 0.04, 0.04]} />
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={2} />
          </mesh>
        )}
      </group>

      {/* Backpack / Life Support System */}
      {backpackStyle !== 'none' && (
        <group position={[0, 0.7, -0.25]}>
          {backpackStyle === 'standard' && (
            <mesh>
              <boxGeometry args={[0.3, 0.4, 0.15]} />
              <meshStandardMaterial color={suitColor} metalness={0.2} roughness={0.5} />
            </mesh>
          )}
          {backpackStyle === 'heavy' && (
            <>
              <mesh>
                <boxGeometry args={[0.35, 0.5, 0.2]} />
                <meshStandardMaterial color={suitColor} metalness={0.2} roughness={0.5} />
              </mesh>
              {/* Oxygen tanks */}
              <mesh position={[-0.12, 0, 0.12]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
                <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0.12, 0, 0.12]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
                <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
              </mesh>
            </>
          )}
          {backpackStyle === 'slim' && (
            <mesh>
              <boxGeometry args={[0.25, 0.35, 0.08]} />
              <meshStandardMaterial color={suitColor} metalness={0.2} roughness={0.5} />
            </mesh>
          )}
          {/* Backpack accent */}
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.15, 0.1, 0.02]} />
            <meshStandardMaterial color={accentColor} />
          </mesh>
        </group>
      )}

      {/* Arms - bulky suit arms */}
      <group position={[-0.32, 0.75, 0]}>
        <mesh ref={leftArmRef} position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.08, 0.28, 4, 8]} />
          <meshStandardMaterial color={suitColor} metalness={0.1} roughness={0.6} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
      <group position={[0.32, 0.75, 0]}>
        <mesh ref={rightArmRef} position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.08, 0.28, 4, 8]} />
          <meshStandardMaterial color={suitColor} metalness={0.1} roughness={0.6} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
        </mesh>
      </group>

      {/* Legs - bulky suit legs */}
      <group position={[-0.12, 0.35, 0]}>
        <mesh ref={leftLegRef} position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.1, 0.25, 4, 8]} />
          <meshStandardMaterial color={suitColor} metalness={0.1} roughness={0.6} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.38, 0.02]}>
          <boxGeometry args={[0.14, 0.1, 0.2]} />
          <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
      <group position={[0.12, 0.35, 0]}>
        <mesh ref={rightLegRef} position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.1, 0.25, 4, 8]} />
          <meshStandardMaterial color={suitColor} metalness={0.1} roughness={0.6} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.38, 0.02]}>
          <boxGeometry args={[0.14, 0.1, 0.2]} />
          <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
