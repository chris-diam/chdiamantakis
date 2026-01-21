import React from 'react';
import { gameMap, TILE_SIZE_PX } from '../data/gameMap';
import { Tile } from '../types';

// Tile colors
const getTileStyle = (tile: Tile): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {
    width: TILE_SIZE_PX,
    height: TILE_SIZE_PX,
    position: 'absolute' as const,
  };

  switch (tile.type) {
    case 'grass':
      return {
        ...baseStyles,
        backgroundColor: tile.variant === 0 ? '#7EC850' : tile.variant === 1 ? '#6BBF47' : '#5DB33E',
      };
    case 'water':
      return {
        ...baseStyles,
        backgroundColor: '#4FA4E8',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
      };
    case 'tree':
      return baseStyles;
    case 'flower':
      return {
        ...baseStyles,
        backgroundColor: '#7EC850',
      };
    case 'path':
      return {
        ...baseStyles,
        backgroundColor: '#C9A66B',
        borderColor: '#B8956A',
      };
    case 'building':
      return {
        ...baseStyles,
        backgroundColor: '#8B4513',
      };
    case 'fence':
      return {
        ...baseStyles,
        backgroundColor: '#7EC850',
      };
    case 'rock':
      return {
        ...baseStyles,
        backgroundColor: '#7EC850',
      };
    default:
      return baseStyles;
  }
};

// Render decorations on tiles
const TileDecoration: React.FC<{ tile: Tile }> = ({ tile }) => {
  switch (tile.type) {
    case 'tree':
      return (
        <div className="relative w-full h-full bg-[#7EC850]">
          {/* Tree trunk */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-4 bg-amber-800" />
          {/* Tree foliage */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-green-700 rounded-full" />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-5 h-5 bg-green-600 rounded-full" />
        </div>
      );
    case 'flower':
      const flowerColors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#FF8E72'];
      return (
        <div className="relative w-full h-full">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: flowerColors[tile.variant || 0] }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-3 bg-green-600 mt-2" />
        </div>
      );
    case 'rock':
      return (
        <div className="relative w-full h-full">
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-4 bg-gray-500 rounded-t-lg" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-3 bg-gray-400 rounded-t" />
        </div>
      );
    case 'fence':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-full h-4 bg-amber-700 flex justify-around items-center">
            <div className="w-1 h-6 bg-amber-800" />
            <div className="w-1 h-6 bg-amber-800" />
            <div className="w-1 h-6 bg-amber-800" />
          </div>
        </div>
      );
    case 'building':
      return (
        <div className="relative w-full h-full bg-amber-900">
          <div className="absolute inset-1 bg-amber-800 border border-amber-950" />
          {/* Window */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-200 border border-amber-950" />
        </div>
      );
    case 'water':
      return (
        <div className="relative w-full h-full overflow-hidden">
          {/* Water ripple effect */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="w-4 h-1 bg-white/50 rounded-full absolute animate-pulse"
              style={{ top: '30%', left: '20%' }}
            />
            <div
              className="w-3 h-1 bg-white/50 rounded-full absolute animate-pulse"
              style={{ top: '60%', left: '60%', animationDelay: '0.5s' }}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
};

export const GameWorld: React.FC = () => {
  return (
    <div
      className="relative"
      style={{
        width: gameMap.width * TILE_SIZE_PX,
        height: gameMap.height * TILE_SIZE_PX,
      }}
    >
      {/* Render tiles */}
      {gameMap.tiles.map((row, y) =>
        row.map((tile, x) => (
          <div
            key={`${x}-${y}`}
            style={{
              ...getTileStyle(tile),
              left: x * TILE_SIZE_PX,
              top: y * TILE_SIZE_PX,
            }}
          >
            <TileDecoration tile={tile} />
          </div>
        ))
      )}
    </div>
  );
};
