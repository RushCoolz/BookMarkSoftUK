import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppUser, AuthContextType } from '../types/auth';

const STORAGE_KEY = 'bookmarksoft_user_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email) return parsed;
        }
      } catch (err) {
        console.warn('[BookMarkSoft Auth] Failed to read saved session:', err);
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Sync session changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (user) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        console.warn('[BookMarkSoft Auth] Failed to persist session:', err);
      }
    }
  }, [user]);

  const signIn = async (
    email: string,
    password?: string,
    provider: 'email' | 'google' | 'github' = 'email'
  ): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ');
    const capitalized = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    const slug = nameFromEmail.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const loggedInUser: AppUser = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      name: capitalized || 'Member',
      email: email.trim().toLowerCase(),
      roleHeadline: 'Professional',
      rightToWork: 'British Citizen / UK Settled Status',
      customSlug: slug,
      authProvider: provider,
      createdAt: new Date().toISOString(),
      applicationsCount: 0,
      vouchesCount: 0,
    };

    setUser(loggedInUser);
    setIsLoading(false);
    setIsAuthModalOpen(false);
    return true;
  };

  const signUp = async (data: {
    name: string;
    email: string;
    password?: string;
    roleHeadline?: string;
    rightToWork?: string;
    customSlug?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const defaultSlug = data.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const finalSlug = (data.customSlug?.trim() || defaultSlug).toLowerCase().replace(/[^a-z0-9-]/g, '');

    const newUser: AppUser = {
      id: `usr_${Math.random().toString(36).substring(2, 11)}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      roleHeadline: data.roleHeadline?.trim() || 'Professional',
      rightToWork: data.rightToWork || 'British Citizen (No Visa Restriction)',
      customSlug: finalSlug,
      authProvider: 'email',
      createdAt: new Date().toISOString(),
      applicationsCount: 0,
      vouchesCount: 0,
    };

    setUser(newUser);
    setIsLoading(false);
    setIsAuthModalOpen(false);
    return true;
  };

  const signOut = () => {
    setUser(null);
    setIsProfileModalOpen(false);
  };

  const openAuthModal = (tab: 'signin' | 'signup' = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const updateUserProfile = (data: Partial<AppUser>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: Boolean(user),
        isLoading,
        signIn,
        signUp,
        signOut,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalTab,
        openProfileModal,
        closeProfileModal,
        isProfileModalOpen,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
