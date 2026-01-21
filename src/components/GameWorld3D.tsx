import { useMemo } from 'react';
import { MoonTile3D } from './MoonTile3D';
import { gameMap } from '../data/gameMap';

export function GameWorld3D() {
  // Generate tiles from the game map
  const tiles = useMemo(() => {
    const tileElements: JSX.Element[] = [];

    for (let y = 0; y < gameMap.height; y++) {
      for (let x = 0; x < gameMap.width; x++) {
        const tile = gameMap.tiles[y][x];
        // Convert 2D grid position to 3D world position
        // Center the map at origin
        const posX = x - gameMap.width / 2;
        const posZ = y - gameMap.height / 2;

        tileElements.push(
          <MoonTile3D
            key={`${x}-${y}`}
            type={tile.type}
            position={[posX, 0, posZ]}
            variant={tile.variant ?? (x * 7 + y * 13) % 10}
          />
        );
      }
    }

    return tileElements;
  }, []);

  return (
    <group>
      {tiles}

      {/* Moon surface beneath the tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
        <planeGeometry args={[gameMap.width + 20, gameMap.height + 20]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.95} />
      </mesh>
    </group>
  );
}
