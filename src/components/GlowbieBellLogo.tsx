import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles, Star } from 'lucide-react';
import logoImage from 'figma:asset/4c09f2df8b0508b15b15a1b1c02eaad53974961a.png';

interface GlowbieBellLogoProps {
  size?: number;
  animated?: boolean;
}

export function GlowbieBellLogo({ size = 280, animated = true }: GlowbieBellLogoProps) {
  const LogoContent = () => (
    <div className="relative flex items-center justify-center" style={{ width: size * 1.4, height: size * 1.2 }}>
      {/* Top decorative stars */}
      <motion.div
        className="absolute top-0 left-1/4"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Star className="w-6 h-6 text-[#FFB5D9] fill-[#FFB5D9]" />
      </motion.div>
      
      <motion.div
        className="absolute top-4 right-1/4"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <Sparkles className="w-5 h-5 text-[#CBB8FF] fill-[#CBB8FF]" />
      </motion.div>

      <motion.div
        className="absolute top-2 right-1/3"
        animate={{ 
          scale: [1, 1.4, 1],
          rotate: [0, -180, -360],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Star className="w-4 h-4 text-[#7DB8FF] fill-[#7DB8FF]" />
      </motion.div>

      {/* Left side decorative elements */}
      <motion.div
        className="absolute left-0 top-1/3"
        animate={{ 
          x: [-3, 3, -3],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Star className="w-5 h-5 text-[#7DB8FF] fill-[#7DB8FF]" />
      </motion.div>

      {/* Right side decorative elements */}
      <motion.div
        className="absolute right-0 top-1/3"
        animate={{ 
          x: [3, -3, 3],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
      >
        <Sparkles className="w-6 h-6 text-[#FFB5D9] fill-[#FFB5D9]" />
      </motion.div>

      {/* Gradient glow backgrounds */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(125, 184, 255, 0.6) 0%, transparent 50%)',
        }}
      />
      <div 
        className="absolute inset-0 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 70% 70%, rgba(255, 181, 217, 0.6) 0%, transparent 50%)',
        }}
      />
      <div 
        className="absolute inset-0 rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(203, 184, 255, 0.5) 0%, transparent 60%)',
        }}
      />
      
      {/* Main Logo Image */}
      <ImageWithFallback
        src={logoImage} 
        alt="GlowbieBell Logo"
        style={{ 
          width: size, 
          height: size,
          objectFit: 'contain',
        }}
        className="relative z-10 drop-shadow-2xl"
      />

      {/* Bottom decorative elements */}
      <motion.div
        className="absolute bottom-4 left-1/3"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <Star className="w-4 h-4 text-[#CBB8FF] fill-[#CBB8FF]" />
      </motion.div>

      <motion.div
        className="absolute bottom-2 right-1/4"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, 360, 720],
          opacity: [0.5, 0.9, 0.5]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8
        }}
      >
        <Sparkles className="w-5 h-5 text-[#7DB8FF] fill-[#7DB8FF]" />
      </motion.div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200,
          damping: 15,
          duration: 0.6
        }}
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <LogoContent />
        </motion.div>
      </motion.div>
    );
  }

  return <LogoContent />;
}