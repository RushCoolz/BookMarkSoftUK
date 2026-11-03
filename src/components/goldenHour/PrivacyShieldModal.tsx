import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Server, 
  EyeOff, 
  Cookie, 
  CheckCircle2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface PrivacyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyShieldModal({ isOpen, onClose }: PrivacyShieldModalProps) {
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
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-amber-500" />

        <div className="p-5 sm:p-7 bg-white border-b border-[#D4AF37]/20 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Surveillance Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
              100% Anonymized Privacy Audit Log
            </h2>
            <p className="text-xs text-[#71717A] font-medium">
              How Golden Hour protects your identity while delivering verified manufacturer perks.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#71717A] hover:text-[#18181B] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* 4 Pillars of Zero Surveillance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Server className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#18181B]">
                1. Client IP Stripped at Edge
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Cloudflare serverless functions automatically drop your client IP, browser fingerprint, and geo-coordinates before communicating with any upstream search engine.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Cookie className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#18181B]">
                2. Zero Tracking Cookies
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                We do not inject third-party ad retargeting pixels, tracking cookies, canvas fingerprinting scripts, or cross-site tracking beacons.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#18181B]">
                3. Referrer-Stripped Outlinks
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                All external destination links use strict `rel=&quot;noreferrer noopener&quot;`. The destination merchant storefront receives zero knowledge of what other searches you executed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <EyeOff className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-[#18181B]">
                4. Intent-Driven Only
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Offerings are matched exclusively to your real-time search keyword. No behavioral profiling or profiling dossiers are ever assembled or sold.
              </p>
            </div>

          </div>

          {/* Privacy Comparison Table */}
          <div className="rounded-2xl border border-stone-200 overflow-hidden text-xs">
            <div className="grid grid-cols-3 bg-[#FAF8F2] p-3 font-extrabold text-[#18181B] border-b border-stone-200">
              <span>Metric</span>
              <span>Traditional Search Engines</span>
              <span className="text-[#92400E]">Golden Hour Engine</span>
            </div>

            <div className="grid grid-cols-3 p-3 border-b border-stone-100 items-center">
              <span className="font-bold text-[#18181B]">Client IP Logging</span>
              <span className="text-rose-700 font-semibold">Logged &amp; Geo-profiled</span>
              <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Dropped at Edge
              </span>
            </div>

            <div className="grid grid-cols-3 p-3 border-b border-stone-100 items-center bg-[#FAF9F5]">
              <span className="font-bold text-[#18181B]">Retargeting Pixels</span>
              <span className="text-rose-700 font-semibold">Dozens injected</span>
              <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Zero Pixels
              </span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-bold text-[#18181B]">Sponsored Placements</span>
              <span className="text-stone-600">Intrusive display ads</span>
              <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Perks Only
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#D4AF37]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white text-xs sm:text-sm font-extrabold cursor-pointer active:scale-95 shadow-xs"
          >
            I Understand &amp; Agree
          </button>
        </div>

      </div>
    </div>
  );
}
