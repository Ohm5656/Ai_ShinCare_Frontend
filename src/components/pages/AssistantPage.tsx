import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Sparkles, Zap, Brain, Lightbulb, MessageCircle, Code } from "lucide-react";

export function AssistantPage() {
  const assistants = [
    {
      icon: Brain,
      title: "AI ผู้เชี่ยวชาญ",
      description: "ช่วยวิเคราะห์และให้คำแนะนำ",
      color: "text-[#c7b8ea]",
      bgColor: "bg-[#F3E5F5]",
      badge: "Pro",
    },
    {
      icon: Lightbulb,
      title: "ผู้ช่วยสร้างสรรค์",
      description: "สร้างไอเดียและเนื้อหา",
      color: "text-[#ffd93d]",
      bgColor: "bg-[#FFF8E1]",
      badge: "Popular",
    },
    {
      icon: Code,
      title: "ผู้ช่วยโปรแกรมเมอร์",
      description: "ช่วยเขียนและแก้ไขโค้ด",
      color: "text-[#4A90E2]",
      bgColor: "bg-[#E8F4FD]",
    },
    {
      icon: MessageCircle,
      title: "ผู้ช่วยแปลภาษา",
      description: "แปลและอธิบายภาษา",
      color: "text-[#4ecdc4]",
      bgColor: "bg-[#E1F5F0]",
    },
    {
      icon: Zap,
      title: "ผู้ช่วยผลิตภาพ",
      description: "เพิ่มประสิทธิภาพการทำงาน",
      color: "text-[#ff6b6b]",
      bgColor: "bg-[#FFE5E5]",
    },
  ];

  return (
    <div className="pb-20 px-4 pt-4 space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1>ผู้ช่วย AI</h1>
        </div>
        <p className="text-muted-foreground">เลือกผู้ช่วยที่เหมาะกับงานของคุณ</p>
      </div>

      {/* Assistants Grid */}
      <div className="space-y-3">
        {assistants.map((assistant, index) => {
          const Icon = assistant.icon;
          return (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm rounded-[1.5rem]"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${assistant.bgColor} ${assistant.color}`}>
                      <Icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{assistant.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {assistant.description}
                      </p>
                    </div>
                  </div>
                  {assistant.badge && (
                    <Badge variant="secondary" className="ml-2 rounded-full">
                      {assistant.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Create Custom Assistant */}
      <Card className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Sparkles className="w-5 h-5" />
            <span>สร้างผู้ช่วยของคุณเอง</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
