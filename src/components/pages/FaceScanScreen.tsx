// FaceScanScreen_full_v6.3.tsx
// =====================================================================================================================
// v6.3 — Merge UI/UX of your new design with v6.2 scan engine
// - Keep: scan box, hints, countdown 3→2→1, flash, MediaPipe FaceMesh, sign-swap, stability logic (from v6.2)
// - Add: FloatingParticles background + soft color blobs + step dots/thumbnail style from your new snippet
// - Analyzing: loop the 3 actually captured images with hologram grid + laser scans + progress bar
// - NEW (v6.3+patch): ป้องกันเคาน์ต์ดาวน์ถ่ายตอนหน้า “ออกนอกกรอบ/มุมไม่ถูก” และตรวจซ้ำก่อนถ่ายจริง
// =====================================================================================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { useLanguage } from "../../contexts/LanguageContext";
import { FloatingParticles } from "../animations/FloatingParticles";

// ============ Types ============
interface FaceScanScreenProps {
  onAnalyze: () => void; // ถูกเรียกหลัง “Analyzing” เสร็จ
  onBack: () => void;    // ปุ่มย้อนกลับ
}
type ScanStep = "front" | "left" | "right" | "analyzing";
interface StepStatus {
  front: boolean;
  left: boolean;
  right: boolean;
}
interface Captured {
  front: string | null;
  left: string | null;
  right: string | null;
}
type Lang = "th" | "en" | "zh";

// ============ Tunables (keep from v6.2) ============
const FRONT_YAW_MAX = 7;         // ยอมให้หน้าตรงเอียงซ้าย/ขวาได้ ±7°
const SIDE_YAW_MIN = 20;         // มุมข้างต้องหันอย่างน้อย ~20°
const SIDE_YAW_MAX = 60;         // และไม่เกิน ~60°
const HYST_MARGIN = 3.0;         // ฮิสเทอรีซิสสำหรับ “near target” กันเด้ง
const STABLE_MS = 1000;          // ต้องนิ่ง (faceOk) ต่อเนื่องกี่ ms ถึงเริ่มนับ 3→2→1
const COUNTDOWN_SEC = 3;         // เวลานับถอยหลัง
const FLASH_DELAY_MS = 100;      // หน่วงแฟลชหลังบันทึก
const EMA_ALPHA = 0.28;          // ค่าถ่วงน้ำหนัก EMA ของ yaw
const CENTER_TOL = 0.14;         // ระยะเบี่ยงจากจุดกลาง (normalized) ที่ยอมรับได้
const CAPTURE_W = 560;           // ความกว้างภาพที่บันทึก (ปรับตาม BOX_W/H เพื่ออัตราส่วน)
const BOX_W = 280;               // ความกว้างกรอบสแกน (px)
const BOX_H = 340;               // ความสูงกรอบสแกน (px)

const THEME = { front: "#FFB5D9", left: "#7DB8FF", right: "#CBB8FF" } as const;

// ============ i18n hints (keep 1-line hint style) ============
const HINTS: Record<
  Lang,
  {
    moveIntoFrame: string;
    centerNose: string;
    moveLeft: string;
    moveRight: string;
    moveUp: string;
    moveDown: string;
    turnLeftMsg: string;
    turnRightMsg: string;
    holdGood: string;
  }
> = {
  th: {
    moveIntoFrame: "ขยับเข้ามาอยู่ในกรอบ",
    centerNose: "เอาจมูกวางที่จุดกลาง",
    moveLeft: "ขยับไปทางขวาเล็กน้อย",
    moveRight: "ขยับไปทางซ้ายเล็กน้อย",
    moveUp: "เงยขึ้นเล็กน้อย",
    moveDown: "ก้มลงเล็กน้อย",
    turnLeftMsg: "หันหน้าไปทางซ้ายอีกนิด",
    turnRightMsg: "หันหน้าไปทางขวาอีกนิด",
    holdGood: "ดีมาก! ค้างไว้…",
  },
  en: {
    moveIntoFrame: "Move into the frame",
    centerNose: "Place your nose on the center dot",
    moveLeft: "Move slightly right",
    moveRight: "Move slightly left",
    moveUp: "Tilt up a bit",
    moveDown: "Tilt down slightly",
    turnLeftMsg: "Turn a bit more left",
    turnRightMsg: "Turn a bit more right",
    holdGood: "Nice! Hold still…",
  },
  zh: {
    moveIntoFrame: "移到取景框内",
    centerNose: "将鼻子对准中心点",
    moveLeft: "稍微向左",
    moveRight: "稍微向右",
    moveUp: "稍微抬头",
    moveDown: "稍微低头",
    turnLeftMsg: "再向左转一点",
    turnRightMsg: "再向右转一点",
    holdGood: "很好，请保持不动…",
  },
};

// ============ Geometry helpers ============

/**
 * คำนวณมุม yaw แบบคร่าว ๆ (องศา) จาก FaceMesh landmarks
 * - ใช้ landmark ซ้าย 234, ขวา 454, จมูก 1
 * - แปลง dx/width → atan2 → degree → คูณ factor ให้ scale สมจริงขึ้น
 */
function estimateYawDeg(lm: any[]): number {
  const L = lm[234],
    R = lm[454],
    N = lm[1];
  if (!L || !R || !N) return 0;
  const midX = (L.x + R.x) / 2;
  const w = Math.abs(R.x - L.x) || 1e-6;
  const dx = N.x - midX;
  const yawRad = Math.atan2(dx, w);
  const yawDeg = (yawRad * 180) / Math.PI;
  return -yawDeg * 1.35; // สลับข้าง + scale
}

/** ตรวจว่ามุม yaw “เข้าเงื่อนไข” ของ step นั้น ๆ */
function isYawOk(step: ScanStep, y: number) {
  if (step === "front") return Math.abs(y) <= FRONT_YAW_MAX;
  if (step === "left") return y <= -SIDE_YAW_MIN && y >= -SIDE_YAW_MAX;
  if (step === "right") return y >= SIDE_YAW_MIN && y <= SIDE_YAW_MAX;
  return false;
}

/** ตรวจว่า yaw “ใกล้จะเข้าเงื่อนไข” (ใช้ทำ hint อ่อน ๆ และ hysteresis) */
function isYawNear(step: ScanStep, y: number) {
  if (step === "front") return Math.abs(y) <= FRONT_YAW_MAX + HYST_MARGIN;
  if (step === "left")
    return y <= -(SIDE_YAW_MIN - HYST_MARGIN) && y >= -(SIDE_YAW_MAX + 4);
  if (step === "right")
    return y >= SIDE_YAW_MIN - HYST_MARGIN && y <= SIDE_YAW_MAX + 4;
  return false;
}

/**
 * สร้างข้อความ Hint แบบบรรทัดเดียว ตามสถานะปัจจุบัน
 * - แยกกรณี front (ต้อง centered) vs side (เน้น yaw)
 * - ถ้ากำลัง countdown และ hintReady = true → บอก “ค้างไว้…”
 */
function computeHint(
  lang: Lang,
  step: ScanStep,
  found: boolean,
  yaw: number,
  nx: number | null,
  ny: number | null,
  hReady: boolean,
  cd: number | null
) {
  const t = HINTS[lang];
  if (!found) return t.moveIntoFrame;
  const ok = isYawOk(step, yaw);
  const near = isYawNear(step, yaw);
  if (hReady && cd != null) return t.holdGood;

  if (step === "front") {
    if (nx == null || ny == null) return t.centerNose;
    const cx = nx - 0.5,
      cy = ny - 0.5;
    if (Math.abs(cx) >= CENTER_TOL || Math.abs(cy) >= CENTER_TOL) {
      if (cx > CENTER_TOL) return t.moveLeft;
      if (cx < -CENTER_TOL) return t.moveRight;
      if (cy > CENTER_TOL) return t.moveUp;
      if (cy < -CENTER_TOL) return t.moveDown;
    }
    if (!ok && !near) return t.centerNose;
    return t.holdGood;
  }
  if (!ok && near) return yaw >= 0 ? t.turnRightMsg : t.turnLeftMsg;
  if (!ok && !near) return step === "left" ? t.turnLeftMsg : t.turnRightMsg;
  return t.holdGood;
}

/**
 * ยูทิลตรวจ “ยังอยู่ในกรอบและมุมถูกต้อง” ใช้ทั้งตอน countdown และก่อนถ่ายจริง
 * - front: ต้อง centered + yaw ok
 * - side: yaw ok เป็นหลัก (ไม่บังคับ centered)
 */
function inFrameAndAngleOk(step: ScanStep, yaw: number, nose: { x: number; y: number } | null) {
  if (!nose) return false;
  if (step === "front") {
    const cx = nose.x - 0.5;
    const cy = nose.y - 0.5;
    const centered = Math.abs(cx) < CENTER_TOL && Math.abs(cy) < CENTER_TOL;
    return centered && isYawOk(step, yaw);
  }
  return isYawOk(step, yaw);
}

// ============ Face Oval Guide (unchanged visual guide) ============
const FaceOvalGuide: React.FC<{
  color: string;
  active: boolean;
  step: ScanStep;
  width: number;
  height: number;
  showCenterMarker: boolean;
}> = ({ color, active, step, width, height, showCenterMarker }) => {
  const cx = width / 2,
    cy = height / 2 + 6,
    rx = width * 0.32,
    ry = height * 0.4;
  const rot = step === "front" ? 0 : step === "left" ? 12 : -12;
  const b = 22,
    stroke = active ? 2 : 1.4;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    >
      {/* corner lines */}
      <g opacity={0.9} filter="url(#glow)">
        <line x1={16} y1={16} x2={16 + b} y2={16} stroke={color} strokeWidth={2} />
        <line x1={16} y1={16} x2={16} y2={16 + b} stroke={color} strokeWidth={2} />
        <line x1={width - 16} y1={16} x2={width - 16 - b} y2={16} stroke={color} strokeWidth={2} />
        <line x1={width - 16} y1={16} x2={width - 16} y2={16 + b} stroke={color} strokeWidth={2} />
        <line x1={16} y1={height - 16} x2={16 + b} y2={height - 16} stroke={color} strokeWidth={2} />
        <line x1={16} y1={height - 16} x2={16} y2={height - 16 - b} stroke={color} strokeWidth={2} />
        <line x1={width - 16} y1={height - 16} x2={width - 16 - b} y2={height - 16} stroke={color} strokeWidth={2} />
        <line x1={width - 16} y1={height - 16} x2={width - 16} y2={height - 16 - b} stroke={color} strokeWidth={2} />
      </g>

      {/* active outer ellipse */}
      {active && (
        <g opacity={0.7}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx + 10}
            ry={ry + 10}
            transform={`rotate(${rot} ${cx} ${cy})`}
            fill="none"
            stroke={color}
            strokeOpacity={0.35}
            strokeWidth={8}
          />
        </g>
      )}

      {/* inner face outline */}
      <g>
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          transform={`rotate(${rot} ${cx} ${cy})`}
          fill="none"
          stroke={color}
          strokeOpacity={0.95}
          strokeWidth={stroke}
        />
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          transform={`rotate(${rot} ${cx} ${cy})`}
          fill="none"
          stroke={color}
          strokeOpacity={0.45}
          strokeWidth={1}
          strokeDasharray="10 10"
        >
          <animate attributeName="stroke-dashoffset" values="0;20" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* center marker */}
      {showCenterMarker && (
        <g>
          <circle cx={cx} cy={cy} r={3} fill={color} opacity={0.95} />
          <circle cx={cx} cy={cy} r={7} fill="none" stroke={color} strokeWidth={1} opacity={0.9}>
            <animate attributeName="r" values="7;10;7" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

// ============ Component ============
export function FaceScanScreen({ onAnalyze, onBack }: FaceScanScreenProps) {
  const { t } = useLanguage();
  const lang = (t.language as Lang) ?? "th";

  // Core state
  const [currentStep, setCurrentStep] = useState<ScanStep>("front");
  const [done, setDone] = useState<StepStatus>({ front: false, left: false, right: false });
  const [captured, setCaptured] = useState<Captured>({ front: null, left: null, right: null });

  // Media refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const capCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mpCameraRef = useRef<Camera | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stability / countdown
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [bigCount, setBigCount] = useState<number | null>(null);
  const stableStartRef = useRef<number | null>(null);
  const emaYawRef = useRef<number>(0); // เก็บ yaw ล่าสุด (EMA)
  const lastNoseRef = useRef<{ x: number; y: number } | null>(null); // เก็บตำแหน่งจมูก normalized

  // Hint
  const [hintReady, setHintReady] = useState(false);
  const [hintText, setHintText] = useState("");

  // Flow lock
  const stepLockedRef = useRef(false);

  // Analyzing animation
  const [activeAnalyzingIdx, setActiveAnalyzingIdx] = useState(0); // 0=front 1=left 2=right
  const [thumbFlipIdx, setThumbFlipIdx] = useState(0);

  // CameraReady overlay (ป้องกันเฟรมดำแรกเริ่ม)
  const [cameraReady, setCameraReady] = useState(false);

  // Progress
  const [progress, setProgress] = useState(0);

  // Step info (colors for UI shell)
  const stepInfo = useMemo(() => {
    if (currentStep === "front") {
      return {
        title: lang === "th" ? "มุมที่ 1: หน้าตรง" : lang === "en" ? "Angle 1: Front Face" : "角度 1：正面",
        instruction: lang === "th" ? "มองตรงไปที่กล้อง" : lang === "en" ? "Look straight at the camera" : "直视相机",
        color: THEME.front,
      };
    }
    if (currentStep === "left") {
      return {
        title: lang === "th" ? "มุมที่ 2: หันด้านซ้าย" : lang === "en" ? "Angle 2: Turn Left" : "角度 2：向左转",
        instruction: lang === "th" ? "หันหน้าไปทางซ้าย ~45°" : lang === "en" ? "Turn left ~45°" : "向左约 45°",
        color: THEME.left,
      };
    }
    if (currentStep === "right") {
      return {
        title: lang === "th" ? "มุมที่ 3: หันด้านขวา" : lang === "en" ? "Angle 3: Turn Right" : "角度 3：向右转",
        instruction: lang === "th" ? "หันหน้าไปทางขวา ~45°" : lang === "en" ? "Turn right ~45°" : "向右约 45°",
        color: THEME.right,
      };
    }
    return {
      title: lang === "th" ? "กำลังวิเคราะห์…" : lang === "en" ? "Analyzing…" : "分析中…",
      instruction:
        lang === "th"
          ? "กำลังประมวลผลภาพ 3 มุมของคุณ"
          : lang === "en"
          ? "Processing your 3-angle photos"
          : "正在处理您的三角照片",
      color: THEME.front,
    };
  }, [currentStep, lang]);

  // ================== MediaPipe results ==================
  /**
   * callback หลักเมื่อได้ผลลัพธ์จาก FaceMesh ในแต่ละเฟรม
   * - คำนวณ yaw (ใช้ EMA ให้ลื่น)
   * - ประเมิน faceOk/faceNear
   * - คุม state: hint, stableStart, countdown เริ่ม/หยุด
   * - NEW: ถ้าอยู่ระหว่าง countdown แล้ว “หลุดกรอบ/มุมเพี้ยน” → ยกเลิก countdown ทันที
   */
  const onResults = useCallback(
    (res: any) => {
      if (currentStep === "analyzing") return;

      if (!cameraReady) setCameraReady(true);

      const lm = res.multiFaceLandmarks?.[0];
      if (!lm) {
        // ไม่พบหน้า → รีเซ็ตสถานะความนิ่งและเคาน์ต์
        stableStartRef.current = null;
        setHintReady(false);
        setHintText(HINTS[lang].moveIntoFrame);
        setCountdown(null);
        setBigCount(null);
        lastNoseRef.current = null;
        return;
      }

      // คำนวณ yaw ด้วย EMA ให้มีความนิ่ง
      const yawRaw = estimateYawDeg(lm);
      const prevYaw = emaYawRef.current || yawRaw;
      const yaw = EMA_ALPHA * yawRaw + (1 - EMA_ALPHA) * prevYaw;
      emaYawRef.current = yaw;

      // เก็บตำแหน่งจมูก normalized
      const nose = lm[1];
      lastNoseRef.current = { x: nose.x, y: nose.y };

      const okYaw = isYawOk(currentStep, yaw);
      const nearYaw = isYawNear(currentStep, yaw);

      // front ต้อง centered ด้วย / side ไม่เน้น
      let centered = true;
      if (currentStep === "front") {
        const cx = nose.x - 0.5,
          cy = nose.y - 0.5;
        centered = Math.abs(cx) < CENTER_TOL && Math.abs(cy) < CENTER_TOL;
      }

      const faceOk = currentStep === "front" ? okYaw && centered : okYaw;
      const faceNear =
        nearYaw &&
        (currentStep === "front"
          ? Math.abs(nose.x - 0.5) < CENTER_TOL * 1.35 &&
            Math.abs(nose.y - 0.5) < CENTER_TOL * 1.35
          : true);

      // อัปเดตข้อความ Hint
      const hint = computeHint(
        lang,
        currentStep,
        true,
        yaw,
        lastNoseRef.current?.x ?? null,
        lastNoseRef.current?.y ?? null,
        hintReady,
        countdown
      );
      setHintText(hint);

      // ========== NEW: ระหว่าง countdown ต้องยัง “อยู่ในกรอบ + มุมถูก” ตลอด ==========
      if (countdown != null && countdown > 0) {
        const stillOk = inFrameAndAngleOk(currentStep, yaw, lastNoseRef.current);
        if (!stillOk) {
          // หลุดเงื่อนไข → ยกเลิกการนับทันที
          stableStartRef.current = null;
          setHintReady(false);
          setCountdown(null);
          setBigCount(null);
          setHintText(HINTS[lang].moveIntoFrame);
          return; // stop ทำให้ไม่โดน doCapture จาก useEffect
        }
      }
      // =====================================================================

      // ควบคุมการเริ่ม countdown (ต้องนิ่งครบ STABLE_MS และยังไม่เริ่มมาก่อน)
      const now = performance.now();
      if (faceOk) {
        if (stableStartRef.current == null) stableStartRef.current = now;
        const stableFor = now - (stableStartRef.current ?? now);
        if (stableFor >= STABLE_MS && countdown == null && !isCapturing) {
          setHintReady(true);
          setCountdown(COUNTDOWN_SEC);
          setBigCount(COUNTDOWN_SEC);
        }
      } else if (faceNear) {
        setHintReady(false);
      } else {
        // หลุดเงื่อนไขชัดเจน → รีเซ็ต
        stableStartRef.current = null;
        setHintReady(false);
        if (!isCapturing) {
          setCountdown(null);
          setBigCount(null);
        }
      }
    },
    [currentStep, countdown, isCapturing, hintReady, lang, cameraReady]
  );

  // ================== Camera init & cleanup ==================
  /**
   * เปิดกล้อง (user-facing) + สร้าง FaceMesh + ส่งเฟรมเข้า onResults
   * cleanup: stop camera + close facemesh + stop tracks
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let canceled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (canceled) return;
        streamRef.current = stream;
        video.srcObject = stream;
        await video.play().catch(() => {});
      } catch (e) {
        console.error("getUserMedia error", e);
      }
      if (canceled) return;

      const fm = new FaceMesh({
        locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
      });
      fm.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });
      fm.onResults((r) => {
        if (!canceled) onResults(r);
      });
      faceMeshRef.current = fm;

      const cam = new Camera(video, {
        onFrame: async () => {
          if (faceMeshRef.current && !canceled) {
            await faceMeshRef.current.send({ image: video });
          }
        },
        width: 720,
        height: 720,
      });
      cam.start();
      mpCameraRef.current = cam;
    })();

    return () => {
      canceled = true;
      try {
        mpCameraRef.current?.stop();
      } catch {}
      try {
        faceMeshRef.current?.close?.();
      } catch {}
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [onResults]);

  // ================== Countdown tick ==================
  /**
   * ตัวนับ 3→2→1 ต่อวินาที
   * - เมื่อถึง 0 เรียก doCapture()
   * - doCapture มี “ตรวจซ้ำ” ป้องกัน race condition
   */
  useEffect(() => {
    if (countdown == null) return;
    if (countdown <= 0) {
      doCapture();
      return;
    }
    const id = setTimeout(() => {
      setCountdown((p) => (p != null ? p - 1 : null));
      setBigCount((p) => (p != null ? p - 1 : null));
    }, 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  // ================== Capture ==================
  /**
   * บันทึกภาพจาก <video> → <canvas> → dataURL
   * - NEW: ตรวจซ้ำก่อนถ่ายจริงว่า “ยังอยู่ในกรอบ + มุมถูก” (กันกรณีเฟรม onResults มาช้า)
   * - แสดง flash overlay
   * - เดินหน้าไป step ถัดไป (front → left → right → analyzing)
   */
  const doCapture = () => {
    if (isCapturing || stepLockedRef.current) return;
    const video = videoRef.current;
    const canvas = capCanvasRef.current;
    if (!video || !canvas) return;

    // ===== NEW: safety re-check before capturing =====
    const yawNow = emaYawRef.current;
    const noseNow = lastNoseRef.current;
    const stillOk = inFrameAndAngleOk(currentStep, yawNow, noseNow);
    if (!stillOk) {
      // ยกเลิกการถ่าย เพราะเงื่อนไขไม่ครบ (เช่น ผู้ใช้ถอนหน้าออกจากกรอบทันที)
      setCountdown(null);
      setBigCount(null);
      setHintReady(false);
      setHintText(HINTS[lang].moveIntoFrame);
      return;
    }
    // =================================================

    setCountdown(null);
    setBigCount(null);
    stepLockedRef.current = true;

    const W = CAPTURE_W;
    const H = Math.round((W * BOX_H) / BOX_W);
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.scale(-1, 1); // mirror ให้ตรงกับพรีวิว
    ctx.drawImage(video, -W, 0, W, H);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    // flash AFTER capture
    setTimeout(() => setIsCapturing(true), FLASH_DELAY_MS);
    setTimeout(() => setIsCapturing(false), FLASH_DELAY_MS + 550);

    setHintReady(false);
    stableStartRef.current = null;

    setCaptured((prev) => ({ ...prev, [currentStep]: dataUrl }));
    setDone((prev) => ({ ...prev, [currentStep]: true }));

    setTimeout(() => {
      if (currentStep === "front") setCurrentStep("left");
      else if (currentStep === "left") setCurrentStep("right");
      else if (currentStep === "right") setCurrentStep("analyzing");
      stepLockedRef.current = false;
    }, 420);
  };

  // ================== Analyzing progress ==================
  /**
   * แอนิเมชัน progress ~6 วินาที แล้วเรียก onAnalyze()
   */
  useEffect(() => {
    if (currentStep !== "analyzing") return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setTimeout(() => onAnalyze(), 300);
          return 100;
        }
        return p + 2.5;
      });
    }, 150);
    return () => clearInterval(id);
  }, [currentStep, onAnalyze]);

  // ================== Thumbnails highlight loop ==================
  /**
   * วนไฮไลต์รูปเล็กด้านบนระหว่าง analyzing
   */
  useEffect(() => {
    if (currentStep !== "analyzing") return;
    const id = setInterval(() => setThumbFlipIdx((i) => (i + 1) % 3), 1000);
    return () => clearInterval(id);
  }, [currentStep]);

  // ================== Active image loop in scanner ==================
  /**
   * เปลี่ยนภาพหลักในกรอบสแกนทุก ๆ 1 วินาที (front → left → right → …)
   */
  useEffect(() => {
    if (currentStep !== "analyzing") return;
    const id = setInterval(() => setActiveAnalyzingIdx((i) => (i + 1) % 3), 1000);
    return () => clearInterval(id);
  }, [currentStep]);

  // ============ Small UI components ============
  /**
   * StepDot: จุดบอกสถานะ (active/done) ด้านบนระหว่างการสแกน
   */
  const StepDot: React.FC<{ idx: number; active: boolean; done: boolean; color: string }> = ({
    idx,
    active,
    done,
    color,
  }) => {
    return (
      <motion.div
        className="relative flex items-center justify-center"
        animate={{
          scale: active ? 1.15 : 1,
          opacity: done ? 1 : active ? 0.95 : 0.6,
        }}
        transition={{ duration: 0.4 }}
      >
        {/* outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: active
              ? `radial-gradient(${color}66 30%, transparent 70%)`
              : "transparent",
            boxShadow: active
              ? `0 0 20px ${color}88, 0 0 40px ${color}44`
              : done
              ? `0 0 14px ${color}55`
              : "none",
          }}
        />
        {/* main circle */}
        <div
          className="relative w-10 h-10 rounded-full flex items-center justify-center border-2 text-white font-medium"
          style={{
            background: done
              ? color
              : active
              ? `${color}40`
              : "rgba(255,255,255,0.05)",
            borderColor: active || done ? color : "rgba(255,255,255,0.2)",
            boxShadow: active
              ? `0 0 15px ${color}99`
              : done
              ? `0 0 10px ${color}55`
              : "none",
          }}
        >
          {done ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <span className="text-base font-semibold">{idx}</span>
          )}
        </div>
      </motion.div>
    );
  };

  /**
   * ThumbCard: การ์ดภาพตัวอย่าง (front/left/right) แสดงด้านบนในโหมด analyzing
   */
  const ThumbCard: React.FC<{ src?: string | null; label: string; active: boolean; color: string }> =
    ({ src, label, active, color }) => (
      <motion.div
        className="relative w-16 h-20 sm:w-20 sm:h-28 rounded-2xl overflow-hidden backdrop-blur-md"
        animate={{ scale: active ? 1.12 : 1, opacity: active ? 1 : 0.72 }}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: `2px solid ${color}`,
          boxShadow: active ? `0 0 22px ${color}77` : "none",
        }}
      >
        {src ? (
          <img src={src} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-[10px]"
            style={{ color: "#999" }}
          >
            no image
          </div>
        )}
        <div className="absolute inset-x-0 -bottom-0.5 h-1" style={{ background: active ? color : "transparent" }} />
      </motion.div>
    );

  // ============ Render ============
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0F1C 0%, #111827 100%)" }}
    >
      {/* Ambient radial background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(30,41,59,0.8) 0%, rgba(15,23,42,1) 100%)",
        }}
      />

      {/* Soft color blobs (new UI shell) */}
      {currentStep !== "analyzing" && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div
            className="absolute top-20 -left-20 w-64 h-64 rounded-full"
            style={{ backgroundColor: stepInfo.color }}
          />
          <div
            className="absolute bottom-20 -right-20 w-56 h-56 rounded-full"
            style={{ backgroundColor: stepInfo.color }}
          />
        </div>
      )}

      {/* Floating Particles (new UI shell) */}
      {currentStep !== "analyzing" && (
        <FloatingParticles
          count={12}
          colors={[stepInfo.color, `${stepInfo.color}99`, `${stepInfo.color}66`]}
          useEmojis={false}
        />
      )}

      {/* Flash overlay */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="absolute inset-0 z-30 pointer-events-none"
            style={{ background: "white" }}
          />
        )}
      </AnimatePresence>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </motion.button>

      {/* Top: step dots (scan) or thumbnails (analyzing) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-3"
      >
        {currentStep === "analyzing" ? (
          <>
            <ThumbCard src={captured.front} label="Front" active={thumbFlipIdx === 0} color={THEME.front} />
            <ThumbCard src={captured.left} label="Left" active={thumbFlipIdx === 1} color={THEME.left} />
            <ThumbCard src={captured.right} label="Right" active={thumbFlipIdx === 2} color={THEME.right} />
          </>
        ) : (
          <>
            <StepDot idx={1} active={currentStep === "front"} done={done.front} color={THEME.front} />
            <StepDot idx={2} active={currentStep === "left"} done={done.left} color={THEME.left} />
            <StepDot idx={3} active={currentStep === "right"} done={done.right} color={THEME.right} />
          </>
        )}
      </motion.div>

      {/* Title / instruction */}
      <div className="relative h-screen flex flex-col items-center justify-center px-6">
        {currentStep !== "analyzing" ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute top-24 left-0 right-0 text-center z-10"
          >
            <div className="mb-3 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="text-6xl"
              >
                👤
              </motion.div>
            </div>
            <h2 className="text-white mb-2" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
              {stepInfo.title}
            </h2>
            <p className="text-sm" style={{ color: stepInfo.color, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
              {stepInfo.instruction}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-32 left-0 right-0 text-center z-10 px-6"
          >
            <motion.h2
              className="text-white mb-2"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              {stepInfo.title}
            </motion.h2>
            <motion.p
              className="text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ color: stepInfo.color, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
            >
              {lang === "th"
                ? "กำลังประมวลผลภาพ 3 มุมของคุณ"
                : lang === "en"
                ? "Processing your 3-angle photos"
                : "正在处理您的三角照片"}
            </motion.p>
          </motion.div>
        )}

        {/* ============== SCAN BOX ============== */}
        {currentStep !== "analyzing" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
            style={{ width: `${BOX_W}px`, height: `${BOX_H}px` }}
          >
            {/* Gradient border pulse */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                background: stepInfo.color,
                padding: "3px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor" as any,
                maskComposite: "exclude" as any,
              }}
            />

            {/* Video feed (mirrored) */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover rounded-3xl"
              style={{ transform: "scaleX(-1)" }}
            />

            {/* Face guide overlay */}
            <FaceOvalGuide
              color={stepInfo.color}
              active={hintReady || countdown != null}
              step={currentStep}
              width={BOX_W}
              height={BOX_H}
              showCenterMarker={currentStep === "front"}
            />

            {/* Hint top-center */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`hint-${hintText}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="absolute left-1/2 z-20 pointer-events-none"
                style={{ top: "6%", transform: "translateX(-50%)" }}
              >
                <div
                  className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium"
                  style={{
                    color: "#fff",
                    background: "rgba(0,0,0,0.55)",
                    border: `1px solid ${stepInfo.color}`,
                    boxShadow: `0 0 15px ${stepInfo.color}66`,
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}
                >
                  {hintText}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Big countdown digits */}
            <AnimatePresence mode="sync">
              {bigCount != null && bigCount > 0 && (
                <motion.div
                  key={`big-${bigCount}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div
                    className="font-extrabold"
                    style={{
                      fontSize: 120,
                      lineHeight: 1,
                      color: "#FFFFFF",
                      textShadow: `0 8px 40px ${stepInfo.color}88`,
                      willChange: "transform, opacity",
                    }}
                  >
                    {bigCount}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Camera ready fade overlay */}
            <AnimatePresence>
              {!cameraReady && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 z-40 bg-black rounded-3xl"
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ============== ANALYZING ============== */}
        <AnimatePresence>
          {currentStep === "analyzing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-0 right-0 px-6 z-10"
            >
              <div
                className="rounded-3xl p-6 backdrop-blur-md"
                style={{ background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <div className="text-white text-center mb-4">{stepInfo.instruction}</div>

                {/* Scanner frame with image loop */}
                <div
                  className="relative mx-auto mb-6 rounded-2xl overflow-hidden"
                  style={{
                    width: 320,
                    height: 380,
                    boxShadow:
                      "inset 0 0 0 2px rgba(125,184,255,0.6), 0 0 30px rgba(203,184,255,0.25)",
                  }}
                >
                  {/* Active image (loop through captured) */}
                  <div className="absolute inset-0">
                    <AnimatePresence mode="wait">
                      {(["front", "left", "right"] as const).map((k, idx) => {
                        const src =
                          k === "front" ? captured.front : k === "left" ? captured.left : captured.right;
                        return (
                          activeAnalyzingIdx === idx &&
                          src && (
                            <motion.img
                              key={`img-${k}-${idx}`}
                              src={src}
                              alt={`scan-${k}`}
                              className="absolute inset-0 w-full h-full object-cover"
                              initial={{ opacity: 0, scale: 1.02 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.02 }}
                              transition={{ duration: 0.4 }}
                              style={{ filter: "saturate(1.02) contrast(1.02)", willChange: "opacity, transform" }}
                            />
                          )
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Hologram grid */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(125,184,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(125,184,255,0.14) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Corner accents */}
                  <div
                    className="absolute top-2 left-2 w-4 h-4"
                    style={{ borderTop: `2px solid ${THEME.front}`, borderLeft: `2px solid ${THEME.front}` }}
                  />
                  <div
                    className="absolute top-2 right-2 w-4 h-4"
                    style={{ borderTop: `2px solid ${THEME.left}`, borderRight: `2px solid ${THEME.left}` }}
                  />
                  <div
                    className="absolute bottom-2 left-2 w-4 h-4"
                    style={{ borderBottom: `2px solid ${THEME.right}`, borderLeft: `2px solid ${THEME.right}` }}
                  />
                  <div
                    className="absolute bottom-2 right-2 w-4 h-4"
                    style={{ borderBottom: `2px solid ${THEME.left}`, borderRight: `2px solid ${THEME.left}` }}
                  />

                  {/* Horizontal lasers */}
                  <motion.div
                    className="absolute left-0 right-0 h-1"
                    style={{
                      background: "linear-gradient(90deg, transparent, #7DB8FFFF, transparent)",
                      boxShadow: "0 0 18px #7DB8FFCC, 0 0 32px #7DB8FF88",
                      willChange: "transform",
                    }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute left-0 right-0 h-0.5"
                    style={{
                      background: "linear-gradient(90deg, transparent, #FFB5D9CC, transparent)",
                      boxShadow: "0 0 14px #FFB5D999",
                      willChange: "transform",
                    }}
                    animate={{ top: ["12%", "112%"] }}
                    transition={{ duration: 3.0, repeat: Infinity, ease: "linear", delay: 0.2 }}
                  />
                  <motion.div
                    className="absolute left-0 right-0 h-0.5"
                    style={{
                      background: "linear-gradient(90deg, transparent, #CBB8FFCC, transparent)",
                      boxShadow: "0 0 14px #CBB8FF99",
                      willChange: "transform",
                    }}
                    animate={{ top: ["24%", "124%"] }}
                    transition={{ duration: 3.6, repeat: Infinity, ease: "linear", delay: 0.4 }}
                  />

                  {/* Vertical lasers */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-1"
                    style={{
                      background: "linear-gradient(180deg, transparent, #7DB8FFFF, transparent)",
                      boxShadow: "0 0 18px #7DB8FFCC, 0 0 32px #7DB8FF88",
                      willChange: "transform",
                    }}
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 0.3 }}
                  />
                  <motion.div
                    className="absolute top-0 bottom-0 w-0.5"
                    style={{
                      background: "linear-gradient(180deg, transparent, #FFB5D9CC, transparent)",
                      boxShadow: "0 0 14px #FFB5D999",
                      willChange: "transform",
                    }}
                    animate={{ left: ["18%", "118%"] }}
                    transition={{ duration: 3.0, repeat: Infinity, ease: "linear", delay: 0.5 }}
                  />

                  {/* Soft glow lines */}
                  <div
                    className="absolute left-0 right-0"
                    style={{
                      top: "65%",
                      height: 2,
                      background: "linear-gradient(90deg, transparent, #7DB8FF66, transparent)",
                      filter: "blur(1px)",
                    }}
                  />
                  <div
                    className="absolute left-0 right-0"
                    style={{
                      top: "78%",
                      height: 2,
                      background: "linear-gradient(90deg, transparent, #FF8AD466, transparent)",
                      filter: "blur(1px)",
                    }}
                  />
                </div>

                {/* Progress bar */}
                <div className="relative mx-auto" style={{ width: 560, maxWidth: "100%" }}>
                  <div
                    className="relative h-3 bg-gray-900 rounded-full overflow-hidden"
                    style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #FF8AD4 0%, #67B5FF 50%, #C19BFF 100%)",
                        width: `${progress}%`,
                        boxShadow:
                          "0 0 12px rgba(103,181,255,0.4), 0 0 24px rgba(255,138,212,0.25)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-center mt-3" style={{ color: "#FF8AD4" }}>
                    {Math.floor(progress)}%
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* hidden canvas for capture */}
      <canvas ref={capCanvasRef} style={{ display: "none" }} />

      {/* accessibility live region */}
      <div className="sr-only" aria-live="polite">
        {hintText}
      </div>
    </div>
  );
}
