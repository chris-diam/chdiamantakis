export interface Character {
  skinColor: number;
  hairStyle: number;
  hairColor: number;
  shirtColor: number;
  pantsColor: number;
  hatStyle: number;
}

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Player {
  id: string;
  odId?: string;
  username: string;
  character: Character;
  position: Position;
  direction: Direction;
  isMoving: boolean;
  chatMessage?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  character: Character;
  lastPosition: Position;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: number;
}

// Tile types for the map
export type TileType =
  | 'grass'
  | 'water'
  | 'tree'
  | 'flower'
  | 'path'
  | 'building'
  | 'fence'
  | 'rock';

export interface Tile {
  type: TileType;
  walkable: boolean;
  variant?: number;
}

export interface MapData {
  width: number;
  height: number;
  tiles: Tile[][];
  spawnPoint: Position;
}
