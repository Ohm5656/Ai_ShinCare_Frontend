# 💻 Terminal Commands Cheat Sheet

> คู่มือคำสั่ง Terminal สำหรับมือใหม่  
> ใช้คู่กับ REAL_AI_FOR_BEGINNERS.md

---

## 📋 สารบัญ

1. [พื้นฐาน Terminal](#พื้นฐาน-terminal)
2. [คำสั่งทั้งหมดตามลำดับ](#คำสั่งทั้งหมดตามลำดับ)
3. [FAQ - คำถามที่พบบ่อย](#faq)

---

## พื้นฐาน Terminal

### 🖥️ Terminal คืออะไร?

**Terminal** = โปรแกรมที่ใช้พิมพ์คำสั่งเพื่อสั่งคอมพิวเตอร์ทำงาน

**ชื่อเรียกต่างกัน:**
- **Mac**: Terminal.app
- **Windows**: Command Prompt หรือ PowerShell
- **Linux**: Terminal

### 🔓 เปิด Terminal ยังไง?

**Mac:**
```
1. กด Command (⌘) + Space
2. พิมพ์ "Terminal"
3. กด Enter
```

**Windows:**
```
1. กด Windows + R
2. พิมพ์ "cmd"
3. กด Enter
```

**Linux:**
```
กด Ctrl + Alt + T
```

### 📁 คำสั่งพื้นฐาน

| คำสั่ง | ความหมาย | ตัวอย่าง |
|--------|----------|----------|
| `pwd` | แสดงโฟลเดอร์ปัจจุบัน | `pwd` → `/Users/yourname` |
| `ls` | แสดงไฟล์ในโฟลเดอร์ | `ls` → `file1.txt file2.txt` |
| `cd` | เปลี่ยนโฟลเดอร์ | `cd Desktop` |
| `mkdir` | สร้างโฟลเดอร์ใหม่ | `mkdir my-folder` |
| `touch` | สร้างไฟล์ใหม่ | `touch .env.local` |

---

## คำสั่งทั้งหมดตามลำดับ

### ✅ Step 1: เช็ค Node.js

```bash
# เช็คว่ามี Node.js หรือยัง
node --version
```

**ผลลัพธ์ที่ต้องการ:**
```
v18.17.0  <-- เวอร์ชันอาจต่างกัน แต่ต้อง v18 ขึ้นไป
```

**ถ้าไม่มี:**
```
command not found: node
→ ต้องติดตั้ง Node.js จาก nodejs.org
```

---

### ✅ Step 2: ติดตั้ง Supabase CLI

```bash
# ติดตั้ง Supabase CLI ทั่วโลก (global)
npm install -g supabase
```

**ความหมาย:**
- `npm` = ตัวจัดการ package ของ Node.js
- `install` = ติดตั้ง
- `-g` = global (ใช้ได้ทุกที่)
- `supabase` = ชื่อ package

**ผลลัพธ์:**
```
added 1 package in 30s
```

**เช็คว่าติดตั้งสำเร็จ:**
```bash
supabase --version
```

ควรขึ้น:
```
1.127.4
```

---

### ✅ Step 3: Login Supabase

```bash
# เข้าสู่ระบบ Supabase
supabase login
```

**ผลลัพธ์:**
```
Opening browser for authentication...
✓ Logged in successfully!
```

**ถ้าไม่เปิด browser:**
```
กดที่ link ที่แสดงใน Terminal
```

---

### ✅ Step 4: ไปที่โฟลเดอร์โปรเจค

```bash
# ไปที่โฟลเดอร์โปรเจค GlowbieBell
cd /path/to/your/glowbiebell-project
```

**ตัวอย่างจริง:**

**Mac/Linux:**
```bash
# ถ้าโปรเจคอยู่ Desktop
cd ~/Desktop/glowbiebell

# ถ้าโปรเจคอยู่ Documents
cd ~/Documents/glowbiebell
```

**Windows:**
```bash
# ถ้าโปรเจคอยู่ Desktop
cd C:\Users\YourName\Desktop\glowbiebell

# ถ้าโปรเจคอยู่ Documents
cd C:\Users\YourName\Documents\glowbiebell
```

**เช็คว่าอยู่ที่ถูกต้อง:**
```bash
# ดูไฟล์ในโฟลเดอร์
ls

# ควรเห็น
package.json
App.tsx
...
```

---

### ✅ Step 5: Link โปรเจค Supabase

```bash
# Link กับโปรเจค Supabase
supabase link --project-ref YOUR_PROJECT_REF
```

**⚠️ แทนที่ `YOUR_PROJECT_REF`!**

**วิธีหา Project Ref:**
```
1. เปิด Supabase Dashboard
2. ดู URL: https://app.supabase.com/project/abcdefghijklmn
3. ส่วน abcdefghijklmn คือ project-ref
```

**ตัวอย่าง:**
```bash
supabase link --project-ref abcdefghijklmn
```

**จะถาม Database Password:**
```
Enter your database password:
```

พิมพ์รหัสที่ตั้งไว้ตอนสร้างโปรเจค → กด Enter

**ผลลัพธ์:**
```
✓ Linked to project abcdefghijklmn
```

---

### ✅ Step 6: สร้าง Edge Function

```bash
# สร้าง function ชื่อ chat-ai
supabase functions new chat-ai
```

**ผลลัพธ์:**
```
Created new Function at supabase/functions/chat-ai/index.ts
```

**โครงสร้างที่สร้างขึ้น:**
```
supabase/
  └── functions/
      └── chat-ai/
          └── index.ts  <-- ไฟล์ใหม่
```

---

### ✅ Step 7: ตั้งค่า OpenAI API Key

```bash
# เก็บ OpenAI API Key เป็น secret
supabase secrets set OPENAI_API_KEY=sk-proj-your-actual-key
```

**⚠️ แทนที่ `sk-proj-your-actual-key` ด้วย API Key จริง!**

**ตัวอย่าง:**
```bash
supabase secrets set OPENAI_API_KEY=sk-proj-abc123def456ghi789
```

**ผลลัพธ์:**
```
✓ Finished supabase secrets set.
```

**เช็คว่า set แล้ว:**
```bash
supabase secrets list
```

ควรเห็น:
```
OPENAI_API_KEY: sk-proj-abc...
```

---

### ✅ Step 8: Deploy Edge Function

```bash
# Deploy function ไปยัง Supabase
supabase functions deploy chat-ai
```

**ผลลัพธ์:**
```
Deploying Function...
✓ Deployed Function chat-ai
  URL: https://xxxxx.supabase.co/functions/v1/chat-ai
```

**📌 คัดลอก URL ไว้ใช้!**

---

### ✅ Step 9: สร้างไฟล์ Environment Variables

```bash
# สร้างไฟล์ .env.local
touch .env.local
```

**Windows (ถ้า touch ไม่ทำงาน):**
```bash
type nul > .env.local
```

**หรือสร้างด้วยมือ:**
1. เปิด Text Editor (Notepad, VS Code)
2. สร้างไฟล์ใหม่
3. บันทึกเป็น `.env.local` ที่โฟลเดอร์หลัก

---

### ✅ Step 10: Restart Development Server

```bash
# ปิด server (ถ้ากำลังรันอยู่)
# กด Ctrl + C

# รัน server ใหม่
npm run dev
```

**ผลลัพธ์:**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## FAQ

### ❓ คำสั่งไม่ทำงาน / "command not found"

**สาเหตุ:** โปรแกรมยังไม่ได้ติดตั้ง

**แก้ไข:**
```bash
# ถ้า node ไม่ทำงาน
→ ติดตั้ง Node.js จาก nodejs.org

# ถ้า npm ไม่ทำงาน
→ มาพร้อม Node.js ควรทำงานอัตโนมัติ

# ถ้า supabase ไม่ทำงาน
npm install -g supabase
```

---

### ❓ "Permission denied"

**สาเหตุ:** ไม่มีสิทธิ์เขียนไฟล์

**แก้ไข:**

**Mac/Linux:**
```bash
# เพิ่ม sudo ข้างหน้า
sudo npm install -g supabase
```

**Windows:**
```bash
# เปิด Command Prompt as Administrator
1. ค้นหา "cmd"
2. คลิกขวา → "Run as administrator"
```

---

### ❓ อยู่ผิดโฟลเดอร์

**เช็คว่าอยู่ที่ไหน:**
```bash
pwd
```

**กลับไป home:**
```bash
cd ~
```

**ไปที่ Desktop:**
```bash
cd ~/Desktop
```

**ขึ้นไปโฟลเดอร์บน:**
```bash
cd ..
```

---

### ❓ ต้องการลบ function ที่สร้างผิด

```bash
# ลบ function
supabase functions delete chat-ai
```

**ลบโฟลเดอร์:**
```bash
rm -rf supabase/functions/chat-ai
```

---

### ❓ อัปเดต secret ที่ set ผิด

```bash
# Set ใหม่ทับของเก่า
supabase secrets set OPENAI_API_KEY=new-key
```

---

### ❓ ดู logs ของ Edge Function

```bash
# ดู logs แบบ real-time
supabase functions serve chat-ai
```

**หรือดูใน Dashboard:**
```
Supabase Dashboard → Functions → chat-ai → Logs
```

---

## 📚 คำสั่งเพิ่มเติม

### Supabase CLI

```bash
# ดูความช่วยเหลือ
supabase --help

# ดูคำสั่ง functions
supabase functions --help

# List functions ทั้งหมด
supabase functions list

# ดู secrets ทั้งหมด
supabase secrets list

# ลบ secret
supabase secrets unset OPENAI_API_KEY

# Logout
supabase logout
```

### NPM

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# Build production
npm run build

# ดู package ที่ติดตั้ง
npm list -g

# อัปเดต package
npm update -g supabase
```

---

## 💡 Tips

### 1. ใช้ Tab เพื่อ autocomplete

พิมพ์:
```bash
cd Des
```
แล้วกด Tab → จะเติมเป็น `cd Desktop` อัตโนมัติ

### 2. ใช้ลูกศรขึ้น-ลง

กดลูกศรขึ้น → จะแสดงคำสั่งล่าสุด  
กดซ้ำๆ → ย้อนดูคำสั่งเก่าๆ

### 3. Clear หน้าจอ

```bash
clear
```

หรือกด `Ctrl + L` (Mac/Linux) / `cls` (Windows)

### 4. หยุดโปรแกรมที่กำลังรัน

กด `Ctrl + C`

### 5. Copy-Paste ใน Terminal

**Mac:**
- Copy: `Cmd + C`
- Paste: `Cmd + V`

**Windows/Linux:**
- Copy: `Ctrl + Shift + C`
- Paste: `Ctrl + Shift + V`

---

## 🎓 สรุป

### คำสั่งที่ต้องใช้บ่อย:

```bash
# 1. ไปที่โฟลเดอร์โปรเจค
cd ~/Desktop/glowbiebell

# 2. สร้าง function ใหม่
supabase functions new function-name

# 3. Set secret
supabase secrets set KEY_NAME=value

# 4. Deploy function
supabase functions deploy function-name

# 5. รัน dev server
npm run dev
```

---

**เขียนโดย**: Figma Make AI  
**สำหรับ**: มือใหม่ที่ไม่คุ้น Terminal  
**อัปเดต**: 9 พฤศจิกายน 2568

**💻 เรียนรู้ Terminal เพิ่มเติม:**
- [Command Line Crash Course](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line)
- [Terminal Basics (Mac)](https://support.apple.com/guide/terminal/welcome/mac)
