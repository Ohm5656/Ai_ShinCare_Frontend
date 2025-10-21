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

const STABLE_TIME = 3000;
const NEXT_DELAY = 900;

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://aishincarebackend-production.up.railway.app";

/* =============================================
   โครงหน้า (GlowbieBell style)
============================================= */
function FaceWireframeOverlay() {
  return (
    <svg
      viewBox="0 0 320 440"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[440px] pointer-events-none"
    >
      <defs>
        {/* เอฟเฟกต์เรืองแสง */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ไล่สีจุด */}
        <radialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ff8ccf" />
        </radialGradient>
      </defs>

      {/* === กรอบโครงหน้า === */}
      <path
        d="M60 170 L75 210 90 240 108 270 125 300 140 325 
           L160 340 L180 325 195 300 212 270 230 240 245 210 L260 170 
           C255 130 215 80 160 70 
           C105 80 65 130 60 170 Z"
        stroke="#ff9bcf"
        strokeWidth="1.6"
        fill="none"
        filter="url(#glow)"
      />

      {/* === คิ้ว === */}
      <path
        d="M90 150 C115 130,135 130,155 150"
        stroke="#ffc1e0"
        strokeWidth="1.4"
        fill="none"
        filter="url(#glow)"
      />
      <path
        d="M165 150 C185 130,205 130,230 150"
        stroke="#ffc1e0"
        strokeWidth="1.4"
        fill="none"
        filter="url(#glow)"
      />

      {/* === ดวงตา === */}
      <path
        d="M105 175 C120 168,135 168,145 175 C135 182,120 182,105 175 Z"
        stroke="#ffd0e8"
        strokeWidth="1.2"
        fill="none"
        filter="url(#glow)"
      />
      <path
        d="M175 175 C190 168,205 168,220 175 C205 182,190 182,175 175 Z"
        stroke="#ffd0e8"
        strokeWidth="1.2"
        fill="none"
        filter="url(#glow)"
      />

      {/* === จมูก === */}
      <path
        d="M160 150 L160 210"
        stroke="#ffb6db"
        strokeWidth="1.3"
        fill="none"
        filter="url(#glow)"
      />
      <path
        d="M145 220 C155 225,165 225,175 220"
        stroke="#ffd5eb"
        strokeWidth="1.2"
        fill="none"
        filter="url(#glow)"
      />

      {/* === ปาก === */}
      <path
        d="M125 265 C145 280,175 280,195 265"
        stroke="#ffa5d4"
        strokeWidth="1.5"
        fill="none"
        filter="url(#glow)"
      />
      <path
        d="M130 260 C150 270,170 270,190 260"
        stroke="#ffd2e6"
        strokeWidth="1.2"
        fill="none"
        filter="url(#glow)"
      />

      {/* === คาง === */}
      <path
        d="M140 320 C150 330,170 330,180 320"
        stroke="#ff9bd1"
        strokeWidth="1.4"
        fill="none"
        filter="url(#glow)"
      />

      {/* === จุด (landmarks) === */}
      {[
        [60, 170],
        [260, 170],
        [160, 70],
        [105, 175],
        [220, 175],
        [160, 210],
        [125, 265],
        [195, 265],
        [160, 340],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2.5"
          fill="url(#dotGrad)"
          filter="url(#glow)"
        />
      ))}
    </svg>
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
                active ? "border-pink-400 bg-pink-400/10" : "border-white/30"
              }`}
            >
              <span
                className={`text-[11px] font-semibold ${
                  active ? "text-pink-200" : "text-white/70"
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
   FaceScanScreen Component
============================================= */
export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [progress, setProgress] = useState(0);
  const [stablePercent, setStablePercent] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const soundRef = useRef<HTMLAudioElement | null>(null);
  const startStableTime = useRef<number | null>(null);
  const stepLocked = useRef(false);

  // 🔹 เริ่มต้น FaceMesh และกล้อง
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
    const v = videoRef.current!;
    const cam = new Camera(v, {
      onFrame: async () => {
        await faceMesh.send({ image: v });
      },
      width: 640,
      height: 480,
    });
    cam.start();
    setStatus("🧭 วางหน้าให้อยู่ในกรอบกลางหน้าจอ");
  }, []);

  // 🔹 จำลองการคงนิ่งของหน้า
  useEffect(() => {
    const timer = setInterval(() => {
      setStablePercent((p) => (p < 100 ? p + 5 : 100));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // 🔹 เมื่อคงนิ่งครบ 100% → ถ่ายภาพ
  useEffect(() => {
    if (stablePercent >= 100 && !stepLocked.current) {
      stepLocked.current = true;
      soundRef.current?.play();
      captureThumb();
      setTimeout(() => {
        if (step < 2) {
          setStep((step + 1) as Step);
          stepLocked.current = false;
          setStablePercent(0);
        } else {
          setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
          startAnalyze();
        }
      }, NEXT_DELAY);
    }
  }, [stablePercent]);

  // 🔹 ฟังก์ชันถ่ายภาพ
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

  // 🔹 ฟังก์ชันวิเคราะห์ภาพ
  async function startAnalyze() {
    setIsAnalyzing(true);
    const blobs = await Promise.all(
      thumbs.map((t) => fetch(t).then((r) => r.blob()))
    );
    const form = new FormData();
    blobs.forEach((b, i) => form.append("files", b, `angle_${i}.jpg`));
    const res = await fetch(`${API_BASE}/analyze/skin`, {
      method: "POST",
      body: form,
    });
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

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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

      {/* 🔹 โครงหน้า GlowbieBell */}
      <FaceWireframeOverlay />

      {/* 🔹 วงรี glow pulse */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pink-400/70"
        style={{ width: 300, height: 420 }}
        animate={{
          boxShadow: [
            "0 0 0px rgba(255,105,180,0.4)",
            "0 0 28px rgba(255,105,180,0.85)",
            "0 0 0px rgba(255,105,180,0.4)",
          ],
        }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />

      {/* 🔹 สถานะข้อความ */}
      <motion.div
        className="absolute top-20 w-full text-center z-30 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 text-white px-5 py-3 rounded-2xl inline-block text-lg font-medium">
          {status}
        </div>
      </motion.div>

      {/* 🔹 แถบความนิ่ง */}
      {!isAnalyzing && stablePercent > 0 && (
        <div className="absolute bottom-24 w-full flex justify-center z-30">
          <div className="w-2/3">
            <Progress value={stablePercent} className="h-2" />
          </div>
        </div>
      )}

      {/* 🔹 หน้าจอโหลดตอนวิเคราะห์ */}
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
            <div className="text-pink-300 text-lg">{progress}%</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 แสดงภาพที่ถ่ายครบทั้งสามมุม */}
      <div className="absolute bottom-8 w-full flex justify-center gap-4 z-30">
        {thumbs.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-20 h-20 object-cover rounded-full border-2 border-pink-400 shadow-md"
          />
        ))}
      </div>
    </div>
  );
}
