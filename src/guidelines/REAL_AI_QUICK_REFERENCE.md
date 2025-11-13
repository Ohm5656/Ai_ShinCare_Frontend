# ⚡ Real AI Integration - Quick Reference Card

> บันทึกสั้นๆ สำหรับดูเวลาทำ Real AI  
> เปิดไฟล์นี้ไว้ข้างๆ ตอนทำตาม REAL_AI_FOR_BEGINNERS.md

---

## 🎯 ภาพรวม 1 นาที

```
1. สร้าง Supabase Project     → เก็บ URL + Key
2. รับ OpenAI API Key          → เก็บ sk-proj-xxx
3. ติดตั้ง Supabase CLI       → npm install -g supabase
4. สร้าง Edge Function        → คัดลอกโค้ด
5. Deploy Function             → supabase functions deploy
6. เชื่อมต่อ Frontend          → แก้ไข .env.local
7. ทดสอบ                       → พิมพ์คุยกับ AI
```

---

## 📝 Checklist

### ก่อนเริ่ม
- [ ] มี Node.js v18+ (`node --version`)
- [ ] มี Browser
- [ ] มีบัตรเครดิต (สำหรับ OpenAI)

### Step 1: Supabase
- [ ] สร้าง account: https://supabase.com
- [ ] สร้าง project ใหม่
- [ ] เก็บ **Project URL**: `https://xxxxx.supabase.co`
- [ ] เก็บ **Anon Key**: `eyJhbG...`

### Step 2: OpenAI
- [ ] สร้าง account: https://platform.openai.com
- [ ] เติมเงิน $5+
- [ ] สร้าง API Key
- [ ] เก็บ **API Key**: `sk-proj-xxxxx`

### Step 3-4: Setup Local
- [ ] ติดตั้ง CLI: `npm install -g supabase`
- [ ] Login: `supabase login`
- [ ] ไปที่โฟลเดอร์โปรเจค: `cd /path/to/project`
- [ ] Link project: `supabase link --project-ref xxxxx`
- [ ] สร้าง function: `supabase functions new chat-ai`
- [ ] คัดลอกโค้ดจาก `/guidelines/supabase-edge-function-example.ts`

### Step 5: Deploy
- [ ] Set secret: `supabase secrets set OPENAI_API_KEY=sk-proj-xxx`
- [ ] Deploy: `supabase functions deploy chat-ai`
- [ ] เก็บ **Function URL**

### Step 6: Frontend
- [ ] สร้างไฟล์ `.env.local`
- [ ] ใส่ VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- [ ] ใส่ VITE_USE_REAL_AI=true
- [ ] แก้ไข DrSkinAIChatScreen.tsx
- [ ] Restart: `npm run dev`

### Step 7: ทดสอบ
- [ ] เปิดแอป
- [ ] ไปหน้า Dr. Skin AI Chat
- [ ] ถามคำถาม
- [ ] เช็ค Console: ควรเห็น "AI Source: real"
- [ ] เช็ค OpenAI Usage Dashboard

---

## 🔑 ข้อมูลสำคัญที่ต้องเก็บ

```
┌─────────────────────────────────────────────┐
│ SUPABASE                                    │
├─────────────────────────────────────────────┤
│ Project URL:                                │
│ https://xxxxx.supabase.co                   │
│                                             │
│ Anon Key:                                   │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...     │
│                                             │
│ Project Ref:                                │
│ xxxxx (จาก URL)                             │
├─────────────────────────────────────────────┤
│ OPENAI                                      │
├─────────────────────────────────────────────┤
│ API Key:                                    │
│ sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    │
├─────────────────────────────────────────────┤
│ EDGE FUNCTION                               │
├─────────────────────────────────────────────┤
│ Function URL:                               │
│ https://xxxxx.supabase.co/functions/v1/     │
│ chat-ai                                     │
└─────────────────────────────────────────────┘
```

**💾 บันทึกไว้ใน Notepad หรือ Notes app!**

---

## 💻 คำสั่ง Terminal ทั้งหมด

```bash
# 1. ติดตั้ง Supabase CLI
npm install -g supabase

# 2. เช็คเวอร์ชัน
supabase --version

# 3. Login
supabase login

# 4. ไปที่โฟลเดอร์โปรเจค
cd ~/Desktop/glowbiebell  # Mac/Linux
cd C:\Users\Name\Desktop\glowbiebell  # Windows

# 5. Link project
supabase link --project-ref YOUR_PROJECT_REF

# 6. สร้าง function
supabase functions new chat-ai

# 7. Set secret
supabase secrets set OPENAI_API_KEY=sk-proj-YOUR_KEY

# 8. Deploy
supabase functions deploy chat-ai

# 9. ดู logs (ถ้ามีปัญหา)
supabase functions logs chat-ai

# 10. List secrets
supabase secrets list
```

---

## 📄 ไฟล์ที่ต้องสร้าง/แก้ไข

### 1. `supabase/functions/chat-ai/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, language } = await req.json();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    const systemPrompt = language === 'th' 
      ? 'คุณคือ Dr. Skin AI ผู้เชี่ยวชาญด้านผิวหนัง ตอบเป็นภาษาไทย สั้นกระชับ ไม่เกิน 200 คำ'
      : language === 'zh'
      ? '您是护肤专家 Dr. Skin AI。用中文简短回答，不超过200字'
      : 'You are Dr. Skin AI. Give brief advice in English, max 200 words';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 2. `.env.local` (ที่ root ของโปรเจค)

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Enable Real AI
VITE_USE_REAL_AI=true
```

### 3. `DrSkinAIChatScreen.tsx` - เพิ่ม imports

```typescript
import { RealAIService, HybridAIService } from '../../utils/realAIService';

// เพิ่มตัวแปร
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const USE_REAL_AI = import.meta.env.VITE_USE_REAL_AI === 'true';

// ใน component
const realAIRef = useRef<RealAIService | null>(
  USE_REAL_AI && SUPABASE_URL && SUPABASE_ANON_KEY
    ? new RealAIService({ supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_ANON_KEY })
    : null
);

const hybridAIRef = useRef(
  new HybridAIService(realAIRef.current, aiEngineRef.current)
);

// ใน handleSendMessage
const { response: aiResponseText } = await hybridAIRef.current.generateResponse(
  inputMessage,
  t.language as 'th' | 'en' | 'zh'
);
```

---

## 🐛 Troubleshooting ด่วน

| ปัญหา | แก้ไข |
|-------|-------|
| "command not found: node" | ติดตั้ง Node.js จาก nodejs.org |
| "command not found: supabase" | `npm install -g supabase` |
| "OPENAI_API_KEY not configured" | `supabase secrets set OPENAI_API_KEY=sk-proj-xxx` |
| "Incorrect API key" | สร้าง API Key ใหม่ที่ OpenAI |
| "You exceeded your quota" | เติมเงินที่ OpenAI Billing |
| "CORS error" | เช็ค corsHeaders ใน Edge Function |
| ไม่เห็นคำตอบ | Restart dev server, เช็ค Console |

---

## 💰 ราคาโดยประมาณ

### OpenAI (gpt-4o-mini)

```
1 conversation ≈ ฿0.01 (1 สตางค์)

สมมติ 1,000 users × 10 conversations/วัน:
= 10,000 conversations/วัน
= ฿100/วัน
= ฿3,000/เดือน
```

### Supabase

```
Free tier: 500,000 requests/เดือน
= มากกว่าพอ!

ถ้าเกิน: Pro plan $25/เดือน
```

**รวม:** ประมาณ **฿3,000-4,000/เดือน** สำหรับ 1,000 active users

---

## 🔗 Links ที่สำคัญ

| ชื่อ | URL | ใช้สำหรับ |
|------|-----|-----------|
| Supabase Dashboard | https://app.supabase.com | จัดการ project, ดู logs |
| OpenAI Platform | https://platform.openai.com | สร้าง API key, ดู usage |
| OpenAI Billing | https://platform.openai.com/settings/organization/billing | เติมเงิน, ดูค่าใช้จ่าย |
| Node.js Download | https://nodejs.org | ดาวน์โหลด Node.js |

---

## 📚 อ่านเพิ่มเติม

- 📖 [REAL_AI_FOR_BEGINNERS.md](./REAL_AI_FOR_BEGINNERS.md) - คู่มือละเอียดทุกขั้นตอน
- 💻 [TERMINAL_COMMANDS_CHEATSHEET.md](./TERMINAL_COMMANDS_CHEATSHEET.md) - คำสั่ง Terminal
- 🎓 [CHATBOT_AI_INTEGRATION.md](./CHATBOT_AI_INTEGRATION.md) - คู่มือ Advanced
- ⚡ [CHATBOT_QUICK_START.md](./CHATBOT_QUICK_START.md) - เริ่มต้นใช้ Mock AI

---

## 💡 Tips สุดท้าย

### ✅ ควรทำ:

- ✅ ทดสอบด้วย Mock AI ก่อน (ฟรี!)
- ✅ ตั้ง Usage Limit ที่ OpenAI
- ✅ เช็ค logs บ่อยๆ ตอนเริ่มต้น
- ✅ เก็บ API keys ในที่ปลอดภัย
- ✅ Commit code **ยกเว้น** `.env.local`

### ❌ ไม่ควรทำ:

- ❌ เอา API Key ใส่ใน code โดยตรง
- ❌ Commit `.env.local` เข้า Git
- ❌ แชร์ API Key ให้คนอื่น
- ❌ ลืมตั้ง Usage Limit
- ❌ ใช้ model ที่แพงเกิน (gpt-4)

---

## 🎯 เป้าหมายสุดท้าย

เมื่อทำเสร็จ คุณจะได้:

```
✅ AI Chatbot ที่ใช้ OpenAI จริง
✅ ระบบปลอดภัย (API Key ไม่รั่ว)
✅ Auto fallback ถ้า AI error
✅ ควบคุมต้นทุนได้
✅ Monitor usage ได้
```

---

**พิมพ์ไฟล์นี้ออกมาแปะข้างจอ!** 📄  
จะได้ดูง่ายตอนทำ

**สร้างโดย**: Figma Make AI  
**อัปเดต**: 9 พฤศจิกายน 2568  
**เวอร์ชัน**: 1.0
