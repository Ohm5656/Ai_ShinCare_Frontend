import { Home, MessageCircle, Sparkles, User, Settings } from "lucide-react";

interface BottomNavAIProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavAI({ activeTab, onTabChange }: BottomNavAIProps) {
  const tabs = [
    { id: "home", icon: Home, label: "หน้าแรก" },
    { id: "chat", icon: MessageCircle, label: "แชท" },
    { id: "assistant", icon: Sparkles, label: "ผู้ช่วย" },
    { id: "history", icon: User, label: "โปรไฟล์" },
    { id: "settings", icon: Settings, label: "ตั้งค่า" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50">
      <div className="mx-auto max-w-lg">
        <div className="flex justify-around items-center h-20 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1.5 px-2 py-2 rounded-2xl transition-all min-w-[64px] ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className={`p-2 rounded-full transition-all ${
                  isActive ? "bg-primary/10" : ""
                }`}>
                  <Icon 
                    className="w-6 h-6" 
                    strokeWidth={isActive ? 3 : 2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </div>
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
