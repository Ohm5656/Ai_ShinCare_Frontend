// ===============================
// 🔧 Global Configuration File
// ===============================
// ใช้เก็บค่าคงที่ (constant) ที่ใช้ทั้งโปรเจกต์ เช่น URL ของ backend
// จะอ่านค่าจาก .env (ผ่าน Vite) โดยใช้ prefix: VITE_

export const API_URL =
  import.meta.env.VITE_API_URL || "https://aishincarebackend-production.up.railway.app"; // fallback ถ้าไม่มี env

// ตัวอย่างอื่น (ถ้าอยากขยายภายหลัง)
// export const APP_NAME = "AI Skin Analyzer";
// export const DEFAULT_DETECT_SIZE = 640;



