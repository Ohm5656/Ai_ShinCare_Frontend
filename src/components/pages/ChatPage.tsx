import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { 
  Wand2, 
  Image as ImageIcon, 
  Globe, 
  Youtube, 
  FileText, 
  ScanText,
  Plus,
  Mic,
  User
} from "lucide-react";

export function ChatPage() {
  const popularQuestions = [
    { emoji: "💬", text: "แนะนำวิธีการเขียนอีเมลให้น่าสนใจ" },
    { emoji: "💰", text: "วิธีการออม เงินอย่างมีประสิทธิภาพ" },
    { emoji: "🐱", text: "วิธีดูแลแมวให้สุขภาพดี" },
    { emoji: "👫", text: "ไอเดียนัดเดทสุดโรแมนติก" },
  ];

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1>แชท</h1>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1.5">
            Pro
          </Badge>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#ff6b6b] to-[#ff8787] p-6 h-32 cursor-pointer hover:scale-[1.02] transition-transform rounded-[2rem] shadow-sm">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <Wand2 className="w-8 h-8 text-white" strokeWidth={2.5} />
            <p className="text-white">AI Art</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#4ecdc4] to-[#a8e6cf] p-6 h-32 cursor-pointer hover:scale-[1.02] transition-transform rounded-[2rem] shadow-sm">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/90 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-white/70 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-white/50 border-2 border-white"></div>
            </div>
            <p className="text-white">สรุปภาพ</p>
          </div>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-auto py-4 px-4 flex flex-col items-start gap-2 bg-[#E8F4FD] hover:bg-[#D8EBFC] border-0 shadow-sm rounded-[1.5rem]"
        >
          <Globe className="w-5 h-5 text-[#4A90E2]" strokeWidth={2.5} />
          <span className="text-sm">สรุปหน้าเว็บ</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-4 px-4 flex flex-col items-start gap-2 bg-[#FFE5E5] hover:bg-[#FFD6D6] border-0 shadow-sm rounded-[1.5rem]"
        >
          <Youtube className="w-5 h-5 text-[#ff6b6b]" strokeWidth={2.5} />
          <span className="text-sm">สรุป YouTube</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-4 px-4 flex flex-col items-start gap-2 bg-[#E1F5F0] hover:bg-[#D1EDE6] border-0 shadow-sm rounded-[1.5rem]"
        >
          <FileText className="w-5 h-5 text-[#4ecdc4]" strokeWidth={2.5} />
          <span className="text-sm">สรุปเอกสาร</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-4 px-4 flex flex-col items-start gap-2 bg-[#F3E5F5] hover:bg-[#E8D5EB] border-0 shadow-sm rounded-[1.5rem]"
        >
          <ScanText className="w-5 h-5 text-[#c7b8ea]" strokeWidth={2.5} />
          <span className="text-sm">การแยกข้อความรูปภาพ</span>
        </Button>
      </div>

      {/* Popular Questions */}
      <div className="space-y-3">
        <h3>คำถามยอดนิยม</h3>
        <div className="space-y-2">
          {popularQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4 bg-card hover:bg-accent/50 border shadow-sm"
            >
              <span className="mr-3 text-lg">{question.emoji}</span>
              <span className="text-sm text-left">{question.text}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Floating Chat Input */}
      <div className="fixed bottom-24 left-0 right-0 px-4 z-30">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-full shadow-lg border-2 border-border px-4 py-3 flex items-center gap-3">
            <Button size="icon" variant="ghost" className="rounded-full shrink-0 hover:bg-[#FFE5E5]">
              <Plus className="w-5 h-5 text-[#ff6b6b]" strokeWidth={2.5} />
            </Button>
            <input
              type="text"
              placeholder="ถาม พิมพ์ AI อะไรก็ได้"
              className="flex-1 bg-transparent border-0 outline-none text-sm"
            />
            <Button size="icon" variant="ghost" className="rounded-full shrink-0 hover:bg-[#FFE5E5]">
              <Mic className="w-5 h-5 text-[#ff6b6b]" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
