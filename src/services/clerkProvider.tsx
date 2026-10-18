import React, { ReactNode } from 'react';
import { ClerkProvider as RealClerkProvider, SignInButton as ClerkSignInButton, UserButton as ClerkUserButton } from '@clerk/clerk-react';
import { AuthProvider, useAuth } from './authContext';

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

export function useAppAuth() {
  const auth = useAuth();
  return {
    isConfigured: Boolean(clerkKey && clerkKey.startsWith('pk_')),
    isSignedIn: auth.isSignedIn,
    userId: auth.user?.id,
    email: auth.user?.email,
    user: auth.user,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    openAuthModal: auth.openAuthModal,
    openProfileModal: auth.openProfileModal,
  };
}

export function AppAuthProvider({ children }: { children: ReactNode }) {
  if (clerkKey && clerkKey.startsWith('pk_')) {
    return (
      <RealClerkProvider publishableKey={clerkKey}>
        <AuthProvider>{children}</AuthProvider>
      </RealClerkProvider>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
}

export { ClerkSignInButton as SignInButton, ClerkUserButton as UserButton };
