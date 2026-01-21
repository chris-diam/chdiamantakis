import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Game3D } from './components/Game3D';
import { CharacterCustomization } from './components/CharacterCustomization';
import { Character } from './types';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, isNewPlayer, user, updateCharacter, completeCustomization } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  // Show character customization for new players
  if (isNewPlayer && user) {
    const handleSaveCharacter = async (character: Character) => {
      await updateCharacter(character);
      completeCustomization();
    };

    return (
      <CharacterCustomization
        initialCharacter={user.character}
        onSave={handleSaveCharacter}
        onSkip={completeCustomization}
        isNewPlayer={true}
      />
    );
  }

  return <Game3D />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
