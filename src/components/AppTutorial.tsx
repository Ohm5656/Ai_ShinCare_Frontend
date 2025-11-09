import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { 
  Home, 
  ScanFace, 
  BarChart3, 
  MessageCircle, 
  History, 
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Camera,
  Zap,
  Heart,
  Star
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AppTutorialProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TutorialStep {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  mockupEmojis: string[];
  accentColor: string;
}

export function AppTutorial({ open, onOpenChange }: AppTutorialProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = [
    { 
      icon: Home, 
      iconColor: 'text-blue-600', 
      iconBg: 'from-blue-100 to-lavender-100',
      mockupEmojis: ['📊', '✨', '💯'],
      accentColor: 'blue'
    },
    { 
      icon: ScanFace, 
      iconColor: 'text-pink-600', 
      iconBg: 'from-pink-100 to-pink-200',
      mockupEmojis: ['📸', '👤', '🎯'],
      accentColor: 'pink'
    },
    { 
      icon: BarChart3, 
      iconColor: 'text-lavender-600', 
      iconBg: 'from-lavender-100 to-blue-100',
      mockupEmojis: ['📈', '🎨', '💎'],
      accentColor: 'lavender'
    },
    { 
      icon: MessageCircle, 
      iconColor: 'text-blue-600', 
      iconBg: 'from-blue-100 to-pink-100',
      mockupEmojis: ['💬', '🤖', '💡'],
      accentColor: 'blue'
    },
    { 
      icon: History, 
      iconColor: 'text-pink-600', 
      iconBg: 'from-pink-100 to-lavender-100',
      mockupEmojis: ['📅', '📊', '🌟'],
      accentColor: 'pink'
    },
    { 
      icon: User, 
      iconColor: 'text-lavender-600', 
      iconBg: 'from-lavender-100 to-pink-100',
      mockupEmojis: ['👤', '⚙️', '🌐'],
      accentColor: 'lavender'
    },
  ];

  const getTutorialContent = (step: number) => {
    const contents = [
      { title: t.tutorialStep1Title, desc: t.tutorialStep1Desc },
      { title: t.tutorialStep2Title, desc: t.tutorialStep2Desc },
      { title: t.tutorialStep3Title, desc: t.tutorialStep3Desc },
      { title: t.tutorialStep4Title, desc: t.tutorialStep4Desc },
      { title: t.tutorialStep5Title, desc: t.tutorialStep5Desc },
      { title: t.tutorialStep6Title, desc: t.tutorialStep6Desc },
    ];
    return contents[step];
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setCurrentStep(0);
    onOpenChange(false);
  };

  const handleSkip = () => {
    setCurrentStep(0);
    onOpenChange(false);
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const content = getTutorialContent(currentStep);
  const isLastStep = currentStep === steps.length - 1;

  // Mockup Preview Component
  const MockupPreview = ({ stepIndex }: { stepIndex: number }) => {
    const stepData = steps[stepIndex];
    const emojis = stepData.mockupEmojis;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`relative w-full h-32 rounded-2xl bg-gradient-to-br ${stepData.iconBg} p-4 overflow-hidden`}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute top-2 left-2 w-16 h-16 rounded-full bg-white blur-xl`}></div>
          <div className={`absolute bottom-2 right-2 w-20 h-20 rounded-full bg-white blur-xl`}></div>
        </div>

        {/* Content Based on Step */}
        <div className="relative z-10 h-full flex items-center justify-center gap-3">
          {stepIndex === 0 && (
            // Home Dashboard Preview
            <>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="text-3xl">{emojis[0]}</div>
                <div className="bg-white/80 px-3 py-1 rounded-full text-xs text-gray-700">Score</div>
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="text-3xl">{emojis[1]}</div>
                <div className="bg-white/80 px-3 py-1 rounded-full text-xs text-gray-700">Trends</div>
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="text-3xl">{emojis[2]}</div>
                <div className="bg-white/80 px-3 py-1 rounded-full text-xs text-gray-700">Stats</div>
              </motion.div>
            </>
          )}
          
          {stepIndex === 1 && (
            // Face Scan Preview
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="relative"
              >
                <div className="w-16 h-20 rounded-2xl bg-white/80 border-2 border-pink-300 flex items-center justify-center text-2xl">
                  {emojis[1]}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-xs">
                  {emojis[2]}
                </div>
              </motion.div>
              <div className="flex flex-col gap-1">
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-lg"
                >
                  <ChevronRight className="w-3 h-3 text-pink-500" />
                  <span className="text-xs text-gray-700">Front</span>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-lg"
                >
                  <ChevronRight className="w-3 h-3 text-pink-500" />
                  <span className="text-xs text-gray-700">Left</span>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-lg"
                >
                  <ChevronRight className="w-3 h-3 text-pink-500" />
                  <span className="text-xs text-gray-700">Right</span>
                </motion.div>
              </div>
            </div>
          )}
          
          {stepIndex === 2 && (
            // Analysis Result Preview
            <div className="flex flex-col gap-2 w-full px-2">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between bg-white/80 px-3 py-2 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{emojis[0]}</span>
                  <span className="text-xs text-gray-700">Score</span>
                </div>
                <div className="text-sm text-lavender-600">87</div>
              </motion.div>
              <div className="grid grid-cols-3 gap-1">
                {[emojis[1], emojis[2], '✨'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-white/80 px-2 py-1 rounded-lg text-center text-sm"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {stepIndex === 3 && (
            // Chat Assistant Preview
            <div className="flex flex-col gap-2 w-full px-2">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{emojis[1]}</span>
                  <span className="text-xs text-gray-600">Dr.SkinAI</span>
                </div>
                <div className="text-xs text-gray-700">Hello! How can I help?</div>
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-pink-200 to-blue-200 px-3 py-2 rounded-2xl rounded-br-sm max-w-[70%] self-end"
              >
                <div className="text-xs text-gray-800">Skincare tips? {emojis[2]}</div>
              </motion.div>
            </div>
          )}
          
          {stepIndex === 4 && (
            // History Preview
            <div className="flex flex-col gap-1 w-full px-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-between bg-white/80 px-3 py-1.5 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{emojis[i % 3]}</span>
                    <span className="text-xs text-gray-600">Scan {3 - i}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-gray-700">{87 - i}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {stepIndex === 5 && (
            // Profile Preview
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-lavender-200 border-3 border-white flex items-center justify-center text-2xl shadow-lg">
                  {emojis[0]}
                </div>
                <div className="bg-white/80 px-3 py-1 rounded-full text-xs text-gray-700">Profile</div>
              </motion.div>
              <div className="flex flex-col gap-1.5">
                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 px-3 py-1.5 rounded-lg text-xs text-gray-700 flex items-center gap-1"
                >
                  {emojis[1]} Settings
                </motion.div>
                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/80 px-3 py-1.5 rounded-lg text-xs text-gray-700 flex items-center gap-1"
                >
                  {emojis[2]} Language
                </motion.div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/98 backdrop-blur-sm rounded-[32px] border-2 border-pink-200 shadow-2xl overflow-hidden !z-[100]">
        {/* Header */}
        <DialogHeader className="space-y-3 pb-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-pink-500" />
            <DialogTitle className="text-center bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 bg-clip-text text-transparent">
              {t.tutorialTitle}
            </DialogTitle>
          </div>
          <DialogDescription className="text-center text-gray-600">
            {t.tutorialWelcome}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 py-3">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-gradient-to-r from-pink-400 to-blue-400'
                  : index < currentStep
                  ? 'w-2 bg-gradient-to-r from-pink-300 to-blue-300'
                  : 'w-2 bg-gray-200'
              }`}
              initial={false}
              animate={{
                scale: index === currentStep ? 1.1 : 1,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 py-2"
          >
            {/* Icon */}
            <div className="flex items-center justify-center">
              <motion.div
                className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${currentStepData.iconBg} flex items-center justify-center shadow-lg`}
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Icon className={`w-10 h-10 ${currentStepData.iconColor}`} />
              </motion.div>
            </div>

            {/* Mockup Preview */}
            <MockupPreview stepIndex={currentStep} />

            {/* Title & Description */}
            <div className="text-center space-y-2 px-2">
              <h3 className="text-gray-800">
                {content.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {content.desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {/* Skip/Previous Button */}
          {currentStep === 0 ? (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl"
            >
              {t.tutorialSkip}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 border-gray-200 hover:bg-gray-50 rounded-2xl"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t.tutorialPrevious}
            </Button>
          )}

          {/* Next/Finish Button */}
          <Button
            onClick={handleNext}
            className={`flex-1 rounded-2xl shadow-md ${
              isLastStep
                ? 'bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 hover:from-pink-600 hover:via-lavender-600 hover:to-blue-600'
                : 'bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500'
            } text-white`}
          >
            {isLastStep ? (
              t.tutorialFinish
            ) : (
              <>
                {t.tutorialNext}
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Step Counter */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">
            {currentStep + 1} / {steps.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
