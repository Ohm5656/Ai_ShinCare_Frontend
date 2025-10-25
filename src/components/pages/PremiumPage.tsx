import { motion } from 'motion/react';
import { 
  ArrowLeft, Crown, Sparkles, Star, Zap, Heart,
  CheckCircle, Lock
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface PremiumPageProps {
  onBack: () => void;
}

export function PremiumPage({ onBack }: PremiumPageProps) {
  const { language } = useLanguage();

  const translations = {
    th: {
      title: 'GlowbieBell Premium',
      subtitle: 'กำลังพัฒนา',
      description: 'ฟีเจอร์พรีเมียมของเรากำลังอยู่ระหว่างการพัฒนา เร็วๆ นี้คุณจะได้สัมผัสกับประสบการณ์การดูแลผิวระดับพรีเมียม!',
      comingSoon: 'เร็วๆ นี้',
      features: 'ฟีเจอร์ที่กำลังจะมา',
      feature1Title: 'การวิเคราะห์ผิวขั้นสูง',
      feature1Desc: 'วิเคราะห์ผิวอย่างละเอียดด้วย AI ขั้นสูง',
      feature2Title: 'คำแนะนำส่วนตัว',
      feature2Desc: 'รับคำแนะนำผลิตภัณฑ์ที่เหมาะกับคุณเฉพาะ',
      feature3Title: 'ติดตามความคืบหน้า',
      feature3Desc: 'ดูความเปลี่ยนแปลงของผิวแบบ real-time',
      feature4Title: 'ปรึกษาผู้เชี่ยวชาญ',
      feature4Desc: 'ปรึกษาผู้เชี่ยวชาญด้านผิวหนังได้ตลอดเวลา',
      feature5Title: 'ไม่มีโฆษณา',
      feature5Desc: 'ใช้งานแอปได้อย่างราบรื่นไร้สิ่งรบกวน',
      feature6Title: 'คอนเทนต์พิเศษ',
      feature6Desc: 'เข้าถึงบทความและวิดีโอดูแลผิวพิเศษ',
      stayTuned: 'ติดตามได้เร็วๆ นี้!',
      backToProfile: 'กลับไปหน้าโปรไฟล์',
    },
    en: {
      title: 'GlowbieBell Premium',
      subtitle: 'Coming Soon',
      description: 'Our premium features are currently under development. Soon you will experience premium-level skin care!',
      comingSoon: 'Coming Soon',
      features: 'Upcoming Features',
      feature1Title: 'Advanced Skin Analysis',
      feature1Desc: 'Detailed skin analysis with advanced AI',
      feature2Title: 'Personal Recommendations',
      feature2Desc: 'Get personalized product recommendations',
      feature3Title: 'Progress Tracking',
      feature3Desc: 'See real-time skin changes',
      feature4Title: 'Expert Consultation',
      feature4Desc: 'Consult skin experts anytime',
      feature5Title: 'Ad-Free',
      feature5Desc: 'Use the app smoothly without interruption',
      feature6Title: 'Exclusive Content',
      feature6Desc: 'Access special skincare articles and videos',
      stayTuned: 'Stay tuned!',
      backToProfile: 'Back to Profile',
    },
    zh: {
      title: 'GlowbieBell 高级会员',
      subtitle: '即将推出',
      description: '我们的高级功能目前正在开发中。很快您就能体验到高级护肤服务！',
      comingSoon: '即将推出',
      features: '即将推出的功能',
      feature1Title: '高级皮肤分析',
      feature1Desc: '使用先进AI进行详细皮肤分析',
      feature2Title: '个性化推荐',
      feature2Desc: '获得专属产品推荐',
      feature3Title: '进度跟踪',
      feature3Desc: '实时查看皮肤变化',
      feature4Title: '专家咨询',
      feature4Desc: '随时咨询皮肤专家',
      feature5Title: '无广告',
      feature5Desc: '流畅使用应用无干扰',
      feature6Title: '独家内容',
      feature6Desc: '访问特殊护肤文章和视频',
      stayTuned: '敬请期待！',
      backToProfile: '返回个人资料',
    }
  };

  const t = translations[language];

  const features = [
    {
      icon: Sparkles,
      title: t.feature1Title,
      desc: t.feature1Desc,
      color: 'from-pink-400 to-rose-400'
    },
    {
      icon: Heart,
      title: t.feature2Title,
      desc: t.feature2Desc,
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Zap,
      title: t.feature3Title,
      desc: t.feature3Desc,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Star,
      title: t.feature4Title,
      desc: t.feature4Desc,
      color: 'from-amber-400 to-orange-400'
    },
    {
      icon: CheckCircle,
      title: t.feature5Title,
      desc: t.feature5Desc,
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: Lock,
      title: t.feature6Title,
      desc: t.feature6Desc,
      color: 'from-indigo-400 to-purple-400'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-pink-100">
        <div className="flex items-center justify-between px-6 py-4">
          <motion.button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center hover:shadow-lg transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-pink-600" />
          </motion.button>
          <h3 className="text-gray-800">{t.title}</h3>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 py-8 pb-24 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          {/* Animated Crown Icon */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 via-yellow-200 to-amber-300 shadow-2xl"
          >
            <Crown className="w-12 h-12 text-amber-600" />
          </motion.div>

          <div>
            <h1 className="text-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {t.title}
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700">{t.comingSoon}</span>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 max-w-md mx-auto"
          >
            {t.description}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-800 mb-4"
          >
            {t.features}
          </motion.h2>

          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-pink-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center space-y-4"
        >
          <Card className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 border-2 border-pink-200">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-gray-800 mb-2">{t.stayTuned}</h3>
            <p className="text-gray-600 text-sm">
              {language === 'th' && 'เราจะแจ้งให้คุณทราบเมื่อฟีเจอร์พรีเมียมพร้อมใช้งาน'}
              {language === 'en' && "We'll notify you when premium features are ready"}
              {language === 'zh' && '高级功能准备就绪时我们会通知您'}
            </p>
          </Card>

          <Button
            onClick={onBack}
            className="w-full h-14 rounded-[24px] bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t.backToProfile}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
