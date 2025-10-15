import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  HelpCircle, 
  Info,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface SettingsPageProps {
  onLogout: () => void;
}

export function SettingsPage({ onLogout }: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: "การแจ้งเตือน",
      items: [
        {
          icon: Bell,
          label: "เปิดการแจ้งเตือน",
          type: "toggle",
          value: notifications,
          onChange: setNotifications,
        },
      ],
    },
    {
      title: "การแสดงผล",
      items: [
        {
          icon: Moon,
          label: "โหมดมืด",
          type: "toggle",
          value: darkMode,
          onChange: setDarkMode,
        },
      ],
    },
    {
      title: "ทั่วไป",
      items: [
        { icon: Globe, label: "ภาษา", type: "link", value: "ไทย" },
        { icon: Lock, label: "ความเป็นส่วนตัว", type: "link" },
        { icon: HelpCircle, label: "ช่วยเหลือ", type: "link" },
        { icon: Info, label: "เกี่ยวกับ", type: "link" },
      ],
    },
  ];

  return (
    <div className="pb-20 px-4 pt-4 space-y-6">
      <div className="space-y-2">
        <h1>ตั้งค่า</h1>
        <p className="text-muted-foreground">จัดการการตั้งค่าแอพพลิเคชัน</p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span>{item.label}</span>
                    </div>
                    
                    {item.type === "toggle" && (
                      <Switch
                        checked={item.value as boolean}
                        onCheckedChange={item.onChange as (checked: boolean) => void}
                      />
                    )}
                    
                    {item.type === "link" && (
                      <div className="flex items-center gap-2">
                        {item.value && (
                          <span className="text-sm text-muted-foreground">
                            {item.value}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="pt-6">
            <Button
              variant="destructive"
              className="w-full"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              ออกจากระบบ
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground py-4">
          <p>AI Chat Assistant</p>
          <p>เวอร์ชัน 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
