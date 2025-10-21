import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { GlowbieBellLogo } from '../GlowbieBellLogo';
import { useLanguage } from '../../contexts/LanguageContext';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    if (!email) {
      setError(t.pleaseEnterEmail);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t.emailFormatInvalid);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-blue-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorations */}
        <motion.div
          className="absolute top-20 left-10 text-green-300 opacity-40"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 inline-block"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-cute-xl">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
          >
            {t.emailSent}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 rounded-[32px] p-8 shadow-cute-xl border border-green-100 mb-6"
          >
            <p className="text-gray-600 mb-3">
              {t.resetLinkSentTo}
            </p>
            <p className="text-pink-500 mb-6">
              {email}
            </p>
            <p className="text-gray-500 text-sm">
              {t.checkEmailInstructions}
              <br />
              <span className="text-xs text-gray-400 mt-2 block">
                {t.emailInSpam}
              </span>
            </p>
          </motion.div>

          <Button
            onClick={onBack}
            className="w-full h-14 rounded-[24px] bg-gradient-to-r text-white shadow-cute-lg hover:shadow-cute-xl transition-all duration-300"
            style={{
              backgroundImage: 'linear-gradient(135deg, #FFD1E7 0%, #DFD3FF 50%, #A0CBFF 100%)',
            }}
          >
            {t.backToLogin}
          </Button>

          <button
            onClick={() => setIsSent(false)}
            className="mt-4 text-pink-500 hover:text-pink-600 hover:underline transition-colors"
          >
            {t.sendAgain}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50 to-blue-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cute floating decorations */}
      <motion.div
        className="absolute top-20 right-10 text-pink-300 opacity-40"
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
        className="absolute bottom-20 left-10 text-lavender-300 opacity-30"
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
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.back}</span>
        </motion.button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mb-4 flex items-center justify-center">
            <GlowbieBellLogo size={128} animated={true} />
          </div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-pink-500 via-lavender-500 to-blue-500 bg-clip-text text-transparent mb-3"
          >
            {t.forgotPasswordTitle} 🔐
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            {t.dontWorry}
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white/95 rounded-[32px] p-8 shadow-cute-xl border border-pink-100"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="reset-email" className="text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-400" />
                {t.emailUsedToRegister}
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`h-14 rounded-[24px] border-pink-200 bg-pink-50/50 focus:border-pink-400 focus:bg-white transition-all pl-5 shadow-cute-sm ${
                  error ? 'border-red-300 bg-red-50/30' : ''
                }`}
                disabled={isLoading}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <span>⚠️</span> {error}
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
                  {t.sending}
                </span>
              ) : (
                <>
                  <div 
                    className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 209, 231, 0.4) 0%, rgba(223, 211, 255, 0.3) 50%, rgba(160, 203, 255, 0.4) 100%)',
                    }}
                  />
                  <span className="relative z-10">{t.sendResetLink}</span>
                </>
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-gray-500 text-sm">
                {t.rememberedPassword}{' '}
                <button
                  type="button"
                  onClick={onBack}
                  className="text-pink-500 hover:text-pink-600 hover:underline transition-colors"
                >
                  {t.login}
                </button>
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
