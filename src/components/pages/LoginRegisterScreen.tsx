import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Lock, User, Calendar, Upload, Heart, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface LoginRegisterScreenProps {
  onLogin: () => void;
}

export function LoginRegisterScreen({ onLogin }: LoginRegisterScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-blue-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cute floating decorations */}
      <motion.div
        className="absolute top-20 left-10 text-pink-300 opacity-40"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Heart className="w-12 h-12" fill="currentColor" />
      </motion.div>

      <motion.div
        className="absolute top-40 right-10 text-lavender-300 opacity-40"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <Star className="w-10 h-10" fill="currentColor" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 text-blue-300 opacity-30"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Welcome */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2, 
              type: 'spring', 
              stiffness: 200,
              damping: 15
            }}
            className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-200 via-lavender-200 to-blue-200 flex items-center justify-center shadow-cute-xl relative"
          >
            <div className="absolute inset-0 rounded-full bg-white opacity-40"></div>
            <Sparkles className="w-14 h-14 text-pink-500 relative z-10" strokeWidth={2.5} />
            
            {/* Sparkle decorations */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-4 h-4 bg-peach-400 rounded-full"></div>
            </motion.div>
            
            <motion.div
              className="absolute -bottom-2 -left-2"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            </motion.div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-pink-600 mb-3"
          >
            AI Skin Analyzer ✨
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600"
          >
            สแกนผิวหน้าด้วย AI เพื่อผิวสวยสุขภาพดี 🌸
          </motion.p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white/60 backdrop-blur-lg rounded-full p-1.5 mb-6 flex shadow-cute-md border border-pink-100">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3.5 px-6 rounded-full transition-all duration-300 relative overflow-hidden ${
              activeTab === 'login'
                ? 'text-white'
                : 'text-gray-600 hover:text-pink-500'
            }`}
          >
            {activeTab === 'login' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full shadow-lg"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">เข้าสู่ระบบ</span>
          </button>
          
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3.5 px-6 rounded-full transition-all duration-300 relative overflow-hidden ${
              activeTab === 'register'
                ? 'text-white'
                : 'text-gray-600 hover:text-pink-500'
            }`}
          >
            {activeTab === 'register' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full shadow-lg"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">สมัครสมาชิก</span>
          </button>
        </div>

        {/* Form Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'login' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-md rounded-[32px] p-8 shadow-cute-xl border border-pink-100"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {activeTab === 'login' ? (
                <>
                  {/* Login Form */}
                  <div>
                    <Label htmlFor="email" className="text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-pink-400" />
                      อีเมลหรือเบอร์โทรศัพท์
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="your@email.com"
                      className="h-14 rounded-[24px] border-pink-200 bg-pink-50/50 focus:border-pink-400 focus:bg-white transition-all pl-5 shadow-cute-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-pink-400" />
                      รหัสผ่าน
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-14 rounded-[24px] border-pink-200 bg-pink-50/50 focus:border-pink-400 focus:bg-white transition-all pl-5 shadow-cute-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-[24px] bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400 hover:from-pink-500 hover:via-pink-600 hover:to-pink-500 text-white shadow-cute-lg hover:shadow-cute-xl transition-all duration-300 bg-[length:200%_100%] hover:bg-[position:100%_0]"
                  >
                    เข้าสู่ระบบ 💕
                  </Button>

                  <div className="text-center">
                    <a href="#" className="text-pink-500 hover:text-pink-600 hover:underline transition-colors">
                      ลืมรหัสผ่าน?
                    </a>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-pink-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-gray-400 text-sm">หรือเข้าสู่ระบบด้วย</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-[20px] border-pink-200 hover:border-pink-300 hover:bg-pink-50 transition-all shadow-cute-sm"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-[20px] border-pink-200 hover:border-pink-300 hover:bg-pink-50 transition-all shadow-cute-sm"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      Apple
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Register Form */}
                  <div>
                    <Label htmlFor="fullname" className="text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-pink-400" />
                      ชื่อ-นามสกุล
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="สุดา มาลัย"
                      className="h-14 rounded-[24px] border-pink-200 bg-pink-50/50 focus:border-pink-400 focus:bg-white transition-all pl-5 shadow-cute-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reg-email" className="text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-pink-400" />
                      อีเมล
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-14 rounded-[24px] border-pink-200 bg-pink-50/50 focus:border-pink-400 focus:bg-white transition-all pl-5 shadow-cute-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reg-password" className="text-gray-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-pink-400" />
                      รหัสผ่าน
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-14 rounded-[24px] border-pink-200 bg-pink-50/50 focus:border-pink-400 focus:bg-white transition-all pl-5 shadow-cute-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="gender" className="text-gray-700 mb-2 text-sm">เพศ</Label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-[20px] border-pink-200 bg-pink-50/50 shadow-cute-sm">
                          <SelectValue placeholder="เลือก" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">ชาย</SelectItem>
                          <SelectItem value="female">หญิง</SelectItem>
                          <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="skintype" className="text-gray-700 mb-2 text-sm">ประเภทผิว</Label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-[20px] border-pink-200 bg-pink-50/50 shadow-cute-sm">
                          <SelectValue placeholder="เลือก" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oily">ผิวมัน</SelectItem>
                          <SelectItem value="dry">ผิวแห้ง</SelectItem>
                          <SelectItem value="combination">ผิวผสม</SelectItem>
                          <SelectItem value="sensitive">ผิวแพ้ง่าย</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="birthday" className="text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-pink-400" />
                      วันเกิด
                    </Label>
                    <Input
                      id="birthday"
                      type="date"
                      className="h-14 rounded-[24px] border-pink-200 bg-pink-50/50 focus:border-pink-400 focus:bg-white transition-all pl-5 shadow-cute-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-pink-400" />
                      รูปโปรไฟล์ (ไม่บังคับ)
                    </Label>
                    <div className="border-2 border-dashed border-pink-200 rounded-[24px] p-8 text-center hover:border-pink-400 hover:bg-pink-50/30 transition-all cursor-pointer shadow-cute-sm">
                      <Upload className="w-10 h-10 mx-auto mb-3 text-pink-300" />
                      <p className="text-gray-500 text-sm">คลิกเพื่ออัปโหลด</p>
                      <p className="text-gray-400 text-xs mt-1">PNG, JPG (สูงสุด 5MB)</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-[24px] bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400 hover:from-pink-500 hover:via-pink-600 hover:to-pink-500 text-white shadow-cute-lg hover:shadow-cute-xl transition-all duration-300"
                  >
                    สร้างบัญชี ✨
                  </Button>

                  <div className="text-center">
                    <span className="text-gray-600">มีบัญชีอยู่แล้ว? </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-pink-500 hover:text-pink-600 hover:underline transition-colors"
                    >
                      เข้าสู่ระบบ
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
