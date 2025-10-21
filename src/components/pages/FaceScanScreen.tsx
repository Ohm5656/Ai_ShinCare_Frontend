import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Progress } from "../ui/progress";
import { X, ArrowRight } from "lucide-react";

// === Mediapipe ===
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

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

/* --------------------------- Face Guide SVG overlay -------------------------- */
function FaceGuideSVG() {
  // วงรี + wireframe แบบ glow
  return (
    <svg
      viewBox="0 0 360 520"
      className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none w-[310px] h-[440px] drop-shadow-[0_0_18px_rgba(255,105,180,0.65)]"
    >
      <defs>
        <radialGradient id="g" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,105,180,0.25)" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* วงรีหลัก */}
      <ellipse
        cx="180"
        cy="260"
        rx="140"
        ry="210"
        fill="none"
        stroke="url(#g)"
        strokeWidth="3"
        filter="url(#glow)"
      />
      {/* เส้น Wireframe บาง ๆ ให้ฟีล GlowbieBell */}
      {[
        [40, 120, 320, 120],
        [20, 200, 340, 200],
        [40, 280, 320, 280],
        [60, 360, 300, 360],
      ].map((line, i) => (
        <line
          key={i}
          x1={line[0]}
          y1={line[1]}
          x2={line[2]}
          y2={line[3]}
          stroke="rgba(255,182,206,0.55)"
          strokeWidth="1"
        />
      ))}
      {/* จุด ๆ เรืองแสง */}
      {[...Array(26)].map((_, i) => (
        <circle
          key={i}
          cx={60 + (i % 13) * 20}
          cy={160 + Math.floor(i / 13) * 240}
          r="2.2"
          fill="rgba(255,255,255,0.85)"
        />
      ))}
    </svg>
  );
}

/* ------------------------------- Stepper UI -------------------------------- */
function AngleStepper({ step }: { step: Step }) {
  const labels = ["หน้าตรง", "หันซ้าย", "หันขวา"];
  return (
    <div className="absolute left-0 right-0 top-3 z-30 flex items-center justify-center gap-3">
      {labels.map((lb, idx) => {
        const active = idx === step;
        const done = idx < step;
        return (
          <div key={lb} className="flex items-center gap-3">
            <div
              className={[
                "w-14 h-14 rounded-full grid place-items-center border-2",
                done
                  ? "border-emerald-400 bg-emerald-400/10"
                  : active
                  ? "border-pink-400 bg-pink-400/10"
                  : "border-white/30",
              ].join(" ")}
            >
              <span
                className={[
                  "text-[11px] font-semibold",
                  done ? "text-emerald-300" : active ? "text-pink-200" : "text-white/70",
                ].join(" ")}
              >
                {lb}
              </span>
            </div>
            {idx < labels.length - 1 && (
              <motion.div
                className="text-white/60"
                initial={{ x: -6, opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.7 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------- Loading dot widget ---------------------------- */
function LoadingDots({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute bottom-28 left-0 right-0 z-20 flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-white/85"
          animate={{ y: [-2, 0, -2], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/* ================================ Main Page ================================ */
export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [step, setStep] = useState<Step>(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [progress, setProgress] = useState(0);
  const [stablePercent, setStablePercent] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startStableTime = useRef<number | null>(null);
  const stepLocked = useRef(false);
  const capturedSteps = useRef<Set<number>>(new Set());

  const soundRef = useRef<HTMLAudioElement | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  /* ------------------------------ init & dispose ------------------------------ */
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
    faceMesh.onResults(onResults);
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
    cameraRef.current = cam;

    setStatus("📸 กรุณาหน้าตรงให้อยู่ในกรอบ");

    return () => {
      cameraRef.current?.stop();
      faceMeshRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------ result handler ------------------------------ */
  function onResults(results: any) {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      startStableTime.current = null;
      setStablePercent(0);
      setStatus("🔍 ไม่พบใบหน้า • กรุณาวางหน้าให้อยู่ในกรอบกลางหน้าจอ");
      return;
    }

    const lm = results.multiFaceLandmarks[0];

    // mesh glow
    drawConnectors(ctx, lm, FaceMesh.FACEMESH_TESSELATION, {
      color: "rgba(255,153,204,0.35)",
      lineWidth: 0.5,
    });
    drawLandmarks(ctx, lm, {
      color: "rgba(255,255,255,0.7)",
      radius: 0.55,
    });

    // pose heuristic (ไม่ใช้ yaw)
    const left = lm[234];
    const right = lm[454];
    const nose = lm[1];
    const ratio = (nose.x - left.x) / (right.x - left.x);

    let pose: "front" | "left" | "right" = "front";
    if (ratio < 0.35) pose = "left";
    else if (ratio > 0.65) pose = "right";

    const target = step === 0 ? "front" : step === 1 ? "left" : "right";

    // ต้องอยู่กลางวงรี
    const faceCenterX = (left.x + right.x) / 2;
    const faceCenterY = (lm[10].y + lm[152].y) / 2;
    const inCenter =
      Math.abs(faceCenterX - 0.5) < 0.08 && Math.abs(faceCenterY - 0.5) < 0.12;

    if (!inCenter) {
      startStableTime.current = null;
      setStablePercent(0);
      setStatus("🧭 วางหน้าให้อยู่ในกรอบกลางหน้าจอ");
      return;
    }

    if (pose === target) {
      if (!startStableTime.current) startStableTime.current = Date.now();
      const elapsed = Date.now() - startStableTime.current;
      setStablePercent(Math.min((elapsed / STABLE_TIME) * 100, 100));

      const label =
        target === "front"
          ? "หน้าตรง"
          : target === "left"
          ? "หันซ้าย"
          : "หันขวา";
      setStatus(`✅ ${label} ถูกต้อง (${(elapsed / 1000).toFixed(1)}s / 3s)`);

      // ครบเวลาและยังไม่เคยถ่ายมุมนี้
      if (
        elapsed >= STABLE_TIME &&
        !stepLocked.current &&
        !capturedSteps.current.has(step)
      ) {
        stepLocked.current = true;
        capturedSteps.current.add(step);
        soundRef.current?.play();
        captureThumb();
        setStablePercent(0);
        setStatus(`📸 บันทึกภาพมุม ${label} แล้ว!`);

        setTimeout(() => handleNextStep(), NEXT_DELAY);
      }
    } else {
      startStableTime.current = null;
      setStablePercent(0);
      if (target === "left") setStatus("⬅️ กรุณาหันซ้ายช้า ๆ");
      else if (target === "right") setStatus("➡️ กรุณาหันขวาช้า ๆ");
      else setStatus("📸 กรุณามองตรงไปข้างหน้า");
    }
  }

  /* --------------------------------- steps --------------------------------- */
  function handleNextStep() {
    if (step < 2) {
      const next = (step + 1) as Step;
      setStep(next);
      startStableTime.current = null;
      setStablePercent(0);
      stepLocked.current = false;
      // แถบคำสั่งเลื่อน/แอนิเมชัน
      const nextTxt = next === 1 ? "หันซ้าย" : "หันขวา";
      setStatus(`🟡 เตรียม${nextTxt}...`);
    } else {
      setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
      startAnalyze();
    }
  }

  /* -------------------------------- capture -------------------------------- */
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

  /* ------------------------------- analyze API ------------------------------ */
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

  /* ----------------------------------- UI ---------------------------------- */
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-40 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* stepper + slide hint */}
      <AngleStepper step={step} />

      {/* video & mesh */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
        autoPlay
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: "drop-shadow(0 0 10px rgba(255,105,180,0.7))" }}
      />

      {/* face guide overlay */}
      <FaceGuideSVG />

      {/* glow pulse วงรีขอบ */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pink-400/70"
        style={{ width: 300, height: 420 }}
        animate={{ boxShadow: ["0 0 0px rgba(255,105,180,0.4)","0 0 28px rgba(255,105,180,0.85)","0 0 0px rgba(255,105,180,0.4)"] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />

      {/* status bubble */}
      <motion.div
        className="absolute top-20 w-full text-center z-30 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 text-white px-5 py-3 rounded-2xl inline-block text-lg font-medium">
          {status}
        </div>
      </motion.div>

      {/* loading dots ระหว่างจับเวลา หรือกำลังจัดท่าทาง */}
      <LoadingDots show={!isAnalyzing && !stepLocked.current} />

      {/* progress ตอนกำลังนิ่ง */}
      {!isAnalyzing && stablePercent > 0 && (
        <div className="absolute bottom-24 w-full flex justify-center z-30">
          <div className="w-2/3">
            <Progress value={stablePercent} className="h-2" />
          </div>
        </div>
      )}

      {/* overlay ตอนวิเคราะห์ */}
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

      {/* thumbs */}
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
