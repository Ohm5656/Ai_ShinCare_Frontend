import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Plus, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useLanguage } from '../../contexts/LanguageContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface DrSkinAIChatScreenProps {
  onBack: () => void;
}

export function DrSkinAIChatScreen({ onBack }: DrSkinAIChatScreenProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t.aiGreeting,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    t.recommendProducts,
    t.causeOfRedness,
    t.howToReduceAcne,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('ผลิตภัณฑ์') || lowerMessage.includes('แนะนำ') || lowerMessage.includes('skincare') || lowerMessage.includes('recommend') || lowerMessage.includes('产品') || lowerMessage.includes('推荐')) {
      return t.aiProductRecommendation;
    } else if (lowerMessage.includes('ผิวแดง') || lowerMessage.includes('แดง') || lowerMessage.includes('redness') || lowerMessage.includes('red') || lowerMessage.includes('红肿') || lowerMessage.includes('发红')) {
      return t.aiRednessExplanation;
    } else if (lowerMessage.includes('สิว') || lowerMessage.includes('acne') || lowerMessage.includes('痘痘')) {
      return t.aiAcneAdvice;
    } else {
      return t.aiGeneralResponse;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top App Bar */}
      <div className="bg-white border-b border-pink-100 px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 bg-gradient-to-br from-pink-200 to-lavender-200 border-2 border-white shadow-md">
            <AvatarFallback className="text-2xl bg-transparent">👩🏻‍⚕️</AvatarFallback>
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
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 pb-52">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.sender === 'ai' && (
                  <Avatar className="w-7 h-7 bg-gradient-to-br from-pink-100 to-lavender-100 flex-shrink-0 shadow-sm">
                    <AvatarFallback className="text-base bg-transparent">👩🏻‍⚕️</AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`px-4 py-3 rounded-[20px] shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-pink-100 to-lavender-50 text-gray-800 rounded-br-md'
                      : 'bg-gradient-to-br from-lavender-50 to-pink-50/50 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.text}</p>
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
              <AvatarFallback className="text-base bg-transparent">👩🏻‍⚕️</AvatarFallback>
            </Avatar>
            <div className="bg-gradient-to-br from-lavender-50 to-pink-50/50 px-5 py-3 rounded-[20px] rounded-bl-md shadow-sm">
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
            <div className="bg-white/98 rounded-3xl p-4 shadow-lg border border-pink-100">
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
      <div className="fixed bottom-20 left-0 right-0 bg-gradient-to-b from-[#FFF5FA] to-[#FFEAF3] px-5 py-5 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-40">
        <div 
          className="flex items-center gap-3 bg-white rounded-[24px] px-4 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
          style={{
            boxShadow: '0 2px 16px rgba(255, 79, 163, 0.1)'
          }}
        >
          {/* Add Photo/Attachment Button */}
          <button className="w-9 h-9 rounded-full border-2 border-pink-200 flex items-center justify-center hover:bg-pink-50 transition-colors flex-shrink-0">
            <Plus className="w-5 h-5 text-pink-400" strokeWidth={2.5} />
          </button>

          {/* Text Input Field */}
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.typeYourMessage}
              className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-[#B0B0B0] text-[15px]"
              style={{ fontFamily: "'Prompt', 'Inter', sans-serif" }}
            />
          </div>

          {/* Right Icons: Microphone & Send */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Microphone Button */}
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors">
              <Mic className="w-5 h-5 text-gray-400" strokeWidth={2} />
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: inputMessage.trim() ? '#FF4FA3' : '#FFB3D9',
                boxShadow: inputMessage.trim() ? '0 4px 12px rgba(255, 79, 163, 0.3)' : 'none'
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
