import React from "react";
import { 
  Search, 
  Moon, 
  Sun, 
  Briefcase, 
  Wrench, 
  Cloud, 
  User, 
  CheckCircle2, 
  Key, 
  Database 
} from "lucide-react";
import { Logo } from "./Logo";
import { useAppAuth, UserButton, SignInButton } from "../../services/clerkProvider";

interface NavbarProps {
  activeSection: 'career' | 'utilities';
  setActiveSection: (sec: 'career' | 'utilities') => void;
  activeToolId: string;
  setActiveToolId: (toolId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export function Navbar({
  activeSection,
  setActiveSection,
  activeToolId,
  setActiveToolId,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
}: NavbarProps) {
  const auth = useAppAuth();

  return (
    <header className="w-full max-w-full sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="w-full max-w-full min-w-0 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 min-w-0">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-6 cursor-pointer shrink-0" onClick={() => { setActiveToolId('cv-builder'); setActiveSection('career'); }}>
            <Logo className="w-7 h-7 sm:w-8 h-8" />
          </div>

          {/* Section Switcher Tabs */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <button
              onClick={() => {
                setActiveSection('career');
                if (activeSection !== 'career') setActiveToolId('cv-builder');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeSection === 'career'
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-500" />
              Career Intelligence (Heroic Free Features)
            </button>
            <button
              onClick={() => {
                setActiveSection('utilities');
                if (activeSection !== 'utilities') setActiveToolId('take-home-pay');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeSection === 'utilities'
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-500" />
              UK Utilities &amp; Services
            </button>
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-44 sm:w-56 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 20+ UK tools..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* User Auth Status or Sign In Button */}
            {auth.isSignedIn && auth.user ? (
              <button
                type="button"
                onClick={auth.openProfileModal}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all cursor-pointer shadow-2xs"
                title="View Account"
              >
                {auth.user.avatarUrl ? (
                  <img 
                    src={auth.user.avatarUrl} 
                    alt={auth.user.name} 
                    className="w-5 h-5 rounded-lg object-cover ring-1 ring-blue-500/40"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {auth.user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {auth.user.name.split(' ')[0]}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => auth.openAuthModal('signin')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Key className="w-3 h-3" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => auth.openAuthModal('signup')}
                  className="hidden sm:flex px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Dark mode */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Section Switcher */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => { setActiveSection('career'); setActiveToolId('cv-builder'); }}
            className={`px-3 py-1 rounded-lg font-bold ${activeSection === 'career' ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40" : "text-slate-500"}`}
          >
            Career Intelligence
          </button>
          <button
            onClick={() => { setActiveSection('utilities'); setActiveToolId('take-home-pay'); }}
            className={`px-3 py-1 rounded-lg font-bold ${activeSection === 'utilities' ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" : "text-slate-500"}`}
          >
            UK Utilities Hub
          </button>
        </div>
      </div>
    </header>
  );
}
