import { useEffect, useState } from 'react';

interface ChatBubbleProps {
  message: string;
  isCurrentPlayer?: boolean;
}

export function ChatBubble({ message, isCurrentPlayer = false }: ChatBubbleProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Start fading after 4 seconds
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 4000);

    // Hide completely after 5 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [message]);

  if (!isVisible || !message) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '4px',
        opacity,
        transition: 'opacity 1s ease-out',
      }}
    >
      <div
        className={`relative px-3 py-1.5 rounded-lg text-sm whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis ${
          isCurrentPlayer
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-800 border border-gray-200'
        }`}
        style={{
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {message}
        {/* Speech bubble tail */}
        <div
          className={`absolute w-0 h-0 left-1/2 -translate-x-1/2 ${
            isCurrentPlayer
              ? 'border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-blue-500'
              : 'border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white'
          }`}
          style={{
            bottom: '-6px',
          }}
        />
      </div>
    </div>
  );
}
