import { Canvas } from '@react-three/fiber';
import { Character3D } from './Character3D';
import { ChatBubble } from './ChatBubble';
import { Character, Direction } from '../types';

interface Player3DProps {
  character: Character;
  direction: Direction;
  isMoving: boolean;
  username?: string;
  showName?: boolean;
  chatMessage?: string;
  isCurrentPlayer?: boolean;
}

export function Player3D({
  character,
  direction,
  isMoving,
  username,
  showName = true,
  chatMessage,
  isCurrentPlayer = false,
}: Player3DProps) {
  return (
    <div className="relative" style={{ width: 48, height: 64 }}>
      {/* Chat bubble */}
      {chatMessage && (
        <ChatBubble message={chatMessage} isCurrentPlayer={isCurrentPlayer} />
      )}

      {/* Username */}
      {showName && username && !chatMessage && (
        <div
          className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 px-1.5 py-0.5 rounded text-white text-[10px] font-bold"
          style={{ zIndex: 100 }}
        >
          {username}
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, 1.2, 3],
          fov: 35,
          near: 0.1,
          far: 100,
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[2, 4, 2]}
          intensity={1}
          castShadow={false}
        />
        <directionalLight
          position={[-1, 2, -1]}
          intensity={0.3}
        />

        {/* Character */}
        <Character3D
          character={character}
          direction={direction}
          isMoving={isMoving}
          scale={0.8}
        />
      </Canvas>

      {/* Shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full"
        style={{ filter: 'blur(2px)' }}
      />
    </div>
  );
}
