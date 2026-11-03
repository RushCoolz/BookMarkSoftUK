import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  Percent, 
  Clock, 
  Star, 
  CheckCircle2, 
  Lock, 
  Info,
  Gift,
  Truck,
  RotateCcw,
  BadgeCheck
} from 'lucide-react';
import { VerifiedOffering } from '../../types/goldenHour';
import { recordCouponCopy, recordOutboundClick } from '../../services/offeringsService';

interface SneakPeekDrawerProps {
  offering: VerifiedOffering | null;
  onClose: () => void;
  onSavedPerk?: (offering: VerifiedOffering) => void;
  isSaved?: boolean;
}

export function SneakPeekDrawer({
  offering,
  onClose,
  onSavedPerk,
  isSaved = false
}: SneakPeekDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!offering) return null;

  const dollarSavings = (offering.originalPrice - offering.discountedPrice).toFixed(2);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(offering.couponCode);
    setCopied(true);
    recordCouponCopy(offering.id);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleOutboundClick = () => {
    recordOutboundClick(offering.id);
    window.open(offering.destinationUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl bg-[#FAF9F5] border-l border-[#D4AF37]/35 shadow-2xl h-full flex flex-col z-10 overflow-y-auto transform transition-all duration-300">
        
        {/* Golden Hour Decorative Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#C5A028]" />

        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#D4AF37]/20 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-[#D4AF37]/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Verified Offering
              </span>
              <span className="text-xs font-semibold text-[#71717A]">
                {offering.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight leading-snug">
              {offering.title}
            </h2>
            <p className="text-xs font-bold text-[#C5A028] flex items-center gap-1">
              <BadgeCheck className="w-4 h-4 text-[#D4AF37]" />
              Official Storefront: {offering.brandName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#71717A] hover:text-[#18181B] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
            aria-label="Close Sneak Peek"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          
          {/* Section 1: Verified Discount Code Pill */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#FAF6EA] border-2 border-[#D4AF37]/45 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                Verified Promo Code
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Guaranteed Active Today
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 bg-white rounded-xl border border-[#D4AF37]/40 font-mono text-lg sm:text-xl font-black text-[#18181B] tracking-wider select-all text-center sm:text-left">
                {offering.couponCode}
              </div>
              <button
                onClick={handleCopyCode}
                className={`px-4 sm:px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xs whitespace-nowrap ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#D4AF37] hover:bg-[#C5A028] text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            
            {copied && (
              <p className="text-xs font-semibold text-emerald-700 text-center animate-fade-in">
                Promo code copied to clipboard! Paste it at checkout on the brand storefront.
              </p>
            )}
          </div>

          {/* Section 2: Live Value Breakdown */}
          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/25 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#18181B] flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#D4AF37]" />
              Live Value Breakdown
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/60">
                <span className="block text-[11px] font-semibold text-[#71717A]">Retail Price</span>
                <span className="block text-sm sm:text-base font-extrabold line-through text-stone-500 mt-0.5">
                  ${offering.originalPrice.toFixed(2)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-[#D4AF37]/40">
                <span className="block text-[11px] font-bold text-[#92400E]">Discounted</span>
                <span className="block text-base sm:text-lg font-black text-[#18181B] mt-0.5">
                  ${offering.discountedPrice.toFixed(2)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-300">
                <span className="block text-[11px] font-bold text-emerald-800">You Save</span>
                <span className="block text-sm sm:text-base font-black text-emerald-700 mt-0.5">
                  ${dollarSavings} ({offering.discountPercentage}%)
                </span>
              </div>
            </div>

            {/* Included Perk Banner */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F0] border border-[#D4AF37]/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-[#92400E] block">
                  Exclusive Bundled Perk:
                </span>
                <span className="text-xs font-bold text-[#18181B]">
                  {offering.verifiedPerk}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Trust & Verification Badges */}
          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/25 shadow-xs space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#18181B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Trust &amp; Verification Badges
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-[#18181B]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Customer Satisfaction:</strong> {offering.customerRating} / 5.0 rating ({offering.reviewCount} verified buyers)
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[#18181B]">
                <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Refund &amp; Return Policy:</strong> {offering.refundPolicy}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[#18181B]">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Verification Status:</strong> {offering.verifiedAt}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[#18181B]">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Availability:</strong> {offering.stockStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Honesty Disclosure */}
          <div className="p-4 rounded-2xl bg-[#F6F5EE] border border-[#D4AF37]/35 text-xs text-[#71717A] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#18181B]">
              <Info className="w-4 h-4 text-[#C5A028] shrink-0" />
              <span>Honesty &amp; Transparency Disclosure</span>
            </div>
            <p className="leading-relaxed">
              {offering.disclosureNote}
            </p>
            <p className="text-[11px] text-[#92400E] font-semibold pt-1">
              Zero surveillance guarantee: We do not store your IP address, use retargeting pixels, or share your query history with advertisers.
            </p>
          </div>

        </div>

        {/* Footer: Direct Destination CTA */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#D4AF37]/25 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleOutboundClick}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#DCB842] hover:to-[#B89320] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
          >
            <span>Visit {offering.brandName} &amp; Redeem</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSavedPerk && onSavedPerk(offering)}
            className="w-full sm:w-auto py-3.5 px-4 rounded-2xl border border-[#D4AF37]/40 hover:bg-[#FAF8F0] text-[#18181B] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isSaved ? 'Saved to Perks' : 'Save Perk'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
