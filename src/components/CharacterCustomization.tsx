import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Character } from '../types';
import { Astronaut3D } from './Astronaut3D';

// Suit colors for astronaut customization
const SUIT_COLORS = [
  { name: 'Classic White', color: '#ffffff' },
  { name: 'Mars Red', color: '#e63946' },
  { name: 'Ocean Blue', color: '#457b9d' },
  { name: 'Nebula Teal', color: '#2a9d8f' },
  { name: 'Solar Gold', color: '#e9c46a' },
  { name: 'Sunset Orange', color: '#f4a261' },
  { name: 'Cosmic Purple', color: '#9b5de5' },
  { name: 'Aurora Cyan', color: '#00f5d4' },
  { name: 'Nova Pink', color: '#ff006e' },
  { name: 'Galaxy Violet', color: '#8338ec' },
];

// Visor colors
const VISOR_COLORS = [
  { name: 'Gold Reflective', color: '#ffd700' },
  { name: 'Blue Reflective', color: '#00bfff' },
  { name: 'Red Tint', color: '#ff6b6b' },
  { name: 'Green Tint', color: '#50fa7b' },
  { name: 'Purple Tint', color: '#bd93f9' },
  { name: 'Pink Tint', color: '#ff79c6' },
  { name: 'Yellow Tint', color: '#f1fa8c' },
  { name: 'Cyan Tint', color: '#8be9fd' },
];

// Accent colors for stripes and details
const ACCENT_COLORS = [
  { name: 'Dark Navy', color: '#1a1a2e' },
  { name: 'Mission Red', color: '#e63946' },
  { name: 'Command Gold', color: '#ffd700' },
  { name: 'Science Blue', color: '#00bfff' },
  { name: 'Engineering Green', color: '#50fa7b' },
  { name: 'Medical Pink', color: '#ff79c6' },
  { name: 'Ops Yellow', color: '#f1fa8c' },
  { name: 'Clean White', color: '#ffffff' },
];

// Backpack styles
const BACKPACK_STYLES = [
  { name: 'Standard', description: 'Basic life support' },
  { name: 'Heavy', description: 'Extended EVA kit' },
  { name: 'Slim', description: 'Light exploration' },
  { name: 'None', description: 'Station crew' },
];

// Helmet decorations (based on hairStyle)
const HELMET_STYLES = [
  { name: 'Antenna', description: 'Communication relay' },
  { name: 'Headlamp', description: 'Exploration light' },
  { name: 'Standard', description: 'Basic helmet' },
];

interface CharacterCustomizationProps {
  initialCharacter?: Character;
  onSave: (character: Character) => void;
  onSkip?: () => void;
  isNewPlayer?: boolean;
}

export function CharacterCustomization({
  initialCharacter,
  onSave,
  onSkip,
  isNewPlayer = false
}: CharacterCustomizationProps) {
  const [character, setCharacter] = useState<Character>(initialCharacter || {
    skinColor: 0,    // Suit color
    hairStyle: 0,    // Helmet decoration
    hairColor: 0,    // Visor color
    shirtColor: 0,   // Accent color
    pantsColor: 0,   // Backpack style
    hatStyle: -1,
  });

  const updateCharacter = (key: keyof Character, value: number) => {
    setCharacter(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-4xl w-full border border-purple-500/30">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          {isNewPlayer ? '🚀 Design Your Spacesuit' : '🛸 Customize Your Spacesuit'}
        </h1>
        <p className="text-center text-purple-300 mb-8">
          {isNewPlayer ? 'Prepare for your lunar mission!' : 'Modify your EVA gear'}
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* 3D Preview */}
          <div className="flex-1 flex flex-col items-center">
            <div
              className="bg-black rounded-xl overflow-hidden mb-4 border border-purple-500/30"
              style={{ width: 280, height: 350 }}
            >
              <Canvas
                camera={{
                  position: [0, 1, 3],
                  fov: 40,
                }}
                gl={{ alpha: true, antialias: true }}
              >
                {/* Space background */}
                <color attach="background" args={['#000010']} />
                <Stars radius={50} depth={30} count={1000} factor={2} fade />

                {/* Lighting */}
                <ambientLight intensity={0.3} color="#4a5568" />
                <directionalLight position={[3, 5, 3]} intensity={1} color="#fff5e6" />
                <directionalLight position={[-2, 3, -2]} intensity={0.3} color="#4a90d9" />

                {/* Astronaut */}
                <Astronaut3D
                  character={character}
                  direction="down"
                  isMoving={false}
                  scale={1.2}
                />

                {/* Controls */}
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 2}
                  target={[0, 0.8, 0]}
                />
              </Canvas>
            </div>
            <p className="text-gray-400 text-sm">Drag to rotate your astronaut</p>
          </div>

          {/* Options */}
          <div className="flex-1 space-y-5 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500">
            {/* Suit Color */}
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">🧥 Suit Color</label>
              <div className="flex gap-2 flex-wrap">
                {SUIT_COLORS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => updateCharacter('skinColor', index)}
                    title={item.name}
                    className={`w-9 h-9 rounded-full border-3 transition-all hover:scale-110 ${
                      character.skinColor === index
                        ? 'border-cyan-400 scale-110 ring-2 ring-cyan-400/50'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              </div>
            </div>

            {/* Visor Color */}
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">🪖 Visor Tint</label>
              <div className="flex gap-2 flex-wrap">
                {VISOR_COLORS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => updateCharacter('hairColor', index)}
                    title={item.name}
                    className={`w-9 h-9 rounded-full border-3 transition-all hover:scale-110 ${
                      character.hairColor === index
                        ? 'border-cyan-400 scale-110 ring-2 ring-cyan-400/50'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">✨ Accent Stripes</label>
              <div className="flex gap-2 flex-wrap">
                {ACCENT_COLORS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => updateCharacter('shirtColor', index)}
                    title={item.name}
                    className={`w-9 h-9 rounded-full border-3 transition-all hover:scale-110 ${
                      character.shirtColor === index
                        ? 'border-cyan-400 scale-110 ring-2 ring-cyan-400/50'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              </div>
            </div>

            {/* Helmet Style */}
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">📡 Helmet Gear</label>
              <div className="flex gap-2 flex-wrap">
                {HELMET_STYLES.map((style, index) => (
                  <button
                    key={index}
                    onClick={() => updateCharacter('hairStyle', index)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                      character.hairStyle === index
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <span className="block font-medium">{style.name}</span>
                    <span className="text-xs opacity-70">{style.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Backpack Style */}
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">🎒 Life Support Pack</label>
              <div className="flex gap-2 flex-wrap">
                {BACKPACK_STYLES.map((style, index) => (
                  <button
                    key={index}
                    onClick={() => updateCharacter('pantsColor', index)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                      character.pantsColor === index
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <span className="block font-medium">{style.name}</span>
                    <span className="text-xs opacity-70">{style.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {onSkip && (
            <button
              onClick={onSkip}
              className="px-6 py-3 rounded-lg border-2 border-gray-600 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-colors"
            >
              {isNewPlayer ? '🎲 Randomize' : 'Cancel'}
            </button>
          )}
          <button
            onClick={() => onSave(character)}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
          >
            {isNewPlayer ? '🚀 Launch Mission!' : '💾 Save Suit'}
          </button>
        </div>
      </div>
    </div>
  );
}
