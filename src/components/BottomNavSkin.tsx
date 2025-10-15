import { motion } from 'motion/react';
import { Home, Camera, BarChart3, MessageCircle, User } from 'lucide-react';

interface BottomNavSkinProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavSkin({ activeTab, onTabChange }: BottomNavSkinProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'หน้าหลัก' },
    { id: 'scan', icon: Camera, label: 'สแกน' },
    { id: 'history', icon: BarChart3, label: 'ประวัติ' },
    { id: 'chat', icon: MessageCircle, label: 'แชท' },
    { id: 'profile', icon: User, label: 'โปรไฟล์' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around px-4 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center gap-1 flex-1 py-1"
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-br from-pink-100 to-blue-100 rounded-full -m-2"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-6 h-6 relative z-10 ${
                      isActive ? 'text-pink-600' : 'text-gray-400'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs ${
                    isActive ? 'text-pink-600' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
