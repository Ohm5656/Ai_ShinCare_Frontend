import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Keyboard, Sparkles, Zap, Languages, Smile } from "lucide-react";
import { useState } from "react";

export function KeyboardPage() {
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoCorrect, setAutoCorrect] = useState(true);
  const [emojiPrediction, setEmojiPrediction] = useState(false);

  const shortcuts = [
    { key: "/sum", description: "สรุปข้อความ", icon: Zap },
    { key: "/trans", description: "แปลภาษา", icon: Languages },
    { key: "/emoji", description: "เพิ่มอิโมจิ", icon: Smile },
    { key: "/fix", description: "แก้ไขไวยากรณ์", icon: Sparkles },
  ];

  return (
    <div className="pb-20 px-4 pt-4 space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Keyboard className="w-6 h-6 text-primary" />
          <h1>คีย์บอร์ด AI</h1>
        </div>
        <p className="text-muted-foreground">ปรับแต่งคีย์บอร์ดอัจฉริยะของคุณ</p>
      </div>

      {/* Keyboard Preview */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-muted/50 rounded-lg p-4 min-h-[120px] flex items-center justify-center">
            <div className="text-center space-y-2">
              <Keyboard className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                พรีวิวคีย์บอร์ด AI
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>การตั้งค่า</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>คำแนะนำจาก AI</p>
              <p className="text-sm text-muted-foreground">
                แนะนำคำและประโยคระหว่างพิมพ์
              </p>
            </div>
            <Switch checked={aiSuggestions} onCheckedChange={setAiSuggestions} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p>แก้ไขอัตโนมัติ</p>
              <p className="text-sm text-muted-foreground">
                แก้ไขคำผิดอัตโนมัติ
              </p>
            </div>
            <Switch checked={autoCorrect} onCheckedChange={setAutoCorrect} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p>ทำนายอิโมจิ</p>
              <p className="text-sm text-muted-foreground">
                แนะนำอิโมจิที่เหมาะสม
              </p>
            </div>
            <Switch checked={emojiPrediction} onCheckedChange={setEmojiPrediction} />
          </div>
        </CardContent>
      </Card>

      {/* Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle>ทางลัด (Shortcuts)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {shortcuts.map((shortcut, index) => {
            const Icon = shortcut.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <Icon className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p>{shortcut.description}</p>
                  <p className="text-sm text-muted-foreground">
                    พิมพ์ <code className="px-1.5 py-0.5 rounded bg-muted">{shortcut.key}</code>
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Install Button */}
      <Button className="w-full" size="lg">
        <Keyboard className="w-4 h-4 mr-2" />
        ติดตั้งคีย์บอร์ด AI
      </Button>
    </div>
  );
}
