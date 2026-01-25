import { MapData, Tile, TileType } from '../types';

const TILE_SIZE = 32;

// Create a tile
const t = (type: TileType, walkable = true, variant = 0): Tile => ({ type, walkable, variant });

// Shorthand for common tiles
const G = () => t('grass', true, Math.floor(Math.random() * 3)); // Grass (walkable)
const W = () => t('water', false); // Water (not walkable)
const T = () => t('tree', false, Math.floor(Math.random() * 2)); // Tree (not walkable)
const F = () => t('flower', true, Math.floor(Math.random() * 4)); // Flower (walkable)
const P = () => t('path', true); // Path (walkable)
const R = () => t('rock', false); // Rock (not walkable)

// Portfolio building markers (rendered as grass, actual 3D buildings placed separately)
const PB = () => t('grass', true, 0); // Portfolio building location (walkable around it)

// 30x25 map - larger for portfolio
const mapLayout: (() => Tile)[][] = [
  // Row 0 - Top border
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  // Row 1
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  // Row 2 - About Me building area (top-left)
  [T,G,G,G,G,G,G,G,G,G,P,P,P,P,P,P,P,P,P,P,G,G,G,G,G,G,G,G,G,T],
  // Row 3
  [T,G,G,G,PB,PB,PB,G,G,G,P,G,G,G,G,G,G,G,G,P,G,G,G,PB,PB,PB,G,G,G,T],
  // Row 4 - About building
  [T,G,G,G,PB,PB,PB,G,G,G,P,G,F,G,G,G,F,G,G,P,G,G,G,PB,PB,PB,G,G,G,T],
  // Row 5
  [T,G,G,G,PB,PB,PB,G,G,G,P,G,G,G,G,G,G,G,G,P,G,G,G,PB,PB,PB,G,G,G,T],
  // Row 6
  [T,G,G,G,G,P,G,G,G,G,P,G,G,G,G,G,G,G,G,P,G,G,G,G,P,G,G,G,G,T],
  // Row 7
  [T,G,G,G,G,P,G,G,G,G,P,G,G,G,G,G,G,G,G,P,G,G,G,G,P,G,G,G,G,T],
  // Row 8
  [T,G,G,G,G,P,P,P,P,P,P,G,G,T,T,T,T,G,G,P,P,P,P,P,P,G,G,G,G,T],
  // Row 9
  [T,G,G,G,G,G,G,G,G,G,G,G,G,T,W,W,T,G,G,G,G,G,G,G,G,G,G,G,G,T],
  // Row 10 - Water feature in center
  [T,G,G,G,G,G,G,G,G,G,G,G,T,W,W,W,W,T,G,G,G,G,G,G,G,G,G,G,G,T],
  // Row 11
  [T,G,F,G,G,G,G,G,G,G,G,G,T,W,W,W,W,T,G,G,G,G,G,G,G,G,G,F,G,T],
  // Row 12 - Center spawn area
  [T,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,P,T],
  // Row 13
  [T,G,G,G,G,G,G,G,G,G,G,G,T,W,W,W,W,T,G,G,G,G,G,G,G,G,G,G,G,T],
  // Row 14
  [T,G,G,G,G,G,G,G,G,G,G,G,T,W,W,W,W,T,G,G,G,G,G,G,G,G,G,G,G,T],
  // Row 15
  [T,G,G,G,G,G,G,G,G,G,G,G,G,T,W,W,T,G,G,G,G,G,G,G,G,G,G,G,G,T],
  // Row 16
  [T,G,G,G,G,P,P,P,P,P,P,G,G,T,T,T,T,G,G,P,P,P,P,P,P,G,G,G,G,T],
  // Row 17
  [T,G,G,G,G,P,G,G,G,G,P,G,G,G,G,G,G,G,G,P,G,G,G,G,P,G,G,G,G,T],
  // Row 18
  [T,G,G,G,G,P,G,G,G,G,P,G,G,G,G,G,G,G,G,P,G,G,G,G,P,G,G,G,G,T],
  // Row 19 - Projects building (bottom-left) & Contact building (bottom-right)
  [T,G,G,G,PB,PB,PB,G,G,G,P,G,G,G,R,G,G,G,G,P,G,G,G,PB,PB,PB,G,G,G,T],
  // Row 20
  [T,G,G,G,PB,PB,PB,G,G,G,P,G,F,G,G,G,F,G,G,P,G,G,G,PB,PB,PB,G,G,G,T],
  // Row 21
  [T,G,G,G,PB,PB,PB,G,G,G,P,G,G,G,G,G,G,G,G,P,G,G,G,PB,PB,PB,G,G,G,T],
  // Row 22
  [T,G,G,G,G,G,G,G,G,G,P,P,P,P,P,P,P,P,P,P,G,G,G,G,G,G,G,G,G,T],
  // Row 23
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  // Row 24 - Bottom border
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
];

// Generate the actual tiles array
const generateTiles = (): Tile[][] => {
  return mapLayout.map(row => row.map(tileGen => tileGen()));
};

export const gameMap: MapData = {
  width: 30,
  height: 25,
  tiles: generateTiles(),
  spawnPoint: { x: 480, y: 400 }, // Center of the map
};

export const TILE_SIZE_PX = TILE_SIZE;

// Portfolio building positions (in tile coordinates)
// These will be converted to 3D world coordinates
export const PORTFOLIO_BUILDINGS = {
  about: { tileX: 5, tileY: 4 },      // Top-left
  techstack: { tileX: 24, tileY: 4 }, // Top-right
  projects: { tileX: 5, tileY: 20 },  // Bottom-left
  contact: { tileX: 24, tileY: 20 },  // Bottom-right
};

// Check if position is walkable
export const isWalkable = (x: number, y: number): boolean => {
  const tileX = Math.floor(x / TILE_SIZE);
  const tileY = Math.floor(y / TILE_SIZE);

  if (tileX < 0 || tileX >= gameMap.width || tileY < 0 || tileY >= gameMap.height) {
    return false;
  }

  return gameMap.tiles[tileY][tileX].walkable;
};

// Get tile at position
export const getTileAt = (x: number, y: number): Tile | null => {
  const tileX = Math.floor(x / TILE_SIZE);
  const tileY = Math.floor(y / TILE_SIZE);

  if (tileX < 0 || tileX >= gameMap.width || tileY < 0 || tileY >= gameMap.height) {
    return null;
  }

  return gameMap.tiles[tileY][tileX];
};
