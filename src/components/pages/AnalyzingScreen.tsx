import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../../contexts/LanguageContext";
import { GlowbieBellLogo } from "../GlowbieBellLogo";

interface AnalyzingScreenProps {
  onComplete: (result?: any) => void;
  capturedImages?: { front: string | null; left: string | null; right: string | null };
  userConcerns?: string[];
  userData?: { gender?: string; age?: string; skinType?: string; isSensitive?: boolean };
}

// ✨ เพิ่ม type ตรงนี้
type SkinAnalyzeResponse = {
  overall_score: number;
  dimension_scores: Record<string, number>;
  weighted_contrib: Record<string, number>;
  mode: string;
  highlights_short: string[];
  improvements_short: string[];
  ai_advice: string;
  profile: {
    sex: string;
    age_range: string;
    skin_type: string;
    sensitive: boolean;
    concerns: string;
  };
};

export function AnalyzingScreen({
  onComplete,
  capturedImages,
  userConcerns,
  userData,
}: AnalyzingScreenProps) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [analyzingImageIndex, setAnalyzingImageIndex] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [aiResult, setAiResult] = useState<SkinAnalyzeResponse | null>(null);

  const phases = [
    { labelTh: "กำลังประมวลผลภาพ...", labelEn: "Processing images...", labelZh: "正在处理图片..." },
    { labelTh: "กำลังวิเคราะห์ลักษณะผิว...", labelEn: "Analyzing skin features...", labelZh: "正在分析皮肤特征..." },
    { labelTh: "กำลังประเมินสภาพผิว...", labelEn: "Evaluating skin condition...", labelZh: "正在评估皮肤状况..." },
    { labelTh: "กำลังสร้างคำแนะนำ...", labelEn: "Generating recommendations...", labelZh: "正在生成建议..." },
  ];

  const getPhaseLabel = () => {
    const phase = phases[currentPhase];
    if (t.language === "th") return phase.labelTh;
    if (t.language === "en") return phase.labelEn;
    return phase.labelZh;
  };

  // =====================================================================================
  // 🚀 ส่งภาพไป backend เมื่อ mount (เวอร์ชันถูกต้อง 100%)
  // =====================================================================================
  useEffect(() => {
    async function sendImagesToBackend() {
      if (!capturedImages?.front || !capturedImages?.left || !capturedImages?.right) {
        console.warn("⚠️ capturedImages ยังไม่ครบ 3 มุม");
        return;
      }

      try {
        console.log("📤 กำลังส่งภาพไป backend...");

        // ส่ง Base64 JSON → backend
        const payload = {
          front: capturedImages.front,
          left: capturedImages.left,
          right: capturedImages.right,
          sex: userData?.gender || "female",
          age_range: userData?.age || "25-34",
          skin_type: userData?.skinType || "combination",
          sensitive: !!userData?.isSensitive,
          concerns: (userConcerns || []).join(","),
        };

        const res = await fetch("https://aishincarebackend-production.up.railway.app/analyze-face-full", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("📥 ผลลัพธ์จาก backend:", data);

        if (data?.overall_score !== undefined) {
          setAiResult(data as SkinAnalyzeResponse);
        } else {
          console.warn("⚠️ รูปแบบผลลัพธ์ไม่ตรง:", data);
        }

      } catch (err) {
        console.error("❌ ส่งภาพไม่สำเร็จ:", err);
      }
    }

    sendImagesToBackend();
  }, [capturedImages, userConcerns, userData]);



  // =====================================================================================
  // 🔄 Progress bar เดินจนถึง 100 แล้วเรียก onComplete(result)
  // =====================================================================================
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (aiResult) {
              localStorage.setItem("lastSkinScan", JSON.stringify(aiResult)); // ⭐ เก็บผลแสกน
              onComplete(aiResult);
            }
 // ✅ ส่งผลลัพธ์จริง
            } else {
              console.warn("⚠️ ยังไม่ได้รับผลจาก backend — รออีกนิด");
            }
          }, 800);
          return 100;
        }
        return prev + 1.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete, aiResult]);

  // =====================================================================================
  // 🔁 เปลี่ยน phase ตาม progress
  // =====================================================================================
  useEffect(() => {
    if (progress >= 25 && currentPhase < 1) setCurrentPhase(1);
    if (progress >= 50 && currentPhase < 2) setCurrentPhase(2);
    if (progress >= 75 && currentPhase < 3) setCurrentPhase(3);
  }, [progress, currentPhase]);

  // =====================================================================================
  // 🔄 สลับภาพขณะวิเคราะห์
  // =====================================================================================
  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setAnalyzingImageIndex((prev) => (prev + 1) % 3);
    }, 1000);
    return () => clearInterval(rotateInterval);
  }, []);


  const titleText =
    t.language === "th"
      ? "กำลังวิเคราะห์..."
      : t.language === "en"
      ? "Analyzing..."
      : "分析中...";

  const subtitleText =
    t.language === "th"
      ? "กำลังประมวลผลภาพ 3 มุมของคุณ"
      : t.language === "en"
      ? "Processing your 3-angle photos"
      : "正在处理您的三角照片";

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 100%)'
    }}>
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <motion.div 
          className="absolute top-20 -left-20 w-80 h-80 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ background: 'radial-gradient(circle, #FFB5D9 0%, transparent 70%)' }}
        />
        <motion.div 
          className="absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          style={{ background: 'radial-gradient(circle, #7DB8FF 0%, transparent 70%)' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-white mb-2"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)' }}
          >
            {titleText}
          </motion.h2>
          <motion.p 
            className="text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              color: '#FFB5D9',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
            }}
          >
            {subtitleText}
          </motion.p>
        </motion.div>

        {/* Image Thumbnails */}
        {capturedImages && (
          <div className="flex gap-3 mb-12">
            {/* Front */}
            <motion.div
              className="relative w-20 h-24 rounded-2xl overflow-hidden backdrop-blur-md"
              animate={{
                scale: analyzingImageIndex === 0 ? 1.15 : 1,
                opacity: analyzingImageIndex === 0 ? 1 : 0.6,
              }}
              style={{
                background: 'rgba(255, 181, 217, 0.2)',
                border: '2px solid #FFB5D9',
                boxShadow: analyzingImageIndex === 0 ? '0 0 20px rgba(255, 181, 217, 0.6)' : 'none',
              }}
            >
              {capturedImages.front && (
                <img
                  src={capturedImages.front}
                  alt="Front"
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>

            {/* Left */}
            <motion.div
              className="relative w-20 h-24 rounded-2xl overflow-hidden backdrop-blur-md"
              animate={{
                scale: analyzingImageIndex === 1 ? 1.15 : 1,
                opacity: analyzingImageIndex === 1 ? 1 : 0.6,
              }}
              style={{
                background: 'rgba(125, 184, 255, 0.2)',
                border: '2px solid #7DB8FF',
                boxShadow: analyzingImageIndex === 1 ? '0 0 20px rgba(125, 184, 255, 0.6)' : 'none',
              }}
            >
              {capturedImages.left && (
                <img
                  src={capturedImages.left}
                  alt="Left"
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>

            {/* Right */}
            <motion.div
              className="relative w-20 h-24 rounded-2xl overflow-hidden backdrop-blur-md"
              animate={{
                scale: analyzingImageIndex === 2 ? 1.15 : 1,
                opacity: analyzingImageIndex === 2 ? 1 : 0.6,
              }}
              style={{
                background: 'rgba(203, 184, 255, 0.2)',
                border: '2px solid #CBB8FF',
                boxShadow: analyzingImageIndex === 2 ? '0 0 20px rgba(203, 184, 255, 0.6)' : 'none',
              }}
            >
              {capturedImages.right && (
                <img
                  src={capturedImages.right}
                  alt="Right"
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </div>
        )}

        {/* AI Processing Animation */}
        <div className="mb-8 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Logo */}
            <GlowbieBellLogo size={120} animated={true} />
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-sm mb-6">
          <div className="relative h-3 rounded-full overflow-hidden backdrop-blur-md" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #FFB5D9 0%, #7DB8FF 50%, #CBB8FF 100%)',
                boxShadow: '0 0 20px rgba(255, 181, 217, 0.6)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          
          {/* Progress percentage */}
          <div className="flex justify-between items-center mt-3">
            <motion.p 
              className="text-sm text-white/60"
              key={currentPhase}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {getPhaseLabel()}
            </motion.p>
            <span className="text-sm text-white/80">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* User Concerns (if any) */}
        {userConcerns && userConcerns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="max-w-sm text-center"
          >
            <p className="text-xs text-white/40 mb-2">
              {t.language === 'th' ? 'จุดที่ให้ความสนใจ:' : t.language === 'en' ? 'Focus areas:' : '重点关注：'}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {userConcerns.map((concern, index) => {
                const concernLabels: Record<string, {th: string, en: string, zh: string}> = {
                  'acne': { th: 'สิว/รอยสิว', en: 'Acne & Scars', zh: '痘痘/痘印' },
                  'wrinkles': { th: 'ริ้วรอย', en: 'Wrinkles', zh: '皱纹' },
                  'redness': { th: 'ความแดง', en: 'Redness', zh: '红血丝' },
                  'oiliness': { th: 'ความมัน', en: 'Oiliness', zh: '油性' },
                  'dryness': { th: 'ความแห้ง', en: 'Dryness', zh: '干燥' },
                  'pigmentation': { th: 'ฝ้า/กระ', en: 'Dark Spots', zh: '色斑' },
                };
                const label = concernLabels[concern]?.[t.language] || concern;
                
                return (
                  <motion.div
                    key={concern}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="px-3 py-1 rounded-full text-xs backdrop-blur-md"
                    style={{
                      background: 'rgba(255, 181, 217, 0.2)',
                      border: '1px solid rgba(255, 181, 217, 0.5)',
                      color: '#FFB5D9',
                    }}
                  >
                    {label}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
