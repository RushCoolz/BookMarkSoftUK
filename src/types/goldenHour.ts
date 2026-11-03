export type CategoryType = 
  | 'All' 
  | 'Tech & Hardware' 
  | 'Audio & Hi-Fi' 
  | 'Cloud & Dev Tools' 
  | 'Ergonomic Workspace' 
  | 'Lifestyle & Gear' 
  | 'Specialty Coffee & Food';

export interface SearchDemand {
  id: string;
  keyword: string;
  searchCount: number;
  timeframeLabel: string; // e.g. "searched this week", "searched today"
  category: CategoryType;
  growthTrend: string; // e.g. "+24% velocity"
  activeOfferingsCount: number;
  lastSearchedAt: string;
}

export interface VerifiedOffering {
  id: string;
  brandName: string;
  brandLogo?: string;
  targetKeyword: string;
  title: string;
  description: string;
  destinationUrl: string;
  couponCode: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  verifiedPerk: string; // e.g. "Free Worldwide Express Shipping", "Extra Keycap Set Included"
  category: CategoryType;
  refundPolicy: string;
  customerRating: number;
  reviewCount: number;
  staffVerified: boolean;
  verifiedAt: string;
  disclosureNote: string;
  stockStatus: 'In Stock' | 'Limited Batch' | 'Instant Digital Activation';
}

export interface OfferingMetrics {
  offeringId: string;
  sneakPeekOpens: number;
  couponCopies: number;
  outboundClicks: number;
}

export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  category: CategoryType;
  matchedKeyword?: string;
  offering?: VerifiedOffering;
  isOfficialStore?: boolean;
  organicRank?: number;
}

export type PlatformViewMode = 'search' | 'offerings';
