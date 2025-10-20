import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Progress } from "../ui/progress";
import { X } from "lucide-react";

// =========================================
// CONFIG
// =========================================
interface FaceScanScreenProps {
  onAnalyzeResult: (result: any) => void;
  onBack: () => void;
}

const STEPS = ["หน้าตรง", "หันซ้าย", "หันขวา"] as const;
type Step = 0 | 1 | 2;

const STABLE_TIME = 3000;      // ต้องนิ่งกี่มิลลิวินาที (3 วิ)
const CAPTURE_INTERVAL = 500;  // จับภาพทุก 0.5 วิ

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://aishincarebackend-production.up.railway.app";

// =========================================
// COMPONENT
// =========================================
export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // UI state
  const [step, setStep] = useState<Step>(0);       // 0=front, 1=left, 2=right
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stablePercent, setStablePercent] = useState(0);

  // pose/lighting indicators
  const [faceOk, setFaceOk] = useState(false);
  const [lightOk, setLightOk] = useState(true);

  // control flags (สำคัญที่สุด)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startStableTime = useRef<number | null>(null); // เวลาที่เริ่มนิ่ง
  const loopRunning = useRef(false);                   // กัน loop ซ้อน (fetch ซ้อน)
  const stepLocked  = useRef(false);                   // กันบันทึกซ้ำ (หลังครบเวลา)

  // ========== เปิดกล้อง + เริ่ม loop ==========
  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus(`📷 กรุณา${STEPS[0]}`);
      timerRef.current = setInterval(loop, CAPTURE_INTERVAL);
    })();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ========== ดึงภาพจากกล้องเป็น Blob ==========
  async function captureFrame(): Promise<Blob | null> {
    const v = videoRef.current!;
    if (!v || v.videoWidth === 0 || v.videoHeight === 0) return null;

    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    // กระจก (mirror) ให้เหมือนกล้องหน้า
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, c.width, c.height);

    return await new Promise((resolve) =>
      c.toBlob((b) => resolve(b), "image/jpeg", 0.8)
    );
  }

  // ========== LOOP ตรวจมุมแบบเรียลไทม์ (กันซ้อน/กันซ้ำ) ==========
  async function loop() {
    // ถ้ากำลังรอ/ถ่าย/เปลี่ยนมุมอยู่ → อย่ารันซ้ำ
    if (loopRunning.current || stepLocked.current) return;
    loopRunning.current = true;

    const blob = await captureFrame();
    if (!blob) {
      loopRunning.current = false;
      return;
    }

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await fetch(`${API_BASE}/analyze/pose`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      // normalize pose
      let pose = "";
      if (Array.isArray(data.pose)) pose = String(data.pose[0]).trim().toLowerCase();
      else if (typeof data.pose === "string")
        pose = data.pose.split(",")[0].replace(/[\(\)']/g, "").trim().toLowerCase();

      const target = step === 0 ? "front" : step === 1 ? "left" : "right";

      // update indicators
      setFaceOk(!!data.face_ok);
      setLightOk(!!data.light_ok);

      // guard: ไม่เจอหน้า/แสงไม่พอ → reset เวลาและ progress
      if (!data.face_ok) {
        setStatus("🔍 ไม่พบใบหน้า กรุณาเข้าใกล้หรือเพิ่มแสง");
        startStableTime.current = null;
        setStablePercent(0);
        loopRunning.current = false;
        return;
      }
      if (!data.light_ok) {
        setStatus("💡 แสงน้อยเกินไป กรุณาเพิ่มแสง");
        startStableTime.current = null;
        setStablePercent(0);
        loopRunning.current = false;
        return;
      }

      // ตรงมุมที่ต้องการ
      if (pose === target) {
        if (!startStableTime.current) startStableTime.current = Date.now();

        const elapsed = Date.now() - startStableTime.current;
        setStablePercent(Math.min((elapsed / STABLE_TIME) * 100, 100));
        setStatus(`✅ ${STEPS[step]} ถูกต้อง (${(elapsed / 1000).toFixed(1)}s / ${STABLE_TIME / 1000}s)`);

        // ครบเวลานิ่ง → บันทึก
        if (elapsed >= STABLE_TIME) {
          // ถ้ายังล็อกอยู่ (รอบเก่ากลับมา) ให้หยุดเลย
          if (stepLocked.current) {
            loopRunning.current = false;
            return;
          }

          // 🔒 ล็อกทุกอย่างก่อนบันทึก
          stepLocked.current = true;
          loopRunning.current = true;
          startStableTime.current = null;

          // หยุด loop เดิมทุกรอบ
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          // บันทึกภาพ + reset progress
          captureThumb();
          setStablePercent(0);
          setStatus(`📸 บันทึกภาพมุม ${STEPS[step]} แล้ว!`);

          // หน่วงให้เห็นข้อความ 1.2 วิ แล้วไปมุมใหม่
          setTimeout(() => {
            nextStep();

            // ปลดล็อกและเริ่ม loop ใหม่เฉพาะมุมใหม่
            stepLocked.current = false;
            loopRunning.current = false;

            if (!timerRef.current) {
              timerRef.current = setInterval(loop, CAPTURE_INTERVAL);
            }
          }, 1200);
        }
      } else {
        // มุมไม่ตรง → reset timer & progress
        startStableTime.current = null;
        setStablePercent(0);
        setStatus(`🟡 กรุณา${STEPS[step]}ให้ตรงมุม (ตอนนี้คือ: ${pose || "ไม่พบ"})`);
      }
    } catch (err) {
      console.error("Pose analyze failed:", err);
    }

    loopRunning.current = false;
  }

  // ========== บันทึกภาพ (แปลงเป็น dataURL เก็บใน thumbs) ==========
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

  // ========== ไปมุมต่อไป / ครบ 3 มุมแล้วเริ่มวิเคราะห์ ==========
  function nextStep() {
    if (step < 2) {
      const next = (step + 1) as Step;
      setStep(next);
      setStatus(`✅ สำเร็จ ต่อไป: ${STEPS[next]}`);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
      startAnalyze();
    }
  }

  // ========== ส่งรูปทั้งหมดไปวิเคราะห์ ==========
  async function startAnalyze() {
    setIsAnalyzing(true);

    // dataURL → Blob ก่อนส่ง
    const blobs = await Promise.all(thumbs.map((t) => fetch(t).then((r) => r.blob())));
    const formData = new FormData();
    blobs.forEach((b, i) => formData.append("files", b, `angle_${i}.jpg`));

    const res = await fetch(`${API_BASE}/analyze/skin`, { method: "POST", body: formData });
    const data = await res.json();

    // แอนิเมชัน progress (fake progress สวย ๆ)
    let p = 0;
    const t = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(t);
        onAnalyzeResult(data);
      }
    }, 80);
  }

  // ========== สีกรอบวงรี ==========
  const borderColor = !faceOk
    ? "border-pink-300"
    : lightOk
    ? "border-pink-500 shadow-[0_0_25px_rgba(244,114,182,0.8)]"
    : "border-yellow-400";

  // ========== UI ==========
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

      {/* Face ellipse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-72 h-96 rounded-full border-4 transition-all duration-150 ${borderColor}`} />
      </div>

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

      {/* Stable progress (ระหว่างนิ่ง 3 วิ) */}
      {!isAnalyzing && stablePercent > 0 && (
        <div className="absolute bottom-24 w-full flex justify-center z-20">
          <div className="w-2/3">
            <Progress value={stablePercent} className="h-2" />
          </div>
        </div>
      )}

      {/* Analyze overlay */}
      {isAnalyzing && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-white mb-6 text-xl font-semibold">🔬 กำลังวิเคราะห์ผิวของคุณ...</div>
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
