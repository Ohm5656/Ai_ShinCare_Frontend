import { useState } from 'react';
import { LoginRegisterScreen } from './components/pages/LoginRegisterScreen';
import { SkinHomeDashboard } from './components/pages/SkinHomeDashboard';
import { FaceScanScreen } from './components/pages/FaceScanScreen';
import { SkinAnalysisResult } from './components/pages/SkinAnalysisResult';
import { DrSkinAIChatScreen } from './components/pages/DrSkinAIChatScreen';
import { ProfilePage } from './components/pages/ProfilePage';
import { HistoryPage } from './components/pages/HistoryPage';
import { EditProfilePage } from './components/pages/EditProfilePage';
import { BottomNavSkin } from './components/BottomNavSkin';

// ✅ import ตัวแปร API_URL จาก config
import { API_URL } from './config';

// ===============================
// 📱 Main App Component
// ===============================
// ตัวหลักของ frontend ที่ควบคุมหน้าจอและการเชื่อม backend
// ===============================

// กำหนดประเภทของหน้าจอ (Screen State)
type Screen =
  | 'login'
  | 'home'
  | 'scan'
  | 'result'
  | 'chat'
  | 'history'
  | 'profile'
  | 'editProfile';

export default function App() {
  console.log('🔗 Connected to API:', API_URL);

  // -----------------------------
  // 🔐 Authentication & Routing
  // -----------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  // -----------------------------
  // 🟢 ฟังก์ชันทดสอบการเชื่อม Backend
  // -----------------------------
  const handleLogin = async () => {
    try {
      console.log('🚀 Testing backend connection...');
      const res = await fetch(`${API_URL}/`);
      const data = await res.json();
      console.log('✅ Backend Response:', data);
      setIsLoggedIn(true);
      setCurrentScreen('home');
    } catch (err) {
      console.error('❌ Backend not reachable:', err);
      alert('Cannot connect to backend! โปรดตรวจสอบการตั้งค่า API_URL');
    }
  };

  // เปลี่ยนแท็บ (จาก bottom nav)
  const handleTabChange = (tab: string) => {
    setCurrentScreen(tab as Screen);
  };

  // บันทึกโปรไฟล์
  const handleProfileSave = (data: any) => {
    console.log('Profile data saved:', data);
    setCurrentScreen('profile');
  };

  // -----------------------------
  // 🧭 ฟังก์ชันเลือกหน้าจอ
  // -----------------------------
  const renderScreen = () => {
    // ถ้ายังไม่ล็อกอิน ให้แสดงหน้า Login ก่อน
    if (!isLoggedIn) {
      return <LoginRegisterScreen onLogin={handleLogin} />;
    }

    // ถ้าล็อกอินแล้ว
    switch (currentScreen) {
      case 'home':
        return (
          <>
            <SkinHomeDashboard
              userName="Suda"
              onStartScan={() => setCurrentScreen('scan')}
            />
            <BottomNavSkin activeTab="home" onTabChange={handleTabChange} />
          </>
        );

      case 'scan':
        return (
          <FaceScanScreen
            onAnalyze={() => setCurrentScreen('result')}
            onBack={() => setCurrentScreen('home')}
          />
        );

      case 'result':
        return (
          <SkinAnalysisResult
            onChatWithAI={() => setCurrentScreen('chat')}
            onBack={() => setCurrentScreen('home')}
          />
        );

      case 'chat':
        return (
          <>
            <DrSkinAIChatScreen onBack={() => setCurrentScreen('home')} />
            <BottomNavSkin activeTab="chat" onTabChange={handleTabChange} />
          </>
        );

      case 'history':
        return (
          <>
            <HistoryPage userName="Suda" />
            <BottomNavSkin activeTab="history" onTabChange={handleTabChange} />
          </>
        );

      case 'profile':
        return (
          <>
            <ProfilePage
              userName="Suda Malai"
              userEmail="suda.malai@email.com"
              onEditProfile={() => setCurrentScreen('editProfile')}
            />
            <BottomNavSkin activeTab="profile" onTabChange={handleTabChange} />
          </>
        );

      case 'editProfile':
        return (
          <EditProfilePage
            onBack={() => setCurrentScreen('profile')}
            onSave={handleProfileSave}
          />
        );

      default:
        return (
          <>
            <SkinHomeDashboard
              userName="Suda"
              onStartScan={() => setCurrentScreen('scan')}
            />
            <BottomNavSkin activeTab="home" onTabChange={handleTabChange} />
          </>
        );
    }
  };

  // -----------------------------
  // 🖥️ ส่วนแสดงผลหลักของแอป
  // -----------------------------
  return (
    <div
      className="min-h-screen bg-white"
      role="main"
      aria-label="AI Skin Analyzer Application"
    >
      {/* Mobile container (390px width) */}
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {renderScreen()}
      </div>
    </div>
  );
}
