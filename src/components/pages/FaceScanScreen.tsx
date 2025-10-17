import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { X, HelpCircle, Lightbulb } from "lucide-react";

interface FaceScanScreenProps {
  onAnalyze: () => void;
  onBack: () => void;
}

export function FaceScanScreen({ onAnalyze, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0); // 0=ตรง,1=ซ้าย,2=ขวา
  const [captured, setCaptured] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("กำลังเปิดกล้อง...");
  const API_URL = import.meta.env.VITE_API_URL;

  const steps = ["หน้าตรง", "หันซ้าย", "หันขวา"];

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus(`กรุณา${steps[step]}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ ไม่สามารถเปิดกล้องได้");
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgData = canvas.toDataURL("image/jpeg");
    return imgData;
  };

  const handleCapture = async () => {
    const img = captureFrame();
    if (!img) return;

    setStatus(`⏳ กำลังตรวจ ${steps[step]} ...`);

    const blob = dataURLtoBlob(img);
    const formData = new FormData();
    formData.append("file", blob, `face_step${step + 1}.jpg`);

    try {
      const res = await fetch(`${API_URL}/analyze/pose`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("ผลตรวจ:", data);

      if (data.result && data.result.valid) {
        setCaptured((prev) => [...prev, img]);
        if (step < 2) {
          setStep(step + 1);
          setStatus(`✅ สำเร็จ! ต่อไป ${steps[step + 1]}`);
        } else {
          setStatus("🎉 ครบทั้ง 3 มุมแล้ว พร้อมวิเคราะห์ผิว!");
        }
      } else {
        setStatus("⚠️ กรุณาหันหน้าใหม่ให้อยู่ในมุมที่ถูกต้อง");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ การส่งข้อมูลล้มเหลว");
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          onAnalyze();
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const dataURLtoBlob = (dataURL: string) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <motion.div
        className="absolute top-16 w-full text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-black/60 text-white px-6 py-3 rounded-2xl inline-block">
          {status}
        </div>
      </motion.div>

      <div className="absolute bottom-28 w-full flex justify-center gap-3">
        {captured.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-16 h-16 object-cover rounded-xl border-2 border-pink-400"
          />
        ))}
      </div>

      <div className="absolute bottom-16 w-full px-6 z-10">
        {!isAnalyzing ? (
          captured.length < 3 ? (
            <Button
              onClick={handleCapture}
              className="w-full h-16 bg-gradient-to-r from-pink-500 to-blue-500 text-white text-lg rounded-2xl"
            >
              ถ่ายภาพ {steps[step]}
            </Button>
          ) : (
            <Button
              onClick={handleAnalyze}
              className="w-full h-16 bg-green-500 text-white text-lg rounded-2xl"
            >
              วิเคราะห์เลย
            </Button>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/70 rounded-3xl p-6 text-center"
          >
            <div className="text-white mb-4">กำลังวิเคราะห์ผิวของคุณ...</div>
            <Progress value={progress} className="h-3 mb-3" />
            <div className="text-pink-300">{progress}%</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
