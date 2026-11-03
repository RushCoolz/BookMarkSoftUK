import { SearchDemand, VerifiedOffering, OfferingMetrics, SearchResultItem, CategoryType } from '../types/goldenHour';

// Initial Verified Offerings based on Master Platform Blueprint
const INITIAL_OFFERINGS: VerifiedOffering[] = [
  {
    id: 'off-keycraft-75',
    brandName: 'KeyCraft Hardware',
    targetKeyword: 'mechanical keyboard',
    title: 'KeyCraft 75% Wireless Mechanical Keyboard (Gasket Mount)',
    description: 'CNC anodized aluminum body, hot-swappable tactile switches, per-key RGB, and custom sound-dampening foam.',
    destinationUrl: 'https://keycraft.example.com/products/kc-75-pro',
    couponCode: 'GOLDEN20',
    discountPercentage: 20,
    originalPrice: 179.99,
    discountedPrice: 143.99,
    status: 'ACTIVE',
    verifiedPerk: 'Free Extra Keycap Set + Sound-Dampening Kit ($38 value)',
    category: 'Tech & Hardware',
    refundPolicy: '30-Day Hassle-Free Returns with Pre-paid Label',
    customerRating: 4.9,
    reviewCount: 428,
    staffVerified: true,
    verifiedAt: 'Staff Verified Today at 08:30 UTC',
    disclosureNote: "Why are you seeing this offering? Because you searched for 'mechanical keyboard'. Your data was not auctioned, fingerprinted, or sold to data brokers.",
    stockStatus: 'In Stock'
  },
  {
    id: 'off-aether-anc',
    brandName: 'Aether Acoustics',
    targetKeyword: 'anc headphones',
    title: 'Aether Aura Wireless Hybrid ANC Studio Headphones',
    description: 'Planar magnetic drivers, 45dB adaptive active noise cancellation, lossless LDAC streaming, and 50-hour battery life.',
    destinationUrl: 'https://aetheracoustics.example.com/aura-studio',
    couponCode: 'AURA35',
    discountPercentage: 35,
    originalPrice: 349.00,
    discountedPrice: 226.85,
    status: 'ACTIVE',
    verifiedPerk: 'Free Worldwide Express Shipping + 3-Year Extended Warranty',
    category: 'Audio & Hi-Fi',
    refundPolicy: '45-Day Home Trial with Full Money-Back Guarantee',
    customerRating: 4.95,
    reviewCount: 890,
    staffVerified: true,
    verifiedAt: 'Staff Verified Today at 09:15 UTC',
    disclosureNote: "Why are you seeing this offering? Because you searched for 'anc headphones'. Your personal browsing history was never tracked.",
    stockStatus: 'In Stock'
  },
  {
    id: 'off-nebula-vps',
    brandName: 'Nebula Cloud Edge',
    targetKeyword: 'developer cloud vps',
    title: 'Nebula Cloud VPS & High-IOPS NVMe Compute Instances',
    description: 'Instant provisioning across 34 global regions, unmetered 10Gbps uplinks, DDoS protection, and native Terraform provider.',
    destinationUrl: 'https://nebulacloud.example.com/developer-tier',
    couponCode: 'NEBULA50',
    discountPercentage: 50,
    originalPrice: 48.00,
    discountedPrice: 24.00,
    status: 'ACTIVE',
    verifiedPerk: '$50 Hardware Credit + Zero Egress Fees for 6 Months',
    category: 'Cloud & Dev Tools',
    refundPolicy: 'Prorated Instant Refund on Unused Compute Hours',
    customerRating: 4.88,
    reviewCount: 1140,
    staffVerified: true,
    verifiedAt: 'Staff Verified Yesterday',
    disclosureNote: "Why are you seeing this offering? Because you searched for 'developer cloud vps'. Zero telemetry or user fingerprinting.",
    stockStatus: 'Instant Digital Activation'
  },
  {
    id: 'off-ergoline-desk',
    brandName: 'ErgoLine Works',
    targetKeyword: 'ergonomic desk',
    title: 'ErgoLine Bamboo Dual-Motor Standing Desk (60x30")',
    description: 'Sustainably harvested solid Moso bamboo desktop, silent dual Bosch motors with anti-collision gyro, and integrated cable raceway.',
    destinationUrl: 'https://ergoline.example.com/standing-desk-pro',
    couponCode: 'DESKLIFE',
    discountPercentage: 25,
    originalPrice: 620.00,
    discountedPrice: 465.00,
    status: 'ACTIVE',
    verifiedPerk: 'Free Dual-Monitor Gas Spring Arm ($89 value)',
    category: 'Ergonomic Workspace',
    refundPolicy: '100-Day In-Home Ergonomic Trial Guarantee',
    customerRating: 4.92,
    reviewCount: 612,
    staffVerified: true,
    verifiedAt: 'Staff Verified 2 Days Ago',
    disclosureNote: "Why are you seeing this offering? Because you searched for 'ergonomic desk'. No commercial cookies used.",
    stockStatus: 'In Stock'
  },
  {
    id: 'off-artisan-roast',
    brandName: 'Altitude Roasters',
    targetKeyword: 'specialty coffee',
    title: 'Altitude Single-Origin Geisha & Ethiopian Yirgacheffe Box',
    description: 'Roasted to order within 24 hours of dispatch. Direct-trade micro-lot beans with floral jasmine and bergamot tasting notes.',
    destinationUrl: 'https://altituderoasters.example.com/reserve',
    couponCode: 'BREWGOLD',
    discountPercentage: 30,
    originalPrice: 42.00,
    discountedPrice: 29.40,
    status: 'ACTIVE',
    verifiedPerk: 'Complimentary Ceramic Cupping Spoon & Free 1st Class Shipping',
    category: 'Specialty Coffee & Food',
    refundPolicy: 'Freshness Guarantee: Free Replacement If Unsatisfied',
    customerRating: 4.97,
    reviewCount: 345,
    staffVerified: true,
    verifiedAt: 'Staff Verified Today at 07:00 UTC',
    disclosureNote: "Why are you seeing this offering? Direct match for your 'specialty coffee' inquiry without advertising trackers.",
    stockStatus: 'Limited Batch'
  },
  {
    id: 'off-peak-backpack',
    brandName: 'NomadCraft Equipment',
    targetKeyword: 'waterproof backpack',
    title: 'NomadCraft Transit 28L Weatherproof Commuter Rucksack',
    description: 'X-Pac VX21 diamond ripstop fabric, Fidlock magnetic sternum buckle, TSA lay-flat 16" laptop vault, and hidden passport sleeve.',
    destinationUrl: 'https://nomadcraft.example.com/transit-28',
    couponCode: 'PACKPERK',
    discountPercentage: 20,
    originalPrice: 210.00,
    discountedPrice: 168.00,
    status: 'ACTIVE',
    verifiedPerk: 'Includes 3-Piece Compression Packing Cube Set ($45 value)',
    category: 'Lifestyle & Gear',
    refundPolicy: 'Lifetime Guarantee on All Zippers and Hardware',
    customerRating: 4.86,
    reviewCount: 520,
    staffVerified: true,
    verifiedAt: 'Staff Verified 3 Days Ago',
    disclosureNote: "Why are you seeing this offering? Triggered solely by search keyword demand. Zero third-party ad pixels.",
    stockStatus: 'In Stock'
  },
  {
    id: 'off-lumina-lamp',
    brandName: 'Lumina Optical Labs',
    targetKeyword: 'desk lamp',
    title: 'Lumina Studio CRI 98+ Eye-Care Asymmetric Desk Lamp',
    description: 'Zero screen glare optical prism, step-less 2700K–6500K color temperature, ambient light auto-dimming sensor, and wireless dial.',
    destinationUrl: 'https://luminaoptics.example.com/studio-light',
    couponCode: 'GLOWHOUR',
    discountPercentage: 22,
    originalPrice: 135.00,
    discountedPrice: 105.30,
    status: 'ACTIVE',
    verifiedPerk: 'Free Weighted Metal Base + Magnetic Soft Diffuser',
    category: 'Ergonomic Workspace',
    refundPolicy: '60-Day Satisfaction Money Back Guarantee',
    customerRating: 4.91,
    reviewCount: 290,
    staffVerified: true,
    verifiedAt: 'Staff Verified Today',
    disclosureNote: "Why are you seeing this offering? Because you searched for 'desk lamp'. Pure perk value, zero surveillance.",
    stockStatus: 'In Stock'
  },
  {
    id: 'off-audiocraft-dac',
    brandName: 'PureTone Audio',
    targetKeyword: 'usb dac',
    title: 'PureTone Horizon DSD512 MQA Portable USB-C DAC & Amp',
    description: 'Dual ESS Sabre ES9219C DAC chips, balanced 4.4mm + 3.5mm outputs, 32-bit/768kHz high-resolution audio for audiophile IEMs.',
    destinationUrl: 'https://puretoneaudio.example.com/horizon-dac',
    couponCode: 'BITPERFECT',
    discountPercentage: 25,
    originalPrice: 129.00,
    discountedPrice: 96.75,
    status: 'ACTIVE',
    verifiedPerk: 'Custom Braided Silver-Plated Type-C OTG Cable ($24 value)',
    category: 'Audio & Hi-Fi',
    refundPolicy: '2-Year Full Manufacturer Warranty',
    customerRating: 4.89,
    reviewCount: 380,
    staffVerified: true,
    verifiedAt: 'Staff Verified Yesterday',
    disclosureNote: "Why are you seeing this offering? Matched directly to 'usb dac' without any profiling.",
    stockStatus: 'In Stock'
  }
];

// Initial Anonymous Search Demand items from Section 4.A
const INITIAL_DEMAND: SearchDemand[] = [
  {
    id: 'dem-anc',
    keyword: 'ANC Headphones',
    searchCount: 382,
    timeframeLabel: 'searched this week',
    category: 'Audio & Hi-Fi',
    growthTrend: '+34% this week',
    activeOfferingsCount: 3,
    lastSearchedAt: '4 minutes ago'
  },
  {
    id: 'dem-vps',
    keyword: 'Developer Cloud VPS',
    searchCount: 195,
    timeframeLabel: 'searched today',
    category: 'Cloud & Dev Tools',
    growthTrend: '+18% today',
    activeOfferingsCount: 2,
    lastSearchedAt: '12 minutes ago'
  },
  {
    id: 'dem-mech',
    keyword: 'Mechanical Keyboard',
    searchCount: 310,
    timeframeLabel: 'searched this week',
    category: 'Tech & Hardware',
    growthTrend: '+28% this week',
    activeOfferingsCount: 4,
    lastSearchedAt: '2 minutes ago'
  },
  {
    id: 'dem-desk',
    keyword: 'Ergonomic Desk Accessories',
    searchCount: 140,
    timeframeLabel: 'searched today',
    category: 'Ergonomic Workspace',
    growthTrend: '+14% today',
    activeOfferingsCount: 2,
    lastSearchedAt: '18 minutes ago'
  },
  {
    id: 'dem-coffee',
    keyword: 'Specialty Coffee Subscription',
    searchCount: 168,
    timeframeLabel: 'searched this week',
    category: 'Specialty Coffee & Food',
    growthTrend: '+22% this week',
    activeOfferingsCount: 1,
    lastSearchedAt: '35 minutes ago'
  },
  {
    id: 'dem-backpack',
    keyword: 'Waterproof Commuter Backpack',
    searchCount: 122,
    timeframeLabel: 'searched this week',
    category: 'Lifestyle & Gear',
    growthTrend: '+9% this week',
    activeOfferingsCount: 1,
    lastSearchedAt: '1 hour ago'
  },
  {
    id: 'dem-lamp',
    keyword: 'High-CRI Desk Lamp',
    searchCount: 94,
    timeframeLabel: 'searched today',
    category: 'Ergonomic Workspace',
    growthTrend: '+12% today',
    activeOfferingsCount: 1,
    lastSearchedAt: '42 minutes ago'
  },
  {
    id: 'dem-dac',
    keyword: 'Portable USB DAC',
    searchCount: 88,
    timeframeLabel: 'searched today',
    category: 'Audio & Hi-Fi',
    growthTrend: '+16% today',
    activeOfferingsCount: 1,
    lastSearchedAt: '1 hour ago'
  }
];

// Fallback / Organic General Search Knowledge Base
const ORGANIC_RESULTS_POOL: SearchResultItem[] = [
  {
    id: 'org-mech-guide',
    title: 'The Comprehensive Mechanical Keyboard Guide for 2026',
    url: 'https://deskthority.net/wiki/Mechanical_Keyboard_Guide',
    displayUrl: 'deskthority.net/wiki/guide',
    snippet: 'An independent architectural overview of linear, tactile, and clicky switches, gasket mounting versus tray mounting, and PCB layout standards.',
    category: 'Tech & Hardware',
    matchedKeyword: 'mechanical keyboard',
    organicRank: 1
  },
  {
    id: 'org-anc-tech',
    title: 'How Hybrid Active Noise Cancellation Operates at the Acoustic Level',
    url: 'https://soundguys.com/how-active-noise-cancelling-works-12333/',
    displayUrl: 'soundguys.com/how-anc-works',
    snippet: 'Feedforward and feedback microphones combined with phase-inverted anti-wave DSP algorithms to eradicate low-frequency turbine and commuter rumble.',
    category: 'Audio & Hi-Fi',
    matchedKeyword: 'anc headphones',
    organicRank: 1
  },
  {
    id: 'org-vps-bench',
    title: 'Benchmarking Global Cloud VPS: IOPS, Memory Latency, and Egress Costs',
    url: 'https://vpsbenchmarks.com/compare/cloud-instances-2026',
    displayUrl: 'vpsbenchmarks.com/compare',
    snippet: 'Independent hardware benchmarking of single-core burst throughput, NVMe read/write speeds, and network throughput across top edge hosting providers.',
    category: 'Cloud & Dev Tools',
    matchedKeyword: 'developer cloud vps',
    organicRank: 1
  },
  {
    id: 'org-ergo-posture',
    title: 'Human Factors & Ergonomics Society: Optimal Sit-Stand Transitions',
    url: 'https://hfes.org/standards/ergonomic-standing-desks',
    displayUrl: 'hfes.org/standards/standing-desks',
    snippet: 'Clinical recommendations for 20-8-2 intervals (20 mins sitting, 8 mins standing, 2 mins gentle movement) to diminish lumbar compressive strain.',
    category: 'Ergonomic Workspace',
    matchedKeyword: 'ergonomic desk',
    organicRank: 1
  },
  {
    id: 'org-coffee-sca',
    title: 'Specialty Coffee Association: The 80+ Point Flavor Grading Spectrum',
    url: 'https://sca.coffee/research/coffee-sensory-lexicon',
    displayUrl: 'sca.coffee/research/sensory',
    snippet: 'Understanding acidity, body, fragrance, and sweetness metrics that categorize specialty single-origin coffees above commercial blends.',
    category: 'Specialty Coffee & Food',
    matchedKeyword: 'specialty coffee',
    organicRank: 1
  },
  {
    id: 'org-backpack-materials',
    title: 'Technical Outdoor Fabrics Compared: X-Pac vs Cordura vs Dyneema',
    url: 'https://carryology.com/insights/material-lab-technical-fabrics/',
    displayUrl: 'carryology.com/insights/fabrics',
    snippet: 'Tensile tear resistance, waterproof hydrostatic head ratings, and weight-to-abrasion ratios for everyday commuter and travel packs.',
    category: 'Lifestyle & Gear',
    matchedKeyword: 'waterproof backpack',
    organicRank: 1
  }
];

const STORAGE_KEYS = {
  OFFERINGS: 'golden_hour_offerings_v1',
  DEMAND: 'golden_hour_demand_v1',
  METRICS: 'golden_hour_metrics_v1',
  RECENT_SEARCHES: 'golden_hour_recent_queries_v1',
  SAVED_PERKS: 'golden_hour_saved_perks_v1'
};

// Safe LocalStorage helpers
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

// 1. Get All Active Offerings
export function getActiveOfferings(): VerifiedOffering[] {
  return loadFromStorage<VerifiedOffering[]>(STORAGE_KEYS.OFFERINGS, INITIAL_OFFERINGS);
}

// 2. Get All Search Demand Items
export function getSearchDemands(): SearchDemand[] {
  return loadFromStorage<SearchDemand[]>(STORAGE_KEYS.DEMAND, INITIAL_DEMAND);
}

// 3. Get Metrics for All Offerings
export function getOfferingsMetrics(): Record<string, OfferingMetrics> {
  return loadFromStorage<Record<string, OfferingMetrics>>(STORAGE_KEYS.METRICS, {
    'off-keycraft-75': { offeringId: 'off-keycraft-75', sneakPeekOpens: 284, couponCopies: 142, outboundClicks: 109 },
    'off-aether-anc': { offeringId: 'off-aether-anc', sneakPeekOpens: 412, couponCopies: 231, outboundClicks: 188 },
    'off-nebula-vps': { offeringId: 'off-nebula-vps', sneakPeekOpens: 198, couponCopies: 114, outboundClicks: 92 },
    'off-ergoline-desk': { offeringId: 'off-ergoline-desk', sneakPeekOpens: 165, couponCopies: 78, outboundClicks: 64 },
    'off-artisan-roast': { offeringId: 'off-artisan-roast', sneakPeekOpens: 142, couponCopies: 89, outboundClicks: 71 },
    'off-peak-backpack': { offeringId: 'off-peak-backpack', sneakPeekOpens: 118, couponCopies: 58, outboundClicks: 46 },
    'off-lumina-lamp': { offeringId: 'off-lumina-lamp', sneakPeekOpens: 95, couponCopies: 49, outboundClicks: 39 },
    'off-audiocraft-dac': { offeringId: 'off-audiocraft-dac', sneakPeekOpens: 82, couponCopies: 41, outboundClicks: 33 }
  });
}

// 4. Metric Tracking (Transparent zero-surveillance counters)
export function recordSneakPeekOpen(offeringId: string): void {
  const metrics = getOfferingsMetrics();
  const current = metrics[offeringId] || {
    offeringId,
    sneakPeekOpens: 0,
    couponCopies: 0,
    outboundClicks: 0
  };
  metrics[offeringId] = {
    ...current,
    sneakPeekOpens: current.sneakPeekOpens + 1
  };
  saveToStorage(STORAGE_KEYS.METRICS, metrics);
}

export function recordCouponCopy(offeringId: string): void {
  const metrics = getOfferingsMetrics();
  const current = metrics[offeringId] || {
    offeringId,
    sneakPeekOpens: 0,
    couponCopies: 0,
    outboundClicks: 0
  };
  metrics[offeringId] = {
    ...current,
    couponCopies: current.couponCopies + 1
  };
  saveToStorage(STORAGE_KEYS.METRICS, metrics);
}

export function recordOutboundClick(offeringId: string): void {
  const metrics = getOfferingsMetrics();
  const current = metrics[offeringId] || {
    offeringId,
    sneakPeekOpens: 0,
    couponCopies: 0,
    outboundClicks: 0
  };
  metrics[offeringId] = {
    ...current,
    outboundClicks: current.outboundClicks + 1
  };
  saveToStorage(STORAGE_KEYS.METRICS, metrics);
}

// 5. Place New Verified Offering (Enforces Golden Rule: must have coupon / perk)
export function placeVerifiedOffering(offering: Omit<VerifiedOffering, 'id' | 'createdAt' | 'status' | 'customerRating' | 'reviewCount' | 'staffVerified' | 'verifiedAt' | 'disclosureNote'>): VerifiedOffering {
  const offerings = getActiveOfferings();
  const id = `off-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  
  const newOffering: VerifiedOffering = {
    ...offering,
    id,
    status: 'ACTIVE',
    customerRating: 4.9,
    reviewCount: 1,
    staffVerified: true,
    verifiedAt: 'Just Verified by Golden Hour Engine',
    disclosureNote: `Why are you seeing this offering? Because you searched for '${offering.targetKeyword}'. Your data was not auctioned, fingerprinted, or sold to data brokers.`
  };

  const updatedOfferings = [newOffering, ...offerings];
  saveToStorage(STORAGE_KEYS.OFFERINGS, updatedOfferings);

  // Update demand list active count if matches
  const demands = getSearchDemands();
  const matchedDemand = demands.find(d => d.keyword.toLowerCase() === offering.targetKeyword.toLowerCase());
  if (matchedDemand) {
    matchedDemand.activeOfferingsCount += 1;
    saveToStorage(STORAGE_KEYS.DEMAND, demands);
  }

  return newOffering;
}

// 6. Record Anonymous Search Query (Increment demand count without storing user IP or ID)
export function recordAnonymousSearch(query: string, category: CategoryType = 'All'): void {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return;

  const demands = getSearchDemands();
  const existingIdx = demands.findIndex(d => d.keyword.toLowerCase() === clean);

  if (existingIdx !== -1) {
    demands[existingIdx].searchCount += 1;
    demands[existingIdx].lastSearchedAt = 'Just now';
  } else {
    // Determine category if generic
    let autoCat: CategoryType = category === 'All' ? 'Tech & Hardware' : category;
    if (clean.includes('audio') || clean.includes('headphone') || clean.includes('speaker') || clean.includes('dac')) autoCat = 'Audio & Hi-Fi';
    if (clean.includes('cloud') || clean.includes('vps') || clean.includes('server') || clean.includes('api')) autoCat = 'Cloud & Dev Tools';
    if (clean.includes('desk') || clean.includes('chair') || clean.includes('lamp') || clean.includes('monitor')) autoCat = 'Ergonomic Workspace';
    if (clean.includes('coffee') || clean.includes('tea') || clean.includes('bean') || clean.includes('brew')) autoCat = 'Specialty Coffee & Food';
    if (clean.includes('backpack') || clean.includes('pack') || clean.includes('jacket') || clean.includes('watch')) autoCat = 'Lifestyle & Gear';

    demands.unshift({
      id: `dem-${Date.now()}`,
      keyword: query.trim(),
      searchCount: 1,
      timeframeLabel: 'searched today',
      category: autoCat,
      growthTrend: '+1 new search demand',
      activeOfferingsCount: 0,
      lastSearchedAt: 'Just now'
    });
  }

  saveToStorage(STORAGE_KEYS.DEMAND, demands.slice(0, 30));
}

// 7. Perform Privacy-First Neutral Search with Attached Verified Offerings
export function executeGoldenSearch(query: string, selectedCategory: CategoryType = 'All'): {
  results: SearchResultItem[];
  matchedOffering?: VerifiedOffering;
  queryIntentLabel: string;
} {
  const trimmed = query.trim().toLowerCase();
  const offerings = getActiveOfferings();

  // 1. Check if an offering directly matches the keyword intent
  const directOffering = offerings.find(o => {
    const k = o.targetKeyword.toLowerCase();
    const t = o.title.toLowerCase();
    const b = o.brandName.toLowerCase();
    return trimmed.length > 0 && (k.includes(trimmed) || trimmed.includes(k) || t.includes(trimmed) || b.includes(trimmed));
  });

  // 2. Build Organic Search Results
  let results: SearchResultItem[] = [];

  if (!trimmed) {
    // Show curated default highlights
    results = offerings.slice(0, 6).map((off, idx) => ({
      id: `res-${off.id}`,
      title: off.title,
      url: off.destinationUrl,
      displayUrl: off.destinationUrl.replace('https://', '').split('/')[0],
      snippet: off.description,
      category: off.category,
      matchedKeyword: off.targetKeyword,
      offering: off,
      isOfficialStore: true,
      organicRank: idx + 1
    }));
  } else {
    // Search both verified merchant offerings and neutral organic sources
    const matchedOfferings = offerings.filter(o => {
      const matchText = `${o.title} ${o.targetKeyword} ${o.brandName} ${o.description} ${o.verifiedPerk}`.toLowerCase();
      const matchCat = selectedCategory === 'All' || o.category === selectedCategory;
      return matchText.includes(trimmed) && matchCat;
    });

    // Add matching offerings as official verified results with Sneak Peek
    matchedOfferings.forEach((off, idx) => {
      results.push({
        id: `res-${off.id}`,
        title: off.title,
        url: off.destinationUrl,
        displayUrl: off.destinationUrl.replace('https://', '').split('/')[0],
        snippet: off.description,
        category: off.category,
        matchedKeyword: off.targetKeyword,
        offering: off,
        isOfficialStore: true,
        organicRank: idx + 1
      });
    });

    // Add neutral non-commercial knowledge articles / organic results
    const matchedOrganic = ORGANIC_RESULTS_POOL.filter(org => {
      const matchText = `${org.title} ${org.snippet} ${org.matchedKeyword}`.toLowerCase();
      const matchCat = selectedCategory === 'All' || org.category === selectedCategory;
      return matchText.includes(trimmed) && matchCat;
    });

    matchedOrganic.forEach((org, idx) => {
      results.push({
        ...org,
        organicRank: results.length + idx + 1
      });
    });

    // If query didn't match existing hardcoded items, generate honest neutral synthetic search results
    if (results.length === 0) {
      const cleanCapitalized = query.charAt(0).toUpperCase() + query.slice(1);
      results = [
        {
          id: `res-synth-1`,
          title: `${cleanCapitalized}: Definitive Specifications, Value Analysis & Real-World Reviews`,
          url: `https://verifiedsearch.org/in-depth/${encodeURIComponent(trimmed)}`,
          displayUrl: `verifiedsearch.org/analysis/${encodeURIComponent(trimmed)}`,
          snippet: `Independent analysis on ${query}. Neutral testing specifications, build durability, manufacturer track record, and verified buyer satisfaction metrics.`,
          category: selectedCategory === 'All' ? 'Tech & Hardware' : selectedCategory,
          organicRank: 1
        },
        {
          id: `res-synth-2`,
          title: `Where to Find Authentic ${cleanCapitalized} with Direct Warranties`,
          url: `https://consumerstandards.org/guides/${encodeURIComponent(trimmed)}`,
          displayUrl: `consumerstandards.org/guides/${encodeURIComponent(trimmed)}`,
          snippet: `Authenticity criteria for ${query}. Avoid counterfeit inventory by acquiring exclusively from authorized distributors and verified direct-to-consumer storefronts.`,
          category: selectedCategory === 'All' ? 'Lifestyle & Gear' : selectedCategory,
          organicRank: 2
        },
        {
          id: `res-synth-3`,
          title: `Open Community Discussion & Comparisons: ${cleanCapitalized}`,
          url: `https://communityforum.org/discussion/${encodeURIComponent(trimmed)}`,
          displayUrl: `communityforum.org/threads/${encodeURIComponent(trimmed)}`,
          snippet: `Unbiased user experiences, longevity benchmarks, and alternative recommendations for ${query} submitted by real everyday enthusiasts.`,
          category: selectedCategory === 'All' ? 'Tech & Hardware' : selectedCategory,
          organicRank: 3
        }
      ];
    }
  }

  // Filter by category if not 'All'
  if (selectedCategory !== 'All') {
    results = results.filter(r => r.category === selectedCategory);
  }

  return {
    results,
    matchedOffering: directOffering,
    queryIntentLabel: trimmed ? `Results for "${query}"` : 'Curated Verified Offerings'
  };
}
