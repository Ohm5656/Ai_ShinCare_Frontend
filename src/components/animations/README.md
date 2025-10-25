# 🎨 Animation Components

คอมโพเนนต์อนิเมชั่นที่สามารถนำกลับมาใช้ได้สำหรับแอป GlowbieBell

## 📦 Components

### FloatingParticles
อนุภาคที่ลอยอยู่ในพื้นหลัง สามารถเป็นจุดสีหรือ emoji ก็ได้

**Props:**
- `count` (number, default: 15) - จำนวนอนุภาค
- `colors` (string[], default: ['#FFB5D9', '#7DB8FF', '#CBB8FF']) - สีของอนุภาค
- `emojis` (string[], default: ['✨', '💫', '⭐', '🌟']) - emoji ที่จะใช้
- `useEmojis` (boolean, default: false) - ใช้ emoji แทนจุดสี
- `containerClass` (string) - class เพิ่มเติม

**Example:**
```tsx
<FloatingParticles count={20} useEmojis={true} emojis={['✨', '💖']} />
```

---

### Confetti
ดอกไม้กระดาษที่ตกลงมาเมื่อมีการฉลอง

**Props:**
- `active` (boolean, default: true) - เปิด/ปิดเอฟเฟกต์
- `count` (number, default: 50) - จำนวนชิ้น
- `colors` (string[]) - สีของดอกไม้กระดาษ
- `duration` (number, default: 3000) - ระยะเวลาแสดงผล (ms)

**Example:**
```tsx
const [showConfetti, setShowConfetti] = useState(false);
<Confetti active={showConfetti} count={100} duration={5000} />
```

---

### MorphingBlob
รูปทรงที่เปลี่ยนแปลงไปมาแบบ organic

**Props:**
- `color` (string, default: '#FFB5D9') - สีของ blob
- `opacity` (number, default: 0.3) - ความโปร่งใส
- `size` (number, default: 200) - ขนาด
- `className` (string) - class เพิ่มเติม
- `duration` (number, default: 8) - ระยะเวลาของอนิเมชั่น (วินาที)

**Example:**
```tsx
<MorphingBlob 
  color="#7DB8FF" 
  opacity={0.15} 
  size={300} 
  className="top-10 left-10" 
  duration={10}
/>
```

---

### Ripple
เอฟเฟกต์กระเพื่อมเมื่อคลิก

**Hook:** `useRipple()`
**Component:** `RippleContainer`

**Example:**
```tsx
const { ripples, createRipple } = useRipple();

<div onClick={createRipple} className="relative overflow-hidden">
  <RippleContainer ripples={ripples} color="rgba(255, 181, 217, 0.4)" />
  <YourContent />
</div>
```

---

### CountUpNumber
ตัวเลขที่นับขึ้นแบบ animated

**Props:**
- `value` (number) - ค่าเป้าหมาย
- `duration` (number, default: 2) - ระยะเวลาในการนับ (วินาที)
- `className` (string) - class เพิ่มเติม

**Example:**
```tsx
<CountUpNumber value={87} duration={2.5} className="text-4xl" />
```

---

### ShimmerText
ข้อความที่มีแสงวิ่งผ่าน

**Props:**
- `children` (ReactNode) - เนื้อหา
- `className` (string) - class เพิ่มเติม
- `duration` (number, default: 2) - ระยะเวลาของอนิเมชั่น (วินาที)

**Example:**
```tsx
<ShimmerText className="text-2xl font-bold">
  Premium Feature
</ShimmerText>
```

---

### TiltCard
การ์ดที่เอียงตามการเคลื่อนไหวของเมาส์ (3D effect)

**Props:**
- `children` (ReactNode) - เนื้อหา
- `className` (string) - class เพิ่มเติม
- `tiltDegree` (number, default: 10) - ระดับการเอียง (องศา)

**Example:**
```tsx
<TiltCard className="p-6 bg-white rounded-xl" tiltDegree={15}>
  <YourCardContent />
</TiltCard>
```

---

## 🎯 Best Practices

1. **Performance**: ใช้ `will-change` CSS property สำหรับอนิเมชั่นที่ซับซ้อน
2. **Accessibility**: เพิ่ม `prefers-reduced-motion` media query สำหรับผู้ใช้ที่ต้องการลดการเคลื่อนไหว
3. **Mobile**: ทดสอบอนิเมชั่นบนมือถือเพื่อให้แน่ใจว่าไม่กินแบตเตอรี่มาก
4. **Layering**: ใช้ z-index อย่างเหมาะสมเพื่อไม่ให้อนิเมชั่นบังเนื้อหาสำคัญ

## 📱 Usage in GlowbieBell

- **FaceScanScreen**: FloatingParticles, MorphingBlob
- **SkinAnalysisResult**: Confetti, CountUpNumber, FloatingParticles, MorphingBlob, Ripple
- **SkinHomeDashboard**: FloatingParticles, MorphingBlob, Ripple
- **DrSkinAIChatScreen**: FloatingParticles (send effect)
- **LoginRegisterScreen**: FloatingParticles, MorphingBlob
