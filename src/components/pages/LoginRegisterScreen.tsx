import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Lock, User, Calendar, Upload, Heart, Star, CheckCircle2, Languages } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { GlowbieBellLogo } from '../GlowbieBellLogo';
import { toast } from 'sonner@2.0.3';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';

interface LoginRegisterScreenProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  fullname?: string;
  gender?: string;
  skintype?: string;
  birthday?: string;
}

export function LoginRegisterScreen({ onLogin, onForgotPassword }: LoginRegisterScreenProps) {
  const { language, setLanguage, t } = useLanguage();
  const { setUser } = useUser();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    fullname: '',
    email: '',
    password: '',
    gender: '',
    skintype: '',
    birthday: '',
  });

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate login form
  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!loginEmail) {
      newErrors.email = t.required;
    } else if (!isValidEmail(loginEmail)) {
      newErrors.email = t.invalidEmail;
    }

    if (!loginPassword) {
      newErrors.password = t.required;
    } else if (loginPassword.length < 6) {
      newErrors.password = t.passwordTooShort;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate register form
  const validateRegisterForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!registerData.fullname || registerData.fullname.trim().length < 2) {
      newErrors.fullname = t.required;
    }

    if (!registerData.email) {
      newErrors.email = t.required;
    } else if (!isValidEmail(registerData.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!registerData.password) {
      newErrors.password = t.required;
    } else if (registerData.password.length < 8) {
      newErrors.password = t.passwordTooShort;
    }

    if (!registerData.gender) {
      newErrors.gender = t.required;
    }

    if (!registerData.skintype) {
      newErrors.skintype = t.required;
    }

    if (!registerData.birthday) {
      newErrors.birthday = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Save user data to context
      setUser({
        email: loginEmail,
        fullName: 'Suda Malai', // In a real app, this would come from the backend
        age: '28',
        gender: 'female',
        skinType: 'combination',
        skincareGoal: 'anti-aging',
      });
      
      toast.success(t.successTitle, {
        description: t.welcomeBack
      });
      
      // Delay before navigating
      setTimeout(() => {
        onLogin();
      }, 500);
    }, 1500);
  };

  // Handle register submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      toast.error(t.required, {
        description: language === 'th' ? 'ตรวจสอบข้อมูลที่ขาดหายไป' : (language === 'en' ? 'Check missing information' : '检查缺失的信息')
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Save user data to context
      setUser({
        email: registerData.email,
        fullName: registerData.fullname,
        gender: registerData.gender,
        skinType: registerData.skintype,
      });
      
      setShowSuccessDialog(true);
      
      // Reset form
      setRegisterData({
        fullname: '',
        email: '',
        password: '',
        gender: '',
        skintype: '',
        birthday: '',
      });
      setErrors({});
    }, 2000);
  };

  // Handle OAuth login
  const handleOAuthLogin = (provider: 'google' | 'apple') => {
    const providerName = provider === 'google' ? 'Google' : 'Apple';
    const connectingMsg = language === 'th' ? `กำลังเชื่อมต่อกับ ${providerName}... 🔄` : 
                          language === 'en' ? `Connecting to ${providerName}... 🔄` : 
                          `正在连接到 ${providerName}... 🔄`;
    const comingSoonMsg = language === 'th' ? 'ฟีเจอร์นี้จะพร้อมใช้งานเร็วๆ นี้!' :
                          language === 'en' ? 'This feature is coming soon!' :
                          '此功能即将推出！';
    
    toast.info(connectingMsg, {
      description: comingSoonMsg
    });
    
    // In real implementation, this would trigger OAuth flow
    // For now, just show a message
  };

  const languages: { code: Language; name: string; flag: string; nativeName: string }[] = [
    { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ภาษาไทย' },
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  ];

  // Handle success dialog close
  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    setActiveTab('login');
  };

  return (
    <>
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
          className="absolute top-40 right-10 text-blue-300 opacity-40"
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
          className="absolute bottom-20 left-20 text-lavender-300 opacity-30"
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

        {/* Language Switcher Button - Top Right */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={() => setShowLanguageDialog(true)}
          className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-cute-lg hover:shadow-cute-xl hover:scale-110 transition-all duration-300 border border-pink-200"
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <Languages className="w-6 h-6 text-pink-500" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo & Welcome */}
          <div className="text-center mb-8">
            <div className="mb-4 flex items-center justify-center">
              <GlowbieBellLogo size={192} animated={true} />
            </div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 bg-clip-text text-transparent mb-3"
            >
              GlowbieBell ✨
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600"
            >
              {t.appTagline}
            </motion.p>
          </div>

          {/* Tab Switcher */}
          <div className="bg-white/90 rounded-full p-1.5 mb-6 flex shadow-cute-md border border-pink-200">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrors({});
              }}
              className={`flex-1 py-3.5 px-6 rounded-full transition-all duration-300 relative overflow-hidden ${
                activeTab === 'login'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              {activeTab === 'login' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-pink-400 via-lavender-400 to-blue-400 rounded-full shadow-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t.loginTitle}</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('register');
                setErrors({});
              }}
              className={`flex-1 py-3.5 px-6 rounded-full transition-all duration-300 relative overflow-hidden ${
                activeTab === 'register'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              {activeTab === 'register' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-pink-400 via-lavender-400 to-blue-400 rounded-full shadow-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t.registerTitle}</span>
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
              className="bg-white/95 rounded-[32px] p-8 shadow-cute-xl border border-pink-100"
            >
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  {/* Login Form */}
                  <div>
                    <Label htmlFor="email" className="text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-pink-400" />
                      {t.email}
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder={t.enterEmail}
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setErrors({ ...errors, email: undefined });
                      }}
                      className={`h-14 rounded-[24px] border-pink-200 bg-pink-50/50 focus:border-pink-400 focus:bg-white transition-all pl-5 shadow-cute-sm ${
                        errors.email ? 'border-red-300 bg-red-50/30' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠️</span> {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      {t.password}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setErrors({ ...errors, password: undefined });
                      }}
                      className={`h-14 rounded-[24px] border-blue-200 bg-blue-50/50 focus:border-blue-400 focus:bg-white transition-all pl-5 shadow-cute-sm ${
                        errors.password ? 'border-red-300 bg-red-50/30' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠️</span> {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-[24px] bg-gradient-to-r text-white shadow-cute-lg hover:shadow-cute-xl transition-all duration-300 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #FFD1E7 0%, #DFD3FF 50%, #A0CBFF 100%)',
                    }}
                  >
                    {isLoading ? (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        {language === 'th' ? 'กำลังเข้าสู่ระบบ...' : language === 'en' ? 'Signing in...' : '登录中...'}
                      </span>
                    ) : (
                      <>
                        <div 
                          className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                          style={{
                            background: 'radial-gradient(circle, rgba(255, 209, 231, 0.4) 0%, rgba(223, 211, 255, 0.3) 50%, rgba(160, 203, 255, 0.4) 100%)',
                          }}
                        />
                        <span className="relative z-10">{t.login} 💕</span>
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-pink-500 hover:text-pink-600 hover:underline transition-colors"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-pink-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-gray-400 text-sm">{t.orLoginWith}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      onClick={() => handleOAuthLogin('google')}
                      variant="outline"
                      disabled={isLoading}
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
                      onClick={() => handleOAuthLogin('apple')}
                      variant="outline"
                      disabled={isLoading}
                      className="h-12 rounded-[20px] border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-cute-sm"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      Apple
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  {/* Register Form */}
                  <div>
                    <Label htmlFor="fullname" className="text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-pink-400" />
                      {t.fullName}
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder={t.namePlaceholder}
                      value={registerData.fullname}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, fullname: e.target.value });
                        setErrors({ ...errors, fullname: undefined });
                      }}
                      className={`h-14 rounded-[24px] border-pink-200 bg-pink-50/50 focus:border-pink-400 focus:bg-white transition-all pl-5 shadow-cute-sm ${
                        errors.fullname ? 'border-red-300 bg-red-50/30' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.fullname && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠️</span> {errors.fullname}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="reg-email" className="text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      {t.email}
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, email: e.target.value });
                        setErrors({ ...errors, email: undefined });
                      }}
                      className={`h-14 rounded-[24px] border-blue-200 bg-blue-50/50 focus:border-blue-400 focus:bg-white transition-all pl-5 shadow-cute-sm ${
                        errors.email ? 'border-red-300 bg-red-50/30' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠️</span> {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="reg-password" className="text-gray-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-lavender-400" />
                      {t.password}
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, password: e.target.value });
                        setErrors({ ...errors, password: undefined });
                      }}
                      className={`h-14 rounded-[24px] border-lavender-200 bg-lavender-50/50 focus:border-lavender-400 focus:bg-white transition-all pl-5 shadow-cute-sm ${
                        errors.password ? 'border-red-300 bg-red-50/30' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠️</span> {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="gender" className="text-gray-700 mb-2 text-sm">{t.gender}</Label>
                      <Select
                        value={registerData.gender}
                        onValueChange={(value) => {
                          setRegisterData({ ...registerData, gender: value });
                          setErrors({ ...errors, gender: undefined });
                        }}
                        disabled={isLoading}
                      >
                        <SelectTrigger className={`h-12 rounded-[20px] border-pink-200 bg-pink-50/50 shadow-cute-sm ${
                          errors.gender ? 'border-red-300' : ''
                        }`}>
                          <SelectValue placeholder={t.select} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t.maleLabel}</SelectItem>
                          <SelectItem value="female">{t.femaleLabel}</SelectItem>
                          <SelectItem value="other">{t.otherLabel}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.gender}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="skintype" className="text-gray-700 mb-2 text-sm">{t.skinType}</Label>
                      <Select
                        value={registerData.skintype}
                        onValueChange={(value) => {
                          setRegisterData({ ...registerData, skintype: value });
                          setErrors({ ...errors, skintype: undefined });
                        }}
                        disabled={isLoading}
                      >
                        <SelectTrigger className={`h-12 rounded-[20px] border-blue-200 bg-blue-50/50 shadow-cute-sm ${
                          errors.skintype ? 'border-red-300' : ''
                        }`}>
                          <SelectValue placeholder={t.select} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oily">{t.oilySkinLabel}</SelectItem>
                          <SelectItem value="dry">{t.drySkinLabel}</SelectItem>
                          <SelectItem value="combination">{t.combinationSkinLabel}</SelectItem>
                          <SelectItem value="sensitive">{t.sensitiveSkinLabel}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.skintype && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.skintype}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="birthday" className="text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-pink-400" />
                      {t.birthday}
                    </Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={registerData.birthday}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, birthday: e.target.value });
                        setErrors({ ...errors, birthday: undefined });
                      }}
                      className={`h-14 rounded-[24px] border-pink-200 bg-pink-50/50 focus:border-pink-400 focus:bg-white transition-all pl-5 shadow-cute-sm ${
                        errors.birthday ? 'border-red-300 bg-red-50/30' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.birthday && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠️</span> {errors.birthday}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-700 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-blue-400" />
                      {t.profilePhoto} ({t.optional})
                    </Label>
                    <div className="border-2 border-dashed border-blue-200 rounded-[24px] p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer shadow-cute-sm">
                      <Upload className="w-10 h-10 mx-auto mb-3 text-blue-300" />
                      <p className="text-gray-500 text-sm">{t.clickToUpload}</p>
                      <p className="text-gray-400 text-xs mt-1">{t.maxFileSize}</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-[24px] bg-gradient-to-r text-white shadow-cute-lg hover:shadow-cute-xl transition-all duration-300 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #FFD1E7 0%, #DFD3FF 50%, #A0CBFF 100%)',
                    }}
                  >
                    {isLoading ? (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        {t.creatingAccount}
                      </span>
                    ) : (
                      <>
                        <div 
                          className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                          style={{
                            background: 'radial-gradient(circle, rgba(255, 209, 231, 0.4) 0%, rgba(223, 211, 255, 0.3) 50%, rgba(160, 203, 255, 0.4) 100%)',
                          }}
                        />
                        <span className="relative z-10">{t.register} ✨</span>
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <span className="text-gray-600">{t.alreadyHaveAccount} </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setErrors({});
                      }}
                      className="text-pink-500 hover:text-pink-600 hover:underline transition-colors"
                      disabled={isLoading}
                    >
                      {t.login}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

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

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-white/95 rounded-[32px] border-2 border-pink-200 shadow-cute-xl">
          <DialogHeader>
            <div className="flex flex-col items-center text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-cute-lg"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <DialogTitle className="bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 bg-clip-text text-transparent">
                {t.successTitle} 🎉
              </DialogTitle>
            </div>
          </DialogHeader>
          <DialogDescription className="text-center text-gray-600 mb-6">
            {language === 'th' && (
              <>
                ยินดีต้อนรับสู่ GlowbieBell! 💕
                <br />
                คุณสามารถเข้าสู่ระบบและเริ่มวิเคราะห์ผิวได้เลย
              </>
            )}
            {language === 'en' && (
              <>
                Welcome to GlowbieBell! 💕
                <br />
                You can now sign in and start analyzing your skin
              </>
            )}
            {language === 'zh' && (
              <>
                欢迎来到 GlowbieBell！💕
                <br />
                您现在可以登录并开始分析您的皮肤
              </>
            )}
          </DialogDescription>
          <Button
            onClick={handleSuccessDialogClose}
            className="w-full h-12 rounded-[24px] bg-gradient-to-r text-white shadow-cute-lg hover:shadow-cute-xl transition-all duration-300"
            style={{
              backgroundImage: 'linear-gradient(135deg, #FFD1E7 0%, #DFD3FF 50%, #A0CBFF 100%)',
            }}
          >
            {t.login}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
