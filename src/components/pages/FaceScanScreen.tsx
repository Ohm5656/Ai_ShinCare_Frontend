// src/components/pages/FaceScanScreen.tsx
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Progress } from "../ui/progress";
import { X } from "lucide-react";

// === Mediapipe FaceMesh ===
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import {
  drawConnectors,
  drawLandmarks,
} from "@mediapipe/drawing_utils";

// -----------------------------------------
// CONFIG
// -----------------------------------------
interface FaceScanScreenProps {
  onAnalyzeResult: (result: any) => void;
  onBack: () => void;
}

const STEPS = ["หน้าตรง", "หันซ้าย", "หันขวา"] as const;
type Step = 0 | 1 | 2;

const STABLE_TIME = 3000;   // ต้องนิ่ง 3 วิ
const NEXT_DELAY = 700;     // เวลาหน่วงก่อนเริ่มมุมถัดไป
const FACE_WIDTH_MIN = 0.28; // สัดส่วนความกว้างหน้าต่อเฟรมต่ำสุด (กันไกลไป)
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://aishincarebackend-production.up.railway.app";

// -----------------------------------------
// COMPONENT
// -----------------------------------------
export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UI state
  const [step, setStep] = useState<Step>(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stablePercent, setStablePercent] = useState(0);

  // control flags
  const startStableTime = useRef<number | null>(null);
  const stepLocked = useRef(false);                // กันถ่ายซ้ำ
  const capturedSteps = useRef<Set<number>>(new Set()); // กันมุมละหลายรูป
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  // =========================================
  // 🧠 Setup Mediapipe FaceMesh + Camera
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
    faceMeshRef.current = faceMesh;

    // กล้อง
    const v = videoRef.current!;
    const cam = new Camera(v, {
      onFrame: async () => {
        // ส่งภาพเข้า Mediapipe ทุกเฟรม
        await faceMesh.send({ image: v });
      },
      width: 640,
      height: 480,
    });
    cam.start();
    cameraRef.current = cam;

    setStatus(`📷 กรุณา${STEPS[0]}`);

    // cleanup
    return () => {
      try {
        cameraRef.current?.stop();
      } catch {}
      faceMeshRef.current?.close();
      faceMeshRef.current = null;
      cameraRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================
  // 🧪 ประเมินมุมจาก FaceMesh และวาด overlay
  // =========================================
  function onResults(results: any) {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    // sync ขนาด canvas กับวีดิโอจริง
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      // ไม่เจอหน้า → reset progress
      startStableTime.current = null;
      setStablePercent(0);
      setStatus("🔍 ไม่พบใบหน้า กรุณาขยับเข้าใกล้กล้อง");
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];

    // วาดโครงหน้า (สวย ๆ)
    drawConnectors(ctx, landmarks, FaceMesh.FACEMESH_TESSELATION, {
      color: "rgba(255,153,204,0.7)",
      lineWidth: 0.5,
    });
    drawLandmarks(ctx, landmarks, {
      color: "rgba(255,255,255,0.8)",
      lineWidth: 0.5,
      radius: 0.5,
    });

    // ===== คำนวณ "มุม" แบบง่ายจากตำแหน่ง landmark =====
    // ใช้หูซ้าย(234) หูขวา(454) และจมูก(1)
    const leftEar = landmarks[234];
    const rightEar = landmarks[454];
    const nose = landmarks[1];

    // กันเคสภาพเล็ก/หมุน — ใช้สัดส่วนแกน X (normalized 0..1)
    const faceWidth = Math.abs(rightEar.x - leftEar.x);
    if (faceWidth < FACE_WIDTH_MIN) {
      startStableTime.current = null;
      setStablePercent(0);
      setStatus("📏 กรุณาเข้าใกล้กล้องอีกนิด");
      return;
    }

    // ratio: ตำแหน่งจมูกเทียบกับเส้นหูซ้าย-ขวา
    const ratio = (nose.x - leftEar.x) / (rightEar.x - leftEar.x);

    let pose: "front" | "left" | "right" = "front";
    if (ratio < 0.35) pose = "left";
    else if (ratio > 0.65) pose = "right";

    const target: "front" | "left" | "right" =
      step === 0 ? "front" : step === 1 ? "left" : "right";

    // ===== ล็อกมุม: ต้องเป็นมุมเป้าหมายเท่านั้น =====
    if (pose === target) {
      if (!startStableTime.current) startStableTime.current = Date.now();
      const elapsed = Date.now() - startStableTime.current;
      setStablePercent(Math.min((elapsed / STABLE_TIME) * 100, 100));
      setStatus(`✅ ${STEPS[step]} ถูกต้อง (${(elapsed / 1000).toFixed(1)}s / 3s)`);

      // ครบเวลา และยังไม่เคย capture มุมนี้
      if (elapsed >= STABLE_TIME && !stepLocked.current && !capturedSteps.current.has(step)) {
        stepLocked.current = true; // กันถ่ายซ้ำทันที
        capturedSteps.current.add(step);

        captureThumb();           // บันทึกภาพเพียงครั้งเดียว
        setStablePercent(0);
        setStatus(`📸 บันทึกภาพมุม ${STEPS[step]} แล้ว!`);

        // ไปมุมถัดไป
        setTimeout(() => {
          handleNextStep();
        }, NEXT_DELAY);
      }
    } else {
      // ออกจากมุม → reset ตัวจับเวลา
      startStableTime.current = null;
      setStablePercent(0);
      setStatus(`🟡 กรุณา${STEPS[step]}ให้ตรงมุม`);
    }
  }

  // =========================================
  // ⏭️ ไปมุมต่อไป / เริ่มวิเคราะห์
  // =========================================
  function handleNextStep() {
    if (step < 2) {
      const next = (step + 1) as Step;
      setStep(next);
      setStatus(`🟡 กรุณา${STEPS[next]}ให้ตรงมุม`);
      startStableTime.current = null;
      setStablePercent(0);
      stepLocked.current = false; // ปลดล็อกเพื่อรอมุมใหม่
    } else {
      setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
      startAnalyze();
    }
  }

  // =========================================
  // 💾 บันทึกภาพจากกล้อง (มุมละ 1 รูป)
  // =========================================
  function captureThumb() {
    const v = videoRef.current!;
    if (!v || v.videoWidth === 0 || v.videoHeight === 0) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    // กล้องหน้า → mirror
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const dataURL = c.toDataURL("image/jpeg", 0.9);
    setThumbs((t) => {
      // safety: มุมละรูปเดียว
      if (t.length <= step) return [...t, dataURL];
      return t;
    });
  }

  // =========================================
  // 🔬 วิเคราะห์ผิว (ส่งรูป 3 มุม)
  // =========================================
  async function startAnalyze() {
    setIsAnalyzing(true);

    // dataURL -> Blob
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

    // fake progress สวย ๆ
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
      {/* FaceMesh overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          filter: "drop-shadow(0 0 10px rgba(255,105,180,0.6))",
        }}
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
