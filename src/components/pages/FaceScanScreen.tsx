import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Camera, Lightbulb, HelpCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import * as faceapi from "@vladmandic/face-api";

interface FaceScanScreenProps {
  onAnalyze: () => void;
  onBack: () => void;
}

export function FaceScanScreen({ onAnalyze, onBack }: FaceScanScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("กำลังเปิดกล้อง...");
  const [isDetected, setIsDetected] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // โหลดโมเดลตรวจจับใบหน้า
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      startCamera();
    };
    loadModels();
  }, []);

  // เปิดกล้องหน้า
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        detectFace();
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ ไม่สามารถเปิดกล้องได้");
    }
  };

  // ตรวจจับใบหน้าแบบเรียลไทม์
  const detectFace = async () => {
    const video = videoRef.current;
    if (!video) return;

    const interval = setInterval(async () => {
      if (!video.paused && !video.ended) {
        const detection = await faceapi.detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions()
        );

        if (detection) {
          setIsDetected(true);
          setStatus("✅ ตรวจพบใบหน้าแล้ว");
          setIsReady(true);
        } else {
          setIsDetected(false);
          setStatus("🔍 กำลังตรวจจับใบหน้า...");
          setIsReady(false);
        }
      }
    }, 600);

    return () => clearInterval(interval);
  };

  // ถ่ายภาพและส่งไปวิเคราะห์
  const handleAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    setProgress(0);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL("image/jpeg");
    const blob = dataURLtoBlob(imgData);

    const formData = new FormData();
    formData.append("file", blob, "face.jpg");

    // 模จำลอง progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const res = await fetch(`${API_URL}/analyze/skin`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("ผลวิเคราะห์:", data);
      setStatus(`🎯 ผลวิเคราะห์: ${data.result?.message || "สำเร็จ"}`);

      setTimeout(() => {
        onAnalyze();
      }, 800);
    } catch (err) {
      console.error(err);
      setStatus("❌ การวิเคราะห์ล้มเหลว");
    }
  };

  // Helper แปลง base64 → Blob
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
      {/* ปุ่มปิด */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* กล้อง */}
      <div className="relative h-screen flex items-center justify-center">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
        />

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Overlay วงรี */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-72 h-96"
        >
          <div className="absolute inset-0 border-4 border-pink-400 rounded-full opacity-70 shadow-[0_0_30px_rgba(244,114,182,0.6)]"></div>
        </motion.div>

        {/* สถานะ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-20 left-0 right-0 text-center z-10"
        >
          {isDetected ? (
            <div className="bg-green-500 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              ตรวจพบใบหน้าแล้ว ✅
            </div>
          ) : (
            <div className="bg-gray-700 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-lg">
              🔍 {status}
            </div>
          )}
          <div className="mt-3 bg-black/40 text-white px-6 py-2 rounded-full inline-flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-300" />
            แสงเหมาะสม
          </div>
        </motion.div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-32 left-0 right-0 px-6 z-10"
          >
            <div className="bg-black/70 rounded-3xl p-6 text-center">
              <div className="text-white mb-4">กำลังวิเคราะห์ผิวของคุณ...</div>
              <Progress value={progress} className="h-3 mb-3" />
              <div className="text-pink-300">{progress}%</div>
            </div>
          </motion.div>
        )}

        {/* ปุ่มช่วยเหลือ */}
        <div className="absolute bottom-6 left-6 z-10">
          <button className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* ปุ่มสแกน */}
        {!isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-16 left-0 right-0 px-6 z-10"
          >
            <Button
              onClick={handleAnalyze}
              disabled={!isReady}
              className={`w-full h-16 rounded-2xl text-white text-lg shadow-2xl transition-all ${
                isReady
                  ? "bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              วิเคราะห์เลย
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
