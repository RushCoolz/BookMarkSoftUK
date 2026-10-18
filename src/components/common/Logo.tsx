import React from "react";

export function Logo({ className = "w-8 h-8", showBadge = true }: { className?: string; showBadge?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 32 38" 
          className={className}
        >
          <defs>
            <linearGradient id="b-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            
            <linearGradient id="mark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.25" />
            </filter>
          </defs>
          
          {/* The Letter B */}
          <path 
            d="M 8 28 V 4 h 8 a 6 6 0 0 1 0 12 H 8 h 9 a 6 6 0 0 1 0 12 H 8" 
            stroke="url(#b-grad)" 
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* The Bookmark dropping from the letter */}
          <path 
            d="M 13 19 h 6 v 17 l -3 -3 l -3 3 z" 
            fill="url(#mark-grad)" 
            filter="url(#shadow)"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white shrink-0">
            BookMark<span className="text-blue-600 dark:text-blue-400">Soft</span>
          </span>
          {showBadge && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              UK
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
          Career Intelligence &amp; UK Utilities
        </span>
      </div>
    </div>
  );
}
