import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Progress } from "../ui/progress";
import { X } from "lucide-react";

interface FaceScanScreenProps {
  onAnalyzeResult: (result: any) => void;
  onBack: () => void;
}

const STEPS = ["หน้าตรง", "หันซ้าย", "หันขวา"] as const;
type Step = 0 | 1 | 2;
const STABLE_FRAMES = 8;
const CAPTURE_INTERVAL = 500; // 0.5 วิ
const API_BASE = import.meta.env.VITE_API_BASE || "https://aishincarebackend-production.up.railway.app";

export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [faceOk, setFaceOk] = useState(false);
  const [lightOk, setLightOk] = useState(true);
  const stableCounter = useRef(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus(`📷 กรุณา${STEPS[0]}`);
      timerRef.current = setInterval(loop, CAPTURE_INTERVAL);
    })();
    return () => clearInterval(timerRef.current);
  }, []);

  async function captureFrame(): Promise<Blob | null> {
    const v = videoRef.current!;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    return await new Promise((resolve) => c.toBlob((b) => resolve(b), "image/jpeg", 0.8));
  }

  async function loop() {
    const blob = await captureFrame();
    if (!blob) return;
    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    const res = await fetch(`${API_BASE}/analyze/pose`, { method: "POST", body: formData });
    const data = await res.json();
    const pose = data.pose;
    const target = step === 0 ? "front" : step === 1 ? "left" : "right";

    setFaceOk(data.face_ok);
    setLightOk(data.light_ok);

    if (!data.face_ok) {
      setStatus("🔍 ไม่พบใบหน้า กรุณาเข้าใกล้หรือเพิ่มแสง");
      stableCounter.current = 0;
      return;
    }
    if (!data.light_ok) {
      setStatus("💡 แสงน้อยเกินไป กรุณาเพิ่มแสง");
      stableCounter.current = 0;
      return;
    }

    if (pose === target) {
      stableCounter.current++;
      setStatus(`✅ ${STEPS[step]} ถูกต้อง (${stableCounter.current}/${STABLE_FRAMES})`);
      if (stableCounter.current >= STABLE_FRAMES) {
        captureThumb();
        nextStep();
      }
    } else {
      stableCounter.current = 0;
      setStatus(`🟡 กรุณา${STEPS[step]}ให้ตรงมุม (${pose})`);
    }
  }

  function captureThumb() {
    const v = videoRef.current!;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
    setThumbs((t) => [...t, c.toDataURL("image/jpeg")]);
  }

  function nextStep() {
    if (step < 2) {
      const next = (step + 1) as Step;
      setStep(next);
      setStatus(`✅ สำเร็จ ต่อไป: ${STEPS[next]}`);
      stableCounter.current = 0;
    } else {
      setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
      clearInterval(timerRef.current);
      startAnalyze();
    }
  }

  async function startAnalyze() {
    setIsAnalyzing(true);
    const blobs = await Promise.all(thumbs.map((t) => fetch(t).then((r) => r.blob())));
    const formData = new FormData();
    blobs.forEach((b) => formData.append("files", b, "angle.jpg"));
    const res = await fetch(`${API_BASE}/analyze/skin`, { method: "POST", body: formData });
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

  const borderColor = !faceOk
    ? "border-pink-300" // ไม่เจอหน้า
    : lightOk
    ? "border-pink-500 shadow-[0_0_25px_rgba(244,114,182,0.8)]" // เจอหน้า แสงโอเค → เข้ม
    : "border-yellow-400"; // แสงน้อย

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted playsInline />

      {/* วงรีจับหน้า */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-72 h-96 rounded-full border-4 transition-all duration-150 ${borderColor}`} />
      </div>

      <motion.div
        className="absolute top-20 w-full text-center z-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 text-white px-5 py-3 rounded-2xl inline-block text-lg font-medium">
          {status}
        </div>
      </motion.div>

      {isAnalyzing && (
        <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
          <div className="text-white mb-6 text-xl font-semibold">🔬 กำลังวิเคราะห์ผิวของคุณ...</div>
          <Progress value={progress} className="h-3 w-3/4 mb-3" />
          <div className="text-pink-300 text-lg">{progress}%</div>
        </motion.div>
      )}

      {/* แสดงภาพที่ถ่ายได้ */}
      <div className="absolute bottom-8 w-full flex justify-center gap-4 z-10">
        {thumbs.map((img, i) => (
          <img key={i} src={img} className="w-20 h-20 object-cover rounded-full border-2 border-pink-400 shadow-md" />
        ))}
      </div>
    </div>
  );
}
