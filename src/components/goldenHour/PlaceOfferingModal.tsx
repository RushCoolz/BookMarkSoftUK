import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Sparkles, 
  Tag, 
  Percent, 
  Gift, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CategoryType, VerifiedOffering } from '../../types/goldenHour';
import { placeVerifiedOffering, getSearchDemands } from '../../services/offeringsService';

interface PlaceOfferingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialKeyword?: string;
  onSuccess: (offering: VerifiedOffering) => void;
}

const CATEGORIES: CategoryType[] = [
  'Tech & Hardware',
  'Audio & Hi-Fi',
  'Cloud & Dev Tools',
  'Ergonomic Workspace',
  'Lifestyle & Gear',
  'Specialty Coffee & Food'
];

export function PlaceOfferingModal({
  isOpen,
  onClose,
  initialKeyword = '',
  onSuccess
}: PlaceOfferingModalProps) {
  const [demands] = useState(() => getSearchDemands());

  const [brandName, setBrandName] = useState('KeyCraft Hardware');
  const [targetKeyword, setTargetKeyword] = useState(initialKeyword || 'mechanical keyboard');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(20);
  const [originalPrice, setOriginalPrice] = useState<number>(150);
  const [discountedPrice, setDiscountedPrice] = useState<number>(120);
  const [verifiedPerk, setVerifiedPerk] = useState('Free Worldwide Shipping + Extra Accessories');
  const [category, setCategory] = useState<CategoryType>('Tech & Hardware');
  const [refundPolicy, setRefundPolicy] = useState('30-Day Hassle-Free Returns with Pre-paid Label');
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Limited Batch' | 'Instant Digital Activation'>('In Stock');

  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Auto calculate discounted price if percentage or original price changes
  const handleOriginalPriceChange = (val: number) => {
    setOriginalPrice(val);
    const calc = Math.max(1, Math.round(val * (1 - discountPercentage / 100) * 100) / 100);
    setDiscountedPrice(calc);
  };

  const handleDiscountPercentageChange = (pct: number) => {
    setDiscountPercentage(pct);
    const calc = Math.max(1, Math.round(originalPrice * (1 - pct / 100) * 100) / 100);
    setDiscountedPrice(calc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    // Enforce The Golden Rule: Must provide real coupon code or perk
    if (!couponCode.trim()) {
      setErrorNotice('The Golden Rule Violation: Every offering must include a verified active coupon code.');
      return;
    }

    if (!verifiedPerk.trim()) {
      setErrorNotice('The Golden Rule Violation: Every offering must include a tangible user perk (e.g. Free Shipping, bundle item).');
      return;
    }

    if (!title.trim() || !brandName.trim() || !destinationUrl.trim()) {
      setErrorNotice('Please fill in your Brand Name, Offering Title, and Destination URL.');
      return;
    }

    const created = placeVerifiedOffering({
      brandName: brandName.trim(),
      targetKeyword: targetKeyword.trim(),
      title: title.trim(),
      description: description.trim() || `Verified direct manufacturer pricing and exclusive perks on authentic ${title}.`,
      destinationUrl: destinationUrl.trim().startsWith('http') ? destinationUrl.trim() : `https://${destinationUrl.trim()}`,
      couponCode: couponCode.trim().toUpperCase(),
      discountPercentage,
      originalPrice,
      discountedPrice,
      verifiedPerk: verifiedPerk.trim(),
      category,
      refundPolicy,
      stockStatus
    });

    onSuccess(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#FAF9F5] border-2 border-[#D4AF37]/45 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Top Gold Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#C5A028]" />

        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#D4AF37]/20 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-[#D4AF37]/40 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
                Brand &amp; Placer Portal
              </span>
              <span className="text-xs font-bold text-emerald-700">
                Direct Intent Placement
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
              Place a Verified Offering on Live Demand
            </h2>
            <p className="text-xs text-[#71717A] font-medium">
              Zero auction algorithms. You connect directly with buyers actively searching for your target keyword.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#71717A] hover:text-[#18181B] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          
          {/* Golden Rule Notice */}
          <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#D4AF37]/35 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-100 text-[#92400E] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-xs space-y-1 text-[#18181B]">
              <strong className="font-extrabold block text-[#92400E]">
                The Golden Rule of Golden Hour Placements:
              </strong>
              <p className="text-[#71717A] font-medium leading-relaxed">
                Standard display and banner ads are strictly prohibited. Every placement MUST offer a verified discount code, manufacturer price break, or exclusive perk. If you cannot provide a perk, you cannot place an offering.
              </p>
            </div>
          </div>

          {errorNotice && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Target Keyword Demand */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-extrabold text-[#18181B] flex items-center justify-between">
                <span>Target Keyword Demand:</span>
                <span className="text-[11px] font-normal text-[#71717A]">
                  Users searching for this exact term will see your offering
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="e.g. mechanical keyboard, ANC headphones"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-[#18181B] focus:border-[#D4AF37] focus:outline-none"
                />
                <select
                  onChange={(e) => e.target.value && setTargetKeyword(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-[#FAF9F5] text-[#18181B] focus:outline-none cursor-pointer"
                >
                  <option value="">Pick from Live Demand</option>
                  {demands.map(d => (
                    <option key={d.id} value={d.keyword}>
                      {d.keyword} ({d.searchCount} searches)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Brand Name */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#18181B]">Brand / Company Name:</label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. KeyCraft Hardware"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-[#18181B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#18181B]">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-[#18181B] focus:border-[#D4AF37] focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Offering Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-extrabold text-[#18181B]">Offering Title:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. KeyCraft 75% Wireless Mechanical Keyboard (Gasket Mount)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-[#18181B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Verified Coupon Code */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#18181B] flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#D4AF37]" />
                <span>Verified Coupon Code:</span>
              </label>
              <input
                type="text"
                required
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. GOLDEN20, NEBULA50"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono font-black text-[#18181B] bg-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Discount Percentage */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#18181B] flex items-center gap-1">
                <Percent className="w-3 h-3 text-[#D4AF37]" />
                <span>Discount Percentage (%):</span>
              </label>
              <input
                type="number"
                min={5}
                max={90}
                required
                value={discountPercentage}
                onChange={(e) => handleDiscountPercentageChange(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-[#18181B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Original Retail Price */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#18181B]">Retail Price ($ USD):</label>
              <input
                type="number"
                step="0.01"
                min={1}
                required
                value={originalPrice}
                onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-[#18181B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Discounted Price */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#18181B]">Discounted Price ($ USD):</label>
              <input
                type="number"
                step="0.01"
                min={0.5}
                required
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-[#18181B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Verified Perk */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-extrabold text-[#18181B] flex items-center gap-1">
                <Gift className="w-3 h-3 text-[#D4AF37]" />
                <span>Verified Tangible Perk (Required):</span>
              </label>
              <input
                type="text"
                required
                value={verifiedPerk}
                onChange={(e) => setVerifiedPerk(e.target.value)}
                placeholder="e.g. Free Worldwide Express Shipping + Sound-Dampening Kit ($38 value)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-[#18181B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Destination URL */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-extrabold text-[#18181B]">Storefront Destination URL:</label>
              <input
                type="text"
                required
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://yourbrand.com/product-slug"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-[#18181B] focus:border-[#D4AF37] focus:outline-none"
              />
              <span className="text-[11px] text-[#71717A]">
                Opened with secure referrer-stripped tags (`rel=&quot;noreferrer noopener&quot;`).
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-extrabold text-[#18181B]">Product Summary &amp; Key Features:</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly highlight hardware specs, materials, or features..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium bg-white text-[#18181B] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#71717A] hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#DCB842] hover:to-[#B89320] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>Publish Verified Offering</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
