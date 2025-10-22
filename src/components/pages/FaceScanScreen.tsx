import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// MediaPipe
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

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

// ---------------------- ค่าปรับแต่งการตรวจมุม ----------------------
const MIN_STABLE_MS = 1000; // ต้องอยู่นิ่งถึง ms ก่อนถ่าย
const FRONT_YAW_MAX = 6;   // |yaw| ≤ 6° = หน้าตรง
const SIDE_YAW_MIN = 22;   // |yaw| ≥ 22° = หันข้างพอ
// --------------------------------------------------------------------

export function FaceScanScreen({ onAnalyze, onBack }: FaceScanScreenProps) {
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState<ScanStep>('front');
  const [completedSteps, setCompletedSteps] = useState<StepStatus>({
    front: false,
    left: false,
    right: false,
  });

  const [isCapturing, setIsCapturing] = useState(false); // ใช้ทำแฟลช
  const [progress, setProgress] = useState(0);
  const [capturedImages, setCapturedImages] = useState<Captured>({
    front: null,
    left: null,
    right: null,
  });
  const [analyzingImageIndex, setAnalyzingImageIndex] = useState(0);

  // refs สำหรับกล้อง/mediapipe และจับความนิ่ง
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mpCameraRef = useRef<Camera | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const stableStartRef = useRef<number | null>(null);
  const lastYawRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  // ===================== Helpers: แปลข้อความต่อสเต็ป =====================
  const getStepInfo = useMemo(() => {
    return () => {
      switch (currentStep) {
        case 'front':
          return {
            title:
              t.language === 'th'
                ? 'มุมที่ 1: หน้าตรง'
                : t.language === 'en'
                ? 'Angle 1: Front Face'
                : '角度 1：正面',
            instruction:
              t.language === 'th'
                ? 'มองตรงไปที่กล้อง'
                : t.language === 'en'
                ? 'Look straight at the camera'
                : '直视相机',
            emoji: '👤',
            color: '#FFB5D9',
          };
        case 'left':
          return {
            title:
              t.language === 'th'
                ? 'มุมที่ 2: หันด้านซ้าย'
                : t.language === 'en'
                ? 'Angle 2: Turn Left'
                : '角度 2：向左转',
            instruction:
              t.language === 'th'
                ? 'หันหน้าไปทางซ้าย ~45°'
                : t.language === 'en'
                ? 'Turn your face left ~45°'
                : '将脸向左转约45°',
            icon: 'left',
            color: '#7DB8FF',
          };
        case 'right':
          return {
            title:
              t.language === 'th'
                ? 'มุมที่ 3: หันด้านขวา'
                : t.language === 'en'
                ? 'Angle 3: Turn Right'
                : '角度 3：向右转',
            instruction:
              t.language === 'th'
                ? 'หันหน้าไปทางขวา ~45°'
                : t.language === 'en'
                ? 'Turn your face right ~45°'
                : '将脸向右转约45°',
            icon: 'right',
            color: '#CBB8FF',
          };
        case 'analyzing':
          return {
            title:
              t.language === 'th'
                ? 'กำลังวิเคราะห์...'
                : t.language === 'en'
                ? 'Analyzing...'
                : '分析中...',
            subtitle:
              t.language === 'th'
                ? 'กำลังประมวลผลภาพ 3 มุมของคุณ'
                : t.language === 'en'
                ? 'Processing your 3-angle photos'
                : '正在处理您的三角照片',
            instruction:
              t.language === 'th'
                ? 'กำลังประมวลผล'
                : t.language === 'en'
                ? 'Processing'
                : '处理中',
            color: '#FFB5D9',
          };
      }
    };
  }, [currentStep, t.language]);

  const stepInfo = getStepInfo();

  // ===================== init MediaPipe + กล้องจริง =====================
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // เปิดกล้องก่อน เพื่อให้มี stream (บางเครื่องต้องขอสิทธิ์ก่อน)
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
      // init FaceMesh
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

      // กล้องให้ mediapipe ดึงเฟรมจาก <video> ไปประมวลผล
      const mpCam = new Camera(video, {
        onFrame: async () => {
          if (faceMeshRef.current) {
            await faceMeshRef.current.send({ image: video });
          }
        },
        width: 720,
        height: 720,
      });
      mpCam.start();
      mpCameraRef.current = mpCam;
    });

    // cleanup
    return () => {
      try {
        mpCameraRef.current?.stop();
      } catch {}
      faceMeshRef.current?.close();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===================== ตัวประมวลผลผลลัพธ์จาก FaceMesh =====================
  function onResults(results: any) {
    if (currentStep === 'analyzing') return; // หยุดตรวจเมื่อเข้าหน้า analyze
    const landmarks = results.multiFaceLandmarks?.[0];
    if (!landmarks) {
      stableStartRef.current = null;
      return;
    }

    // ประมาณ yaw (องศา) จาก landmark แก้มซ้าย/ขวา + จมูก
    const yaw = estimateYawDeg(landmarks);
    lastYawRef.current = yaw;

    // เช็คว่าเข้าเงื่อนไขของ step ปัจจุบันมั้ย + ต้องนิ่งพอ
    const ok = isYawOkForStep(yaw, currentStep);
    const now = performance.now();

    if (ok) {
      if (stableStartRef.current == null) {
        stableStartRef.current = now;
      }
      const stableFor = now - stableStartRef.current;
      if (!isCapturing && stableFor >= MIN_STABLE_MS) {
        // จับภาพจริง + เปลี่ยนสเต็ป
        doCaptureReal();
      }
    } else {
      stableStartRef.current = null;
    }
  }

  // ประมาณ yaw เป็นองศา (- = หันซ้าย, + = หันขวา)
  function estimateYawDeg(landmarks: any[]): number {
    // ใช้ landmarks: 234 (แก้มซ้าย), 454 (แก้มขวา), 1 (ปลายจมูก)
    const L = landmarks[234]; // left cheek
    const R = landmarks[454]; // right cheek
    const N = landmarks[1];   // nose tip

    if (!L || !R || !N) return 0;

    // ค่าของ MediaPipe เป็น normalized [0..1] โดยแกน X ไปขวา
    // หา midpoint ของแก้มซ้าย/ขวา
    const mx = (L.x + R.x) / 2;
    const my = (L.y + R.y) / 2;

    // เวกเตอร์จากจุดกึ่งกลางแก้ม -> จมูก (ถ้าหน้าตรง x ของ N จะใกล้ mx)
    const dx = N.x - mx;
    const dy = N.y - my;

    // แปลงความเบี้ยวแกน X เป็น yaw แบบหยาบ ๆ
    // คูณสเกลให้กลายเป็นองศาโดยคร่าว (เชิงประสบการณ์)
    const yawRad = Math.atan2(dx, Math.abs(R.x - L.x)); // อิงความกว้างหน้า
    const yawDeg = (yawRad * 180) / Math.PI;

    // หมายเหตุ: กล้องหน้า mirrored (เราใส่ scaleX(-1)) => ทิศยังตรงกับความเข้าใจ:
    // หันซ้าย => yaw ลบ, หันขวา => yaw บวก
    return yawDeg * 1.4; // ปรับสเกลเล็กน้อยให้สอดคล้อง ~องศาจริง
  }

  function isYawOkForStep(yaw: number, step: ScanStep): boolean {
    if (step === 'front') {
      return Math.abs(yaw) <= FRONT_YAW_MAX;
    } else if (step === 'left') {
      return yaw <= -SIDE_YAW_MIN;
    } else if (step === 'right') {
      return yaw >= SIDE_YAW_MIN;
    }
    return false;
  }

  // ===================== จับภาพจริงจาก <video> + แฟลช + เดินสเต็ป =====================
  function doCaptureReal() {
    const video = videoRef.current;
    const canvas = hiddenCanvasRef.current;
    if (!video || !canvas) return;

    // แฟลช
    setIsCapturing(true);

    // เซ็ตขนาด canvas เท่ากรอบวิดีโอ (เราใช้กรอบ 280 x 340 ที่ UI)
    // แต่เพื่อคุณภาพ ให้จับจาก video ที่สัดส่วนใกล้เคียง
    const W = 560; // คุณภาพกลาง-สูง (ไม่หนักเกิน)
    const H = Math.round((W * 340) / 280);
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d')!;
    // วิดีโอเรา mirrored ด้วย CSS => เพื่อให้รูปที่เซฟตรงทิศตาเปล่า ให้ mirrored ด้วย
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -W, 0, W, H);
    ctx.restore();

    // base64
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

      // ไป analyzing
      setTimeout(() => setCurrentStep('analyzing'), 450);
    }

    // ปิดแฟลชชั่วคราว (คงไว้ตามเดิม ~0.5s)
    setTimeout(() => setIsCapturing(false), 500);
    // รีเซ็ตจับนิ่ง
    stableStartRef.current = null;
  }

  // ===================== Progress ระหว่าง analyzing =====================
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

  // หมุนรูปโชว์ 3 มุมตอน analyze
  useEffect(() => {
    if (currentStep !== 'analyzing') return;
    const rot = setInterval(() => {
      setAnalyzingImageIndex((i) => (i + 1) % 3);
    }, 1000);
    return () => clearInterval(rot);
  }, [currentStep]);

  // ===================== UI Helpers (ลูกศรซ้าย/ขวา) =====================
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

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 100%)' }}
    >
      {/* BG (เดิม) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)',
        }}
      />

      {/* Flash ตอนถ่าย (เดิม) */}
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

      {/* ปุ่มปิด (เดิม) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
      >
        <X className="w-6 h-6 text-white" />
      </motion.button>

      {/* ตัวชี้สถานะด้านบน (เดิม) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-3"
      >
        {currentStep === 'analyzing' ? (
          <>
            {/* โชว์รูปที่ถ่ายได้จริง 3 มุม */}
            {(['front', 'left', 'right'] as const).map((k, idx) => (
              <motion.div
                key={k}
                className="relative w-16 h-20 rounded-2xl overflow-hidden backdrop-blur-md"
                animate={{
                  scale: analyzingImageIndex === idx ? 1.15 : 1,
                  opacity: analyzingImageIndex === idx ? 1 : 0.6,
                }}
                style={{
                  background:
                    idx === 0
                      ? 'rgba(255, 181, 217, 0.2)'
                      : idx === 1
                      ? 'rgba(125, 184, 255, 0.2)'
                      : 'rgba(203, 184, 255, 0.2)',
                  border:
                    idx === 0 ? '2px solid #FFB5D9' : idx === 1 ? '2px solid #7DB8FF' : '2px solid #CBB8FF',
                  boxShadow:
                    analyzingImageIndex === idx
                      ? `0 0 20px ${
                          idx === 0 ? 'rgba(255, 181, 217, 0.6)' : idx === 1 ? 'rgba(125, 184, 255, 0.6)' : 'rgba(203, 184, 255, 0.6)'
                        }`
                      : 'none',
                }}
              >
                {capturedImages[k] && (
                  <img src={capturedImages[k]!} alt={k} className="w-full h-full object-cover" />
                )}
              </motion.div>
            ))}
          </>
        ) : (
          <>
            {/* Front */}
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

            {/* Left */}
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

            {/* Right */}
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

      {/* กล่องหลัก */}
      <div className="relative h-screen flex flex-col items-center justify-center px-6">
        {/* หัวข้อ/คำแนะนำ */}
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
                <div className="w-16 h-16">
                  <ArrowLeftIcon />
                </div>
              ) : info.icon === 'right' ? (
                <div className="w-16 h-16">
                  <ArrowRightIcon />
                </div>
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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-32 left-0 right-0 text-center z-10 px-6">
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
              {info.subtitle}
            </motion.p>
          </motion.div>
        )}

        {/* ======= กล่องสแกนมีกรอบ/เงาเดิม + วิดีโอกล้องจริงอยู่ "ในกรอบ" ======= */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative z-10" style={{ width: '280px', height: '340px' }}>
          {/* Glow BG เดิม */}
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

          {/* กรอบ gradient เดิม */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              opacity: [0.6, 1, 0.6],
              boxShadow: [`0 0 20px ${info.color}60`, `0 0 40px ${info.color}80`, `0 0 20px ${info.color}60`],
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

          {/* วิดีโอกล้องจริง (แทนรูปไกด์) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* เอฟเฟ็กต์สแกน (เฉพาะตอน analyzing) เดิม */}
          {currentStep === 'analyzing' && (
            <>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(125, 184, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(125, 184, 255, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />
              <motion.div
                className="absolute left-0 right-0 h-1 pointer-events-none z-10"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: `linear-gradient(90deg, transparent, #7DB8FFFF, transparent)`,
                  boxShadow: `0 0 20px #7DB8FFCC, 0 0 40px #7DB8FF88`,
                }}
              />
              <motion.div
                className="absolute left-0 right-0 h-0.5 pointer-events-none z-10"
                animate={{ top: ['10%', '110%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 0.3 }}
                style={{ background: `linear-gradient(90deg, transparent, #FFB5D9CC, transparent)`, boxShadow: `0 0 15px #FFB5D999` }}
              />
              <motion.div
                className="absolute left-0 right-0 h-0.5 pointer-events-none z-10"
                animate={{ top: ['20%', '120%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0.6 }}
                style={{ background: `linear-gradient(90deg, transparent, #CBB8FFCC, transparent)`, boxShadow: `0 0 15px #CBB8FF99` }}
              />
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full pointer-events-none"
                  animate={{ top: ['0%', '100%'], left: `${10 + i * 11}%`, opacity: [0, 1, 0] }}
                  transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'linear', delay: i * 0.15 }}
                  style={{
                    background: i % 3 === 0 ? '#7DB8FF' : i % 3 === 1 ? '#FFB5D9' : '#CBB8FF',
                    boxShadow: `0 0 10px ${i % 3 === 0 ? '#7DB8FF' : i % 3 === 1 ? '#FFB5D9' : '#CBB8FF'}`,
                  }}
                />
              ))}
              {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
                <motion.div
                  key={corner}
                  className={`absolute w-8 h-8 pointer-events-none ${
                    corner === 'top-left' ? 'top-0 left-0' : corner === 'top-right' ? 'top-0 right-0' : corner === 'bottom-left' ? 'bottom-0 left-0' : 'bottom-0 right-0'
                  }`}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      borderTop: corner.includes('top') ? '3px solid #7DB8FF' : 'none',
                      borderBottom: corner.includes('bottom') ? '3px solid #7DB8FF' : 'none',
                      borderLeft: corner.includes('left') ? '3px solid #7DB8FF' : 'none',
                      borderRight: corner.includes('right') ? '3px solid #7DB8FF' : 'none',
                      boxShadow: '0 0 10px #7DB8FF88',
                    }}
                  />
                </motion.div>
              ))}
            </>
          )}

          {/* วงนับถอยหลังกระพริบ (เดิม) */}
          {currentStep !== 'analyzing' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md"
                animate={{ boxShadow: [`0 0 0 0 ${info.color}40`, `0 0 0 20px ${info.color}00`] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ background: `${info.color}30`, border: `2px solid ${info.color}` }}
              >
                <motion.div
                  className="w-12 h-12 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
                  style={{ border: `3px solid transparent`, borderTopColor: info.color }}
                />
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* แถบ progress ตอน analyzing (เดิม) */}
        <AnimatePresence>
          {currentStep === 'analyzing' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-20 left-0 right-0 px-6 z-10">
              <div className="rounded-3xl p-6 backdrop-blur-md" style={{ background: 'rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
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

      {/* canvas ซ่อนสำหรับ capture จริง */}
      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}
