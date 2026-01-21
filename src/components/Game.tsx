import React, { useEffect, useRef, useState } from 'react';
import { GameWorld } from './GameWorld';
import { Player3D } from './Player3D';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { isWalkable, TILE_SIZE_PX, gameMap } from '../data/gameMap';
import { Direction, Position } from '../types';

const MOVE_SPEED = 3;
const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 640;

export const Game: React.FC = () => {
  const { user, token, logout } = useAuth();
  const {
    isConnected,
    myPlayer,
    otherPlayers,
    movePlayer,
    stopPlayer,
    sendChatMessage,
  } = useSocket({ token });

  const [localPosition, setLocalPosition] = useState<Position>({ x: 400, y: 300 });
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [isChatting, setIsChatting] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [localChatMessage, setLocalChatMessage] = useState('');

  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number | null>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Initialize position from server
  useEffect(() => {
    if (myPlayer) {
      setLocalPosition(myPlayer.position);
      setDirection(myPlayer.direction);
    }
  }, [myPlayer?.id]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle chat with Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        if (isChatting) {
          // Send message
          if (chatInput.trim()) {
            sendChatMessage(chatInput.trim());
            setLocalChatMessage(chatInput.trim());
            // Clear local message after 5 seconds
            setTimeout(() => setLocalChatMessage(''), 5000);
          }
          setChatInput('');
          setIsChatting(false);
        } else {
          setIsChatting(true);
          setTimeout(() => chatInputRef.current?.focus(), 0);
        }
        return;
      }

      // Escape to cancel chat
      if (e.key === 'Escape' && isChatting) {
        setChatInput('');
        setIsChatting(false);
        return;
      }

      // Don't process movement keys while chatting
      if (isChatting) return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        keysPressed.current.add(e.key.toLowerCase());
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
  }, [isChatting, chatInput, sendChatMessage]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      let dx = 0;
      let dy = 0;
      let newDirection: Direction = direction;
      let moving = false;

      // Check movement keys
      if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
        dy = -MOVE_SPEED;
        newDirection = 'up';
        moving = true;
      }
      if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) {
        dy = MOVE_SPEED;
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
        setLocalPosition(prev => {
          // Calculate new position with collision check
          const newX = prev.x + dx;
          const newY = prev.y + dy;

          // Check collision at character's feet (center-bottom)
          const checkX = newX + 16; // Center of sprite
          const checkY = newY + 40; // Bottom of sprite

          // Check if new position is walkable
          if (isWalkable(checkX, checkY)) {
            // Clamp to map bounds
            const clampedX = Math.max(16, Math.min(newX, gameMap.width * TILE_SIZE_PX - 48));
            const clampedY = Math.max(16, Math.min(newY, gameMap.height * TILE_SIZE_PX - 64));

            const newPos = { x: clampedX, y: clampedY };

            // Send to server
            if (isConnected) {
              movePlayer(newPos, newDirection, true);
            }

            return newPos;
          }

          return prev;
        });

        setDirection(newDirection);
        setIsMoving(true);
      } else if (isMoving) {
        setIsMoving(false);
        if (isConnected) {
          stopPlayer(direction);
        }
      }

      // Update camera to follow player
      setLocalPosition(pos => {
        const targetCameraX = Math.max(0, Math.min(
          pos.x - VIEWPORT_WIDTH / 2 + 16,
          gameMap.width * TILE_SIZE_PX - VIEWPORT_WIDTH
        ));
        const targetCameraY = Math.max(0, Math.min(
          pos.y - VIEWPORT_HEIGHT / 2 + 24,
          gameMap.height * TILE_SIZE_PX - VIEWPORT_HEIGHT
        ));

        setCamera({ x: targetCameraX, y: targetCameraY });
        return pos;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [direction, isMoving, isConnected, movePlayer, stopPlayer]);

  if (!user) return null;

  return (
    <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      {/* Game viewport */}
      <div
        className="relative overflow-hidden border-4 border-gray-700 rounded-lg shadow-2xl"
        style={{
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
        }}
      >
        {/* World container with camera offset */}
        <div
          className="absolute transition-transform duration-75"
          style={{
            transform: `translate(${-camera.x}px, ${-camera.y}px)`,
          }}
        >
          {/* Game world tiles */}
          <GameWorld />

          {/* Other players */}
          {otherPlayers.map(player => (
            <div
              key={player.id}
              className="absolute transition-all duration-100"
              style={{
                left: player.position.x,
                top: player.position.y,
                zIndex: Math.floor(player.position.y),
              }}
            >
              <Player3D
                character={player.character}
                direction={player.direction}
                isMoving={player.isMoving}
                username={player.username}
                chatMessage={player.chatMessage}
              />
            </div>
          ))}

          {/* Local player */}
          <div
            className="absolute"
            style={{
              left: localPosition.x,
              top: localPosition.y,
              zIndex: Math.floor(localPosition.y) + 1,
            }}
          >
            <Player3D
              character={user.character}
              direction={direction}
              isMoving={isMoving}
              username={user.username}
              chatMessage={localChatMessage}
              isCurrentPlayer={true}
            />
          </div>
        </div>
      </div>

      {/* Chat input */}
      {isChatting && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 rounded-lg p-3 flex items-center gap-2">
          <span className="text-white text-sm">Say:</span>
          <input
            ref={chatInputRef}
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="bg-white/90 text-gray-800 px-3 py-1 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            maxLength={100}
          />
          <span className="text-gray-400 text-xs">Enter to send, Esc to cancel</span>
        </div>
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

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-xs">
        <p>WASD or Arrow Keys to move</p>
        <p className="text-gray-400">Press Enter to chat</p>
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
