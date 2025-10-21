import { motion } from 'motion/react';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';

interface SkinAnalysisResultProps {
  onChatWithAI: () => void;
  onBack: () => void;
}

export function SkinAnalysisResult({ onChatWithAI, onBack }: SkinAnalysisResultProps) {
  const { t } = useLanguage();
  const skinScore = 87;

  const radarData = [
    { subject: t.wrinklesShort, value: 85, fullMark: 100 },
    { subject: t.rednessShort, value: 72, fullMark: 100 },
    { subject: t.skinToneShort, value: 88, fullMark: 100 },
    { subject: t.oilinessShort, value: 65, fullMark: 100 },
    { subject: t.eyeBagsShort, value: 78, fullMark: 100 },
    { subject: t.acneShort, value: 82, fullMark: 100 },
  ];

  const skinIssues = [
    { emoji: '✨', label: t.smoothSkin, status: 'good' },
    { emoji: '💧', label: t.goodHydration, status: 'good' },
    { emoji: '🔴', label: t.mildRedness, status: 'warning' },
    { emoji: '⚫', label: t.darkSpots, status: 'warning' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/50 to-blue-50/30 pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
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
        className="px-6 mb-6"
      >
        <div className="bg-gradient-to-br from-pink-100 to-lavender-100 rounded-3xl p-8 text-center shadow-lg">
          <div className="text-gray-600 mb-2">{t.skinScore}</div>
          <div className="bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 bg-clip-text text-transparent mb-1">{skinScore} / 100</div>
          <div className="inline-block bg-mint-100 text-mint-700 px-4 py-2 rounded-full">
            {t.skinHealthStatus}
          </div>
        </div>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 mb-6"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6 mb-6 space-y-4"
      >
        {/* Skin Type */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-pink-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <div className="text-gray-500 text-sm">{t.skinType}</div>
              <div className="text-gray-800">{t.combinationSkin}</div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-mint-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-mint-600" />
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">{t.highlights}</div>
              <div className="text-gray-800">{t.smoothAndHydrated}</div>
            </div>
          </div>
        </div>

        {/* Needs Improvement */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-peach-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-peach-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-peach-600" />
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">{t.needsImprovement}</div>
              <div className="text-gray-800">{t.mildRednessAndDarkSpots}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skin Issues Icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-2xl p-5 shadow-md border border-lavender-100">
          <div className="text-gray-800 mb-4">{t.skinConditionDetail}</div>
          <div className="flex flex-wrap gap-3">
            {skinIssues.map((issue) => (
              <div
                key={issue.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  issue.status === 'good'
                    ? 'bg-mint-50 border border-mint-200'
                    : 'bg-peach-50 border border-peach-200'
                }`}
              >
                <span className="text-xl">{issue.emoji}</span>
                <span
                  className={issue.status === 'good' ? 'text-mint-700' : 'text-peach-700'}
                >
                  {issue.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Chat with AI Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-6"
      >
        <Button
          onClick={onChatWithAI}
          className="w-full h-16 rounded-2xl bg-gradient-to-r from-pink-400 via-lavender-400 to-blue-400 hover:from-pink-500 hover:via-lavender-500 hover:to-blue-500 text-white shadow-xl"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          {t.chatWithDrSkinAI}
        </Button>
      </motion.div>
    </div>
  );
}
