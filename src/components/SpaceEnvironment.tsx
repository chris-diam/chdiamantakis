import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Starfield background
export function Starfield({ count = 2000 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute stars on a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 80 + Math.random() * 20;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Star colors - mostly white with some blue and yellow tints
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        // White
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.85) {
        // Blue-ish
        colors[i * 3] = 0.7;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      } else {
        // Yellow-ish
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.7;
      }

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes };
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={points.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={false}
      />
    </points>
  );
}

// Earth in the sky
export function Earth({ position = [30, 25, -40] }: { position?: [number, number, number] }) {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (earthRef.current) {
      // Slow rotation
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
    if (cloudsRef.current) {
      // Clouds rotate slightly faster
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.025;
    }
  });

  return (
    <group position={position} ref={earthRef}>
      {/* Earth sphere */}
      <mesh>
        <sphereGeometry args={[8, 64, 64]} />
        <meshStandardMaterial
          color="#1e90ff"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Continents (simplified) */}
      <mesh rotation={[0.2, 0, 0.1]}>
        <sphereGeometry args={[8.02, 32, 32]} />
        <meshStandardMaterial
          color="#228b22"
          roughness={0.9}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Clouds layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[8.1, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.9}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[8.5, 32, 32]} />
        <meshBasicMaterial
          color="#87ceeb"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Bright side glow */}
      <pointLight
        position={[15, 0, 0]}
        color="#ffffff"
        intensity={0.3}
        distance={20}
      />
    </group>
  );
}

// Sun (distant light source)
export function Sun({ position = [100, 80, -80] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Sun sphere */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#fff5e6" />
      </mesh>

      {/* Sun glow */}
      <mesh>
        <sphereGeometry args={[7, 32, 32]} />
        <meshBasicMaterial
          color="#ffcc00"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Main directional light from sun */}
      <directionalLight
        color="#fff5e6"
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
    </group>
  );
}

// Distant nebula (for atmosphere)
export function Nebula() {
  const nebulaRef = useRef<THREE.Points>(null);

  const points = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const nebulaColors = [
      [0.5, 0.2, 0.8], // Purple
      [0.2, 0.4, 0.8], // Blue
      [0.8, 0.3, 0.5], // Pink
    ];

    for (let i = 0; i < count; i++) {
      // Position in a band
      positions[i * 3] = (Math.random() - 0.5) * 150 + 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30 + 40;
      positions[i * 3 + 2] = -60 + Math.random() * 20;

      const colorChoice = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      colors[i * 3] = colorChoice[0];
      colors[i * 3 + 1] = colorChoice[1];
      colors[i * 3 + 2] = colorChoice[2];
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = state.clock.elapsedTime * 0.001;
    }
  });

  return (
    <points ref={nebulaRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={points.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={200}
          array={points.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={3}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// Complete space environment
export function SpaceEnvironment() {
  return (
    <>
      {/* Black space background */}
      <color attach="background" args={['#000008']} />

      {/* Stars */}
      <Starfield count={3000} />

      {/* Nebula in distance */}
      <Nebula />

      {/* Earth in the sky */}
      <Earth position={[35, 30, -50]} />

      {/* Sun (provides main light) */}
      <Sun position={[80, 60, -60]} />

      {/* Ambient light (very dim in space) */}
      <ambientLight intensity={0.15} color="#4a5568" />

      {/* Fill light from Earth reflection */}
      <directionalLight
        position={[-20, 10, 20]}
        intensity={0.2}
        color="#4a90d9"
      />
    </>
  );
}
