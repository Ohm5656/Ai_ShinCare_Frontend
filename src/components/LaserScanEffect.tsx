// LaserScanEffect.tsx - Beautiful laser scanning animation
import { motion } from 'motion/react';

interface LaserScanEffectProps {
  color: string;
  isScanning?: boolean;
}

export function LaserScanEffect({ color, isScanning = true }: LaserScanEffectProps) {
  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main horizontal laser beam */}
      <motion.div
        className="absolute left-0 right-0 h-0.5"
        animate={{
          top: ['0%', '100%', '0%'],
          opacity: [0, 1, 1, 0.7, 1, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${color}00 10%, 
            ${color}FF 50%, 
            ${color}00 90%, 
            transparent 100%
          )`,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}99, 0 0 60px ${color}66`,
          filter: 'blur(1px)'
        }}
      />

      {/* Secondary laser beam (slower) */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        animate={{
          top: ['100%', '0%', '100%'],
          opacity: [0, 0.6, 0.8, 0.6, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }}
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${color}00 20%, 
            ${color}CC 50%, 
            ${color}00 80%, 
            transparent 100%
          )`,
          boxShadow: `0 0 15px ${color}99`,
          filter: 'blur(0.5px)'
        }}
      />

      {/* Vertical scanning lines */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`vertical-${i}`}
          className="absolute top-0 bottom-0 w-px"
          animate={{
            left: ['0%', '100%'],
            opacity: [0, 0.4, 0.6, 0.4, 0]
          }}
          transition={{
            duration: 2.5 + i * 0.5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.3
          }}
          style={{
            background: `linear-gradient(180deg, 
              transparent 0%, 
              ${color}66 50%, 
              transparent 100%
            )`,
            boxShadow: `0 0 10px ${color}66`
          }}
        />
      ))}

      {/* Corner scanning indicators */}
      <motion.div
        className="absolute top-0 left-0 w-16 h-16"
        animate={{
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <div 
          className="absolute top-0 left-0 w-full h-0.5"
          style={{
            background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
            boxShadow: `0 0 10px ${color}`
          }}
        />
        <div 
          className="absolute top-0 left-0 w-0.5 h-full"
          style={{
            background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
            boxShadow: `0 0 10px ${color}`
          }}
        />
      </motion.div>

      <motion.div
        className="absolute top-0 right-0 w-16 h-16"
        animate={{
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3
        }}
      >
        <div 
          className="absolute top-0 right-0 w-full h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color} 100%)`,
            boxShadow: `0 0 10px ${color}`
          }}
        />
        <div 
          className="absolute top-0 right-0 w-0.5 h-full"
          style={{
            background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
            boxShadow: `0 0 10px ${color}`
          }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-16 h-16"
        animate={{
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.6
        }}
      >
        <div 
          className="absolute bottom-0 left-0 w-full h-0.5"
          style={{
            background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
            boxShadow: `0 0 10px ${color}`
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-0.5 h-full"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${color} 100%)`,
            boxShadow: `0 0 10px ${color}`
          }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 w-16 h-16"
        animate={{
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.9
        }}
      >
        <div 
          className="absolute bottom-0 right-0 w-full h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color} 100%)`,
            boxShadow: `0 0 10px ${color}`
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-0.5 h-full"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${color} 100%)`,
            boxShadow: `0 0 10px ${color}`
          }}
        />
      </motion.div>

      {/* Scanning particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          animate={{
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0, 1, 1.5, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2
          }}
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}, 0 0 16px ${color}99`
          }}
        />
      ))}

      {/* Grid overlay effect - very subtle */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          backgroundImage: `
            linear-gradient(${color}22 1px, transparent 1px),
            linear-gradient(90deg, ${color}22 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)'
        }}
      />
    </div>
  );
}
