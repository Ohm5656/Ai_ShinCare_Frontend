import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Droplet, Zap, Frown, Sun, Wrench, Sparkles, ChevronRight, User, Calendar, Droplets, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { FloatingParticles } from '../animations/FloatingParticles';

interface PreAnalysisChatProps {
  onComplete: (data: {
    concerns: string[];
    gender?: string;
    age?: string;
    skinType?: string;
    isSensitive?: boolean;
  }) => void;
}

interface SkinConcern {
  id: string;
  icon: React.ReactNode;
  color: string;
  labelTh: string;
  labelEn: string;
  labelZh: string;
}

export function PreAnalysisChat({ onComplete }: PreAnalysisChatProps) {
  const { t } = useLanguage();
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [skinType, setSkinType] = useState<string>('');
  const [isSensitive, setIsSensitive] = useState<boolean | undefined>(undefined);

  const skinConcerns: SkinConcern[] = [
    {
      id: 'acne',
      icon: <Zap className="w-5 h-5" />,
      color: '#FFB5D9',
      labelTh: 'สิว/รอยสิว',
      labelEn: 'Acne & Scars',
      labelZh: '痘痘/痘印',
    },
    {
      id: 'wrinkles',
      icon: <Wrench className="w-5 h-5" />,
      color: '#7DB8FF',
      labelTh: 'ริ้วรอย',
      labelEn: 'Wrinkles',
      labelZh: '皱纹',
    },
    {
      id: 'redness',
      icon: <Frown className="w-5 h-5" />,
      color: '#FFB5D9',
      labelTh: 'ความแดง',
      labelEn: 'Redness',
      labelZh: '红血丝',
    },
    {
      id: 'oiliness',
      icon: <Droplet className="w-5 h-5" />,
      color: '#7DB8FF',
      labelTh: 'ความมัน',
      labelEn: 'Oiliness',
      labelZh: '油性',
    },
    {
      id: 'dryness',
      icon: <Sun className="w-5 h-5" />,
      color: '#CBB8FF',
      labelTh: 'ความแห้ง',
      labelEn: 'Dryness',
      labelZh: '干燥',
    },
    {
      id: 'pigmentation',
      icon: <Sparkles className="w-5 h-5" />,
      color: '#FFB5D9',
      labelTh: 'ฝ้า/กระ',
      labelEn: 'Dark Spots',
      labelZh: '色斑',
    },
  ];

  // Gender options
  const genderOptions = [
    {
      id: 'female',
      labelTh: 'หญิง',
      labelEn: 'Female',
      labelZh: '女性',
    },
    {
      id: 'male',
      labelTh: 'ชาย',
      labelEn: 'Male',
      labelZh: '男性',
    },
    {
      id: 'other',
      labelTh: 'ไม่ระบุ',
      labelEn: 'Other',
      labelZh: '其他',
    },
  ];

  // Age ranges
  const ageRanges = [
    {
      id: 'under-20',
      labelTh: 'ต่ำกว่า 20',
      labelEn: 'Under 20',
      labelZh: '20岁以下',
    },
    {
      id: '20-29',
      labelTh: '20-29',
      labelEn: '20-29',
      labelZh: '20-29岁',
    },
    {
      id: '30-39',
      labelTh: '30-39',
      labelEn: '30-39',
      labelZh: '30-39岁',
    },
    {
      id: '40-49',
      labelTh: '40-49',
      labelEn: '40-49',
      labelZh: '40-49岁',
    },
    {
      id: '50-plus',
      labelTh: '50+',
      labelEn: '50+',
      labelZh: '50岁以上',
    },
  ];

  // Skin types
  const skinTypes = [
    {
      id: 'dry',
      labelTh: 'ผิวแห้ง',
      labelEn: 'Dry',
      labelZh: '干性',
      icon: <Sun className="w-5 h-5" />,
      color: '#FFB5D9',
    },
    {
      id: 'oily',
      labelTh: 'ผิวมัน',
      labelEn: 'Oily',
      labelZh: '油性',
      icon: <Droplet className="w-5 h-5" />,
      color: '#7DB8FF',
    },
    {
      id: 'combination',
      labelTh: 'ผิวผสม',
      labelEn: 'Combination',
      labelZh: '混合性',
      icon: <Droplets className="w-5 h-5" />,
      color: '#CBB8FF',
    },
    {
      id: 'normal',
      labelTh: 'ผิวปกติ',
      labelEn: 'Normal',
      labelZh: '中性',
      icon: <Sparkles className="w-5 h-5" />,
      color: '#7DB8FF',
    },
  ];

  const handleToggleConcern = (id: string) => {
    if (selectedConcerns.includes(id)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== id));
    } else {
      setSelectedConcerns([...selectedConcerns, id]);
    }
  };

  const handleSubmit = () => {
    onComplete({
      concerns: selectedConcerns,
      gender: gender || undefined,
      age: age || undefined,
      skinType: skinType || undefined,
      isSensitive,
    });
  };

  const getLabel = (concern: SkinConcern) => {
    if (t.language === 'th') return concern.labelTh;
    if (t.language === 'en') return concern.labelEn;
    return concern.labelZh;
  };

  const getOptionLabel = (option: any) => {
    if (t.language === 'th') return option.labelTh;
    if (t.language === 'en') return option.labelEn;
    return option.labelZh;
  };

  const title = 
    t.language === 'th' ? 'ข้อมูลเพื่อการวิเคราะห์' :
    t.language === 'en' ? 'Profile for Analysis' :
    '分析档案';

  const subtitle = 
    t.language === 'th' ? 'เลือกข้อมูลที่ตรงกับคุณ เพื่อผลลัพธ์ที่แม่นยำ' :
    t.language === 'en' ? 'Select options that match you for accurate results' :
    '选择符合您的选项以获得准确结果';

  const genderLabel = 
    t.language === 'th' ? 'เพศ' :
    t.language === 'en' ? 'Gender' :
    '性别';

  const ageLabel = 
    t.language === 'th' ? 'อายุ' :
    t.language === 'en' ? 'Age' :
    '年龄';

  const skinTypeLabel = 
    t.language === 'th' ? 'ประเภทผิว' :
    t.language === 'en' ? 'Skin Type' :
    '皮肤类型';

  const sensitiveLabel = 
    t.language === 'th' ? 'ผิวแพ้ง่าย/ระคายเคืองง่าย' :
    t.language === 'en' ? 'Sensitive/Easily Irritated' :
    '敏感/易受刺激';

  const concernsLabel = 
    t.language === 'th' ? 'ปัญหาผิวที่สนใจ (เลือกได้หลายข้อ)' :
    t.language === 'en' ? 'Skin Concerns (Select all that apply)' :
    '皮肤问题（可多选）';

  const submitText = 
    t.language === 'th' ? 'เริ่มวิเคราะห์' :
    t.language === 'en' ? 'Start Analysis' :
    '开始分析';

  const yesText = 
    t.language === 'th' ? 'ใช่' :
    t.language === 'en' ? 'Yes' :
    '是';

  const noText = 
    t.language === 'th' ? 'ไม่' :
    t.language === 'en' ? 'No' :
    '否';

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(180deg, #F8F9FF 0%, #FFF5FA 100%)'
    }}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <motion.div 
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #FFB5D9 0%, transparent 70%)' }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute top-1/3 -right-32 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, #7DB8FF 0%, transparent 70%)' }}
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div 
          className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #CBB8FF 0%, transparent 70%)' }}
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Floating Particles */}
      <FloatingParticles 
        count={8} 
        colors={['#FFB5D9', '#7DB8FF', '#CBB8FF']}
        useEmojis={false}
      />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div 
              className="inline-block mb-4 w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FFB5D9 0%, #7DB8FF 100%)',
                boxShadow: '0 8px 24px rgba(255, 181, 217, 0.3)'
              }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="mb-2" style={{ color: '#1A1A1A' }}>
              {title}
            </h1>
            <p className="text-sm" style={{ color: '#666666' }}>
              {subtitle}
            </p>
          </motion.div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Gender Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h3 className="text-sm flex items-center gap-2" style={{ color: '#333333' }}>
                <User className="w-4 h-4" style={{ color: '#7DB8FF' }} />
                {genderLabel}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {genderOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setGender(option.id)}
                    className="p-3 rounded-2xl backdrop-blur-sm transition-all duration-300"
                    style={{
                      background: gender === option.id
                        ? 'linear-gradient(135deg, #7DB8FF20 0%, #7DB8FF10 100%)'
                        : 'rgba(255, 255, 255, 0.7)',
                      border: gender === option.id
                        ? '2px solid #7DB8FF'
                        : '2px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: gender === option.id
                        ? '0 4px 16px rgba(125, 184, 255, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {gender === option.id && (
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#7DB8FF' }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className="text-xs" style={{ color: gender === option.id ? '#7DB8FF' : '#666666' }}>
                        {getOptionLabel(option)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Age Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-3"
            >
              <h3 className="text-sm flex items-center gap-2" style={{ color: '#333333' }}>
                <Calendar className="w-4 h-4" style={{ color: '#CBB8FF' }} />
                {ageLabel}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {ageRanges.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setAge(option.id)}
                    className="p-3 rounded-2xl backdrop-blur-sm transition-all duration-300"
                    style={{
                      background: age === option.id
                        ? 'linear-gradient(135deg, #CBB8FF20 0%, #CBB8FF10 100%)'
                        : 'rgba(255, 255, 255, 0.7)',
                      border: age === option.id
                        ? '2px solid #CBB8FF'
                        : '2px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: age === option.id
                        ? '0 4px 16px rgba(203, 184, 255, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {age === option.id && (
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#CBB8FF' }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className="text-xs" style={{ color: age === option.id ? '#CBB8FF' : '#666666' }}>
                        {getOptionLabel(option)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Skin Type Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h3 className="text-sm flex items-center gap-2" style={{ color: '#333333' }}>
                <Droplets className="w-4 h-4" style={{ color: '#FFB5D9' }} />
                {skinTypeLabel}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {skinTypes.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSkinType(option.id)}
                    className="p-4 rounded-2xl backdrop-blur-sm transition-all duration-300"
                    style={{
                      background: skinType === option.id
                        ? `linear-gradient(135deg, ${option.color}20 0%, ${option.color}10 100%)`
                        : 'rgba(255, 255, 255, 0.7)',
                      border: skinType === option.id
                        ? `2px solid ${option.color}`
                        : '2px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: skinType === option.id
                        ? `0 4px 16px ${option.color}40`
                        : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${option.color}20`,
                          color: option.color,
                        }}
                      >
                        {option.icon}
                      </div>
                      <span className="text-sm flex-1 text-left" style={{ color: skinType === option.id ? option.color : '#666666' }}>
                        {getOptionLabel(option)}
                      </span>
                      {skinType === option.id && (
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: option.color }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Sensitivity Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-3"
            >
              <h3 className="text-sm flex items-center gap-2" style={{ color: '#333333' }}>
                <AlertCircle className="w-4 h-4" style={{ color: '#FFB5D9' }} />
                {sensitiveLabel}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsSensitive(true)}
                  className="p-4 rounded-2xl backdrop-blur-sm transition-all duration-300"
                  style={{
                    background: isSensitive === true
                      ? 'linear-gradient(135deg, #FFB5D920 0%, #FFB5D910 100%)'
                      : 'rgba(255, 255, 255, 0.7)',
                    border: isSensitive === true
                      ? '2px solid #FFB5D9'
                      : '2px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: isSensitive === true
                      ? '0 4px 16px rgba(255, 181, 217, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSensitive === true && (
                      <div 
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#FFB5D9' }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-sm" style={{ color: isSensitive === true ? '#FFB5D9' : '#666666' }}>
                      {yesText}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setIsSensitive(false)}
                  className="p-4 rounded-2xl backdrop-blur-sm transition-all duration-300"
                  style={{
                    background: isSensitive === false
                      ? 'linear-gradient(135deg, #7DB8FF20 0%, #7DB8FF10 100%)'
                      : 'rgba(255, 255, 255, 0.7)',
                    border: isSensitive === false
                      ? '2px solid #7DB8FF'
                      : '2px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: isSensitive === false
                      ? '0 4px 16px rgba(125, 184, 255, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSensitive === false && (
                      <div 
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#7DB8FF' }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-sm" style={{ color: isSensitive === false ? '#7DB8FF' : '#666666' }}>
                      {noText}
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Concerns Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 pb-4"
            >
              <h3 className="text-sm flex items-center gap-2" style={{ color: '#333333' }}>
                <Sparkles className="w-4 h-4" style={{ color: '#7DB8FF' }} />
                {concernsLabel}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {skinConcerns.map((concern) => {
                  const isSelected = selectedConcerns.includes(concern.id);
                  
                  return (
                    <button
                      key={concern.id}
                      onClick={() => handleToggleConcern(concern.id)}
                      className="p-4 rounded-2xl backdrop-blur-sm transition-all duration-300"
                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, ${concern.color}25 0%, ${concern.color}10 100%)`
                          : 'rgba(255, 255, 255, 0.7)',
                        border: isSelected 
                          ? `2px solid ${concern.color}`
                          : '2px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: isSelected
                          ? `0 4px 16px ${concern.color}40`
                          : '0 2px 8px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: isSelected ? concern.color : `${concern.color}15`,
                            color: isSelected ? 'white' : concern.color,
                          }}
                        >
                          {concern.icon}
                        </div>
                        <span 
                          className="text-xs flex-1 text-left"
                          style={{ 
                            color: isSelected ? concern.color : '#666666',
                          }}
                        >
                          {getLabel(concern)}
                        </span>
                        {isSelected && (
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: concern.color }}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="fixed bottom-0 left-0 right-0 px-6 py-6 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.95) 20%, rgba(255, 255, 255, 0.98) 100%)',
          }}
        >
          <button
            onClick={handleSubmit}
            className="w-full max-w-md mx-auto py-4 px-6 rounded-full transition-all flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #FFB5D9 0%, #7DB8FF 100%)',
              boxShadow: '0 8px 24px rgba(255, 181, 217, 0.4)',
              color: 'white',
            }}
          >
            <span>{submitText}</span>
            {selectedConcerns.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                {selectedConcerns.length}
              </span>
            )}
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
