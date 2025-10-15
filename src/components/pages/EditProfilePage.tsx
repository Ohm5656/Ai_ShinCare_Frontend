import { motion } from 'motion/react';
import { useState } from 'react';
import { 
  ArrowLeft, Camera, User, Mail, Calendar, 
  Sparkles, Target, Check
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface EditProfilePageProps {
  onBack: () => void;
  onSave?: (data: ProfileData) => void;
  initialData?: ProfileData;
}

export interface ProfileData {
  fullName: string;
  email: string;
  age: string;
  gender: string;
  skinType: string;
  skincareGoal: string;
}

export function EditProfilePage({ onBack, onSave, initialData }: EditProfilePageProps) {
  const [formData, setFormData] = useState<ProfileData>(
    initialData || {
      fullName: 'ซาร่าห์ แอนเดอร์สัน',
      email: 'sarah.anderson@email.com',
      age: '28',
      gender: 'female',
      skinType: 'combination',
      skincareGoal: 'anti-aging',
    }
  );

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onBack();
  };

  const handleCancel = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h3 className="text-gray-800">แก้ไขโปรไฟล์</h3>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="px-6 py-6 pb-24 space-y-6">
        {/* Profile Photo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24 border-4 border-pink-100">
                  <AvatarFallback className="bg-gradient-to-br from-pink-200 to-blue-200 text-pink-700">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center shadow-lg hover:bg-pink-700 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <Button
                variant="outline"
                className="border-pink-200 text-pink-700 hover:bg-pink-50"
              >
                <Camera className="w-4 h-4 mr-2" />
                เปลี่ยนรูปภาพ
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
            <h4 className="text-gray-800 mb-4">ข้อมูลส่วนตัว</h4>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-600" />
                  ชื่อ-นามสกุล
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300"
                  placeholder="กรอกชื่อ-นามสกุลของคุณ"
                />
              </div>

              {/* Email Address */}
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pink-600" />
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300"
                  placeholder="กรอกอีเมลของคุณ"
                />
              </div>

              {/* Age */}
              <div>
                <Label htmlFor="age" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-600" />
                  อายุ
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300"
                  placeholder="กรอกอายุของคุณ"
                  min="1"
                  max="120"
                />
              </div>

              {/* Gender */}
              <div>
                <Label htmlFor="gender" className="text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-600" />
                  เพศ
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                >
                  <SelectTrigger className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300">
                    <SelectValue placeholder="เลือกเพศ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">หญิง</SelectItem>
                    <SelectItem value="male">ชาย</SelectItem>
                    <SelectItem value="other">อื่นๆ</SelectItem>
                    <SelectItem value="prefer-not-to-say">ไม่ระบุ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Skincare Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
            <h4 className="text-gray-800 mb-4">ข้อมูลผิวพรรณ</h4>
            
            <div className="space-y-4">
              {/* Skin Type */}
              <div>
                <Label htmlFor="skinType" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  ประเภทผิว
                </Label>
                <Select
                  value={formData.skinType}
                  onValueChange={(value) => handleChange('skinType', value)}
                >
                  <SelectTrigger className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300">
                    <SelectValue placeholder="เลือกประเภทผิว" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">ผิวปกติ</SelectItem>
                    <SelectItem value="dry">ผิวแห้ง</SelectItem>
                    <SelectItem value="oily">ผิวมัน</SelectItem>
                    <SelectItem value="combination">ผิวผสม</SelectItem>
                    <SelectItem value="sensitive">ผิวแพ้ง่าย</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skincare Goal */}
              <div>
                <Label htmlFor="skincareGoal" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-pink-600" />
                  เป้าหมายการดูแลผิว
                </Label>
                <Select
                  value={formData.skincareGoal}
                  onValueChange={(value) => handleChange('skincareGoal', value)}
                >
                  <SelectTrigger className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300">
                    <SelectValue placeholder="เลือกเป้าหมายการดูแลผิว" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anti-aging">ต้านริ้วรอยและชะลอวัย</SelectItem>
                    <SelectItem value="hydration">เพิ่มความชุ่มชื้น</SelectItem>
                    <SelectItem value="acne">ลดสิวและรอยด่างดำ</SelectItem>
                    <SelectItem value="brightening">เพิ่มความกระจ่างใส</SelectItem>
                    <SelectItem value="sensitive">ดูแลผิวแพ้ง่าย</SelectItem>
                    <SelectItem value="oil-control">ควบคุมความมันและรูขุมขน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3 pt-2"
        >
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-2xl py-6 shadow-lg"
          >
            <Check className="w-5 h-5 mr-2" />
            บันทึกการเปลี่ยนแปลง
          </Button>
          
          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl py-6"
          >
            ยกเลิก
          </Button>
        </motion.div>

        {/* Info Message */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 rounded-2xl p-4 text-center"
          >
            <p className="text-sm text-blue-700">
              💡 คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
