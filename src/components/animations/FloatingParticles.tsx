// ============================================================================
// FloatingParticles.tsx — Smooth Drift + Smooth Color Transition
// ✅ จุดไม่ขยับที่ (ตำแหน่งคงที่ทุกมุม)
// ✅ ลอยช้าๆ สมูท ดูมีชีวิตชีวา
// ✅ สีเปลี่ยนตามมุม (front/left/right) แบบ fade transition
// ============================================================================

import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  emoji?: string;
  driftX: number;
  driftY: number;
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
  colors = ["#FFB5D9"],
  emojis = ["✨", "💫", "⭐", "🌟"],
  useEmojis = false,
  containerClass = "",
}: FloatingParticlesProps) {
  const particlesRef = useRef<Particle[] | null>(null);
  const [currentColor, setCurrentColor] = useState(colors[0]);

  // ✅ ให้เปลี่ยนสีแบบ smooth ทุกครั้งที่ colors[0] เปลี่ยน
  useEffect(() => {
    if (colors && colors.length > 0) {
      setCurrentColor(colors[0]);
    }
  }, [colors]);

  // ✅ สร้างตำแหน่งครั้งเดียว
  if (!particlesRef.current) {
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: useEmojis ? 16 + Math.random() * 8 : 3 + Math.random() * 5,
      duration: 10 + Math.random() * 6,
      delay: Math.random() * 4,
      color: currentColor,
      emoji: useEmojis ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
      driftX: (Math.random() - 0.5) * 40,
      driftY: (Math.random() - 0.5) * 40,
    }));
  }

  const particles = particlesRef.current;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${containerClass}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: [0, p.driftX, 0],
            y: [0, p.driftY, 0],
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.9, 0.4],
            filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
            backgroundColor: currentColor,
            boxShadow: [
              `0 0 ${p.size * 2.5}px ${currentColor}`,
              `0 0 ${p.size * 3}px ${currentColor}`,
            ],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        >
          {useEmojis ? (
            <motion.span
              style={{
                fontSize: `${p.size}px`,
                display: "block",
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
                color: currentColor,
              }}
              transition={{
                duration: p.duration * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.delay,
              }}
            >
              {p.emoji}
            </motion.span>
          ) : (
            <motion.div
              className="rounded-full"
              animate={{
                backgroundColor: currentColor,
                boxShadow: `0 0 ${p.size * 3}px ${currentColor}`,
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
              style={{
                width: p.size,
                height: p.size,
                opacity: 0.8,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}