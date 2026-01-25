import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingType } from './SpaceBuilding';

interface BuildingInteriorProps {
  type: BuildingType;
  onExit: () => void;
}

// Interior content for each building type
const INTERIOR_CONTENT: Record<BuildingType, {
  title: string;
  icon: string;
  screens: Array<{
    position: [number, number, number];
    rotation: [number, number, number];
    content: React.ReactNode;
  }>;
}> = {
  about: {
    title: 'Mission Commander Profile',
    icon: '👨‍🚀',
    screens: [
      {
        position: [0, 1.5, -2.8],
        rotation: [0, 0, 0],
        content: (
          <div className="text-center">
            <div className="text-6xl mb-4">👨‍🚀</div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Christos Diamantakis</h2>
            <p className="text-purple-300 mb-4">Software Engineer • Web & Native Applications</p>
            <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
              Software Engineer dedicated to creating immersive and user-friendly digital experiences.
              Whether it's designing captivating web interfaces or crafting seamless native applications,
              I bring a keen eye for detail and a commitment to delivering user-centric solutions.
            </p>
          </div>
        ),
      },
      {
        position: [-2.5, 1.5, 0],
        rotation: [0, Math.PI / 2, 0],
        content: (
          <div className="p-4">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">📍 Mission Details</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-cyan-500/10 p-2 rounded border border-cyan-500/30">
                <span className="text-gray-400">Location:</span>
                <span className="text-white ml-2">Thessaloniki, Greece 🇬🇷</span>
              </div>
              <div className="bg-purple-500/10 p-2 rounded border border-purple-500/30">
                <span className="text-gray-400">Current Station:</span>
                <span className="text-white ml-2">CERTH/ITI</span>
              </div>
              <div className="bg-blue-500/10 p-2 rounded border border-blue-500/30">
                <span className="text-gray-400">Mission Time:</span>
                <span className="text-white ml-2">Since April 2022</span>
              </div>
              <div className="bg-green-500/10 p-2 rounded border border-green-500/30">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 ml-2">● Active</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        position: [2.5, 1.5, 0],
        rotation: [0, -Math.PI / 2, 0],
        content: (
          <div className="p-4">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">🎓 Education</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-yellow-500/10 p-2 rounded border border-yellow-500/30">
                <span className="text-yellow-300 font-medium">Bachelor's in Applied Informatics</span>
                <p className="text-gray-400 text-xs mt-1">University of Macedonia</p>
                <p className="text-gray-500 text-xs">December 2021</p>
              </div>
            </div>
            <h3 className="text-lg font-bold text-cyan-400 mb-2 mt-4">🌐 Languages</h3>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 bg-white/10 text-white rounded text-xs">Greek (Native)</span>
              <span className="px-2 py-0.5 bg-white/10 text-white rounded text-xs">English (Pro)</span>
              <span className="px-2 py-0.5 bg-white/10 text-white rounded text-xs">French (Cert)</span>
            </div>
          </div>
        ),
      },
    ],
  },
  techstack: {
    title: 'Technology Arsenal',
    icon: '🛰️',
    screens: [
      {
        position: [0, 1.5, -2.8],
        rotation: [0, 0, 0],
        content: (
          <div className="p-4">
            <h2 className="text-xl font-bold text-green-400 mb-4 text-center">🖥️ Frontend Systems</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {['React', 'React Native', 'TypeScript', 'Angular', 'Tailwind CSS', 'Three.js', 'D3.js'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ),
      },
      {
        position: [-2.5, 1.5, 0],
        rotation: [0, Math.PI / 2, 0],
        content: (
          <div className="p-4">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 text-center">⚡ Backend & Runtime</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Node.js', 'Express', 'Socket.io', 'REST APIs', 'Bash'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ),
      },
      {
        position: [2.5, 1.5, 0],
        rotation: [0, -Math.PI / 2, 0],
        content: (
          <div className="p-4">
            <h2 className="text-xl font-bold text-purple-400 mb-4 text-center">🗄️ Data & DevOps</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {['MongoDB', 'PostgreSQL', 'SQL', 'Docker', 'Keycloak', 'Git'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },
  projects: {
    title: 'Mission Log @ CERTH/ITI',
    icon: '🚀',
    screens: [
      {
        position: [0, 1.8, -2.8],
        rotation: [0, 0, 0],
        content: (
          <div className="p-3">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-3 rounded-lg border border-cyan-500/30 mb-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">IDEA4RC</h3>
                <span className="text-xs text-green-400">🟢 Active</span>
              </div>
              <p className="text-gray-400 text-xs mb-2">Medical data platform for rare cancer patients with secure SSO authorization</p>
              <div className="flex gap-1 flex-wrap">
                {['React.js', 'Node.js', 'Keycloak'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-xs">{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">FEVER</h3>
                <span className="text-xs text-gray-400">✅ Completed</span>
              </div>
              <p className="text-gray-400 text-xs mb-2">Transaction management platform with member registration and SSO</p>
              <div className="flex gap-1 flex-wrap">
                {['React.js', 'React Native', 'Keycloak'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        position: [-2.5, 1.5, 0],
        rotation: [0, Math.PI / 2, 0],
        content: (
          <div className="p-3">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-lg border border-purple-500/30 mb-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">ODIN</h3>
                <span className="text-xs text-gray-400">✅ Completed</span>
              </div>
              <p className="text-gray-400 text-xs mb-2">Hospital IoT administration platform with data visualization</p>
              <div className="flex gap-1 flex-wrap">
                {['React.js', 'D3.js', 'IoT'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-3 rounded-lg border border-orange-500/30">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">POP-MACHINA</h3>
                <span className="text-xs text-gray-400">✅ Completed</span>
              </div>
              <p className="text-gray-400 text-xs mb-2">Trading platform debugging and UI beautification</p>
              <div className="flex gap-1 flex-wrap">
                {['Angular.js', 'CSS'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded text-xs">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        position: [2.5, 1.5, 0],
        rotation: [0, -Math.PI / 2, 0],
        content: (
          <div className="p-3">
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-3 rounded-lg border border-red-500/30">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">Space Portfolio</h3>
                <span className="text-xs text-green-400">🟢 Personal</span>
              </div>
              <p className="text-gray-400 text-xs mb-2">3D multiplayer portfolio on the moon with React Three Fiber</p>
              <div className="flex gap-1 flex-wrap">
                {['React', 'Three.js', 'Socket.io', 'MongoDB'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  contact: {
    title: 'Communication Hub',
    icon: '📡',
    screens: [
      {
        position: [0, 1.5, -2.8],
        rotation: [0, 0, 0],
        content: (
          <div className="text-center p-4">
            <div className="text-5xl mb-4">📡</div>
            <h2 className="text-xl font-bold text-red-400 mb-4">Establish Contact</h2>
            <div className="space-y-3">
              <a
                href="mailto:ch.diamantakis@gmail.com"
                className="block bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg border border-red-500/30 transition-colors"
              >
                📧 ch.diamantakis@gmail.com
              </a>
              <a
                href="https://github.com/chris-diam"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 px-4 py-2 rounded-lg border border-gray-500/30 transition-colors"
              >
                🐙 github.com/chris-diam
              </a>
              <a
                href="https://linkedin.com/in/christos-diamantakis"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg border border-blue-500/30 transition-colors"
              >
                💼 LinkedIn - Christos Diamantakis
              </a>
            </div>
          </div>
        ),
      },
      {
        position: [-2.5, 1.5, 0],
        rotation: [0, Math.PI / 2, 0],
        content: (
          <div className="p-4">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">💡 Soft Skills</h3>
            <div className="space-y-2 text-xs text-gray-300">
              <p>• Always strive to improve knowledge and learn something new</p>
              <p>• Detail-oriented, self-motivated and patient</p>
              <p>• Capable of adjusting to new environments and technologies</p>
              <p>• Team-player with effective communication</p>
            </div>
          </div>
        ),
      },
    ],
  },
};

// Holographic screen component
function HolographicScreen({
  position,
  rotation,
  children
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  children: React.ReactNode;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Screen frame */}
      <mesh ref={meshRef}>
        <planeGeometry args={[3, 2.2]} />
        <meshStandardMaterial
          color="#001122"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Screen border glow */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.1, 2.3]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Content */}
      <Html
        position={[0, 0, 0.01]}
        transform
        distanceFactor={1.5}
        style={{
          width: '320px',
          background: 'transparent',
        }}
      >
        <div className="text-white">
          {children}
        </div>
      </Html>
    </group>
  );
}

// Interior room
function InteriorRoom({ type }: { type: BuildingType }) {
  const content = INTERIOR_CONTENT[type];
  const floorRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // Animate floor grid
    if (floorRef.current) {
      const material = floorRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color="#4a5568" />

      {/* Main light */}
      <pointLight position={[0, 2.5, 0]} intensity={0.8} color="#ffffff" />

      {/* Accent lights */}
      <pointLight position={[-2, 1, -2]} intensity={0.4} color="#00ffff" />
      <pointLight position={[2, 1, -2]} intensity={0.4} color="#ff00ff" />

      {/* Ceiling */}
      <mesh position={[0, 3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, 1.75, -4]}>
        <planeGeometry args={[8, 3.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          side={THREE.DoubleSide}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      {/* Front wall */}
      <mesh position={[0, 1.75, 4]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[8, 3.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          side={THREE.DoubleSide}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      {/* Left wall */}
      <mesh position={[-4, 1.75, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[8, 3.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          side={THREE.DoubleSide}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      {/* Right wall */}
      <mesh position={[4, 1.75, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[8, 3.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          side={THREE.DoubleSide}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Wall trim/edge lighting */}
      {/* Ceiling edge lights */}
      <mesh position={[0, 3.45, -3.95]}>
        <boxGeometry args={[7.9, 0.05, 0.05]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 3.45, 3.95]}>
        <boxGeometry args={[7.9, 0.05, 0.05]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-3.95, 3.45, 0]}>
        <boxGeometry args={[0.05, 0.05, 7.9]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[3.95, 3.45, 0]}>
        <boxGeometry args={[0.05, 0.05, 7.9]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Floor */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color="#0a0a1a"
          metalness={0.8}
          roughness={0.2}
          emissive="#00ffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Floor grid lines */}
      {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((i) => (
        <mesh key={`grid-x-${i}`} position={[i, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.02, 8]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
        </mesh>
      ))}
      {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((i) => (
        <mesh key={`grid-z-${i}`} position={[0, 0.01, i]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.02, 8]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Central holographic projector */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.2, 16]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Projector light */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.1, 0.2, 0.1, 16]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Title display - no icon, just title */}
      <Html position={[0, 2.8, 0]} center>
        <div className="text-center pointer-events-none">
          <h1 className="text-2xl font-bold text-cyan-400 whitespace-nowrap"
            style={{ textShadow: '0 0 20px #00ffff' }}>
            {content.title}
          </h1>
        </div>
      </Html>

      {/* Holographic screens */}
      {content.screens.map((screen, index) => (
        <HolographicScreen
          key={index}
          position={screen.position}
          rotation={screen.rotation}
        >
          {screen.content}
        </HolographicScreen>
      ))}

      {/* Decorative corner pillars */}
      {[[-3.8, -3.8], [-3.8, 3.8], [3.8, -3.8], [3.8, 3.8]].map(([x, z], i) => (
        <mesh key={`pillar-${i}`} position={[x, 1.75, z]}>
          <boxGeometry args={[0.3, 3.5, 0.3]} />
          <meshStandardMaterial
            color="#2a2a3e"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Corner accent lights */}
      {[[-3.8, -3.8], [-3.8, 3.8], [3.8, -3.8], [3.8, 3.8]].map(([x, z], i) => (
        <mesh key={`corner-light-${i}`} position={[x, 0.5, z]}>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </>
  );
}

export function BuildingInterior({ type, onExit }: BuildingInteriorProps) {
  const [fadeIn, setFadeIn] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Fade in on mount
    const timer = setTimeout(() => setFadeIn(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleExit = () => {
    setFadeOut(true);
    setTimeout(onExit, 500);
  };

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'e' || e.key === 'E') {
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      {/* Transition overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none z-10 ${
          fadeIn || fadeOut ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 3D Interior */}
      <Canvas
        camera={{
          position: [0, 1.6, 2.5],
          fov: 60,
          near: 0.1,
          far: 100,
        }}
      >
        <color attach="background" args={['#000008']} />
        <Stars radius={50} depth={30} count={500} factor={3} fade />

        {/* OrbitControls for looking around */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={1}
          maxDistance={4}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 + 0.3}
          target={[0, 1.2, 0]}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />

        <InteriorRoom type={type} />
      </Canvas>

      {/* Exit button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={handleExit}
          className="px-6 py-3 bg-black/80 hover:bg-black/90 text-cyan-400 rounded-lg border border-cyan-500/50 hover:border-cyan-400 transition-all flex items-center gap-2"
          style={{ textShadow: '0 0 10px #00ffff' }}
        >
          <span>⬅️</span>
          <span>Exit Building</span>
          <span className="text-gray-500 text-sm">(Press E or Esc)</span>
        </button>
      </div>

      {/* Building name indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <div className="px-4 py-2 bg-black/70 rounded-lg border border-cyan-500/30">
          <p className="text-cyan-400 text-sm">
            📍 Inside: <span className="text-white font-bold">{INTERIOR_CONTENT[type].title}</span>
          </p>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="px-3 py-2 bg-black/60 rounded-lg border border-gray-600/30 text-xs text-gray-400">
          <p>🖱️ Drag to look around</p>
          <p>🔍 Scroll to zoom</p>
        </div>
      </div>
    </div>
  );
}
