import React, { createContext, useContext, ReactNode } from 'react';
import { ClerkProvider as RealClerkProvider, SignInButton, SignUpButton, UserButton, useUser, useAuth } from '@clerk/clerk-react';

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

interface AuthStatus {
  isConfigured: boolean;
  isSignedIn: boolean;
  userId?: string;
  email?: string;
}

const FallbackAuthContext = createContext<AuthStatus>({
  isConfigured: false,
  isSignedIn: true, // Demo candidate Alex Turner
  userId: 'user_alex_turner_demo',
  email: 'alex.turner@example.co.uk',
});

export function useAppAuth() {
  if (clerkKey && clerkKey.startsWith('pk_')) {
    try {
      const { isSignedIn, userId } = useAuth();
      const { user } = useUser();
      return {
        isConfigured: true,
        isSignedIn: Boolean(isSignedIn),
        userId: userId || undefined,
        email: user?.primaryEmailAddress?.emailAddress,
        user,
      };
    } catch {
      return useContext(FallbackAuthContext);
    }
  }
  return useContext(FallbackAuthContext);
}

export function AppAuthProvider({ children }: { children: ReactNode }) {
  if (clerkKey && clerkKey.startsWith('pk_')) {
    return (
      <RealClerkProvider publishableKey={clerkKey}>
        {children}
      </RealClerkProvider>
    );
  }

  // Fallback demo state
  return (
    <FallbackAuthContext.Provider value={{
      isConfigured: false,
      isSignedIn: true,
      userId: 'user_alex_turner_demo',
      email: 'alex.turner@example.co.uk',
    }}>
      {children}
    </FallbackAuthContext.Provider>
  );
}

export { SignInButton, SignUpButton, UserButton };
