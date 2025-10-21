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

const STABLE_TIME = 2000;
const NEXT_DELAY = 900;
const TARGET_YAW = [0, +22, -22];
const YAW_TOL = [10, 12, 12];
const MAX_ROLL = 12;
const CENTER_BOX = { xMin: 0.35, xMax: 0.65, yMin: 0.28, yMax: 0.72 };

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://aishincarebackend-production.up.railway.app";

/* =============================================
   Pastel Face Scan Overlay (วงรีเรืองแสง + เส้นสแกน)
============================================= */
function PastelScanOverlay() {
  return (
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
      {/* วงรีกรอบเรืองแสง */}
      <motion.div
        className="absolute rounded-[140px] border-[3px] border-transparent"
        style={{
          width: 300,
          height: 400,
          background:
            "linear-gradient(180deg, rgba(255,192,243,0.8) 0%, rgba(195,156,255,0.8) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        animate={{
          boxShadow: [
            "0 0 0px rgba(255,150,200,0.4)",
            "0 0 25px rgba(255,180,240,0.8)",
            "0 0 0px rgba(255,150,200,0.4)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* เส้น pulse วิ่งขึ้นลง */}
      <motion.div
        className="absolute w-[260px] h-[4px] rounded-full blur-[2px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,180,230,0.8), rgba(200,160,255,0.8))",
        }}
        initial={{ y: -160 }}
        animate={{ y: [160, -160] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* =============================================
   Step Indicator (โทนชมพู)
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
              className={`w-14 h-14 rounded-full grid place-items-center border-[2.5px] ${
                active
                  ? "border-pink-400 bg-pink-200/10"
                  : "border-pink-200/40"
              }`}
            >
              <span
                className={`text-[11px] font-medium ${
                  active ? "text-pink-400" : "text-gray-400"
                }`}
              >
                {lb}
              </span>
            </div>
            {i < 2 && <ArrowRight className="w-4 h-4 text-pink-300" />}
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
   FaceScanScreen (Pastel GlowbieBell style)
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

  /* ---------- เริ่มต้น FaceMesh ---------- */
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

    faceMesh.onResults((results: any) => {
      if (!results.multiFaceLandmarks?.length) {
        setStatus("📍 ขยับหน้าให้อยู่กลางกรอบ");
        holdStart.current = null;
        setStablePercent(0);
        return;
      }

      const { yaw, roll, nose } = estimatePose(results.multiFaceLandmarks[0]);
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
      } else setStatus(`✅ มุมถูกต้อง: ${STEPS[s]} — อยู่นิ่ง ๆ`);

      const inTarget = yawOk && rollOk && centerOk;
      const now = performance.now();
      if (inTarget) {
        if (!holdStart.current) holdStart.current = now;
        const pct = Math.min(100, ((now - holdStart.current) / STABLE_TIME) * 100);
        setStablePercent(Math.round(pct));
      } else {
        holdStart.current = null;
        setStablePercent(0);
      }
    });

    cam.start();
    return () => cam.stop();
  }, []);

  /* ---------- ถ่ายภาพเมื่อครบ ---------- */
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
          setStatus("✨ ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
          startAnalyze();
        }
      }, NEXT_DELAY);
    }
  }, [stablePercent]);

  /* ---------- ถ่ายภาพ ---------- */
  function captureThumb() {
    const v = videoRef.current!;
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
    <div className="min-h-screen bg-gradient-to-b from-[#fff7fb] to-[#fff0f8] relative overflow-hidden">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-40 w-10 h-10 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
      >
        <X className="w-6 h-6 text-pink-400" />
      </button>

      <StepIndicator step={step} />

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 rounded-[30px]"
        autoPlay
        muted
        playsInline
      />

      {/* Pastel Scan Overlay */}
      <PastelScanOverlay />

      {/* สถานะ */}
      <motion.div
        className="absolute top-20 w-full text-center z-30 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-white/60 backdrop-blur-md text-pink-500 px-5 py-3 rounded-2xl inline-block text-lg font-medium shadow">
          {status}
        </div>
      </motion.div>

      {/* Progress bar */}
      {!isAnalyzing && (
        <div className="absolute bottom-24 w-full flex justify-center z-30">
          <div className="w-2/3">
            <Progress
              value={stablePercent}
              className="h-3 bg-pink-100 [&>div]:bg-gradient-to-r [&>div]:from-pink-300 [&>div]:to-purple-300"
            />
          </div>
        </div>
      )}

      {/* โหลด */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-pink-500 mb-6 text-xl font-semibold">
              ✨ กำลังวิเคราะห์ผิวของคุณ...
            </div>
            <Progress
              value={progress}
              className="h-3 w-3/4 mb-3 bg-pink-100 [&>div]:bg-gradient-to-r [&>div]:from-pink-300 [&>div]:to-purple-300"
            />
            <div className="text-pink-400 text-lg">{progress}%</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ภาพทั้ง 3 มุม */}
      <div className="absolute bottom-8 w-full flex justify-center gap-4 z-30">
        {thumbs.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-20 h-20 object-cover rounded-full border-2 border-pink-300 shadow-md"
          />
        ))}
      </div>
    </div>
  );
}
