# 🤖 คู่มือการเชื่อมต่อ Real AI สำหรับ GlowbieBell Chatbot

## 📋 สารบัญ
1. [ภาพรวม](#ภาพรวม)
2. [Part 1: Mock AI (ใช้งานได้แล้ว)](#part-1-mock-ai)
3. [Part 2: การเชื่อมต่อ Real AI](#part-2-real-ai)
4. [วิธีเลือก AI Provider](#วิธีเลือก-ai-provider)
5. [Step-by-Step Integration](#step-by-step-integration)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 ภาพรวม

แอป GlowbieBell ตอนนี้มี **2 โหมดการทำงาน**:

### ✅ โหมดปัจจุบัน: Mock AI (แนะนำสำหรับ Development/Demo)
- ใช้ Pattern Matching + Rule-based responses
- ไม่ต้องใช้ API key หรือ backend
- ตอบได้หลากหลายกว่า 50+ patterns
- รองรับ 3 ภาษา (ไทย, อังกฤษ, จีน)
- **พร้อมใช้งานทันที!**

### 🚀 โหมดที่จะพัฒนาต่อ: Real AI (Production)
- ใช้ AI models จริง (OpenAI GPT, Anthropic Claude, Google Gemini)
- ตอบคำถามได้ละเอียด ยืดหยุ่น และฉลาดกว่า
- ต้องใช้ Supabase Edge Functions เพื่อความปลอดภัย
- มีค่าใช้จ่ายตาม API usage

---

## Part 1: Mock AI (ใช้งานได้แล้ว) ✅

### สถานะปัจจุบัน

Mock AI ที่เราสร้างไว้อยู่ที่:
```
/utils/aiResponseEngine.ts
```

และถูกใช้งานใน:
```
/components/pages/DrSkinAIChatScreen.tsx
```

### ความสามารถของ Mock AI

Mock AI ของเราสามารถตอบคำถามเกี่ยวกับ:

1. **ปัญหาผิวหน้า**
   - สิวและรอยสิว
   - ผิวแดง ระคายเคือง
   - ฝ้า กระ จุดด่างดำ
   - ริ้วรอย อาการชรา
   - ความมัน/ความแห้ง
   - ถุงใต้ตา ตาคล้ำ

2. **คำแนะนำผลิตภัณฑ์**
   - แนะนำตามประเภทผิว
   - ส่วนผสมที่ดี
   - ขั้นตอนการดูแลผิว

3. **การป้องกัน**
   - ครีมกันแดด
   - วิธีดูแลผิวแต่ละประเภท
   - อาหารบำรุงผิว

### วิธีปรับปรุง Mock AI

หากต้องการเพิ่มคำตอบ ให้แก้ไขไฟล์ `/utils/aiResponseEngine.ts`:

```typescript
// เพิ่ม pattern ใหม่ใน responsePatterns array
{
  keywords: ['คำค้นหา', 'keywords', 'here'],
  responses: {
    th: ['คำตอบภาษาไทย 1', 'คำตอบภาษาไทย 2'],
    en: ['English response 1', 'English response 2'],
    zh: ['中文回答 1', '中文回答 2']
  }
}
```

---

## Part 2: Real AI Integration 🚀

### ทำไมต้องใช้ Supabase Edge Functions?

**❌ อย่าเรียก AI API โดยตรงจาก Frontend!**

เพราะ:
- API Key จะถูกเปิดเผยใน browser
- ใครก็สามารถเห็นและใช้ API key ของคุณได้
- จะโดนเรียกเก็บเงินจากการใช้งานที่ไม่ได้รับอนุญาต

**✅ ใช้ Supabase Edge Functions แทน**

เพราะ:
- API Key ปลอดภัย อยู่ใน backend
- ควบคุม rate limiting ได้
- เพิ่ม authentication ได้
- Monitor usage ได้

---

## 🤔 วิธีเลือก AI Provider

### เปรียบเทียบ AI Providers

| Provider | ราคา | ความเร็ว | ภาษาไทย | แนะนำสำหรับ |
|----------|------|----------|---------|-------------|
| **OpenAI GPT-4** | $$$ | ปานกลาง | ดีมาก | Production, คุณภาพสูงสุด |
| **OpenAI GPT-3.5** | $ | เร็ว | ดี | Development, ประหยัด |
| **Anthropic Claude 3** | $$ | เร็ว | ดีมาก | Long conversations |
| **Google Gemini Pro** | ฟรี* | เร็วมาก | ดี | Prototype, Free tier |
| **OpenAI GPT-4o-mini** | $ | เร็วมาก | ดี | Production, ราคาถูก |

*ราคา: $ = ถูก, $$ = ปานกลาง, $$$ = แพง

### แนะนำ: **OpenAI GPT-4o-mini**

เหมาะสำหรับ GlowbieBell เพราะ:
- ✅ ราคาถูก (15x ถูกกว่า GPT-4)
- ✅ เร็วมาก
- ✅ ตอบภาษาไทยได้ดี
- ✅ คุณภาพดีพอสำหรับ skincare advice

---

## 📝 Step-by-Step Integration

### Phase 1: เตรียม Supabase Project

#### 1.1 สร้าง Supabase Project
```bash
# ไปที่ https://supabase.com
# สร้าง project ใหม่
# จดบันทึก Project URL และ Anon Key
```

#### 1.2 เปิดใช้งาน Edge Functions
```bash
# ติดตั้ง Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF
```

---

### Phase 2: สร้าง Edge Function สำหรับ AI

#### 2.1 สร้าง Edge Function ใหม่

```bash
# สร้าง function ใหม่ชื่อ "chat-ai"
supabase functions new chat-ai
```

#### 2.2 เขียนโค้ด Edge Function

สร้างไฟล์ `supabase/functions/chat-ai/index.ts`:

```typescript
// Import Deno's serve function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Main handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { message, language, conversationHistory } = await req.json();

    // Validate input
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare system prompt for skincare AI
    const systemPrompt = getSystemPrompt(language || 'th');

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // ใช้ GPT-4o-mini ที่ถูกและเร็ว
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // Return AI response
    return new Response(
      JSON.stringify({ 
        response: aiMessage,
        usage: data.usage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// System prompt for skincare AI
function getSystemPrompt(language: string): string {
  const prompts = {
    th: `คุณคือ Dr. Skin AI ผู้เชี่ยวชาญด้านผิวหนังส่วนตัวของ GlowbieBell แอปวิเคราะห์ผิวหน้าด้วย AI

บทบาทของคุณ:
- ให้คำแนะนำเกี่ยวกับการดูแลผิวหน้า
- แนะนำผลิตภัณฑ์และส่วนผสมที่เหมาะสม
- ตอบคำถามเกี่ยวกับปัญหาผิว เช่น สิว ฝ้ากระ ริ้วรอย ผิวแดง ความมัน ความแห้ง
- พูดด้วยน้ำเสียงที่เป็นมิตร อ่อนโยน และเป็นมืออาชีพ

ข้อควรจำ:
- ตอบเป็นภาษาไทย
- ใช้คำว่า "ค่ะ" ในท้ายประโยค
- ให้คำแนะนำที่เป็นประโยชน์และปฏิบัติได้จริง
- ไม่วินิจฉัยโรค - แนะนำให้ปรึกษาแพทย์ผิวหนังหากรุนแรง
- ใช้ emoji เล็กน้อยให้ดูเป็นกันเอง

ตอบคำถามอย่างกระชับ ไม่เกิน 150-200 คำ`,

    en: `You are Dr. Skin AI, GlowbieBell's personal skincare expert AI.

Your role:
- Provide skincare advice and recommendations
- Suggest products and ingredients
- Answer questions about skin concerns: acne, dark spots, wrinkles, redness, oiliness, dryness
- Use a friendly, gentle, and professional tone

Guidelines:
- Respond in English
- Give practical, actionable advice
- Do not diagnose conditions - suggest seeing a dermatologist if severe
- Use occasional emojis to be friendly

Keep responses concise: 150-200 words max`,

    zh: `您是 Dr. Skin AI，GlowbieBell 的私人护肤专家 AI。

您的角色：
- 提供护肤建议和推荐
- 推荐产品和成分
- 回答有关皮肤问题的问题：痘痘、黑斑、皱纹、发红、油性、干燥
- 使用友好、温和和专业的语气

指南：
- 用中文回答
- 提供实用、可操作的建议
- 不要诊断病情 - 如果严重建议看皮肤科医生
- 偶尔使用表情符号保持友好

保持回答简洁：最多 150-200 字`
  };

  return prompts[language] || prompts['th'];
}
```

#### 2.3 ตั้งค่า Environment Variables

```bash
# ตั้งค่า OpenAI API key (รับได้จาก https://platform.openai.com/api-keys)
supabase secrets set OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### 2.4 Deploy Edge Function

```bash
# Deploy function ไปยัง Supabase
supabase functions deploy chat-ai
```

---

### Phase 3: อัปเดต Frontend

#### 3.1 สร้าง Real AI Service

สร้างไฟล์ `/utils/realAIService.ts`:

```typescript
// Real AI Service using Supabase Edge Functions

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class RealAIService {
  private supabaseUrl: string;
  private supabaseKey: string;
  private conversationHistory: ChatMessage[] = [];

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
  }

  async generateResponse(
    userMessage: string,
    language: 'th' | 'en' | 'zh' = 'th'
  ): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Call Supabase Edge Function
      const response = await fetch(
        `${this.supabaseUrl}/functions/v1/chat-ai`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.supabaseKey}`,
          },
          body: JSON.stringify({
            message: userMessage,
            language: language,
            conversationHistory: this.conversationHistory.slice(-10) // Keep last 10 messages
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response;

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      return aiResponse;

    } catch (error) {
      console.error('Real AI Error:', error);
      // Fallback to error message
      throw error;
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }
}
```

#### 3.2 อัปเดต DrSkinAIChatScreen

แก้ไขไฟล์ `/components/pages/DrSkinAIChatScreen.tsx`:

```typescript
import { RealAIService } from '../../utils/realAIService';

// เพิ่ม environment variables (ใส่ใน .env หรือ config)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// เพิ่มการเลือกระหว่าง Mock AI และ Real AI
const USE_REAL_AI = false; // เปลี่ยนเป็น true เมื่อพร้อม

export function DrSkinAIChatScreen({ onBack }: DrSkinAIChatScreenProps) {
  const { t } = useLanguage();
  
  // Initialize AI engines
  const mockAIRef = useRef(new AIResponseEngine(t.language as 'th' | 'en' | 'zh'));
  const realAIRef = useRef<RealAIService | null>(
    USE_REAL_AI ? new RealAIService(SUPABASE_URL, SUPABASE_ANON_KEY) : null
  );
  
  // ... rest of the code ...
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputMessage || '...',
      sender: 'user',
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      let aiResponseText: string;

      if (USE_REAL_AI && realAIRef.current) {
        // Use Real AI
        aiResponseText = await realAIRef.current.generateResponse(
          messageToSend,
          t.language as 'th' | 'en' | 'zh'
        );
      } else {
        // Use Mock AI
        await new Promise(resolve => setTimeout(resolve, 1500));
        aiResponseText = mockAIRef.current.generateResponse(messageToSend);
      }

      const aiResponse: Message = {
        id: messages.length + 2,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Error:', error);
      
      // Fallback to mock AI on error
      const fallbackResponse: Message = {
        id: messages.length + 2,
        text: mockAIRef.current.generateResponse(messageToSend),
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // ... rest of the code ...
}
```

---

## 🔐 การตั้งค่า Environment Variables

### วิธีที่ 1: ใช้ไฟล์ .env (แนะนำ)

สร้างไฟล์ `.env.local` ที่ root ของโปรเจค:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_USE_REAL_AI=false
```

จากนั้นใช้ใน code:

```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const USE_REAL_AI = import.meta.env.VITE_USE_REAL_AI === 'true';
```

---

## 💰 การคำนวณต้นทุน

### OpenAI GPT-4o-mini Pricing (ณ พ.ศ. 2568)

- **Input**: $0.150 / 1M tokens (~฿5 / 1M tokens)
- **Output**: $0.600 / 1M tokens (~฿20 / 1M tokens)

### ตัวอย่างการใช้งาน

สมมติ conversation หนึ่งครั้ง:
- User message: ~50 tokens
- System prompt: ~150 tokens
- AI response: ~200 tokens
- **รวม**: ~400 tokens

**ต้นทุนต่อ conversation**: ~฿0.01 (1 สตางค์)

**ถ้ามี 1,000 users ใช้งานวันละ 10 ครั้ง**:
- 1,000 users × 10 conversations = 10,000 conversations/วัน
- 10,000 × ฿0.01 = **฿100/วัน** หรือ **฿3,000/เดือน**

---

## 🎯 Optimization Tips

### 1. ใช้ Caching สำหรับคำถามที่ซ้ำ

```typescript
const questionCache = new Map<string, string>();

async function getCachedResponse(question: string) {
  if (questionCache.has(question)) {
    return questionCache.get(question);
  }
  
  const response = await realAI.generateResponse(question);
  questionCache.set(question, response);
  return response;
}
```

### 2. Rate Limiting

ใช้ Supabase Row Level Security (RLS) จำกัดจำนวนครั้งที่เรียก:

```sql
-- สร้างตาราง rate_limit
CREATE TABLE rate_limits (
  user_id UUID PRIMARY KEY,
  request_count INTEGER DEFAULT 0,
  reset_at TIMESTAMP DEFAULT NOW() + INTERVAL '1 hour'
);

-- ตรวจสอบใน Edge Function
-- ถ้า request_count > 100 ใน 1 ชั่วโมง ให้ reject
```

### 3. ใช้ Streaming Responses

สำหรับ Real-time typing effect:

```typescript
// ใน Edge Function
const stream = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: messages,
  stream: true,
});

// Stream response กลับไปยัง client
```

---

## 🐛 Troubleshooting

### ปัญหาที่พบบ่อย

#### 1. CORS Error
```
Solution: ตรวจสอบ corsHeaders ใน Edge Function
```

#### 2. API Key Invalid
```
Solution: ตรวจสอบว่า set secret ถูกต้อง
supabase secrets list
```

#### 3. Function Timeout
```
Solution: ลด max_tokens หรือเพิ่ม timeout
```

#### 4. Rate Limit from OpenAI
```
Solution: 
- อัพเกรด OpenAI account
- ใช้ Caching
- Implement queue system
```

---

## 📊 Monitoring และ Analytics

### ติดตาม Usage

```typescript
// ใน Edge Function
const usage = {
  timestamp: new Date(),
  user_id: userId,
  tokens_used: data.usage.total_tokens,
  cost: calculateCost(data.usage)
};

// Save to Supabase table
await supabase.from('ai_usage').insert(usage);
```

### Dashboard สำหรับติดตาม Cost

สร้าง Supabase query:

```sql
-- Total cost today
SELECT SUM(cost) as total_cost
FROM ai_usage
WHERE DATE(timestamp) = CURRENT_DATE;

-- Most active users
SELECT user_id, COUNT(*) as request_count
FROM ai_usage
GROUP BY user_id
ORDER BY request_count DESC
LIMIT 10;
```

---

## 🎓 สรุป

### ขั้นตอนการ Deploy Real AI:

1. ✅ **Mock AI พร้อมใช้แล้ว** - สำหรับ demo และ development
2. 🔧 **ตั้งค่า Supabase** - สร้าง project และ install CLI
3. 📝 **สร้าง Edge Function** - เขียน chat-ai function
4. 🔑 **ตั้ง API Keys** - เพิ่ม OpenAI key เป็น secret
5. 🚀 **Deploy** - deploy function ไปยัง Supabase
6. 💻 **อัปเดต Frontend** - เพิ่ม RealAIService
7. 🧪 **ทดสอบ** - ทดสอบทั้ง Mock และ Real AI
8. 📊 **Monitor** - ติดตาม usage และ cost

### Timeline แนะนำ:

- **Week 1**: ทดสอบ Mock AI ให้แน่ใจว่าทำงานได้ดี
- **Week 2**: ตั้งค่า Supabase และ Edge Functions
- **Week 3**: Integrate Real AI และทดสอบ
- **Week 4**: Deploy และ monitor

---

## 📚 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [OpenAI Pricing](https://openai.com/pricing)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

---

## 💡 คำแนะนำสุดท้าย

1. **เริ่มจาก Mock AI** - ใช้งานได้เลยและไม่มีค่าใช้จ่าย
2. **ทดสอบ Real AI ใน Development** - ก่อน deploy production
3. **ติดตั้ง Rate Limiting** - ป้องกันการใช้งานเกิน
4. **Monitor Cost** - เช็คค่าใช้จ่ายทุกวัน
5. **Fallback to Mock AI** - ถ้า Real AI error หรือ budget หมด

---

สร้างโดย: Figma Make AI  
อัปเดตล่าสุด: 9 พฤศจิกายน 2568  
เวอร์ชัน: 1.0
