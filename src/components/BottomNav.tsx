import { Home, BarChart3, ScanLine, User, Settings } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "stats", icon: BarChart3, label: "Stats" },
    { id: "scan", icon: ScanLine, label: "Scan" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="mx-auto max-w-lg">
        <div className="flex justify-around items-center h-16 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
