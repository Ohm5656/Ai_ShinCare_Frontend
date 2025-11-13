import { motion } from 'motion/react';
import { ArrowLeft, Calendar, TrendingUp, Sparkles, CheckCircle, AlertCircle, Waves, Flame, Palette, Droplets, Moon, CircleDot, ChevronsDown, Circle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';

export interface ScanDetail {
  id: number;
  date: string;
  score: number;
  improvement: string;
  thumbnail: string;
  topIssue: string;
  metrics: {
    wrinkles: number;
    sagging: number;
    darkSpots: number;
    acne: number;
    redness: number;
    pores: number;
    evenness: number;
  };
}

interface ScanDetailPageProps {
  scanData: ScanDetail;
  onBack: () => void;
}

export function ScanDetailPage({ scanData, onBack }: ScanDetailPageProps) {
  const { t } = useLanguage();
  
  const radarData = [
    { subject: t.wrinkles, value: scanData.metrics.wrinkles, fullMark: 100 },
    { subject: t.sagging, value: scanData.metrics.sagging, fullMark: 100 },
    { subject: t.darkSpots, value: scanData.metrics.darkSpots, fullMark: 100 },
    { subject: t.acne, value: scanData.metrics.acne, fullMark: 100 },
    { subject: t.redness, value: scanData.metrics.redness, fullMark: 100 },
    { subject: t.pores, value: scanData.metrics.pores, fullMark: 100 },
    { subject: t.skinEvenness, value: scanData.metrics.evenness, fullMark: 100 },
  ];

  const metricDetails = [
    {
      label: t.wrinkles,
      value: scanData.metrics.wrinkles,
      icon: Waves,
      color: 'mint',
      status: scanData.metrics.wrinkles >= 80 ? t.good : scanData.metrics.wrinkles >= 60 ? t.normal : t.needsImprovement
    },
    {
      label: t.sagging,
      value: scanData.metrics.sagging,
      icon: ChevronsDown,
      color: 'blue',
      status: scanData.metrics.sagging >= 80 ? t.good : scanData.metrics.sagging >= 60 ? t.normal : t.needsImprovement
    },
    {
      label: t.darkSpots,
      value: scanData.metrics.darkSpots,
      icon: CircleDot,
      color: 'amber',
      status: scanData.metrics.darkSpots >= 80 ? t.good : scanData.metrics.darkSpots >= 60 ? t.normal : t.needsImprovement
    },
    {
      label: t.acne,
      value: scanData.metrics.acne,
      icon: Sparkles,
      color: 'purple',
      status: scanData.metrics.acne >= 80 ? t.good : scanData.metrics.acne >= 60 ? t.normal : t.needsImprovement
    },
    {
      label: t.redness,
      value: scanData.metrics.redness,
      icon: Flame,
      color: 'rose',
      status: scanData.metrics.redness >= 80 ? t.good : scanData.metrics.redness >= 60 ? t.normal : t.needsImprovement
    },
    {
      label: t.pores,
      value: scanData.metrics.pores,
      icon: Circle,
      color: 'cyan',
      status: scanData.metrics.pores >= 80 ? t.good : scanData.metrics.pores >= 60 ? t.normal : t.needsImprovement
    },
    {
      label: t.skinEvenness,
      value: scanData.metrics.evenness,
      icon: Palette,
      color: 'yellow',
      status: scanData.metrics.evenness >= 80 ? t.veryGoodStatus : scanData.metrics.evenness >= 60 ? t.normal : t.needsImprovement
    },
  ];

  const getScoreStatus = (score: number) => {
    if (score >= 85) return { text: t.skinVeryHealthy, color: 'mint', icon: '✨' };
    if (score >= 70) return { text: t.skinHealthyStatus, color: 'blue', icon: '💙' };
    if (score >= 50) return { text: t.fairStatus, color: 'peach', icon: '⚠️' };
    return { text: t.needsImprovement, color: 'red', icon: '⚠️' };
  };

  const scoreStatus = getScoreStatus(scanData.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/50 to-blue-50/30 pb-24">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-pink-100">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-pink-600" />
          </button>
          <div className="flex-1">
            <h3 className="text-gray-800">{t.scanDetails}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{scanData.date}</span>
            </div>
          </div>
          {scanData.improvement !== '0' && (
            <Badge className="bg-mint-100 text-mint-700 border-0">
              {scanData.improvement}
            </Badge>
          )}
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">
        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-pink-100 via-lavender-100 to-blue-100 rounded-3xl p-8 text-center shadow-cute-lg border border-pink-200 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="text-3xl">{scanData.thumbnail}</span>
              </div>
              <div className="text-gray-600 mb-2">{t.skinScore}</div>
              <div className="text-6xl bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 bg-clip-text text-transparent mb-3 font-semibold">
                {scanData.score}
              </div>
              <div className={`inline-block bg-${scoreStatus.color}-100 text-${scoreStatus.color}-700 px-6 py-2.5 rounded-full shadow-cute-sm`}>
                <span className="mr-2">{scoreStatus.icon}</span>
                {scoreStatus.text}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Top Issue/Achievement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-5 shadow-cute-lg border border-mint-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-mint-600" />
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">{t.overallSkinCondition}</div>
                <div className="text-gray-800 font-medium">{scanData.topIssue}</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-cute-lg border border-pink-100">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <h4 className="text-gray-800 font-semibold">{t.analysisOverviewDetail}</h4>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <defs>
                  <linearGradient id="radarGradientDetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFB5D9" stopOpacity={0.8}/>
                    <stop offset="50%" stopColor="#CBB8FF" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#7DB8FF" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <PolarGrid stroke="#FFD1E7" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 500 }} 
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                />
                <Radar
                  name={t.skinHealth}
                  dataKey="value"
                  stroke="#FFB5D9"
                  fill="url(#radarGradientDetail)"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Detailed Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3 px-1">
            <TrendingUp className="w-5 h-5 text-pink-500" />
            <h4 className="text-gray-800 font-semibold">{t.detailsByMetric}</h4>
          </div>
          <div className="space-y-3">
            {metricDetails.map((metric, index) => {
              const colorClasses = {
                mint: { bg: 'bg-mint-100', text: 'text-mint-700', gradient: 'from-mint-400 to-mint-500' },
                pink: { bg: 'bg-pink-100', text: 'text-pink-700', gradient: 'from-pink-400 to-pink-500' },
                rose: { bg: 'bg-rose-100', text: 'text-rose-700', gradient: 'from-rose-400 to-rose-500' },
                blue: { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-400 to-blue-500' },
                lavender: { bg: 'bg-lavender-100', text: 'text-lavender-700', gradient: 'from-lavender-400 to-lavender-500' },
                purple: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-400 to-purple-500' },
                amber: { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-400 to-amber-500' },
                cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', gradient: 'from-cyan-400 to-cyan-500' },
                yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', gradient: 'from-yellow-400 to-yellow-500' },
              };
              const colors = colorClasses[metric.color as keyof typeof colorClasses];

              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Card className="bg-white rounded-[24px] p-4 shadow-cute-md border border-pink-100/50 hover:shadow-cute-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-cute-sm`}>
                          <metric.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-gray-800 font-medium">{metric.label}</div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs mt-1 ${colors.bg} ${colors.text} font-medium`}>
                            {metric.status}
                          </span>
                        </div>
                      </div>
                      <div className={`text-2xl font-semibold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                        {metric.value}
                      </div>
                    </div>
                    <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-3 pt-2"
        >
          <Button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-pink-400 via-lavender-400 to-blue-400 hover:from-pink-500 hover:via-lavender-500 hover:to-blue-500 text-white rounded-[28px] py-6 shadow-cute-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t.backToHistory}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}