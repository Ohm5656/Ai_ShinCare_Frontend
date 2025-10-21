import { motion } from "motion/react";

interface GlowbieBellLogoProps {
  size?: number;
  animated?: boolean;
}

export function GlowbieBellLogo({
  size = 200,
  animated = true,
}: GlowbieBellLogoProps) {
  const LogoContent = () => (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,181,217,0.5) 0%, rgba(183,157,255,0.3) 50%, rgba(125,184,255,0.4) 100%)",
        }}
      />
      {/* ✅ ใช้ path จาก public */}
      <img
        src="/logo.png"
        alt="GlowbieBell Logo"
        style={{ width: size, height: size }}
        className="relative z-10 drop-shadow-lg"
      />
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <LogoContent />
        </motion.div>
      </motion.div>
    );
  }

  return <LogoContent />;
}
