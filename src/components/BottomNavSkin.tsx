import { motion } from 'motion/react';
import { Home, Camera, BarChart3, MessageCircle, User, Sparkles } from 'lucide-react';

interface BottomNavSkinProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Cute Bottom Navigation Bar Component 🎀
 * Displays 5 navigation tabs with playful animations
 */
export function BottomNavSkin({ activeTab, onTabChange }: BottomNavSkinProps) {
  // Navigation tab configuration
  const navigationTabs = [
    { 
      id: 'home', 
      icon: Home, 
      label: 'Home',
      emoji: '🏠',
      color: 'from-pink-400 to-pink-500',
      ariaLabel: 'Navigate to home dashboard'
    },
    { 
      id: 'scan', 
      icon: Camera, 
      label: 'Scan',
      emoji: '📸',
      color: 'from-lavender-400 to-lavender-500',
      ariaLabel: 'Navigate to face scan'
    },
    { 
      id: 'history', 
      icon: BarChart3, 
      label: 'History',
      emoji: '📊',
      color: 'from-blue-400 to-blue-500',
      ariaLabel: 'Navigate to progress history'
    },
    { 
      id: 'chat', 
      icon: MessageCircle, 
      label: 'Chat',
      emoji: '💬',
      color: 'from-peach-400 to-peach-500',
      ariaLabel: 'Navigate to AI chat assistant'
    },
    { 
      id: 'profile', 
      icon: User, 
      label: 'Profile',
      emoji: '👤',
      color: 'from-mint-400 to-mint-500',
      ariaLabel: 'Navigate to user profile'
    },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-pink-100 shadow-cute-xl z-50"
      role="navigation"
      aria-label="Bottom navigation"
    >
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-400 via-lavender-400 to-blue-400"></div>
      
      {/* Container with max width for mobile devices */}
      <div className="max-w-lg mx-auto">
        {/* Navigation items container */}
        <ul className="flex items-center justify-around px-3 py-2 pb-safe">
          {navigationTabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <li key={tab.id} className="flex-1">
                <motion.button
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-col items-center gap-1 w-full py-2 px-1"
                  aria-label={tab.ariaLabel}
                  aria-current={isActive ? 'page' : undefined}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Active indicator background with cute shape */}
                  <div className="relative">
                    {isActive && (
                      <>
                        {/* Glow effect */}
                        <motion.div
                          layoutId="navGlow"
                          className={`absolute inset-0 bg-gradient-to-br ${tab.color} rounded-full blur-lg opacity-30 scale-150`}
                          transition={{ 
                            type: 'spring', 
                            stiffness: 300, 
                            damping: 30 
                          }}
                        />
                        
                        {/* Main background */}
                        <motion.div
                          layoutId="activeTabIndicator"
                          className={`absolute inset-0 bg-gradient-to-br ${tab.color} rounded-[20px] -m-2.5 shadow-cute-md`}
                          transition={{ 
                            type: 'spring', 
                            stiffness: 300, 
                            damping: 30 
                          }}
                        />
                        
                        {/* Sparkle decoration */}
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            type: 'spring',
                            stiffness: 300,
                            damping: 15
                          }}
                          className="absolute -top-1 -right-1 z-20"
                        >
                          <Sparkles className="w-3 h-3 text-white" fill="white" />
                        </motion.div>
                      </>
                    )}
                    
                    {/* Icon Container */}
                    <div className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-[18px] transition-all duration-300 ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}>
                      <Icon
                        className={`w-6 h-6 transition-all duration-300 ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  
                  {/* Label with emoji */}
                  <motion.span
                    className={`text-[11px] transition-all duration-300 flex items-center gap-0.5 ${
                      isActive ? 'font-semibold' : 'font-normal'
                    }`}
                    animate={{
                      color: isActive ? '#FF6B8F' : '#9CA3AF',
                      y: isActive ? -2 : 0
                    }}
                  >
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xs"
                      >
                        {tab.emoji}
                      </motion.span>
                    )}
                    {tab.label}
                  </motion.span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Safe area padding for iOS devices */}
      <div className="h-safe"></div>
    </nav>
  );
}
