import { motion } from 'motion/react';

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export function ShimmerText({ children, className = '', duration = 2 }: ShimmerTextProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="relative overflow-hidden">
        {children}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          }}
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 1,
          }}
        />
      </div>
    </div>
  );
}
