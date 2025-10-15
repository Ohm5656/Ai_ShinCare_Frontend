import { motion } from 'motion/react';
import { Edit, Calendar, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileHistoryScreenProps {
  onBack: () => void;
}

export function ProfileHistoryScreen({ onBack }: ProfileHistoryScreenProps) {
  const historyData = [
    { date: 'Jan 10', score: 75 },
    { date: 'Jan 24', score: 78 },
    { date: 'Feb 07', score: 80 },
    { date: 'Feb 21', score: 83 },
    { date: 'Mar 07', score: 85 },
    { date: 'Mar 21', score: 87 },
  ];

  const stats = [
    {
      icon: <Award className="w-5 h-5 text-yellow-600" />,
      label: 'Average Score',
      value: '82/100',
      bg: 'bg-yellow-50',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-600" />,
      label: 'Most Improved',
      value: 'Hydration',
      bg: 'bg-green-50',
    },
    {
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      label: 'Last Scan',
      value: 'Today',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button onClick={onBack} className="text-pink-500 mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </motion.div>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 bg-gradient-to-br from-pink-300 to-blue-300">
              <AvatarFallback className="text-3xl">👤</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-gray-800 mb-1">Sarah Anderson</h2>
              <p className="text-gray-500">sarah.anderson@email.com</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-6"
      >
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`${stat.bg} rounded-2xl p-4 text-center`}
            >
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="text-gray-500 text-xs mb-1">{stat.label}</div>
              <div className="text-gray-800">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* History Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-gray-800 mb-4">Skin Score History</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F8E8EE" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                domain={[70, 90]}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #F8E8EE',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#F472B6"
                strokeWidth={3}
                dot={{ fill: '#F472B6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Before & After Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-gray-800 mb-4">Before & After Gallery</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl mb-2 flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
              <p className="text-center text-gray-600 text-sm">Before (Jan 10)</p>
            </div>
            <div>
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl mb-2 flex items-center justify-center">
                <span className="text-4xl">✨</span>
              </div>
              <p className="text-center text-gray-600 text-sm">After (Mar 21)</p>
            </div>
          </div>

          {/* Feedback Buttons */}
          <div className="text-center mb-3">
            <p className="text-gray-600 text-sm mb-3">How has your skin improved?</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button className="flex-1 py-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 hover:bg-green-100 transition-colors">
              👍 Improved
            </button>
            <button className="flex-1 py-3 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-700 hover:bg-yellow-100 transition-colors">
              😐 Same
            </button>
            <button className="flex-1 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 hover:bg-red-100 transition-colors">
              👎 Worse
            </button>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-gray-800 mb-4">Achievements 🏆</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-2xl">
              <span className="text-3xl">⭐</span>
              <div>
                <div className="text-gray-800">7-Day Streak</div>
                <div className="text-gray-500 text-sm">Completed daily skin checks</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-2xl">
              <span className="text-3xl">💎</span>
              <div>
                <div className="text-gray-800">Skin Score Master</div>
                <div className="text-gray-500 text-sm">Reached 85+ score</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
              <span className="text-3xl">🌟</span>
              <div>
                <div className="text-gray-800">Early Adopter</div>
                <div className="text-gray-500 text-sm">First month completed</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
