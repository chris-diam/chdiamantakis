import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Player, Position, Direction, Character, ChatMessage } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

interface UseSocketProps {
  token: string | null;
}

interface UseSocketReturn {
  isConnected: boolean;
  myPlayer: Player | null;
  otherPlayers: Player[];
  chatMessages: ChatMessage[];
  movePlayer: (position: Position, direction: Direction, isMoving: boolean) => void;
  stopPlayer: (direction: Direction) => void;
  updateCharacter: (character: Character) => void;
  sendChatMessage: (message: string) => void;
}

export const useSocket = ({ token }: UseSocketProps): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    // Connect to socket server
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to game server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from game server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
      setIsConnected(false);
    });

    // Initialize player
    socket.on('player-init', (data: { player: Player; otherPlayers: Player[] }) => {
      setMyPlayer(data.player);
      setOtherPlayers(data.otherPlayers);
    });

    // New player joined
    socket.on('player-joined', (player: Player) => {
      setOtherPlayers(prev => [...prev, player]);
    });

    // Player moved
    socket.on('player-moved', (data: { id: string; position: Position; direction: Direction; isMoving: boolean }) => {
      setOtherPlayers(prev =>
        prev.map(p =>
          p.id === data.id
            ? { ...p, position: data.position, direction: data.direction, isMoving: data.isMoving }
            : p
        )
      );
    });

    // Player stopped
    socket.on('player-stopped', (data: { id: string; direction: Direction }) => {
      setOtherPlayers(prev =>
        prev.map(p =>
          p.id === data.id ? { ...p, isMoving: false, direction: data.direction } : p
        )
      );
    });

    // Player updated character
    socket.on('player-updated', (data: { id: string; character: Character }) => {
      setOtherPlayers(prev =>
        prev.map(p =>
          p.id === data.id ? { ...p, character: data.character } : p
        )
      );
    });

    // Player left
    socket.on('player-left', (playerId: string) => {
      setOtherPlayers(prev => prev.filter(p => p.id !== playerId));
    });

    // Chat messages
    socket.on('chat-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev.slice(-49), message]); // Keep last 50 messages
    });

    // Player chat bubble (shows above player)
    socket.on('player-chat', (data: { id: string; message: string }) => {
      setOtherPlayers(prev =>
        prev.map(p =>
          p.id === data.id ? { ...p, chatMessage: data.message } : p
        )
      );
      // Clear the message after 5 seconds
      setTimeout(() => {
        setOtherPlayers(prev =>
          prev.map(p =>
            p.id === data.id ? { ...p, chatMessage: undefined } : p
          )
        );
      }, 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const movePlayer = useCallback((position: Position, direction: Direction, isMoving: boolean) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('player-move', { position, direction, isMoving });
      setMyPlayer(prev => prev ? { ...prev, position, direction, isMoving } : null);
    }
  }, [isConnected]);

  const stopPlayer = useCallback((direction: Direction) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('player-stop', { direction });
      setMyPlayer(prev => prev ? { ...prev, isMoving: false, direction } : null);
    }
  }, [isConnected]);

  const updateCharacter = useCallback((character: Character) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('update-character', character);
      setMyPlayer(prev => prev ? { ...prev, character } : null);
    }
  }, [isConnected]);

  const sendChatMessage = useCallback((message: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('chat-message', message);
    }
  }, [isConnected]);

  return {
    isConnected,
    myPlayer,
    otherPlayers,
    chatMessages,
    movePlayer,
    stopPlayer,
    updateCharacter,
    sendChatMessage,
  };
};
