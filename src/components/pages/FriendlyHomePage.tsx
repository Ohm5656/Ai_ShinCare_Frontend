import { MessageCircle, Sparkles, Image, Zap } from "lucide-react";

export function FriendlyHomePage() {
  const cards = [
    {
      id: 1,
      icon: MessageCircle,
      title: "สนทนา",
      subtitle: "คุยกับ AI ฉลาด",
      bgColor: "bg-[#FFE5E5]",
      iconColor: "text-[#ff6b6b]",
    },
    {
      id: 2,
      icon: Sparkles,
      title: "สร้างสรรค์",
      subtitle: "ออกแบบและสร้างไอเดีย",
      bgColor: "bg-[#FFF8E1]",
      iconColor: "text-[#ffd93d]",
    },
    {
      id: 3,
      icon: Image,
      title: "รูปภาพ",
      subtitle: "วิเคราะห์และแก้ไขภาพ",
      bgColor: "bg-[#E1F5F0]",
      iconColor: "text-[#4ecdc4]",
    },
    {
      id: 4,
      icon: Zap,
      title: "เครื่องมือ",
      subtitle: "ฟังก์ชันอัจฉริยะ",
      bgColor: "bg-[#F3E5F5]",
      iconColor: "text-[#c7b8ea]",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 pt-8 px-6">
      {/* Header */}
      <div className="max-w-lg mx-auto mb-12 text-center">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#ffd93d] flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="mb-2">สวัสดี! 👋</h1>
        <p className="text-muted-foreground">ฉันจะช่วยอะไรคุณได้บ้าง?</p>
      </div>

      {/* Blob Cards Grid */}
      <div className="max-w-lg mx-auto grid grid-cols-2 gap-4 px-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              className={`${card.bgColor} p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[180px] flex flex-col items-center justify-center gap-3 border-0`}
              style={{
                borderRadius: `${Math.random() * 10 + 35}% ${Math.random() * 10 + 55}% ${Math.random() * 10 + 45}% ${Math.random() * 10 + 60}% / ${Math.random() * 10 + 50}% ${Math.random() * 10 + 45}% ${Math.random() * 10 + 55}% ${Math.random() * 10 + 50}%`,
              }}
            >
              <div className={`${card.iconColor}`}>
                <Icon size={40} strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <h3 className="mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="max-w-lg mx-auto mt-8 px-2">
        <div className="bg-gradient-to-r from-[#a8e6cf] to-[#4ecdc4] rounded-[2rem] p-6 text-center shadow-sm">
          <p className="text-lg mb-2">💡 คำแนะนำวันนี้</p>
          <p className="text-sm opacity-90">
            ลองถามฉันเกี่ยวกับอะไรก็ได้ที่คุณสงสัย!
          </p>
        </div>
      </div>
    </div>
  );
}
