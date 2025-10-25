import { motion } from 'motion/react';

interface MorphingBlobProps {
  color?: string;
  opacity?: number;
  size?: number;
  className?: string;
  duration?: number;
}

export function MorphingBlob({ 
  color = '#FFB5D9',
  opacity = 0.3,
  size = 200,
  className = '',
  duration = 8
}: MorphingBlobProps) {
  return (
    <div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        opacity: opacity,
        willChange: 'transform',
        animation: `morphBlob ${duration}s ease-in-out infinite`,
      }}
    />
  );
}