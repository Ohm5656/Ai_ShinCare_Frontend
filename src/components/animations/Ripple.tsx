import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface RippleProps {
  color?: string;
  duration?: number;
}

interface RippleCircle {
  id: number;
  x: number;
  y: number;
}

export function useRipple() {
  const [ripples, setRipples] = useState<RippleCircle[]>([]);

  const createRipple = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return { ripples, createRipple };
}

export function RippleContainer({ 
  ripples, 
  color = 'rgba(255, 181, 217, 0.4)',
  duration = 0.6 
}: RippleProps & { ripples: RippleCircle[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-inherit">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              background: color,
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 1,
              x: 0,
              y: 0,
            }}
            animate={{
              width: 400,
              height: 400,
              opacity: 0,
              x: -200,
              y: -200,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: duration,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
