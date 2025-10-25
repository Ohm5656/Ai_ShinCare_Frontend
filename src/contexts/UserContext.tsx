import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

// User data interface
export interface UserData {
  email: string;
  fullName: string;
  username?: string;
  profileImage?: string;
  age?: string;
  gender?: string;
  skinType?: string;
  skincareGoal?: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  updateUser: (updates: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  const updateUser = useCallback((updates: Partial<UserData>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const value = useMemo(() => ({
    user,
    setUser,
    updateUser,
  }), [user, updateUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
