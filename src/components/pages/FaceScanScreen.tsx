import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Lightbulb, HelpCircle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface FaceScanScreenProps {
  onAnalyze: () => void;
  onBack: () => void;
}

export function FaceScanScreen({ onAnalyze, onBack }: FaceScanScreenProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onAnalyze();
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isAnalyzing, onAnalyze]);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Close Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Camera View */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Mock Camera Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>

        {/* Face Detection Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-72 h-96"
        >
          {/* Oval Face Detection Frame */}
          <div className="absolute inset-0 border-4 border-pink-400 rounded-full opacity-70 shadow-[0_0_30px_rgba(244,114,182,0.5)]"></div>
          
          {/* Corner Markers */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 border-t-4 border-l-4 border-pink-400 rounded-tl-full"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 border-b-4 border-l-4 border-pink-400 rounded-bl-full"></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-12 h-12 border-t-4 border-l-4 border-pink-400 rounded-tl-full"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-12 h-12 border-t-4 border-r-4 border-pink-400 rounded-tr-full"></div>
        </motion.div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-20 left-0 right-0 text-center z-10"
        >
          <div className="bg-green-500 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            ตรวจพบใบหน้าแล้ว ✅
          </div>
          <div className="mt-3 bg-black/40 text-white px-6 py-2 rounded-full inline-flex items-center gap-2">
            💡 แสงเหมาะสม
          </div>
        </motion.div>

        {/* Analyzing Progress */}
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

        {/* Help Buttons */}
        <div className="absolute bottom-6 left-6 z-10">
          <button className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="absolute bottom-6 right-6 z-10">
          <button className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Analyze Button */}
        {!isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-16 left-0 right-0 px-6 z-10"
          >
            <Button
              onClick={handleAnalyze}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white shadow-2xl text-lg"
            >
              วิเคราะห์เลย
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
