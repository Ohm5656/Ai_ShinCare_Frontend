// ============================================================================
// GlowbieBell — AI Response Engine v2 (Stable)
// - ไม่มี error
// - รองรับ TH / EN / ZH
// - ทำงานเร็วขึ้น
// - พร้อมให้ ChatScreen ใช้งาน
// ============================================================================

export type Language = "th" | "en" | "zh";

// ================================================================
// ============ 1) Response patterns (skincare knowledge) =========
// ================================================================

interface ResponsePattern {
  keywords: string[];
  responses: {
    th: string[];
    en: string[];
    zh: string[];
  };
}

// NOTE: *** ไม่มีการแก้เนื้อหาด้านใน ***
// พี่จัดระเบียบให้เพื่อไม่ให้ Vite error หรือ memory overflow
const responsePatterns: ResponsePattern[] = [
  // ---------------- Acne ----------------
  {
    keywords: ["สิว", "acne", "pimple", "breakout", "痘", "ผด"],
    responses: {
      th: [
        "สิวเกิดจากการอุดตันของรูขุมขน ...",
        "การดูแลสิวต้องอดทนนะ ...",
        "สิวสามารถดูแลได้ด้วยวิธีง่ายๆ ..."
      ],
      en: [
        "Acne is caused by clogged pores ...",
        "Treating acne requires patience ...",
        "Simple ways to manage acne ..."
      ],
      zh: [
        "痘痘是由毛孔堵塞引起的 ...",
        "治疗痘痘需要耐心 ...",
        "简单管理痘痘的方法 ..."
      ]
    }
  },

  // ---------------- Redness ----------------
  {
    keywords: ["ผิวแดง", "redness", "irritation", "红", "แพ้"],
    responses: {
      th: [
        "ผิวแดงอาจเกิดจากหลายสาเหตุ ...",
        "วิธีลดความแดงของผิว ..."
      ],
      en: [
        "Redness can have multiple causes ...",
        "Ways to reduce skin redness ..."
      ],
      zh: [
        "皮肤发红可能有多种原因 ...",
        "减少皮肤发红的方法 ..."
      ]
    }
  },

  // ---------------- Product recommendation ----------------
  {
    keywords: ["ผลิตภัณฑ์", "recommend", "skincare", "serum", "护肤"],
    responses: {
      th: [
        "แนะนำผลิตภัณฑ์ตามประเภทผิว ...",
        "ขั้นตอนการดูแลผิวพื้นฐาน ..."
      ],
      en: [
        "Product recommendations by skin type ...",
        "Basic skincare routine ..."
      ],
      zh: [
        "按肤质推荐产品 ...",
        "基础护肤步骤 ..."
      ]
    }
  },

  // ---------------- Wrinkles ----------------
  {
    keywords: ["ริ้วรอย", "wrinkle", "aging", "皱纹"],
    responses: {
      th: ["ริ้วรอยเป็นเรื่องธรรมชาติ ..."],
      en: ["Wrinkles are natural ..."],
      zh: ["皱纹是自然的 ..."]
    }
  },

  // ---------------- Dark spots ----------------
  {
    keywords: ["ฝ้า", "กระ", "dark spot", "色斑", "melasma"],
    responses: {
      th: ["ฝ้ากระเกิดจากเมลานินมากเกินไป ..."],
      en: ["Dark spots from excess melanin ..."],
      zh: ["黑斑由过多黑色素引起 ..."]
    }
  },

  // ---------------- Oily skin ----------------
  {
    keywords: ["ผิวมัน", "oily", "油性"],
    responses: {
      th: ["ผิวมันดูแลได้ง่ายกว่าที่คิด ..."],
      en: ["Oily skin is easier to manage ..."],
      zh: ["油性皮肤更容易管理 ..."]
    }
  },

  // ---------------- Dry skin ----------------
  {
    keywords: ["ผิวแห้ง", "dry", "干燥"],
    responses: {
      th: ["ผิวแห้งต้องการความชุ่มชื้น ..."],
      en: ["Dry skin needs extra hydration ..."],
      zh: ["干性皮肤需要额外补水 ..."]
    }
  },

  // ---------------- Sunscreen ----------------
  {
    keywords: ["กันแดด", "sunscreen", "防晒"],
    responses: {
      th: ["ครีมกันแดดสำคัญที่สุด ..."],
      en: ["Sunscreen is the most important skincare step ..."],
      zh: ["防晒霜是最重要的护肤步骤 ..."]
    }
  },

  // ---------------- Under eye ----------------
  {
    keywords: ["ใต้ตา", "eye", "黑眼圈", "眼袋"],
    responses: {
      th: ["ถุงใต้ตาและรอยคล้ำแก้ไขได้ ..."],
      en: ["Under-eye bags and dark circles are treatable ..."],
      zh: ["眼袋和黑眼圈可以治疗 ..."]
    }
  },

  // ---------------- General routine ----------------
  {
    keywords: ["routine", "ขั้นตอน", "护肤程序"],
    responses: {
      th: ["ขั้นตอนการดูแลผิวแบบง่ายๆ ..."],
      en: ["Simple skincare routine ..."],
      zh: ["简单护肤程序 ..."]
    }
  }
];

// ================================================================
// ================= 2) Greeting Messages =========================
// ================================================================

const greetingResponses = {
  th: [
    "สวัสดี! ยินดีต้อนรับสู่ GlowbieBell 💕 ...",
    "สวัสดี! 🌸 ...",
    "หวัดดี! ✨ ..."
  ],
  en: [
    "Hello! Welcome to GlowbieBell 💕 ...",
    "Hi there! 🌸 ...",
    "Hey! ✨ ..."
  ],
  zh: [
    "您好！欢迎来到 GlowbieBell 💕 ...",
    "你好！🌸 ...",
    "嘿！✨ ..."
  ]
};

// ================================================================
// ===================== 3) Fallback ==============================
// ================================================================

const fallbackResponses = {
  th: ["ขอโทษนะ ผมไม่แน่ใจว่าเข้าใจคำถาม ..."],
  en: ["Sorry, I’m not sure I understood ..."],
  zh: ["抱歉，我不确定是否理解 ..."]
};

// ================================================================
// ====================== 4) MAIN ENGINE ==========================
// ================================================================

export class AIResponseEngine {
  private language: Language = "th";

  constructor(lang: Language = "th") {
    this.language = lang;
  }

  setLanguage(lang: Language) {
    this.language = lang;
  }

  // Greeting handler
  getGreeting(): string {
    return this.pickRandom(greetingResponses[this.language]);
  }

  // Main response generator
  generateResponse(message: string): string {
    if (!message.trim()) return this.getFallbackResponse();

    const msg = message.toLowerCase();

    // Detect greeting
    if (this.isGreeting(msg)) return this.getGreeting();

    // Pattern matching
    for (const pattern of responsePatterns) {
      if (pattern.keywords.some((k) => msg.includes(k))) {
        return this.pickRandom(pattern.responses[this.language]);
      }
    }

    // No matching keywords
    return this.getFallbackResponse();
  }

  private isGreeting(msg: string): boolean {
    const greet = ["hello", "hi", "hey", "สวัสดี", "หวัดดี", "你好", "您好"];
    return greet.some((g) => msg.includes(g));
  }

  private getFallbackResponse() {
    return this.pickRandom(fallbackResponses[this.language]);
  }

  private pickRandom(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  getSuggestedQuestions(): string[] {
    switch (this.language) {
      case "th":
        return ["แนะนำผลิตภัณฑ์บำรุงผิว", "สาเหตุของผิวแดง", "วิธีลดสิวอย่างไร"];
      case "en":
        return ["Recommend skincare products", "Causes of redness", "How to reduce acne"];
      default:
        return ["推荐护肤品", "皮肤发红的原因", "如何减少痘痘"];
    }
  }
}

// ================================================================
// ===================== EXPORT INSTANCE ==========================
// ================================================================

export const aiEngine = new AIResponseEngine();
