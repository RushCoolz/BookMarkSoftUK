import React, { useState } from 'react';
import { 
  X, 
  LogOut, 
  User, 
  Mail, 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  Eye, 
  CheckCircle2, 
  Globe,
  Copy,
  Check,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../services/authContext';

interface UserProfileModalProps {
  onNavigateToBuilder?: () => void;
  onNavigateToTracking?: () => void;
}

export function UserProfileModal({ onNavigateToBuilder, onNavigateToTracking }: UserProfileModalProps) {
  const { 
    user, 
    signOut, 
    isProfileModalOpen, 
    closeProfileModal,
    openAuthModal
  } = useAuth();

  const [copiedLink, setCopiedLink] = useState(false);

  if (!isProfileModalOpen || !user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const personalUrl = user.customSlug 
    ? `https://${user.customSlug}.bookmarksoft.uk` 
    : `https://${user.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.bookmarksoft.uk`;

  const copyLink = () => {
    try {
      navigator.clipboard.writeText(personalUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-200 max-h-[92vh] animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 id="profile-modal-title" className="font-bold text-slate-900 dark:text-white text-sm">
              My Account
            </h3>
          </div>
          <button
            onClick={closeProfileModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-blue-500/30"
              />
            ) : (
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">
                  {user.name}
                </h4>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </p>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                <Briefcase className="w-3 h-3" />
                <span className="truncate">{user.roleHeadline || 'Jobseeker'}</span>
              </div>
            </div>
          </div>

          {/* Personal Online Link */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Your Online CV Link
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono">
              <span className="truncate text-blue-600 dark:text-blue-400">
                {personalUrl}
              </span>
              <button
                type="button"
                onClick={copyLink}
                className="px-2 py-1 rounded-lg text-[11px] font-sans font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Right to Work Status */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                  UK Work Eligibility
                </span>
                <span className="text-[11px] text-slate-500">
                  {user.rightToWork}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => {
                closeProfileModal();
                openAuthModal('signup');
              }}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Another Account</span>
            </button>

            <button
              type="button"
              onClick={signOut}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
