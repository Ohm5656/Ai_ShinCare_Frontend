import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Progress } from "../ui/progress";
import { X } from "lucide-react";
import { initFaceLandmarker, estimate, computeHeadPoseFromLandmarks } from "../../lib/pose";

interface FaceScanScreenProps {
  onAnalyzeResult: (result: any) => void; // รับผลลัพธ์วิเคราะห์ผิวจาก backend
  onBack: () => void;
}

const STEPS = ["หน้าตรง", "หันซ้าย", "หันขวา"] as const;
type Step = 0 | 1 | 2;

const STABLE_FRAMES = 8; // ต้องนิ่งกี่เฟรมก่อนถ่าย
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000"; // ✅ URL backend

export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("กำลังโหลดโมเดล...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const stableCounter = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    (async () => {
      await initFaceLandmarker();
      await startCamera();
      setStatus(`📷 กรุณา${STEPS[0]}`);
      loop();
    })();
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  }

  /** แปลง frame จากกล้องเป็น blob เพื่อส่งไป backend */
  function captureFrame(): Promise<Blob> {
    return new Promise((resolve) => {
      const v = videoRef.current!;
      const c = document.createElement("canvas");
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(v, 0, 0, c.width, c.height);
      c.toBlob((blob) => blob && resolve(blob), "image/jpeg");
    });
  }

  /** ส่ง frame ไปให้ backend วิเคราะห์มุม */
  async function checkPoseBackend(blob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");
    const res = await fetch(`${API_BASE}/scan/pose`, { method: "POST", body: formData });
    const data = await res.json();
    return data.pose || "unknown";
  }

  /** เก็บภาพมุมที่ถูกต้องไว้ */
  function captureThumb() {
    const v = videoRef.current!;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
    setThumbs((t) => [...t, c.toDataURL("image/jpeg")]);
  }

  /** ไปมุมต่อไป */
  function nextStep() {
    if (step < 2) {
      const next = (step + 1) as Step;
      setStep(next);
      setStatus(`✅ สำเร็จ ต่อไป: ${STEPS[next]}`);
      stableCounter.current = 0;
    } else {
      setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิวของคุณ...");
      startAnalyze();
    }
  }

  /** Loop ตรวจจับแบบเรียลไทม์ */
  async function loop() {
    const v = videoRef.current;
    if (!v) return;

    // ดึงภาพออกมาและส่งให้ backend ตรวจมุม
    const blob = await captureFrame();
    const detectedPose = await checkPoseBackend(blob);

    const target = step === 0 ? "front" : step === 1 ? "left" : "right";

    if (detectedPose === target) {
      stableCounter.current++;
      setStatus(`✅ ${STEPS[step]} ถูกต้อง (นิ่งอีก ${STABLE_FRAMES - stableCounter.current})`);
      if (stableCounter.current >= STABLE_FRAMES) {
        captureThumb();
        nextStep();
      }
    } else if (detectedPose === "none") {
      setStatus("🔍 ไม่พบใบหน้า กรุณาเข้าใกล้/เพิ่มแสง");
      stableCounter.current = 0;
    } else {
      stableCounter.current = 0;
      setStatus(`🟡 กรุณา${STEPS[step]}ให้ตรงมุม (${detectedPose})`);
    }

    rafId.current = requestAnimationFrame(loop);
  }

  /** เมื่อครบ 3 มุมแล้ว → ส่งภาพทั้งหมดให้ backend วิเคราะห์ผิว */
  async function startAnalyze() {
    setIsAnalyzing(true);
    setProgress(0);

    const blobs = await Promise.all(
      thumbs.map((t) =>
        fetch(t).then((r) => r.blob())
      )
    );

    const formData = new FormData();
    blobs.forEach((b) => formData.append("files", b, "angle.jpg"));

    const res = await fetch(`${API_BASE}/scan/analyze`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    // โหลด progress animation สวย ๆ
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          onAnalyzeResult(data);
          return 100;
        }
        return p + 5;
      });
    }, 80);
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* กล้อง */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* วงรีจับหน้า */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-72 h-96 rounded-full border-4 transition-colors duration-150 ${
            status.startsWith("✅") || status.startsWith("🎉")
              ? "border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.7)]"
              : status.startsWith("🟡")
              ? "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]"
              : "border-pink-400 shadow-[0_0_30px_rgba(244,114,182,0.6)]"
          }`}
        />
      </div>

      {/* ข้อความสถานะ */}
      <motion.div
        className="absolute top-20 w-full text-center z-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 text-white px-5 py-3 rounded-2xl inline-block text-lg font-medium">
          {status}
        </div>
      </motion.div>

      {/* กรณีกำลังวิเคราะห์ */}
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

      {/* แสดงภาพที่ถ่ายได้ */}
      <div className="absolute bottom-8 w-full flex justify-center gap-4 z-10">
        {thumbs.slice(0, 3).map((img, i) => (
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
