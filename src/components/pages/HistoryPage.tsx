import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  TrendingUp, Calendar, Award, ChevronRight, 
  Image as ImageIcon, Sparkles, Waves, Flame, 
  Palette, Droplets, Moon, CircleDot, ChevronsDown, Circle
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';

interface HistoryPageProps {
  userName?: string;
  onViewScanDetail?: (scanId: number) => void;
  onViewAllScans?: () => void;
  onViewGallery?: (dateRange?: string) => void;
}

type Timeframe = '7days' | '15days' | '30days';

export function HistoryPage({ userName = 'Suda', onViewScanDetail, onViewAllScans, onViewGallery }: HistoryPageProps) {
  const { t } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('7days');

  // Mock data for different timeframes - 6 metrics ตรงกับหน้า Analysis
  const progressData = {
    '7days': [
      { date: t.dayMon, overall: 82, wrinkles: 83, sagging: 79, darkSpots: 74, acne: 80, redness: 70, pores: 75, evenness: 86 },
      { date: t.dayTue, overall: 83, wrinkles: 84, sagging: 80, darkSpots: 75, acne: 81, redness: 71, pores: 76, evenness: 87 },
      { date: t.dayWed, overall: 84, wrinkles: 84, sagging: 80, darkSpots: 75, acne: 81, redness: 71, pores: 76, evenness: 87 },
      { date: t.dayThu, overall: 85, wrinkles: 85, sagging: 81, darkSpots: 76, acne: 82, redness: 72, pores: 77, evenness: 88 },
      { date: t.dayFri, overall: 86, wrinkles: 85, sagging: 81, darkSpots: 76, acne: 82, redness: 72, pores: 77, evenness: 88 },
      { date: t.daySat, overall: 86, wrinkles: 85, sagging: 81, darkSpots: 76, acne: 82, redness: 72, pores: 78, evenness: 88 },
      { date: t.daySun, overall: 87, wrinkles: 85, sagging: 82, darkSpots: 77, acne: 82, redness: 72, pores: 78, evenness: 88 },
    ],
    '15days': [
      { date: '1', overall: 75, wrinkles: 78, sagging: 75, darkSpots: 70, acne: 76, redness: 68, pores: 71, evenness: 82 },
      { date: '3', overall: 77, wrinkles: 79, sagging: 76, darkSpots: 71, acne: 77, redness: 69, pores: 72, evenness: 83 },
      { date: '5', overall: 78, wrinkles: 80, sagging: 77, darkSpots: 72, acne: 78, redness: 69, pores: 73, evenness: 84 },
      { date: '7', overall: 80, wrinkles: 82, sagging: 78, darkSpots: 73, acne: 79, redness: 70, pores: 74, evenness: 85 },
      { date: '9', overall: 82, wrinkles: 83, sagging: 79, darkSpots: 74, acne: 80, redness: 70, pores: 75, evenness: 86 },
      { date: '11', overall: 84, wrinkles: 84, sagging: 80, darkSpots: 75, acne: 81, redness: 71, pores: 76, evenness: 87 },
      { date: '13', overall: 85, wrinkles: 85, sagging: 81, darkSpots: 76, acne: 82, redness: 72, pores: 77, evenness: 88 },
      { date: '15', overall: 87, wrinkles: 85, sagging: 82, darkSpots: 77, acne: 82, redness: 72, pores: 78, evenness: 88 },
    ],
    '30days': [
      { date: '1', overall: 70, wrinkles: 73, sagging: 70, darkSpots: 65, acne: 72, redness: 65, pores: 66, evenness: 78 },
      { date: '5', overall: 72, wrinkles: 75, sagging: 72, darkSpots: 67, acne: 74, redness: 66, pores: 68, evenness: 80 },
      { date: '10', overall: 75, wrinkles: 78, sagging: 75, darkSpots: 70, acne: 76, redness: 68, pores: 71, evenness: 82 },
      { date: '15', overall: 78, wrinkles: 80, sagging: 77, darkSpots: 72, acne: 78, redness: 69, pores: 73, evenness: 84 },
      { date: '20', overall: 82, wrinkles: 83, sagging: 79, darkSpots: 74, acne: 80, redness: 70, pores: 75, evenness: 86 },
      { date: '25', overall: 85, wrinkles: 85, sagging: 81, darkSpots: 76, acne: 82, redness: 72, pores: 77, evenness: 88 },
      { date: '30', overall: 87, wrinkles: 85, sagging: 82, darkSpots: 77, acne: 82, redness: 72, pores: 78, evenness: 88 },
    ]
  };

  const timeframes = [
    { 
      id: '7days' as Timeframe, 
      label: t.days7, 
      emoji: '📅',
      description: t.thisWeek,
      improvement: '+5',
      color: 'from-pink-400 to-pink-500'
    },
    { 
      id: '15days' as Timeframe, 
      label: t.days15, 
      emoji: '📊',
      description: t.twoWeeks,
      improvement: '+12',
      color: 'from-lavender-400 to-lavender-500'
    },
    { 
      id: '30days' as Timeframe, 
      label: t.days30, 
      emoji: '📈',
      description: t.thisMonth,
      improvement: '+17',
      color: 'from-blue-400 to-blue-500'
    },
  ];

  const metrics = [
    { id: 'overall', label: t.overview, icon: TrendingUp, color: '#FF99CB', gradient: 'from-pink-400 to-pink-500' },
    { id: 'wrinkles', label: t.wrinkles, icon: Waves, color: '#73FFA3', gradient: 'from-mint-400 to-mint-500' },
    { id: 'sagging', label: t.sagging, icon: ChevronsDown, color: '#7DB8FF', gradient: 'from-blue-400 to-blue-500' },
    { id: 'darkSpots', label: t.darkSpots, icon: CircleDot, color: '#FFB350', gradient: 'from-amber-400 to-amber-500' },
    { id: 'acne', label: t.acne, icon: Sparkles, color: '#B79DFF', gradient: 'from-purple-400 to-purple-500' },
    { id: 'redness', label: t.redness, icon: Flame, color: '#FF8B94', gradient: 'from-rose-400 to-rose-500' },
    { id: 'pores', label: t.pores, icon: Circle, color: '#6DD5ED', gradient: 'from-cyan-400 to-cyan-500' },
    { id: 'evenness', label: t.skinEvenness, icon: Palette, color: '#FED766', gradient: 'from-yellow-400 to-yellow-500' },
  ];

  const pastScans = [
    {
      id: 1,
      date: `${t.today} 9:30 ${t.am}`,
      score: 87,
      improvement: '+2',
      thumbnail: '🌸',
      topIssue: t.language === 'th' ? 'ความสม่ำเสมอดีเยี่ยม' : t.language === 'en' ? 'Excellent evenness' : '均匀度极佳',
    },
    {
      id: 2,
      date: `${t.yesterday} 8:15 ${t.am}`,
      score: 85,
      improvement: '+1',
      thumbnail: '🌺',
      topIssue: t.language === 'th' ? 'รูขุมขนดีขึ้น' : t.language === 'en' ? 'Pores improved' : '毛孔改善',
    },
    {
      id: 3,
      date: t.language === 'th' ? '12 ต.ค. 2025' : t.language === 'en' ? 'Oct 12, 2025' : '2025年10月12日',
      score: 84,
      improvement: '+2',
      thumbnail: '🌼',
      topIssue: t.elasticityImproved,
    },
    {
      id: 4,
      date: t.language === 'th' ? '10 ต.ค. 2025' : t.language === 'en' ? 'Oct 10, 2025' : '2025年10月10日',
      score: 82,
      improvement: '0',
      thumbnail: '🌻',
      topIssue: t.steady,
    },
  ];

  const beforeAfterGallery = [
    { 
      id: 1, 
      date: t.language === 'th' ? '1 ต.ค. → 14 ต.ค.' : t.language === 'en' ? 'Oct 1 → Oct 14' : '10月1日 → 10月14日', 
      improvement: '+5', 
      emoji: '✨' 
    },
    { 
      id: 2, 
      date: t.language === 'th' ? '1 ก.ย. → 30 ก.ย.' : t.language === 'en' ? 'Sep 1 → Sep 30' : '9月1日 → 9月30日', 
      improvement: '+8', 
      emoji: '🌟' 
    },
    { 
      id: 3, 
      date: t.language === 'th' ? '1 ส.ค. → 31 ส.ค.' : t.language === 'en' ? 'Aug 1 → Aug 31' : '8月1日 → 8月31日', 
      improvement: '+6', 
      emoji: '💫' 
    },
  ];

  const currentMetric = metrics.find(m => m.id === selectedMetric);
  const currentTimeframe = timeframes.find(t => t.id === selectedTimeframe);
  const currentData = progressData[selectedTimeframe];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/50 to-blue-50/30 pb-28 relative">
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
          <h2 className="text-gray-800 mb-2">{t.progressHistory}</h2>
          <p className="text-sm text-gray-600">{t.trackYourProgress}</p>
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
            
            <div className="grid grid-cols-4 gap-3 relative z-10">
              <div className="text-center">
                <div className="text-3xl bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent mb-1 font-semibold">12</div>
                <p className="text-xs text-gray-500">{t.totalScans}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl bg-gradient-to-br from-pink-500 to-pink-600 bg-clip-text text-transparent mb-1 font-semibold">79</div>
                <p className="text-xs text-gray-500">{t.averageScore}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl bg-gradient-to-br from-lavender-500 to-purple-600 bg-clip-text text-transparent mb-1 font-semibold">87</div>
                <p className="text-xs text-gray-500">{t.latestScore}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl bg-gradient-to-br from-mint-500 to-mint-600 bg-clip-text text-transparent mb-1 font-semibold">+{currentTimeframe?.improvement}</div>
                <p className="text-xs text-gray-500">{t.improved}</p>
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
                  whileHover={!isActive ? { 
                    scale: 1.05,
                    y: -2,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  } : {}}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { type: "spring", stiffness: 400, damping: 15 }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05, type: "spring", stiffness: 150 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="metricBackground"
                      className={`absolute inset-0 bg-gradient-to-r ${metric.gradient}`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <metric.icon className="w-4 h-4 relative z-10" />
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
            <Card className="bg-white rounded-[32px] p-6 shadow-cute-xl border border-blue-100 relative overflow-hidden">
              {/* Decorative background - Removed blur for performance */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${currentMetric?.gradient} opacity-5 rounded-full`}></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentMetric?.gradient} flex items-center justify-center shadow-cute-sm`}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-semibold">{t.trend} {currentTimeframe?.label}</h4>
                    <p className="text-xs text-gray-500">{currentMetric?.label}</p>
                  </div>
                </div>
                <Badge className={`bg-gradient-to-r ${currentMetric?.gradient} text-white border-0 shadow-cute-sm px-3 py-1`}>
                  {currentTimeframe?.improvement} {t.points} ✨
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#C3DFFF" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: '#C3DFFF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                    domain={[60, 95]}
                    tickLine={false}
                    axisLine={{ stroke: '#C3DFFF' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 8px 24px rgba(125, 184, 255, 0.2)',
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
          <Card className="bg-white rounded-[32px] p-6 shadow-cute-lg border border-blue-100">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-gray-800 font-semibold flex items-center gap-2">
                <span>{t.scanHistory}</span>
                <span className="text-lg">📝</span>
              </h4>
              <Button 
                variant="ghost" 
                className="text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-4"
                onClick={onViewAllScans}
              >
                {t.viewAll}
              </Button>
            </div>

            <div className="space-y-3">
              {pastScans.map((scan, index) => (
                <motion.div 
                  key={scan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.4 + index * 0.08,
                    type: "spring",
                    stiffness: 150,
                    damping: 20
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    x: 4,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    onClick={() => onViewScanDetail?.(scan.id)}
                    className="flex items-center gap-4 py-3 hover:bg-pink-50/50 rounded-2xl px-2 -mx-2 transition-colors cursor-pointer"
                  >
                    <motion.div 
                      className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-pink-100 via-lavender-100 to-blue-100 flex items-center justify-center text-2xl shadow-cute-sm"
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.1,
                        transition: { duration: 0.5 }
                      }}
                    >
                      {scan.thumbnail}
                    </motion.div>
                    
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
                      <div className="text-2xl bg-gradient-to-br from-pink-500 to-lavender-500 bg-clip-text text-transparent font-semibold mb-1">{scan.score}</div>
                      <p className="text-xs text-gray-400">{t.score}</p>
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
              <h4 className="text-gray-800 font-semibold">{t.gallery}</h4>
            </div>

            <div className="grid grid-cols-1 gap-3 relative z-10">
              {beforeAfterGallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  onClick={() => onViewGallery?.(item.date)}
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
                        {t.improvedBy} {item.improvement} {t.points}
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
              onClick={() => onViewGallery?.()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {t.viewAllGallery}
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
          <div className="bg-white rounded-[32px] p-6 shadow-cute-lg border border-blue-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-lavender-50 opacity-50"></div>
            <p className="text-4xl mb-3 relative z-10">
              🎉
            </p>
            <p className="text-gray-700 mb-1 font-semibold relative z-10">{t.greatJobName.replace('{name}', userName)}</p>
            <p className="text-sm text-gray-500 relative z-10">
              {t.youImprovedPoints} <span className="font-semibold text-blue-600">+17 {t.points}</span> {t.improvementThis}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}