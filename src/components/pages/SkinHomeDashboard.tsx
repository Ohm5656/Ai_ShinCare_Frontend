import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Sparkles, Heart, BarChart3, CircleDot, Waves, Flame, Palette, Droplets, Moon, ChevronsDown, Circle, Grid } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { FloatingParticles } from '../animations/FloatingParticles';

interface SkinHomeDashboardProps {
  userName?: string;
  onStartScan: () => void;
}

export function SkinHomeDashboard({ userName = 'Suda', onStartScan }: SkinHomeDashboardProps) {
  const [viewMode, setViewMode] = useState<'circular' | 'radar'>('circular');
  const { t } = useLanguage();
  const skinScore = 87;

  const quickStats = [
    {
      icon: Waves,
      label: t.wrinkles,
      score: 85,
      status: t.good,
      color: 'bg-mint-100 text-mint-700',
      gradient: 'from-mint-400 to-mint-500',
      iconColor: 'text-mint-600',
    },
    {
      icon: ChevronsDown,
      label: t.sagging,
      score: 80,
      status: t.good,
      color: 'bg-blue-100 text-blue-700',
      gradient: 'from-blue-400 to-blue-500',
      iconColor: 'text-blue-600',
    },
    {
      icon: CircleDot,
      label: t.darkSpots,
      score: 75,
      status: t.normal,
      color: 'bg-amber-100 text-amber-700',
      gradient: 'from-amber-400 to-amber-500',
      iconColor: 'text-amber-600',
    },
    {
      icon: Sparkles,
      label: t.acne,
      score: 82,
      status: t.good,
      color: 'bg-purple-100 text-purple-700',
      gradient: 'from-purple-400 to-purple-500',
      iconColor: 'text-purple-600',
    },
    {
      icon: Flame,
      label: t.redness,
      score: 72,
      status: t.normal,
      color: 'bg-rose-100 text-rose-700',
      gradient: 'from-rose-400 to-rose-500',
      iconColor: 'text-rose-600',
    },
    {
      icon: Circle,
      label: t.pores,
      score: 70,
      status: t.normal,
      color: 'bg-cyan-100 text-cyan-700',
      gradient: 'from-cyan-400 to-cyan-500',
      iconColor: 'text-cyan-600',
    },
    {
      icon: Palette,
      label: t.skinEvenness,
      score: 88,
      status: t.veryGood,
      color: 'bg-yellow-100 text-yellow-700',
      gradient: 'from-yellow-400 to-yellow-500',
      iconColor: 'text-yellow-600',
    },
  ];

  // Prepare data for radar chart - 7 metrics
  const radarData = [
    { subject: t.wrinklesShort, value: 85 },
    { subject: t.saggingShort, value: 80 },
    { subject: t.darkSpotsShort, value: 75 },
    { subject: t.acneShort, value: 82 },
    { subject: t.rednessShort, value: 72 },
    { subject: t.poresShort, value: 70 },
    { subject: t.skinEvennessShort, value: 88 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-blue-50 pb-28 relative">
      {/* Simplified decorations - Removed heavy animations */}
      <div className="absolute top-20 right-10 text-pink-200/50 pointer-events-none">
        <Heart className="w-16 h-16" fill="currentColor" />
      </div>

      <div className="absolute top-40 left-8 text-blue-200/40 pointer-events-none">
        <Sparkles className="w-12 h-12" />
      </div>

      {/* Header */}
      <div className="px-6 pt-12 pb-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="text-gray-500 text-sm mb-1">{t.homeGreeting}</p>
          <h2 className="text-gray-800 mb-2">{t.userName}{userName}</h2>
          <p className="text-gray-600 text-sm">{t.homeSubtitle}</p>
        </motion.div>
      </div>

      {/* Skin Score Card - Optimized Version */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="px-6 mb-6 relative z-10"
      >
        <div className="bg-white rounded-[32px] p-8 shadow-cute-xl border border-pink-100 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-transparent rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100 to-transparent rounded-full opacity-50"></div>
          
          <div className="relative">
            {/* Toggle Button - Simplified animation */}
            <div className="absolute -top-2 -right-2 z-20">
              <button
                onClick={() => setViewMode(viewMode === 'circular' ? 'radar' : 'circular')}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center shadow-cute-md hover:shadow-cute-lg hover:scale-110 transition-all duration-200"
              >
                {viewMode === 'circular' ? (
                  <BarChart3 className="w-5 h-5 text-white" />
                ) : (
                  <CircleDot className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === 'circular' ? (
                <motion.div
                  key="circular"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative w-56 h-56 mx-auto mb-6">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-blue-200 rounded-full opacity-30"></div>
                    
                    {/* SVG Circle */}
                    <svg className="w-full h-full transform -rotate-90 relative z-10">
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF99CB" />
                          <stop offset="50%" stopColor="#B79DFF" />
                          <stop offset="100%" stopColor="#7DB8FF" />
                        </linearGradient>
                      </defs>
                      
                      {/* Background circle */}
                      <circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke="#FFE8F3"
                        strokeWidth="16"
                        fill="none"
                        strokeLinecap="round"
                      />
                      
                      {/* Progress circle - Optimized animation */}
                      <motion.circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke="url(#scoreGradient)"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${(skinScore / 100) * 628} 628`}
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 628" }}
                        animate={{ strokeDasharray: `${(skinScore / 100) * 628} 628` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      />
                    </svg>
                    
                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        <div className="bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 bg-clip-text text-transparent text-sm mb-1 flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-pink-500" />
                          {t.skinScore}
                        </div>
                        <div className="text-5xl font-semibold bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 bg-clip-text text-transparent mb-1">
                          {skinScore}
                        </div>
                        <div className="text-gray-400 text-sm">/100</div>
                      </motion.div>
                    </div>
                  </div>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="text-gray-600 text-center"
                  >
                    {t.skinHealthy}
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="radar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-center text-gray-700 mb-4">
                    {t.analysisOverviewTitle}
                  </h3>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <defs>
                          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF99CB" stopOpacity={0.8} />
                            <stop offset="50%" stopColor="#B79DFF" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#7DB8FF" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <PolarGrid 
                          stroke="#E8D5F0" 
                          strokeWidth={1}
                        />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          tickLine={false}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]} 
                          tick={{ fill: '#9CA3AF', fontSize: 10 }}
                          tickCount={6}
                        />
                        <Radar
                          name={t.skinScore}
                          dataKey="value"
                          stroke="#FF99CB"
                          fill="url(#radarGradient)"
                          fillOpacity={0.6}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats - Cute Cards */}
      <div className="px-6 mb-6 space-y-3 relative z-10">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            whileHover={{ 
              scale: 1.03,
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-[24px] p-5 shadow-cute-md border border-pink-100/50 hover:shadow-cute-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <motion.div 
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-cute-sm`}
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <div className="text-gray-800 text-sm font-medium">{stat.label}</div>
                  <motion.span 
                    className={`inline-block px-3 py-1 rounded-full text-xs mt-1 ${stat.color} font-medium`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {stat.status}
                  </motion.span>
                </div>
              </div>
              <motion.div 
                className={`text-2xl font-semibold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.6 + index * 0.1, 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                {stat.score}
              </motion.div>
            </div>
            <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full relative`}
                initial={{ width: 0 }}
                animate={{ width: `${stat.score}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 1.5,
                    delay: 0.8 + index * 0.1,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button - Optimized version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="px-6 relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={onStartScan}
            className="w-full h-16 rounded-[28px] bg-gradient-to-r from-pink-400 via-lavender-400 to-blue-400 hover:from-pink-500 hover:via-lavender-500 hover:to-blue-500 text-white shadow-cute-xl hover:shadow-cute-xl transition-all duration-200 text-lg font-semibold relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            <div className="relative z-10 flex items-center justify-center">
              <Camera className="w-6 h-6 mr-2" />
              <span>{t.startScan}</span>
              <Sparkles className="w-5 h-5 ml-2" />
            </div>
          </Button>
        </motion.div>
        
        <motion.p 
          className="text-center text-gray-400 text-xs mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {t.quickScan}
        </motion.p>
      </motion.div>
    </div>
  );
}