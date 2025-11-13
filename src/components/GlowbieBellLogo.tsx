import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles, Star } from 'lucide-react';
import logoImage from "../assets/a17aae9c561bd3549a86038318e99647bffc816a.png";

interface GlowbieBellLogoProps {
  size?: number;
  animated?: boolean;
}

export function GlowbieBellLogo({ size = 280, animated = true }: GlowbieBellLogoProps) {
  const LogoContent = ({ enableFloating = false }: { enableFloating?: boolean }) => (
    <div className="relative flex items-center justify-center" style={{ width: size * 1.4, height: size * 1.2 }}>
      {/* Top decorative stars - with gentle floating */}
      <motion.div 
        className="absolute top-0 left-1/4 opacity-80"
        animate={enableFloating ? {
          y: [0, -6, 0],
          rotate: [0, 5, 0],
        } : {}}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Star className="w-6 h-6 text-[#CBB8FF] fill-[#CBB8FF]" />
      </motion.div>
      
      <motion.div 
        className="absolute top-4 right-1/4 opacity-70"
        animate={enableFloating ? {
          y: [0, -5, 0],
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Sparkles className="w-5 h-5 text-[#9B8FD9] fill-[#9B8FD9]" />
      </motion.div>

      <motion.div 
        className="absolute top-2 right-1/3 opacity-80"
        animate={enableFloating ? {
          y: [0, -4, 0],
          opacity: [0.8, 1, 0.8],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Star className="w-4 h-4 text-[#8FA8D9] fill-[#8FA8D9]" />
      </motion.div>

      {/* Left side decorative elements */}
      <motion.div 
        className="absolute left-0 top-1/3 opacity-60"
        animate={enableFloating ? {
          x: [-2, 2, -2],
          y: [0, -5, 0],
        } : {}}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <Star className="w-5 h-5 text-[#7DB8FF] fill-[#7DB8FF]" />
      </motion.div>

      {/* Right side decorative elements */}
      <motion.div 
        className="absolute right-0 top-1/3 opacity-70"
        animate={enableFloating ? {
          x: [2, -2, 2],
          y: [0, -6, 0],
        } : {}}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7,
        }}
      >
        <Sparkles className="w-6 h-6 text-[#CBB8FF] fill-[#CBB8FF]" />
      </motion.div>

      {/* Gradient glow backgrounds - matching new logo */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(139, 152, 217, 0.6) 0%, transparent 50%)',
        }}
      />
      <div 
        className="absolute inset-0 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 70% 70%, rgba(203, 184, 255, 0.6) 0%, transparent 50%)',
        }}
      />
      <div 
        className="absolute inset-0 rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(125, 184, 255, 0.5) 0%, transparent 60%)',
        }}
      />
      
      {/* Main Logo Image - with gentle floating */}
      <motion.div
        animate={enableFloating ? {
          y: [0, -8, 0],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
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
      </motion.div>

      {/* Bottom decorative elements */}
      <motion.div 
        className="absolute bottom-4 left-1/3 opacity-80"
        animate={enableFloating ? {
          y: [0, 5, 0],
          rotate: [0, -5, 0],
        } : {}}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      >
        <Star className="w-4 h-4 text-[#9B8FD9] fill-[#9B8FD9]" />
      </motion.div>

      <motion.div 
        className="absolute bottom-2 right-1/4 opacity-70"
        animate={enableFloating ? {
          y: [0, 6, 0],
          scale: [1, 1.15, 1],
        } : {}}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        <Sparkles className="w-5 h-5 text-[#8FA8D9] fill-[#8FA8D9]" />
      </motion.div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200,
          damping: 15,
          duration: 0.6
        }}
      >
        <LogoContent enableFloating={true} />
      </motion.div>
    );
  }

  return <LogoContent enableFloating={false} />;
}