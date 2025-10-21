import { createContext, useContext, useState, ReactNode } from "react";

// Supported languages
export type Language = "th" | "en" | "zh";

export interface Translations {
  [key: string]: string | Language;
  language: Language;
}

// Translation data
const translations: Record<Language, Translations> = {
  th: {
    language: "th",
    cancel: "ยกเลิก",
    save: "บันทึก",
    confirm: "ยืนยัน",
    back: "กลับ",
    close: "ปิด",
    continue: "ดำเนินการต่อ",
    done: "เสร็จสิ้น",
    loginTitle: "เข้าสู่ระบบ",
    registerTitle: "สมัครสมาชิก",
    email: "อีเมล",
    password: "รหัสผ่าน",
    confirmPassword: "ยืนยันรหัสผ่าน",
    fullName: "ชื่อ-นามสกุล",
    forgotPassword: "ลืมรหัสผ่าน?",
    login: "เข้าสู่ระบบ",
    register: "สร้างบัญชี",
    startScan: "เริ่มสแกนใบหน้า",
    resultTitle: "ผลการวิเคราะห์ผิว",
    profile: "โปรไฟล์",
    editProfile: "แก้ไขโปรไฟล์",
    settings: "การตั้งค่า",
    premiumMember: "สมาชิกพรีเมียม",
    skinScore: "คะแนนผิว",
    averageScore: "คะแนนเฉลี่ย",
    today: "วันนี้",
    improved: "ดีขึ้น",
    needsImprovement: "ควรปรับปรุง",
    years: "ปี",
    changePhoto: "เปลี่ยนรูปภาพ",
    skinInformation: "ข้อมูลผิวพรรณ",
    saveChanges: "บันทึกการเปลี่ยนแปลง",
    unsavedChanges: "คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก",
    oilControl: "ควบคุมความมัน",
    sensitiveCare: "ดูแลผิวแพ้ง่าย",
    skinHealth: "สุขภาพผิว",
    scanDetails: "รายละเอียดการสแกน",
  },
  en: {
    language: "en",
    cancel: "Cancel",
    save: "Save",
    confirm: "Confirm",
    back: "Back",
    close: "Close",
    continue: "Continue",
    done: "Done",
    loginTitle: "Sign In",
    registerTitle: "Sign Up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    forgotPassword: "Forgot Password?",
    login: "Login",
    register: "Create Account",
    startScan: "Start Face Scan",
    resultTitle: "Skin Analysis Result",
    profile: "Profile",
    editProfile: "Edit Profile",
    settings: "Settings",
    premiumMember: "Premium Member",
    skinScore: "Skin Score",
    averageScore: "Average Score",
    today: "Today",
    improved: "Improved",
    needsImprovement: "Needs Improvement",
    years: "years",
    changePhoto: "Change Photo",
    skinInformation: "Skin Information",
    saveChanges: "Save Changes",
    unsavedChanges: "You have unsaved changes",
    oilControl: "Oil Control",
    sensitiveCare: "Sensitive Care",
    skinHealth: "Skin Health",
    scanDetails: "Scan Details",
  },
  zh: {
    language: "zh",
    cancel: "取消",
    save: "保存",
    confirm: "确认",
    back: "返回",
    close: "关闭",
    continue: "继续",
    done: "完成",
    loginTitle: "登录",
    registerTitle: "注册",
    email: "电子邮件",
    password: "密码",
    confirmPassword: "确认密码",
    fullName: "全名",
    forgotPassword: "忘记密码？",
    login: "登录",
    register: "创建账户",
    startScan: "开始扫描",
    resultTitle: "皮肤分析结果",
    profile: "个人资料",
    editProfile: "编辑资料",
    settings: "设置",
    premiumMember: "高级会员",
    skinScore: "皮肤评分",
    averageScore: "平均分数",
    today: "今天",
    improved: "改善",
    needsImprovement: "需要改善",
    years: "岁",
    changePhoto: "更换照片",
    skinInformation: "肌肤信息",
    saveChanges: "保存更改",
    unsavedChanges: "您有未保存的更改",
    oilControl: "控油",
    sensitiveCare: "敏感护理",
    skinHealth: "皮肤健康",
    scanDetails: "扫描详情",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("th");
  const value = { language, setLanguage, t: translations[language] };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
