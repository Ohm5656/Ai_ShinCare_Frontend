// ============================================================================
// FaceOverlay_v9.1_SwapLeftRightFrame.tsx
// 💫 Glow ฟุ้งนุ่ม / Laser มีมิติ / ซ้ายขวาสลับกรอบ / ลูกศรชี้ถูกทิศ
// ============================================================================
import React, { useMemo } from "react";
import { motion } from "motion/react";

interface FaceOverlayProps {
  angle: "front" | "left" | "right";
  color: string;
  isActive?: boolean;
}

export function FaceOverlay({
  angle,
  color,
  isActive = false,
}: FaceOverlayProps) {
  const view = { w: 280, h: 340, cx: 140, cy: 170 };

  // 🎯 Geometry (สลับซ้ายขวา)
  const geom = useMemo(() => {
    if (angle === "front") return { rx: 100, ry: 135, rotateDeg: 0 };
    // 🔄 swap: left ใช้มุมขวา / right ใช้มุมซ้าย
    if (angle === "left") return { rx: 95, ry: 135, rotateDeg: 15 }; // เดิมของ right
    if (angle === "right") return { rx: 95, ry: 135, rotateDeg: -15 }; // เดิมของ left
    return { rx: 100, ry: 135, rotateDeg: 0 };
  }, [angle]);

  // 🌈 Glow ฟุ้งนุ่ม
  const GlowBase = (
    <motion.ellipse
      cx={view.cx}
      cy={view.cy}
      rx={geom.rx}
      ry={geom.ry}
      stroke={`${color}44`}
      strokeWidth="5"
      fill="none"
      animate={{
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        filter: `drop-shadow(0 0 25px ${color}77) drop-shadow(0 0 60px ${color}55) drop-shadow(0 0 90px ${color}33)`,
      }}
    />
  );

  // 🔴 Laser CW
  const LaserOrbitCW = (
    <motion.ellipse
      cx={view.cx}
      cy={view.cy}
      rx={geom.rx}
      ry={geom.ry}
      stroke={color}
      strokeWidth="3"
      fill="none"
      vectorEffect="non-scaling-stroke"
      strokeDasharray="180 380"
      animate={{ strokeDashoffset: [0, -560] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      style={{
        filter: `drop-shadow(0 0 25px ${color}DD) drop-shadow(0 0 45px ${color}99)`,
        strokeLinecap: "round",
      }}
    />
  );

  // 🔵 Laser CCW
  const LaserOrbitCCW = (
    <motion.ellipse
      cx={view.cx}
      cy={view.cy}
      rx={geom.rx}
      ry={geom.ry}
      stroke={`${color}AA`}
      strokeWidth="2.5"
      fill="none"
      vectorEffect="non-scaling-stroke"
      strokeDasharray="150 410"
      animate={{ strokeDashoffset: [0, 560] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{
        filter: `drop-shadow(0 0 20px ${color}BB) drop-shadow(0 0 35px ${color}77)`,
        strokeLinecap: "round",
      }}
    />
  );

  // 🟢 Soft shimmer
  const LaserOrbitSoft = (
    <motion.ellipse
      cx={view.cx}
      cy={view.cy}
      rx={geom.rx}
      ry={geom.ry}
      stroke={`${color}55`}
      strokeWidth="1.8"
      fill="none"
      vectorEffect="non-scaling-stroke"
      strokeDasharray="200 420"
      animate={{ strokeDashoffset: [0, -580] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      style={{
        filter: `drop-shadow(0 0 10px ${color}55) drop-shadow(0 0 20px ${color}44)`,
        strokeLinecap: "round",
      }}
    />
  );

  // 🧭 ลูกศร (ชี้ถูกทิศตามหน้าที่ต้องหัน)
  const Arrow =
    angle === "right" || angle === "left" ? (
      <motion.g
        animate={
          isActive
            ? { opacity: 1, x: 0 }
            : angle === "right"
            ? // 👈 ตอนนี้ขวาให้หัน "ไปขวา"
              { opacity: [0.4, 1, 0.4], x: [-10, 6, -10] }
            : // 👉 ตอนนี้ซ้ายให้หัน "ไปซ้าย"
              { opacity: [0.4, 1, 0.4], x: [10, -6, 10] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d={
            angle === "right"
              ? // ลูกศรชี้ขวา
                "M 210 170 L 232 170 M 232 170 L 224 162 M 232 170 L 224 178"
              : // ลูกศรชี้ซ้าย
                "M 70 170 L 48 170 M 48 170 L 56 162 M 48 170 L 56 178"
          }
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 12px ${color}DD) drop-shadow(0 0 28px ${color}99)`,
          }}
        />
      </motion.g>
    ) : null;

  // ===== Render SVG =====
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${view.w} ${view.h}`}
      className="absolute inset-0 pointer-events-none"
      style={{ willChange: "opacity, transform", mixBlendMode: "screen" }}
    >
      <g transform={`rotate(${geom.rotateDeg} ${view.cx} ${view.cy})`}>
        {GlowBase}
        {LaserOrbitSoft}
        {LaserOrbitCW}
        {LaserOrbitCCW}
        {Arrow}
      </g>
    </svg>
  );
}