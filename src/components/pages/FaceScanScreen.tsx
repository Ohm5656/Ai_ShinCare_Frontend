import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Progress } from "../ui/progress";
import { X, ArrowRight } from "lucide-react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

/* =============================================
   CONFIG
============================================= */
interface FaceScanScreenProps {
  onAnalyzeResult: (result: any) => void;
  onBack: () => void;
}

const STEPS = ["หน้าตรง", "หันซ้าย", "หันขวา"] as const;
type Step = 0 | 1 | 2;

const STABLE_TIME = 2000; // อยู่ในมุมที่ถูกต้อง 2 วิ
const NEXT_DELAY = 900;
const TARGET_YAW = [0, +22, -22];
const YAW_TOL = [10, 12, 12];
const MAX_ROLL = 12;
const CENTER_BOX = { xMin: 0.35, xMax: 0.65, yMin: 0.28, yMax: 0.72 };

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://aishincarebackend-production.up.railway.app";

/* =============================================
   Scan Overlay (กรอบ + เส้นเลเซอร์)
============================================= */
function ScanOverlay() {
  return (
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
      <svg
        viewBox="0 0 320 440"
        className="w-[340px] h-[440px] drop-shadow-[0_0_25px_rgba(0,255,255,0.4)]"
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#3f9cff" />
          </linearGradient>
        </defs>

        {/* กรอบโค้งมน */}
        <rect
          x="20"
          y="20"
          width="280"
          height="400"
          rx="80"
          ry="80"
          stroke="url(#grad)"
          strokeWidth="3"
          fill="none"
        />
        {/* มุมเน้น 4 ด้าน */}
        <path
          d="M40 20 v40 M20 40 h40 M280 20 v40 M300 40 h-40 M40 420 v-40 M20 400 h40 M280 420 v-40 M300 400 h-40"
          stroke="#00eaff"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* เส้นเลเซอร์วิ่งขึ้น-ลง */}
      <motion.div
        className="absolute w-[300px] h-[3px] bg-gradient-to-r from-cyan-400 via-blue-200 to-cyan-400 rounded-full blur-[1px]"
        initial={{ y: -180 }}
        animate={{ y: [180, -180] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

/* =============================================
   Step Indicator
============================================= */
function StepIndicator({ step }: { step: Step }) {
  const labels = ["หน้าตรง", "หันซ้าย", "หันขวา"];
  return (
    <div className="absolute top-3 left-0 right-0 flex justify-center items-center gap-3 z-30">
      {labels.map((lb, i) => {
        const active = i === step;
        return (
          <div key={i} className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-full grid place-items-center border-2 ${
                active ? "border-cyan-400 bg-cyan-400/10" : "border-white/30"
              }`}
            >
              <span
                className={`text-[11px] font-semibold ${
                  active ? "text-cyan-200" : "text-white/70"
                }`}
              >
                {lb}
              </span>
            </div>
            {i < 2 && <ArrowRight className="w-4 h-4 text-white/60" />}
          </div>
        );
      })}
    </div>
  );
}

/* =============================================
   Utilities: ประเมินมุม yaw / roll จาก landmark
============================================= */
function estimatePose(landmarks: any[]) {
  const LEFT_EYE = 33;
  const RIGHT_EYE = 263;
  const NOSE_TIP = 1;

  const leftEye = landmarks[LEFT_EYE];
  const rightEye = landmarks[RIGHT_EYE];
  const nose = landmarks[NOSE_TIP];

  const dx = rightEye.x - leftEye.x;
  const dy = rightEye.y - leftEye.y;
  const roll = (Math.atan2(dy, dx) * 180) / Math.PI;

  const midX = (leftEye.x + rightEye.x) / 2;
  const yaw = (nose.x - midX) * -200;
  return { yaw, roll, nose };
}

function isCentered(nose: any) {
  if (!nose) return false;
  return (
    nose.x >= CENTER_BOX.xMin &&
    nose.x <= CENTER_BOX.xMax &&
    nose.y >= CENTER_BOX.yMin &&
    nose.y <= CENTER_BOX.yMax
  );
}

/* =============================================
   FaceScanScreen
============================================= */
export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [step, setStep] = useState<Step>(0);
  const stepRef = useRef<Step>(0);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [progress, setProgress] = useState(0);
  const [stablePercent, setStablePercent] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const soundRef = useRef<HTMLAudioElement | null>(null);
  const stepLocked = useRef(false);
  const holdStart = useRef<number | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const camStopRef = useRef<() => void>(() => {});

  /* ---------- เปิดกล้อง + FaceMesh ---------- */
  useEffect(() => {
    soundRef.current = new Audio("/capture.mp3");

    const faceMesh = new FaceMesh({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    faceMesh.onResults((results: any) => {
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        holdStart.current = null;
        setStablePercent(0);
        setStatus("📍 วางหน้าให้อยู่ในกรอบกลางหน้าจอ");
        return;
      }

      const landmarks = results.multiFaceLandmarks[0];
      const { yaw, roll, nose } = estimatePose(landmarks);

      const s = stepRef.current;
      const target = TARGET_YAW[s];
      const tol = YAW_TOL[s];
      const yawOk = Math.abs(yaw - target) <= tol;
      const rollOk = Math.abs(roll) <= MAX_ROLL;
      const centerOk = isCentered(nose);

      if (!centerOk) setStatus("📍 ขยับหน้าให้อยู่กลางกรอบ");
      else if (!rollOk) setStatus("↕️ ปรับศีรษะให้ตรง");
      else if (!yawOk) {
        if (s === 0) setStatus("➡️ หันหน้าให้นิ่งตรงกล้อง");
        else if (s === 1) setStatus("⬅️ หันไปทางซ้ายเล็กน้อย");
        else setStatus("➡️ หันไปทางขวาเล็กน้อย");
      } else {
        setStatus(`✅ มุมถูกต้อง: ${STEPS[s]} — อยู่นิ่ง ๆ`);
      }

      const inTarget = yawOk && rollOk && centerOk;
      const now = performance.now();
      if (inTarget) {
        if (holdStart.current == null) holdStart.current = now;
        const elapsed = now - (holdStart.current ?? now);
        const pct = Math.min(100, Math.round((elapsed / STABLE_TIME) * 100));
        setStablePercent(pct);
      } else {
        holdStart.current = null;
        setStablePercent(0);
      }
    });

    faceMeshRef.current = faceMesh;
    const v = videoRef.current!;
    const cam = new Camera(v, {
      onFrame: async () => {
        await faceMesh.send({ image: v });
      },
      width: 640,
      height: 480,
    });
    cam.start();
    camStopRef.current = () => cam.stop();
    setStatus("🧭 วางหน้าให้อยู่ในกรอบกลางหน้าจอ");

    return () => {
      camStopRef.current?.();
      faceMeshRef.current = null;
    };
  }, []);

  /* ---------- เมื่ออยู่ครบเวลา ---------- */
  useEffect(() => {
    if (stablePercent >= 100 && !stepLocked.current) {
      stepLocked.current = true;
      soundRef.current?.play();
      captureThumb();

      setTimeout(() => {
        if (step < 2) {
          setStep((step + 1) as Step);
          holdStart.current = null;
          setStablePercent(0);
          stepLocked.current = false;
        } else {
          setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
          startAnalyze();
        }
      }, NEXT_DELAY);
    }
  }, [stablePercent]);

  /* ---------- ถ่ายรูป ---------- */
  function captureThumb() {
    const v = videoRef.current!;
    if (!v) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, c.width, c.height);
    setThumbs((t) => [...t, c.toDataURL("image/jpeg")]);
  }

  /* ---------- วิเคราะห์ ---------- */
  async function startAnalyze() {
    setIsAnalyzing(true);
    const blobs = await Promise.all(thumbs.map((t) => fetch(t).then((r) => r.blob())));
    const form = new FormData();
    blobs.forEach((b, i) => form.append("files", b, `angle_${i}.jpg`));
    const res = await fetch(`${API_BASE}/analyze/skin`, { method: "POST", body: form });
    const data = await res.json();

    let p = 0;
    const timer = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        onAnalyzeResult(data);
      }
    }, 70);
  }

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#031019] to-[#0A2233] relative overflow-hidden">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-40 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <StepIndicator step={step} />

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
        autoPlay
        muted
        playsInline
      />

      {/* กรอบสแกน + เลเซอร์ */}
      <ScanOverlay />

      {/* สถานะ */}
      <motion.div
        className="absolute top-20 w-full text-center z-30 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 text-cyan-100 px-5 py-3 rounded-2xl inline-block text-lg font-medium">
          {status}
        </div>
      </motion.div>

      {/* Progress bar */}
      {!isAnalyzing && (
        <div className="absolute bottom-24 w-full flex justify-center z-30">
          <div className="w-2/3">
            <Progress value={stablePercent} className="h-2" />
          </div>
        </div>
      )}

      {/* โหลด */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-white mb-6 text-xl font-semibold">
              🔬 กำลังวิเคราะห์ผิวของคุณ...
            </div>
            <Progress value={progress} className="h-3 w-3/4 mb-3" />
            <div className="text-cyan-300 text-lg">{progress}%</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ภาพทั้ง 3 มุม */}
      <div className="absolute bottom-8 w-full flex justify-center gap-4 z-30">
        {thumbs.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-20 h-20 object-cover rounded-full border-2 border-cyan-400 shadow-md"
          />
        ))}
      </div>
    </div>
  );
}
