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
const API_BASE = import.meta.env.VITE_API_BASE || "https://aishincarebackend-production.up.railway.app";

export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const stableCounter = useRef(0);
  const rafId = useRef<number>(0);

  // ---------------------------
  // 📸 เปิดกล้องเมื่อ component โหลด
  // ---------------------------
  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus(`📷 กรุณา${STEPS[0]}`);
      loop();
    })();
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // ---------------------------
  // 📤 ดึง frame แล้วส่งไป backend
  // ---------------------------
  async function captureAndSend(): Promise<string> {
    const v = videoRef.current!;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(v, 0, 0, c.width, c.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      c.toBlob((b) => resolve(b), "image/jpeg", 0.8)
    );
    if (!blob) return "none";

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    const res = await fetch(`${API_BASE}/analyze/pose`, { method: "POST", body: formData });
    const data = await res.json();
    return data.pose || "none";
  }

  // ---------------------------
  // 🧠 Loop ตรวจมุมแบบเรียลไทม์
  // ---------------------------
  async function loop() {
    const pose = await captureAndSend();
    const target = step === 0 ? "front" : step === 1 ? "left" : "right";

    if (pose === target) {
      stableCounter.current++;
      setStatus(`✅ ${STEPS[step]} ถูกต้อง (${stableCounter.current}/${STABLE_FRAMES})`);
      if (stableCounter.current >= STABLE_FRAMES) {
        captureThumb();
        nextStep();
      }
    } else if (pose === "none") {
      setStatus("🔍 ไม่พบใบหน้า กรุณาเข้าใกล้หรือเพิ่มแสง");
      stableCounter.current = 0;
    } else {
      stableCounter.current = 0;
      setStatus(`🟡 กรุณา${STEPS[step]}ให้ตรงมุม (${pose})`);
    }

    rafId.current = requestAnimationFrame(loop);
  }

  // ---------------------------
  // 💾 บันทึกภาพเมื่อมุมนิ่ง
  // ---------------------------
  function captureThumb() {
    const v = videoRef.current!;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
    setThumbs((t) => [...t, c.toDataURL("image/jpeg")]);
  }

  // ---------------------------
  // ⏭️ ไปมุมต่อไป
  // ---------------------------
  function nextStep() {
    if (step < 2) {
      const next = (step + 1) as Step;
      setStep(next);
      setStatus(`✅ สำเร็จ ต่อไป: ${STEPS[next]}`);
      stableCounter.current = 0;
    } else {
      setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
      startAnalyze();
    }
  }

  // ---------------------------
  // 🧪 วิเคราะห์ผิว (ส่ง 3 ภาพ)
  // ---------------------------
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

  // ---------------------------
  // 🎨 UI
  // ---------------------------
  const borderColor =
    status.startsWith("✅") || status.startsWith("🎉")
      ? "border-green-400 shadow-[0_0_25px_rgba(34,197,94,0.7)]"
      : status.startsWith("🟡")
      ? "border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.6)]"
      : "border-pink-400 shadow-[0_0_25px_rgba(244,114,182,0.6)]";

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
        <div className={`w-72 h-96 rounded-full border-4 transition-all ${borderColor}`} />
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

      {/* Loading ขณะวิเคราะห์ */}
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

      {/* แสดงภาพ 3 มุม */}
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
