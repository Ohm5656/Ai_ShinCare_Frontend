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

// Screen types for routing
type Screen = 
  | 'login' 
  | 'home' 
  | 'scan' 
  | 'result' 
  | 'chat' 
  | 'history' 
  | 'profile' 
  | 'editProfile';

/**
 * Main App Component
 * Handles navigation and authentication state
 */
export default function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Current screen state
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  /**
   * Handle user login
   * Transitions from login screen to home dashboard
   */
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  /**
   * Handle bottom navigation tab changes
   * @param tab - Selected tab identifier
   */
  const handleTabChange = (tab: string) => {
    setCurrentScreen(tab as Screen);
  };

  /**
   * Handle profile save
   * @param data - Updated profile data
   */
  const handleProfileSave = (data: any) => {
    console.log('Profile data saved:', data);
    setCurrentScreen('profile');
  };

  /**
   * Render current screen based on authentication and navigation state
   */
  const renderScreen = () => {
    // Show login screen if not authenticated
    if (!isLoggedIn) {
      return <LoginRegisterScreen onLogin={handleLogin} />;
    }

    // Render authenticated screens
    switch (currentScreen) {
      // Home Dashboard Screen
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

      // Face Scan Camera Screen
      case 'scan':
        return (
          <FaceScanScreen
            onAnalyze={() => setCurrentScreen('result')}
            onBack={() => setCurrentScreen('home')}
          />
        );

      // Skin Analysis Result Screen
      case 'result':
        return (
          <SkinAnalysisResult
            onChatWithAI={() => setCurrentScreen('chat')}
            onBack={() => setCurrentScreen('home')}
          />
        );

      // AI Chat Assistant Screen
      case 'chat':
        return (
          <>
            <DrSkinAIChatScreen onBack={() => setCurrentScreen('home')} />
            <BottomNavSkin activeTab="chat" onTabChange={handleTabChange} />
          </>
        );

      // Progress History Screen
      case 'history':
        return (
          <>
            <HistoryPage userName="Suda" />
            <BottomNavSkin activeTab="history" onTabChange={handleTabChange} />
          </>
        );

      // User Profile Screen
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

      // Edit Profile Screen
      case 'editProfile':
        return (
          <EditProfilePage
            onBack={() => setCurrentScreen('profile')}
            onSave={handleProfileSave}
          />
        );

      // Default: Return to home
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

  return (
    <div 
      className="min-h-screen bg-white"
      role="main"
      aria-label="AI Skin Analyzer Application"
    >
      {/* Mobile Container - Max width 390px (iPhone 13) */}
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {renderScreen()}
      </div>
    </div>
  );
}
