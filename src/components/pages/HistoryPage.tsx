import { motion } from 'motion/react';
import { useState } from 'react';
import { 
  TrendingUp, Calendar, Award, ChevronRight, 
  Image as ImageIcon, Droplet, Wind, Circle, Scan
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HistoryPageProps {
  userName?: string;
}

export function HistoryPage({ userName = 'Suda' }: HistoryPageProps) {
  const [selectedMetric, setSelectedMetric] = useState('overall');

  // Mock data for skin score progress
  const progressData = [
    { date: 'จ.', overall: 82, hydration: 78, oil: 85, pores: 80, wrinkles: 88 },
    { date: 'อ.', overall: 83, hydration: 80, oil: 84, pores: 82, wrinkles: 88 },
    { date: 'พ.', overall: 84, hydration: 82, oil: 83, pores: 83, wrinkles: 89 },
    { date: 'พฤ.', overall: 85, hydration: 83, oil: 85, pores: 84, wrinkles: 89 },
    { date: 'ศ.', overall: 86, hydration: 85, oil: 86, pores: 85, wrinkles: 90 },
    { date: 'ส.', overall: 86, hydration: 86, oil: 85, pores: 86, wrinkles: 91 },
    { date: 'อา.', overall: 87, hydration: 88, oil: 84, pores: 87, wrinkles: 92 },
  ];

  const metrics = [
    { id: 'overall', label: 'ภาพรวม', icon: TrendingUp, color: '#EC4899' },
    { id: 'hydration', label: 'ความชุ่มชื้น', icon: Droplet, color: '#3B82F6' },
    { id: 'oil', label: 'ความมัน', icon: Wind, color: '#F59E0B' },
    { id: 'pores', label: 'รูขุมขน', icon: Circle, color: '#8B5CF6' },
    { id: 'wrinkles', label: 'ริ้วรอย', icon: Scan, color: '#10B981' },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-gray-800 mb-1">ประวัติความก้าวหน้า</h2>
          <p className="text-sm text-gray-500">ติดตามการพัฒนาผิวของคุณ</p>
        </motion.div>
      </div>

      <div className="px-6 space-y-4">
        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl text-pink-600 mb-1">87</div>
                <p className="text-xs text-gray-500">คะแนนเฉลี่ย</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <div className="text-3xl text-blue-600 mb-1">+5</div>
                <p className="text-xs text-gray-500">สัปดาห์นี้</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-xs text-gray-500">ความชุ่มชื้น</p>
                <p className="text-xs text-green-600">ดีที่สุด</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">สแกนล่าสุด: วันนี้ 9:30 น.</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Metric Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const isActive = selectedMetric === metric.id;
              return (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-pink-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{metric.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-800">แนวโน้ม 7 วัน</h4>
              <Badge className="bg-green-100 text-green-700 border-0">
                +5 คะแนน
              </Badge>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                  domain={[70, 95]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={currentMetric?.color || '#EC4899'}
                  strokeWidth={3}
                  dot={{ fill: currentMetric?.color || '#EC4899', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Past Scans Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-800">ประวัติการสแกน</h4>
              <Button variant="ghost" className="text-sm text-pink-600">
                ดูทั้งหมด
              </Button>
            </div>

            <div className="space-y-3">
              {pastScans.map((scan, index) => (
                <div key={scan.id}>
                  <div className="flex items-center gap-4 py-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center text-2xl">
                      {scan.thumbnail}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-800">{scan.date}</p>
                        {scan.improvement !== '0' && (
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                            {scan.improvement}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{scan.topIssue}</p>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl text-pink-600 mb-1">{scan.score}</div>
                      <p className="text-xs text-gray-400">คะแนน</p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                  {index < pastScans.length - 1 && (
                    <div className="h-px bg-gray-100" />
                  )}
                </div>
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
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 shadow-lg border-0">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <h4 className="text-gray-800">แกลเลอรี่ก่อน-หลัง</h4>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {beforeAfterGallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-2xl">
                      {item.emoji}
                    </div>
                    <div>
                      <p className="text-gray-800">{item.date}</p>
                      <p className="text-sm text-green-600">ดีขึ้น {item.improvement} คะแนน</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-4 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              ดูแกลเลอรี่ทั้งหมด
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
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-gray-700 mb-1">ทำได้ดีมากค่ะคุณ{userName}!</p>
            <p className="text-sm text-gray-500">
              คุณพัฒนาคะแนนผิวไปแล้ว 12 คะแนนในเดือนนี้
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
