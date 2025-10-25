import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, CheckCircle, AlertCircle, Sparkles as SparklesIcon, Droplet, Flame, CircleDot } from 'lucide-react';
import { Button } from '../ui/button';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { Confetti } from '../animations/Confetti';
import { CountUpNumber } from '../animations/CountUpNumber';
import { FloatingParticles } from '../animations/FloatingParticles';
import { useRipple, RippleContainer } from '../animations/Ripple';

interface SkinAnalysisResultProps {
  onChatWithAI: () => void;
  onBack: () => void;
}

export function SkinAnalysisResult({ onChatWithAI, onBack }: SkinAnalysisResultProps) {
  const { t } = useLanguage();
  const skinScore = 87;
  const [showConfetti, setShowConfetti] = useState(false);
  const { ripples, createRipple } = useRipple();

  // Show confetti if score is good (>= 80)
  useEffect(() => {
    if (skinScore >= 80) {
      setTimeout(() => {
        setShowConfetti(true);
      }, 800);
    }
  }, [skinScore]);

  const radarData = [
    { subject: t.wrinklesShort, value: 85, fullMark: 100 },
    { subject: t.rednessShort, value: 72, fullMark: 100 },
    { subject: t.skinToneShort, value: 88, fullMark: 100 },
    { subject: t.oilinessShort, value: 65, fullMark: 100 },
    { subject: t.eyeBagsShort, value: 78, fullMark: 100 },
    { subject: t.acneShort, value: 82, fullMark: 100 },
  ];

  const skinIssues = [
    { icon: SparklesIcon, label: t.smoothSkin, status: 'good' },
    { icon: Droplet, label: t.goodHydration, status: 'good' },
    { icon: Flame, label: t.mildRedness, status: 'warning' },
    { icon: CircleDot, label: t.darkSpots, status: 'warning' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/50 to-blue-50/30 pb-24 relative overflow-hidden">
      {/* Confetti Celebration */}
      <Confetti active={showConfetti} count={60} duration={4000} />

      {/* Simplified Background - No heavy morphing blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 -right-20 w-64 h-64 bg-pink-200/20 rounded-full" />
        <div className="absolute bottom-20 -left-20 w-60 h-60 bg-blue-200/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-52 h-52 bg-purple-200/20 rounded-full" />
      </div>

      {/* Reduce emoji particles */}
      <FloatingParticles 
        count={4}
        emojis={['✨', '💖']}
        useEmojis={true}
        containerClass="z-0"
      />

      {/* Header */}
      <div className="px-6 pt-12 pb-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button onClick={onBack} className="text-pink-500 mb-4">{t.backToHome}</button>
          <h1 className="text-gray-800 mb-2">{t.yourSkinAnalysis}</h1>
        </motion.div>
      </div>

      {/* Score Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-6 relative z-10"
      >
        <div className="bg-gradient-to-br from-pink-100 to-lavender-100 rounded-3xl p-8 text-center shadow-lg relative overflow-hidden">
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, #FFB5D9 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, #7DB8FF 0%, transparent 50%)',
                'radial-gradient(circle at 0% 100%, #CBB8FF 0%, transparent 50%)',
                'radial-gradient(circle at 100% 0%, #FFB5D9 0%, transparent 50%)',
                'radial-gradient(circle at 0% 0%, #FFB5D9 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          <div className="relative z-10">
            <motion.div 
              className="text-gray-600 mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t.skinScore}
            </motion.div>
            <motion.div 
              className="bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 bg-clip-text text-transparent mb-1"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.5, 
                type: "spring", 
                stiffness: 200,
                damping: 15
              }}
            >
              <CountUpNumber value={skinScore} duration={2} /> / 100
            </motion.div>
            <motion.div 
              className="inline-block bg-mint-100 text-mint-700 px-4 py-2 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.05 }}
            >
              {t.skinHealthStatus}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 mb-6 relative z-10"
      >
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
          <h3 className="text-gray-800 mb-4 text-center">{t.analysisOverviewTitle}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFB5D9" stopOpacity={0.8}/>
                  <stop offset="50%" stopColor="#CBB8FF" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="#7DB8FF" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <PolarGrid stroke="#FFD1E7" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Radar
                name={t.skinHealth}
                dataKey="value"
                stroke="#FFB5D9"
                fill="url(#radarGradient)"
                fillOpacity={0.6}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="px-6 mb-6 space-y-4 relative z-10">
        {/* Skin Type */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => { createRipple(e); }}
          className="bg-white rounded-2xl p-5 shadow-md border border-pink-100 cursor-pointer relative overflow-hidden"
        >
          <RippleContainer ripples={ripples} color="rgba(255, 181, 217, 0.3)" />
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <motion.div 
              className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center"
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xl">👤</span>
            </motion.div>
            <div>
              <div className="text-gray-500 text-sm">{t.skinType}</div>
              <div className="text-gray-800">{t.combinationSkin}</div>
            </div>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl p-5 shadow-md border border-mint-100 cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <motion.div 
              className="w-10 h-10 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.15, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <CheckCircle className="w-5 h-5 text-mint-600" />
            </motion.div>
            <div>
              <div className="text-gray-500 text-sm mb-1">{t.highlights}</div>
              <div className="text-gray-800">{t.smoothAndHydrated}</div>
            </div>
          </div>
        </motion.div>

        {/* Needs Improvement */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl p-5 shadow-md border border-peach-100 cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <motion.div 
              className="w-10 h-10 bg-peach-100 rounded-full flex items-center justify-center flex-shrink-0"
              whileHover={{ 
                scale: [1, 1.2, 1],
                rotate: [-5, 5, -5, 0]
              }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle className="w-5 h-5 text-peach-600" />
            </motion.div>
            <div>
              <div className="text-gray-500 text-sm mb-1">{t.needsImprovement}</div>
              <div className="text-gray-800">{t.mildRednessAndDarkSpots}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skin Issues Icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
        className="px-6 mb-6 relative z-10"
      >
        <div className="bg-white rounded-2xl p-5 shadow-md border border-lavender-100">
          <div className="text-gray-800 mb-4">{t.skinConditionDetail}</div>
          <div className="flex flex-wrap gap-3">
            {skinIssues.map((issue, index) => (
              <motion.div
                key={issue.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.8 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.1,
                  y: -2,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer ${
                  issue.status === 'good'
                    ? 'bg-mint-50 border border-mint-200'
                    : 'bg-peach-50 border border-peach-200'
                }`}
              >
                <motion.div 
                  whileHover={{ rotate: [0, -15, 15, -15, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <issue.icon className={`w-5 h-5 ${issue.status === 'good' ? 'text-mint-600' : 'text-peach-600'}`} />
                </motion.div>
                <span
                  className={issue.status === 'good' ? 'text-mint-700' : 'text-peach-700'}
                >
                  {issue.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Chat with AI Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 150 }}
        className="px-6 relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Button
            onClick={onChatWithAI}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-pink-400 via-lavender-400 to-blue-400 hover:from-pink-500 hover:via-lavender-500 hover:to-blue-500 text-white shadow-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <motion.div
              className="relative z-10 flex items-center justify-center"
              whileHover={{ x: [0, -2, 2, -2, 0] }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
              </motion.div>
              {t.chatWithDrSkinAI}
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}