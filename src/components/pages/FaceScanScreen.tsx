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
const STABLE_TIME = 3000; // ✅ ต้องนิ่ง 3 วินาทีก่อนถ่าย
const CAPTURE_INTERVAL = 500; // ตรวจทุก 0.5 วิ
const API_BASE =
  import.meta.env.VITE_API_BASE || "https://aishincarebackend-production.up.railway.app";

// =========================================
// COMPONENT
// =========================================
export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>(0); // 0=หน้าตรง, 1=หันซ้าย, 2=หันขวา
  const [thumbs, setThumbs] = useState<string[]>([]); // เก็บภาพที่ถ่ายได้แต่ละมุม
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [faceOk, setFaceOk] = useState(false);
  const [lightOk, setLightOk] = useState(true);

  const timerRef = useRef<any>(null); // สำหรับควบคุม setInterval loop
  const stepLocked = useRef(false); // ✅ ตัวล็อกป้องกันการถ่ายซ้ำ
  const startStableTime = useRef<number | null>(null); // เวลาที่เริ่มนิ่ง

  // =========================================
  // 🎥 เปิดกล้องเมื่อโหลด component
  // =========================================
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

    return () => clearInterval(timerRef.current);
  }, []);

  // =========================================
  // 📸 ดึงภาพจากกล้องและแปลงเป็น blob
  // =========================================
  async function captureFrame(): Promise<Blob | null> {
    const v = videoRef.current!;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    // ✅ กลับภาพให้เหมือนกระจก
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, c.width, c.height);
    return await new Promise((resolve) => c.toBlob((b) => resolve(b), "image/jpeg", 0.8));
  }

  // =========================================
  // 🔁 Loop ตรวจมุมแบบเรียลไทม์ (กันถ่ายซ้ำ)
  // =========================================
  async function loop() {
    // ✅ ถ้ากำลังถ่ายหรือเปลี่ยนมุม — หยุดทันที
    if (stepLocked.current) return;

    const blob = await captureFrame();
    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await fetch(`${API_BASE}/analyze/pose`, { method: "POST", body: formData });
      const data = await res.json();

      // ✅ แปลงค่า pose ให้แน่นอน
      let pose = "";
      if (Array.isArray(data.pose)) {
        pose = String(data.pose[0]).trim().toLowerCase();
      } else if (typeof data.pose === "string") {
        pose = data.pose.split(",")[0].replace(/[\(\)']/g, "").trim().toLowerCase();
      }

      const target = step === 0 ? "front" : step === 1 ? "left" : "right";

      // ====================================
      // ตรวจเงื่อนไขใบหน้าและแสง
      // ====================================
      setFaceOk(!!data.face_ok);
      setLightOk(!!data.light_ok);

      if (!data.face_ok) {
        setStatus("🔍 ไม่พบใบหน้า กรุณาเข้าใกล้หรือเพิ่มแสง");
        startStableTime.current = null;
        return;
      }
      if (!data.light_ok) {
        setStatus("💡 แสงน้อยเกินไป กรุณาเพิ่มแสง");
        startStableTime.current = null;
        return;
      }

      // ====================================
      // ✅ ตรวจว่ามุมถูกต้องหรือไม่
      // ====================================
      if (pose === target) {
        // ถ้ายังไม่เริ่มจับเวลา ให้บันทึกเวลาเริ่มนิ่ง
        if (!startStableTime.current) {
          startStableTime.current = Date.now();
        }

        const elapsed = Date.now() - startStableTime.current;
        setStatus(
          `✅ ${STEPS[step]} ถูกต้อง (${(elapsed / 1000).toFixed(1)}s / ${
            STABLE_TIME / 1000
          }s)`
        );

        // ✅ ครบเวลาที่กำหนด (3 วินาที)
        if (elapsed >= STABLE_TIME) {
          // 🔒 ล็อกกันถ่ายซ้ำ
          stepLocked.current = true;
          startStableTime.current = null;

          // ✅ หยุด loop ทันที
          clearInterval(timerRef.current);

          // ✅ ถ่ายภาพ
          captureThumb();
          setStatus(`📸 บันทึกภาพมุม ${STEPS[step]} แล้ว!`);

          // ✅ หน่วง 1 วิให้ผู้ใช้เห็นข้อความ แล้วไปมุมถัดไป
          setTimeout(() => {
            nextStep();
            stepLocked.current = false;

            // ✅ เริ่มตรวจมุมใหม่
            timerRef.current = setInterval(loop, CAPTURE_INTERVAL);
          }, 1200);
        }
      } else {
        // มุมไม่ตรง → รีเซ็ตเวลาใหม่
        startStableTime.current = null;
        setStatus(`🟡 กรุณา${STEPS[step]}ให้ตรงมุม`);
      }
    } catch (err) {
      console.error("Pose analyze failed:", err);
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
  // ⏭️ ไปมุมต่อไป
  // =========================================
  function nextStep() {
    if (step < 2) {
      const next = (step + 1) as Step;
      setStep(next);
      setStatus(`✅ สำเร็จ ต่อไป: ${STEPS[next]}`);
    } else {
      // ✅ ครบทั้ง 3 มุม
      setStatus("🎉 ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
      clearInterval(timerRef.current);
      startAnalyze();
    }
  }

  // =========================================
  // 🧪 วิเคราะห์ผิวเมื่อครบ 3 มุม
  // =========================================
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

  // =========================================
  // 🎨 สีกรอบตรวจจับใบหน้า
  // =========================================
  const borderColor = !faceOk
    ? "border-pink-300"
    : lightOk
    ? "border-pink-500 shadow-[0_0_25px_rgba(244,114,182,0.8)]"
    : "border-yellow-400";

  // =========================================
  // 🧱 UI
  // =========================================
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
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
        autoPlay
        muted
        playsInline
      />

      {/* วงรีตรวจจับ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-72 h-96 rounded-full border-4 transition-all duration-150 ${borderColor}`} />
      </div>

      {/* สถานะข้อความ */}
      <motion.div
        className="absolute top-20 w-full text-center z-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 text-white px-5 py-3 rounded-2xl inline-block text-lg font-medium">
          {status}
        </div>
      </motion.div>

      {/* Progress */}
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

      {/* ภาพที่ถ่ายแล้ว */}
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
