import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Lock, User, Calendar, Upload, CheckCircle2, Languages, Eye, EyeOff, X } from 'lucide-react';
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
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  
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

  // Birthday state (separate for easier selection)
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');

  // Validate email format - more flexible regex
  const isValidEmail = (email: string) => {
    // More comprehensive email regex that supports:
    // - Multiple dots, hyphens, underscores, plus signs
    // - Subdomains
    // - Longer TLDs
    // - International characters
    const emailRegex = /^[a-zA-Z0-9._+%-]+@[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (checks.length) strength += 20;
    if (checks.uppercase) strength += 20;
    if (checks.lowercase) strength += 20;
    if (checks.number) strength += 20;
    if (checks.special) strength += 20;

    return { strength, checks };
  };

  const passwordStrength = getPasswordStrength(registerData.password);

  // Generate birthday options
  const generateDays = () => {
    return Array.from({ length: 31 }, (_, i) => {
      const day = (i + 1).toString();
      return day;
    });
  };

  const generateMonths = () => {
    const monthNames = {
      th: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    return monthNames[language].map((month, index) => ({
      value: (index + 1).toString().padStart(2, '0'),
      label: month
    }));
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    const endYear = currentYear - 10; // Minimum age 10 years
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
      return (endYear - i).toString();
    });
  };

  // Update birthday when individual fields change
  const updateBirthday = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const formattedMonth = month.padStart(2, '0');
      const formattedDay = day.padStart(2, '0');
      setRegisterData({ ...registerData, birthday: `${year}-${formattedMonth}-${formattedDay}` });
    }
  };

  const getStrengthLabel = () => {
    if (registerData.password.length === 0) return '';
    if (passwordStrength.strength < 40) {
      return language === 'th' ? 'อ่อนแอมาก' : language === 'en' ? 'Very Weak' : '非常弱';
    }
    if (passwordStrength.strength < 60) {
      return language === 'th' ? 'อ่อนแอ' : language === 'en' ? 'Weak' : '弱';
    }
    if (passwordStrength.strength < 80) {
      return language === 'th' ? 'ปานกลาง' : language === 'en' ? 'Medium' : '中等';
    }
    if (passwordStrength.strength < 100) {
      return language === 'th' ? 'แข็งแรง' : language === 'en' ? 'Strong' : '强';
    }
    return language === 'th' ? 'แข็งแรงมาก' : language === 'en' ? 'Very Strong' : '非常强';
  };

  const getStrengthColor = () => {
    if (passwordStrength.strength < 40) return 'bg-red-500';
    if (passwordStrength.strength < 60) return 'bg-orange-500';
    if (passwordStrength.strength < 80) return 'bg-yellow-500';
    if (passwordStrength.strength < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          language === 'th' ? 'ไฟล์ใหญ่เกินไป' : language === 'en' ? 'File too large' : '文件太大',
          {
            description: language === 'th' ? 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB' : language === 'en' ? 'Please select a file under 5MB' : '请选择小于5MB的文件'
          }
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setProfileImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImageFile(null);
  };

  // Validate login form
  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!loginEmail || !loginEmail.trim()) {
      newErrors.email = t.required;
    } else if (!isValidEmail(loginEmail)) {
      newErrors.email = t.invalidEmail;
    }

    if (!loginPassword || !loginPassword.trim()) {
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

    if (!registerData.email || !registerData.email.trim()) {
      newErrors.email = t.required;
    } else if (!isValidEmail(registerData.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!registerData.password || !registerData.password.trim()) {
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
      setProfileImage(null);
      setProfileImageFile(null);
      setBirthDay('');
      setBirthMonth('');
      setBirthYear('');
    }, 2000);
  };

  // Handle OAuth login
  const handleOAuthLogin = (provider: 'google' | 'apple') => {
    const providerName = provider === 'google' ? 'Google' : 'Apple';
    const connectingMsg = language === 'th' ? `ำลังเชื่อมต่อกับ ${providerName}... 🔄` : 
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100/60 to-pink-100/70 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Simplified Background - Remove heavy blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/20 rounded-full" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200/20 rounded-full" />
        </div>

        {/* Floating Gradient Orbs - Simplified */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <style>{`
            @keyframes float-slow-1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -40px) scale(1.1); }
              66% { transform: translate(-20px, 30px) scale(0.95); }
            }
            @keyframes float-slow-2 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(-40px, 30px) scale(0.9); }
              66% { transform: translate(35px, -25px) scale(1.15); }
            }
            @keyframes float-slow-3 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(25px, 35px) scale(1.05); }
            }
            @keyframes float-slow-4 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-30px, -30px) scale(0.92); }
            }
            @keyframes float-slow-5 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(20px, 35px) scale(1.08); }
              66% { transform: translate(-30px, -20px) scale(0.96); }
            }
            @keyframes float-slow-6 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(35px, -20px) scale(1.1); }
            }
            .float-orb-1 { animation: float-slow-1 45s ease-in-out infinite; }
            .float-orb-2 { animation: float-slow-2 50s ease-in-out infinite; }
            .float-orb-3 { animation: float-slow-3 40s ease-in-out infinite; }
            .float-orb-4 { animation: float-slow-4 55s ease-in-out infinite; }
            .float-orb-5 { animation: float-slow-5 48s ease-in-out infinite; }
            .float-orb-6 { animation: float-slow-6 52s ease-in-out infinite; }
          `}</style>
          
          {/* Blue orbs */}
          <div className="float-orb-1 absolute top-20 left-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-blue-300/20 to-blue-500/10 blur-2xl" />
          <div className="float-orb-2 absolute top-[60%] left-[8%] w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/15 to-blue-300/10 blur-3xl" />
          
          {/* Pink orbs */}
          <div className="float-orb-3 absolute top-[15%] right-[12%] w-36 h-36 rounded-full bg-gradient-to-br from-pink-300/18 to-pink-500/12 blur-2xl" />
          <div className="float-orb-4 absolute bottom-[20%] right-[10%] w-44 h-44 rounded-full bg-gradient-to-br from-pink-400/15 to-pink-300/10 blur-3xl" />
          
          {/* Purple orbs */}
          <div className="float-orb-5 absolute top-[40%] right-[25%] w-28 h-28 rounded-full bg-gradient-to-br from-purple-300/20 to-purple-500/12 blur-2xl" />
          <div className="float-orb-6 absolute bottom-[35%] left-[20%] w-38 h-38 rounded-full bg-gradient-to-br from-purple-400/18 to-purple-300/10 blur-3xl" />
        </div>

        {/* Language Switcher Button - Top Right */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          onClick={() => setShowLanguageDialog(true)}
          className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-300/70 hover:border-purple-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Languages className="w-5 h-5 text-purple-600" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo & Welcome */}
          <div className="text-center mb-8">
            <motion.div 
              className="mb-4 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut",
                delay: 0.1
              }}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
            >
              <GlowbieBellLogo size={140} animated={true} />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
            >
              GlowbieBell
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-700"
            >
              {t.appTagline}
            </motion.p>
          </div>

          {/* Tab Switcher */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-white/95 backdrop-blur-sm rounded-full p-1.5 mb-6 flex shadow-lg border border-purple-200/70"
          >
            <button
              onClick={() => {
                setActiveTab('login');
                setErrors({});
              }}
              className={`flex-1 py-3 px-6 rounded-full transition-all duration-300 relative ${
                activeTab === 'login'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {activeTab === 'login' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t.loginTitle}</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('register');
                setErrors({});
              }}
              className={`flex-1 py-3 px-6 rounded-full transition-all duration-300 relative ${
                activeTab === 'register'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {activeTab === 'register' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t.registerTitle}</span>
            </button>
          </motion.div>

          {/* Form Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-white/98 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-200/70"
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
                      type="email"
                      placeholder={t.enterEmail}
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value.trim());
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
                    <div className="relative">
                      <Input
                        id="password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          setErrors({ ...errors, password: undefined });
                        }}
                        className={`h-14 rounded-[24px] border-blue-200 bg-blue-50/50 focus:border-blue-400 focus:bg-white transition-all pl-5 pr-12 shadow-cute-sm ${
                          errors.password ? 'border-red-300 bg-red-50/30' : ''
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
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
                        setRegisterData({ ...registerData, email: e.target.value.trim() });
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
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, password: e.target.value });
                          setErrors({ ...errors, password: undefined });
                        }}
                        className={`h-14 rounded-[24px] border-lavender-200 bg-lavender-50/50 focus:border-lavender-400 focus:bg-white transition-all pl-5 pr-12 shadow-cute-sm ${
                          errors.password ? 'border-red-300 bg-red-50/30' : ''
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {registerData.password && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            {language === 'th' ? 'ความแข็งแรงของรหัสผ่าน' : language === 'en' ? 'Password Strength' : '密码强度'}
                          </span>
                          <span className={`font-medium ${
                            passwordStrength.strength < 40 ? 'text-red-500' :
                            passwordStrength.strength < 60 ? 'text-orange-500' :
                            passwordStrength.strength < 80 ? 'text-yellow-500' :
                            passwordStrength.strength < 100 ? 'text-blue-500' : 'text-green-500'
                          }`}>
                            {getStrengthLabel()}
                          </span>
                        </div>
                        
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.strength}%` }}
                            transition={{ duration: 0.3 }}
                            className={`h-full ${getStrengthColor()} transition-colors`}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordStrength.checks.length ? '✓' : '○'} {language === 'th' ? '8 ตัวอักษรขึ้นไป' : language === 'en' ? '8+ characters' : '8个以上字符'}
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordStrength.checks.uppercase ? '✓' : '○'} {language === 'th' ? 'ตัวพิมพ์ใหญ่' : language === 'en' ? 'Uppercase' : '大写字母'}
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordStrength.checks.lowercase ? '✓' : '○'} {language === 'th' ? 'ตัวพิมพ์เล็ก' : language === 'en' ? 'Lowercase' : '小写字母'}
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordStrength.checks.number ? '✓' : '○'} {language === 'th' ? 'ตัวเลข' : language === 'en' ? 'Number' : '数字'}
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordStrength.checks.special ? '✓' : '○'} {language === 'th' ? 'อักขระพิเศษ' : language === 'en' ? 'Special char' : '特殊字符'}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
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
                    <Label className="text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-pink-400" />
                      {t.birthday}
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Day */}
                      <div>
                        <Select
                          value={birthDay}
                          onValueChange={(value) => {
                            setBirthDay(value);
                            updateBirthday(value, birthMonth, birthYear);
                            setErrors({ ...errors, birthday: undefined });
                          }}
                          disabled={isLoading}
                        >
                          <SelectTrigger className={`h-12 rounded-[20px] border-pink-200 bg-pink-50/50 shadow-cute-sm ${
                            errors.birthday ? 'border-red-300' : ''
                          }`}>
                            <SelectValue placeholder={language === 'th' ? 'วัน' : language === 'en' ? 'Day' : '日'} />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {generateDays().map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Month */}
                      <div>
                        <Select
                          value={birthMonth}
                          onValueChange={(value) => {
                            setBirthMonth(value);
                            updateBirthday(birthDay, value, birthYear);
                            setErrors({ ...errors, birthday: undefined });
                          }}
                          disabled={isLoading}
                        >
                          <SelectTrigger className={`h-12 rounded-[20px] border-pink-200 bg-pink-50/50 shadow-cute-sm ${
                            errors.birthday ? 'border-red-300' : ''
                          }`}>
                            <SelectValue placeholder={language === 'th' ? 'เดือน' : language === 'en' ? 'Month' : '月'} />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {generateMonths().map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Year */}
                      <div>
                        <Select
                          value={birthYear}
                          onValueChange={(value) => {
                            setBirthYear(value);
                            updateBirthday(birthDay, birthMonth, value);
                            setErrors({ ...errors, birthday: undefined });
                          }}
                          disabled={isLoading}
                        >
                          <SelectTrigger className={`h-12 rounded-[20px] border-pink-200 bg-pink-50/50 shadow-cute-sm ${
                            errors.birthday ? 'border-red-300' : ''
                          }`}>
                            <SelectValue placeholder={language === 'th' ? 'ปี' : language === 'en' ? 'Year' : '年'} />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {generateYears().map((year) => (
                              <SelectItem key={year} value={year}>
                                {language === 'th' ? (parseInt(year) + 543).toString() : year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
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
                    
                    {profileImage ? (
                      <div className="relative border-2 border-blue-200 rounded-[24px] p-4 bg-blue-50/30 shadow-cute-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-md flex-shrink-0">
                            <img 
                              src={profileImage} 
                              alt="Profile preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 truncate">
                              {profileImageFile?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {profileImageFile && (profileImageFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removeProfileImage}
                            className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="block border-2 border-dashed border-blue-200 rounded-[24px] p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer shadow-cute-sm">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isLoading}
                        />
                        <Upload className="w-10 h-10 mx-auto mb-3 text-blue-300" />
                        <p className="text-gray-500 text-sm">{t.clickToUpload}</p>
                        <p className="text-gray-400 text-xs mt-1">{t.maxFileSize}</p>
                      </label>
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