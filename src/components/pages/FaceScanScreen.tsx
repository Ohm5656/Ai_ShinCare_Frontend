import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// MediaPipe
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

/* =====================================================================================
 *  FaceScanScreen
 *  - เปิดกล้องจริง (facingMode: 'user') + แสดงภาพในกรอบ 280x340
 *  - ใช้ MediaPipe FaceMesh คำนวณ yaw (องศา) เพื่อตรวจมุม: front / left / right
 *  - มี smoothing (EMA) ให้ค่า yaw ลื่นขึ้น ลดเฟรมสั่น
 *  - ถ้ามุมถูกต้อง: แสดงข้อความ “มุม...ถูกต้อง พร้อมถ่ายใน {countdown}s”
 *  - อยู่คงที่ >= MIN_STABLE_MS → flash + capture → เดิน step ถัดไป
 *  - ครบเอฟเฟ็กต์เดิม (glow, pulse, grid/scan, progress, thumbnails)
 *  - เพิ่มกรอบโครงหน้าสวย ๆ pulse สีเปลี่ยนตามมุม
 * ===================================================================================== */

interface FaceScanScreenProps {
  onAnalyze: () => void;
  onBack: () => void;
}

type ScanStep = 'front' | 'left' | 'right' | 'analyzing';

interface StepStatus {
  front: boolean;
  left: boolean;
  right: boolean;
}

type Captured = { front: string | null; left: string | null; right: string | null };

/* ---------------------- CONFIG ปรับแต่ง ---------------------- */
const MIN_STABLE_MS = 1000; // ต้องนิ่งขั้นต่ำก่อนถ่าย (ms)
const FRONT_YAW_MAX = 6;    // |yaw| ≤ 6° ถือว่า "หน้าตรง"
const SIDE_YAW_MIN = 22;    // |yaw| ≥ 22° ถือว่า "หันข้างพอ"
const SMOOTH_ALPHA = 0.35;  // EMA smoothing สำหรับ yaw
/* -------------------------------------------------------------- */

export function FaceScanScreen({ onAnalyze, onBack }: FaceScanScreenProps) {
  const { t } = useLanguage();

  /* ---------------------- STATE หลัก ---------------------- */
  const [currentStep, setCurrentStep] = useState<ScanStep>('front');
  const [completedSteps, setCompletedSteps] = useState<StepStatus>({
    front: false,
    left: false,
    right: false,
  });
  const [isCapturing, setIsCapturing] = useState(false); // flash ตอนถ่าย
  const [isReadyToCapture, setIsReadyToCapture] = useState(false); // มุมถูกต้องหรือยัง
  const [countdown, setCountdown] = useState<number | null>(null); // แสดง 3..2..1

  const [progress, setProgress] = useState(0); // analyze progress
  const [capturedImages, setCapturedImages] = useState<Captured>({
    front: null,
    left: null,
    right: null,
  });
  const [analyzingImageIndex, setAnalyzingImageIndex] = useState(0);

  /* ---------------------- REFS กล้อง/ประมวลผล ---------------------- */
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mpCameraRef = useRef<Camera | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const smoothYaw = useRef<number | null>(null);         // ค่า yaw หลัง smooth
  const stableStartRef = useRef<number | null>(null);    // เวลาเริ่มนิ่ง
  /* --------------------------------------------------------------- */

  /* ---------------------- ข้อความ/ธีมต่อมุม ---------------------- */
  const getStepInfo = useMemo(() => {
    return () => {
      switch (currentStep) {
        case 'front':
          return {
            title:
              t.language === 'th' ? 'มุมที่ 1: หน้าตรง' :
              t.language === 'en' ? 'Angle 1: Front Face' : '角度 1：正面',
            instruction:
              t.language === 'th' ? 'มองตรงไปที่กล้อง' :
              t.language === 'en' ? 'Look straight at the camera' : '直视相机',
            emoji: '👤',
            color: '#FFB5D9', // ชมพู
            themeName: 'pink',
            readyTextTh: 'มุมหน้าตรงถูกต้อง พร้อมถ่ายใน',
            readyTextEn: 'Front angle OK. Capturing in',
            readyTextZh: '正面角度正确，准备在',
          };
        case 'left':
          return {
            title:
              t.language === 'th' ? 'มุมที่ 2: หันด้านซ้าย' :
              t.language === 'en' ? 'Angle 2: Turn Left' : '角度 2：向左转',
            instruction:
              t.language === 'th' ? 'หันหน้าไปทางซ้าย ~45°' :
              t.language === 'en' ? 'Turn your face left ~45°' : '将脸向左转约45°',
            icon: 'left',
            color: '#7DB8FF', // ฟ้า
            themeName: 'blue',
            readyTextTh: 'มุมซ้ายถูกต้อง พร้อมถ่ายใน',
            readyTextEn: 'Left angle OK. Capturing in',
            readyTextZh: '左侧角度正确，准备在',
          };
        case 'right':
          return {
            title:
              t.language === 'th' ? 'มุมที่ 3: หันด้านขวา' :
              t.language === 'en' ? 'Angle 3: Turn Right' : '角度 3：向右转',
            instruction:
              t.language === 'th' ? 'หันหน้าไปทางขวา ~45°' :
              t.language === 'en' ? 'Turn your face right ~45°' : '将脸向右转约45°',
            icon: 'right',
            color: '#CBB8FF', // ม่วง
            themeName: 'purple',
            readyTextTh: 'มุมขวาถูกต้อง พร้อมถ่ายใน',
            readyTextEn: 'Right angle OK. Capturing in',
            readyTextZh: '右侧角度正确，准备在',
          };
        case 'analyzing':
          return {
            title:
              t.language === 'th' ? 'กำลังวิเคราะห์...' :
              t.language === 'en' ? 'Analyzing...' : '分析中...',
            subtitle:
              t.language === 'th' ? 'กำลังประมวลผลภาพ 3 มุมของคุณ' :
              t.language === 'en' ? 'Processing your 3-angle photos' : '正在处理您的三角照片',
            instruction:
              t.language === 'th' ? 'กำลังประมวลผล' :
              t.language === 'en' ? 'Processing' : '处理中',
            color: '#FFB5D9',
            themeName: 'pink',
          };
      }
    };
  }, [currentStep, t.language]);

  const stepInfo = getStepInfo();

  /* ---------------------- เปิดกล้อง + init MediaPipe ---------------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        video.srcObject = stream;
        streamRef.current = stream;
        await video.play().catch(() => {});
      } catch (e) {
        console.error('getUserMedia error', e);
      }
    };

    startStream().then(() => {
      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });
      faceMesh.onResults(onResults);
      faceMeshRef.current = faceMesh;

      const cam = new Camera(video, {
        onFrame: async () => {
          if (faceMeshRef.current) {
            await faceMeshRef.current.send({ image: video });
          }
        },
        width: 720,
        height: 720,
      });
      cam.start();
      mpCameraRef.current = cam;
    });

    return () => {
      try { mpCameraRef.current?.stop(); } catch {}
      faceMeshRef.current?.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  /* ---------------------- callback จาก MediaPipe ---------------------- */
  function onResults(results: any) {
    if (currentStep === 'analyzing') return;

    const landmarks = results.multiFaceLandmarks?.[0];
    if (!landmarks) {
      stableStartRef.current = null;
      setIsReadyToCapture(false);
      setCountdown(null);
      return;
    }

    const rawYaw = estimateYawDeg(landmarks);

    // smoothing – ให้ลื่นขึ้น
    smoothYaw.current =
      smoothYaw.current == null
        ? rawYaw
        : smoothYaw.current * (1 - SMOOTH_ALPHA) + rawYaw * SMOOTH_ALPHA;

    const yaw = smoothYaw.current;
    const ok = isYawOkForStep(yaw, currentStep);
    const now = performance.now();

    if (ok) {
      if (stableStartRef.current == null) {
        stableStartRef.current = now;
        setIsReadyToCapture(true);
        setCountdown(3); // นับถอยหลังสวย ๆ
      }
      const stableFor = now - stableStartRef.current;
      if (!isCapturing && stableFor >= MIN_STABLE_MS) {
        doCaptureReal();
      }
    } else {
      stableStartRef.current = null;
      setIsReadyToCapture(false);
      setCountdown(null);
    }
  }

  /* ---------------------- คำนวณ yaw (deg) ---------------------- */
  function estimateYawDeg(landmarks: any[]): number {
    // ใช้จุด landmark: 234 (แก้มซ้าย), 454 (แก้มขวา), 1 (จมูก)
    const L = landmarks[234];
    const R = landmarks[454];
    const N = landmarks[1];
    if (!L || !R || !N) return 0;

    const mx = (L.x + R.x) / 2;
    const dx = N.x - mx;
    const yawRad = Math.atan2(dx, Math.abs(R.x - L.x));
    const yawDeg = ((yawRad * 180) / Math.PI) * 1.4; // scale ประสบการณ์
    // NOTE: เราแสดงวิดีโอแบบ mirror (scaleX(-1)) → ทิศจะเป็น:
    // หันซ้าย = yaw บวก, หันขวา = yaw ลบ
    return yawDeg;
  }

  /* ---------------------- ตรวจเงื่อนไขมุม (mirror-friendly) ---------------------- */
  function isYawOkForStep(yaw: number, step: ScanStep): boolean {
    if (step === 'front') return Math.abs(yaw) <= FRONT_YAW_MAX;
    if (step === 'left')  return yaw >= SIDE_YAW_MIN;   // หันซ้าย = บวก
    if (step === 'right') return yaw <= -SIDE_YAW_MIN;  // หันขวา = ลบ
    return false;
  }

  /* ---------------------- Countdown นับ 3..2..1 ---------------------- */
  useEffect(() => {
    if (isReadyToCapture && countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => (c ? c - 1 : 0)), 1000);
      return () => clearTimeout(timer);
    }
  }, [isReadyToCapture, countdown]);

  /* ---------------------- ถ่ายภาพจริง + เดิน step ---------------------- */
  function doCaptureReal() {
    const video = videoRef.current;
    const canvas = hiddenCanvasRef.current;
    if (!video || !canvas) return;

    // flash
    setIsCapturing(true);

    // จับจาก video → base64
    const W = 560; // ความละเอียดกลาง-สูง
    const H = Math.round((W * 340) / 280);
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    ctx.save();
    ctx.scale(-1, 1); // ให้รูปที่ได้เหมือนที่ตาเห็นจาก mirror
    ctx.drawImage(video, -W, 0, W, H);
    ctx.restore();
    const dataURL = canvas.toDataURL('image/jpeg', 0.92);

    const next = { ...completedSteps };
    const nextImgs: Captured = { ...capturedImages };

    if (currentStep === 'front') {
      next.front = true;
      nextImgs.front = dataURL;
      setCompletedSteps(next);
      setCapturedImages(nextImgs);
      setCurrentStep('left');
    } else if (currentStep === 'left') {
      next.left = true;
      nextImgs.left = dataURL;
      setCompletedSteps(next);
      setCapturedImages(nextImgs);
      setCurrentStep('right');
    } else if (currentStep === 'right') {
      next.right = true;
      nextImgs.right = dataURL;
      setCompletedSteps(next);
      setCapturedImages(nextImgs);
      setTimeout(() => setCurrentStep('analyzing'), 500);
    }

    // ปิดแฟลช/รีเซ็ต
    setTimeout(() => setIsCapturing(false), 500);
    stableStartRef.current = null;
    setIsReadyToCapture(false);
    setCountdown(null);
  }

  /* ---------------------- Progress + thumbnails ตอน analyze ---------------------- */
  useEffect(() => {
    if (currentStep !== 'analyzing') return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setTimeout(() => onAnalyze(), 400);
          return 100;
        }
        return p + 2.5; // ~6s
      });
    }, 150);
    return () => clearInterval(id);
  }, [currentStep, onAnalyze]);

  useEffect(() => {
    if (currentStep !== 'analyzing') return;
    const rot = setInterval(() => {
      setAnalyzingImageIndex((i) => (i + 1) % 3);
    }, 1000);
    return () => clearInterval(rot);
  }, [currentStep]);

  /* ---------------------- UI helpers ---------------------- */
  const ArrowLeftIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#7DB8FF" fillOpacity="0.2" />
      <path d="M38 20 L22 32 L38 44" stroke="#7DB8FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="28" stroke="#7DB8FF" strokeWidth="2" strokeOpacity="0.3" />
    </svg>
  );
  const ArrowRightIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#CBB8FF" fillOpacity="0.2" />
      <path d="M26 20 L42 32 L26 44" stroke="#CBB8FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="28" stroke="#CBB8FF" strokeWidth="2" strokeOpacity="0.3" />
    </svg>
  );

  const info = stepInfo;

  /* ====================== RENDER ====================== */
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 100%)' }}>
      {/* BG layer */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)',
        }}
      />

      {/* Flash ตอนถ่าย */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 pointer-events-none"
            style={{ background: 'white' }}
          />
        )}
      </AnimatePresence>

      {/* ปุ่มปิด */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <X className="w-6 h-6 text-white" />
      </motion.button>

      {/* Step Indicator / Thumbnails (บน) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-3"
      >
        {currentStep === 'analyzing' ? (
          <>
            {(['front', 'left', 'right'] as const).map((key, idx) => (
              <motion.div
                key={key}
                className="relative w-16 h-20 rounded-2xl overflow-hidden backdrop-blur-md"
                animate={{
                  scale: analyzingImageIndex === idx ? 1.15 : 1,
                  opacity: analyzingImageIndex === idx ? 1 : 0.6,
                }}
                style={{
                  background:
                    idx === 0 ? 'rgba(255, 181, 217, 0.2)' :
                    idx === 1 ? 'rgba(125, 184, 255, 0.2)' :
                                 'rgba(203, 184, 255, 0.2)',
                  border:
                    idx === 0 ? '2px solid #FFB5D9' :
                    idx === 1 ? '2px solid #7DB8FF' : '2px solid #CBB8FF',
                  boxShadow:
                    analyzingImageIndex === idx
                      ? `0 0 20px ${
                          idx === 0
                            ? 'rgba(255, 181, 217, 0.6)'
                            : idx === 1
                            ? 'rgba(125, 184, 255, 0.6)'
                            : 'rgba(203, 184, 255, 0.6)'
                        }`
                      : 'none',
                }}
              >
                {capturedImages[key] && <img src={capturedImages[key]!} alt={key} className="w-full h-full object-cover" />}
              </motion.div>
            ))}
          </>
        ) : (
          <>
            {/* 1 Front */}
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
              animate={{
                scale: currentStep === 'front' ? 1.2 : 1,
                boxShadow:
                  currentStep === 'front'
                    ? [
                        '0 0 20px rgba(255, 181, 217, 0.6)',
                        '0 0 30px rgba(255, 181, 217, 0.8)',
                        '0 0 20px rgba(255, 181, 217, 0.6)',
                      ]
                    : completedSteps.front
                    ? '0 0 25px rgba(255, 181, 217, 0.7)'
                    : 'none',
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                background: completedSteps.front
                  ? '#FFB5D9'
                  : currentStep === 'front'
                  ? 'rgba(255, 181, 217, 0.4)'
                  : 'rgba(255, 255, 255, 0.08)',
                border: `2px solid ${
                  completedSteps.front || currentStep === 'front' ? '#FFB5D9' : 'rgba(255, 255, 255, 0.15)'
                }`,
              }}
            >
              {completedSteps.front ? <Check className="w-5 h-5 text-white" /> : <span className="text-white">1</span>}
            </motion.div>

            {/* 2 Left */}
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
              animate={{
                scale: currentStep === 'left' ? 1.2 : 1,
                boxShadow:
                  currentStep === 'left'
                    ? [
                        '0 0 20px rgba(125, 184, 255, 0.6)',
                        '0 0 30px rgba(125, 184, 255, 0.8)',
                        '0 0 20px rgba(125, 184, 255, 0.6)',
                      ]
                    : completedSteps.left
                    ? '0 0 25px rgba(125, 184, 255, 0.7)'
                    : 'none',
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                background: completedSteps.left
                  ? '#7DB8FF'
                  : currentStep === 'left'
                  ? 'rgba(125, 184, 255, 0.4)'
                  : 'rgba(255, 255, 255, 0.08)',
                border: `2px solid ${
                  completedSteps.left || currentStep === 'left' ? '#7DB8FF' : 'rgba(255, 255, 255, 0.15)'
                }`,
              }}
            >
              {completedSteps.left ? <Check className="w-5 h-5 text-white" /> : <span className="text-white">2</span>}
            </motion.div>

            {/* 3 Right */}
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
              animate={{
                scale: currentStep === 'right' ? 1.2 : 1,
                boxShadow:
                  currentStep === 'right'
                    ? [
                        '0 0 20px rgba(203, 184, 255, 0.6)',
                        '0 0 30px rgba(203, 184, 255, 0.8)',
                        '0 0 20px rgba(203, 184, 255, 0.6)',
                      ]
                    : completedSteps.right
                    ? '0 0 25px rgba(203, 184, 255, 0.7)'
                    : 'none',
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                background: completedSteps.right
                  ? '#CBB8FF'
                  : currentStep === 'right'
                  ? 'rgba(203, 184, 255, 0.4)'
                  : 'rgba(255, 255, 255, 0.08)',
                border: `2px solid ${
                  completedSteps.right || currentStep === 'right' ? '#CBB8FF' : 'rgba(255, 255, 255, 0.15)'
                }`,
              }}
            >
              {completedSteps.right ? <Check className="w-5 h-5 text-white" /> : <span className="text-white">3</span>}
            </motion.div>
          </>
        )}
      </motion.div>

      {/* กล่องหลัก (content) */}
      <div className="relative h-screen flex flex-col items-center justify-center px-6">
        {/* Title / Instruction */}
        {currentStep !== 'analyzing' ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute top-24 left-0 right-0 text-center z-10"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mb-3 flex items-center justify-center"
            >
              {info.icon === 'left' ? (
                <div className="w-16 h-16"><ArrowLeftIcon /></div>
              ) : info.icon === 'right' ? (
                <div className="w-16 h-16"><ArrowRightIcon /></div>
              ) : (
                <div className="text-6xl">{info.emoji}</div>
              )}
            </motion.div>
            <h2 className="text-white mb-2" style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)' }}>
              {info.title}
            </h2>
            <p className="text-sm" style={{ color: info.color, textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}>
              {info.instruction}
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
              style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)' }}
            >
              {info.title}
            </motion.h2>
            <motion.p
              className="text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ color: info.color, textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}
            >
              {t.language === 'th'
                ? 'กำลังประมวลผลภาพ 3 มุมของคุณ'
                : t.language === 'en'
                ? 'Processing your 3-angle photos'
                : '正在处理您的三角照片'}
            </motion.p>
          </motion.div>
        )}

        {/* === กรอบสแกน 280x340 + วิดีโอจริง === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
          style={{ width: '280px', height: '340px' }}
        >
          {/* Glow BG */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              background: [
                `radial-gradient(ellipse at center, ${info.color}40 0%, ${info.color}20 50%, ${info.color}40 100%)`,
                `radial-gradient(ellipse at center, ${info.color}30 0%, ${info.color}10 50%, ${info.color}30 100%)`,
                `radial-gradient(ellipse at center, ${info.color}40 0%, ${info.color}20 50%, ${info.color}40 100%)`,
              ],
              filter: ['blur(30px)', 'blur(35px)', 'blur(30px)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ transform: 'scale(1.3)' }}
          />

          {/* Gradient Border + Pulse */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              opacity: [0.6, 1, 0.6],
              boxShadow: [
                `0 0 20px ${info.color}60`,
                `0 0 40px ${info.color}80`,
                `0 0 20px ${info.color}60`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: info.color,
              padding: '3px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor' as any,
              maskComposite: 'exclude' as any,
            }}
          />

          {/* วิดีโอจริงในกรอบ */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* 🟣 กรอบโครงหน้า (Face Guide) — สี pulse เมื่อมุมถูกต้อง */}
          <FaceGuideOverlay isReady={isReadyToCapture} themeColor={info.color} />

          {/* ข้อความ "มุมถูกต้อง พร้อมถ่ายใน 3s" */}
          {isReadyToCapture && countdown !== null && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
            >
              <div
                className="rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md"
                style={{ background: `${info.color}22`, border: `1px solid ${info.color}66`, color: '#E6F9FF' }}
              >
                {t.language === 'th'
                  ? `${info.readyTextTh} ${countdown}s`
                  : t.language === 'en'
                  ? `${info.readyTextEn} ${countdown}s`
                  : `${info.readyTextZh} ${countdown}秒内拍摄`}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Progress Bar (ตอน analyzing) */}
        <AnimatePresence>
          {currentStep === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-0 right-0 px-6 z-10"
            >
              <div
                className="rounded-3xl p-6 backdrop-blur-md"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="text-white text-center mb-4">{info.instruction}</div>
                <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #FF8AD4 0%, #67B5FF 50%, #C19BFF 100%)',
                      boxShadow: '0 0 20px rgba(103, 181, 255, 0.6)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center" style={{ color: '#FF8AD4' }}>
                  {Math.floor(progress)}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* แคนวาสซ่อนสำหรับ capture */}
      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}

/* =====================================================================================
 * FaceGuideOverlay
 * - วาด “กรอบโครงหน้า” user-friendly: วงรี + corner brackets + pulse glow
 * - ถ้า isReady = true → pulse สีแรงขึ้น + เส้นวิ่งเนียน ๆ
 * ===================================================================================== */
function FaceGuideOverlay({ isReady, themeColor }: { isReady: boolean; themeColor: string }) {
  return (
    <>
      {/* วงรีกึ่งโปร่ง + pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isReady ? [0.9, 1, 0.9] : [0.5, 0.6, 0.5],
          filter: isReady ? ['drop-shadow(0 0 12px rgba(255,255,255,0.7))', 'drop-shadow(0 0 22px rgba(255,255,255,1))', 'drop-shadow(0 0 12px rgba(255,255,255,0.7))'] : 'none',
        }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        <svg viewBox="0 0 280 340" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="fgGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={`${themeColor}66`} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          {/* วงรีหลัก (ใบหน้า) */}
          <ellipse cx="140" cy="160" rx="84" ry="112" fill="url(#fgGlow)" stroke={themeColor} strokeWidth="2.5" />

          {/* มาร์กมุม (corner brackets) */}
          {renderCorners(themeColor)}

          {/* เส้นวิ่งแนวนอน (สแกนเนียน ๆ) */}
          <motion.rect
            x="24"
            y="60"
            width="232"
            height="2"
            rx="1"
            animate={{ y: ['60', '280'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            fill={isReady ? themeColor : `${themeColor}77`}
            opacity={0.9}
          />
        </svg>
      </motion.div>
    </>
  );
}

function renderCorners(color: string) {
  const s = 18; // ความยาว corner
  const w = 3;  // ความหนาเส้น
  return (
    <>
      {/* TL */}
      <path d={`M20,20 h${s} M20,20 v${s}`} stroke={color} strokeWidth={w} fill="none" />
      {/* TR */}
      <path d={`M260,20 h-${s} M260,20 v${s}`} stroke={color} strokeWidth={w} fill="none" />
      {/* BL */}
      <path d={`M20,320 h${s} M20,320 v-${s}`} stroke={color} strokeWidth={w} fill="none" />
      {/* BR */}
      <path d={`M260,320 h-${s} M260,320 v-${s}`} stroke={color} strokeWidth={w} fill="none" />
    </>
  );
}
