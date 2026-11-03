import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  ArrowRight, 
  Filter, 
  Tag, 
  Percent, 
  Gift, 
  Lock, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { SearchResultItem, VerifiedOffering, CategoryType } from '../../types/goldenHour';
import { executeGoldenSearch, recordAnonymousSearch, recordSneakPeekOpen } from '../../services/offeringsService';

interface SearchEngineViewProps {
  onOpenSneakPeek: (offering: VerifiedOffering) => void;
  onOpenPrivacyShield: () => void;
  onSelectDemandKeyword?: (keyword: string) => void;
}

const CATEGORIES: CategoryType[] = [
  'All',
  'Tech & Hardware',
  'Audio & Hi-Fi',
  'Cloud & Dev Tools',
  'Ergonomic Workspace',
  'Lifestyle & Gear',
  'Specialty Coffee & Food'
];

const SUGGESTED_INTENTS = [
  { keyword: 'mechanical keyboard', label: 'Mechanical Keyboards', perkTag: '20% Off + Keycaps' },
  { keyword: 'anc headphones', label: 'ANC Headphones', perkTag: '35% Off + 3-Yr Warranty' },
  { keyword: 'developer cloud vps', label: 'Developer Cloud VPS', perkTag: '$50 Credit + No Egress' },
  { keyword: 'ergonomic desk', label: 'Ergonomic Desks', perkTag: '25% Off + Monitor Arm' },
  { keyword: 'specialty coffee', label: 'Specialty Coffee', perkTag: '30% Off Box' },
  { keyword: 'waterproof backpack', label: 'Waterproof Backpack', perkTag: '20% Off + Packing Cubes' }
];

export function SearchEngineView({
  onOpenSneakPeek,
  onOpenPrivacyShield
}: SearchEngineViewProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [activeIntentLabel, setActiveIntentLabel] = useState('Curated Verified Offerings');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Perform search on query or category change
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      const { results, queryIntentLabel } = executeGoldenSearch(query, selectedCategory);
      setSearchResults(results);
      setActiveIntentLabel(queryIntentLabel);
      setIsSearching(false);

      if (query.trim().length >= 3) {
        recordAnonymousSearch(query, selectedCategory);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const handleSelectSuggested = (keyword: string) => {
    setQuery(keyword);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-fade-in">
      
      {/* Search Hero Area */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6EA] border border-[#D4AF37]/40 text-[#92400E] text-xs font-extrabold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>The Zero-Surveillance Offerings Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#18181B] leading-tight font-sans">
          Search Without Deception.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#C5A028]">
            Every Result Has Value.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#71717A] font-medium leading-relaxed">
          Zero commercial tracking pixels. Real discounts, manufacturer perks, and honest direct previews on every verified merchant result.
        </p>
      </div>

      {/* Main Search Input Card */}
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="relative flex items-center rounded-2xl bg-white border-2 border-[#D4AF37]/40 focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#D4AF37]/15 shadow-lg transition-all duration-200">
          
          <div className="pl-4 sm:pl-5 text-[#C5A028] pointer-events-none">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verified products, perks, or tech (e.g. mechanical keyboard, ANC headphones, VPS)..."
            className="w-full py-4 sm:py-5 pl-3 sm:pl-4 pr-24 sm:pr-28 text-sm sm:text-base font-bold text-[#18181B] placeholder:text-[#71717A]/70 bg-transparent focus:outline-none"
            aria-label="Search query"
          />

          {query && (
            <button
              onClick={handleClear}
              className="mr-2 p-1.5 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              title="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="absolute right-2 sm:right-2.5 flex items-center">
            <button
              onClick={() => {
                if (query) recordAnonymousSearch(query, selectedCategory);
              }}
              className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#DCB842] hover:to-[#B89320] text-white text-xs sm:text-sm font-black transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Search
            </button>
          </div>
        </div>

        {/* Instant Anonymization Bar (Section 3.A from Blueprint) */}
        <div 
          onClick={onOpenPrivacyShield}
          className="mt-2.5 px-3 py-1.5 rounded-xl bg-[#FAF8F2] border border-[#D4AF37]/25 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#71717A] cursor-pointer hover:border-[#D4AF37]/50 transition-colors"
        >
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold">Instant Shield Active:</span>
            <span className="text-[#18181B]">Client IP dropped at edge · Zero cookies · Query scrubbed</span>
          </div>

          <div className="flex items-center gap-1 text-[#92400E] font-extrabold hover:underline">
            <Lock className="w-3 h-3 text-[#D4AF37]" />
            <span>Privacy Audit Log &rarr;</span>
          </div>
        </div>
      </div>

      {/* Suggested Search Intents & Active Demand Chips */}
      <div className="space-y-2 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs font-bold text-[#71717A]">
          <span className="flex items-center gap-1.5 text-[#18181B]">
            <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
            Trending Search Intents with Verified Perks:
          </span>
          <span className="text-[11px] text-[#C5A028]">Click to search</span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {SUGGESTED_INTENTS.map((item) => (
            <button
              key={item.keyword}
              onClick={() => handleSelectSuggested(item.keyword)}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                query.toLowerCase() === item.keyword
                  ? 'bg-amber-100/90 text-amber-950 border-[#D4AF37] font-black shadow-xs'
                  : 'bg-white text-[#18181B] border-stone-200/80 hover:border-[#D4AF37]/50 hover:bg-[#FAF8F0]'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#FAF6EA] text-[#92400E] border border-[#D4AF37]/30 font-semibold group-hover:bg-[#D4AF37]/20 transition-colors">
                {item.perkTag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-4xl mx-auto no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#18181B] text-white shadow-xs font-black'
                : 'bg-white text-[#71717A] hover:text-[#18181B] border border-stone-200/60 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 max-w-4xl mx-auto">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
            {activeIntentLabel}
          </h2>
          <p className="text-xs text-[#71717A] font-medium">
            Found {searchResults.length} verified results &amp; independent sources
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Zero Display Ads
          </span>
        </div>
      </div>

      {/* Search Results List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {searchResults.map((result) => {
          const hasOffering = !!result.offering;
          const off = result.offering;

          return (
            <div
              key={result.id}
              className={`p-5 sm:p-6 rounded-2xl bg-white border transition-all duration-200 ${
                hasOffering
                  ? 'border-[#D4AF37]/40 hover:border-[#D4AF37] hover:shadow-md'
                  : 'border-stone-200/80 hover:border-stone-300 hover:shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Result Info */}
                <div className="space-y-2 flex-1 min-w-0">
                  
                  {/* URL & Source Badge */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#C5A028] truncate">
                      {result.displayUrl}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[11px] font-semibold text-[#71717A]">
                      {result.category}
                    </span>
                    {result.isOfficialStore && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-[#FAF6EA] text-[#92400E] border border-[#D4AF37]/40">
                        Official Storefront
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#18181B] hover:text-[#C5A028] transition-colors leading-snug">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      {result.title}
                    </a>
                  </h3>

                  {/* Snippet */}
                  <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                    {result.snippet}
                  </p>

                  {/* Value Ribbon if offering exists */}
                  {hasOffering && off && (
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 border border-[#D4AF37]/50 text-xs font-black">
                        <Tag className="w-3 h-3 text-[#D4AF37]" />
                        {off.discountPercentage}% OFF with {off.couponCode}
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-extrabold">
                        <Gift className="w-3 h-3 text-emerald-600" />
                        {off.verifiedPerk}
                      </span>

                      <span className="text-xs font-bold text-[#71717A]">
                        Was <span className="line-through">${off.originalPrice.toFixed(2)}</span> &rarr;{' '}
                        <strong className="text-[#18181B] font-extrabold">${off.discountedPrice.toFixed(2)}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Sneak Peek Interactive Drawer Trigger (Section 3.B from Blueprint) */}
                {hasOffering && off && (
                  <div className="shrink-0 flex sm:flex-col items-center justify-between sm:justify-start gap-2 pt-2 sm:pt-0">
                    <button
                      onClick={() => {
                        recordSneakPeekOpen(off.id);
                        onOpenSneakPeek(off);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#DCB842] hover:to-[#B89320] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                      title="Open interactive preview of verified coupon, live value breakdown, and trust badges"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Sneak Peek &amp; Offerings</span>
                    </button>
                    
                    <span className="text-[10px] font-bold text-emerald-700 hidden sm:block text-center">
                      Verified by Staff
                    </span>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
