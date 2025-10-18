import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Progress } from "../ui/progress";
import { X } from "lucide-react";
import { initFaceLandmarker, estimate, computeHeadPoseFromLandmarks } from "../../lib/pose";

interface FaceScanScreenProps {
  onAnalyze: () => void;
  onBack: () => void;
}

const STEPS = ["หน้าตรง", "หันซ้าย", "หันขวา"] as const;
type Step = 0 | 1 | 2;

const YAW_OK = 10;
const YAW_LEFT = 20;
const YAW_RIGHT = -20;
const PITCH_OK = 12;
const STABLE_FRAMES = 8;

export function FaceScanScreen({ onAnalyze, onBack }: FaceScanScreenProps) {
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

  function classify(yaw: number, pitch: number) {
    if (Math.abs(pitch) > PITCH_OK) return "bad";
    if (Math.abs(yaw) <= YAW_OK) return "front";
    if (yaw >= YAW_LEFT) return "left";
    if (yaw <= YAW_RIGHT) return "right";
    return "bad";
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
      setStep((s) => (s + 1) as Step);
      setStatus(`✅ ถ่ายสำเร็จ ต่อไป: ${STEPS[step + 1]}`);
      stableCounter.current = 0;
    } else {
      // ครบ 3 มุมแล้ว → เริ่มวิเคราะห์อัตโนมัติ
      setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิวของคุณ...");
      startAnalyze();
    }
  }

  async function loop() {
    const v = videoRef.current;
    if (!v) return;

    const result = await estimate(v);
    const pose = computeHeadPoseFromLandmarks(result);

    if (pose) {
      const { yaw, pitch } = pose;
      const target = step === 0 ? "front" : step === 1 ? "left" : "right";
      const got = classify(yaw, pitch);

      if (got === target) {
        stableCounter.current++;
        setStatus(`✅ ${STEPS[step]} ถูกต้อง (นิ่งอีก ${STABLE_FRAMES - stableCounter.current})`);
        if (stableCounter.current >= STABLE_FRAMES) {
          captureThumb();
          nextStep();
        }
      } else {
        stableCounter.current = 0;
        setStatus(`🟡 กรุณา${STEPS[step]}ให้ตรงมุม`);
      }
    } else {
      setStatus("🔍 ไม่พบใบหน้า กรุณาเข้าใกล้/เพิ่มแสง");
    }

    rafId.current = requestAnimationFrame(loop);
  }

  /** เริ่มวิเคราะห์อัตโนมัติ */
  function startAnalyze() {
    setIsAnalyzing(true);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          onAnalyze();
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

      {/* แสดงภาพที่ถ่ายได้ (แค่ 3 มุม) */}
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
