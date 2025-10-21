import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, HelpCircle } from "lucide-react";
import { Progress } from "../ui/progress";
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
const NEXT_DELAY = 1000;
const TARGET_YAW = [0, +22, -22];
const YAW_TOL = [10, 12, 12];
const MAX_ROLL = 12;
const CENTER_BOX = { xMin: 0.35, xMax: 0.65, yMin: 0.28, yMax: 0.72 };

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://aishincarebackend-production.up.railway.app";

/* =============================================
   MAIN COMPONENT
============================================= */
export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [step, setStep] = useState<Step>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stablePercent, setStablePercent] = useState(0);

  const holdStart = useRef<number | null>(null);
  const stepRef = useRef<Step>(0);
  const stepLocked = useRef(false);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { stepRef.current = step; }, [step]);

  /* ---------- setup Mediapipe ---------- */
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
      onFrame: async () => await faceMesh.send({ image: v }),
      width: 640,
      height: 480,
    });

    faceMesh.onResults((results: any) => {
      if (!results.multiFaceLandmarks?.length || isAnalyzing) return;
      const landmarks = results.multiFaceLandmarks[0];

      const LEFT_EYE = 33, RIGHT_EYE = 263, NOSE_TIP = 1;
      const leftEye = landmarks[LEFT_EYE];
      const rightEye = landmarks[RIGHT_EYE];
      const nose = landmarks[NOSE_TIP];
      const dx = rightEye.x - leftEye.x;
      const dy = rightEye.y - leftEye.y;
      const roll = (Math.atan2(dy, dx) * 180) / Math.PI;
      const midX = (leftEye.x + rightEye.x) / 2;
      const yaw = (nose.x - midX) * -200;

      const s = stepRef.current;
      const yawOk = Math.abs(yaw - TARGET_YAW[s]) <= YAW_TOL[s];
      const rollOk = Math.abs(roll) <= MAX_ROLL;
      const centerOk =
        nose &&
        nose.x >= CENTER_BOX.xMin &&
        nose.x <= CENTER_BOX.xMax &&
        nose.y >= CENTER_BOX.yMin &&
        nose.y <= CENTER_BOX.yMax;

      if (!centerOk) setStatus("📍 ขยับหน้าให้อยู่กลางกรอบ");
      else if (!rollOk) setStatus("↕️ ปรับศีรษะให้ตรง");
      else if (!yawOk) {
        if (s === 0) setStatus("➡️ หันหน้าให้นิ่งตรงกล้อง");
        else if (s === 1) setStatus("⬅️ หันไปทางซ้ายเล็กน้อย");
        else setStatus("➡️ หันไปทางขวาเล็กน้อย");
      } else setStatus(`✅ มุมถูกต้อง — ${STEPS[s]}`);

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
  }, [isAnalyzing]);

  /* ---------- ถ่ายภาพครบ ---------- */
  useEffect(() => {
    if (stablePercent >= 100 && !stepLocked.current) {
      stepLocked.current = true;
      soundRef.current?.play();
      const img = captureFrame();
      setThumbs((t) => [...t, img]);
      setTimeout(() => {
        if (step < 2) {
          setStep((step + 1) as Step);
          setStablePercent(0);
          holdStart.current = null;
          stepLocked.current = false;
        } else {
          setStatus("✨ ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์...");
          startAnalyze();
        }
      }, NEXT_DELAY);
    }
  }, [stablePercent]);

  /* ---------- ถ่ายภาพ ---------- */
  function captureFrame() {
    const v = videoRef.current!;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg");
  }

  /* ---------- เริ่มวิเคราะห์ ---------- */
  async function startAnalyze() {
    setIsAnalyzing(true);
    const blobs = await Promise.all(thumbs.map((t) => fetch(t).then((r) => r.blob())));
    const form = new FormData();
    blobs.forEach((b, i) => form.append("files", b, `angle_${i}.jpg`));

    const res = await fetch(`${API_BASE}/analyze/skin`, { method: "POST", body: form });
    const data = await res.json();

    let p = 0;
    const timer = setInterval(() => {
      p += 4;
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        onAnalyzeResult(data);
      }
    }, 100);
  }

  /* =============================================
     UI เหมือน Figma
  ============================================== */
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-[#070B13] to-[#111827] text-white">

      {/* กล้องแทนโครงหน้า */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-90"
        autoPlay
        muted
        playsInline
      />

      {/* กรอบ Figma Glow */}
      <motion.div
        className="relative w-[300px] h-[380px] rounded-3xl overflow-hidden flex items-center justify-center z-10"
        animate={{
          boxShadow: [
            "0 0 40px rgba(103,181,255,0.6)",
            "0 0 60px rgba(255,138,212,0.6)",
            "0 0 40px rgba(103,181,255,0.6)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="absolute inset-0 rounded-3xl border border-white/10 backdrop-blur-sm" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at center, rgba(255,138,212,0.2), transparent 70%)",
              "radial-gradient(circle at center, rgba(103,181,255,0.2), transparent 70%)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>

      {/* สถานะการสแกน */}
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-[calc(50%+240px)] text-center z-20"
      >
        <p className="px-6 py-2 rounded-full bg-white/10 border border-white/20 text-[#67B5FF] backdrop-blur-sm">
          {status}
        </p>
      </motion.div>

      {/* ปุ่ม “เริ่มวิเคราะห์ผิว” เหมือนใน Figma */}
      {!isAnalyzing && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-16 px-8 py-4 rounded-3xl bg-gradient-to-r from-pink-400 to-blue-400 font-semibold text-white shadow-lg z-20"
        >
          🔍 เริ่มวิเคราะห์ผิว
        </motion.button>
      )}

      {/* Progress ตอนวิเคราะห์ */}
      {isAnalyzing && (
        <motion.div
          className="absolute bottom-20 w-[85%] max-w-md px-6 py-5 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-pink-300 mb-3">✨ กำลังวิเคราะห์ผิวของคุณ...</div>
          <Progress
            value={progress}
            className="h-3 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-pink-300 [&>div]:to-purple-400"
          />
          <div className="text-center text-pink-400 mt-2">{progress}%</div>
        </motion.div>
      )}

      {/* ปุ่มกลับ & ช่วยเหลือ */}
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-md"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="absolute bottom-10 left-6 z-30">
        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
          <HelpCircle className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
