import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useLanguage } from '../../contexts/LanguageContext';

interface ChangePasswordPageProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export function ChangePasswordPage({ onBack, onSuccess }: ChangePasswordPageProps) {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password: string): string[] => {
    const validationErrors: string[] = [];
    
    if (password.length < 8) {
      validationErrors.push(t.atLeast8Characters);
    }
    if (!/[A-Z]/.test(password)) {
      validationErrors.push(t.atLeastOneUppercase);
    }
    if (!/[a-z]/.test(password)) {
      validationErrors.push(t.atLeastOneLowercase);
    }
    if (!/[0-9]/.test(password)) {
      validationErrors.push(t.atLeastOneNumber);
    }
    
    return validationErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: string[] = [];

    // Validate current password
    if (!formData.currentPassword) {
      newErrors.push(t.pleaseEnterCurrentPassword);
    }

    // Validate new password
    if (!formData.newPassword) {
      newErrors.push(t.pleaseEnterNewPassword);
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      newErrors.push(...passwordErrors);
    }

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.push(t.passwordsDontMatch);
    }

    // Check if new password is different from current
    if (formData.currentPassword === formData.newPassword) {
      newErrors.push(t.passwordMustBeDifferent);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onBack();
        }
      }, 2000);
    }, 500);
  };

  const passwordStrength = (password: string) => {
    if (!password) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 1, text: t.weak, color: 'red' };
    if (strength <= 4) return { level: 2, text: t.medium, color: 'peach' };
    return { level: 3, text: t.strong, color: 'mint' };
  };

  const strength = passwordStrength(formData.newPassword);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/50 to-blue-50/30 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Card className="bg-white rounded-3xl p-8 shadow-cute-xl border border-mint-100 text-center max-w-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-mint-100 to-mint-200 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-10 h-10 text-mint-600" />
            </motion.div>
            <h3 className="text-gray-800 mb-2">{t.passwordChangedSuccess}</h3>
            <p className="text-gray-600 text-sm">
              {t.passwordChangedDescription}
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/50 to-blue-50/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-pink-100">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-pink-600" />
          </button>
          <div className="flex-1">
            <h3 className="text-gray-800">{t.changePassword}</h3>
            <p className="text-sm text-gray-500">{t.updateYourPassword}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 pb-24 space-y-6">
        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-lavender-50 rounded-3xl p-5 shadow-cute-md border-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-gray-800 mb-1 font-medium">{t.keepSafe}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t.strongPasswordHelpsProtect}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-red-50 border-red-200 rounded-3xl p-4 shadow-cute-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium mb-2">{t.pleaseFixErrors}</p>
                  <ul className="space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700">• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="bg-white rounded-3xl p-6 shadow-cute-lg border-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <Label htmlFor="currentPassword" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-pink-600" />
                  {t.currentPassword}
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => handleChange('currentPassword', e.target.value)}
                    className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300 pr-12"
                    placeholder={t.enterCurrentPassword}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="newPassword" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-pink-600" />
                  {t.newPassword}
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleChange('newPassword', e.target.value)}
                    className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300 pr-12"
                    placeholder={t.enterNewPassword}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{t.passwordStrength}</span>
                      <span className={`text-xs font-medium text-${strength.color}-600`}>
                        {strength.text}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            level <= strength.level
                              ? `bg-${strength.color}-400`
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-pink-600" />
                  {t.confirmNewPassword}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-300 pr-12"
                    placeholder={t.enterNewPasswordAgain}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-lavender-50 rounded-2xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">{t.passwordMustInclude}</p>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.length >= 8 ? 'bg-mint-500' : 'bg-gray-300'}`} />
                    {t.atLeast8Characters}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-mint-500' : 'bg-gray-300'}`} />
                    {t.atLeastOneUppercase}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.newPassword) ? 'bg-mint-500' : 'bg-gray-300'}`} />
                    {t.atLeastOneLowercase}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-mint-500' : 'bg-gray-300'}`} />
                    {t.atLeastOneNumber}
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-2xl py-6 shadow-cute-lg"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {t.saveNewPassword}
                </Button>
                
                <Button
                  type="button"
                  onClick={onBack}
                  variant="outline"
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl py-6"
                >
                  {t.cancel}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
