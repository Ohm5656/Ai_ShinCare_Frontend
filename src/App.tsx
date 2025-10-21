import { useState, useMemo } from 'react';
import { LoginRegisterScreen } from './components/pages/LoginRegisterScreen';
import { ForgotPasswordPage } from './components/pages/ForgotPasswordPage';
import { SkinHomeDashboard } from './components/pages/SkinHomeDashboard';
import { FaceScanScreen } from './components/pages/FaceScanScreen';
import { SkinAnalysisResult } from './components/pages/SkinAnalysisResult';
import { DrSkinAIChatScreen } from './components/pages/DrSkinAIChatScreen';
import { ProfilePage } from './components/pages/ProfilePage';
import { HistoryPage } from './components/pages/HistoryPage';
import { EditProfilePage, ProfileData } from './components/pages/EditProfilePage';
import { ScanDetailPage, ScanDetail } from './components/pages/ScanDetailPage';
import { ChangePasswordPage } from './components/pages/ChangePasswordPage';
import { BottomNavSkin } from './components/BottomNavSkin';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { UserProvider, useUser } from './contexts/UserContext';

// Screen types for routing
type Screen = 
  | 'login' 
  | 'forgotPassword'
  | 'home' 
  | 'scan' 
  | 'result' 
  | 'chat' 
  | 'history' 
  | 'profile' 
  | 'editProfile'
  | 'scanDetail'
  | 'changePassword';

/**
 * App Content Component
 * Handles navigation and authentication state with language support
 */
function AppContent() {
  const { t } = useLanguage();
  const { user, setUser } = useUser();
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Current screen state
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  // Profile data state - now synced with user context
  const profileData: ProfileData = useMemo(() => ({
    fullName: user?.fullName || 'Suda Malai',
    email: user?.email || 'suda.malai@email.com',
    age: user?.age || '28',
    gender: user?.gender || 'female',
    skinType: user?.skinType || 'combination',
    skincareGoal: user?.skincareGoal || 'anti-aging',
  }), [user]);

  // Mock scan history data with translations
  const scanHistory: ScanDetail[] = useMemo(() => [
    {
      id: 1,
      date: `${t.today} 9:30 ${t.am}`,
      score: 87,
      improvement: '+2',
      thumbnail: '🌸',
      topIssue: t.excellentHydration,
      metrics: {
        wrinkles: 85,
        redness: 72,
        tone: 88,
        oil: 65,
        eyeBags: 78,
        acne: 82
      }
    },
    {
      id: 2,
      date: `${t.yesterday} 8:15 ${t.am}`,
      score: 85,
      improvement: '+1',
      thumbnail: '🌺',
      topIssue: t.goodTexture,
      metrics: {
        wrinkles: 84,
        redness: 71,
        tone: 87,
        oil: 68,
        eyeBags: 77,
        acne: 81
      }
    },
    {
      id: 3,
      date: t.language === 'th' ? '12 ต.ค. 2025' : t.language === 'en' ? 'Oct 12, 2025' : '2025年10月12日',
      score: 84,
      improvement: '+2',
      thumbnail: '🌼',
      topIssue: t.elasticityImproved,
      metrics: {
        wrinkles: 84,
        redness: 71,
        tone: 87,
        oil: 70,
        eyeBags: 77,
        acne: 81
      }
    },
    {
      id: 4,
      date: t.language === 'th' ? '10 ต.ค. 2025' : t.language === 'en' ? 'Oct 10, 2025' : '2025年10月10日',
      score: 82,
      improvement: '0',
      thumbnail: '🌻',
      topIssue: t.steady,
      metrics: {
        wrinkles: 83,
        redness: 70,
        tone: 86,
        oil: 75,
        eyeBags: 76,
        acne: 80
      }
    },
  ], [t]);

  // Selected scan for detail view
  const [selectedScanId, setSelectedScanId] = useState<number | null>(null);

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
  const handleProfileSave = (data: ProfileData) => {
    console.log('Profile data saved:', data);
    // Update user context
    setUser({
      fullName: data.fullName,
      email: data.email,
      age: data.age,
      gender: data.gender,
      skinType: data.skinType,
      skincareGoal: data.skincareGoal,
    });
    setCurrentScreen('profile');
  };

  /**
   * Handle user logout
   * Clears authentication state and returns to login screen
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
    // Clear user data
    setUser(null);
  };

  /**
   * Render current screen based on authentication and navigation state
   */
  const renderScreen = () => {
    // Show login/forgot password screens if not authenticated
    if (!isLoggedIn) {
      if (currentScreen === 'forgotPassword') {
        return <ForgotPasswordPage onBack={() => setCurrentScreen('login')} />;
      }
      return (
        <LoginRegisterScreen 
          onLogin={handleLogin}
          onForgotPassword={() => setCurrentScreen('forgotPassword')}
        />
      );
    }

    // Render authenticated screens
    switch (currentScreen) {
      // Home Dashboard Screen
      case 'home':
        return (
          <>
            <SkinHomeDashboard
              userName={profileData.fullName.split(' ')[0]}
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
            <HistoryPage 
              userName={profileData.fullName.split(' ')[0]}
              onViewScanDetail={(scanId) => {
                setSelectedScanId(scanId);
                setCurrentScreen('scanDetail');
              }}
            />
            <BottomNavSkin activeTab="history" onTabChange={handleTabChange} />
          </>
        );

      // Scan Detail Screen
      case 'scanDetail':
        const selectedScan = scanHistory.find(scan => scan.id === selectedScanId);
        if (!selectedScan) {
          setCurrentScreen('history');
          return null;
        }
        return (
          <ScanDetailPage
            scanData={selectedScan}
            onBack={() => setCurrentScreen('history')}
          />
        );

      // User Profile Screen
      case 'profile':
        return (
          <>
            <ProfilePage 
              userName={profileData.fullName} 
              userEmail={profileData.email}
              profileData={profileData}
              onEditProfile={() => setCurrentScreen('editProfile')}
              onChangePassword={() => setCurrentScreen('changePassword')}
              onLogout={handleLogout}
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
            initialData={profileData}
          />
        );

      // Change Password Screen
      case 'changePassword':
        return (
          <ChangePasswordPage
            onBack={() => setCurrentScreen('profile')}
            onSuccess={() => setCurrentScreen('profile')}
          />
        );

      // Default: Return to home
      default:
        return (
          <>
            <SkinHomeDashboard
              userName={profileData.fullName.split(' ')[0]}
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
      {/* Toast notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

/**
 * Main App Component
 * Wraps AppContent with LanguageProvider and UserProvider
 */
export default function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </LanguageProvider>
  );
}
