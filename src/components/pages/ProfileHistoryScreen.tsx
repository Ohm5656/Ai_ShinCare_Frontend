import { motion } from 'motion/react';
import { Edit, Calendar, TrendingUp, Award, ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProfileHistoryScreenProps {
  onBack: () => void;
}

export function ProfileHistoryScreen({ onBack }: ProfileHistoryScreenProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Sarah Anderson',
    email: 'sarah.anderson@email.com',
    age: '28',
    skinType: 'combination',
    concerns: 'acne'
  });
  
  const [editData, setEditData] = useState(profileData);
  
  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };
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
      label: t.averageScore,
      value: '82/100',
      bg: 'bg-yellow-50',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-600" />,
      label: t.mostImproved,
      value: t.hydration,
      bg: 'bg-green-50',
    },
    {
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      label: t.lastScan,
      value: t.today,
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-lavender-50/30 to-pink-50/20 pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button onClick={onBack} className="text-blue-500 mb-4">
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
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-20 h-20 bg-gradient-to-br from-blue-300 to-lavender-300">
                  <AvatarFallback className="text-3xl">👤</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-gray-800 mb-1">{profileData.name}</h2>
                  <p className="text-gray-500">{profileData.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {t.editProfile}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-100">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{t.age}</p>
                  <p className="text-gray-800">{profileData.age} {t.years}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">{t.skinType}</p>
                  <p className="text-gray-800">
                    {profileData.skinType === 'dry' && t.drySkin}
                    {profileData.skinType === 'oily' && t.oilySkin}
                    {profileData.skinType === 'combination' && t.combinationSkin}
                    {profileData.skinType === 'normal' && t.normalSkin}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800">{t.editPersonalInfo}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-200 text-gray-600 hover:bg-gray-50"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t.cancel}
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-blue-400 to-lavender-400 text-white hover:from-blue-500 hover:to-lavender-500"
                    onClick={handleSave}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {t.save}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="name" className="text-gray-700 mb-1.5">{t.fullName}</Label>
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="rounded-xl border-blue-200 focus:border-blue-400"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-1.5">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="rounded-xl border-blue-200 focus:border-blue-400"
                />
              </div>
              
              <div>
                <Label htmlFor="age" className="text-gray-700 mb-1.5">{t.age}</Label>
                <Input
                  id="age"
                  type="number"
                  value={editData.age}
                  onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                  className="rounded-xl border-blue-200 focus:border-blue-400"
                />
              </div>
              
              <div>
                <Label htmlFor="skinType" className="text-gray-700 mb-1.5">{t.skinType}</Label>
                <Select 
                  value={editData.skinType} 
                  onValueChange={(value) => setEditData({ ...editData, skinType: value })}
                >
                  <SelectTrigger className="rounded-xl border-blue-200 focus:border-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry">{t.drySkin}</SelectItem>
                    <SelectItem value="oily">{t.oilySkin}</SelectItem>
                    <SelectItem value="combination">{t.combinationSkin}</SelectItem>
                    <SelectItem value="normal">{t.normalSkin}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="concerns" className="text-gray-700 mb-1.5">{t.mainSkinConcern}</Label>
                <Select 
                  value={editData.concerns} 
                  onValueChange={(value) => setEditData({ ...editData, concerns: value })}
                >
                  <SelectTrigger className="rounded-xl border-blue-200 focus:border-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acne">{t.acne}</SelectItem>
                    <SelectItem value="wrinkles">{t.wrinkles}</SelectItem>
                    <SelectItem value="dark-spots">{t.darkSpots}</SelectItem>
                    <SelectItem value="redness">{t.redness}</SelectItem>
                    <SelectItem value="dryness">{t.dryness}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
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
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-gray-800 mb-4">{t.skinScoreHistory}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C3DFFF" />
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
                  border: '1px solid #C3DFFF',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#7DB8FF"
                strokeWidth={3}
                dot={{ fill: '#7DB8FF', r: 5 }}
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
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-gray-800 mb-4">{t.beforeAfterGallery}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-lavender-100 rounded-2xl mb-2 flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
              <p className="text-center text-gray-600 text-sm">
                {t.before} ({t.language === 'th' ? '10 ม.ค.' : t.language === 'en' ? 'Jan 10' : '1月10日'})
              </p>
            </div>
            <div>
              <div className="aspect-square bg-gradient-to-br from-lavender-100 to-pink-100 rounded-2xl mb-2 flex items-center justify-center">
                <span className="text-4xl">✨</span>
              </div>
              <p className="text-center text-gray-600 text-sm">
                {t.after} ({t.language === 'th' ? '21 มี.ค.' : t.language === 'en' ? 'Mar 21' : '3月21日'})
              </p>
            </div>
          </div>

          {/* Feedback Buttons */}
          <div className="text-center mb-3">
            <p className="text-gray-600 text-sm mb-3">{t.howImproved}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button className="flex-1 py-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 hover:bg-green-100 transition-colors">
              👍 {t.improved}
            </button>
            <button className="flex-1 py-3 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-700 hover:bg-yellow-100 transition-colors">
              😐 {t.same}
            </button>
            <button className="flex-1 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 hover:bg-red-100 transition-colors">
              👎 {t.worse}
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
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-gray-800 mb-4">{t.achievements}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-3xl">⭐</span>
              <div>
                <div className="text-gray-800">{t.dayStreak}</div>
                <div className="text-gray-500 text-sm">{t.completedDailyChecks}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-lavender-50 rounded-2xl border border-lavender-100">
              <span className="text-3xl">💎</span>
              <div>
                <div className="text-gray-800">{t.skinScoreMaster}</div>
                <div className="text-gray-500 text-sm">{t.reachedScore}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-3xl">🌟</span>
              <div>
                <div className="text-gray-800">{t.earlyAdopter}</div>
                <div className="text-gray-500 text-sm">{t.firstMonthCompleted}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
