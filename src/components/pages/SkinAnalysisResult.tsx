import { motion } from 'motion/react';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface SkinAnalysisResultProps {
  onChatWithAI: () => void;
  onBack: () => void;
}

export function SkinAnalysisResult({ onChatWithAI, onBack }: SkinAnalysisResultProps) {
  const skinScore = 87;

  const radarData = [
    { subject: 'ริ้วรอย', value: 85, fullMark: 100 },
    { subject: 'ความแดง', value: 72, fullMark: 100 },
    { subject: 'โทนสี', value: 88, fullMark: 100 },
    { subject: 'ความมัน', value: 65, fullMark: 100 },
    { subject: 'ถุงใต้ตา', value: 78, fullMark: 100 },
    { subject: 'สิว', value: 82, fullMark: 100 },
  ];

  const skinIssues = [
    { emoji: '✨', label: 'ผิวเรียบเนียน', status: 'good' },
    { emoji: '💧', label: 'ชุ่มชื้นดี', status: 'good' },
    { emoji: '🔴', label: 'ผิวแดงเล็กน้อย', status: 'warning' },
    { emoji: '⚫', label: 'จุดด่างดำ', status: 'warning' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button onClick={onBack} className="text-pink-500 mb-4">← ย้อนกลับ</button>
          <h1 className="text-gray-800 mb-2">ผลการวิเคราะห์ผิวของคุณ 💆🏻‍♀️</h1>
        </motion.div>
      </div>

      {/* Score Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-6"
      >
        <div className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-3xl p-8 text-center shadow-lg">
          <div className="text-gray-600 mb-2">คะแนนผิว</div>
          <div className="text-pink-600 mb-1">{skinScore} / 100</div>
          <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full">
            ผิวสุขภาพดี ✨
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
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-gray-800 mb-4 text-center">ภาพรวมการวิเคราะห์ผิว</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#F8E8EE" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Radar
                name="สุขภาพผิว"
                dataKey="value"
                stroke="#F472B6"
                fill="#F472B6"
                fillOpacity={0.6}
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
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <div className="text-gray-500 text-sm">ประเภทผิวของคุณ</div>
              <div className="text-gray-800">ผิวผสม</div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">จุดเด่น</div>
              <div className="text-gray-800">ผิวเรียบเนียนและชุ่มชื้นดี</div>
            </div>
          </div>
        </div>

        {/* Needs Improvement */}
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">ควรปรับปรุง</div>
              <div className="text-gray-800">ผิวแดงเล็กน้อยและจุดด่างดำ</div>
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
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <div className="text-gray-800 mb-4">รายละเอียดสภาพผิว</div>
          <div className="flex flex-wrap gap-3">
            {skinIssues.map((issue) => (
              <div
                key={issue.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  issue.status === 'good'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <span className="text-xl">{issue.emoji}</span>
                <span
                  className={issue.status === 'good' ? 'text-green-700' : 'text-yellow-700'}
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
          className="w-full h-16 rounded-2xl bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white shadow-xl"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          รับคำแนะนำจาก Dr.SkinAI 💬
        </Button>
      </motion.div>
    </div>
  );
}
