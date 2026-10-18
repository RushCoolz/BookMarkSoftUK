export interface AppUser {
  id: string;
  name: string;
  email: string;
  roleHeadline: string;
  rightToWork: string;
  avatarUrl?: string;
  customSlug?: string; // e.g., "alex-turner" -> https://alex-turner.bookmarksoft.uk
  authProvider: 'email' | 'google' | 'github' | 'clerk';
  createdAt: string;
  applicationsCount?: number;
  vouchesCount?: number;
}

export interface AuthContextType {
  user: AppUser | null;
  isSignedIn: boolean;
  isLoading: boolean;
  signIn: (email: string, password?: string, provider?: 'email' | 'google' | 'github') => Promise<boolean>;
  signUp: (data: { 
    name: string; 
    email: string; 
    password?: string; 
    roleHeadline?: string; 
    rightToWork?: string;
    customSlug?: string;
  }) => Promise<boolean>;
  signOut: () => void;
  openAuthModal: (tab?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'signup';
  openProfileModal: () => void;
  closeProfileModal: () => void;
  isProfileModalOpen: boolean;
  updateUserProfile: (data: Partial<AppUser>) => void;
}
