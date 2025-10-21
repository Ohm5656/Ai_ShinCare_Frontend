import { motion } from 'motion/react';
import { useState } from 'react';
import { 
  ArrowLeft, Camera, User, Mail, Calendar, 
  Sparkles, Target, Check
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
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
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ProfileData>(
    initialData || {
      fullName: 'Suda Malai',
      email: 'suda.malai@email.com',
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

  // Get gender icon color based on selection
  const getGenderIconColor = () => {
    switch (formData.gender) {
      case 'male': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300', focus: 'focus:border-blue-300' };
      case 'female': return { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-300', focus: 'focus:border-pink-300' };
      case 'other': return { bg: 'bg-peach-100', text: 'text-peach-600', border: 'border-peach-300', focus: 'focus:border-peach-300' };
      case 'prefer-not-to-say': return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-300', focus: 'focus:border-red-300' };
      default: return { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-300', focus: 'focus:border-pink-300' };
    }
  };

  const genderColor = getGenderIconColor();

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
      <div className="sticky top-0 z-10 bg-white/95 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h3 className="text-gray-800">{t.editProfile}</h3>
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
                {t.changePhoto}
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
            <h4 className="text-gray-800 mb-4">{t.personalInformation}</h4>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName" className="text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-600" />
                  {t.fullName}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300"
                  placeholder={t.enterFullName}
                />
              </div>

              {/* Email Address */}
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pink-600" />
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300"
                  placeholder={t.enterEmail}
                />
              </div>

              {/* Age */}
              <div>
                <Label htmlFor="age" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-600" />
                  {t.age}
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300"
                  placeholder={t.enterAge}
                  min="1"
                  max="120"
                />
              </div>

              {/* Gender */}
              <div>
                <Label htmlFor="gender" className="text-gray-700 mb-2 flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${genderColor.bg} flex items-center justify-center`}>
                    <User className={`w-4 h-4 ${genderColor.text}`} />
                  </div>
                  {t.gender}
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                >
                  <SelectTrigger className={`rounded-2xl border-gray-200 bg-gray-50 focus:bg-white ${genderColor.focus}`}>
                    <SelectValue placeholder={t.selectGender} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-pink-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        </div>
                        {t.femaleLabel}
                      </div>
                    </SelectItem>
                    <SelectItem value="male">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                        {t.maleLabel}
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-peach-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-peach-500"></div>
                        </div>
                        {t.otherLabel}
                      </div>
                    </SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        </div>
                        {t.preferNotToSay}
                      </div>
                    </SelectItem>
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
            <h4 className="text-gray-800 mb-4">{t.skinInformation}</h4>
            
            <div className="space-y-4">
              {/* Skin Type */}
              <div>
                <Label htmlFor="skinType" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  {t.skinType}
                </Label>
                <Select
                  value={formData.skinType}
                  onValueChange={(value) => handleChange('skinType', value)}
                >
                  <SelectTrigger className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300">
                    <SelectValue placeholder={t.selectSkinType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">{t.normalSkinLabel}</SelectItem>
                    <SelectItem value="dry">{t.drySkinLabel}</SelectItem>
                    <SelectItem value="oily">{t.oilySkinLabel}</SelectItem>
                    <SelectItem value="combination">{t.combinationSkinLabel}</SelectItem>
                    <SelectItem value="sensitive">{t.sensitiveSkinLabel}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skincare Goal */}
              <div>
                <Label htmlFor="skincareGoal" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-pink-600" />
                  {t.skincareGoal}
                </Label>
                <Select
                  value={formData.skincareGoal}
                  onValueChange={(value) => handleChange('skincareGoal', value)}
                >
                  <SelectTrigger className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300">
                    <SelectValue placeholder={t.selectSkincareGoal} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anti-aging">{t.antiAging}</SelectItem>
                    <SelectItem value="hydration">{t.hydration}</SelectItem>
                    <SelectItem value="acne">{t.acneTreatment}</SelectItem>
                    <SelectItem value="brightening">{t.brightening}</SelectItem>
                    <SelectItem value="sensitive">{t.sensitiveCare}</SelectItem>
                    <SelectItem value="oil-control">{t.oilControl}</SelectItem>
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
            {t.saveChanges}
          </Button>
          
          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl py-6"
          >
            {t.cancel}
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
              {t.unsavedChanges}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
