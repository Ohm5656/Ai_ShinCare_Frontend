// FaceScanScreen.tsx
// -------------------------------------------------------------
// Feature:
// - 3-step face capture (front, left, right) using MediaPipe FaceMesh
// - Yaw-based angle check with smoothing + stability window
// - Auto-capture with 3s countdown + flash
// - Beautiful oval face guide that pulses/glows when angle is correct
// - Eye/Mouth faint markers to help alignment
// - Keeps your existing theme and animations as requested
// -------------------------------------------------------------

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { useLanguage } from '../../contexts/LanguageContext';

// -------------------------------------------------------------
// Types
// -------------------------------------------------------------
interface FaceScanScreenProps {
  onAnalyze: () => void;
  onBack: () => void;
}
type ScanStep = 'front' | 'left' | 'right' | 'analyzing';
interface StepStatus { front: boolean; left: boolean; right: boolean; }
type Captured = { front: string | null; left: string | null; right: string | null };

// -------------------------------------------------------------
// Tunable parameters (tested for front camera mirrored preview)
// -------------------------------------------------------------
const FRONT_YAW_MAX = 6;       // |yaw| <= 6° = front
const SIDE_YAW_MIN = 22;       // |yaw| >= 22° = side
const STABLE_MS = 1000;        // must hold angle this long before countdown
const COUNTDOWN_SEC = 3;       // countdown length before capture
const EMA_ALPHA = 0.25;        // smoothing factor for yaw (0..1)
const HYST_MARGIN = 2.5;       // reduce false flip near thresholds
const CAPTURE_W = 560;         // capture canvas width (quality vs performance)
const BOX_W = 280;             // UI frame width
const BOX_H = 340;             // UI frame height

// Colors per step
const THEME = {
  front: '#FFB5D9', // pink
  left:  '#7DB8FF', // blue
  right: '#CBB8FF', // purple
};

// -------------------------------------------------------------
// Helpers: angle checks with hysteresis
// -------------------------------------------------------------
function isYawOk(step: ScanStep, yawDeg: number) {
  if (step === 'front') return Math.abs(yawDeg) <= FRONT_YAW_MAX;
  if (step === 'left')  return yawDeg <= -(SIDE_YAW_MIN);
  if (step === 'right') return yawDeg >=  (SIDE_YAW_MIN);
  return false;
}
function isYawOkLoose(step: ScanStep, yawDeg: number) {
  // Used to avoid thrashing (for showing "almost" state)
  if (step === 'front') return Math.abs(yawDeg) <= (FRONT_YAW_MAX + HYST_MARGIN);
  if (step === 'left')  return yawDeg <= -(SIDE_YAW_MIN - HYST_MARGIN);
  if (step === 'right') return yawDeg >=  (SIDE_YAW_MIN - HYST_MARGIN);
  return false;
}

// -------------------------------------------------------------
// Estimate yaw (deg) from FaceMesh landmarks: cheeks + nose tip
// Negative = left, Positive = right (with mirrored preview)
// -------------------------------------------------------------
function estimateYawDeg(landmarks: any[]): number {
  // indices: 234 (left cheek), 454 (right cheek), 1 (nose tip)
  const L = landmarks[234], R = landmarks[454], N = landmarks[1];
  if (!L || !R || !N) return 0;
  const midX = (L.x + R.x) / 2;
  // Use face width to scale the dx
  const width = Math.abs(R.x - L.x) || 1e-6;
  const dx = N.x - midX;                  // positive if nose is to the right
  const yawRad = Math.atan2(dx, width);   // rough
  const yawDeg = (yawRad * 180) / Math.PI;
  // Scale tweak to better match real-world feel
  return yawDeg * 1.4;
}

// -------------------------------------------------------------
// SVG Face Oval Guide (pulse when valid)
// - shows corner brackets + rotated ellipse + faint eye/mouth guides
// -------------------------------------------------------------
const FaceOvalGuide: React.FC<{
  color: string;
  active: boolean;          // true when current yaw is valid
  step: ScanStep;
  width: number;
  height: number;
}> = ({ color, active, step, width, height }) => {
  // ellipse geometry (fits the 280x340 box)
  const cx = width / 2;
  const cy = height / 2 + 6;     // a little lower
  const rx = width * 0.32;
  const ry = height * 0.40;
  // rotate ellipse slightly to match step vibe
  const rot = step === 'front' ? 0 : step === 'left' ? -12 : 12;

  const bracket = 22;
  const strokeMain = active ? 1.8 : 1.2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    >
      {/* Corner brackets */}
      <g opacity={0.9} filter="url(#glow)">
        <line x1={16} y1={16} x2={16 + bracket} y2={16} stroke={color} strokeWidth={2}/>
        <line x1={16} y1={16} x2={16} y2={16 + bracket} stroke={color} strokeWidth={2}/>
        <line x1={width-16} y1={16} x2={width-16-bracket} y2={16} stroke={color} strokeWidth={2}/>
        <line x1={width-16} y1={16} x2={width-16} y2={16+bracket} stroke={color} strokeWidth={2}/>
        <line x1={16} y1={height-16} x2={16+bracket} y2={height-16} stroke={color} strokeWidth={2}/>
        <line x1={16} y1={height-16} x2={16} y2={height-16-bracket} stroke={color} strokeWidth={2}/>
        <line x1={width-16} y1={height-16} x2={width-16-bracket} y2={height-16} stroke={color} strokeWidth={2}/>
        <line x1={width-16} y1={height-16} x2={width-16} y2={height-16-bracket} stroke={color} strokeWidth={2}/>
      </g>

      {/* Pulsing outer aura when active */}
      {active && (
        <g opacity={0.7}>
          <ellipse cx={cx} cy={cy} rx={rx+10} ry={ry+10}
                   transform={`rotate(${rot} ${cx} ${cy})`}
                   fill="none" stroke={color} strokeOpacity={0.35} strokeWidth={8}/>
        </g>
      )}

      {/* Main face oval */}
      <g>
        <ellipse
          cx={cx} cy={cy} rx={rx} ry={ry}
          transform={`rotate(${rot} ${cx} ${cy})`}
          fill="none"
          stroke={color}
          strokeOpacity={0.9}
          strokeWidth={strokeMain}
        />
        {/* animated dash when nearly OK */}
        <ellipse
          cx={cx} cy={cy} rx={rx} ry={ry}
          transform={`rotate(${rot} ${cx} ${cy})`}
          fill="none"
          stroke={color}
          strokeOpacity={0.5}
          strokeWidth={1}
          strokeDasharray="10 10"
        >
          <animate attributeName="stroke-dashoffset" values="0;20" dur="2s" repeatCount="indefinite"/>
        </ellipse>
      </g>

      {/* Faint eyes & mouth guides */}
      <g opacity={0.4}>
        {/* Eye line */}
        <line x1={cx - rx * 0.45} y1={cy - ry * 0.25}
              x2={cx + rx * 0.45} y2={cy - ry * 0.25}
              stroke={color} strokeWidth={1}/>
        {/* Mouth line */}
        <line x1={cx - rx * 0.35} y1={cy + ry * 0.35}
              x2={cx + rx * 0.35} y2={cy + ry * 0.35}
              stroke={color} strokeWidth={1}/>
        {/* Nose tick */}
        <line x1={cx} y1={cy - ry * 0.02} x2={cx} y2={cy + ry * 0.12}
              stroke={color} strokeWidth={1}/>
      </g>

      {/* Glow filter */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

// -------------------------------------------------------------
// Main component
// -------------------------------------------------------------
export function FaceScanScreen({ onAnalyze, onBack }: FaceScanScreenProps) {
  const { t } = useLanguage();

  // step/status/progress
  const [currentStep, setCurrentStep] = useState<ScanStep>('front');
  const [done, setDone] = useState<StepStatus>({ front: false, left: false, right: false });
  const [captured, setCaptured] = useState<Captured>({ front: null, left: null, right: null });
  const [progress, setProgress] = useState(0);
  const [flipIndex, setFlipIndex] = useState(0);

  // camera / capture / mediapipe
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const capCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mpCameraRef = useRef<Camera | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // stability & detection
  const [isCapturing, setIsCapturing] = useState(false); // flash
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hintReady, setHintReady] = useState(false);     // “มุมถูกต้อง – ถ่ายใน 3 วิ”
  const stableStartRef = useRef<number | null>(null);
  const emaYawRef = useRef<number>(0);                    // smoothed yaw
  const lastOkLooseRef = useRef<boolean>(false);          // for hysteresis/UX

  // -----------------------------------------------------------
  // Step text & color (multi-language)
  // -----------------------------------------------------------
  const stepInfo = useMemo(() => {
    const L = t.language;
    if (currentStep === 'front') {
      return {
        title: L === 'th' ? 'มุมที่ 1: หน้าตรง' :
               L === 'en' ? 'Angle 1: Front Face' : '角度 1：正面',
        instruction: L === 'th' ? 'มองตรงไปที่กล้อง' :
                    L === 'en' ? 'Look straight at the camera' : '直视相机',
        color: THEME.front,
        icon: 'front' as const,
      };
    }
    if (currentStep === 'left') {
      return {
        title: L === 'th' ? 'มุมที่ 2: หันด้านซ้าย' :
               L === 'en' ? 'Angle 2: Turn Left' : '角度 2：向左转',
        instruction: L === 'th' ? 'หันหน้าไปทางซ้าย ~45°' :
                    L === 'en' ? 'Turn your face left ~45°' : '将脸向左转约45°',
        color: THEME.left,
        icon: 'left' as const,
      };
    }
    if (currentStep === 'right') {
      return {
        title: L === 'th' ? 'มุมที่ 3: หันด้านขวา' :
               L === 'en' ? 'Angle 3: Turn Right' : '角度 3：向右转',
        instruction: L === 'th' ? 'หันหน้าไปทางขวา ~45°' :
                    L === 'en' ? 'Turn your face right ~45°' : '将脸向右转约45°',
        color: THEME.right,
        icon: 'right' as const,
      };
    }
    return {
      title: L === 'th' ? 'กำลังวิเคราะห์...' :
             L === 'en' ? 'Analyzing...' : '分析中...',
      instruction: L === 'th' ? 'กำลังประมวลผล' :
                   L === 'en' ? 'Processing' : '处理中',
      subtitle: L === 'th' ? 'กำลังประมวลผลภาพ 3 มุมของคุณ' :
                L === 'en' ? 'Processing your 3-angle photos' : '正在处理您的三角照片',
      color: THEME.front,
      icon: 'analyzing' as const,
    };
  }, [currentStep, t.language]);

  // -----------------------------------------------------------
  // Init camera + FaceMesh once
  // -----------------------------------------------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        streamRef.current = stream;
        video.srcObject = stream;
        await video.play().catch(()=>{});
      } catch (err) {
        console.error('getUserMedia error', err);
      }

      const fm = new FaceMesh({
        locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
      });
      fm.setOptions({ maxNumFaces:1, refineLandmarks:true, minDetectionConfidence:0.6, minTrackingConfidence:0.6 });
      fm.onResults(onResults);
      faceMeshRef.current = fm;

      const cam = new Camera(video, {
        onFrame: async () => { if (faceMeshRef.current) await faceMeshRef.current.send({ image: video }); },
        width: 720, height: 720,
      });
      cam.start();
      mpCameraRef.current = cam;
    };

    start();

    return () => {
      try { mpCameraRef.current?.stop(); } catch {}
      faceMeshRef.current?.close?.();
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------
  // FaceMesh results handler
  // -----------------------------------------------------------
  const onResults = (res: any) => {
    if (currentStep === 'analyzing') return;
    const lm = res.multiFaceLandmarks?.[0];
    if (!lm) {
      stableStartRef.current = null;
      setHintReady(false);
      setCountdown(null);
      return;
    }

    // estimate yaw & smooth (EMA)
    const yawRaw = estimateYawDeg(lm);
    const prev = emaYawRef.current || yawRaw;
    const yaw = EMA_ALPHA * yawRaw + (1 - EMA_ALPHA) * prev;
    emaYawRef.current = yaw;

    const ok = isYawOk(currentStep, yaw);
    const near = isYawOkLoose(currentStep, yaw);

    if (ok) {
      if (stableStartRef.current == null) stableStartRef.current = performance.now();
      const dur = performance.now() - (stableStartRef.current ?? 0);

      // show "ready" hint during stability window
      if (dur >= STABLE_MS && countdown == null) {
        setHintReady(true);
        setCountdown(COUNTDOWN_SEC);
      }
    } else {
      // reset when out of valid range (but keep hint if still near)
      stableStartRef.current = null;
      setHintReady(false);
      if (!near) setCountdown(null);
    }
  };

  // -----------------------------------------------------------
  // Countdown tick
  // -----------------------------------------------------------
  useEffect(() => {
    if (countdown == null) return;
    if (countdown <= 0) {
      setCountdown(null);
      doCapture();
      return;
    }
    const id = setTimeout(() => setCountdown(c => (c ?? 0) - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  // -----------------------------------------------------------
  // Capture (true photo from <video>) + flash + step flow
  // -----------------------------------------------------------
  const doCapture = () => {
    const video = videoRef.current;
    const canvas = capCanvasRef.current;
    if (!video || !canvas) return;

    setIsCapturing(true);

    // compute target size (keep 280:340 ratio)
    const W = CAPTURE_W;
    const H = Math.round((W * BOX_H) / BOX_W);
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d')!;
    // mirror horizontally to match preview
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -W, 0, W, H);
    ctx.restore();

    // export JPEG
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const nextDone = { ...done };
    const nextImg: Captured = { ...captured };

    if (currentStep === 'front') {
      nextDone.front = true; nextImg.front = dataUrl; setDone(nextDone); setCaptured(nextImg); setCurrentStep('left');
    } else if (currentStep === 'left') {
      nextDone.left  = true; nextImg.left  = dataUrl; setDone(nextDone); setCaptured(nextImg); setCurrentStep('right');
    } else if (currentStep === 'right') {
      nextDone.right = true; nextImg.right = dataUrl; setDone(nextDone); setCaptured(nextImg);
      setTimeout(() => setCurrentStep('analyzing'), 400);
    }

    // end flash
    setTimeout(() => setIsCapturing(false), 480);
    // reset hints
    setHintReady(false);
    stableStartRef.current = null;
  };

  // -----------------------------------------------------------
  // Analyzing progress + rotating thumbnails
  // -----------------------------------------------------------
  useEffect(() => {
    if (currentStep !== 'analyzing') return;
    const prog = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(prog);
          setTimeout(() => onAnalyze(), 350);
          return 100;
        }
        return p + 2.5;
      });
    }, 150);
    return () => clearInterval(prog);
  }, [currentStep, onAnalyze]);

  useEffect(() => {
    if (currentStep !== 'analyzing') return;
    const rot = setInterval(() => setFlipIndex(i => (i + 1) % 3), 1000);
    return () => clearInterval(rot);
  }, [currentStep]);

  // -----------------------------------------------------------
  // Icons for top header (same as your style)
  // -----------------------------------------------------------
  const StepDot: React.FC<{ idx:number; active:boolean; done:boolean; color:string }> = ({ idx, active, done, color }) => (
    <motion.div
      className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
      animate={{
        scale: active ? 1.2 : 1,
        boxShadow: active
          ? [ `0 0 20px ${color}99`, `0 0 30px ${color}cc`, `0 0 20px ${color}99` ]
          : done ? `0 0 25px ${color}b3` : 'none'
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{
        background: done ? color : active ? `${color}66` : 'rgba(255,255,255,0.08)',
        border: `2px solid ${done || active ? color : 'rgba(255,255,255,0.15)'}`,
      }}
    >
      {done ? <Check className="w-5 h-5 text-white"/> : <span className="text-white">{idx}</span>}
    </motion.div>
  );

  // -----------------------------------------------------------
  // UI
  // -----------------------------------------------------------
  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 100%)' }}
    >
      {/* Ambient bg glow (same as before) */}
      <div className="absolute inset-0"
           style={{ background: 'radial-gradient(ellipse at center, rgba(30,41,59,0.8) 0%, rgba(15,23,42,1) 100%)' }}
      />

      {/* Flash overlay */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 pointer-events-none"
            style={{ background: 'white' }}
          />
        )}
      </AnimatePresence>

      {/* Close button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{ background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)' }}
      >
        <X className="w-6 h-6 text-white"/>
      </motion.button>

      {/* Header dots OR analyzing thumbnails */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-3"
      >
        {currentStep === 'analyzing' ? (
          <>
            {( ['front','left','right'] as const).map((k, idx) => (
              <motion.div key={k}
                className="relative w-16 h-20 rounded-2xl overflow-hidden backdrop-blur-md"
                animate={{ scale: flipIndex === idx ? 1.15 : 1, opacity: flipIndex === idx ? 1 : 0.6 }}
                style={{
                  background: idx===0 ? 'rgba(255,181,217,0.2)' : idx===1 ? 'rgba(125,184,255,0.2)' : 'rgba(203,184,255,0.2)',
                  border: `2px solid ${idx===0?THEME.front:idx===1?THEME.left:THEME.right}`,
                  boxShadow: flipIndex===idx ? `0 0 20px ${(idx===0?THEME.front:idx===1?THEME.left:THEME.right)}99` : 'none',
                }}>
                {captured[k] && <img src={captured[k]!} alt={k} className="w-full h-full object-cover" />}
              </motion.div>
            ))}
          </>
        ) : (
          <>
            <StepDot idx={1} active={currentStep==='front'} done={done.front} color={THEME.front}/>
            <StepDot idx={2} active={currentStep==='left'}  done={done.left}  color={THEME.left}/>
            <StepDot idx={3} active={currentStep==='right'} done={done.right} color={THEME.right}/>
          </>
        )}
      </motion.div>

      {/* Title & instruction */}
      <div className="relative h-screen flex flex-col items-center justify-center px-6">
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
              {/* emoji/icon slot (kept minimal to preserve your design) */}
              <div className="text-6xl">👤</div>
            </motion.div>
            <h2 className="text-white mb-2" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              {stepInfo.title}
            </h2>
            <p className="text-sm" style={{ color: stepInfo.color, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              {stepInfo.instruction}
            </p>

            {/* Ready hint + countdown */}
            <AnimatePresence>
              {hintReady && countdown != null && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-2 text-sm"
                  style={{ color: stepInfo.color }}
                >
                  {t.language === 'th' ? 'มุมถูกต้อง – ถ่ายใน' : t.language === 'en' ? 'Angle correct – Capturing in' : '角度正确 – 将在'}
                  &nbsp;<strong>{countdown}</strong>&nbsp;
                  {t.language === 'th' ? 'วิ' : t.language === 'en' ? 's' : '秒'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute top-32 left-0 right-0 text-center z-10 px-6">
            <motion.h2 className="text-white mb-2"
                       animate={{ opacity: [1, 0.7, 1] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       style={{ textShadow:'0 2px 20px rgba(0,0,0,0.8)' }}>
              {stepInfo.title}
            </motion.h2>
            <motion.p className="text-sm" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
                      style={{ color: stepInfo.color, textShadow:'0 2px 10px rgba(0,0,0,0.8)' }}>
              {stepInfo.subtitle}
            </motion.p>
          </motion.div>
        )}

        {/* ---------------- Frame + Real Camera inside ---------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
          style={{ width: `${BOX_W}px`, height: `${BOX_H}px` }}
        >
          {/* Glow BG */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              background: [
                `radial-gradient(ellipse at center, ${stepInfo.color}40 0%, ${stepInfo.color}20 50%, ${stepInfo.color}40 100%)`,
                `radial-gradient(ellipse at center, ${stepInfo.color}30 0%, ${stepInfo.color}10 50%, ${stepInfo.color}30 100%)`,
                `radial-gradient(ellipse at center, ${stepInfo.color}40 0%, ${stepInfo.color}20 50%, ${stepInfo.color}40 100%)`,
              ],
              filter: ['blur(30px)', 'blur(35px)', 'blur(30px)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ transform: 'scale(1.3)' }}
          />

          {/* Gradient border */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              opacity: [0.6, 1, 0.6],
              boxShadow: [`0 0 20px ${stepInfo.color}60`, `0 0 40px ${stepInfo.color}80`, `0 0 20px ${stepInfo.color}60`],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: stepInfo.color,
              padding: '3px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor' as any,
              maskComposite: 'exclude' as any,
            }}
          />

          {/* Real camera */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Face Oval Guide overlay (pulses when valid) */}
          <FaceOvalGuide
            color={stepInfo.color}
            active={hintReady || (countdown != null)}
            step={currentStep}
            width={BOX_W}
            height={BOX_H}
          />

          {/* Scanning grid/lines shown during analyzing only (kept) */}
          {currentStep === 'analyzing' && (
            <>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(125,184,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(125,184,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />
              <motion.div className="absolute left-0 right-0 h-1 pointer-events-none z-10"
                          animate={{ top: ['0%','100%'] }} transition={{ duration:2, repeat:Infinity, ease:'linear' }}
                          style={{ background:'linear-gradient(90deg, transparent, #7DB8FFFF, transparent)', boxShadow:'0 0 20px #7DB8FFCC, 0 0 40px #7DB8FF88' }}/>
              <motion.div className="absolute left-0 right-0 h-0.5 pointer-events-none z-10"
                          animate={{ top: ['10%','110%'] }} transition={{ duration:2.5, repeat:Infinity, ease:'linear', delay:0.3 }}
                          style={{ background:'linear-gradient(90deg, transparent, #FFB5D9CC, transparent)', boxShadow:'0 0 15px #FFB5D999' }}/>
              <motion.div className="absolute left-0 right-0 h-0.5 pointer-events-none z-10"
                          animate={{ top: ['20%','120%'] }} transition={{ duration:3, repeat:Infinity, ease:'linear', delay:0.6 }}
                          style={{ background:'linear-gradient(90deg, transparent, #CBB8FFCC, transparent)', boxShadow:'0 0 15px #CBB8FF99' }}/>
              {[...Array(8)].map((_,i)=>(
                <motion.div key={i} className="absolute w-1 h-1 rounded-full pointer-events-none"
                            animate={{ top:['0%','100%'], left:`${10 + i*11}%`, opacity:[0,1,0] }}
                            transition={{ duration: 2 + i*0.2, repeat: Infinity, ease:'linear', delay: i*0.15 }}
                            style={{
                              background: i%3===0?'#7DB8FF':i%3===1?'#FFB5D9':'#CBB8FF',
                              boxShadow: `0 0 10px ${i%3===0?'#7DB8FF':i%3===1?'#FFB5D9':'#CBB8FF'}`
                            }}/>
              ))}
            </>
          )}

          {/* Spinning countdown ring (kept) */}
          {currentStep !== 'analyzing' && (
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <motion.div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md"
                          animate={{ boxShadow: [`0 0 0 0 ${stepInfo.color}40`, `0 0 0 20px ${stepInfo.color}00`] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          style={{ background:`${stepInfo.color}30`, border:`2px solid ${stepInfo.color}` }}>
                <motion.div className="w-12 h-12 rounded-full" animate={{ rotate: 360 }}
                            transition={{ duration:3, ease:'linear', repeat:Infinity }}
                            style={{ border:'3px solid transparent', borderTopColor: stepInfo.color }}/>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Progress bar during analyzing */}
        <AnimatePresence>
          {currentStep === 'analyzing' && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
                        className="absolute bottom-20 left-0 right-0 px-6 z-10">
              <div className="rounded-3xl p-6 backdrop-blur-md"
                   style={{ background:'rgba(0,0,0,0.8)', border:'1px solid rgba(255,255,255,0.2)' }}>
                <div className="text-white text-center mb-4">{stepInfo.instruction}</div>
                <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
                  <motion.div className="absolute inset-y-0 left-0 rounded-full"
                              style={{
                                width:`${progress}%`,
                                background:'linear-gradient(90deg, #FF8AD4 0%, #67B5FF 50%, #C19BFF 100%)',
                                boxShadow:'0 0 20px rgba(103,181,255,0.6)'
                              }}
                              initial={{ width: 0 }} animate={{ width:`${progress}%` }}/>
                </div>
                <div className="text-center" style={{ color:'#FF8AD4' }}>{Math.floor(progress)}%</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden canvas for real capture */}
      <canvas ref={capCanvasRef} style={{ display:'none' }}/>
    </div>
  );
}
