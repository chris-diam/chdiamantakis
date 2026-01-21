import React from 'react';
import { Character, Direction } from '../types';
import { ChatBubble } from './ChatBubble';

interface PlayerSpriteProps {
  character: Character;
  direction: Direction;
  isMoving: boolean;
  username?: string;
  showName?: boolean;
  chatMessage?: string;
  isCurrentPlayer?: boolean;
}

// Color palettes
const SKIN_COLORS = ['#FFE0BD', '#FFCD94', '#EAC086', '#C68642', '#8D5524'];
const HAIR_COLORS = ['#090806', '#2C222B', '#3B3024', '#4E433F', '#504444', '#6A4E42', '#A7856A', '#B89778'];
const SHIRT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#74B9FF', '#A29BFE', '#FD79A8', '#00B894'];
const PANTS_COLORS = ['#2D3436', '#0984E3', '#6C5CE7', '#00B894', '#E17055', '#636E72', '#B2BEC3', '#74B9FF', '#A29BFE', '#55A3FF'];

export const PlayerSprite: React.FC<PlayerSpriteProps> = ({
  character,
  direction,
  isMoving,
  username,
  showName = true,
  chatMessage,
  isCurrentPlayer = false,
}) => {
  const skinColor = SKIN_COLORS[character.skinColor % SKIN_COLORS.length];
  const hairColor = HAIR_COLORS[character.hairColor % HAIR_COLORS.length];
  const shirtColor = SHIRT_COLORS[character.shirtColor % SHIRT_COLORS.length];
  const pantsColor = PANTS_COLORS[character.pantsColor % PANTS_COLORS.length];

  // Animation frame for walking
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    if (!isMoving) {
      setFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4);
    }, 150);

    return () => clearInterval(interval);
  }, [isMoving]);

  // Calculate leg offset for walking animation
  const legOffset = isMoving ? [0, 2, 0, -2][frame] : 0;

  // Flip sprite based on direction
  const scaleX = direction === 'left' ? -1 : 1;

  return (
    <div className="relative" style={{ width: 32, height: 48 }}>
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

      {/* Sprite container */}
      <div
        className="relative w-full h-full"
        style={{
          transform: `scaleX(${scaleX})`,
          imageRendering: 'pixelated',
        }}
      >
        {/* Shadow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/30 rounded-full"
        />

        {/* Legs */}
        <div
          className="absolute bottom-1 left-2 w-3 h-4 rounded-b"
          style={{
            backgroundColor: pantsColor,
            transform: `translateX(${legOffset}px)`,
          }}
        />
        <div
          className="absolute bottom-1 right-2 w-3 h-4 rounded-b"
          style={{
            backgroundColor: pantsColor,
            transform: `translateX(${-legOffset}px)`,
          }}
        />

        {/* Feet/Shoes */}
        <div
          className="absolute bottom-0 left-1.5 w-3.5 h-1.5 bg-gray-800 rounded-sm"
          style={{ transform: `translateX(${legOffset}px)` }}
        />
        <div
          className="absolute bottom-0 right-1.5 w-3.5 h-1.5 bg-gray-800 rounded-sm"
          style={{ transform: `translateX(${-legOffset}px)` }}
        />

        {/* Body/Shirt */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 w-7 h-6 rounded-t"
          style={{ backgroundColor: shirtColor }}
        />

        {/* Arms */}
        <div
          className="absolute bottom-6 left-0 w-2 h-4 rounded"
          style={{
            backgroundColor: skinColor,
            transform: `translateY(${isMoving ? legOffset : 0}px)`,
          }}
        />
        <div
          className="absolute bottom-6 right-0 w-2 h-4 rounded"
          style={{
            backgroundColor: skinColor,
            transform: `translateY(${isMoving ? -legOffset : 0}px)`,
          }}
        />

        {/* Head */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
          style={{ backgroundColor: skinColor }}
        >
          {/* Eyes */}
          {direction !== 'up' && (
            <>
              <div
                className="absolute top-3 w-1.5 h-1.5 bg-gray-900 rounded-full"
                style={{ left: direction === 'down' ? '35%' : '25%' }}
              />
              <div
                className="absolute top-3 w-1.5 h-1.5 bg-gray-900 rounded-full"
                style={{ right: direction === 'down' ? '35%' : '45%' }}
              />
            </>
          )}
        </div>

        {/* Hair */}
        <div
          className="absolute bottom-[38px] left-1/2 -translate-x-1/2 w-9 h-4 rounded-t-full"
          style={{ backgroundColor: hairColor }}
        />

        {/* Hair styles */}
        {character.hairStyle === 1 && (
          <div
            className="absolute bottom-[42px] left-1/2 w-3 h-3 -translate-x-1/2 rounded-full"
            style={{ backgroundColor: hairColor }}
          />
        )}
        {character.hairStyle === 2 && (
          <>
            <div
              className="absolute bottom-[38px] left-0 w-2 h-6 rounded"
              style={{ backgroundColor: hairColor }}
            />
            <div
              className="absolute bottom-[38px] right-0 w-2 h-6 rounded"
              style={{ backgroundColor: hairColor }}
            />
          </>
        )}
        {character.hairStyle === 3 && (
          <div
            className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-10 h-5 rounded-t-full"
            style={{ backgroundColor: hairColor }}
          />
        )}
        {character.hairStyle === 4 && (
          <div
            className="absolute bottom-[36px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full opacity-50"
            style={{ backgroundColor: hairColor }}
          />
        )}

        {/* Hat (if equipped) */}
        {character.hatStyle >= 0 && (
          <div
            className="absolute bottom-[42px] left-1/2 -translate-x-1/2 w-10 h-3 rounded-full bg-red-600 border-b-2 border-red-800"
          />
        )}
      </div>
    </div>
  );
};
