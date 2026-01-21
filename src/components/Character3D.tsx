import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Character, Direction } from '../types';

// Color palettes
const SKIN_COLORS = ['#FFE0BD', '#FFCD94', '#EAC086', '#C68642', '#8D5524'];
const HAIR_COLORS = ['#090806', '#2C222B', '#3B3024', '#4E433F', '#504444', '#6A4E42', '#A7856A', '#B89778'];
const SHIRT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#74B9FF', '#A29BFE', '#FD79A8', '#00B894'];
const PANTS_COLORS = ['#2D3436', '#0984E3', '#6C5CE7', '#00B894', '#E17055', '#636E72', '#B2BEC3', '#74B9FF', '#A29BFE', '#55A3FF'];

interface Character3DProps {
  character: Character;
  direction: Direction;
  isMoving: boolean;
  scale?: number;
}

export function Character3D({ character, direction, isMoving, scale = 1 }: Character3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  // Get colors from character data
  const skinColor = useMemo(() => new THREE.Color(SKIN_COLORS[character.skinColor % SKIN_COLORS.length]), [character.skinColor]);
  const hairColor = useMemo(() => new THREE.Color(HAIR_COLORS[character.hairColor % HAIR_COLORS.length]), [character.hairColor]);
  const shirtColor = useMemo(() => new THREE.Color(SHIRT_COLORS[character.shirtColor % SHIRT_COLORS.length]), [character.shirtColor]);
  const pantsColor = useMemo(() => new THREE.Color(PANTS_COLORS[character.pantsColor % PANTS_COLORS.length]), [character.pantsColor]);

  // Calculate rotation based on direction
  const rotation = useMemo(() => {
    switch (direction) {
      case 'up': return Math.PI;
      case 'down': return 0;
      case 'left': return Math.PI / 2;
      case 'right': return -Math.PI / 2;
      default: return 0;
    }
  }, [direction]);

  // Animation
  useFrame((state) => {
    if (!groupRef.current) return;

    // Smooth rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      rotation,
      0.15
    );

    // Walking animation
    if (isMoving) {
      const time = state.clock.elapsedTime * 8;
      const legSwing = Math.sin(time) * 0.5;
      const armSwing = Math.sin(time) * 0.4;

      if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;

      // Slight bounce
      groupRef.current.position.y = Math.abs(Math.sin(time * 2)) * 0.03;
    } else {
      // Reset to idle
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.1);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.1);

      // Idle breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.01;
      groupRef.current.position.y = breathe;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Body/Torso */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.4, 0.45, 0.25]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Hair based on style */}
      {character.hairStyle !== 4 && ( // 4 = bald
        <group position={[0, 1.2, 0]}>
          {/* Base hair */}
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>

          {/* Hair style variations */}
          {character.hairStyle === 0 && ( // Short
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.35, 0.1, 0.35]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          )}
          {character.hairStyle === 1 && ( // Medium
            <>
              <mesh position={[0, 0.05, -0.05]}>
                <boxGeometry args={[0.4, 0.15, 0.35]} />
                <meshStandardMaterial color={hairColor} />
              </mesh>
              <mesh position={[0, -0.05, -0.15]}>
                <boxGeometry args={[0.38, 0.2, 0.1]} />
                <meshStandardMaterial color={hairColor} />
              </mesh>
            </>
          )}
          {character.hairStyle === 2 && ( // Long
            <>
              <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[0.42, 0.12, 0.4]} />
                <meshStandardMaterial color={hairColor} />
              </mesh>
              <mesh position={[0, -0.15, -0.1]}>
                <boxGeometry args={[0.4, 0.4, 0.15]} />
                <meshStandardMaterial color={hairColor} />
              </mesh>
            </>
          )}
          {character.hairStyle === 3 && ( // Spiky
            <>
              {[-0.1, 0, 0.1].map((x, i) => (
                <mesh key={i} position={[x, 0.15, 0]} rotation={[0, 0, (i - 1) * 0.3]}>
                  <coneGeometry args={[0.06, 0.2, 4]} />
                  <meshStandardMaterial color={hairColor} />
                </mesh>
              ))}
            </>
          )}
        </group>
      )}

      {/* Eyes */}
      <group position={[0, 1.08, 0.18]}>
        <mesh position={[-0.07, 0, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.07, 0, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Eye highlights */}
        <mesh position={[-0.06, 0.01, 0.02]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.08, 0.01, 0.02]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>

      {/* Arms */}
      <group position={[-0.28, 0.65, 0]}>
        <mesh ref={leftArmRef} position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>
      <group position={[0.28, 0.65, 0]}>
        <mesh ref={rightArmRef} position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Legs */}
      <group position={[-0.1, 0.35, 0]}>
        <mesh ref={leftLegRef} position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.08, 0.25, 4, 8]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.35, 0.03]}>
          <boxGeometry args={[0.12, 0.08, 0.18]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>
      </group>
      <group position={[0.1, 0.35, 0]}>
        <mesh ref={rightLegRef} position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.08, 0.25, 4, 8]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.35, 0.03]}>
          <boxGeometry args={[0.12, 0.08, 0.18]} />
          <meshStandardMaterial color="#2d2d2d" />
        </mesh>
      </group>

      {/* Hat (if equipped) */}
      {character.hatStyle >= 0 && (
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.15, 0.25, 0.12, 16]} />
          <meshStandardMaterial color="#c41e3a" />
        </mesh>
      )}
    </group>
  );
}
