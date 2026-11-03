import React, { useState } from 'react';
import { 
  Gift, 
  TrendingUp, 
  Sparkles, 
  Store, 
  Tag, 
  Percent, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  ArrowUpRight,
  Filter,
  SlidersHorizontal,
  Flame,
  Clock,
  Eye,
  MousePointerClick,
  Copy
} from 'lucide-react';
import { SearchDemand, VerifiedOffering, CategoryType, OfferingMetrics } from '../../types/goldenHour';
import { 
  getSearchDemands, 
  getActiveOfferings, 
  getOfferingsMetrics, 
  recordSneakPeekOpen 
} from '../../services/offeringsService';

interface OfferingsHubViewProps {
  onOpenSneakPeek: (offering: VerifiedOffering) => void;
  onOpenPlaceOffering: (targetDemandKeyword?: string) => void;
  onSelectDemandKeyword: (keyword: string) => void;
}

type SortOption = 'highest_discount' | 'newest' | 'rating' | 'savings';

export function OfferingsHubView({
  onOpenSneakPeek,
  onOpenPlaceOffering,
  onSelectDemandKeyword
}: OfferingsHubViewProps) {
  const [demands, setDemands] = useState<SearchDemand[]>(() => getSearchDemands());
  const [offerings, setOfferings] = useState<VerifiedOffering[]>(() => getActiveOfferings());
  const [metrics, setMetrics] = useState<Record<string, OfferingMetrics>>(() => getOfferingsMetrics());
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [sortBy, setSortBy] = useState<SortOption>('highest_discount');
  const [filterSearch, setFilterSearch] = useState('');

  // Total aggregated platform metrics (zero-PII)
  const totalSneakPeekOpens = Object.values(metrics).reduce((sum, m) => sum + m.sneakPeekOpens, 0);
  const totalCouponCopies = Object.values(metrics).reduce((sum, m) => sum + m.couponCopies, 0);
  const totalOutboundClicks = Object.values(metrics).reduce((sum, m) => sum + m.outboundClicks, 0);

  // Filter & sort offerings
  const filteredOfferings = offerings
    .filter((off) => {
      const matchCat = selectedCategory === 'All' || off.category === selectedCategory;
      const matchText = `${off.title} ${off.brandName} ${off.targetKeyword} ${off.verifiedPerk}`.toLowerCase();
      const matchSearch = !filterSearch || matchText.includes(filterSearch.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'highest_discount') return b.discountPercentage - a.discountPercentage;
      if (sortBy === 'rating') return b.customerRating - a.customerRating;
      if (sortBy === 'savings') return (b.originalPrice - b.discountedPrice) - (a.originalPrice - a.discountedPrice);
      return 0;
    });

  const categories: CategoryType[] = [
    'All',
    'Tech & Hardware',
    'Audio & Hi-Fi',
    'Cloud & Dev Tools',
    'Ergonomic Workspace',
    'Lifestyle & Gear',
    'Specialty Coffee & Food'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 animate-fade-in">
      
      {/* Top Banner / Marketplace Overview */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF7EE] to-[#F5EED9] border-2 border-[#D4AF37]/35 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#D4AF37]/40 text-[#92400E] text-xs font-black">
            <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>The Mutual Value Exchange</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight leading-tight">
            Live Search Demand &amp; Verified Perks Marketplace
          </h1>

          <p className="text-xs sm:text-sm text-[#71717A] font-medium leading-relaxed">
            Real people searching with real intent. Brands meet that demand by offering guaranteed discounts and perks. No surveillance. No auctioning personal data.
          </p>

          {/* Quick CTA to Place Offering */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenPlaceOffering()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#DCB842] hover:to-[#B89320] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span>Place an Offering on Live Demand</span>
            </button>

            <span className="text-xs font-bold text-[#92400E] bg-white/70 px-3 py-2 rounded-xl border border-[#D4AF37]/25">
              Golden Rule: Placements require active discount codes or free perks.
            </span>
          </div>
        </div>

        {/* Aggregated Performance Metric Cards */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative z-10">
          <div className="p-4 rounded-2xl bg-white/90 border border-[#D4AF37]/30 shadow-2xs">
            <div className="flex items-center justify-between text-[#71717A] text-xs font-bold">
              <span>Sneak Peek Opens</span>
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#18181B] mt-1">
              {totalSneakPeekOpens.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
              +14% this week
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-[#D4AF37]/30 shadow-2xs">
            <div className="flex items-center justify-between text-[#71717A] text-xs font-bold">
              <span>Coupons Copied</span>
              <Copy className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#18181B] mt-1">
              {totalCouponCopies.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
              High intent conversions
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-[#D4AF37]/30 shadow-2xs">
            <div className="flex items-center justify-between text-[#71717A] text-xs font-bold">
              <span>Outbound Clicks</span>
              <MousePointerClick className="w-3.5 h-3.5 text-[#C5A028]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#18181B] mt-1">
              {totalOutboundClicks.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#71717A] font-bold mt-0.5">
              Referrer-stripped links
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-[#D4AF37]/30 shadow-2xs">
            <div className="flex items-center justify-between text-[#71717A] text-xs font-bold">
              <span>Zero-PII Status</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
              100%
            </div>
            <div className="text-[10px] text-[#71717A] font-bold mt-0.5">
              No tracking cookies stored
            </div>
          </div>
        </div>
      </div>

      {/* Part A: Live Anonymous Demand Tracker (What People Are Searching For) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-[#D4AF37] border border-[#D4AF37]/30">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
                Live Anonymous Demand Tracker
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#71717A] font-medium mt-0.5">
              Aggregated real-time search volume without user IDs, IP addresses, or tracking cookies.
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Live Search Volume Stream
          </span>
        </div>

        {/* Demand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {demands.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#71717A]">
                  <span className="text-[#C5A028]">{item.category}</span>
                  <span className="text-emerald-700 font-extrabold">{item.growthTrend}</span>
                </div>

                <div 
                  onClick={() => onSelectDemandKeyword(item.keyword)}
                  className="font-extrabold text-base text-[#18181B] group-hover:text-[#C5A028] transition-colors cursor-pointer"
                >
                  &ldquo;{item.keyword}&rdquo;
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#71717A] font-medium">
                  <span className="font-black text-[#18181B] text-sm">{item.searchCount}</span>
                  <span>people {item.timeframeLabel}</span>
                </div>
              </div>

              {/* Action Button: Place offering for this exact demand */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#71717A]">
                  {item.activeOfferingsCount} active {item.activeOfferingsCount === 1 ? 'offering' : 'offerings'}
                </span>

                <button
                  onClick={() => onOpenPlaceOffering(item.keyword)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FAF7EE] hover:bg-[#D4AF37] text-[#92400E] hover:text-white border border-[#D4AF37]/30 transition-colors cursor-pointer flex items-center gap-1"
                  title={`Place a verified discount offering for "${item.keyword}"`}
                >
                  <Store className="w-3 h-3" />
                  <span>Place Offer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Part B: Live Offerings Grid */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-[#D4AF37] border border-[#D4AF37]/30">
                <Gift className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
                Live Verified Offerings &amp; Perks
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#71717A] font-medium mt-0.5">
              Browse top-tier manufacturer discounts, price breaks, and exclusive bundles.
            </p>
          </div>

          {/* Search within offerings & Sort selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Filter offerings..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold bg-white text-[#18181B] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold bg-white text-[#18181B] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="highest_discount">Highest Discount %</option>
              <option value="savings">Biggest $ Savings</option>
              <option value="rating">Top Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#18181B] text-white shadow-xs font-black'
                  : 'bg-white text-[#71717A] hover:text-[#18181B] border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Offerings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOfferings.map((offering) => {
            const savings = (offering.originalPrice - offering.discountedPrice).toFixed(2);
            const offMetrics = metrics[offering.id];

            return (
              <div
                key={offering.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D4AF37]/35 hover:border-[#D4AF37] hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Brand & Category Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#C5A028] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      {offering.brandName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-[#D4AF37]/40">
                      {offering.discountPercentage}% OFF
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-base sm:text-lg text-[#18181B] group-hover:text-[#C5A028] transition-colors leading-snug">
                    {offering.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed">
                    {offering.description}
                  </p>

                  {/* Included Perk Tag */}
                  <div className="p-2.5 rounded-xl bg-[#FAF8F0] border border-[#D4AF37]/25 text-xs text-[#92400E] font-bold flex items-center gap-2">
                    <Gift className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="truncate">{offering.verifiedPerk}</span>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs text-[#71717A] line-through mr-1.5">
                        ${offering.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-lg font-black text-[#18181B]">
                        ${offering.discountedPrice.toFixed(2)}
                      </span>
                    </div>

                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Save ${savings}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Metrics & Sneak Peek Launcher */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[#71717A] font-semibold flex items-center gap-2">
                    <span>★ {offering.customerRating}</span>
                    <span>•</span>
                    <span>{offMetrics?.couponCopies || 48} copies</span>
                  </div>

                  <button
                    onClick={() => {
                      recordSneakPeekOpen(offering.id);
                      onOpenSneakPeek(offering);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white text-xs font-black flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Sneak Peek</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}
