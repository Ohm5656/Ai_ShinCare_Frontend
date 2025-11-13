// ===================================================================================================
// FaceScanScreen_v6.4_PerformanceOptimized.tsx
// ✅ UI/UX เหมือนเดิม 100% (Figma match)
// ✅ FaceMesh + Auto-capture flow: front → left → right → analyze()
// ✅ เสถียรมากขึ้น: React.memo + useMemo + ref-based setters ลด re-render/state churn
// ===================================================================================================

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { useLanguage } from "../../contexts/LanguageContext";
import { FloatingParticles } from "../animations/FloatingParticles";
import { FaceOverlay } from "../FaceOverlay";
import { LaserScanEffect } from "../LaserScanEffect";

// ===================================================================================================
// CONFIG
// ===================================================================================================

const FRONT_YAW_MAX = 10;   // หน้าตรง ±10°
const SIDE_YAW_MIN = 15;    // ต้องหันเกิน 35° ถึงจะถือว่าซ้าย/ขวา
const SIDE_YAW_MAX = 65;
const HYST_MARGIN = 10.0;
const CENTER_TOL_X = 0.22;
const CENTER_TOL_Y = 0.22;
const STABLE_MS = 1000;
const EMA_ALPHA = 0.1;

// ===================================================================================================
// TYPES
// ===================================================================================================

interface FaceScanScreenProps {
  onAnalyze: (images: {
    front: string | null;
    left: string | null;
    right: string | null;
  }) => void;
  onBack: () => void;
}

type ScanStep = "front" | "left" | "right";

interface StepStatus {
  front: boolean;
  left: boolean;
  right: boolean;
}

// ===================================================================================================
// MEMOIZED CHILD COMPONENTS (ลด re-render จากการสร้างใหม่ทุกครั้ง)
// ===================================================================================================

const ArrowLeftIcon = React.memo(() => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#7DB8FF" fillOpacity="0.2" />
    <path
      d="M38 20 L22 32 L38 44"
      stroke="#7DB8FF"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: "drop-shadow(0 0 8px #7DB8FF)" }}
    />
    <circle cx="32" cy="32" r="28" stroke="#7DB8FF" strokeWidth="2" strokeOpacity="0.9" />
  </svg>
));

const ArrowRightIcon = React.memo(() => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#CBB8FF" fillOpacity="0.2" />
    <path
      d="M26 20 L42 32 L26 44"
      stroke="#9C8FFF"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: "drop-shadow(0 0 8px #9C8FFF)" }}
    />
    <circle cx="32" cy="32" r="28" stroke="#CBB8FF" strokeWidth="2" strokeOpacity="0.9" />
  </svg>
));

// ห่อคอมโพเนนต์ import ภายนอกให้เป็น pure (ถ้าคอมโพเนนต์เดิมเป็น pure ก็ไม่เสียหาย)
const MemoFaceOverlay = React.memo(FaceOverlay);
const MemoLaserScanEffect = React.memo(LaserScanEffect);

// ===================================================================================================
// UTILS: Face angle + position detection
// ===================================================================================================

function estimateYawDeg(lm: any[]): number {
  // ใช้จุดตาซ้าย (33), ตาขวา (263), และจมูก (1)
  const leftEye = lm[33];
  const rightEye = lm[263];
  const nose = lm[1];

  if (!leftEye || !rightEye || !nose) return 0;

  // midX คือจุดกึ่งกลางระหว่างดวงตาทั้งสอง
  const midX = (leftEye.x + rightEye.x) / 2;
  const faceWidth = Math.abs(rightEye.x - leftEye.x) || 1e-6;
  const dx = nose.x - midX;

  // คำนวณมุม yaw จากความต่างตำแหน่งจมูกกับกึ่งกลางตา
  const yawRad = Math.atan2(dx, faceWidth);
  const yawDeg = (yawRad * 180) / Math.PI;

  // ❗ ต้องใส่เครื่องหมายลบ เพราะภาพ flip แล้ว (scaleX(-1))
  return -yawDeg * 1.4; // คูณ 1.3 เพื่อชดเชย scale ความกว้างของหน้า
}

function isYawOk(step: ScanStep, y: number) {
  if (step === "front") return Math.abs(y) <= FRONT_YAW_MAX;
  if (step === "left") return y <= -SIDE_YAW_MIN && y >= -SIDE_YAW_MAX;
  if (step === "right") return y >= SIDE_YAW_MIN && y <= SIDE_YAW_MAX;
  return false;
}

function isYawNear(step: ScanStep, y: number) {
  if (step === "front") return Math.abs(y) <= FRONT_YAW_MAX + 5;
  if (step === "left")  return y <= -(SIDE_YAW_MIN - 5) && y >= -(SIDE_YAW_MAX + 5);
  if (step === "right") return y >= SIDE_YAW_MIN - 5 && y <= SIDE_YAW_MAX + 5;
  return false;
}


function isFaceCentered(nose: { x: number; y: number } | null) {
  if (!nose) return false;
  const cx = nose.x - 0.5;
  const cy = nose.y - 0.5;
  const insideX = Math.abs(cx) < CENTER_TOL_X;
  const insideY = Math.abs(cy) < CENTER_TOL_Y;
  return insideX && insideY;
}

function inFrameAndAngleOk(step: ScanStep, yaw: number, nose: { x: number; y: number } | null) {
  if (!nose) return false;
  const centered = isFaceCentered(nose);
  if (step === "front") return centered && isYawOk(step, yaw);
  if (step === "left" || step === "right") return isYawOk(step, yaw);
  return false;
}

function pickFrameColor(isOk: boolean, isNear: boolean) {
  if (isOk) return "#28C76F";
  if (isNear) return "#FFD966";
  return "#FF5555";
}

// ===================================================================================================
// MAIN COMPONENT
// ===================================================================================================

export function FaceScanScreen({ onAnalyze, onBack }: FaceScanScreenProps) {
  const { t } = useLanguage();

  // --- Refs (DOM/MediaPipe)
  const videoRef = useRef<HTMLVideoElement>(null);
  const focusVideoRef = useRef<HTMLVideoElement>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  // --- UI states
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [currentStep, setCurrentStep] = useState<ScanStep>("front");
  const [completedSteps, setCompletedSteps] = useState<StepStatus>({ front: false, left: false, right: false });
  const [capturedImages, setCapturedImages] = useState({ front: null as string | null, left: null as string | null, right: null as string | null });

  const [isFaceOk, setIsFaceOk] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hintText, setHintText] = useState("ยื่นหน้าให้อยู่ในกรอบสแกน");
  const [frameColor, setFrameColor] = useState("#FF5555");
  const [nosePos, setNosePos] = useState<{ x: number; y: number } | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [lastFaceTime, setLastFaceTime] = useState<number>(0);

  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [bigCount, setBigCount] = useState<number | null>(null);

  // --- Filters / smoothing
  const stableStartRef = useRef<number | null>(null);
  const countdownLockRef = useRef(false);
  const stableHintStartRef = useRef<{ text: string; time: number } | null>(null);
  const emaYawRef = useRef(0);
  const lastNoseRef = useRef<{ x: number; y: number } | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const isCountingDownRef = useRef(false);
useEffect(() => { isCountingDownRef.current = isCountingDown; }, [isCountingDown]);
// ✅ เก็บ currentStep ที่กำลัง active จริง ๆ ป้องกัน onResults ทำงานข้ามมุม
const activeStepRef = useRef<ScanStep>("front");
useEffect(() => {
  activeStepRef.current = currentStep;
}, [currentStep]);



  // ===================================================================================================
  // PERF MEMO: step collections + stepInfo
  // ===================================================================================================

  const stepColors = React.useMemo(() => ["#FFB5D9", "#7DB8FF", "#CBB8FF"], []);
  const steps = React.useMemo(() => (["front", "left", "right"] as ScanStep[]), []);

  const stepInfo = React.useMemo(() => {
    switch (currentStep) {
      case "front":
        return {
          title: t.language === "th" ? "มุมที่ 1: หน้าตรง" : t.language === "en" ? "Angle 1: Front Face" : "角度 1：正面",
          instruction: t.language === "th" ? "มองตรงไปที่กล้อง" : t.language === "en" ? "Look straight at the camera" : "直视相机",
          emoji: "👤" as string | undefined,
          color: "#FFB5D9",
          icon: undefined as React.ReactNode | undefined,
        };
      case "left":
        return {
          title: t.language === "th" ? "มุมที่ 2: หันด้านซ้าย" : t.language === "en" ? "Angle 2: Turn Left" : "角度 2：向左转",
          instruction: t.language === "th" ? "หันหน้าไปทางซ้าย 45°" : t.language === "en" ? "Turn your face left 45°" : "将脸向左转 45°",
          emoji: undefined,
          color: "#7DB8FF",
          icon: <ArrowLeftIcon />,
        };
      case "right":
        return {
          title: t.language === "th" ? "มุมที่ 3: หันด้านขวา" : t.language === "en" ? "Angle 3: Turn Right" : "角度 3：向右转",
          instruction: t.language === "th" ? "หันหน้าไปทางขวา 45°" : t.language === "en" ? "Turn your face right 45°" : "将脸向右转 45°",
          emoji: undefined,
          color: "#CBB8FF",
          icon: <ArrowRightIcon />,
        };
    }
  }, [currentStep, t.language]);

  // ===================================================================================================
  // PERF: ref-based setters เพื่อลด setState ซ้ำ ๆ ใน onResults
  // ===================================================================================================

  const frameColorRef = useRef(frameColor);
  const hintTextRef = useRef(hintText);
  const isFaceOkRef = useRef(isFaceOk);

  useEffect(() => { frameColorRef.current = frameColor; }, [frameColor]);
  useEffect(() => { hintTextRef.current = hintText; }, [hintText]);
  useEffect(() => { isFaceOkRef.current = isFaceOk; }, [isFaceOk]);

  const setFrameColorIfChanged = (c: string) => {
    if (frameColorRef.current !== c) {
      frameColorRef.current = c;
      setFrameColor(c);
    }
  };
  const setHintTextIfChanged = (s: string) => {
    if (hintTextRef.current !== s) {
      hintTextRef.current = s;
      setHintText(s);
    }
  };
  const setIsFaceOkIfChanged = (b: boolean) => {
    if (isFaceOkRef.current !== b) {
      isFaceOkRef.current = b;
      setIsFaceOk(b);
    }
  };

  // ===================================================================================================
  // CAMERA + FACEMESH LOGIC
  // ===================================================================================================
  useEffect(() => {
    let cancelled = false;
    const video = videoRef.current;
    if (!video) return;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (cancelled) return;

        video.srcObject = stream;
        if (focusVideoRef.current) focusVideoRef.current.srcObject = stream;

        await video.play();
        await focusVideoRef.current?.play();

        const fm = new FaceMesh({
          locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
        });

        fm.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

fm.onResults((res) => {

  if (!res.multiFaceLandmarks?.length) {
    if (isCountingDown) {
      setCountdown(null);
      setBigCount(null);
      setIsCountingDown(false);
    }
    countdownLockRef.current = false;
    stableStartRef.current = null;
    setIsFaceOkIfChanged(false);
    setFrameColorIfChanged("#FF5555");
    setNosePos(null);
    setHintTextIfChanged("ตรวจไม่พบใบหน้า 😅");
    return;
  }

  // ✅ เจอหน้า
  setLastFaceTime(performance.now());
  const lm = res.multiFaceLandmarks[0];
  const nose = lm[1];
  lastNoseRef.current = { x: nose.x, y: nose.y };
  setNosePos({ x: nose.x, y: nose.y });

  // คำนวณ yaw แบบ EMA
  const yaw = estimateYawDeg(lm);
  emaYawRef.current = EMA_ALPHA * yaw + (1 - EMA_ALPHA) * emaYawRef.current;
console.log("Yaw:", emaYawRef.current.toFixed(1), "step:", activeStepRef.current);

const ok = inFrameAndAngleOk(activeStepRef.current, emaYawRef.current, lastNoseRef.current);
const near = !ok && isYawNear(activeStepRef.current, emaYawRef.current);

  setFrameColorIfChanged(pickFrameColor(ok, near));
  setIsFaceOkIfChanged(ok);

  // ==========================
  // Dynamic Hint
  // ==========================
  const cx = nose.x - 0.5;
  const cy = nose.y - 0.5;
  let newHint = "";
  if (Math.abs(cx) > 0.18)
    newHint = cx > 0 ? "ขยับหน้าไปทางขวา ↪️" : "ขยับหน้าไปทางซ้าย ↩️";
  else if (cy > 0.18) newHint = "ยกหัวขึ้นอีกนิด ⬆️";
  else if (cy < -0.18) newHint = "ก้มหน้าลงอีกหน่อย ⬇️";
  else if (!ok) {

if (activeStepRef.current === "left") {
  newHint =
    emaYawRef.current > -SIDE_YAW_MIN + 5
      ? "หันหน้าไปทางซ้ายอีกหน่อย 👈"
      : "หน้าไม่ตรงมุม โปรดแสกนใหม่ 😅";
} else if (activeStepRef.current === "right") {
  newHint =
    emaYawRef.current < SIDE_YAW_MIN - 5
      ? "หันหน้าไปทางขวาอีกหน่อย 👉"
      : "หน้าไม่ตรงมุม โปรดแสกนใหม่ 😅";
} else newHint = "มองตรงไปที่กล้อง 👁️";

  } else {
    newHint = "เยี่ยมเลย! ค้างหน้านิ่งไว้ 😄";
  }

  // อัปเดต hintText แบบ smooth
  if (newHint && !isCountingDown) {
  setHintTextIfChanged(newHint);
  clearTimeout(hintTimeoutRef.current!);
  hintTimeoutRef.current = setTimeout(() => setHintTextIfChanged(newHint), 120);
} else if (isCountingDown && newHint !== hintTextRef.current) {
  setHintTextIfChanged(newHint);
}

// ✅ Countdown แบบ Stable: ต้องนิ่ง 1 วิ แล้วค่อยเริ่ม 3→2→1
const isPerfectHint = newHint === "เยี่ยมเลย! ค้างหน้านิ่งไว้ 😄";
const now = performance.now();

if (!isCapturing) {
  if (isPerfectHint) {
    // ถ้ายังไม่เคยเริ่มจับเวลาความนิ่ง ให้เริ่มจับตอนนี้
    if (!stableStartRef.current) stableStartRef.current = now;

    // นิ่งต่อเนื่องเกิน 1000ms (1 วิ) แล้ว *ยังไม่เคยเริ่มนับ* และ *ยังไม่ล็อก*
    if (
      now - stableStartRef.current > 1000 &&
      !isCountingDown &&
      countdown == null &&
      !countdownLockRef.current
    ) {
      // 🔒 ล็อกครั้งนี้ไว้เลย กันเริ่มซ้ำ
      countdownLockRef.current = true;

      setIsCountingDown(true);
      isCountingDownRef.current = true;
      setCountdown(3);
      setBigCount(3);
    }
  } else {
    // หลุดจาก "เยี่ยมเลย!" → รีเซ็ตทุกอย่าง + ปลดล็อก
    stableStartRef.current = null;

    if (isCountingDownRef.current || countdown != null) {
      setCountdown(null);
      setBigCount(null);
      setIsCountingDown(false);
      isCountingDownRef.current = false;
    }

    // ปลดล็อกเสมอ เพื่อให้เริ่มใหม่ได้เมื่อกลับมานิ่ง
    countdownLockRef.current = false;

    setIsFaceOkIfChanged(false);
    setFrameColorIfChanged("#FF5555");
    setHintTextIfChanged("ยื่นหน้าให้อยู่ในกรอบสแกน");
  }
}


}); // end onResults



        // กล้อง
        let lastFrameTime = 0;
        const FPS_LIMIT = 20;

        const cam = new Camera(video, {
          onFrame: async () => {
            const now = performance.now();
            if (cancelled) return;
            if (now - lastFrameTime < 1000 / FPS_LIMIT) return; // limit fps
            lastFrameTime = now;
            await fm.send({ image: focusVideoRef.current || video });
          },
          width: 640,
          height: 480,
        });

        cam.start();
        cameraRef.current = cam;
        faceMeshRef.current = fm;
      } catch (err) {
        console.error("Camera init failed:", err);
      }
    }

    initCamera();
    return () => {
      cancelled = true;
      cameraRef.current?.stop();
      faceMeshRef.current?.close?.();
    };
  }, []);
// ===================================================================================================
// Reset state เมื่อเปลี่ยน step (ให้เฟรมใหม่เริ่มก่อน แล้วค่อยรีเซ็ตทั้งหมด)
// ===================================================================================================
useEffect(() => {
  const timeout = setTimeout(() => {
    stableStartRef.current = null;
    countdownLockRef.current = false;
    emaYawRef.current = 0;          // ✅ ล้างมุมเฉลี่ยเก่าด้วย
    hintTextRef.current = "ยื่นหน้าให้อยู่ในกรอบสแกน";
    setIsCountingDown(false);
    setCountdown(null);
    setBigCount(null);
    setIsFaceOkIfChanged(false);
    setFrameColorIfChanged("#FF5555");
    setHintTextIfChanged("ยื่นหน้าให้อยู่ในกรอบสแกน");
  }, 250); // delay 0.25 วินาที
  return () => clearTimeout(timeout);
}, [currentStep]);


  // ===================================================================================================
  // Auto clear blur overlay เมื่อไม่เจอหน้าเกินช่วงเวลาหนึ่ง
  // ===================================================================================================
  useEffect(() => {
    const interval = setInterval(() => {
      const now = performance.now();
      if (now - lastFaceTime > 1200 && isCountingDown) {
        setIsCountingDown(false);
        setCountdown(null);
        setBigCount(null);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lastFaceTime, isCountingDown]);

  // ===================================================================================================
  // AUTO CAPTURE
  // ===================================================================================================
  const doCapture = () => {
    if (isCapturing || !focusVideoRef.current) return;

    // ✅ ใช้ activeStepRef เพื่อให้ได้มุมล่าสุดจริง ๆ (ไม่ใช้ currentStep ที่อาจยังไม่อัปเดต)
    const stepNow = activeStepRef.current;
    const yawNow = emaYawRef.current;
    const noseNow = lastNoseRef.current;

    // ✅ ตรวจว่าหน้าอยู่ในกรอบและมุมถูกต้องก่อนถ่าย
    const stillOk = inFrameAndAngleOk(stepNow, yawNow, noseNow);
    if (!stillOk) return;

    setIsCapturing(true);

    // ✅ สร้างภาพจากวิดีโอ (mirror)
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(focusVideoRef.current, -640, 0, 640, 480);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    // ✅ รีเซ็ตสถานะหลังถ่าย (เพื่อเริ่มมุมใหม่ได้เลย)
    setTimeout(() => {
      setIsCapturing(false);
      setIsCountingDown(false);
      setCountdown(null);
      setBigCount(null);
      countdownLockRef.current = false;  // ปลดล็อกเคาน์ดาวน์
      stableStartRef.current = null;
      setIsFaceOkIfChanged(false);
      setHintTextIfChanged("ยื่นหน้าให้อยู่ในกรอบสแกน"); // รีเซ็ตข้อความเริ่มต้น
    }, 600);

    // ✅ บันทึกภาพของมุมที่ถ่ายไว้จริง (ไม่ใช้ currentStep)
    setCapturedImages((prev) => ({ ...prev, [stepNow]: dataUrl }));
    setCompletedSteps((prev) => ({ ...prev, [stepNow]: true }));

    // ✅ เปลี่ยนไปยังมุมถัดไปหลังถ่ายเสร็จ (ไม่ใช้ currentStep)
    setTimeout(() => {
      if (stepNow === "front") {
        setCurrentStep("left");
      } else if (stepNow === "left") {
        setCurrentStep("right");
      } else if (stepNow === "right") {
        const finalImages = { ...capturedImages, right: dataUrl };
        onAnalyze(finalImages);
      }
    }, 400);
  };

  // ===================================================================================================
  // FINAL COUNTDOWN LOGIC: ตรวจเงื่อนไขตอนถึงเลข 1 เท่านั้น
  // ===================================================================================================
// ===================================================================================================
// FINAL COUNTDOWN LOGIC: ใช้เฉพาะ hintText
// ===================================================================================================
// ============================================================================
// ✅ Countdown Logic (Dynamic Hint Mode)
// นับถอยหลัง 3→2→1 เฉพาะเมื่อ hintText === "เยี่ยมเลย! ค้างหน้านิ่งไว้ 😄"
// ถ้าระหว่างนับคำแนะนำเปลี่ยน → รีเซ็ตกลับรอให้หน้าตรงใหม่
// ============================================================================
useEffect(() => {
  if (countdownRef.current) {
    clearTimeout(countdownRef.current);
    countdownRef.current = null;
  }
  if (countdown == null) return;
  if (isCapturing) return;

  if (hintTextRef.current === "เยี่ยมเลย! ค้างหน้านิ่งไว้ 😄") {
    if (countdown > 1) {
      countdownRef.current = setTimeout(() => {
        setCountdown((prev) => (prev ? prev - 1 : null));
        setBigCount((prev) => (prev ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 1) {
      countdownRef.current = setTimeout(() => {
        if (hintTextRef.current === "เยี่ยมเลย! ค้างหน้านิ่งไว้ 😄") {
          doCapture(); // 📸 ถ่ายภาพ
        }
        setCountdown(null);
        setBigCount(null);
        setIsCountingDown(false);
      }, 1000);
    }
  } else {
    setCountdown(null);
    setBigCount(null);
    setIsCountingDown(false);
    setHintTextIfChanged("ยื่นหน้าให้อยู่ในกรอบสแกน");
  }
}, [countdown, isCapturing]);


  // ===================================================================================================
  // RENDER UI
  // ===================================================================================================

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0F1C 0%, #111827 100%)" }}
    >
      {/* ===== Blur overlay ตอนนับเคาน์ดาวน์ ===== */}
      <AnimatePresence>
        {isCountingDown && bigCount != null && (
          <motion.div
            key="countdown-blur"
            className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ background: "rgba(0, 0, 0, 0.55)", mixBlendMode: "multiply" }}
          />
        )}
      </AnimatePresence>

      {/* ===== Background & Particles ===== */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)",
        }}
      />

      {/* Soft color circles */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full" style={{ backgroundColor: stepInfo.color }} />
        <div className="absolute bottom-20 -right-20 w-56 h-56 rounded-full" style={{ backgroundColor: stepInfo.color }} />
      </div>

      {/* Floating particles */}
      <FloatingParticles
        count={isCountingDown ? 10 : 12}
        colors={[stepInfo.color, `${stepInfo.color}99`, `${stepInfo.color}66`]}
        useEmojis={false}
      />

      {/* Breathing blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: stepInfo.color }}
          animate={{ x: [0, 20, -20, 0], y: [0, -25, 25, 0], opacity: [0.18, 0.28, 0.18], scale: [1, 1.06, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-56 h-56 rounded-full blur-3xl"
          style={{ backgroundColor: stepInfo.color }}
          animate={{ x: [0, -15, 15, 0], y: [0, 20, -20, 0], opacity: [0.18, 0.26, 0.18], scale: [1, 1.05, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Dust particles */}
      <FloatingParticles
        count={isCountingDown ? 10 : 14}
        colors={[stepInfo.color, `${stepInfo.color}AA`, `${stepInfo.color}66`]}
        useEmojis={false}
      />

      {/* ===== Countdown Big Number ===== */}
      <AnimatePresence>
        {bigCount != null && bigCount > 0 && (
          <motion.div
            key={bigCount}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-40 flex items-center justify-center"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <div className="relative">
              <div
                className="absolute -inset-8 rounded-full"
                style={{
                  boxShadow: `0 0 60px ${stepInfo.color}AA, inset 0 0 40px ${stepInfo.color}66`,
                  filter: "blur(3px)",
                }}
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="relative px-10 py-6 rounded-3xl text-white font-extrabold text-[120px] leading-none tracking-tight"
                style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6), 0 0 35px rgba(255,255,255,0.35)" }}
              >
                {bigCount}
              </motion.div>
              <div className="text-center mt-2 text-white/80 text-lg">ค้างไว้ให้นิ่ง…</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Close Button ===== */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{ background: "rgba(0, 0, 0, 0.5)", border: "1px solid rgba(255, 255, 255, 0.2)" }}
      >
        <X className="w-6 h-6 text-white" />
      </motion.button>

      {/* ===== Progress Dots + Emoji/Icon + Title/Instruction ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
      >
        <div className="flex gap-3 mb-2">
          {steps.map((step, i) => {
            const color = stepColors[i];
            const label = String(i + 1);
            const done = completedSteps[step];
            const active = currentStep === step;
            return (
              <motion.div
                key={step}
                className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
                animate={{ scale: active ? 1.2 : 1, boxShadow: active ? `0 0 25px ${color}` : done ? `0 0 20px ${color}` : "none" }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  background: done ? color : active ? `${color}44` : "rgba(255,255,255,0.05)",
                  border: `2px solid ${done || active ? color : "rgba(255,255,255,0.15)"}`,
                }}
              >
                {done ? <Check className="w-5 h-5 text-white" /> : <span className="text-white">{label}</span>}
              </motion.div>
            );
          })}
        </div>

        <motion.div key={currentStep + "-emoji"} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="mb-2">
          {stepInfo.icon ? <div className="w-12 h-12">{stepInfo.icon}</div> : <div className="text-4xl">{stepInfo.emoji}</div>}
        </motion.div>

        <motion.div key={currentStep + "-title"} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <h2 className="text-white font-semibold text-base mb-1" style={{ textShadow: "0 2px 20px rgba(0,0,0,.8)" }}>
            {stepInfo.title}
          </h2>
          <p className="text-sm" style={{ color: stepInfo.color, textShadow: "0 2px 10px rgba(0,0,0,.8)" }}>
            {stepInfo.instruction}
          </p>
        </motion.div>
      </motion.div>

      {/* ===== CENTERED CAMERA FRAME ===== */}
      <div className="fixed inset-0 flex items-center justify-center z-10 px-6">
        <div className="relative" style={{ width: "280px", height: "340px" }}>
          {/* Hint */}
          <AnimatePresence>
            {hintText && (
              <motion.div
                key={hintText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="
                  absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+14px)]
                  z-40 px-6 py-2 rounded-full text-center font-medium text-[15px] text-white
                  backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.4)]
                "
                style={{
                  background: "rgba(0, 0, 0, 0.55)",
                  border: `1px solid ${stepInfo.color}AA`,
                  boxShadow: `0 0 16px ${stepInfo.color}88, inset 0 0 8px ${stepInfo.color}55`,
                  textShadow: "0 0 10px rgba(255,255,255,0.8)",
                  letterSpacing: "0.3px",
                }}
              >
                {hintText}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Frame container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex items-center justify-center"
            style={{ width: "280px", height: "340px" }}
          >
            {/* Center nose point */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full z-50"
              style={{
                transform: "translate(-50%, -50%)",
                backgroundColor: stepInfo.color,
                boxShadow: `0 0 10px ${stepInfo.color}, 0 0 25px ${stepInfo.color}AA`,
              }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Outer glowing frame pulse */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{
                boxShadow: [`0 0 15px ${stepInfo.color}66`, `0 0 40px ${stepInfo.color}BB`, `0 0 15px ${stepInfo.color}66`],
                scale: [1, 1.02, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ border: `2px solid ${stepInfo.color}`, filter: `drop-shadow(0 0 8px ${stepInfo.color})` }}
            />

            {/* Glow backgrounds */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 rounded-3xl blur-[40px]"
                animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.06, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: `radial-gradient(circle at center, ${stepInfo.color}7A 0%, transparent 70%)`, mixBlendMode: "screen" }}
              />
              <motion.div
                className="absolute inset-0 rounded-3xl blur-[60px]"
                animate={{ opacity: [0.25, 0.5, 0.25], scale: [1.03, 1.08, 1.03] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: `radial-gradient(ellipse at center, ${stepInfo.color}55 0%, transparent 80%)`, mixBlendMode: "screen" }}
              />
            </div>

            {/* Camera feeds */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ filter: "blur(25px) brightness(0.6)", transform: "scaleX(-1)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: "radial-gradient(ellipse at center, black 98%, transparent 100%)",
                  maskImage: "radial-gradient(ellipse at center, black 98%, transparent 100%)",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                }}
              >
                <video ref={focusVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
              </div>
            </div>

            {/* Overlay */}
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ opacity: isFaceOk ? 1 : [1, 0.6, 1], scale: isFaceOk ? 1 : [1, 1.05, 1] }}
              transition={{ duration: 0.8, repeat: isFaceOk ? 0 : Infinity }}
              className="absolute inset-0 flex items-center justify-center z-40"
            >
              <MemoFaceOverlay angle={currentStep} color={frameColor} isActive={isFaceOk} />
            </motion.div>
          </div>

          </motion.div>

          {/* ===== Laser scan effect ===== */}
          <div
            className="absolute inset-0 z-[25] pointer-events-none"
            style={{
              mixBlendMode: "screen",
              overflow: "visible",
              backfaceVisibility: "hidden",
              WebkitTransform: "translateZ(0)",
            }}
          >
            <MemoLaserScanEffect color={stepInfo.color} isScanning={!isCapturing} />
          </div>

        </div>
      </div>
    </div>
  );
}