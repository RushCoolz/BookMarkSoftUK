import React, { useState } from 'react';
import { 
  X, 
  User, 
  Store, 
  Sparkles, 
  Tag, 
  Gift, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  Percent,
  CheckCircle2,
  Copy,
  BarChart2,
  LogOut
} from 'lucide-react';
import { VerifiedOffering } from '../../types/goldenHour';
import { getActiveOfferings, getOfferingsMetrics } from '../../services/offeringsService';

interface AuthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'shopper' | 'brand_placer';
  onSwitchRole: (role: 'shopper' | 'brand_placer') => void;
  savedPerks: VerifiedOffering[];
  onOpenSneakPeek: (offering: VerifiedOffering) => void;
  onOpenPlaceOffering: () => void;
}

export function AuthProfileModal({
  isOpen,
  onClose,
  userRole,
  onSwitchRole,
  savedPerks,
  onOpenSneakPeek,
  onOpenPlaceOffering
}: AuthProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'perks' | 'placer_analytics'>('profile');
  const offerings = getActiveOfferings();
  const metrics = getOfferingsMetrics();

  // If user is brand placer, show their placed offerings
  const brandOfferings = offerings.filter(o => o.brandName.includes('KeyCraft') || o.brandName.includes('Aether'));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#FAF9F5] border-2 border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Top Accent Strip */}
        <div className="h-2 w-full bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#C5A028]" />

        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#D4AF37]/20 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-[#D4AF37]/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                User &amp; Placer Profile
              </span>
              <span className="text-xs font-semibold text-[#71717A]">
                Clerk Auth Integrated
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
              {userRole === 'brand_placer' ? 'Brand Placer Command Console' : 'Shopper Sanctuary'}
            </h2>
            <p className="text-xs text-[#71717A] font-medium">
              Manage saved verified perks or view real-time placement analytics.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#71717A] hover:text-[#18181B] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-[#D4AF37]/15 flex items-center gap-4 bg-white text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#D4AF37] text-[#18181B] font-black'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Account &amp; Roles
          </button>

          <button
            onClick={() => setActiveTab('perks')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'perks'
                ? 'border-[#D4AF37] text-[#18181B] font-black'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>Saved Perks</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-[#92400E]">
              {savedPerks.length}
            </span>
          </button>

          {userRole === 'brand_placer' && (
            <button
              onClick={() => setActiveTab('placer_analytics')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'placer_analytics'
                  ? 'border-[#D4AF37] text-[#18181B] font-black'
                : 'border-transparent text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              <span>My Placements</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                {brandOfferings.length}
              </span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* View: Account & Roles */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Role Toggle Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-2xs space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#18181B]">
                  Active Role Switcher (Zero Friction Testing)
                </h3>
                <p className="text-xs text-[#71717A] font-medium leading-relaxed">
                  Switch instantly between an Anonymous Shopper and a Verified Brand Placer to test placement flows, live metrics, and perk redemption:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => onSwitchRole('shopper')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      userRole === 'shopper'
                        ? 'border-[#D4AF37] bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#18181B] flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#D4AF37]" />
                        Anonymous Shopper
                      </span>
                      {userRole === 'shopper' && (
                        <Check className="w-4 h-4 text-[#D4AF37]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-1 font-medium">
                      Search privately, copy promo codes, and save perks without tracking cookies.
                    </p>
                  </button>

                  <button
                    onClick={() => onSwitchRole('brand_placer')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      userRole === 'brand_placer'
                        ? 'border-[#D4AF37] bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#18181B] flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-[#D4AF37]" />
                        Verified Brand Placer
                      </span>
                      {userRole === 'brand_placer' && (
                        <Check className="w-4 h-4 text-[#D4AF37]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-1 font-medium">
                      Place verified discount offerings directly on real user search demand keywords.
                    </p>
                  </button>
                </div>
              </div>

              {/* Clerk Sign-In info card */}
              <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/25 text-xs text-[#71717A] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#18181B]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Clerk Security Architecture</span>
                </div>
                <p className="leading-relaxed">
                  Search and Sneak Peek previews remain 100% public, cookie-less, and anonymous for shoppers. Brand placers authenticate via Clerk SDK to protect their offerings and review transparent conversion telemetry.
                </p>
              </div>

            </div>
          )}

          {/* View: Saved Perks */}
          {activeTab === 'perks' && (
            <div className="space-y-4">
              {savedPerks.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200/80 space-y-2">
                  <Gift className="w-8 h-8 text-[#D4AF37] mx-auto opacity-70" />
                  <p className="text-sm font-extrabold text-[#18181B]">
                    No Saved Perks Yet
                  </p>
                  <p className="text-xs text-[#71717A]">
                    When you view a Sneak Peek drawer on any search result, tap &quot;Save Perk&quot; to bookmark active discount codes here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPerks.map((perk) => (
                    <div
                      key={perk.id}
                      className="p-4 rounded-2xl bg-white border border-[#D4AF37]/35 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#C5A028] block">
                          {perk.brandName}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#18181B]">
                          {perk.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                          <Tag className="w-3 h-3 text-[#D4AF37]" />
                          <span>Code: {perk.couponCode} ({perk.discountPercentage}% OFF)</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenSneakPeek(perk);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FAF7EE] hover:bg-[#D4AF37] text-[#92400E] hover:text-white border border-[#D4AF37]/30 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                      >
                        View Perk &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View: Placer Analytics */}
          {activeTab === 'placer_analytics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#18181B]">
                  Your Active Keyword Placements
                </h3>
                <button
                  onClick={() => {
                    onClose();
                    onOpenPlaceOffering();
                  }}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white text-xs font-bold cursor-pointer"
                >
                  + New Placement
                </button>
              </div>

              <div className="space-y-3">
                {brandOfferings.map((bOff) => {
                  const m = metrics[bOff.id] || { sneakPeekOpens: 120, couponCopies: 64, outboundClicks: 42 };

                  return (
                    <div
                      key={bOff.id}
                      className="p-4 rounded-2xl bg-white border border-[#D4AF37]/30 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-bold text-[#C5A028] uppercase">
                            Demand Keyword: &ldquo;{bOff.targetKeyword}&rdquo;
                          </span>
                          <h4 className="text-sm font-extrabold text-[#18181B] mt-0.5">
                            {bOff.title}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300">
                          {bOff.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded-xl bg-[#FAF9F5]">
                          <span className="block text-[10px] font-semibold text-[#71717A]">Sneak Peeks</span>
                          <span className="block font-black text-[#18181B] text-sm">{m.sneakPeekOpens}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#FAF9F5]">
                          <span className="block text-[10px] font-semibold text-[#71717A]">Copies</span>
                          <span className="block font-black text-emerald-700 text-sm">{m.couponCopies}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#FAF9F5]">
                          <span className="block text-[10px] font-semibold text-[#71717A]">Outbounds</span>
                          <span className="block font-black text-[#C5A028] text-sm">{m.outboundClicks}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#D4AF37]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#18181B] text-white text-xs sm:text-sm font-extrabold cursor-pointer active:scale-95 shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
