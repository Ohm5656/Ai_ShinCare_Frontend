import { motion } from 'motion/react';
import { useState } from 'react';
import { 
  User, Mail, Calendar, Heart, LogOut, Lock, 
  Edit2, Sparkles, TrendingUp, Languages, BookOpen
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ProfileData } from './EditProfilePage';
import { useLanguage, Language } from '../../contexts/LanguageContext';

interface ProfilePageProps {
  userName?: string;
  userEmail?: string;
  profileData?: ProfileData;
  profileImage?: string;
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
  onPremiumClick?: () => void;
  onViewTutorial?: () => void;
}

export function ProfilePage({ 
  userName = 'Suda Malai', 
  userEmail = 'suda.malai@email.com',
  profileData,
  profileImage,
  onEditProfile,
  onChangePassword,
  onLogout,
  onPremiumClick,
  onViewTutorial
}: ProfilePageProps) {
  const { language, setLanguage, t } = useLanguage();
  const latestSkinScore = 87;
  
  // Helper functions to convert data based on current language
  const getGenderLabel = (gender: string) => {
    const labels: Record<string, string> = {
      'female': t.female,
      'male': t.male,
      'other': t.other,
      'prefer-not-to-say': t.preferNotToSay
    };
    return labels[gender] || t.preferNotToSay;
  };

  const getSkinTypeLabel = (skinType: string) => {
    const labels: Record<string, string> = {
      'normal': t.normalSkin,
      'dry': t.drySkin,
      'oily': t.oilySkin,
      'combination': t.combinationSkin,
      'sensitive': t.sensitiveSkin
    };
    return labels[skinType] || t.normalSkin;
  };

  const getSkincareGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
      'anti-aging': t.antiAging,
      'hydration': t.hydration,
      'acne': t.acneTreatment,
      'brightening': t.brightening,
      'sensitive': t.sensitiveCare,
      'oil-control': t.oilControl
    };
    return labels[goal] || t.hydration;
  };

  // Helper function to get gender icon color
  const getGenderIconColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'blue';
      case 'female': return 'pink';
      case 'other': return 'peach';
      case 'prefer-not-to-say': return 'red';
      default: return 'pink';
    }
  };

  // Helper function to get icon colors based on gender
  const getIconColors = (gender: string) => {
    switch (gender) {
      case 'male':
        // ชาย: อายุ=ชมพู, เพศ=ฟ้า, ประเภทผิว=ชมพู, เป้าหมาย=ฟ้า
        return ['pink', 'blue', 'pink', 'blue'];
      case 'female':
        // หญิง: อายุ=ฟ้า, เพศ=ชมพู, ประเภทผิว=ฟ้า, เป้าหมาย=ชมพู
        return ['blue', 'pink', 'blue', 'pink'];
      case 'other':
        // อื่นๆ: อายุ=ฟ้า, เพศ=ส้ม, ประเภทผิว=ชมพู, เป้าหมาย=ฟ้า
        return ['blue', 'peach', 'pink', 'blue'];
      case 'prefer-not-to-say':
        // ไม่ระบุ: อายุ=ฟ้า, เพศ=แดง, ประเภทผิว=ชมพู, เป้าหมาย=ฟ้า
        return ['blue', 'red', 'pink', 'blue'];
      default:
        return ['blue', 'pink', 'blue', 'pink'];
    }
  };

  const currentGender = profileData?.gender || 'female';
  const iconColors = getIconColors(currentGender);
  
  const userDetails = [
    { 
      label: t.age, 
      value: profileData ? `${profileData.age} ${t.years}` : `28 ${t.years}`, 
      icon: Calendar, 
      color: iconColors[0]
    },
    { 
      label: t.gender, 
      value: profileData ? getGenderLabel(profileData.gender) : t.female, 
      icon: User, 
      color: iconColors[1]
    },
    { 
      label: t.skinType, 
      value: profileData ? getSkinTypeLabel(profileData.skinType) : t.combinationSkin, 
      icon: Sparkles, 
      color: iconColors[2]
    },
    { 
      label: t.skincareGoal, 
      value: profileData ? getSkincareGoalLabel(profileData.skincareGoal) : t.antiAging, 
      icon: TrendingUp, 
      color: iconColors[3]
    },
  ];

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
    if (onLogout) {
      onLogout();
    }
  };

  const actionButtons = [
    { 
      label: t.tutorialViewGuide, 
      icon: BookOpen, 
      variant: 'outline' as const, 
      color: 'lavender',
      onClick: onViewTutorial
    },
    { 
      label: t.changePassword, 
      icon: Lock, 
      variant: 'outline' as const, 
      color: 'pink',
      onClick: onChangePassword
    },
    { 
      label: t.changeLanguage, 
      icon: Languages, 
      variant: 'outline' as const, 
      color: 'blue',
      onClick: () => setShowLanguageDialog(true)
    },
    { 
      label: t.logout, 
      icon: LogOut, 
      variant: 'outline' as const, 
      danger: true,
      onClick: handleLogoutClick
    },
  ];

  const languages: { code: Language; name: string; flag: string; nativeName: string }[] = [
    { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ภาษาไทย' },
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/40 to-blue-50/20 pb-24">
      {/* Header with Language Button */}
      <div className="px-6 pt-12 pb-6 flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-gray-800 mb-1">{t.profile}</h2>
          <p className="text-sm text-gray-500">{t.settings}</p>
        </motion.div>
        
        {/* Language Switcher Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => setShowLanguageDialog(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center shadow-cute-lg hover:shadow-cute-xl hover:scale-110 transition-all duration-300"
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <Languages className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      <div className="px-6 space-y-4">
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 150 }}
          whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <Avatar className="w-20 h-20 border-4 border-pink-100">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-pink-200 to-lavender-200 text-pink-700">
                      <User className="w-10 h-10" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </motion.div>
              
              <div className="flex-1">
                <h3 className="text-gray-800 mb-1">{userName}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <Mail className="w-4 h-4 text-pink-400" />
                  <span>{userEmail}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPremiumClick}
                  className="inline-block"
                >
                  <Badge className="bg-pink-100 text-pink-700 border-0 cursor-pointer hover:bg-pink-200 transition-colors">
                    {t.premiumMember}
                  </Badge>
                </motion.button>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                className="w-full border-pink-200 text-pink-700 hover:bg-pink-50"
                onClick={onEditProfile}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {t.editProfile}
              </Button>
            </motion.div>
          </Card>
        </motion.div>

        {/* Latest Skin Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-pink-100 via-lavender-100 to-blue-100 rounded-3xl p-6 shadow-lg border border-pink-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <h4 className="text-gray-800">{t.latestSkinAnalysis}</h4>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-4xl bg-gradient-to-br from-pink-600 to-blue-600 bg-clip-text text-transparent mb-1">{latestSkinScore}</div>
                <p className="text-sm text-gray-600">{t.skinScore}</p>
              </div>
              
              <div className="w-24 h-24 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#FFE8F3"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(latestSkinScore / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFB5D9" />
                      <stop offset="100%" stopColor="#7DB8FF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-2xl p-4">
              <p className="text-sm text-gray-700">
                ✨ <span className="text-gray-600">{t.skinLooksGreat}</span>
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Personal Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 150 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
            <h4 className="text-gray-800 mb-4">{t.personalInfo}</h4>
            
            <div className="space-y-3">
              {userDetails.map((detail, index) => {
                const Icon = detail.icon;
                const color = detail.color;
                
                // Define color configurations
                const colorConfig = {
                  pink: {
                    bg: 'bg-gradient-to-br from-pink-100 to-pink-200',
                    text: 'text-pink-600',
                    separator: 'bg-pink-50'
                  },
                  blue: {
                    bg: 'bg-gradient-to-br from-blue-100 to-lavender-100',
                    text: 'text-blue-600',
                    separator: 'bg-blue-50'
                  },
                  peach: {
                    bg: 'bg-gradient-to-br from-peach-100 to-peach-200',
                    text: 'text-peach-600',
                    separator: 'bg-peach-50'
                  },
                  red: {
                    bg: 'bg-gradient-to-br from-red-100 to-red-200',
                    text: 'text-red-600',
                    separator: 'bg-red-50'
                  }
                };
                
                const currentColor = colorConfig[color as keyof typeof colorConfig] || colorConfig.pink;
                
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.4 + index * 0.05,
                      type: "spring",
                      stiffness: 150
                    }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3 py-3">
                      <motion.div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${currentColor.bg}`}
                        whileHover={{ 
                          scale: 1.15,
                          rotate: 360,
                          transition: { duration: 0.6 }
                        }}
                      >
                        <Icon className={`w-5 h-5 ${currentColor.text}`} />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">{detail.label}</p>
                        <p className="text-gray-800">{detail.value}</p>
                      </div>
                    </div>
                    {index < userDetails.length - 1 && (
                      <Separator className={currentColor.separator} />
                    )}
                  </motion.div>
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
          <Card className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
            <h4 className="text-gray-800 mb-4">{t.actionsAndSettings}</h4>
            
            <div className="space-y-3">
              {actionButtons.map((button, index) => {
                const Icon = button.icon;
                const isPink = button.color === 'pink';
                const isBlue = button.color === 'blue';
                const isLavender = button.color === 'lavender';
                return (
                  <Button
                    key={index}
                    variant={button.variant}
                    onClick={() => button.onClick?.()}
                    className={`w-full justify-start gap-2.5 ${
                      button.danger 
                        ? 'border-red-200 text-red-600 hover:bg-red-50' 
                        : isPink
                          ? 'border-pink-200 text-pink-700 hover:bg-pink-50'
                          : isBlue
                            ? 'border-blue-200 text-blue-700 hover:bg-blue-50'
                            : isLavender
                              ? 'border-lavender-200 text-lavender-700 hover:bg-lavender-50'
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {button.label}
                  </Button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Language Selection Dialog */}
        <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
          <DialogContent className="sm:max-w-md bg-white/95 rounded-[32px] border-2 border-pink-200 shadow-cute-xl">
            <DialogHeader>
              <DialogTitle className="text-center flex items-center justify-center gap-2">
                <Languages className="w-6 h-6 text-pink-500" />
                <span className="bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 bg-clip-text text-transparent">
                  {t.languageSelector}
                </span>
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                {t.selectLanguage}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLanguageDialog(false);
                  }}
                  className={`w-full p-4 rounded-[24px] border-2 transition-all duration-300 hover:scale-105 ${
                    language === lang.code
                      ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-blue-50 shadow-cute-md'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{lang.flag}</div>
                    <div className="flex-1 text-left">
                      <div className={`font-medium ${
                        language === lang.code
                          ? 'bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent'
                          : 'text-gray-800'
                      }`}>
                        {lang.nativeName}
                      </div>
                      <div className="text-sm text-gray-500">{lang.name}</div>
                    </div>
                    {language === lang.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 flex items-center justify-center"
                      >
                        <span className="text-white text-sm">✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Logout Confirmation Dialog */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent className="max-w-sm rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">
                {t.logout}? 👋
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                {language === 'th' && (
                  <>
                    คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?<br />
                    คุณสามารถเข้าสู่ระบบอีกครั้งได้ตลอดเวลา
                  </>
                )}
                {language === 'en' && (
                  <>
                    Are you sure you want to logout?<br />
                    You can sign in again anytime
                  </>
                )}
                {language === 'zh' && (
                  <>
                    您确定要登出吗？<br />
                    您可以随时再次登录
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-col gap-2">
              <AlertDialogAction
                onClick={handleLogoutConfirm}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl"
              >
                {language === 'th' && 'ใช่, ออกจากระบบ'}
                {language === 'en' && 'Yes, logout'}
                {language === 'zh' && '是的，登出'}
              </AlertDialogAction>
              <AlertDialogCancel className="w-full mt-0 border-gray-200 rounded-2xl">
                {t.cancel}
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center pb-4"
        >
          <p className="text-xs text-gray-400">{t.appVersion}</p>
          <p className="text-xs text-gray-400 mt-1">{t.madeWithLove}</p>
        </motion.div>
      </div>
    </div>
  );
}
