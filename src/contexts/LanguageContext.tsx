import { createContext, useContext, useState, ReactNode } from "react";

// Supported languages
export type Language = "th" | "en" | "zh";

// แทนที่จะต้อง list ทุก key ทีละตัว
// เราใช้ index signature แทน → ยืดหยุ่น, ไม่ติด type error เวลาเพิ่ม key ใหม่
export interface Translations {
  language: Language;
  [key: string]: string | Language;
}

// ===============================
// 🚩 THAI TRANSLATIONS
// ===============================
const th: Translations = {
  language: "th",

  // Common
  cancel: "ยกเลิก",
  save: "บันทึก",
  confirm: "ยืนยัน",
  back: "กลับ",
  close: "ปิด",
  continue: "ดำเนินการต่อ",
  done: "เสร็จสิ้น",

  // Login/Register
  loginTitle: "เข้าสู่ระบบ",
  registerTitle: "สมัครสมาชิก",
  email: "อีเมล",
  password: "รหัสผ่าน",
  confirmPassword: "ยืนยันรหัสผ่าน",
  fullName: "ชื่อ-นามสกุล",
  forgotPassword: "ลืมรหัสผ่าน?",
  login: "เข้าสู่ระบบ",
  register: "สร้างบัญชี",
  orLoginWith: "หรือเข้าสู่ระบบด้วย",
  signInWithGoogle: "ดำเนินการต่อด้วย Google",
  signInWithApple: "ดำเนินการต่อด้วย Apple",
  alreadyHaveAccount: "มีบัญชีอยู่แล้ว?",
  dontHaveAccount: "ยังไม่มีบัญชี?",
  welcomeBack: "ยินดีต้อนรับกลับมา! ✨",
  createNewAccount: "สร้างบัญชีใหม่ 🌟",
  enterEmail: "กรอกอีเมลของคุณ",
  enterPassword: "กรอกรหัสผ่านของคุณ",
  enterFullName: "กรอกชื่อ-นามสกุลของคุณ",

  // Forgot Password
  forgotPasswordTitle: "ลืมรหัสผ่าน",
  forgotPasswordDescription:
    "กรอกอีเมลที่คุณใช้สมัครสมาชิก เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ",
  resetPassword: "รีเซ็ตรหัสผ่าน",
  backToLogin: "กลับไปหน้าเข้าสู่ระบบ",
  checkYourEmail: "ตรวจสอบอีเมลของคุณ! 📧",
  resetLinkSent:
    "เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ",

  // Home Dashboard
  homeGreeting: "สวัสดี! 👋",
  homeSubtitle: "ผิวของคุณวันนี้เป็นอย่างไรบ้าง? ✨",
  skinScore: "คะแนนผิว",
  skinHealthy: "ผิวของคุณดูสุขภาพดีมาก! 🌟",
  startScan: "📸 เริ่มสแกนใบหน้า",
  quickScan: "แค่ 30 วินาที รู้ผลทันที! ✨",
  userName: "คุณ",
  analysisOverview: "ภาพรวมการวิเคราะห์ผิว",

  // Scan
  scanTitle: "สแกนใบหน้า",
  scanInstruction: "วางใบหน้าให้อยู่ในกรอบ",
  analyzing: "กำลังวิเคราะห์...",
  scanningFace: "กำลังสแกนใบหน้า",
  holdStill: "อยู่นิ่งๆ",
  captureFace: "ถ่ายภาพ",
  retake: "ถ่ายใหม่",
  useScan: "ใช้ภาพนี้",

  // Analysis Result
  resultTitle: "ผลการวิเคราะห์ผิว",
  chatWithAI: "ปรึกษา AI",
  viewHistory: "ดูประวัติ",
  yourAnalysis: "การวิเคราะห์ของคุณ",
  detailedResults: "ผลลัพธ์โดยละเอียด",
  recommendations: "คำแนะนำ",
  overallScore: "คะแนนรวม",

  // Metrics - 7 categories
  wrinkles: "ริ้วรอย",
  sagging: "ความหย่อนคล้อย",
  darkSpots: "ฝ้า กระ จุดด่างดำ",
  acne: "สิว",
  redness: "ผิวแดง",
  pores: "รูขุมขน",
  skinEvenness: "ความสม่ำเสมอของโทนผิว",

  // Status
  excellent: "ดีเยี่ยม",
  good: "ดี",
  normal: "ปกติ",
  fair: "พอใช้",
  needsImprovement: "ควรปรับปรุง",
  veryGood: "ดีมาก!",

  // Profile
  profile: "โปรไฟล์",
  myProfile: "โปรไฟล์ของฉัน",
  editProfile: "แก้ไขโปรไฟล์",
  changePassword: "เปลี่ยนรหัสผ่าน",
  changeLanguage: "เปลี่ยนภาษา",
  logout: "ออกจากระบบ",
  history: "ประวัติการสแกน",
  settings: "จัดการบัญชีและการตั้งค่า",
  personalInfo: "ข้อมูลส่วนตัว",
  actionsAndSettings: "การตั้งค่าและดำเนินการ",
  premiumMember: "สมาชิกพรีเมียม",
  latestAnalysis: "การวิเคราะห์ผิวล่าสุด",
  manageAccount: "จัดการบัญชี",
  appVersion: "AI Skin Analyzer v1.0.0",
  madeWithLove: "สร้างด้วย ❤️ เพื่อผิวสวยของคุณ",

  // Edit Profile
  age: "อายุ",
  gender: "เพศ",
  skinType: "ประเภทผิว",
  skincareGoal: "เป้าหมายการดูแลผิว",
  username: "ชื่อผู้ใช้",
  enterUsername: "กรอกชื่อผู้ใช้",
  usernameHint: "ใช้สำหรับเข้าสู่ระบบแทนอีเมล",
  changePhoto: "เปลี่ยนรูปภาพ",
  removePhoto: "ลบรูปโปรไฟล์",
  male: "ชาย",
  female: "หญิง",
  other: "อื่นๆ",
  preferNotToSay: "ไม่ระบุ",
  normalSkin: "ผิวปกติ",
  drySkin: "ผิวแห้ง",
  oilySkin: "ผิวมัน",
  combinationSkin: "ผิวผสม",
  sensitiveSkin: "ผิวแพ้ง่าย",
  antiAging: "ต้านริ้วรอยและชะลอวัย",
  hydration: "เพิ่มความชุ่มชื้น",
  acneTreatment: "ลดสิวและรอยด่างดำ",
  brightening: "เพิ่มความกระจ่างใส",
  sensitiveCare: "ดูแลผิวแพ้ง่าย",
  oilControl: "ควบคุมความมันและรูขุมขน",
  years: "ปี",
  profileUpdated: "อัปเดตโปรไฟล์สำเร็จ! ✨",

  // Change Password
  changePasswordTitle: "เปลี่ยนรหัสผ่าน",
  currentPassword: "รหัสผ่านปัจจุบัน",
  newPassword: "รหัสผ่านใหม่",
  confirmNewPassword: "ยืนยันรหัสผ่านใหม่",
  passwordChanged: "เปลี่ยนรหัสผ่านสำเร็จ! 🔒",
  passwordRequirements: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",

  // History
  scanHistory: "ประวัติการสแกน",
  recentScans: "การสแกนล่าสุด",
  viewDetails: "ดูรายละเอียด",
  noHistory: "ยังไม่มีประวัติการสแกน",
  startFirstScan: "เริ่มสแกนใบหน้าครั้งแรกของคุณ! ✨",

  // Scan Detail
  scanDetails: "รายละเอียดการสแกน",
  scannedOn: "สแกนเมื่อ",

  // Chat/AI Assistant
  chatTitle: "แชทกับ AI",
  drSkinAI: "Dr. Skin AI",
  askQuestion: "ถามคำถาม",
  typeMessage: "พิมพ์ข้อความ...",
  suggestions: "คำแนะนำ",

  // Bottom Navigation
  navHome: "หน้าแรก",
  navScan: "สแกน",
  navHistory: "ประวัติ",
  navChat: "แชท",
  navProfile: "โปรไฟล์",

  // Language
  languageSelector: "เลือกภาษา",
  selectLanguage: "เลือกภาษาที่คุณต้องการ",
  thai: "ภาษาไทย",
  english: "English",
  chinese: "中文",

  // Messages & Dialogs
  areYouSure: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
  canSignInAnytime: "คุณสามารถเข้าสู่ระบบอีกครั้งได้ตลอดเวลา",
  yesLogout: "ใช่, ออกจากระบบ",
  successTitle: "สำเร็จ!",

  // Errors & Validation
  required: "กรุณากรอกข้อมูล",
  invalidEmail: "อีเมลไม่ถูกต้อง",
  passwordTooShort: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
  passwordsDontMatch: "รหัสผ่านไม่ตรงกัน",

  // Scan Screen
  faceDetected: "ตรวจพบใบหน้าแล้ว ✅",
  lightingGood: "💡 แสงเหมาะสม",
  analyzingYourSkin: "กำลังวิเคราะห์ผิวของคุณ...",

  // Analysis Result Detailed
  backToHome: "← ย้อนกลับ",
  yourSkinAnalysis: "ผลการวิเคราะห์ผิวของคุณ 💆🏻‍♀️",
  skinHealthStatus: "ผิวสุขภาพดี ✨",
  analysisOverviewTitle: "ภาพรวมการวิเคราะห์ผิว",
  skinHealth: "สุขภาพผิว",

  // Profile Screen Detailed
  averageScore: "คะแนนเฉลี่ย",
  mostImproved: "ปรับปรุงมากที่สุด",
  lastScan: "การสแกนล่าสุด",
  today: "วันนี้",
  scansCompleted: "สแกนเสร็จสิ้น",
  totalScans: "การสแกนทั้งหมด",
  latestScore: "คะแนนครั้งล่าสุด",
  skinProgress: "ความก้าวหน้าของผิว",
  improvement: "การปรับปรุง",

  // Chat Screen
  typeYourMessage: "พิมพ์ข้อความของคุณ...",
  quickReplies: "คำตอบด่วน",
  recommendProducts: "แนะนำผลิตภัณฑ์ดูแลผิว",
  causeOfRedness: "สาเหตุของผิวแดง?",
  howToReduceAcne: "ลดสิวอย่างไร?",

  // Metrics Short Names
  wrinklesShort: "ริ้วรอย",
  saggingShort: "หย่อนคล้อย",
  darkSpotsShort: "ฝ้ากระ",
  acneShort: "สิว",
  rednessShort: "ผิวแดง",
  poresShort: "รูขุมขน",
  skinEvennessShort: "โทนสม่ำเสมอ",

  // More detailed status
  healthy: "สุขภาพดี",
  veryHealthy: "สุขภาพดีมาก",
  needsCare: "ต้องดูแล",

  // UI Elements
  viewMode: "โหมดมุมมอง",
  circularView: "แบบวงกลม",
  radarView: "แบบกราฟ",

  // Chat Screen AI Messages
  aiGreeting:
    "สวัสดี! ผมคือ Dr.SkinAI 🌸 จากการสแกนล่าสุดของคุณ ผิวของคุณดูมีความมันเล็กน้อยและมีผิวแดงเล็กน้อย คุณต้องการคำแนะนำการดูแลผิวเฉพาะบุคคลไหม?",
  personalSkincareExpert: "ผู้เชี่ยวชาญดูแลผิวส่วนตัวของคุณ",
  suggestedQuestions: "💡 คำถามแนะนำ",
  aiProductRecommendation:
    "จากผิวผสมที่มีความมันเล็กน้อยของคุณ ผมแนะนำ: 1) คลีนเซอร์อ่อนโยน (เช้า-เย็น) 2) เซรั่มไฮยารูโรนิกเพื่อความชุ่มชื้น 3) ครีมบำรุงเนื้อเบาที่มีไนอาซินาไมด์ 4) ครีมกันแดด SPF 50 ทุกวัน ต้องการคำแนะนำผลิตภัณฑ์เฉพาะเจาะจงไหม? ✨",
  aiRednessExplanation:
    "ผิวแดงอาจเกิดจาก: การอักเสบ ผิวแพ้ง่าย ปัจจัยแวดล้อม หรือโรคผิวหนังโรซาเซีย เพื่อลดความแดง ให้ใช้ผลิตภัณฑ์ที่มีส่วนผสมของเซนเทลลา แอเชียติกา สารสกัดชาเขียว หรือไนอาซินาไมด์ หลีกเลี่ยงการขัดผิวแรงและน้ำร้อน ต้องการคำแนะนำเพิ่มเติมไหม? 🌿",
  aiAcneAdvice:
    "เพื่อลดสิว: 1) ล้างหน้าวันละ 2 ครั้งด้วยซาลิซิลิกแอซิด 2) ใช้เบนโซอิลเพอร์ออกไซด์แต้มจุด 3) ทาเซรั่มไนอาซินาไมด์ 4) อย่าลืมบำรุงผิว 5) เปลี่ยนปลอกหมอนทุกสัปดาห์ หลีกเลี่ยงการแตะหน้า! ต้องการแนะนำผลิตภัณฑ์ไหม? 💊",
  aiGeneralResponse:
    "คำถามดีมากเลย! สำหรับคำแนะนำเฉพาะบุคคลตามผลวิเคราะห์ผิวของคุณ ผมพร้อมช่วยเหลือเลย คุณสามารถถามเกี่ยวกับขั้นตอนการดูแลผิว คำแนะนำผลิตภัณฑ์ หรือปัญหาผิวเฉพาะเจาะจง เช่น ริ้วรอย ฝ้ากระ หรือความชุ่มชื้น คุณอยากรู้อะไร? 😊",

  // Profile Screen Extra
  editPersonalInfo: "แก้ไขข้อมูลส่วนตัว",
  mainSkinConcern: "ปัญหาผิวหลัก",
  dryness: "ผิวแห้ง",
  skinScoreHistory: "ประวัติคะแนนผิว",
  beforeAfterGallery: "แกลเลอรี่ก่อน-หลัง",
  before: "ก่อน",
  after: "หลัง",
  howImproved: "ผิวของคุณดีขึ้นหรือไม่?",
  same: "เหมือนเดิม",
  worse: "แย่ลง",
  achievements: "รางวัลความสำเร็จ 🏆",
  dayStreak: "ตรวจผิวต่อเนื่อง 7 วัน",
  completedDailyChecks: "ตรวจสอบผิวทุกวันสำเร็จ",
  skinScoreMaster: "ผู้เชี่ยวชาญคะแนนผิว",
  reachedScore: "ได้คะแนน 85+ แล้ว",
  earlyAdopter: "ผู้ใช้งานตั้งแต่เริ่มต้น",
  firstMonthCompleted: "ใช้งานครบเดือนแรกแล้ว",

  // Login/Register Additional
  birthday: "วันเกิด",
  selectGender: "เลือกเพศ",
  selectSkinType: "เลือกประเภทผิว",
  selectBirthday: "เลือกวันเกิด",
  agreeToTerms: "ยอมรับข้อกำหนดและเงื่อนไข",
  registerSuccess: "สมัครสมาชิกสำเร็จ! 🎉",
  accountCreated: "สร้างบัญชีสำเร็จแล้ว! ✨",
  nowYouCan: "ตอนนี้คุณสามารถเข้าสู่ระบบและเริ่มสแกนผิวได้แล้ว",
  connecting: "กำลังเชื่อมต่อ",
  comingSoon: "ฟีเจอร์นี้จะพร้อมใช้งานเร็วๆ นี้!",
  checkMissingInfo: "ตรวจสอบข้อมูลที่ขาดหายไป",
  signingIn: "กำลังเข้าสู่ระบบ...",
  namePlaceholder: "สุดา มาลัย",
  appTagline: "สแกนผิวหน้าด้วย AI เพื่อผิวสวยสุขภาพดี 💖",
  latestSkinAnalysis: "การวิเคราะห์ผิวล่าสุด",
  skinLooksGreat:
    "ผิวของคุณดูดีมาก! รักษารูทีนการบำรุงความชุ่มชื้นต่อไปนะ",
  keepRoutine: "รักษารูทีนการบำรุงต่อไป",

  // History Page
  progressHistory: "ประวัติความก้าวหน้า 📊",
  trackYourProgress: "ติดตามการพัฒนาผิวของคุณ ✨",
  thisWeek: "สัปดาห์นี้",
  twoWeeks: "2 สัปดาห์",
  thisMonth: "เดือนนี้",
  overview: "ภาพรวม",
  trend: "แนวโน้ม",
  points: "คะแนน",
  viewAll: "ดูทั้งหมด",
  score: "คะแนน",
  gallery: "แกลเลอรี่ก่อน-หลัง ✨",
  viewAllGallery: "ดูแกลเลอรี่ทั้งหมด 🖼️",
  greatJob: "ทำได้ดีมากเลย",
  youImproved: "คุณพัฒนาคะแนนผิวไปแล้ว",
  improvementThis: "ในเดือนนี้ ✨",
  days7: "7 วัน",
  days15: "15 วัน",
  days30: "30 วัน",
  latestScan: "สแกนล่าสุด",
  mostImprovedMetric: "โทนสีผิว",

  // Edit Profile Page placeholders
  skinInformation: "ข้อมูลผิวพรรณ",
  saveChanges: "บันทึกการเปลี่ยนแปลง",
  unsavedChanges: "💡 คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก",
  enterFullNamePlaceholder: "กรอกชื่อ-นามสกุลของคุณ",
  enterEmailPlaceholder: "กรอกอีเมลของคุณ",
  enterAgePlaceholder: "กรอกอายุของคุณ",
  selectGenderPlaceholder: "เลือกเพศ",
  selectSkinTypePlaceholder: "เลือกประเภทผิว",
  selectGoalPlaceholder: "เลือกเป้าหมายการดูแลผิว",
  personalInformation: "ข้อมูลส่วนตัว",
  enterFullName: "กรอกชื่อ-นามสกุลของคุณ",
  enterEmail: "กรอกอีเมลของคุณ",
  enterAge: "กรอกอายุของคุณ",
  selectSkincareGoal: "เลือกเป้าหมายการดูแลผิว",
  normalSkinLabel: "ผิวปกติ",

  // Scan Detail Page extra
  overallSkinCondition: "สภาพผิวโดยรวม",
  analysisOverviewDetail: "ภาพรวมการวิเคราะห์ผิว",
  detailsByMetric: "รายละเอียดแต่ละด้าน",
  backToHistory: "กลับไปหน้าประวัติ",
  skinVeryHealthy: "ผิวสุขภาพดีมาก",

  // Additional Register Form
  profilePhoto: "รูปโปรไฟล์",
  optional: "ไม่บังคับ",
  clickToUpload: "คลิกเพื่ออัปโหลด",
  maxFileSize: "PNG, JPG (สูงสุด 5MB)",
  creatingAccount: "กำลังสร้างบัญชี...",
  select: "เลือก",

  // Gender & Skin Type Labels (dup-safe)
  maleLabel: "ชาย",
  femaleLabel: "หญิง",
  otherLabel: "อื่นๆ",
  oilySkinLabel: "ผิวมัน",
  drySkinLabel: "ผิวแห้ง",
  combinationSkinLabel: "ผิวผสม",
  sensitiveSkinLabel: "ผิวแพ้ง่าย",

  // Time labels
  yesterday: "เมื่อวาน",

  // Status messages
  steady: "สภาพคงที่",
  betterBy: "ดีขึ้น",
  elasticityImproved: "ความยืดหยุ่นดีขึ้น",
  excellentHydration: "ความชุ่มชื้นดีเยี่ยม",
  goodTexture: "เนื้อผิวดี",
  bestMetric: "ดีที่สุด",

  // Forgot Password extra
  pleaseEnterEmail: "กรุณากรอกอีเมล",
  emailFormatInvalid: "รูปแบบอีเมลไม่ถูกต้อง",
  emailSent: "ส่งอีเมลแล้ว! 📧",
  resetLinkSentTo: "เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปที่",
  checkEmailInstructions:
    "กรุณาตรวจสอบอีเมลของคุณและคลิกลิงก์เพื่อตั้งรหัสผ่านใหม่",
  emailInSpam: "(อีเมลอาจอยู่ในโฟลเดอร์สแปม)",
  sendAgain: "ส่งอีเมลอีกครั้ง",
  rememberedPassword: "นึกรหัสผ่านได้แล้ว?",
  sending: "กำลังส่ง...",
  emailUsedToRegister: "อีเมลที่ใช้สมัครสมาชิก",
  dontWorry: "ไม่ต้องกังวล! เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ",
  sendResetLink: "ส่งลิงก์รีเซ็ตรหัสผ่าน 📨",

  // Date/Time
  am: "น.",
  pm: "น.",
  hour: "ชั่วโมง",

  // Gallery
  improvedBy: "ดีขึ้น",
  improvedByPoints: "ดีขึ้น {points} คะแนน",
  greatJobName: "ทำได้ดีมากเลย คุณ{name}!",
  youImprovedPoints: "คุณพัฒนาคะแนนผิวไปแล้ว",

  // Change Password Page Specific
  keepSafe: "รักษาความปลอดภัย",
  strongPasswordHelpsProtect:
    "รหัสผ่านที่แข็งแรงช่วยปกป้องข้อมูลส่วนตัวและผลการวิเคราะห์ผิวของคุณ",
  pleaseFixErrors: "กรุณาแก้ไขข้อผิดพลาด:",
  enterCurrentPassword: "กรอกรหัสผ่านปัจจุบัน",
  enterNewPassword: "กรอกรหัสผ่านใหม่",
  enterNewPasswordAgain: "กรอกรหัสผ่านใหม่อีกครั้ง",
  passwordMustInclude: "รหัสผ่านต้อง:",
  passwordStrength: "ความแข็งแรงของรหัสผ่าน",
  weak: "อ่อน",
  medium: "ปานกลาง",
  strong: "แข็งแรง",
  atLeast8Characters: "มีอย่างน้อย 8 ตัวอักษร",
  atLeastOneUppercase: "มีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว",
  atLeastOneLowercase: "มีตัวพิมพ์เล็กอย่างน้อย 1 ตัว",
  atLeastOneNumber: "มีตัวเลขอย่างน้อย 1 ตัว",
  saveNewPassword: "บันทึกรหัสผ่านใหม่",
  passwordChangedSuccess: "เปลี่ยนรหัสผ่านสำเร็จ! ✨",
  passwordChangedDescription:
    "รหัสผ่านของคุณถูกเปลี่ยนแล้ว กรุณาใช้รหัสผ่านใหม่ในการเข้าสู่ระบบครั้งถัดไป",
  updateYourPassword: "อัปเดตรหัสผ่านของคุณ",
  passwordMustBeDifferent: "รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านปัจจุบัน",
  pleaseEnterCurrentPassword: "กรุณากรอกรหัสผ่านปัจจุบัน",
  pleaseEnterNewPassword: "กรุณากรอกรหัสผ่านใหม่",

  // Day abbreviations
  dayMon: "จ.",
  dayTue: "อ.",
  dayWed: "พ.",
  dayThu: "พฤ.",
  dayFri: "ศ.",
  daySat: "ส.",
  daySun: "อา.",

  // Skin Analysis Result Specific
  highlights: "จุดเด่น",
  smoothAndHydrated: "ผิวเรียบเนียนและชุ่มชื้นดี",
  mildRednessAndDarkSpots: "ผิวแดงเล็กน้อยและจุดด่างดำ",
  skinConditionDetail: "รายละเอียดสภาพผิว",
  smoothSkin: "ผิวเรียบเนียน",
  goodHydration: "ชุ่มชื้นดี",
  mildRedness: "ผิวแดงเล็กน้อย",
  chatWithDrSkinAI: "รับคำแนะนำจาก Dr.SkinAI 💬",

  // All Scans Page
  allScans: "รายการสแกนทั้งหมด",
  scans: "รายการ",
  avgScore: "คะแนนเฉลี่ย",
  allTime: "ทั้งหมด",
  last3Months: "3 เดือนย้อนหลัง",
  noScansFound: "ไม่พบรายการสแกน",
  keepTracking: "ติดตามต่อไป",

  // App Tutorial
  tutorialTitle: "คู่มือการใช้งาน GlowbieBell ✨",
  tutorialWelcome: "ยินดีต้อนรับสู่ GlowbieBell! 🌸",
  tutorialGetStarted: "มาเริ่มต้นกันเลย",
  tutorialStep1Title: "หน้าแรก - แดชบอร์ด 🏠",
  tutorialStep1Desc:
    "ดูคะแนนผิวและภาพรวมสุขภาพผิวของคุณ ตรวจสอบสถิติและแนวโน้มการพัฒนาผิวได้ที่นี่",
  tutorialStep2Title: "สแกนใบหน้า 📸",
  tutorialStep2Desc:
    "สแกนใบหน้า 3 มุม (หน้า → ซ้าย → ขวา) ระบบจะวิเคราะห์อัตโนมัติเมื่อครบ 3 มุม ใช้เวลาเพียง 30 วินาที!",
  tutorialStep3Title: "ผลการวิเคราะห์ 📊",
  tutorialStep3Desc:
    "ดูคะแนนผิวและรายละเอียดการวิเคราะห์ใน 7 ด้าน: ริ้วรอย ความหย่อนคล้อย ฝ้ากระ สิว ผิวแดง รูขุมขน และความสม่ำเสมอของโทนผิว",
  tutorialStep4Title: "แชทกับ AI 💬",
  tutorialStep4Desc:
    "ปรึกษา Dr.SkinAI ผู้เชี่ยวชาญดูแลผิวส่วนตัว รับคำแนะนำผลิตภัณฑ์และวิธีดูแลผิวเฉพาะบุคคล",
  tutorialStep5Title: "ประวัติและกราฟ 📈",
  tutorialStep5Desc:
    "ติดตามความก้าวหน้าของผิว ดูกราฟแนวโน้มคะแนนผิว และเปรียบเทียบผลการสแกนย้อนหลัง",
  tutorialStep6Title: "โปรไฟล์ 👤",
  tutorialStep6Desc:
    "จัดการข้อมูลส่วนตัว เปลี่ยนรหัสผ่าน เลือกภาษา และดูคะแนนผิวล่าสุดของคุณ",
  tutorialNext: "ถัดไป",
  tutorialPrevious: "ก่อนหน้า",
  tutorialSkip: "ข้าม",
  tutorialFinish: "เริ่มใช้งาน! 🎉",
  tutorialViewGuide: "ดูคู่มือการใช้งาน 📖",
  tutorialHowToUse: "วิธีใช้งานแอป",
};

// ===============================
// 🌍 ENGLISH TRANSLATIONS
// ===============================
const en: Translations = {
  language: "en",

  // Common
  cancel: "Cancel",
  save: "Save",
  confirm: "Confirm",
  back: "Back",
  close: "Close",
  continue: "Continue",
  done: "Done",

  // Login/Register
  loginTitle: "Sign In",
  registerTitle: "Sign Up",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm Password",
  fullName: "Full Name",
  forgotPassword: "Forgot Password?",
  login: "Sign In",
  register: "Create Account",
  orLoginWith: "Or sign in with",
  signInWithGoogle: "Continue with Google",
  signInWithApple: "Continue with Apple",
  alreadyHaveAccount: "Already have an account?",
  dontHaveAccount: "Don't have an account?",
  welcomeBack: "Welcome Back! ✨",
  createNewAccount: "Create New Account 🌟",
  enterEmail: "Enter your email",
  enterPassword: "Enter your password",
  enterFullName: "Enter your full name",

  // Forgot Password
  forgotPasswordTitle: "Forgot Password",
  forgotPasswordDescription:
    "Enter your email address and we will send you a password reset link",
  resetPassword: "Reset Password",
  backToLogin: "Back to Sign In",
  checkYourEmail: "Check Your Email! 📧",
  resetLinkSent:
    "We have sent a password reset link to your email. Please check your inbox.",

  // Home Dashboard
  homeGreeting: "Hello! 👋",
  homeSubtitle: "How is your skin today? ✨",
  skinScore: "Skin Score",
  skinHealthy: "Your skin looks very healthy! 🌟",
  startScan: "📸 Start Face Scan",
  quickScan: "Just 30 seconds, instant results! ✨",
  userName: "Hi",
  analysisOverview: "Analysis Overview",

  // Scan
  scanTitle: "Face Scan",
  scanInstruction: "Position your face in the frame",
  analyzing: "Analyzing...",
  scanningFace: "Scanning Face",
  holdStill: "Hold Still",
  captureFace: "Capture",
  retake: "Retake",
  useScan: "Use This",

  // Analysis Result
  resultTitle: "Skin Analysis Result",
  chatWithAI: "Consult AI",
  viewHistory: "View History",
  yourAnalysis: "Your Analysis",
  detailedResults: "Detailed Results",
  recommendations: "Recommendations",
  overallScore: "Overall Score",

  // Metrics - 7 categories
  wrinkles: "Wrinkles",
  sagging: "Sagging",
  darkSpots: "Dark Spots",
  acne: "Acne",
  redness: "Redness",
  pores: "Pores",
  skinEvenness: "Skin Evenness",

  // Status
  excellent: "Excellent",
  good: "Good",
  normal: "Normal",
  fair: "Fair",
  needsImprovement: "Needs Improvement",
  veryGood: "Very Good!",

  // Profile
  profile: "Profile",
  myProfile: "My Profile",
  editProfile: "Edit Profile",
  changePassword: "Change Password",
  changeLanguage: "Change Language",
  logout: "Logout",
  history: "Scan History",
  settings: "Manage Account & Settings",
  personalInfo: "Personal Information",
  actionsAndSettings: "Settings & Actions",
  premiumMember: "Premium Member",
  latestAnalysis: "Latest Skin Analysis",
  manageAccount: "Manage Account",
  appVersion: "AI Skin Analyzer v1.0.0",
  madeWithLove: "Made with ❤️ for your beautiful skin",

  // Edit Profile
  age: "Age",
  gender: "Gender",
  skinType: "Skin Type",
  skincareGoal: "Skincare Goal",
  username: "Username",
  enterUsername: "Enter username",
  usernameHint: "Use this to login instead of email",
  changePhoto: "Change Photo",
  removePhoto: "Remove Photo",
  male: "Male",
  female: "Female",
  other: "Other",
  preferNotToSay: "Prefer not to say",
  normalSkin: "Normal",
  drySkin: "Dry",
  oilySkin: "Oily",
  combinationSkin: "Combination",
  sensitiveSkin: "Sensitive",
  antiAging: "Anti-Aging",
  hydration: "Hydration",
  acneTreatment: "Acne Treatment",
  brightening: "Brightening",
  sensitiveCare: "Sensitive Care",
  oilControl: "Oil Control",
  years: "years old",
  profileUpdated: "Profile updated successfully! ✨",

  // Change Password
  changePasswordTitle: "Change Password",
  currentPassword: "Current Password",
  newPassword: "New Password",
  confirmNewPassword: "Confirm New Password",
  passwordChanged: "Password changed successfully! 🔒",
  passwordRequirements: "Password must be at least 8 characters",

  // History
  scanHistory: "Scan History",
  recentScans: "Recent Scans",
  viewDetails: "View Details",
  noHistory: "No scan history yet",
  startFirstScan: "Start your first face scan! ✨",

  // Scan Detail
  scanDetails: "Scan Details",
  scannedOn: "Scanned on",

  // Chat/AI Assistant
  chatTitle: "Chat with AI",
  drSkinAI: "Dr. Skin AI",
  askQuestion: "Ask a Question",
  typeMessage: "Type a message...",
  suggestions: "Suggestions",

  // Bottom Navigation
  navHome: "Home",
  navScan: "Scan",
  navHistory: "History",
  navChat: "Chat",
  navProfile: "Profile",

  // Language
  languageSelector: "Select Language",
  selectLanguage: "Choose your preferred language",
  thai: "ภาษาไทย",
  english: "English",
  chinese: "中文",

  // Messages & Dialogs
  areYouSure: "Are you sure you want to logout?",
  canSignInAnytime: "You can sign in again anytime",
  yesLogout: "Yes, logout",
  successTitle: "Success!",

  // Errors & Validation
  required: "Required",
  invalidEmail: "Invalid email",
  passwordTooShort: "Password must be at least 8 characters",
  passwordsDontMatch: "Passwords don't match",

  // Scan Screen
  faceDetected: "Face Detected ✅",
  lightingGood: "💡 Good Lighting",
  analyzingYourSkin: "Analyzing your skin...",

  // Analysis Result Detailed
  backToHome: "← Back",
  yourSkinAnalysis: "Your Skin Analysis 💆🏻‍♀️",
  skinHealthStatus: "Healthy Skin ✨",
  analysisOverviewTitle: "Analysis Overview",
  skinHealth: "Skin Health",

  // Profile Screen Detailed
  averageScore: "Average Score",
  mostImproved: "Most Improved",
  lastScan: "Last Scan",
  today: "Today",
  scansCompleted: "Scans Completed",
  totalScans: "Total Scans",
  latestScore: "Latest Score",
  skinProgress: "Skin Progress",
  improvement: "Improvement",

  // Chat Screen
  typeYourMessage: "Type your message...",
  quickReplies: "Quick Replies",
  recommendProducts: "Recommend skincare products",
  causeOfRedness: "Cause of redness?",
  howToReduceAcne: "How to reduce acne?",

  // Metrics Short Names
  wrinklesShort: "Wrinkles",
  saggingShort: "Sagging",
  darkSpotsShort: "Dark Spots",
  acneShort: "Acne",
  rednessShort: "Redness",
  poresShort: "Pores",
  skinEvennessShort: "Evenness",

  // More detailed status
  healthy: "Healthy",
  veryHealthy: "Very Healthy",
  needsCare: "Needs Care",

  // UI Elements
  viewMode: "View Mode",
  circularView: "Circular",
  radarView: "Radar",

  // Chat Screen AI Messages
  aiGreeting:
    "Hello! I'm Dr.SkinAI 🌸 Based on your latest scan, your skin shows slight oiliness and a bit of redness. Would you like personalized skincare recommendations?",
  personalSkincareExpert: "Your personal skincare expert",
  suggestedQuestions: "💡 Suggested questions",
  aiProductRecommendation:
    "For your combination skin with slight oiliness, I recommend: 1) Gentle cleanser (morning & evening) 2) Hyaluronic acid serum for hydration 3) Lightweight moisturizer with niacinamide 4) SPF 50 sunscreen daily. Would you like specific product recommendations? ✨",
  aiRednessExplanation:
    "Redness can be caused by: inflammation, sensitive skin, environmental factors, or rosacea. To reduce redness, use products with centella asiatica, green tea extract, or niacinamide. Avoid harsh scrubbing and hot water. Would you like more advice? 🌿",
  aiAcneAdvice:
    "To reduce acne: 1) Cleanse twice daily with salicylic acid 2) Apply benzoyl peroxide spot treatment 3) Use niacinamide serum 4) Don't forget to moisturize 5) Change pillowcase weekly. Avoid touching your face! Need product recommendations? 💊",
  aiGeneralResponse:
    "Great question! Based on your skin analysis, I'm here to help. You can ask about skincare routines, product recommendations, or specific concerns like wrinkles, dark spots, or hydration. What would you like to know? 😊",

  // Profile Screen Extra
  editPersonalInfo: "Edit Personal Information",
  mainSkinConcern: "Main Skin Concern",
  dryness: "Dryness",
  skinScoreHistory: "Skin Score History",
  beforeAfterGallery: "Before & After Gallery",
  before: "Before",
  after: "After",
  howImproved: "How has your skin improved?",
  improved: "Improved",
  same: "Same",
  worse: "Worse",
  achievements: "Achievements 🏆",
  dayStreak: "7-Day Streak",
  completedDailyChecks: "Completed daily skin checks",
  skinScoreMaster: "Skin Score Master",
  reachedScore: "Reached 85+ score",
  earlyAdopter: "Early Adopter",
  firstMonthCompleted: "First month completed",

  // Login/Register Additional
  birthday: "Birthday",
  selectGender: "Select gender",
  selectSkinType: "Select skin type",
  selectBirthday: "Select birthday",
  agreeToTerms: "Agree to terms and conditions",
  registerSuccess: "Registration successful! 🎉",
  accountCreated: "Account created successfully! ✨",
  nowYouCan: "You can now sign in and start scanning your skin",
  connecting: "Connecting",
  comingSoon: "This feature is coming soon!",
  checkMissingInfo: "Check missing information",
  signingIn: "Signing in...",
  namePlaceholder: "Suda Malai",
  appTagline: "AI-powered skin analysis for healthy, beautiful skin 💖",
  latestSkinAnalysis: "Latest Skin Analysis",
  skinLooksGreat: "Your skin looks great! Keep up with your hydration routine",
  keepRoutine: "Keep up the routine",

  // History Page
  progressHistory: "Progress History 📊",
  trackYourProgress: "Track your skin development ✨",
  thisWeek: "This week",
  twoWeeks: "2 weeks",
  thisMonth: "This month",
  overview: "Overview",
  trend: "Trend",
  points: "points",
  viewAll: "View all",
  score: "Score",
  gallery: "Before & After Gallery ✨",
  viewAllGallery: "View All Gallery 🖼️",
  greatJob: "Great job",
  youImproved: "You improved your skin score by",
  improvementThis: "this month ✨",
  days7: "7 days",
  days15: "15 days",
  days30: "30 days",
  latestScan: "Latest scan",
  mostImprovedMetric: "Skin Tone",

  // Edit Profile Page placeholders
  skinInformation: "Skin Information",
  saveChanges: "Save Changes",
  unsavedChanges: "💡 You have unsaved changes",
  enterFullNamePlaceholder: "Enter your full name",
  enterEmailPlaceholder: "Enter your email",
  enterAgePlaceholder: "Enter your age",
  selectGenderPlaceholder: "Select gender",
  selectSkinTypePlaceholder: "Select skin type",
  selectGoalPlaceholder: "Select skincare goal",
  personalInformation: "Personal Information",
  enterFullName: "Enter your full name",
  enterEmail: "Enter your email",
  enterAge: "Enter your age",
  selectSkincareGoal: "Select skincare goal",
  normalSkinLabel: "Normal",
  oilControl: "Oil Control & Pore Care",

  // Scan Detail Page
  overallSkinCondition: "Overall Skin Condition",
  analysisOverviewDetail: "Analysis Overview",
  detailsByMetric: "Details by Metric",
  backToHistory: "Back to History",
  skinVeryHealthy: "Very Healthy Skin",

  // Additional Register Form
  profilePhoto: "Profile Photo",
  optional: "Optional",
  clickToUpload: "Click to upload",
  maxFileSize: "PNG, JPG (max 5MB)",
  creatingAccount: "Creating account...",
  select: "Select",

  // Gender & Skin Type Labels
  maleLabel: "Male",
  femaleLabel: "Female",
  otherLabel: "Other",
  oilySkinLabel: "Oily",
  drySkinLabel: "Dry",
  combinationSkinLabel: "Combination",
  sensitiveSkinLabel: "Sensitive",

  // Time labels
  yesterday: "Yesterday",

  // Status messages
  steady: "Steady",
  betterBy: "Better by",
  elasticityImproved: "Elasticity improved",
  excellentHydration: "Excellent hydration",
  goodTexture: "Good texture",
  bestMetric: "Best",

  // Forgot Password extra
  pleaseEnterEmail: "Please enter email",
  emailFormatInvalid: "Invalid email format",
  emailSent: "Email Sent! 📧",
  resetLinkSentTo: "We have sent a password reset link to",
  checkEmailInstructions:
    "Please check your email and click the link to set a new password",
  emailInSpam: "(Email may be in spam folder)",
  sendAgain: "Send again",
  rememberedPassword: "Remembered your password?",
  sending: "Sending...",
  emailUsedToRegister: "Email used to register",
  dontWorry: "Don't worry! We'll send you a password reset link",
  sendResetLink: "Send Reset Link 📨",

  // Date/Time
  am: "AM",
  pm: "PM",
  hour: "hr",

  // Gallery
  improvedBy: "Improved by",
  improvedByPoints: "Improved by {points} points",
  greatJobName: "Great job, {name}!",
  youImprovedPoints: "You improved your skin score by",

  // Change Password Page Specific
  keepSafe: "Keep Safe",
  strongPasswordHelpsProtect:
    "A strong password helps protect your personal data and skin analysis results",
  pleaseFixErrors: "Please fix the following errors:",
  enterCurrentPassword: "Enter current password",
  enterNewPassword: "Enter new password",
  enterNewPasswordAgain: "Enter new password again",
  passwordMustInclude: "Password must include:",
  passwordStrength: "Password strength",
  weak: "Weak",
  medium: "Medium",
  strong: "Strong",
  atLeast8Characters: "At least 8 characters",
  atLeastOneUppercase: "At least 1 uppercase letter",
  atLeastOneLowercase: "At least 1 lowercase letter",
  atLeastOneNumber: "At least 1 number",
  saveNewPassword: "Save New Password",
  passwordChangedSuccess: "Password Changed Successfully! ✨",
  passwordChangedDescription:
    "Your password has been changed. Please use your new password for your next login",
  updateYourPassword: "Update your password",
  passwordMustBeDifferent:
    "New password must be different from current password",
  pleaseEnterCurrentPassword: "Please enter current password",
  pleaseEnterNewPassword: "Please enter new password",

  // Day abbreviations
  dayMon: "Mon",
  dayTue: "Tue",
  dayWed: "Wed",
  dayThu: "Thu",
  dayFri: "Fri",
  daySat: "Sat",
  daySun: "Sun",

  // Skin Analysis Result Specific
  highlights: "Highlights",
  smoothAndHydrated: "Smooth and well-hydrated skin",
  mildRednessAndDarkSpots: "Mild redness and dark spots",
  skinConditionDetail: "Skin Condition Details",
  smoothSkin: "Smooth skin",
  goodHydration: "Good hydration",
  mildRedness: "Mild redness",
  chatWithDrSkinAI: "Get Advice from Dr.SkinAI 💬",

  // All Scans Page
  allScans: "All Scans",
  scans: "scans",
  avgScore: "Avg Score",
  allTime: "All Time",
  last3Months: "Last 3 Months",
  noScansFound: "No scans found",
  keepTracking: "Keep Tracking",

  // App Tutorial
  tutorialTitle: "GlowbieBell Guide ✨",
  tutorialWelcome: "Welcome to GlowbieBell! 🌸",
  tutorialGetStarted: "Let's Get Started",
  tutorialStep1Title: "Home Dashboard 🏠",
  tutorialStep1Desc:
    "View your skin score and overall skin health. Check your stats and skin improvement trends right here.",
  tutorialStep2Title: "Face Scan 📸",
  tutorialStep2Desc:
    "Scan your face from 3 angles (Front → Left → Right). The system analyzes automatically when all 3 angles are captured. Takes only 30 seconds!",
  tutorialStep3Title: "Analysis Results 📊",
  tutorialStep3Desc:
    "View your skin score and detailed analysis across 7 metrics: Wrinkles, Sagging, Dark Spots, Acne, Redness, Pores, and Skin Evenness.",
  tutorialStep4Title: "Chat with AI 💬",
  tutorialStep4Desc:
    "Consult Dr.SkinAI, your personal skincare expert. Get personalized product recommendations and skincare advice.",
  tutorialStep5Title: "History & Graphs 📈",
  tutorialStep5Desc:
    "Track your skin progress, view trend charts of your skin scores, and compare past scan results.",
  tutorialStep6Title: "Profile 👤",
  tutorialStep6Desc:
    "Manage your personal information, change password, select language, and view your latest skin score.",
  tutorialNext: "Next",
  tutorialPrevious: "Previous",
  tutorialSkip: "Skip",
  tutorialFinish: "Get Started! 🎉",
  tutorialViewGuide: "View User Guide 📖",
  tutorialHowToUse: "How to Use",
};

// ===============================
// 🇨🇳 CHINESE TRANSLATIONS
// ===============================
const zh: Translations = {
  language: "zh",

  // Common
  cancel: "取消",
  save: "保存",
  confirm: "确认",
  back: "返回",
  close: "关闭",
  continue: "继续",
  done: "完成",

  // Login/Register
  loginTitle: "登录",
  registerTitle: "注册",
  email: "电子邮件",
  password: "密码",
  confirmPassword: "确认密码",
  fullName: "全名",
  forgotPassword: "忘记密码？",
  login: "登录",
  register: "创建账户",
  orLoginWith: "或使用以下方式登录",
  signInWithGoogle: "使用 Google 继续",
  signInWithApple: "使用 Apple 继续",
  alreadyHaveAccount: "已有账户？",
  dontHaveAccount: "还没有账户？",
  welcomeBack: "欢迎回来！✨",
  createNewAccount: "创建新账户 🌟",
  enterEmail: "输入您的电子邮件",
  enterPassword: "输入您的密码",
  enterFullName: "输入您的全名",

  // Forgot Password
  forgotPasswordTitle: "忘记密码",
  forgotPasswordDescription:
    "输入您的电子邮件地址，我们将向您发送密码重置链接",
  resetPassword: "重置密码",
  backToLogin: "返回登录",
  checkYourEmail: "检查您的电子邮件！📧",
  resetLinkSent: "我们已向您的电子邮件发送了密码重置链接。请检查您的收件箱。",

  // Home Dashboard
  homeGreeting: "你好！👋",
  homeSubtitle: "今天你的皮肤怎么样？✨",
  skinScore: "皮肤评分",
  skinHealthy: "你的皮肤看起来很健康！🌟",
  startScan: "📸 开始面部扫描",
  quickScan: "只需30秒，立即查看结果！✨",
  userName: "您好",
  analysisOverview: "分析概览",

  // Scan
  scanTitle: "面部扫描",
  scanInstruction: "将面部放在框架中",
  analyzing: "分析中...",
  scanningFace: "正在扫描面部",
  holdStill: "保持静止",
  captureFace: "拍摄",
  retake: "重新拍摄",
  useScan: "使用此照片",

  // Analysis Result
  resultTitle: "皮肤分析结果",
  chatWithAI: "咨询AI",
  viewHistory: "查看历史",
  yourAnalysis: "您的分析",
  detailedResults: "详细结果",
  recommendations: "建议",
  overallScore: "总分",

  // Metrics - 7 categories
  wrinkles: "皱纹",
  sagging: "松弛下垂",
  darkSpots: "色斑 黑斑",
  acne: "痘痘",
  redness: "泛红",
  pores: "毛孔",
  skinEvenness: "肤色均匀度",

  // Status
  excellent: "优秀",
  good: "良好",
  normal: "正常",
  fair: "一般",
  needsImprovement: "需要改善",
  veryGood: "非常好！",

  // Profile
  profile: "个人资料",
  myProfile: "我的个人资料",
  editProfile: "编辑资料",
  changePassword: "更改密码",
  changeLanguage: "更改语言",
  logout: "登出",
  history: "扫描历史",
  settings: "管理账户和设置",
  personalInfo: "个人信息",
  actionsAndSettings: "设置和操作",
  premiumMember: "高级会员",
  latestAnalysis: "最新皮肤分析",
  manageAccount: "管理账户",
  appVersion: "AI 皮肤分析仪 v1.0.0",
  madeWithLove: "用 ❤️ 为您的美丽肌肤打造",

  // Edit Profile
  age: "年龄",
  gender: "性别",
  skinType: "肤质",
  skincareGoal: "护肤目标",
  username: "用户名",
  enterUsername: "输入用户名",
  usernameHint: "可用此代替电子邮件登录",
  changePhoto: "更换照片",
  removePhoto: "删除照片",
  male: "男",
  female: "女",
  other: "其他",
  preferNotToSay: "不愿透露",
  normalSkin: "正常",
  drySkin: "干性",
  oilySkin: "油性",
  combinationSkin: "混合性",
  sensitiveSkin: "敏感性",
  antiAging: "抗衰老",
  hydration: "保湿",
  acneTreatment: "痘痘治疗",
  brightening: "美白",
  sensitiveCare: "敏感护理",
  oilControl: "控油",
  years: "岁",
  profileUpdated: "个人资料更新成功！✨",

  // Change Password
  changePasswordTitle: "更改密码",
  currentPassword: "当前密码",
  newPassword: "新密码",
  confirmNewPassword: "确认新密码",
  passwordChanged: "密码更改成功！🔒",
  passwordRequirements: "密码必须至少8个字符",

  // History
  scanHistory: "扫描历史",
  recentScans: "最近的扫描",
  viewDetails: "查看详情",
  noHistory: "还没有扫描历史",
  startFirstScan: "开始您的第一次面部扫描！✨",

  // Scan Detail
  scanDetails: "扫描详情",
  scannedOn: "扫描于",

  // Chat/AI Assistant
  chatTitle: "与AI聊天",
  drSkinAI: "Dr. Skin AI",
  askQuestion: "提问",
  typeMessage: "输入消息...",
  suggestions: "建议",

  // Bottom Navigation
  navHome: "首页",
  navScan: "扫描",
  navHistory: "历史",
  navChat: "聊天",
  navProfile: "个人资料",

  // Language
  languageSelector: "选择语言",
  selectLanguage: "选择您偏好的语言",
  thai: "ภาษาไทย",
  english: "English",
  chinese: "中文",

  // Messages & Dialogs
  areYouSure: "您确定要登出吗？",
  canSignInAnytime: "您可以随时再次登录",
  yesLogout: "是的，登出",
  successTitle: "成功！",

  // Errors & Validation
  required: "必填",
  invalidEmail: "无效的电子邮件",
  passwordTooShort: "密码必须至少8个字符",
  passwordsDontMatch: "密码不匹配",

  // Scan Screen
  faceDetected: "检测到面部 ✅",
  lightingGood: "💡 光线良好",
  analyzingYourSkin: "正在分析您的皮肤...",

  // Analysis Result Detailed
  backToHome: "← 返回",
  yourSkinAnalysis: "您的皮肤分析 💆🏻‍♀️",
  skinHealthStatus: "皮肤健康 ✨",
  analysisOverviewTitle: "分析概览",
  skinHealth: "皮肤健康",

  // Profile Screen Detailed
  averageScore: "平均分数",
  mostImproved: "改善最多",
  lastScan: "上次扫描",
  today: "今天",
  scansCompleted: "已完成扫描",
  totalScans: "总扫描次数",
  latestScore: "最新分数",
  skinProgress: "皮肤进步",
  improvement: "改善",

  // Chat Screen
  typeYourMessage: "输入您的消息...",
  quickReplies: "快速回复",
  recommendProducts: "推荐护肤产品",
  causeOfRedness: "发红的原因？",
  howToReduceAcne: "如何减少痘痘？",

  // Metrics Short Names
  wrinklesShort: "皱纹",
  saggingShort: "松弛",
  darkSpotsShort: "色斑",
  acneShort: "痘痘",
  rednessShort: "泛红",
  poresShort: "毛孔",
  skinEvennessShort: "均匀度",

  // More detailed status
  healthy: "健康",
  veryHealthy: "非常健康",
  needsCare: "需要护理",

  // UI Elements
  viewMode: "查看模式",
  circularView: "圆形",
  radarView: "雷达图",

  // Chat Screen AI Messages
  aiGreeting:
    "你好！我是 Dr.SkinAI 🌸 根据您最近的扫描，您的皮肤有轻微的油性和一点红肿。您需要个性化的护肤建议吗？",
  personalSkincareExpert: "您的私人护肤专家",
  suggestedQuestions: "💡 建议问题",
  aiProductRecommendation:
    "对于您轻微油性的混合性皮肤，我推荐：1) 温和洁面乳（早晚）2) 玻尿酸精华液补水 3) 含烟酰胺的轻盈保湿霜 4) 每天使用 SPF 50 防晒霜。需要具体的产品推荐吗？✨",
  aiRednessExplanation:
    "红肿可能由以下原因引起：炎症、敏感肌肤、环境因素或酒糟鼻。要减少红肿，请使用含有积雪草、绿茶提取物或烟酰胺的产品。避免用力擦洗和热水。需要更多建议吗？🌿",
  aiAcneAdvice:
    "减少痘痘的方法：1) 每天用水杨酸洗脸两次 2) 使用过氧化苯甲酰点涂 3) 使用烟酰胺精华液 4) 别忘了保湿 5) 每周更换枕套。避免触摸脸部！需要产品推荐吗？💊",
  aiGeneralResponse:
    "好问题！根据您的皮肤分析，我很乐意帮助您。您可以询问护肤程序、产品推荐或特定问题，如皱纹、色斑或保湿。您想了解什么？😊",

  // Profile Screen
  editPersonalInfo: "编辑个人信息",
  mainSkinConcern: "主要皮肤问题",
  darkSpots: "色斑",
  dryness: "干燥",
  skinScoreHistory: "皮肤评分历史",
  beforeAfterGallery: "前后对比相册",
  before: "前",
  after: "后",
  howImproved: "您的皮肤改善了吗？",
  improved: "改善了",
  same: "一样",
  worse: "变差了",
  achievements: "成就 🏆",
  dayStreak: "连续7天",
  completedDailyChecks: "完成每日皮肤检查",
  skinScoreMaster: "皮肤评分大师",
  reachedScore: "达到 85+ 分",
  earlyAdopter: "早期采用者",
  firstMonthCompleted: "完成第一个月",

  // Login/Register Additional
  birthday: "生日",
  selectGender: "选择性别",
  selectSkinType: "选择肤质",
  selectBirthday: "选择生日",
  agreeToTerms: "同意条款和条件",
  registerSuccess: "注册成功！🎉",
  accountCreated: "账户创建成功！✨",
  nowYouCan: "您现在可以登录并开始扫描您的皮肤",
  connecting: "连接中",
  comingSoon: "此功能即将推出！",
  checkMissingInfo: "检查缺失的信息",
  signingIn: "登录中...",
  namePlaceholder: "Suda Malai",
  appTagline: "AI 皮肤分析，助您拥有健康美丽的肌肤 💖",
  latestSkinAnalysis: "最新皮肤分析",
  skinLooksGreat: "您的皮肤看起来很棒！继续保持保湿护理",
  keepRoutine: "继续保持护理",

  // History Page
  progressHistory: "进步历史 📊",
  trackYourProgress: "跟踪您的皮肤发展 ✨",
  thisWeek: "本周",
  twoWeeks: "2周",
  thisMonth: "本月",
  overview: "概览",
  trend: "趋势",
  points: "分",
  viewAll: "查看全部",
  score: "分数",
  gallery: "前后对比相册 ✨",
  viewAllGallery: "查看所有相册 🖼️",
  greatJob: "做得好",
  youImproved: "您的皮肤评分提高了",
  improvementThis: "本月 ✨",
  days7: "7天",
  days15: "15天",
  days30: "30天",
  latestScan: "最新扫描",
  mostImprovedMetric: "肤色",

  // Edit Profile Page
  skinInformation: "肌肤信息",
  saveChanges: "保存更改",
  unsavedChanges: "💡 您有未保存的更改",
  enterFullNamePlaceholder: "输入您的全名",
  enterEmailPlaceholder: "输入您的电子邮件",
  enterAgePlaceholder: "输入您的年龄",
  selectGenderPlaceholder: "选择性别",
  selectSkinTypePlaceholder: "选择肤质",
  selectGoalPlaceholder: "选择护肤目标",
  personalInformation: "个人信息",
  enterFullName: "输入您的全名",
  enterEmail: "输入您的电子邮箱",
  enterAge: "输入您的年龄",
  selectSkincareGoal: "选择护肤目标",
  normalSkinLabel: "正常",

  // Scan Detail Page
  overallSkinCondition: "整体皮肤状况",
  analysisOverviewDetail: "分析概览",
  detailsByMetric: "详细指标",
  backToHistory: "返回历史",
  skinVeryHealthy: "非常健康的皮肤",

  // Additional Register Form
  profilePhoto: "个人照片",
  optional: "可选",
  clickToUpload: "点击上传",
  maxFileSize: "PNG, JPG (最大5MB)",
  creatingAccount: "创建账户中...",
  select: "选择",

  // Gender & Skin Type Labels
  maleLabel: "男",
  femaleLabel: "女",
  otherLabel: "其他",
  oilySkinLabel: "油性",
  drySkinLabel: "干性",
  combinationSkinLabel: "混合性",
  sensitiveSkinLabel: "敏感性",

  // Time labels
  yesterday: "昨天",

  // Status messages
  steady: "稳定",
  betterBy: "改善了",
  elasticityImproved: "弹性改善",
  excellentHydration: "水分充足",
  goodTexture: "质地良好",
  bestMetric: "最佳",

  // Forgot Password additional
  pleaseEnterEmail: "请输入电子邮件",
  emailFormatInvalid: "电子邮件格式无效",
  emailSent: "邮件已发送！📧",
  resetLinkSentTo: "我们已将密码重置链接发送至",
  checkEmailInstructions: "请检查您的电子邮件并单击链接以设置新密码",
  emailInSpam: "(电子邮件可能在垃圾邮件文件夹中)",
  sendAgain: "再次发送",
  rememberedPassword: "想起密码了吗？",
  sending: "发送中...",
  emailUsedToRegister: "注册时使用的电子邮件",
  dontWorry: "别担心！我们会向您发送密码重置链接",
  sendResetLink: "发送重置链接 📨",

  // Date/Time
  am: "时",
  pm: "时",
  hour: "小时",

  // Gallery
  improvedBy: "提高了",
  improvedByPoints: "提高了 {points} 分",
  greatJobName: "做得好，{name}！",
  youImprovedPoints: "您的皮肤评分提高了",

  // Change Password Page Specific
  keepSafe: "保持安全",
  strongPasswordHelpsProtect:
    "强密码有助于保护您的个人数据和皮肤分析结果",
  pleaseFixErrors: "请修复以下错误：",
  enterCurrentPassword: "输入当前密码",
  enterNewPassword: "输入新密码",
  enterNewPasswordAgain: "再次输入新密码",
  passwordMustInclude: "密码必须包括：",
  passwordStrength: "密码强度",
  weak: "弱",
  medium: "中等",
  strong: "强",
  atLeast8Characters: "至少8个字符",
  atLeastOneUppercase: "至少1个大写字母",
  atLeastOneLowercase: "至少1个小写字母",
  atLeastOneNumber: "至少1个数字",
  saveNewPassword: "保存新密码",
  passwordChangedSuccess: "密码更改成功！✨",
  passwordChangedDescription: "您的密码已更改。请在下次登录时使用新密码",
  updateYourPassword: "更新您的密码",
  passwordMustBeDifferent: "新密码必须与当前密码不同",
  pleaseEnterCurrentPassword: "请输入当前密码",
  pleaseEnterNewPassword: "请输入新密码",

  // Day abbreviations
  dayMon: "周一",
  dayTue: "周二",
  dayWed: "周三",
  dayThu: "周四",
  dayFri: "周五",
  daySat: "周六",
  daySun: "周日",

  // Skin Analysis Result Specific
  highlights: "亮点",
  smoothAndHydrated: "光滑且保湿均衡的皮肤",
  mildRednessAndDarkSpots: "轻微发红和痘痘",
  skinConditionDetail: "皮肤状况详情",
  smoothSkin: "光滑肌肤",
  goodHydration: "保湿良好",
  mildRedness: "轻微发红",
  chatWithDrSkinAI: "向 Dr.SkinAI 寻求建议 💬",

  // All Scans Page
  allScans: "所有扫描",
  scans: "扫描",
  avgScore: "平均分数",
  allTime: "全部时间",
  last3Months: "最近3个月",
  noScansFound: "未找到扫描",
  keepTracking: "继续跟踪",

  // App Tutorial
  tutorialTitle: "GlowbieBell 使用指南 ✨",
  tutorialWelcome: "欢迎来到 GlowbieBell! 🌸",
  tutorialGetStarted: "开始使用",
  tutorialStep1Title: "主页仪表板 🏠",
  tutorialStep1Desc:
    "查看您的皮肤评分和整体皮肤健康状况。在这里查看您的统计数据和皮肤改善趋势。",
  tutorialStep2Title: "面部扫描 📸",
  tutorialStep2Desc:
    "从3个角度扫描您的面部（正面→左侧→右侧）。当捕获所有3个角度时，系统会自动分析。仅需30秒！",
  tutorialStep3Title: "分析结果 📊",
  tutorialStep3Desc:
    "查看您的皮肤评分和7个指标的详细分析：皱纹、松弛、色斑、痘痘、泛红、毛孔和肤色均匀度。",
  tutorialStep4Title: "与AI聊天 💬",
  tutorialStep4Desc:
    "咨询 Dr.SkinAI，您的个人护肤专家。获得个性化的产品推荐和护肤建议。",
  tutorialStep5Title: "历史记录与图表 📈",
  tutorialStep5Desc:
    "跟踪您的皮肤进展，查看皮肤评分的趋势图表，并比较过去的扫描结果。",
  tutorialStep6Title: "个人资料 👤",
  tutorialStep6Desc:
    "管理您的个人信息，更改密码，选择语言，并查看您的最新皮肤评分。",
  tutorialNext: "下一步",
  tutorialPrevious: "上一步",
  tutorialSkip: "跳过",
  tutorialFinish: "开始使用! 🎉",
  tutorialViewGuide: "查看使用指南 📖",
  tutorialHowToUse: "如何使用应用",
};

// ===============================
// 🌐 CONTEXT SETUP
// ===============================
const translations: Record<Language, Translations> = {
  th,
  en,
  zh,
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

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
