export type AssetCategory = 'CRYPTO' | 'COMMODITIES' | 'FOREX' | 'INDICES' | 'UK_EQUITIES';

export interface BarData {
  id: number;
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number; // Institutional volume
  direction: 'UP' | 'DOWN'; // UP = close >= open (white filled arrow), DOWN = close < open (white outlined arrow or reversed)
  height: number; // Dynamically scaled price delta
  arrowWidth: number; // Dynamically scaled volume width (e.g. 2px to 24px)
  pctChange: number;
  isInstitutionalSpike?: boolean; // high volume breakout
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION' | 'VOLUME COMPRESSION' | 'HEAVY SELLING EXPANSION' | 'ACCUMULATION REBOUND';
  simpleValuation: 'BARGAIN / ON SALE' | 'FAIR VALUE' | 'OVERHEATED';
}

export interface FundamentalGauge {
  id: string;
  category: 'CASH & DEBT' | 'VALUATION' | 'GROWTH SPEED' | 'SAFETY SHIELD';
  simpleTitle: string; // e.g. "Cash Vault vs Debt Owed"
  jargonEquivalent: string; // e.g. "Net Debt to EBITDA / Current Ratio"
  score: number; // 0 to 100
  status: 'VERY SAFE' | 'SAFE' | 'FAIR' | 'DANGEROUS' | 'ON SALE' | 'EXPENSIVE';
  simpleSummary: string; // Plain English: "They have $4 in safe cash for every $1 they owe. Impossible to go bankrupt."
  ratioBreakdown: { label: string; value: string; safeBench: string }[];
}

export interface NewsForecastItem {
  id: string;
  time: string;
  currency: string;
  eventName: string;
  stars: 1 | 2 | 3; // 1 = Low, 2 = Medium, 3 = Heavy Market Mover
  previous: string;
  forecast: string;
  actual?: string;
  forecastPct: number; // for visual comparison (0-100)
  previousPct: number;
  actualPct?: number;
  status: 'RELEASED_BEAT' | 'RELEASED_MISS' | 'UPCOMING';
  plainImpact: string; // e.g. "If higher than 2.8% -> US Dollar shoots up, Gold drops."
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface TradingSignal {
  id: string;
  symbol: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  timeframe: '15M' | '1H' | '4H' | '1D';
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  riskReward: string;
  arrowPattern: string; // e.g. "Triple Wide-Arrow Institutional Absorption"
  confidence: number; // e.g. 91%
  plainRule: string; // "Institutions bought with 3x normal volume arrows at support."
  timestamp: string;
  isPremiumAlert: boolean;
}

export interface FreeBot {
  id: string;
  name: string;
  tagline: string;
  language: 'PINE SCRIPT v5' | 'PYTHON (CCXT)' | 'MT5 MQL5';
  winRate: string;
  profitFactor: string;
  sharpeRatio: string;
  bestTimeframe: string;
  description: string;
  plainEnglishLogic: string;
  code: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  plan: 'FREE' | 'PRO_MONTHLY' | 'LIFETIME';
  alertChannel: 'WHATSAPP' | 'SMS' | 'EMAIL';
  contactDestination: string;
  joinedDate: string;
  tradesLoggedCount: number;
}

export interface HistoricalSignal {
  id: string;
  date: string;
  timeUTC: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  timeframe: string;
  entryPrice: number;
  exitPrice: number;
  result: 'TP2_HIT' | 'TP1_HIT' | 'BREAKEVEN' | 'SL_HIT';
  pnlR: string; // e.g. "+3.2R" or "-1.0R"
  returnPct: string; // e.g. "+4.8%"
  arrowPattern: string;
  plainSummary: string;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  timeStr: string;
  assetSymbol: string;
  assetName: string;
  direction: 'BUY' | 'SELL';
  linkedSignalId?: string; // If user linked to a desk signal
  linkedSignalSummary?: string;
  entryPrice: number;
  exitPrice: number;
  positionSizeLots: number;
  pnlAmount: number; // in £
  outcome: 'WIN' | 'LOSS' | 'BREAKEVEN';
  riskReward: string;
  notes: string; // Plain-English lessons / emotional discipline
  emotionsRating: 'DISCIPLINED' | 'FOMO_CHASED' | 'MOVED_STOP_LOSS' | 'PERFECT_EXECUTION';
}
