import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  emoji?: string;
}

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
  emojis?: string[];
  useEmojis?: boolean;
  containerClass?: string;
}

export function FloatingParticles({ 
  count = 15, 
  colors = ['#FFB5D9', '#7DB8FF', '#CBB8FF'],
  emojis = ['✨', '💫', '⭐', '🌟'],
  useEmojis = false,
  containerClass = ''
}: FloatingParticlesProps) {
  const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: useEmojis ? 16 + Math.random() * 8 : 2 + Math.random() * 4,
    duration: 8 + Math.random() * 8, // Slower: 8-16 seconds
    delay: Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    emoji: useEmojis ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${containerClass}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            willChange: 'transform, opacity',
            animation: `floatParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        >
          {useEmojis ? (
            <span style={{ fontSize: `${particle.size}px`, display: 'block' }}>
              {particle.emoji}
            </span>
          ) : (
            <div
              className="rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                background: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}