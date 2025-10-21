import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface FaceScanScreenProps {
  onAnalyze: () => void;
  onBack: () => void;
}

type ScanStep = 'front' | 'left' | 'right' | 'analyzing';

interface StepStatus {
  front: boolean;
  left: boolean;
  right: boolean;
}

export function FaceScanScreen({ onAnalyze, onBack }: FaceScanScreenProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<ScanStep>('front');
  const [completedSteps, setCompletedSteps] = useState<StepStatus>({
    front: false,
    left: false,
    right: false,
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Store captured images (in real app, these would be actual photos)
  const [capturedImages, setCapturedImages] = useState<{
    front: string | null;
    left: string | null;
    right: string | null;
  }>({
    front: null,
    left: null,
    right: null,
  });
  
  // Current analyzing image index (for rotation effect)
  const [analyzingImageIndex, setAnalyzingImageIndex] = useState(0);

  // Auto-capture simulation (จำลองการถ่ายภาพอัตโนมัติ)
  useEffect(() => {
    if (currentStep !== 'analyzing' && !isCapturing) {
      // จำลองการถ่ายภาพอัตโนมัติหลังจาก 3 วินาที
      const captureTimer = setTimeout(() => {
        handleCapture();
      }, 3000);

      return () => clearTimeout(captureTimer);
    }
  }, [currentStep, isCapturing]);

  const handleCapture = () => {
    setIsCapturing(true);

    // Simulate capture animation and store "captured image"
    setTimeout(() => {
      const newCompletedSteps = { ...completedSteps };
      
      if (currentStep === 'front') {
        newCompletedSteps.front = true;
        setCompletedSteps(newCompletedSteps);
        // In real app, store actual photo here
        setCapturedImages(prev => ({ ...prev, front: faceGuideImage }));
        setCurrentStep('left');
      } else if (currentStep === 'left') {
        newCompletedSteps.left = true;
        setCompletedSteps(newCompletedSteps);
        setCapturedImages(prev => ({ ...prev, left: faceGuideImage }));
        setCurrentStep('right');
      } else if (currentStep === 'right') {
        newCompletedSteps.right = true;
        setCompletedSteps(newCompletedSteps);
        setCapturedImages(prev => ({ ...prev, right: faceGuideImage }));
        // เมื่อครบ 3 มุม เริ่มวิเคราะห์อัตโนมัติ
        setTimeout(() => {
          setCurrentStep('analyzing');
        }, 500);
      }
      
      setIsCapturing(false);
    }, 800);
  };

  // Progress bar animation when analyzing (slower for realistic feel)
  useEffect(() => {
    if (currentStep === 'analyzing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onAnalyze();
            }, 500);
            return 100;
          }
          // Slower increment for more realistic analysis (~6 seconds total)
          return prev + 2.5;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [currentStep, onAnalyze]);
  
  // Rotate through captured images during analysis
  useEffect(() => {
    if (currentStep === 'analyzing') {
      const rotateInterval = setInterval(() => {
        setAnalyzingImageIndex((prev) => (prev + 1) % 3);
      }, 1000);
      
      return () => clearInterval(rotateInterval);
    }
  }, [currentStep]);

  // Arrow Icon Components with theme colors
  const ArrowLeftIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#7DB8FF" fillOpacity="0.2" />
      <path 
        d="M38 20 L22 32 L38 44" 
        stroke="#7DB8FF" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="32" r="28" stroke="#7DB8FF" strokeWidth="2" strokeOpacity="0.3" />
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#CBB8FF" fillOpacity="0.2" />
      <path 
        d="M26 20 L42 32 L26 44" 
        stroke="#CBB8FF" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="32" r="28" stroke="#CBB8FF" strokeWidth="2" strokeOpacity="0.3" />
    </svg>
  );

  const getStepInfo = () => {
    switch (currentStep) {
      case 'front':
        return {
          title: t.language === 'th' ? 'มุมที่ 1: หน้าตรง' : 
                 t.language === 'en' ? 'Angle 1: Front Face' : 
                 '角度 1：正面',
          instruction: t.language === 'th' ? 'มองตรงไปที่กล้อง' : 
                      t.language === 'en' ? 'Look straight at the camera' : 
                      '直视相机',
          emoji: '👤',
          color: '#FFB5D9' // ชมพูสดใส
        };
      case 'left':
        return {
          title: t.language === 'th' ? 'มุมที่ 2: หันด้านซ้าย' : 
                 t.language === 'en' ? 'Angle 2: Turn Left' : 
                 '角度 2：向左转',
          instruction: t.language === 'th' ? 'หันหน้าไปทางซ้าย 45°' : 
                      t.language === 'en' ? 'Turn your face left 45°' : 
                      '将脸向左转 45°',
          icon: <ArrowLeftIcon />,
          color: '#7DB8FF' // ฟ้าสดใส
        };
      case 'right':
        return {
          title: t.language === 'th' ? 'มุมที่ 3: หันด้านขวา' : 
                 t.language === 'en' ? 'Angle 3: Turn Right' : 
                 '角度 3：向右转',
          instruction: t.language === 'th' ? 'หันหน้าไปทางขวา 45°' : 
                      t.language === 'en' ? 'Turn your face right 45°' : 
                      '将脸向右转 45°',
          icon: <ArrowRightIcon />,
          color: '#CBB8FF' // ม่วงสดใส
        };
      case 'analyzing':
        return {
          title: t.language === 'th' ? 'กำลังวิเคราะห์...' : 
                 t.language === 'en' ? 'Analyzing...' : 
                 '分析中...',
          subtitle: t.language === 'th' ? 'กำลังประมวลผลภาพ 3 มุมของคุณ' :
                   t.language === 'en' ? 'Processing your 3-angle photos' :
                   '正在处理您的三角照片',
          color: '#FFB5D9' // ชมพูสดใส
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0A0F1C 0%, #111827 100%)'
    }}>
      {/* 
        📷 CAMERA PLACEHOLDER - คุณสามารถเพิ่ม <video> element ตรงนี้
        ตัวอย่าง:
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
      */}

      {/* Mock Camera Background (สำหรับ demo) */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%)'
        }}
      />

      {/* Flash Effect when capturing */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 pointer-events-none"
            style={{
              background: 'white'
            }}
          />
        )}
      </AnimatePresence>

      {/* Close Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <X className="w-6 h-6 text-white" />
      </motion.button>

      {/* Step Progress Indicator / Captured Images (Top Center) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-3"
      >
        {currentStep === 'analyzing' ? (
          /* Show captured images during analysis */
          <>
            {/* Front Image */}
            <motion.div
              className="relative w-16 h-20 rounded-2xl overflow-hidden backdrop-blur-md"
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

            {/* Left Image */}
            <motion.div
              className="relative w-16 h-20 rounded-2xl overflow-hidden backdrop-blur-md"
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

            {/* Right Image */}
            <motion.div
              className="relative w-16 h-20 rounded-2xl overflow-hidden backdrop-blur-md"
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
          </>
        ) : (
          /* Show step indicators during scanning */
          <>
        {/* Front Step - ชมพูสดใส */}
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
          animate={{
            scale: currentStep === 'front' ? 1.2 : 1,
            boxShadow: currentStep === 'front' 
              ? [
                  '0 0 20px rgba(255, 181, 217, 0.6)',
                  '0 0 30px rgba(255, 181, 217, 0.8)',
                  '0 0 20px rgba(255, 181, 217, 0.6)',
                ]
              : completedSteps.front
              ? '0 0 25px rgba(255, 181, 217, 0.7)'
              : 'none'
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            background: completedSteps.front 
              ? '#FFB5D9'
              : currentStep === 'front'
              ? 'rgba(255, 181, 217, 0.4)'
              : 'rgba(255, 255, 255, 0.08)',
            border: `2px solid ${completedSteps.front || currentStep === 'front' ? '#FFB5D9' : 'rgba(255, 255, 255, 0.15)'}`,
          }}
        >
          {completedSteps.front ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <span className="text-white">1</span>
          )}
        </motion.div>

        {/* Left Step - ฟ้าสดใส */}
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
          animate={{
            scale: currentStep === 'left' ? 1.2 : 1,
            boxShadow: currentStep === 'left' 
              ? [
                  '0 0 20px rgba(125, 184, 255, 0.6)',
                  '0 0 30px rgba(125, 184, 255, 0.8)',
                  '0 0 20px rgba(125, 184, 255, 0.6)',
                ]
              : completedSteps.left
              ? '0 0 25px rgba(125, 184, 255, 0.7)'
              : 'none'
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            background: completedSteps.left 
              ? '#7DB8FF'
              : currentStep === 'left'
              ? 'rgba(125, 184, 255, 0.4)'
              : 'rgba(255, 255, 255, 0.08)',
            border: `2px solid ${completedSteps.left || currentStep === 'left' ? '#7DB8FF' : 'rgba(255, 255, 255, 0.15)'}`,
          }}
        >
          {completedSteps.left ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <span className="text-white">2</span>
          )}
        </motion.div>

        {/* Right Step - ม่วงสดใส */}
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
          animate={{
            scale: currentStep === 'right' ? 1.2 : 1,
            boxShadow: currentStep === 'right' 
              ? [
                  '0 0 20px rgba(203, 184, 255, 0.6)',
                  '0 0 30px rgba(203, 184, 255, 0.8)',
                  '0 0 20px rgba(203, 184, 255, 0.6)',
                ]
              : completedSteps.right
              ? '0 0 25px rgba(203, 184, 255, 0.7)'
              : 'none'
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            background: completedSteps.right 
              ? '#CBB8FF'
              : currentStep === 'right'
              ? 'rgba(203, 184, 255, 0.4)'
              : 'rgba(255, 255, 255, 0.08)',
            border: `2px solid ${completedSteps.right || currentStep === 'right' ? '#CBB8FF' : 'rgba(255, 255, 255, 0.15)'}`,
          }}
        >
          {completedSteps.right ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <span className="text-white">3</span>
          )}
        </motion.div>
        </>
        )}
      </motion.div>

      {/* Camera View Container */}
      <div className="relative h-screen flex flex-col items-center justify-center px-6">
        
        {/* Step Title with Icon/Emoji */}
        {currentStep !== 'analyzing' ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute top-24 left-0 right-0 text-center z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mb-3 flex items-center justify-center"
            >
              {stepInfo.icon ? (
                <div className="w-16 h-16">
                  {stepInfo.icon}
                </div>
              ) : (
                <div className="text-6xl">
                  {stepInfo.emoji}
                </div>
              )}
            </motion.div>
            <h2 
              className="text-white mb-2"
              style={{
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)'
              }}
            >
              {stepInfo.title}
            </h2>
            <p 
              className="text-sm"
              style={{
                color: stepInfo.color,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
              }}
            >
              {stepInfo.instruction}
            </p>
          </motion.div>
        ) : (
          /* Analyzing Title - Clean & Minimal */
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-32 left-0 right-0 text-center z-10 px-6"
          >
            <motion.h2 
              className="text-white mb-2"
              animate={{
                opacity: [1, 0.7, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)'
              }}
            >
              {stepInfo.title}
            </motion.h2>
            <motion.p 
              className="text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                color: stepInfo.color,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
              }}
            >
              {stepInfo.subtitle}
            </motion.p>
          </motion.div>
        )}
        
        {/* Face Guide Frame with Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
          style={{ width: '280px', height: '340px' }}
        >
          {/* Animated Glow Background */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              background: [
                `radial-gradient(ellipse at center, ${stepInfo.color}40 0%, ${stepInfo.color}20 50%, ${stepInfo.color}40 100%)`,
                `radial-gradient(ellipse at center, ${stepInfo.color}30 0%, ${stepInfo.color}10 50%, ${stepInfo.color}30 100%)`,
                `radial-gradient(ellipse at center, ${stepInfo.color}40 0%, ${stepInfo.color}20 50%, ${stepInfo.color}40 100%)`,
              ],
              filter: [
                'blur(30px)',
                'blur(35px)',
                'blur(30px)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ transform: 'scale(1.3)' }}
          />

          {/* Gradient Border with Pulse */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              opacity: [0.6, 1, 0.6],
              boxShadow: [
                `0 0 20px ${stepInfo.color}60`,
                `0 0 40px ${stepInfo.color}80`,
                `0 0 20px ${stepInfo.color}60`,
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: stepInfo.color,
              padding: '3px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Face Guide Image Overlay */}
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            <img
              src={faceGuideImage}
              alt="Face Guide"
              className="w-full h-full object-contain"
              style={{
                filter: `drop-shadow(0 0 20px ${stepInfo.color}99)`,
                opacity: 0.8,
                mixBlendMode: 'screen'
              }}
            />
          </div>

          {/* Advanced Scanning Effects (แสดงเมื่อกำลังวิเคราะห์) */}
          {currentStep === 'analyzing' && (
            <>
              {/* Grid Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(125, 184, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(125, 184, 255, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />
              
              {/* Primary Scanning Line */}
              <motion.div
                className="absolute left-0 right-0 h-1 pointer-events-none z-10"
                animate={{
                  top: ['0%', '100%'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: `linear-gradient(90deg, transparent, #7DB8FFFF, transparent)`,
                  boxShadow: `0 0 20px #7DB8FFCC, 0 0 40px #7DB8FF88`,
                }}
              />
              
              {/* Secondary Scanning Lines */}
              <motion.div
                className="absolute left-0 right-0 h-0.5 pointer-events-none z-10"
                animate={{
                  top: ['10%', '110%'],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 0.3 }}
                style={{
                  background: `linear-gradient(90deg, transparent, #FFB5D9CC, transparent)`,
                  boxShadow: `0 0 15px #FFB5D999`,
                }}
              />
              
              <motion.div
                className="absolute left-0 right-0 h-0.5 pointer-events-none z-10"
                animate={{
                  top: ['20%', '120%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0.6 }}
                style={{
                  background: `linear-gradient(90deg, transparent, #CBB8FFCC, transparent)`,
                  boxShadow: `0 0 15px #CBB8FF99`,
                }}
              />
              
              {/* Particle Effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full pointer-events-none"
                  animate={{
                    top: ['0%', '100%'],
                    left: `${10 + i * 11}%`,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.15,
                  }}
                  style={{
                    background: i % 3 === 0 ? '#7DB8FF' : i % 3 === 1 ? '#FFB5D9' : '#CBB8FF',
                    boxShadow: `0 0 10px ${i % 3 === 0 ? '#7DB8FF' : i % 3 === 1 ? '#FFB5D9' : '#CBB8FF'}`,
                  }}
                />
              ))}
              
              {/* Corner Markers */}
              {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
                <motion.div
                  key={corner}
                  className={`absolute w-8 h-8 pointer-events-none ${
                    corner === 'top-left' ? 'top-0 left-0' :
                    corner === 'top-right' ? 'top-0 right-0' :
                    corner === 'bottom-left' ? 'bottom-0 left-0' : 'bottom-0 right-0'
                  }`}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div 
                    className="w-full h-full"
                    style={{
                      borderTop: corner.includes('top') ? '3px solid #7DB8FF' : 'none',
                      borderBottom: corner.includes('bottom') ? '3px solid #7DB8FF' : 'none',
                      borderLeft: corner.includes('left') ? '3px solid #7DB8FF' : 'none',
                      borderRight: corner.includes('right') ? '3px solid #7DB8FF' : 'none',
                      boxShadow: '0 0 10px #7DB8FF88',
                    }}
                  />
                </motion.div>
              ))}
            </>
          )}

          {/* Countdown Circle (for auto-capture) */}
          {currentStep !== 'analyzing' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md"
                animate={{
                  boxShadow: [
                    `0 0 0 0 ${stepInfo.color}40`,
                    `0 0 0 20px ${stepInfo.color}00`,
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  background: `${stepInfo.color}30`,
                  border: `2px solid ${stepInfo.color}`,
                }}
              >
                <motion.div
                  className="w-12 h-12 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
                  style={{
                    border: `3px solid transparent`,
                    borderTopColor: stepInfo.color,
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Progress Bar (when analyzing) */}
        <AnimatePresence>
          {currentStep === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-0 right-0 px-6 z-10"
            >
              <div 
                className="rounded-3xl p-6 backdrop-blur-md"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="text-white text-center mb-4">{stepInfo.instruction}</div>
                
                {/* Custom Gradient Progress Bar */}
                <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #FF8AD4 0%, #67B5FF 50%, #C19BFF 100%)',
                      boxShadow: '0 0 20px rgba(103, 181, 255, 0.6)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                
                <div 
                  className="text-center"
                  style={{ color: '#FF8AD4' }}
                >
                  {Math.floor(progress)}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
