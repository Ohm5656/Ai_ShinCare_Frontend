import { motion } from 'motion/react';
import { Camera, Scan, Droplet, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface SkinHomeDashboardProps {
  userName?: string;
  onStartScan: () => void;
}

export function SkinHomeDashboard({ userName = 'สุดา', onStartScan }: SkinHomeDashboardProps) {
  const skinScore = 87;

  const quickStats = [
    {
      icon: '🪞',
      label: 'ระดับริ้วรอย',
      score: 92,
      status: 'ดี',
      color: 'bg-green-100 text-green-700',
    },
    {
      icon: '🔴',
      label: 'สถานะสิว',
      score: 78,
      status: 'ปกติ',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      icon: '⚫',
      label: 'ฝ้า / จุดด่างดำ',
      score: 85,
      status: 'ดี',
      color: 'bg-green-100 text-green-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-gray-800 mb-1">ยินดีต้อนรับคุณ{userName} 👋</h2>
        </motion.div>
      </div>

      {/* Skin Score Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="px-6 mb-8"
      >
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="relative w-48 h-48 mx-auto mb-4">
            {/* Outer Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#F8E8EE"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(skinScore / 100) * 553} 553`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-pink-600 mb-1">คะแนนผิว</div>
              <div className="text-gray-900">{skinScore}</div>
              <div className="text-gray-500">/100</div>
            </div>
          </div>
          
          <p className="text-gray-600">ผิวของคุณดูสุขภาพดีมาก!</p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="px-6 mb-8 space-y-3">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            className="bg-white rounded-2xl p-5 shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{stat.icon}</span>
                <div>
                  <div className="text-gray-800">{stat.label}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs mt-1 ${stat.color}`}>
                    {stat.status}
                  </span>
                </div>
              </div>
              <div className="text-pink-600">{stat.score}</div>
            </div>
            <Progress value={stat.score} className="h-2" />
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="px-6"
      >
        <Button
          onClick={onStartScan}
          className="w-full h-16 rounded-2xl bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white shadow-xl text-lg"
        >
          <Camera className="w-6 h-6 mr-2" />
          📸 เริ่มสแกนใบหน้า
        </Button>
      </motion.div>
    </div>
  );
}
