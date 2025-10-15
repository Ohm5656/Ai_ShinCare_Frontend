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

type Screen = 'login' | 'home' | 'scan' | 'result' | 'chat' | 'history' | 'profile' | 'editProfile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  const handleTabChange = (tab: string) => {
    setCurrentScreen(tab as Screen);
  };

  const renderScreen = () => {
    if (!isLoggedIn) {
      return <LoginRegisterScreen onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'home':
        return (
          <>
            <SkinHomeDashboard
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
            <HistoryPage userName="สุดา" />
            <BottomNavSkin activeTab="history" onTabChange={handleTabChange} />
          </>
        );
      case 'profile':
        return (
          <>
            <ProfilePage 
              userName="สุดา มาลัย" 
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
            onSave={(data) => {
              console.log('Profile updated:', data);
            }}
          />
        );
      default:
        return (
          <>
            <SkinHomeDashboard
              onStartScan={() => setCurrentScreen('scan')}
            />
            <BottomNavSkin activeTab="home" onTabChange={handleTabChange} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {renderScreen()}
      </div>
    </div>
  );
}
