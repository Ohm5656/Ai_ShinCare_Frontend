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

// ต้องอยู่นิ่งในมุมที่ “ถูกต้อง” กี่ ms ถึงจะถ่าย
const STABLE_TIME = 2000; // 2 วิ
const NEXT_DELAY = 900;

// เป้าหมายมุม yaw ของแต่ละสเต็ป (องศา)
const TARGET_YAW = [0, +22, -22];
// ค่าความยอมให้คลาดเคลื่อนของแต่ละมุม (องศา)
const YAW_TOL = [10, 12, 12];

// เช็กไม่ให้เอียงศีรษะ (roll) เกินเท่าไร (องศา)
const MAX_ROLL = 12;

// กรอบกลางที่อยากให้จมูกอยู่ (normalize 0..1)
// เพื่อบังคับให้ผู้ใช้วางหน้า “อยู่ตรงกลาง” ด้วย
const CENTER_BOX = { xMin: 0.35, xMax: 0.65, yMin: 0.28, yMax: 0.72 };

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://aishincarebackend-production.up.railway.app";

/* =============================================
   โครงหน้า (GlowbieBell style) — overlay สวย ๆ (คงที่)
============================================= */
function FaceWireframeOverlay() {
  return (
    <svg
      viewBox="0 0 320 440"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[440px] pointer-events-none"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ff8ccf" />
        </radialGradient>
      </defs>

      {/* กรอบโครงหน้า */}
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
      {/* คิ้ว */}
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
      {/* ตา */}
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
      {/* จมูก */}
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
      {/* ปาก */}
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
      {/* คาง */}
      <path
        d="M140 320 C150 330,170 330,180 320"
        stroke="#ff9bd1"
        strokeWidth="1.4"
        fill="none"
        filter="url(#glow)"
      />

      {/* จุดไฮไลต์ */}
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
        <circle key={i} cx={x} cy={y} r="2.5" fill="url(#dotGrad)" filter="url(#glow)" />
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
   Utils: ประเมินมุมหัวจาก landmark ของ FaceMesh
   - yaw: หันหน้าไปซ้าย/ขวา (องศา, + ซ้าย / - ขวา)
   - roll: เอียงศีรษะ (องศา)
============================================= */
function estimatePose(landmarks: any[]) {
  // index จาก mediapipe
  const LEFT_EYE = 33;
  const RIGHT_EYE = 263;
  const NOSE_TIP = 1;

  const leftEye = landmarks[LEFT_EYE];
  const rightEye = landmarks[RIGHT_EYE];
  const nose = landmarks[NOSE_TIP];

  // ----- roll: มุมเส้นตาซ้าย-ขวา -----
  const dx = rightEye.x - leftEye.x;
  const dy = rightEye.y - leftEye.y;
  const roll = (Math.atan2(dy, dx) * 180) / Math.PI; // เอียงศีรษะ

  // ----- yaw: ใช้จมูกเทียบกับจุดกึ่งกลางตา -----
  const midX = (leftEye.x + rightEye.x) / 2;
  const yaw = (nose.x - midX) * -200; // scale ประมาณองศา (+ซ้าย / -ขวา)

  return { yaw, roll, nose };
}

// อยู่ตรงกลางพอไหม (กันคนหลุดกรอบ)
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
   FaceScanScreen Component
============================================= */
export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [step, setStep] = useState<Step>(0);
  const stepRef = useRef<Step>(0); // ให้ onResults เข้าถึงค่า step ล่าสุดเสมอ
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [progress, setProgress] = useState(0);
  const [stablePercent, setStablePercent] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const soundRef = useRef<HTMLAudioElement | null>(null);
  const stepLocked = useRef(false);          // กันถ่ายซ้ำเฟรมเดิม
  const holdStart = useRef<number | null>(null); // เวลาเริ่มจับได้ว่าอยู่ใน “มุมถูกต้อง”
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const camStopRef = useRef<() => void>(() => {});

  // ---------- เริ่มต้น FaceMesh และกล้อง (ครั้งเดียว) ----------
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
        // ไม่เห็นหน้า → รีเซ็ต
        holdStart.current = null;
        setStablePercent(0);
        setStatus("🧭 วางหน้าให้อยู่ในกรอบกลางหน้าจอ");
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

      // อัปเดตข้อความช่วยผู้ใช้
      if (!centerOk) setStatus("📍 ขยับหน้าให้อยู่กลางกรอบ");
      else if (!rollOk) setStatus("↕️ ปรับศีรษะไม่ให้เอียง");
      else if (!yawOk) {
        if (s === 0) setStatus("➡️ หันหน้าให้นิ่ง ๆ ตรงกล้อง");
        else if (s === 1) setStatus("⬅️ หันไปทางซ้ายเล็กน้อย");
        else setStatus("➡️ หันไปทางขวาเล็กน้อย");
      } else {
        setStatus(`✅ มุมถูกต้อง: ${STEPS[s]} — อยู่นิ่ง ๆ`);
      }

      // เงื่อนไขต้องครบ: กลาง + ไม่เอียง + มุมถูกต้อง
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

  // ---------- เมื่อความนิ่งครบ 100% → ถ่าย ----------
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

  // ---------- ถ่ายรูป ----------
  function captureThumb() {
    const v = videoRef.current!;
    if (!v) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    // กล้องหน้า: กลับภาพซ้ายขวาให้อ่านง่าย
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, c.width, c.height);
    setThumbs((t) => [...t, c.toDataURL("image/jpeg")]);
  }

  // ---------- วิเคราะห์ ----------
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

      {/* โครงหน้าแบบโปรโมชัน (คงที่เพื่อความสวย) */}
      <FaceWireframeOverlay />

      {/* วงรี glow pulse */}
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

      {/* สถานะคำแนะนำ */}
      <motion.div
        className="absolute top-20 w-full text-center z-30 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 text-white px-5 py-3 rounded-2xl inline-block text-lg font-medium">
          {status}
        </div>
      </motion.div>

      {/* แถบความนิ่ง */}
      {!isAnalyzing && (
        <div className="absolute bottom-24 w-full flex justify-center z-30">
          <div className="w-2/3">
            <Progress value={stablePercent} className="h-2" />
          </div>
        </div>
      )}

      {/* Overlay โหลดตอนวิเคราะห์ */}
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

      {/* แกลเลอรี 3 มุมที่ถ่ายได้ */}
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
