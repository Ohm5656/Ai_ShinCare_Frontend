import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useLanguage } from '../../contexts/LanguageContext';
import { AIResponseEngine } from '../../utils/aiResponseEngine';
import axios from 'axios';
import drAILogo from 'figma:asset/9e2bc221ce12a816af58bdf5aac2d784fd135893.png';

const API_URL = 'https://aishincarebackend-production.up.railway.app'; 
// ⭐ URL backend จริง (ไม่ใส่ /ask-ai ตรงนี้)

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
}

interface DrSkinAIChatScreenProps {
  onBack: () => void;
}

export function DrSkinAIChatScreen({ onBack }: DrSkinAIChatScreenProps) {
  const { t } = useLanguage();
  
  // Initialize AI Engine
  const aiEngineRef = useRef(new AIResponseEngine(t.language as 'th' | 'en' | 'zh'));
  
  // Update AI engine language when language changes
  useEffect(() => {
    aiEngineRef.current.setLanguage(t.language as 'th' | 'en' | 'zh');
  }, [t.language]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: aiEngineRef.current.getGreeting(),
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSendEffect, setShowSendEffect] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get quick replies from AI engine
  const quickReplies = aiEngineRef.current.getSuggestedQuestions();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ===============================
  // 📸 Upload Image
  // ===============================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    const userText =
      inputMessage ||
      (selectedImage
        ? t.language === 'th'
          ? 'ส่งรูปภาพ'
          : t.language === 'en'
          ? 'Sent an image'
          : '发送了图片'
        : '');

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: userText,
      sender: 'user',
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    // 🟦 Add user message
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    setSelectedImage(null);
    setIsTyping(true);

    // 🎇 Send button effect
    setShowSendEffect(true);
    setTimeout(() => setShowSendEffect(false), 1000);

    try {
      // ดึงผลสแกนล่าสุดจาก localStorage
      const lastScan = JSON.parse(localStorage.getItem("lastSkinScan") || "{}");

      console.log("LAST SKIN SCAN SENT TO AI:", lastScan);

      const res = await axios.post(`${API_URL}/ask-ai`, {
        prompt: newUserMessage.text,
        profile: lastScan?.profile ?? null,
        scores: lastScan?.dimension_scores ?? null
      });

      console.log("BACKEND RESPONSE:", res.data);

      const aiResponse: Message = {
        id: newUserMessage.id + 1,
        text: res.data.answer ?? "[Error: no answer]",
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);

    } catch (error) {
      console.error("Chat API error:", error);

      const fallback: Message = {
        id: newUserMessage.id + 1,
        text: aiEngineRef.current.generateResponse(newUserMessage.text),
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallback]);
    }

    setIsTyping(false);
  };


  // ===============================
  // ⚡ Quick Replies
  // ===============================
  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    setTimeout(() => {
      handleSendMessage();
    }, 120);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Medical AI Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E3F2FF] via-[#FFF0F7] via-[#F5F0FF] to-[#E8F4FF] -z-10" />
      
      {/* Animated background orbs - Simplified for performance */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#7DB8FF]/20 to-transparent rounded-full blur-3xl"
      />
      <div
        className="absolute top-1/3 left-0 w-80 h-80 bg-gradient-to-tr from-[#CBB8FF]/15 to-transparent rounded-full blur-3xl"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#FFB5D9]/20 to-transparent rounded-full blur-3xl"
      />
      
      {/* Dr. A.I. Logo - Central Watermark */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.img
          src={drAILogo}
          alt="Dr. A.I."
          className="w-80 h-80 object-contain"
          style={{
            opacity: 0.52,
            filter: 'saturate(1) brightness(1.1)',
          }}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Floating Medical/AI Particles - Simplified */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 3 === 0 ? '#7DB8FF' : i % 3 === 1 ? '#FFB5D9' : '#CBB8FF',
            opacity: 0.15,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      {/* Subtle hexagon medical pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%237DB8FF' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* DNA helix inspired lines - Very subtle */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-32 opacity-[0.04]"
        animate={{
          y: [0, 100, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 800" preserveAspectRatio="none">
          <path
            d="M 20 0 Q 50 100 20 200 T 20 400 T 20 600 T 20 800"
            stroke="#7DB8FF"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 80 0 Q 50 100 80 200 T 80 400 T 80 600 T 80 800"
            stroke="#FFB5D9"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </motion.div>
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top App Bar */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-pink-100/50 px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 bg-gradient-to-br from-pink-200 to-lavender-200 border-2 border-white shadow-md">
              <AvatarFallback className="text-2xl bg-transparent">👨🏻‍⚕️</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-gray-800">{t.drSkinAI}</h3>
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <p className="text-xs text-gray-500">{t.personalSkincareExpert}</p>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 pb-56">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  delay: index * 0.05, 
                  type: 'spring', 
                  stiffness: 300,
                  damping: 25
                }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.sender === 'ai' && (
                    <Avatar className="w-7 h-7 bg-gradient-to-br from-pink-100 to-lavender-100 flex-shrink-0 shadow-sm">
                      <AvatarFallback className="text-base bg-transparent">👨🏻‍⚕️</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`px-4 py-3 rounded-[20px] shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-br-md border border-pink-100/50'
                        : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-bl-md border border-lavender-100/50'
                    }`}
                  >
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="Uploaded" 
                        className="rounded-2xl mb-2 max-w-full h-auto max-h-60 object-cover"
                      />
                    )}
                    {message.text && (
                      <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.text}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-end gap-2"
            >
              <Avatar className="w-7 h-7 bg-gradient-to-br from-pink-100 to-lavender-100 shadow-sm">
                <AvatarFallback className="text-base bg-transparent">👨🏻‍⚕️</AvatarFallback>
              </Avatar>
              <div className="bg-white/80 backdrop-blur-sm px-5 py-3 rounded-[20px] rounded-bl-md shadow-sm border border-lavender-100/50">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-lavender-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Buttons - Above Input Bar */}
        <AnimatePresence>
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-44 left-0 right-0 px-5 pb-3 z-30"
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-pink-100/50">
                <p className="text-xs text-gray-400 mb-3 px-1">{t.suggestedQuestions}</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <motion.button
                      key={reply}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      onClick={() => handleQuickReply(reply)}
                      className="bg-gradient-to-r from-pink-50 to-lavender-50 border border-pink-200 text-pink-600 px-4 py-2 rounded-full hover:shadow-md hover:scale-105 transition-all duration-200 text-sm"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Message Input Bar - Modern & Minimal Design */}
        <div className="fixed bottom-20 left-0 right-0 bg-white/80 backdrop-blur-xl px-5 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] border-t border-pink-100/30 z-40">
          {/* Image Preview */}
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 relative inline-block"
            >
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="rounded-2xl max-h-32 object-cover shadow-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors shadow-md"
              >
                ✕
              </button>
            </motion.div>
          )}

          <div 
            className="flex items-center gap-3 bg-white rounded-[24px] px-4 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-pink-100/30"
            style={{
              boxShadow: '0 2px 16px rgba(255, 79, 163, 0.1)'
            }}
          >
          {/* Add Photo/Attachment Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 rounded-full border-2 border-pink-200 flex items-center justify-center hover:bg-pink-50 transition-colors flex-shrink-0"
          >
            <ImageIcon className="w-5 h-5 text-pink-400" strokeWidth={2.5} />
          </button>

          {/* Text Input Field */}
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={t.typeYourMessage}
              className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-[#B0B0B0] text-[15px]"
              style={{ fontFamily: "'Prompt', 'Inter', sans-serif" }}
            />
          </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() && !selectedImage}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              style={{
                background: (inputMessage.trim() || selectedImage) ? '#FF4FA3' : '#FFB3D9',
                boxShadow: (inputMessage.trim() || selectedImage) ? '0 4px 12px rgba(255, 79, 163, 0.3)' : 'none'
              }}
            >
              <Send className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}