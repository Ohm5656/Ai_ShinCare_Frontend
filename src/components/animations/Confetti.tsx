import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  size: number;
  color: string;
  rotation: number;
  duration: number;
}

interface ConfettiProps {
  active?: boolean;
  count?: number;
  colors?: string[];
  duration?: number;
}

export function Confetti({ 
  active = true, 
  count = 50,
  colors = ['#FFB5D9', '#7DB8FF', '#CBB8FF', '#FFD1E7', '#A0CBFF'],
  duration = 3000
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(active);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only trigger once when active changes from false to true
    if (active && !hasInitialized.current) {
      hasInitialized.current = true;
      setIsActive(true);
      const confettiPieces: ConfettiPiece[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 8 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        duration: 2 + Math.random() * 2,
      }));
      setPieces(confettiPieces);

      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);

      return () => clearTimeout(timer);
    }
    
    // Reset when active becomes false
    if (!active) {
      hasInitialized.current = false;
    }
  }, [active, count, duration]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute top-0"
              style={{
                left: `${piece.x}%`,
              }}
              initial={{
                y: -20,
                opacity: 1,
                rotate: piece.rotation,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0.8, 0],
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: piece.duration,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div
                className="rounded-sm"
                style={{
                  width: piece.size,
                  height: piece.size,
                  background: piece.color,
                  boxShadow: `0 0 ${piece.size}px ${piece.color}`,
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}