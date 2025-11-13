// =============================================================================
// GlowbieBell AI Chatbot - Supabase Edge Function
// =============================================================================
// 
// ไฟล์นี้เป็นตัวอย่างสำหรับวางใน:
// supabase/functions/chat-ai/index.ts
//
// วิธีใช้งาน:
// 1. ติดตั้ง Supabase CLI: npm install -g supabase
// 2. Login: supabase login
// 3. Link project: supabase link --project-ref YOUR_PROJECT_REF
// 4. สร้าง function: supabase functions new chat-ai
// 5. คัดลอกโค้ดนี้ไปวางใน supabase/functions/chat-ai/index.ts
// 6. ตั้งค่า secrets: supabase secrets set OPENAI_API_KEY=sk-xxx
// 7. Deploy: supabase functions deploy chat-ai
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// =============================================================================
// CORS Configuration
// =============================================================================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// =============================================================================
// System Prompts for Different Languages
// =============================================================================
function getSystemPrompt(language: string): string {
  const prompts = {
    th: `คุณคือ Dr. Skin AI ผู้เชี่ยวชาญด้านผิวหนังส่วนตัวของ GlowbieBell แอปวิเคราะห์ผิวหน้าด้วย AI

🎯 บทบาทของคุณ:
- ให้คำแนะนำเกี่ยวกับการดูแลผิวหน้าอย่างเป็นมืออาชีพ
- แนะนำผลิตภัณฑ์และส่วนผสมที่เหมาะสมกับผิวแต่ละประเภท
- ตอบคำถามเกี่ยวกับปัญหาผิว: สิว ฝ้ากระ ริ้วรอย ผิวแดง ความมัน ความแห้ง ถุงใต้ตา
- ให้คำแนะนำเรื่องขั้นตอนการดูแลผิว (skincare routine)
- พูดด้วยน้ำเสียงที่เป็นมิตร อ่อนโยน และเป็นมืออาชีพ

📋 ข้อควรจำ:
- ตอบเป็นภาษาไทยเสมอ
- ใช้คำว่า "ค่ะ" ในท้ายประโยค (สำหรับผู้หญิง)
- ให้คำแนะนำที่เป็นประโยชน์และปฏิบัติได้จริง
- ไม่วินิจฉัยโรค - แนะนำให้ปรึกษาแพทย์ผิวหนังหากมีอาการรุนแรง
- ใช้ emoji เล็กน้อยเพื่อให้ดูเป็นกันเอง แต่ไม่มากเกินไป
- จัดรูปแบบให้อ่านง่าย ใช้ bullet points และ line breaks

✨ รูปแบบการตอบ:
- กระชับ ไม่เกิน 200 คำ
- แบ่งเป็นหัวข้อย่อยถ้าจำเป็น
- ให้คำแนะนำเป็นขั้นตอน (step-by-step)
- ยกตัวอย่างผลิตภัณฑ์หรือส่วนผสมที่เป็นประโยชน์

🎨 ธีมของ GlowbieBell:
- สีหลัก: ฟ้าสดใส (#7DB8FF), ชมพูพาสเทล (#FFB5D9), ม่วงพาสเทล (#CBB8FF)
- สไตล์: Soft, Minimal, Elegant
- บุคลิก: เป็นมิตร น่าเชื่อถือ ดูแลเอาใจใส่

จำไว้: คุณคือผู้ช่วยที่เข้าใจและใส่ใจผิวของผู้ใช้เป็นอย่างดี 💕`,

    en: `You are Dr. Skin AI, GlowbieBell's personal skincare expert AI assistant.

🎯 Your Role:
- Provide professional skincare advice and recommendations
- Suggest products and ingredients suitable for different skin types
- Answer questions about skin concerns: acne, dark spots, wrinkles, redness, oiliness, dryness, under-eye bags
- Advise on skincare routines
- Use a friendly, gentle, and professional tone

📋 Guidelines:
- Always respond in English
- Give practical, actionable advice
- Do not diagnose medical conditions - suggest seeing a dermatologist if severe
- Use occasional emojis to be friendly, but don't overuse them
- Format responses for easy reading with bullet points and line breaks

✨ Response Format:
- Keep it concise: max 200 words
- Break into sub-topics if needed
- Provide step-by-step advice
- Give examples of helpful products or ingredients

🎨 GlowbieBell Theme:
- Primary colors: Bright Blue (#7DB8FF), Pastel Pink (#FFB5D9), Pastel Purple (#CBB8FF)
- Style: Soft, Minimal, Elegant
- Personality: Friendly, Trustworthy, Caring

Remember: You're a caring assistant who truly understands and cares about users' skin 💕`,

    zh: `您是 Dr. Skin AI，GlowbieBell 的私人护肤专家 AI 助手。

🎯 您的角色：
- 提供专业的护肤建议和推荐
- 推荐适合不同肤质的产品和成分
- 回答有关皮肤问题的问题：痘痘、黑斑、皱纹、发红、油性、干燥、眼袋
- 建议护肤程序
- 使用友好、温和和专业的语气

📋 指南：
- 始终用中文回答
- 提供实用、可操作的建议
- 不要诊断医疗状况 - 如果严重建议看皮肤科医生
- 偶尔使用表情符号保持友好，但不要过度使用
- 格式化回答以便阅读，使用项目符号和换行

✨ 回答格式：
- 保持简洁：最多200字
- 如有必要分成子主题
- 提供分步建议
- 举例说明有用的产品或成分

🎨 GlowbieBell 主题：
- 主色：亮蓝色 (#7DB8FF)、粉彩粉红色 (#FFB5D9)、粉彩紫色 (#CBB8FF)
- 风格：柔和、简约、优雅
- 个性：友好、值得信赖、关怀

记住：您是一位真正理解和关心用户皮肤的助手 💕`
  };

  return prompts[language] || prompts['th'];
}

// =============================================================================
// Rate Limiting Helper
// =============================================================================
async function checkRateLimit(userId: string): Promise<boolean> {
  // TODO: Implement rate limiting using Supabase table
  // For now, return true (no limit)
  return true;
}

// =============================================================================
// Main Handler
// =============================================================================
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // =======================================================================
    // 1. Parse and Validate Request
    // =======================================================================
    const { message, language, conversationHistory, userId } = await req.json();

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required and must be a string' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate message length
    if (message.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Message is too long (max 1000 characters)' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // =======================================================================
    // 2. Check Rate Limiting (Optional)
    // =======================================================================
    if (userId) {
      const canProceed = await checkRateLimit(userId);
      if (!canProceed) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { 
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // =======================================================================
    // 3. Get OpenAI API Key from Environment
    // =======================================================================
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // =======================================================================
    // 4. Prepare Messages for OpenAI
    // =======================================================================
    const systemPrompt = getSystemPrompt(language || 'th');
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    // Limit total messages to prevent token overflow
    const maxMessages = 15;
    const limitedMessages = messages.length > maxMessages 
      ? [messages[0], ...messages.slice(-maxMessages + 1)]
      : messages;

    // =======================================================================
    // 5. Call OpenAI API
    // =======================================================================
    console.log('Calling OpenAI API...');
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fast and affordable model
        messages: limitedMessages,
        temperature: 0.7, // Balanced creativity
        max_tokens: 500, // Limit response length
        top_p: 1,
        frequency_penalty: 0.3, // Reduce repetition
        presence_penalty: 0.3, // Encourage variety
      }),
    });

    // Check if OpenAI request was successful
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'AI service temporarily unavailable',
          details: openaiResponse.status === 429 ? 'Rate limit exceeded' : 'Service error'
        }),
        { 
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // =======================================================================
    // 6. Parse and Return Response
    // =======================================================================
    const data = await openaiResponse.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI');
    }

    const aiMessage = data.choices[0].message.content;

    // Log usage for monitoring
    console.log('AI Response generated:', {
      prompt_tokens: data.usage?.prompt_tokens,
      completion_tokens: data.usage?.completion_tokens,
      total_tokens: data.usage?.total_tokens,
    });

    // Return successful response
    return new Response(
      JSON.stringify({ 
        response: aiMessage,
        usage: data.usage,
        model: 'gpt-4o-mini',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    // =======================================================================
    // 7. Error Handling
    // =======================================================================
    console.error('Edge Function Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// =============================================================================
// Testing Locally
// =============================================================================
// To test this function locally:
// 
// 1. Save this file as: supabase/functions/chat-ai/index.ts
// 2. Run: supabase functions serve chat-ai --env-file .env.local
// 3. Test with curl:
//    curl -i --location --request POST 'http://localhost:54321/functions/v1/chat-ai' \
//      --header 'Authorization: Bearer YOUR_ANON_KEY' \
//      --header 'Content-Type: application/json' \
//      --data '{"message":"สวัสดีค่ะ","language":"th"}'
// =============================================================================
