import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { X, HelpCircle } from "lucide-react";
import { Progress } from "../ui/progress";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const faceGuideImage = "/face_mask_scan.png";

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
   FACE OVERLAY (Figma Style)
============================================= */
function FaceGuideOverlay({ isAnalyzing }: { isAnalyzing: boolean }) {
  return (
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10">
      {/* glow background */}
      <motion.div
        className="absolute rounded-3xl"
        animate={{
          background: [
            "radial-gradient(ellipse at center, rgba(255,138,212,0.3), rgba(103,181,255,0.2))",
            "radial-gradient(ellipse at center, rgba(103,181,255,0.3), rgba(255,138,212,0.2))",
          ],
          filter: ["blur(30px)", "blur(40px)", "blur(30px)"],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ width: 280, height: 340 }}
      />

      <div className="relative w-[280px] h-[340px] flex justify-center items-center">
        {/* mask image */}
        <img
          src={faceGuideImage}
          alt="face guide"
          className="w-full h-full object-contain opacity-85 drop-shadow-[0_0_25px_rgba(255,138,212,0.6)]"
        />

        {/* scanning line */}
        {isAnalyzing && (
          <motion.div
            className="absolute left-0 right-0 h-1"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(103,181,255,0.9), transparent)",
              boxShadow: "0 0 10px rgba(103,181,255,0.8)",
            }}
          />
        )}
      </div>
    </div>
  );
}

/* =============================================
   Pose utility
============================================= */
function estimatePose(landmarks: any[]) {
  const LEFT_EYE = 33;
  const RIGHT_EYE = 263;
  const NOSE_TIP = 1;
  const leftEye = landmarks[LEFT_EYE];
  const rightEye = landmarks[RIGHT_EYE];
  const nose = landmarks[NOSE_TIP];
  const dx = rightEye.x - leftEye.x;
  const dy = rightEye.y - leftEye.y;
  const roll = (Math.atan2(dy, dx) * 180) / Math.PI;
  const midX = (leftEye.x + rightEye.x) / 2;
  const yaw = (nose.x - midX) * -200;
  return { yaw, roll, nose };
}

function isCentered(nose: any) {
  return (
    nose &&
    nose.x >= CENTER_BOX.xMin &&
    nose.x <= CENTER_BOX.xMax &&
    nose.y >= CENTER_BOX.yMin &&
    nose.y <= CENTER_BOX.yMax
  );
}

/* =============================================
   MAIN COMPONENT
============================================= */
export function FaceScanScreen({ onAnalyzeResult, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState("📷 กำลังเปิดกล้อง...");
  const [stablePercent, setStablePercent] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const holdStart = useRef<number | null>(null);
  const stepRef = useRef<Step>(0);
  const stepLocked = useRef(false);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  /* ---------- Mediapipe ---------- */
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
      if (!results.multiFaceLandmarks?.length) {
        setStatus("📍 ขยับหน้าให้อยู่กลางกรอบ");
        setStablePercent(0);
        holdStart.current = null;
        return;
      }

      const { yaw, roll, nose } = estimatePose(results.multiFaceLandmarks[0]);
      const s = stepRef.current;
      const yawOk = Math.abs(yaw - TARGET_YAW[s]) <= YAW_TOL[s];
      const rollOk = Math.abs(roll) <= MAX_ROLL;
      const centerOk = isCentered(nose);

      if (!centerOk) setStatus("📍 ขยับหน้าให้อยู่กลางกรอบ");
      else if (!rollOk) setStatus("↕️ ปรับศีรษะให้ตรง");
      else if (!yawOk) {
        if (s === 0) setStatus("➡️ หันหน้าให้นิ่งตรงกล้อง");
        else if (s === 1) setStatus("⬅️ หันไปทางซ้ายเล็กน้อย");
        else setStatus("➡️ หันไปทางขวาเล็กน้อย");
      } else setStatus(`✅ มุมถูกต้อง: ${STEPS[s]} — อยู่นิ่ง ๆ`);

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
  }, []);

  /* ---------- ถ่ายภาพครบ ---------- */
  useEffect(() => {
    if (stablePercent >= 100 && !stepLocked.current) {
      stepLocked.current = true;
      soundRef.current?.play();
      captureThumb();

      setTimeout(() => {
        if (step < 2) {
          setStep((step + 1) as Step);
          setStablePercent(0);
          holdStart.current = null;
          stepLocked.current = false;
        } else {
          setStatus("✨ ครบทั้ง 3 มุมแล้ว! เริ่มวิเคราะห์ผิว...");
          startAnalyze();
        }
      }, NEXT_DELAY);
    }
  }, [stablePercent]);

  function captureThumb() {
    const v = videoRef.current!;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const img = c.toDataURL("image/jpeg");
    setThumbs((t) => [...t, img]);
  }

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
    }, 80);
  }

  /* ---------- UI ---------- */
  return (
    <div
      className="min-h-screen relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(180deg, #090E22 0%, #1A1F3C 100%)",
      }}
    >
      {/* ปุ่มปิด */}
      <motion.button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <X className="w-6 h-6 text-white" />
      </motion.button>

      {/* กล้อง */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
        autoPlay
        muted
        playsInline
      />

      {/* Overlay โครงหน้า */}
      <FaceGuideOverlay isAnalyzing={isAnalyzing} />

      {/* คำแนะนำ */}
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-[calc(50%+230px)] w-full text-center z-20"
      >
        <p
          className="px-6 py-3 rounded-full inline-block backdrop-blur-md"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#67B5FF",
          }}
        >
          {status}
        </p>
      </motion.div>

      {/* Progress Bar */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-28 left-0 right-0 px-10 z-20"
        >
          <div
            className="rounded-3xl p-6 backdrop-blur-md"
            style={{
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="text-center mb-3 text-pink-300">
              ✨ กำลังวิเคราะห์ผิวของคุณ...
            </div>
            <Progress
              value={progress}
              className="h-3 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-pink-300 [&>div]:to-purple-400"
            />
            <div className="text-center mt-2 text-pink-400">{progress}%</div>
          </div>
        </motion.div>
      )}

      {/* ปุ่มเริ่มวิเคราะห์ */}
      {!isAnalyzing && (
        <motion.button
          onClick={() => setStep(0)}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 px-10 py-4 rounded-2xl text-white font-semibold backdrop-blur-md"
          style={{
            background:
              "linear-gradient(135deg, #FF8AD4 0%, #67B5FF 50%, #C19BFF 100%)",
            boxShadow: "0 10px 40px rgba(103,181,255,0.4)",
          }}
        >
          🔍 เริ่มวิเคราะห์ผิว
        </motion.button>
      )}

      {/* ปุ่มช่วยเหลือ */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="absolute bottom-10 left-6 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <HelpCircle className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}
