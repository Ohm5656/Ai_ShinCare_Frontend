import { motion } from 'motion/react';
import { 
  User, Mail, Calendar, Heart, LogOut, Lock, 
  Smartphone, Edit2, Sparkles, TrendingUp
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface ProfilePageProps {
  userName?: string;
  userEmail?: string;
  onEditProfile?: () => void;
}

export function ProfilePage({ 
  userName = 'Suda Malai', 
  userEmail = 'suda.malai@email.com',
  onEditProfile
}: ProfilePageProps) {
  const latestSkinScore = 87;
  
  const userDetails = [
    { label: 'อายุ', value: '28 ปี', icon: Calendar },
    { label: 'เพศ', value: 'หญิง', icon: User },
    { label: 'ประเภทผิว', value: 'ผิวผสม', icon: Sparkles },
    { label: 'เป้าหมายการดูแลผิว', value: 'ต้านริ้วรอยและเพิ่มความชุ่มชื้น', icon: TrendingUp },
  ];

  const actionButtons = [
    { label: 'เปลี่ยนรหัสผ่าน', icon: Lock, variant: 'outline' as const },
    { label: 'เชื่อมต่ออุปกรณ์', icon: Smartphone, variant: 'outline' as const },
    { label: 'ออกจากระบบ', icon: LogOut, variant: 'outline' as const, danger: true },
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
          <h2 className="text-gray-800 mb-1">โปรไฟล์ของฉัน</h2>
          <p className="text-sm text-gray-500">จัดการบัญชีและการตั้งค่า</p>
        </motion.div>
      </div>

      <div className="px-6 space-y-4">
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-20 h-20 border-4 border-pink-100">
                <AvatarFallback className="bg-gradient-to-br from-pink-200 to-blue-200 text-pink-700">
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="text-gray-800 mb-1">{userName}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{userEmail}</span>
                </div>
                <Badge className="bg-pink-100 text-pink-700 border-0">
                  สมาชิกพรีเมียม
                </Badge>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-pink-200 text-pink-700 hover:bg-pink-50"
              onClick={onEditProfile}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              แก้ไขโปรไฟล์
            </Button>
          </Card>
        </motion.div>

        {/* Latest Skin Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-3xl p-6 shadow-lg border-0">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <h4 className="text-gray-800">การวิเคราะห์ผิวล่าสุด</h4>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-4xl text-pink-600 mb-1">{latestSkinScore}</div>
                <p className="text-sm text-gray-600">คะแนนผิว</p>
              </div>
              
              <div className="w-24 h-24 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#F8E8EE"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#EC4899"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(latestSkinScore / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-2xl p-4">
              <p className="text-sm text-gray-700">
                ✨ <span className="text-gray-600">ผิวของคุณดูดีมาก! รักษารูทีนการบำรุงความชุ่มชื้นต่อไปนะคะ</span>
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Personal Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
            <h4 className="text-gray-800 mb-4">ข้อมูลส่วนตัว</h4>
            
            <div className="space-y-3">
              {userDetails.map((detail, index) => {
                const Icon = detail.icon;
                return (
                  <div key={index}>
                    <div className="flex items-center gap-3 py-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">{detail.label}</p>
                        <p className="text-gray-800">{detail.value}</p>
                      </div>
                    </div>
                    {index < userDetails.length - 1 && (
                      <Separator className="bg-gray-100" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
            <h4 className="text-gray-800 mb-4">การตั้งค่าและดำเนินการ</h4>
            
            <div className="space-y-3">
              {actionButtons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <Button
                    key={index}
                    variant={button.variant}
                    className={`w-full justify-start ${
                      button.danger 
                        ? 'border-red-200 text-red-600 hover:bg-red-50' 
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {button.label}
                  </Button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center pb-4"
        >
          <p className="text-xs text-gray-400">AI Skin Analyzer v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">สร้างด้วย ❤️ เพื่อผิวสวยของคุณ</p>
        </motion.div>
      </div>
    </div>
  );
}
