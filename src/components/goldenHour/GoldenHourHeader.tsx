import React from 'react';
import { 
  Search, 
  Gift, 
  ShieldCheck, 
  Sparkles, 
  User, 
  SunMedium, 
  CheckCircle2, 
  Lock,
  ExternalLink,
  Store
} from 'lucide-react';
import { PlatformViewMode } from '../../types/goldenHour';

interface GoldenHourHeaderProps {
  viewMode: PlatformViewMode;
  onSelectViewMode: (mode: PlatformViewMode) => void;
  onOpenPrivacyShield: () => void;
  onOpenAuthModal: () => void;
  onOpenPlaceOfferingModal: () => void;
  userRole: 'shopper' | 'brand_placer';
  userName?: string;
  totalSavedDollars: number;
}

export function GoldenHourHeader({
  viewMode,
  onSelectViewMode,
  onOpenPrivacyShield,
  onOpenAuthModal,
  onOpenPlaceOfferingModal,
  userRole,
  userName = 'Anonymous Shopper',
  totalSavedDollars
}: GoldenHourHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-sm transition-all duration-200">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          
          {/* Brand Wordmark */}
          <div 
            onClick={() => onSelectViewMode('search')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C5A028] p-0.5 shadow-md flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <SunMedium className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#18181B] font-sans">
                  GOLDEN HOUR
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF7EE] text-[#C5A028] border border-[#D4AF37]/30 tracking-wider">
                  BOOKMARKSOFT
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#71717A] tracking-tight hidden sm:block">
                Where Search Meets Honest Value
              </span>
            </div>
          </div>

          {/* Dual-Mode Toggle Navigation (Search vs Offerings) */}
          <nav className="flex items-center p-1 bg-[#FAF9F5] rounded-2xl border border-[#D4AF37]/20 shadow-inner">
            <button
              onClick={() => onSelectViewMode('search')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'search'
                  ? 'bg-white text-[#18181B] shadow-sm font-black border border-[#D4AF37]/35 scale-[1.02]'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
              title="Search without tracking or intrusive ads"
            >
              <Search className={`w-4 h-4 ${viewMode === 'search' ? 'text-[#D4AF37]' : ''}`} />
              <span>Search</span>
            </button>

            <button
              onClick={() => onSelectViewMode('offerings')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap relative ${
                viewMode === 'offerings'
                  ? 'bg-white text-[#18181B] shadow-sm font-black border border-[#D4AF37]/35 scale-[1.02]'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
              title="Live keyword demand tracker and verified perks"
            >
              <Gift className={`w-4 h-4 ${viewMode === 'offerings' ? 'text-[#D4AF37]' : ''}`} />
              <span>Offerings Hub</span>
              <span className="hidden lg:inline-flex px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#D4AF37]/15 text-[#92400E]">
                Demand
              </span>
            </button>
          </nav>

          {/* Right Action Icons: Privacy Shield & Auth / Placer */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Privacy Shield Anonymized Status */}
            <button
              onClick={onOpenPrivacyShield}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs shrink-0"
              title="Click to view Zero-Surveillance Architecture & Privacy Status"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline font-semibold">100% Anonymized</span>
              <span className="sm:hidden font-semibold">Private</span>
            </button>

            {/* Quick Place Offering Button for Brands */}
            <button
              onClick={onOpenPlaceOfferingModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white text-xs font-bold hover:brightness-105 transition-all shadow-xs cursor-pointer active:scale-95"
              title="Place a verified discount offering on live keyword demand"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Place Offering</span>
            </button>

            {/* Clerk / Profile Access Trigger */}
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] bg-white text-[#18181B] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title="Account, Verified Placer Dashboard & Saved Perks"
            >
              <div className="w-6 h-6 rounded-full bg-[#FAF7EE] border border-[#D4AF37]/40 flex items-center justify-center text-[#C5A028]">
                {userRole === 'brand_placer' ? (
                  <Store className="w-3.5 h-3.5" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="hidden md:flex flex-col text-left leading-none">
                <span className="text-[11px] font-bold text-[#18181B] truncate max-w-[110px]">
                  {userName}
                </span>
                <span className="text-[9px] font-semibold text-[#71717A]">
                  {userRole === 'brand_placer' ? 'Brand Placer' : `Saved $${totalSavedDollars.toFixed(0)}`}
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
