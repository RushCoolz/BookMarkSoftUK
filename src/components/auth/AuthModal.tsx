import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Globe,
  ArrowRight,
  Shield,
  Key
} from 'lucide-react';
import { useAuth } from '../../services/authContext';

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    signIn, 
    signUp, 
    isLoading 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(authModalTab);
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInError, setSignInError] = useState('');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('');
  const [signUpSlug, setSignUpSlug] = useState('');
  const [signUpRightToWork, setSignUpRightToWork] = useState('British Citizen (No Visa Restriction)');
  const [signUpError, setSignUpError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Auto-generate suggested slug as user types name
  const handleNameChange = (val: string) => {
    setSignUpName(val);
    if (!signUpSlug || signUpSlug === signUpName.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      const generated = val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      setSignUpSlug(generated);
    }
  };

  React.useEffect(() => {
    setActiveTab(authModalTab);
    setSignInError('');
    setSignUpError('');
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    if (!signInEmail.trim()) {
      setSignInError('Please enter your email address');
      return;
    }
    try {
      await signIn(signInEmail.trim(), signInPassword, 'email');
    } catch (err: any) {
      setSignInError(err.message || 'Failed to sign in. Please check your details and try again.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    if (!signUpName.trim()) {
      setSignUpError('Please enter your full name');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setSignUpError('Please enter a valid email address');
      return;
    }
    if (!acceptedTerms) {
      setSignUpError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    try {
      await signUp({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        roleHeadline: signUpRole || 'Professional',
        rightToWork: signUpRightToWork,
        customSlug: signUpSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''),
      });
    } catch (err: any) {
      setSignUpError(err.message || 'Failed to create your account. Please try again.');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSignInError('');
    try {
      const email = provider === 'google' 
        ? 'my.account@gmail.com' 
        : 'my.github.account@example.com';
      await signIn(email, undefined, provider);
    } catch (err: any) {
      setSignInError('Social login was cancelled or failed. Please try with email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-200 max-h-[92vh] animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-600 text-white">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 id="auth-modal-title" className="font-bold text-slate-900 dark:text-white text-sm">
                BookMarkSoft Account
              </h3>
              <p className="text-[11px] text-slate-500">
                Save your CVs, applications, and tax calculations
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 mx-5 mt-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`py-2 rounded-lg transition-all text-center cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-2 rounded-lg transition-all text-center cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Free Account
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Social Sign-in Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-medium select-none uppercase">
              Or with email
            </span>
          </div>

          {/* Sign In Form */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-3.5">
              {signInError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
                  {signInError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              {signUpError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
                  {signUpError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Personal Online CV Link Claim (Exclusive to Sign Up) */}
              <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
                  <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Your Free Online CV Link</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Claim your unique web address to easily share your CV with employers and recruiters:
                </p>
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs">
                  <span className="text-slate-400 select-none shrink-0 font-mono">https://</span>
                  <input
                    type="text"
                    value={signUpSlug}
                    onChange={(e) => setSignUpSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-name"
                    className="bg-transparent font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none px-1 min-w-0 flex-1"
                  />
                  <span className="text-slate-500 font-mono select-none shrink-0">.bookmarksoft.uk</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Job Title or Profession (Optional)
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value)}
                    placeholder="e.g. Project Manager, Nurse, Software Developer"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  UK Work Eligibility Status
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={signUpRightToWork}
                    onChange={(e) => setSignUpRightToWork(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="British Citizen (No Visa Restriction)">British Citizen (No Visa Restriction)</option>
                    <option value="UK Indefinite Leave to Remain (ILR)">UK Indefinite Leave to Remain (ILR)</option>
                    <option value="EU Settled Status">EU Settled Status</option>
                    <option value="Skilled Worker Visa (Sponsorship Required)">Skilled Worker Visa (Sponsorship Required)</option>
                    <option value="Graduate Visa (2 Years Unrestricted)">Graduate Visa (2 Years Unrestricted)</option>
                    <option value="Youth Mobility / Ancestry Visa">Youth Mobility / Ancestry Visa</option>
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-600 mt-0.5"
                />
                <span>
                  I agree to the Terms of Service and Privacy Policy.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isLoading ? 'Setting up account...' : 'Create Account & Claim Link'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span>Secure &amp; Free • UK Data Protection Compliant</span>
        </div>
      </div>
    </div>
  );
}
