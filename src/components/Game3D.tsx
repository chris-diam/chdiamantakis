import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { GameWorld3D } from './GameWorld3D';
import { Astronaut3D } from './Astronaut3D';
import { SpaceBuilding, BuildingType } from './SpaceBuilding';
import { SpaceEnvironment } from './SpaceEnvironment';
import { BuildingInterior } from './BuildingInterior';
import { useAuth } from '../context/AuthContext';
// PortfolioModal removed - now using BuildingInterior for immersive experience
import { useSocket } from '../hooks/useSocket';
import { gameMap, PORTFOLIO_BUILDINGS } from '../data/gameMap';
import { Direction, Position, Character } from '../types';

const MOVE_SPEED = 0.08;

// Convert pixel position to 3D world position
function pixelToWorld(pos: Position): [number, number, number] {
  const tileX = pos.x / 32;
  const tileZ = pos.y / 32;
  return [
    tileX - gameMap.width / 2,
    0,
    tileZ - gameMap.height / 2,
  ];
}

// Convert 3D world position to pixel position
function worldToPixel(x: number, z: number): Position {
  return {
    x: (x + gameMap.width / 2) * 32,
    y: (z + gameMap.height / 2) * 32,
  };
}

// Convert tile coordinates to 3D world position
function tileToWorld(tileX: number, tileY: number): [number, number, number] {
  return [
    tileX - gameMap.width / 2 + 0.5,
    0,
    tileY - gameMap.height / 2 + 0.5,
  ];
}

// Check if a world position is walkable
function isWalkable3D(x: number, z: number): boolean {
  const tileX = Math.floor(x + gameMap.width / 2);
  const tileZ = Math.floor(z + gameMap.height / 2);

  if (tileX < 0 || tileX >= gameMap.width || tileZ < 0 || tileZ >= gameMap.height) {
    return false;
  }

  const tile = gameMap.tiles[tileZ]?.[tileX];
  if (!tile?.walkable) return false;

  // Check collision with portfolio buildings (1.5 unit radius)
  for (const [, building] of Object.entries(PORTFOLIO_BUILDINGS)) {
    const bx = building.tileX - gameMap.width / 2 + 0.5;
    const bz = building.tileY - gameMap.height / 2 + 0.5;
    const dist = Math.sqrt(Math.pow(x - bx, 2) + Math.pow(z - bz, 2));
    if (dist < 1.5) return false;
  }

  return true;
}

// Camera that follows the player with smooth lookAt and zoom
function FollowCamera({ target }: { target: React.RefObject<THREE.Group | null> }) {
  const { camera, gl } = useThree();
  const zoomLevel = useRef(1); // 1 = default, smaller = zoomed in
  const targetZoom = useRef(1);
  const smoothLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const smoothPosition = useRef(new THREE.Vector3(0, 12, 10));
  const initialized = useRef(false);

  // Zoom constraints
  const MIN_ZOOM = 0.3; // Very close
  const MAX_ZOOM = 1.5; // Far away
  const ZOOM_SPEED = 0.1;

  // Handle scroll wheel for zoom
  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? ZOOM_SPEED : -ZOOM_SPEED;
      targetZoom.current = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetZoom.current + delta));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [gl]);

  useFrame(() => {
    if (target.current) {
      // Smooth zoom interpolation
      zoomLevel.current += (targetZoom.current - zoomLevel.current) * 0.1;

      // Calculate offset based on zoom level
      const baseOffset = new THREE.Vector3(0, 12, 10);
      const offset = baseOffset.multiplyScalar(zoomLevel.current);

      const targetCameraPos = target.current.position.clone().add(offset);
      const targetLookAt = target.current.position.clone();

      // Initialize on first frame
      if (!initialized.current) {
        smoothPosition.current.copy(targetCameraPos);
        smoothLookAt.current.copy(targetLookAt);
        camera.position.copy(targetCameraPos);
        initialized.current = true;
      }

      // Smooth camera position
      smoothPosition.current.lerp(targetCameraPos, 0.08);
      camera.position.copy(smoothPosition.current);

      // Smooth lookAt target
      smoothLookAt.current.lerp(targetLookAt, 0.08);
      camera.lookAt(smoothLookAt.current);
    }
  });

  return null;
}

// Player component with chat bubble
interface Player3DSceneProps {
  character: Character;
  position: [number, number, number];
  direction: Direction;
  isMoving: boolean;
  username: string;
  chatMessage?: string;
  isCurrentPlayer?: boolean;
  playerRef?: React.RefObject<THREE.Group | null>;
}

function Player3DScene({
  character,
  position,
  direction,
  isMoving,
  username,
  chatMessage,
  isCurrentPlayer = false,
  playerRef,
}: Player3DSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const actualRef = playerRef || groupRef;

  useFrame(() => {
    // Only lerp position for other players (not current player)
    // Current player position is directly controlled in the game loop
    if (actualRef.current && !isCurrentPlayer) {
      actualRef.current.position.lerp(
        new THREE.Vector3(position[0], position[1], position[2]),
        0.15
      );
    }
  });

  // For current player, don't set position prop (it's controlled via ref)
  // For other players, set initial position
  return (
    <group
      ref={actualRef as React.Ref<THREE.Group>}
      position={isCurrentPlayer ? undefined : position}
    >
      <Astronaut3D
        character={character}
        direction={direction}
        isMoving={isMoving}
        scale={0.5}
      />

      <Html position={[0, 1.2, 0]} center distanceFactor={10}>
        <div className="pointer-events-none select-none">
          {chatMessage ? (
            <div
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis mb-1 ${
                isCurrentPlayer
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
              style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
            >
              {chatMessage}
            </div>
          ) : (
            <div className="bg-black/70 px-2 py-0.5 rounded text-white text-xs font-bold whitespace-nowrap">
              {username}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

// Game scene props
interface GameSceneProps {
  user: { username: string; character: Character };
  myPlayer: { position: Position; direction: Direction } | null;
  otherPlayers: Array<{
    id: string;
    username: string;
    character: Character;
    position: Position;
    direction: Direction;
    isMoving: boolean;
    chatMessage?: string;
  }>;
  isConnected: boolean;
  localChatMessage: string;
  onMove: (pos: Position, dir: Direction, moving: boolean) => void;
  onStop: (dir: Direction) => void;
  isChatting: boolean;
  isModalOpen: boolean;
  onBuildingInteract: (type: BuildingType) => void;
  playerWorldPosition: [number, number, number];
  setPlayerWorldPosition: (pos: [number, number, number]) => void;
}

function GameScene({
  user,
  myPlayer,
  otherPlayers,
  isConnected,
  localChatMessage,
  onMove,
  onStop,
  isChatting,
  isModalOpen,
  onBuildingInteract,
  playerWorldPosition,
  setPlayerWorldPosition,
}: GameSceneProps) {
  const playerRef = useRef<THREE.Group>(null);
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);
  const hasInitialized = useRef(false);

  const keysPressed = useRef<Set<string>>(new Set());

  // Initialize position from server ONLY ONCE when first connecting
  useEffect(() => {
    if (myPlayer && !hasInitialized.current) {
      const [x, y, z] = pixelToWorld(myPlayer.position);
      setPlayerWorldPosition([x, y, z]);
      setDirection(myPlayer.direction);
      if (playerRef.current) {
        playerRef.current.position.set(x, y, z);
      }
      hasInitialized.current = true;
    }
  }, [myPlayer, setPlayerWorldPosition]);

  // Handle keyboard input for movement only
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChatting || isModalOpen) return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        keysPressed.current.add(e.key.toLowerCase());
      }

      // E key to interact with buildings
      if (e.key === 'e' || e.key === 'E') {
        // Check if near any building
        for (const [type, building] of Object.entries(PORTFOLIO_BUILDINGS)) {
          const bx = building.tileX - gameMap.width / 2 + 0.5;
          const bz = building.tileY - gameMap.height / 2 + 0.5;
          const dist = Math.sqrt(
            Math.pow(playerWorldPosition[0] - bx, 2) +
            Math.pow(playerWorldPosition[2] - bz, 2)
          );
          if (dist < 2.5) {
            onBuildingInteract(type as BuildingType);
            break;
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isChatting, isModalOpen, playerWorldPosition, onBuildingInteract]);

  // Game loop for movement
  useFrame(() => {
    if (!playerRef.current || isChatting || isModalOpen) return;

    let dx = 0;
    let dz = 0;
    let newDirection: Direction = direction;
    let moving = false;

    if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
      dz = -MOVE_SPEED;
      newDirection = 'up';
      moving = true;
    }
    if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) {
      dz = MOVE_SPEED;
      newDirection = 'down';
      moving = true;
    }
    if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
      dx = -MOVE_SPEED;
      newDirection = 'left';
      moving = true;
    }
    if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
      dx = MOVE_SPEED;
      newDirection = 'right';
      moving = true;
    }

    if (moving) {
      const newX = playerRef.current.position.x + dx;
      const newZ = playerRef.current.position.z + dz;

      if (isWalkable3D(newX, newZ)) {
        playerRef.current.position.x = newX;
        playerRef.current.position.z = newZ;

        setPlayerWorldPosition([newX, 0, newZ]);
        setDirection(newDirection);
        setIsMoving(true);

        if (isConnected) {
          const pixelPos = worldToPixel(newX, newZ);
          onMove(pixelPos, newDirection, true);
        }
      }
    } else if (isMoving) {
      setIsMoving(false);
      if (isConnected) {
        onStop(direction);
      }
    }
  });

  return (
    <>
      <FollowCamera target={playerRef} />

      {/* Space environment (stars, Earth, sun, lighting) */}
      <SpaceEnvironment />

      <GameWorld3D />

      {/* Space Station Buildings */}
      <SpaceBuilding
        type="about"
        position={tileToWorld(PORTFOLIO_BUILDINGS.about.tileX, PORTFOLIO_BUILDINGS.about.tileY)}
        playerPosition={playerWorldPosition}
        hidePrompt={isModalOpen}
      />
      <SpaceBuilding
        type="techstack"
        position={tileToWorld(PORTFOLIO_BUILDINGS.techstack.tileX, PORTFOLIO_BUILDINGS.techstack.tileY)}
        playerPosition={playerWorldPosition}
        hidePrompt={isModalOpen}
      />
      <SpaceBuilding
        type="projects"
        position={tileToWorld(PORTFOLIO_BUILDINGS.projects.tileX, PORTFOLIO_BUILDINGS.projects.tileY)}
        playerPosition={playerWorldPosition}
        hidePrompt={isModalOpen}
      />
      <SpaceBuilding
        type="contact"
        position={tileToWorld(PORTFOLIO_BUILDINGS.contact.tileX, PORTFOLIO_BUILDINGS.contact.tileY)}
        playerPosition={playerWorldPosition}
        hidePrompt={isModalOpen}
      />

      {/* Other players */}
      {otherPlayers.map((player) => {
        const pos = pixelToWorld(player.position);
        return (
          <Player3DScene
            key={player.id}
            character={player.character}
            position={pos}
            direction={player.direction}
            isMoving={player.isMoving}
            username={player.username}
            chatMessage={player.chatMessage}
          />
        );
      })}

      {/* Local player */}
      <Player3DScene
        character={user.character}
        position={playerWorldPosition}
        direction={direction}
        isMoving={isMoving}
        username={user.username}
        chatMessage={localChatMessage}
        isCurrentPlayer={true}
        playerRef={playerRef}
      />
    </>
  );
}

// Main Game component
export const Game3D: React.FC = () => {
  const { user, token, logout } = useAuth();
  const {
    isConnected,
    myPlayer,
    otherPlayers,
    chatMessages,
    movePlayer,
    stopPlayer,
    sendChatMessage,
  } = useSocket({ token });

  const [isChatting, setIsChatting] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [localChatMessage, setLocalChatMessage] = useState('');
  const [insideBuilding, setInsideBuilding] = useState<BuildingType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [playerWorldPosition, setPlayerWorldPosition] = useState<[number, number, number]>([0, 0, 0]);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat log
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle chat input
  const handleSendMessage = useCallback(() => {
    if (chatInput.trim()) {
      sendChatMessage(chatInput.trim());
      setLocalChatMessage(chatInput.trim());
      setTimeout(() => setLocalChatMessage(''), 5000);
    }
    setChatInput('');
    setIsChatting(false);
  }, [chatInput, sendChatMessage]);

  // Handle building interaction with transition
  const handleBuildingInteract = useCallback((type: BuildingType) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setInsideBuilding(type);
      setIsTransitioning(false);
    }, 500);
  }, []);

  // Handle exiting building
  const handleExitBuilding = useCallback(() => {
    setInsideBuilding(null);
  }, []);

  // Global keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't process keys if inside a building (BuildingInterior handles its own keys)
      if (insideBuilding) return;

      // Close chat with Escape
      if (e.key === 'Escape') {
        if (isChatting) {
          setChatInput('');
          setIsChatting(false);
          return;
        }
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (isChatting) {
          handleSendMessage();
        } else {
          setIsChatting(true);
          setTimeout(() => chatInputRef.current?.focus(), 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatting, handleSendMessage, insideBuilding]);

  if (!user) return null;

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: [0, 12, 10],
          fov: 50,
          near: 0.1,
          far: 200,
        }}
      >
        <GameScene
          user={user}
          myPlayer={myPlayer}
          otherPlayers={otherPlayers}
          isConnected={isConnected}
          localChatMessage={localChatMessage}
          onMove={movePlayer}
          onStop={stopPlayer}
          isChatting={isChatting}
          isModalOpen={insideBuilding !== null || isTransitioning}
          onBuildingInteract={handleBuildingInteract}
          playerWorldPosition={playerWorldPosition}
          setPlayerWorldPosition={setPlayerWorldPosition}
        />
      </Canvas>

      {/* Building Interior */}
      {insideBuilding && (
        <BuildingInterior type={insideBuilding} onExit={handleExitBuilding} />
      )}

      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black z-40 animate-pulse" />
      )}

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
        <p className="text-sm font-bold">{user.username}</p>
        <p className="text-xs text-gray-400">
          {isConnected ? (
            <span className="text-green-400">● Online</span>
          ) : (
            <span className="text-yellow-400">● Connecting...</span>
          )}
        </p>
      </div>

      {/* Online players count */}
      <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
        <p className="text-sm">
          Players: <span className="font-bold text-green-400">{otherPlayers.length + 1}</span>
        </p>
      </div>

      {/* Chat log window */}
      <div className="absolute bottom-24 left-4 w-80 bg-black/50 rounded-lg overflow-hidden">
        <div
          ref={chatLogRef}
          className="h-40 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-600"
        >
          {chatMessages.length === 0 ? (
            <p className="text-gray-500 text-xs italic">No messages yet. Press Enter to chat!</p>
          ) : (
            chatMessages.map((msg, index) => (
              <div key={index} className="text-sm">
                <span className="font-bold text-blue-400">{msg.username}: </span>
                <span className="text-white">{msg.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat input */}
      {isChatting && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 rounded-lg p-3 flex items-center gap-2 z-50">
          <span className="text-white text-sm">Say:</span>
          <input
            ref={chatInputRef}
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleSendMessage();
              }
            }}
            className="bg-white/90 text-gray-800 px-3 py-1 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            maxLength={100}
            autoFocus
          />
          <span className="text-gray-400 text-xs">Enter to send, Esc to cancel</span>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-xs">
        <p>WASD or Arrow Keys to move</p>
        <p className="text-gray-400">Enter to chat • E to interact</p>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
      >
        Logout
      </button>
    </div>
  );
};
