import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  TrendingUp, Calendar, Award, ChevronRight, 
  Image as ImageIcon, Droplet, Circle, Scan, Sparkles, Star, Zap
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface HistoryPageProps {
  userName?: string;
}

type Timeframe = '7days' | '15days' | '30days';

export function HistoryPage({ userName = 'Suda' }: HistoryPageProps) {
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('7days');

  // Mock data for different timeframes - 6 metrics ตรงกับหน้า Analysis
  const progressData = {
    '7days': [
      { date: 'จ.', overall: 82, wrinkles: 83, redness: 70, tone: 86, oil: 80, eyeBags: 76, acne: 80 },
      { date: 'อ.', overall: 83, wrinkles: 84, redness: 71, tone: 87, oil: 78, eyeBags: 77, acne: 81 },
      { date: 'พ.', overall: 84, wrinkles: 84, redness: 71, tone: 87, oil: 76, eyeBags: 77, acne: 81 },
      { date: 'พฤ.', overall: 85, wrinkles: 85, redness: 72, tone: 88, oil: 74, eyeBags: 78, acne: 82 },
      { date: 'ศ.', overall: 86, wrinkles: 85, redness: 72, tone: 88, oil: 70, eyeBags: 78, acne: 82 },
      { date: 'ส.', overall: 86, wrinkles: 85, redness: 72, tone: 88, oil: 68, eyeBags: 78, acne: 82 },
      { date: 'อา.', overall: 87, wrinkles: 85, redness: 72, tone: 88, oil: 65, eyeBags: 78, acne: 82 },
    ],
    '15days': [
      { date: '1', overall: 75, wrinkles: 78, redness: 68, tone: 82, oil: 88, eyeBags: 72, acne: 76 },
      { date: '3', overall: 77, wrinkles: 79, redness: 69, tone: 83, oil: 86, eyeBags: 73, acne: 77 },
      { date: '5', overall: 78, wrinkles: 80, redness: 69, tone: 84, oil: 85, eyeBags: 74, acne: 78 },
      { date: '7', overall: 80, wrinkles: 82, redness: 70, tone: 85, oil: 83, eyeBags: 75, acne: 79 },
      { date: '9', overall: 82, wrinkles: 83, redness: 70, tone: 86, oil: 80, eyeBags: 76, acne: 80 },
      { date: '11', overall: 84, wrinkles: 84, redness: 71, tone: 87, oil: 76, eyeBags: 77, acne: 81 },
      { date: '13', overall: 85, wrinkles: 85, redness: 72, tone: 88, oil: 70, eyeBags: 78, acne: 82 },
      { date: '15', overall: 87, wrinkles: 85, redness: 72, tone: 88, oil: 65, eyeBags: 78, acne: 82 },
    ],
    '30days': [
      { date: '1', overall: 70, wrinkles: 73, redness: 65, tone: 78, oil: 92, eyeBags: 68, acne: 72 },
      { date: '5', overall: 72, wrinkles: 75, redness: 66, tone: 80, oil: 90, eyeBags: 70, acne: 74 },
      { date: '10', overall: 75, wrinkles: 78, redness: 68, tone: 82, oil: 88, eyeBags: 72, acne: 76 },
      { date: '15', overall: 78, wrinkles: 80, redness: 69, tone: 84, oil: 85, eyeBags: 74, acne: 78 },
      { date: '20', overall: 82, wrinkles: 83, redness: 70, tone: 86, oil: 80, eyeBags: 76, acne: 80 },
      { date: '25', overall: 85, wrinkles: 85, redness: 72, tone: 88, oil: 70, eyeBags: 78, acne: 82 },
      { date: '30', overall: 87, wrinkles: 85, redness: 72, tone: 88, oil: 65, eyeBags: 78, acne: 82 },
    ]
  };

  const timeframes = [
    { 
      id: '7days' as Timeframe, 
      label: '7 วัน', 
      emoji: '📅',
      description: 'สัปดาห์นี้',
      improvement: '+5',
      color: 'from-pink-400 to-pink-500'
    },
    { 
      id: '15days' as Timeframe, 
      label: '15 วัน', 
      emoji: '📊',
      description: '2 สัปดาห์',
      improvement: '+12',
      color: 'from-lavender-400 to-lavender-500'
    },
    { 
      id: '30days' as Timeframe, 
      label: '30 วัน', 
      emoji: '📈',
      description: 'เดือนนี้',
      improvement: '+17',
      color: 'from-blue-400 to-blue-500'
    },
  ];

  const metrics = [
    { id: 'overall', label: 'ภาพรวม', icon: TrendingUp, color: '#FF6B8F', gradient: 'from-pink-400 to-pink-500' },
    { id: 'wrinkles', label: 'ริ้วรอย', icon: Sparkles, color: '#73FFA3', gradient: 'from-mint-400 to-mint-500' },
    { id: 'redness', label: 'ความแดง', icon: Circle, color: '#FF8FAA', gradient: 'from-pink-400 to-pink-500' },
    { id: 'tone', label: 'โทนสีผิว', icon: Star, color: '#FFB350', gradient: 'from-peach-400 to-peach-500' },
    { id: 'oil', label: 'ความมัน', icon: Droplet, color: '#87A9FF', gradient: 'from-blue-400 to-blue-500' },
    { id: 'eyeBags', label: 'ถุงใต้ตา', icon: Scan, color: '#CBA9FF', gradient: 'from-lavender-400 to-lavender-500' },
    { id: 'acne', label: 'สิว', icon: Zap, color: '#BE93FF', gradient: 'from-purple-400 to-purple-500' },
  ];

  const pastScans = [
    {
      id: 1,
      date: 'วันนี้ 9:30 น.',
      score: 87,
      improvement: '+2',
      thumbnail: '🌸',
      topIssue: 'ความชุ่มชื้นดีเยี่ยม',
    },
    {
      id: 2,
      date: 'เมื่อวาน 8:15 น.',
      score: 85,
      improvement: '+1',
      thumbnail: '🌺',
      topIssue: 'เนื้อผิวดี',
    },
    {
      id: 3,
      date: '12 ต.ค. 2025',
      score: 84,
      improvement: '+2',
      thumbnail: '🌼',
      topIssue: 'ความยืดหยุ่นดีขึ้น',
    },
    {
      id: 4,
      date: '10 ต.ค. 2025',
      score: 82,
      improvement: '0',
      thumbnail: '🌻',
      topIssue: 'สภาพคงที่',
    },
  ];

  const beforeAfterGallery = [
    { id: 1, date: '1 ต.ค. → 14 ต.ค.', improvement: '+5', emoji: '✨' },
    { id: 2, date: '1 ก.ย. → 30 ก.ย.', improvement: '+8', emoji: '🌟' },
    { id: 3, date: '1 ส.ค. → 31 ส.ค.', improvement: '+6', emoji: '💫' },
  ];

  const currentMetric = metrics.find(m => m.id === selectedMetric);
  const currentTimeframe = timeframes.find(t => t.id === selectedTimeframe);
  const currentData = progressData[selectedTimeframe];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/30 to-blue-50 pb-28 relative overflow-hidden">
      {/* Cute floating decorations - Simplified for performance */}
      <div className="absolute top-20 right-10 text-pink-200 opacity-20">
        <Sparkles className="w-16 h-16" />
      </div>

      {/* Header */}
      <div className="px-6 pt-12 pb-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-gray-800 mb-2">ประวัติความก้าวหน้า 📊</h2>
          <p className="text-sm text-gray-600">ติดตามการพัฒนาผิวของคุณ ✨</p>
        </motion.div>
      </div>

      <div className="px-6 space-y-5 relative z-10">
        {/* Stats Summary - Cute Version */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="bg-white rounded-[32px] p-6 shadow-cute-xl border border-pink-100 relative overflow-hidden">
            {/* Decorative gradient overlay - Removed blur for performance */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100/50 to-transparent rounded-full"></div>
            
            <div className="grid grid-cols-3 gap-4 relative z-10">
              <div className="text-center">
                <div className="text-3xl bg-gradient-to-br from-pink-500 to-pink-600 bg-clip-text text-transparent mb-1 font-semibold">87</div>
                <p className="text-xs text-gray-500">คะแนนเฉลี่ย</p>
              </div>
              <div className="text-center border-x border-pink-100">
                <div className="text-3xl bg-gradient-to-br from-mint-500 to-mint-600 bg-clip-text text-transparent mb-1 font-semibold">+{currentTimeframe?.improvement}</div>
                <p className="text-xs text-gray-500">{currentTimeframe?.description}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-6 h-6 text-peach-500" fill="currentColor" />
                </div>
                <p className="text-xs text-gray-500">โทนสีผิว</p>
                <p className="text-xs text-mint-600 font-medium">ดีที่สุด ✨</p>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-pink-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender-100 to-blue-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-lavender-600" />
                </div>
                <p className="text-sm text-gray-600">สแกนล่าสุด: <span className="font-medium text-pink-600">วันนี้ 9:30 น.</span></p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Timeframe Selector - Super Cute! */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <div className="grid grid-cols-3 gap-3">
            {timeframes.map((timeframe, index) => {
              const isActive = selectedTimeframe === timeframe.id;
              return (
                <motion.button
                  key={timeframe.id}
                  onClick={() => setSelectedTimeframe(timeframe.id)}
                  className={`relative rounded-[24px] p-4 transition-all duration-300 ${
                    isActive
                      ? 'bg-white shadow-cute-lg scale-105'
                      : 'bg-white/60 hover:bg-white/80 shadow-cute-sm hover:shadow-cute-md'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  {isActive && (
                    <>
                      {/* Glow effect - Removed blur for performance */}
                      <motion.div
                        layoutId="timeframeGlow"
                        className={`absolute inset-0 bg-gradient-to-br ${timeframe.color} rounded-[24px] opacity-10`}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                      
                      {/* Border gradient */}
                      <motion.div
                        layoutId="timeframeBorder"
                        className={`absolute inset-0 bg-gradient-to-br ${timeframe.color} rounded-[24px] p-[2px]`}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        <div className="w-full h-full bg-white rounded-[23px]"></div>
                      </motion.div>
                    </>
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="text-2xl">
                      {timeframe.emoji}
                    </span>
                    <span className={`text-sm font-semibold transition-colors ${
                      isActive ? 'bg-gradient-to-br ' + timeframe.color + ' bg-clip-text text-transparent' : 'text-gray-600'
                    }`}>
                      {timeframe.label}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-xs font-medium bg-gradient-to-br ${timeframe.color} text-white px-2 py-0.5 rounded-full`}
                      >
                        {timeframe.improvement}
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Metric Filters - Cute Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const isActive = selectedMetric === metric.id;
              return (
                <motion.button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 shadow-cute-sm relative overflow-hidden flex-shrink-0 ${
                    isActive
                      ? 'text-white shadow-cute-md scale-105'
                      : 'bg-white text-gray-600 hover:shadow-cute-md hover:scale-102'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="metricBackground"
                      className={`absolute inset-0 bg-gradient-to-r ${metric.gradient}`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="text-sm relative z-10 font-medium">{metric.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Progress Chart - Enhanced with Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTimeframe + selectedMetric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white rounded-[32px] p-6 shadow-cute-xl border border-pink-100 relative overflow-hidden">
              {/* Decorative background - Removed blur for performance */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${currentMetric?.gradient} opacity-5 rounded-full`}></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentMetric?.gradient} flex items-center justify-center shadow-cute-sm`}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-semibold">แนวโน้ม {currentTimeframe?.label}</h4>
                    <p className="text-xs text-gray-500">{currentMetric?.label}</p>
                  </div>
                </div>
                <Badge className={`bg-gradient-to-r ${currentMetric?.gradient} text-white border-0 shadow-cute-sm px-3 py-1`}>
                  {currentTimeframe?.improvement} คะแนน ✨
                </Badge>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentMetric?.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={currentMetric?.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FFE4EA" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: '#FFE4EA' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                    domain={[60, 95]}
                    tickLine={false}
                    axisLine={{ stroke: '#FFE4EA' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 8px 24px rgba(255, 182, 193, 0.2)',
                      padding: '12px 16px',
                    }}
                    labelStyle={{
                      color: '#5A4A42',
                      fontWeight: 600,
                      marginBottom: '4px'
                    }}
                    itemStyle={{
                      color: currentMetric?.color,
                      fontWeight: 500
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={currentMetric?.color}
                    strokeWidth={3}
                    fill={`url(#gradient-${selectedMetric})`}
                    dot={{ 
                      fill: currentMetric?.color, 
                      r: 5,
                      strokeWidth: 2,
                      stroke: 'white'
                    }}
                    activeDot={{ 
                      r: 7,
                      strokeWidth: 3,
                      stroke: 'white',
                      fill: currentMetric?.color
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Past Scans Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-white rounded-[32px] p-6 shadow-cute-lg border border-pink-100">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-gray-800 font-semibold flex items-center gap-2">
                <span>ประวัติการสแกน</span>
                <span className="text-lg">📝</span>
              </h4>
              <Button variant="ghost" className="text-sm text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-full px-4">
                ดูทั้งหมด
              </Button>
            </div>

            <div className="space-y-3">
              {pastScans.map((scan, index) => (
                <motion.div 
                  key={scan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <div className="flex items-center gap-4 py-3 hover:bg-pink-50/50 rounded-2xl px-2 -mx-2 transition-colors cursor-pointer">
                    <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-pink-100 via-lavender-100 to-blue-100 flex items-center justify-center text-2xl shadow-cute-sm">
                      {scan.thumbnail}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-800 font-medium text-sm">{scan.date}</p>
                        {scan.improvement !== '0' && (
                          <Badge className="bg-mint-100 text-mint-700 border-0 text-xs font-semibold">
                            {scan.improvement}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{scan.topIssue}</p>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl bg-gradient-to-br from-pink-500 to-pink-600 bg-clip-text text-transparent font-semibold mb-1">{scan.score}</div>
                      <p className="text-xs text-gray-400">คะแนน</p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-pink-300" />
                  </div>
                  {index < pastScans.length - 1 && (
                    <div className="h-px bg-pink-100 ml-[72px]" />
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Before & After Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-lavender-100 via-pink-100 to-peach-100 rounded-[32px] p-6 shadow-cute-lg border-0 relative overflow-hidden">
            {/* Decorative elements - Removed blur for performance */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full"></div>
            
            <div className="flex items-center gap-2 mb-5 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-lavender-600" />
              </div>
              <h4 className="text-gray-800 font-semibold">แกลเลอรี่ก่อน-หลัง ✨</h4>
            </div>

            <div className="grid grid-cols-1 gap-3 relative z-10">
              {beforeAfterGallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="bg-white/90 rounded-[24px] p-4 flex items-center justify-between hover:bg-white hover:shadow-cute-md transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-lavender-200 via-pink-200 to-peach-200 flex items-center justify-center text-2xl shadow-cute-sm">
                      {item.emoji}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm">{item.date}</p>
                      <p className="text-sm text-mint-600 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        ดีขึ้น {item.improvement} คะแนน
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-lavender-400" />
                </motion.div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-4 border-lavender-300 text-lavender-700 hover:bg-white/80 rounded-[20px] h-12 font-semibold bg-white/80 shadow-cute-sm"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              ดูแกลเลอรี่ทั้งหมด 🖼️
            </Button>
          </Card>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center pb-4"
        >
          <div className="bg-white rounded-[32px] p-6 shadow-cute-lg border border-pink-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-transparent to-blue-50 opacity-50"></div>
            <p className="text-4xl mb-3 relative z-10">
              🎉
            </p>
            <p className="text-gray-700 mb-1 font-semibold relative z-10">ทำได้ดีมากค่ะคุณ{userName}!</p>
            <p className="text-sm text-gray-500 relative z-10">
              คุณพัฒนาคะแนนผิวไปแล้ว <span className="font-semibold text-pink-600">+17 คะแนน</span> ในเดือนนี้ ✨
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
