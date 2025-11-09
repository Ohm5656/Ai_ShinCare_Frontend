// ============================================================================
// LaserScanEffect.tsx - Ultra Smooth Neon Beam (single-file perfect version)
// ✅ วิ่งต่อเนื่องขึ้นลง (ไม่มีสะดุด)
// ✅ ความหนา / ความสว่าง / ความลื่น ปรับไว้แล้ว
// ✅ ไม่ต้องแตะ FaceScanScreen อีก
// ============================================================================
import { motion } from "motion/react";

interface LaserScanEffectProps {
  color: string;
  isScanning: boolean;
}

export const LaserScanEffect = ({ color, isScanning }: LaserScanEffectProps) => {
  if (!isScanning) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-30"
      style={{
        mixBlendMode: "screen",
        backfaceVisibility: "hidden",
        WebkitTransform: "translateZ(0)",
        willChange: "transform, filter",
      }}
    >
      {/* === เส้นเลเซอร์หลัก (หนา + เรืองแสงจัด) === */}
      <motion.div
        className="absolute left-0 right-0"
        style={{
          top: 0,
          height: "5px", // 👉 ปรับความหนาที่นี่
          background: `linear-gradient(90deg, transparent, ${color}, ${color}, transparent)`,
          boxShadow: `
            0 0 25px ${color},
            0 0 60px ${color},
            0 0 100px ${color}AA,
            0 0 200px ${color}55
          `,
          filter: `blur(1px) drop-shadow(0 0 10px ${color})`,
          opacity: 0.95,
        }}
        animate={{
          y: ["-15%", "115%"], // 👉 วิ่งขึ้นลงเต็มกรอบ
        }}
        transition={{
          duration: 7.5, // 👉 ปรับความเร็วที่นี่ (ยิ่งมากยิ่งช้า)
          repeat: Infinity,
          ease: "linear", // 👉 ใช้ linear เพื่อให้วิ่งต่อเนื่องไม่หยุด
        }}
      />

      {/* === glow gradient ตามเส้น === */}
      <motion.div
        className="absolute left-0 right-0"
        style={{
          top: 0,
          height: "160px",
          background: `radial-gradient(circle, ${color}AA 0%, ${color}55 40%, transparent 80%)`,
          filter: `blur(90px)`,
          opacity: 0.6,
        }}
        animate={{
          y: ["-15%", "115%"],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* === ambient glow เบา ๆ ทั้งกรอบ === */}
      <div
        className="absolute inset-0 blur-[100px]"
        style={{
          background: `radial-gradient(circle at center, ${color}22 0%, transparent 90%)`,
          opacity: 0.3,
        }}
      />
    </div>
  );
};
