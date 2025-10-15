import { motion } from 'motion/react';
import { Camera, Sparkles, Heart, Star, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface SkinHomeDashboardProps {
  userName?: string;
  onStartScan: () => void;
}

export function SkinHomeDashboard({ userName = 'Suda', onStartScan }: SkinHomeDashboardProps) {
  const skinScore = 87;

  const quickStats = [
    {
      icon: '✨',
      label: 'ริ้วรอย',
      score: 85,
      status: 'ดี',
      color: 'bg-mint-100 text-mint-700',
      gradient: 'from-mint-400 to-mint-500',
    },
    {
      icon: '🔴',
      label: 'ความแดง',
      score: 72,
      status: 'ปกติ',
      color: 'bg-pink-100 text-pink-700',
      gradient: 'from-pink-400 to-pink-500',
    },
    {
      icon: '🌟',
      label: 'โทนสีผิว',
      score: 88,
      status: 'ดีมาก!',
      color: 'bg-peach-100 text-peach-700',
      gradient: 'from-peach-400 to-peach-500',
    },
    {
      icon: '💧',
      label: 'ความมัน',
      score: 65,
      status: 'พอใช้',
      color: 'bg-blue-100 text-blue-700',
      gradient: 'from-blue-400 to-blue-500',
    },
    {
      icon: '👁️',
      label: 'ถุงใต้ตา',
      score: 78,
      status: 'ปกติ',
      color: 'bg-lavender-100 text-lavender-700',
      gradient: 'from-lavender-400 to-lavender-500',
    },
    {
      icon: '🌸',
      label: 'สิว',
      score: 82,
      status: 'ดี',
      color: 'bg-purple-100 text-purple-700',
      gradient: 'from-purple-400 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/30 to-blue-50 pb-28 relative overflow-hidden">
      {/* Cute floating decorations - Simplified for performance */}
      <div className="absolute top-20 right-10 text-pink-200 opacity-30">
        <Heart className="w-16 h-16" fill="currentColor" />
      </div>

      <div className="absolute top-40 left-8 text-lavender-200 opacity-20">
        <Sparkles className="w-12 h-12" />
      </div>

      {/* Header */}
      <div className="px-6 pt-12 pb-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-gray-500 text-sm mb-1">สวัสดี! 👋</p>
          <h2 className="text-gray-800 mb-2">คุณ{userName}</h2>
          <p className="text-gray-600 text-sm">ผิวของคุณวันนี้เป็นอย่างไรบ้าง? ✨</p>
        </motion.div>
      </div>

      {/* Skin Score Card - Cute Version */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        className="px-6 mb-6 relative z-10"
      >
        <div className="bg-white rounded-[32px] p-8 shadow-cute-xl border border-pink-100 relative overflow-hidden">
          {/* Decorative elements - Removed blur for performance */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-transparent rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100 to-transparent rounded-full opacity-50"></div>
          
          <div className="relative">
            {/* Cute floating icons - Simplified for performance */}
            <div className="absolute -top-2 -right-2">
              <Star className="w-6 h-6 text-peach-400" fill="currentColor" />
            </div>

            <div className="relative w-56 h-56 mx-auto mb-6">
              {/* Outer glow - Removed blur for performance */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-blue-200 rounded-full opacity-30"></div>
              
              {/* SVG Circle */}
              <svg className="w-full h-full transform -rotate-90 relative z-10">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF8FAA" />
                    <stop offset="50%" stopColor="#BE93FF" />
                    <stop offset="100%" stopColor="#87A9FF" />
                  </linearGradient>
                </defs>
                
                {/* Background circle */}
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="#FFE4EA"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                />
                
                {/* Progress circle */}
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
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                >
                  <div className="text-pink-500 text-sm mb-1 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    คะแนนผิว
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
              transition={{ delay: 1 }}
              className="text-gray-600 text-center"
            >
              ผิวของคุณดูสุขภาพดีมาก! 🌟
            </motion.p>
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
            className="bg-white rounded-[24px] p-5 shadow-cute-md border border-pink-100/50 hover:shadow-cute-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-cute-sm`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div>
                  <div className="text-gray-800 text-sm font-medium">{stat.label}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs mt-1 ${stat.color} font-medium`}>
                    {stat.status}
                  </span>
                </div>
              </div>
              <div className={`text-2xl font-semibold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.score}
              </div>
            </div>
            <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${stat.score}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button - Extra Cute */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="px-6 relative z-10"
      >
        <Button
          onClick={onStartScan}
          className="w-full h-16 rounded-[28px] bg-gradient-to-r from-pink-400 via-lavender-400 to-blue-400 hover:from-pink-500 hover:via-lavender-500 hover:to-blue-500 text-white shadow-cute-xl hover:shadow-cute-xl hover:scale-105 transition-all duration-300 text-lg font-semibold relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <Camera className="w-6 h-6 mr-2 relative z-10" />
          <span className="relative z-10">📸 เริ่มสแกนใบหน้า</span>
          <Sparkles className="w-5 h-5 ml-2 relative z-10" />
        </Button>
        
        <p className="text-center text-gray-400 text-xs mt-3">
          แค่ 30 วินาที รู้ผลทันที! ✨
        </p>
      </motion.div>
    </div>
  );
}
