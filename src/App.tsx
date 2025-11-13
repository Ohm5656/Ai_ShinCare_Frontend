import { useState, useMemo, useEffect } from 'react';
import { LoginRegisterScreen } from './components/pages/LoginRegisterScreen';
import { ForgotPasswordPage } from './components/pages/ForgotPasswordPage';
import { SkinHomeDashboard } from './components/pages/SkinHomeDashboard';
import { FaceScanScreen } from './components/pages/FaceScanScreen';
import { PreAnalysisChat } from './components/pages/PreAnalysisChat';
import { AnalyzingScreen } from './components/pages/AnalyzingScreen';
import { SkinAnalysisResult } from './components/pages/SkinAnalysisResult';
import { DrSkinAIChatScreen } from './components/pages/DrSkinAIChatScreen';
import { ProfilePage } from './components/pages/ProfilePage';
import { HistoryPage } from './components/pages/HistoryPage';
import { EditProfilePage, ProfileData } from './components/pages/EditProfilePage';
import { ScanDetailPage, ScanDetail } from './components/pages/ScanDetailPage';
import { ChangePasswordPage } from './components/pages/ChangePasswordPage';
import { AllScansPage } from './components/pages/AllScansPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { PremiumPage } from './components/pages/PremiumPage';
import { BottomNavSkin } from './components/BottomNavSkin';
import { AppTutorial } from './components/AppTutorial';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Screen types for routing
type Screen = 
  | 'login' 
  | 'forgotPassword'
  | 'home' 
  | 'scan'
  | 'preAnalysisChat'
  | 'analyzing'
  | 'result' 
  | 'chat' 
  | 'history' 
  | 'profile' 
  | 'editProfile'
  | 'scanDetail'
  | 'changePassword'
  | 'allScans'
  | 'gallery'
  | 'premium';

/**
 * App Content Component
 * Handles navigation and authentication state with language support
 */
function AppContent() {
  const { t } = useLanguage();
  const { user, setUser } = useUser();
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // เพิ่มบรรทัดนี้
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);

  
  // Current screen state
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);

  // Scan flow state
  const [userConcerns, setUserConcerns] = useState<string[]>([]);
  const [userData, setUserData] = useState<{
    gender?: string;
    age?: string;
    skinType?: string;
    isSensitive?: boolean;
  }>({});
  const [capturedImages, setCapturedImages] = useState<{
    front: string | null;
    left: string | null;
    right: string | null;
  }>({
    front: null,
    left: null,
    right: null,
  });

  // Profile data state - now synced with user context
  const profileData: ProfileData = useMemo(() => ({
    fullName: user?.fullName || 'Suda Malai',
    email: user?.email || 'suda.malai@email.com',
    username: user?.username || 'sudamalai',
    profileImage: user?.profileImage || '',
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
      topIssue: t.language === 'th' ? 'ความสม่ำเสมอดีเยี่ยม' : t.language === 'en' ? 'Excellent evenness' : '均匀度极佳',
      metrics: {
        wrinkles: 85,
        sagging: 80,
        darkSpots: 75,
        acne: 82,
        redness: 72,
        pores: 70,
        evenness: 88
      }
    },
    {
      id: 2,
      date: `${t.yesterday} 8:15 ${t.am}`,
      score: 85,
      improvement: '+1',
      thumbnail: '🌺',
      topIssue: t.language === 'th' ? 'รูขุมขนดีขึ้น' : t.language === 'en' ? 'Pores improved' : '毛孔改善',
      metrics: {
        wrinkles: 84,
        sagging: 79,
        darkSpots: 74,
        acne: 81,
        redness: 71,
        pores: 69,
        evenness: 87
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
        sagging: 79,
        darkSpots: 74,
        acne: 81,
        redness: 71,
        pores: 71,
        evenness: 87
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
        sagging: 78,
        darkSpots: 73,
        acne: 80,
        redness: 70,
        pores: 72,
        evenness: 86
      }
    },
  ], [t]);

  // Selected scan for detail view
  const [selectedScanId, setSelectedScanId] = useState<number | null>(null);
  
  // Selected date range for gallery filter
  const [galleryDateRange, setGalleryDateRange] = useState<string | undefined>(undefined);

  // Track which screen opened the scan detail page
  const [previousScreen, setPreviousScreen] = useState<Screen>('history');
  
  /**
   * Handle user login
   * Transitions from login screen to home dashboard
   */
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
    // Show tutorial after login
    setShowTutorial(true);
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
    
    // Update user context using updateUser to prevent infinite loops
    if (user) {
      setUser({
        ...user,
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        profileImage: data.profileImage,
        age: data.age,
        gender: data.gender,
        skinType: data.skinType,
        skincareGoal: data.skincareGoal,
      });
    } else {
      // If no user exists yet, create new user
      setUser({
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        profileImage: data.profileImage,
        age: data.age,
        gender: data.gender,
        skinType: data.skinType,
        skincareGoal: data.skincareGoal,
      });
    }
    
    // Navigate back to profile after a brief delay to ensure state update completes
    setTimeout(() => {
      setCurrentScreen('profile');
    }, 0);
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
            onAnalyze={(images) => {
              setCapturedImages(images);
              setCurrentScreen('preAnalysisChat');
            }}
            onBack={() => setCurrentScreen('home')}
          />
        );

      // Pre-Analysis Chat Screen (asks about skin concerns)
      case 'preAnalysisChat':
        return (
          <PreAnalysisChat
            onComplete={(data) => {
              setUserConcerns(data.concerns);
              setUserData({
                gender: data.gender,
                age: data.age,
                skinType: data.skinType,
                isSensitive: data.isSensitive,
              });
              setCurrentScreen('analyzing');
            }}
          />
        );

      // Analyzing Screen (processing animation)
      case 'analyzing':
        return (
          <AnalyzingScreen
            capturedImages={capturedImages}
            userConcerns={userConcerns}
            // ✅ ส่ง profile ไป backend ด้วย (ให้ AnalyzingScreen ใช้ formData.append)
            userData={userData} 
            // ✅ รับผลลัพธ์จริงจาก backend แล้วเก็บลง state
            onComplete={(result) => {
              setAnalyzeResult(result);
              setCurrentScreen('result');
            }}
          />
        );


      // Skin Analysis Result Screen
      case 'result':
        return (
          <SkinAnalysisResult
            result={analyzeResult}                 // ✅ ส่งผลลัพธ์จริงจาก backend
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
                setPreviousScreen('history');
                setCurrentScreen('scanDetail');
              }}
              onViewAllScans={() => setCurrentScreen('allScans')}
              onViewGallery={(dateRange) => {
                setGalleryDateRange(dateRange);
                setCurrentScreen('gallery');
              }}
            />
            <BottomNavSkin activeTab="history" onTabChange={handleTabChange} />
          </>
        );

      // All Scans Screen
      case 'allScans':
        return (
          <AllScansPage
            onBack={() => setCurrentScreen('history')}
            onViewScanDetail={(scanId) => {
              setSelectedScanId(scanId);
              setPreviousScreen('allScans');
              setCurrentScreen('scanDetail');
            }}
          />
        );

      // Gallery Screen
      case 'gallery':
        return (
          <GalleryPage
            onBack={() => {
              setGalleryDateRange(undefined);
              setCurrentScreen('history');
            }}
            onViewScanDetail={(scanId) => {
              setSelectedScanId(scanId);
              setPreviousScreen('gallery');
              setCurrentScreen('scanDetail');
            }}
            filterDateRange={galleryDateRange}
          />
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
            onBack={() => setCurrentScreen(previousScreen)}
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
              profileImage={profileData.profileImage}
              onEditProfile={() => setCurrentScreen('editProfile')}
              onChangePassword={() => setCurrentScreen('changePassword')}
              onPremiumClick={() => setCurrentScreen('premium')}
              onViewTutorial={() => setShowTutorial(true)}
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

      // Premium Membership Screen
      case 'premium':
        return (
          <PremiumPage
            onBack={() => setCurrentScreen('profile')}
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
      {/* App Tutorial */}
      <AppTutorial open={showTutorial} onOpenChange={setShowTutorial} />
    </div>
  );
}

/**
 * Main App Component
 * Wraps AppContent with LanguageProvider, UserProvider, and ErrorBoundary
 */
export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}