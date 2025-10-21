import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Progress } from "../ui/progress";
import { X } from "lucide-react";

// === Mediapipe FaceMesh ===
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, FACEMESH_CONTOURS } from "@mediapipe/drawing_utils";

// =========================================
// CONFIG
// =========================================
interface FaceScanScreenProps {
  onAnalyzeResult: (result: any) => void;
  onBack: () => void;
}

const STEPS = ["หน้าตรง", "หันซ้าย", "หันขวา"] as const;
type Step = 0 | 1 | 2;

const STABLE_TIME = 3000; // ต้องนิ่ง 3 วิ
const NEXT_DELAY = 800; // เวลารอเปลี่ยนมุม
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://aishincarebackend-production.up.railway.app";

// =========================================
// COMPONENT
// =========================================
export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [step, setStep] = useState<Step>(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stablePercent, setStablePercent] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);

  const startStableTime = useRef<number | null>(null);
  const stepLocked = useRef(false);

  // =========================================
  // 🧠 ตั้งค่า Mediapipe FaceMesh
  // =========================================
  useEffect(() => {
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

    const camera = new Camera(videoRef.current!, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current! });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    setStatus(`📷 กรุณา${STEPS[0]}`);
  }, []);

  // =========================================
  // 🎨 วาดโครงหน้า + ตรวจมุม
  // =========================================
  function onResults(results: any) {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setFaceDetected(true);
      const landmarks = results.multiFaceLandmarks[0];

      // วาดเส้นรอบหน้า
      drawConnectors(ctx, landmarks, FACEMESH_CONTOURS, {
        color: "rgba(255,105,180,0.9)",
        lineWidth: 1.5,
      });

      // คำนวณมุม
      const left = landmarks[234];
      const right = landmarks[454];
      const nose = landmarks[1];
      const ratio = (nose.x - left.x) / (right.x - left.x);

      let pose = "front";
      if (ratio < 0.35) pose = "left";
      else if (ratio > 0.65) pose = "right";

      const target = step === 0 ? "front" : step === 1 ? "left" : "right";

      if (pose === target) {
        if (!startStableTime.current) startStableTime.current = Date.now();
        const elapsed = Date.now() - startStableTime.current;
        const percent = Math.min((elapsed / STABLE_TIME) * 100, 100);
        setStablePercent(percent);
        setStatus(`✅ ${STEPS[step]} ถูกต้อง (${(elapsed / 1000).toFixed(1)}s / 3s)`);

        if (elapsed >= STABLE_TIME && !stepLocked.current) {
          stepLocked.current = true;
          captureThumb();
          setStablePercent(0);
          setStatus(`📸 บันทึกภาพมุม ${STEPS[step]} แล้ว!`);

          setTimeout(() => {
            handleNextStep();
          }, 1000);
        }
      } else {
        startStableTime.current = null;
        setStablePercent(0);
        setStatus(`🟡 กรุณา${STEPS[step]}ให้ตรงมุม`);
      }
    } else {
      setFaceDetected(false);
      setStatus("🔍 ไม่พบใบหน้า กรุณาเข้าใกล้กล้อง");
      startStableTime.current = null;
      setStablePercent(0);
    }
  }

  // =========================================
  // ⏭️ ไปมุมต่อไป
  // =========================================
  async function handleNextStep() {
    if (step < 2) {
      const next = (step + 1) as Step;
      setStep(next);
      setStatus(`🟡 กรุณา${STEPS[next]}ให้ตรงมุม`);
      startStableTime.current = null;
      setStablePercent(0);
      stepLocked.current = false;
    } else {
      setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
      startAnalyze();
    }
  }

  // =========================================
  // 💾 บันทึกภาพ
  // =========================================
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

  // =========================================
  // 🔬 วิเคราะห์ผิว
  // =========================================
  async function startAnalyze() {
    setIsAnalyzing(true);
    const blobs = await Promise.all(
      thumbs.map((t) => fetch(t).then((r) => r.blob()))
    );
    const formData = new FormData();
    blobs.forEach((b, i) => formData.append("files", b, `angle_${i}.jpg`));

    const res = await fetch(`${API_BASE}/analyze/skin`, {
      method: "POST",
      body: formData,
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
    }, 80);
  }

  // =========================================
  // UI
  // =========================================
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Back */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Camera */}
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

      {/* Status */}
      <motion.div
        className="absolute top-20 w-full text-center z-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 text-white px-5 py-3 rounded-2xl inline-block text-lg font-medium">
          {status}
        </div>
      </motion.div>

      {/* Stable Progress */}
      {!isAnalyzing && stablePercent > 0 && (
        <div className="absolute bottom-24 w-full flex justify-center z-20">
          <div className="w-2/3">
            <Progress value={stablePercent} className="h-2" />
          </div>
        </div>
      )}

      {/* Analyze Overlay */}
      {isAnalyzing && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-white mb-6 text-xl font-semibold">
            🔬 กำลังวิเคราะห์ผิวของคุณ...
          </div>
          <Progress value={progress} className="h-3 w-3/4 mb-3" />
          <div className="text-pink-300 text-lg">{progress}%</div>
        </motion.div>
      )}

      {/* Thumbnails */}
      <div className="absolute bottom-8 w-full flex justify-center gap-4 z-10">
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
