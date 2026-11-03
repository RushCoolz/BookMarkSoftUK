import { Asset, BarData, FundamentalGauge, NewsForecastItem, TradingSignal, FreeBot, HistoricalSignal, JournalEntry } from '../types';

export const ASSETS: Asset[] = [
  // --- CRYPTO (10) ---
  {
    id: 'btc',
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    category: 'CRYPTO',
    price: 94820.50,
    change24h: 3.42,
    high24h: 96100.00,
    low24h: 91450.00,
    volume24h: '$38.4B',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'eth',
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    category: 'CRYPTO',
    price: 3420.10,
    change24h: 2.15,
    high24h: 3495.00,
    low24h: 3310.00,
    volume24h: '$18.9B',
    arrowTrendSummary: 'ACCUMULATION REBOUND',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'sol',
    symbol: 'SOL/USDT',
    name: 'Solana',
    category: 'CRYPTO',
    price: 194.50,
    change24h: 5.80,
    high24h: 198.80,
    low24h: 182.20,
    volume24h: '$8.4B',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'OVERHEATED'
  },
  {
    id: 'xrp',
    symbol: 'XRP/USDT',
    name: 'Ripple XRP',
    category: 'CRYPTO',
    price: 1.485,
    change24h: 12.40,
    high24h: 1.550,
    low24h: 1.280,
    volume24h: '$9.2B',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'bnb',
    symbol: 'BNB/USDT',
    name: 'Binance Coin',
    category: 'CRYPTO',
    price: 682.00,
    change24h: 1.10,
    high24h: 689.50,
    low24h: 671.00,
    volume24h: '$1.8B',
    arrowTrendSummary: 'VOLUME COMPRESSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'doge',
    symbol: 'DOGE/USDT',
    name: 'Dogecoin',
    category: 'CRYPTO',
    price: 0.384,
    change24h: -3.20,
    high24h: 0.412,
    low24h: 0.371,
    volume24h: '$3.7B',
    arrowTrendSummary: 'HEAVY SELLING EXPANSION',
    simpleValuation: 'OVERHEATED'
  },
  {
    id: 'ada',
    symbol: 'ADA/USDT',
    name: 'Cardano',
    category: 'CRYPTO',
    price: 0.884,
    change24h: 4.60,
    high24h: 0.915,
    low24h: 0.835,
    volume24h: '$1.9B',
    arrowTrendSummary: 'ACCUMULATION REBOUND',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'avax',
    symbol: 'AVAX/USDT',
    name: 'Avalanche',
    category: 'CRYPTO',
    price: 42.10,
    change24h: 3.10,
    high24h: 43.80,
    low24h: 40.50,
    volume24h: '$1.2B',
    arrowTrendSummary: 'ACCUMULATION REBOUND',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'link',
    symbol: 'LINK/USDT',
    name: 'Chainlink',
    category: 'CRYPTO',
    price: 18.60,
    change24h: 6.25,
    high24h: 19.20,
    low24h: 17.30,
    volume24h: '$840M',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'sui',
    symbol: 'SUI/USDT',
    name: 'Sui Network',
    category: 'CRYPTO',
    price: 3.45,
    change24h: 8.90,
    high24h: 3.62,
    low24h: 3.12,
    volume24h: '$1.4B',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'OVERHEATED'
  },

  // --- COMMODITIES (8) ---
  {
    id: 'gold',
    symbol: 'XAU/USD',
    name: 'Gold Spot',
    category: 'COMMODITIES',
    price: 2748.80,
    change24h: 0.85,
    high24h: 2758.20,
    low24h: 2724.10,
    volume24h: '$42.1B',
    arrowTrendSummary: 'VOLUME COMPRESSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'silver',
    symbol: 'XAG/USD',
    name: 'Silver Spot',
    category: 'COMMODITIES',
    price: 32.40,
    change24h: 2.45,
    high24h: 32.95,
    low24h: 31.50,
    volume24h: '$14.2B',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'brent',
    symbol: 'BRENT/USD',
    name: 'Brent Crude Oil (UK)',
    category: 'COMMODITIES',
    price: 74.20,
    change24h: -1.35,
    high24h: 75.80,
    low24h: 73.60,
    volume24h: '$28.5B',
    arrowTrendSummary: 'HEAVY SELLING EXPANSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'wti',
    symbol: 'WTI/USD',
    name: 'WTI Crude Oil (US)',
    category: 'COMMODITIES',
    price: 70.80,
    change24h: -1.15,
    high24h: 72.10,
    low24h: 70.10,
    volume24h: '$32.1B',
    arrowTrendSummary: 'HEAVY SELLING EXPANSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'natgas',
    symbol: 'NATGAS/USD',
    name: 'Natural Gas',
    category: 'COMMODITIES',
    price: 2.85,
    change24h: 4.10,
    high24h: 2.94,
    low24h: 2.72,
    volume24h: '$6.4B',
    arrowTrendSummary: 'ACCUMULATION REBOUND',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'copper',
    symbol: 'COPPER/USD',
    name: 'High Grade Copper',
    category: 'COMMODITIES',
    price: 4.18,
    change24h: 1.20,
    high24h: 4.24,
    low24h: 4.12,
    volume24h: '$5.8B',
    arrowTrendSummary: 'VOLUME COMPRESSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'plat',
    symbol: 'PLAT/USD',
    name: 'Platinum Spot',
    category: 'COMMODITIES',
    price: 985.00,
    change24h: 0.40,
    high24h: 994.00,
    low24h: 978.00,
    volume24h: '$2.1B',
    arrowTrendSummary: 'VOLUME COMPRESSION',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'pall',
    symbol: 'PALL/USD',
    name: 'Palladium Spot',
    category: 'COMMODITIES',
    price: 1045.00,
    change24h: -2.30,
    high24h: 1072.00,
    low24h: 1038.00,
    volume24h: '$1.4B',
    arrowTrendSummary: 'HEAVY SELLING EXPANSION',
    simpleValuation: 'BARGAIN / ON SALE'
  },

  // --- FOREX CURRENCY PAIRS (10) ---
  {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    category: 'FOREX',
    price: 1.2985,
    change24h: 0.45,
    high24h: 1.3025,
    low24h: 1.2940,
    volume24h: '$142.8B',
    arrowTrendSummary: 'ACCUMULATION REBOUND',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'FOREX',
    price: 1.0842,
    change24h: -0.28,
    high24h: 1.0890,
    low24h: 1.0825,
    volume24h: '$188.5B',
    arrowTrendSummary: 'HEAVY SELLING EXPANSION',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'eurgbp',
    symbol: 'EUR/GBP',
    name: 'Euro / British Pound',
    category: 'FOREX',
    price: 0.8350,
    change24h: -0.32,
    high24h: 0.8385,
    low24h: 0.8335,
    volume24h: '$72.1B',
    arrowTrendSummary: 'VOLUME COMPRESSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'gbpjpy',
    symbol: 'GBP/JPY',
    name: 'British Pound / Japanese Yen',
    category: 'FOREX',
    price: 198.40,
    change24h: 0.88,
    high24h: 199.10,
    low24h: 197.20,
    volume24h: '$98.4B',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'OVERHEATED'
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'FOREX',
    price: 152.80,
    change24h: 0.42,
    high24h: 153.40,
    low24h: 152.10,
    volume24h: '$165.2B',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'OVERHEATED'
  },
  {
    id: 'audusd',
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    category: 'FOREX',
    price: 0.6580,
    change24h: -0.40,
    high24h: 0.6615,
    low24h: 0.6555,
    volume24h: '$64.5B',
    arrowTrendSummary: 'HEAVY SELLING EXPANSION',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'usdcad',
    symbol: 'USD/CAD',
    name: 'US Dollar / Canadian Dollar',
    category: 'FOREX',
    price: 1.3890,
    change24h: 0.15,
    high24h: 1.3920,
    low24h: 1.3860,
    volume24h: '$58.0B',
    arrowTrendSummary: 'VOLUME COMPRESSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'usdchf',
    symbol: 'USD/CHF',
    name: 'US Dollar / Swiss Franc',
    category: 'FOREX',
    price: 0.8640,
    change24h: -0.10,
    high24h: 0.8675,
    low24h: 0.8620,
    volume24h: '$49.3B',
    arrowTrendSummary: 'VOLUME COMPRESSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'nzdusd',
    symbol: 'NZD/USD',
    name: 'New Zealand Dollar / US Dollar',
    category: 'FOREX',
    price: 0.5980,
    change24h: -0.55,
    high24h: 0.6020,
    low24h: 0.5960,
    volume24h: '$32.1B',
    arrowTrendSummary: 'HEAVY SELLING EXPANSION',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'gbpeur',
    symbol: 'GBP/EUR',
    name: 'British Pound / Euro',
    category: 'FOREX',
    price: 1.1975,
    change24h: 0.35,
    high24h: 1.2005,
    low24h: 1.1935,
    volume24h: '$68.4B',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'FAIR VALUE'
  },

  // --- INDICES (6) ---
  {
    id: 'ftse',
    symbol: 'FTSE 100',
    name: 'UK FTSE 100 Index',
    category: 'INDICES',
    price: 8245.50,
    change24h: 0.55,
    high24h: 8280.00,
    low24h: 8210.00,
    volume24h: '£12.4B',
    arrowTrendSummary: 'ACCUMULATION REBOUND',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'spx',
    symbol: 'SPX 500',
    name: 'S&P 500 Index',
    category: 'INDICES',
    price: 5864.20,
    change24h: 0.62,
    high24h: 5882.00,
    low24h: 5831.10,
    volume24h: '$84.2B',
    arrowTrendSummary: 'ACCUMULATION REBOUND',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'nas100',
    symbol: 'NAS 100',
    name: 'Nasdaq Tech 100',
    category: 'INDICES',
    price: 20480.00,
    change24h: 1.25,
    high24h: 20560.00,
    low24h: 20280.00,
    volume24h: '$96.5B',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'OVERHEATED'
  },
  {
    id: 'dow30',
    symbol: 'DOW 30',
    name: 'Dow Jones Industrial',
    category: 'INDICES',
    price: 42120.00,
    change24h: 0.28,
    high24h: 42280.00,
    low24h: 41980.00,
    volume24h: '$38.2B',
    arrowTrendSummary: 'VOLUME COMPRESSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'dax40',
    symbol: 'DAX 40',
    name: 'Germany DAX 40',
    category: 'INDICES',
    price: 19450.00,
    change24h: 0.45,
    high24h: 19520.00,
    low24h: 19380.00,
    volume24h: '€24.6B',
    arrowTrendSummary: 'ACCUMULATION REBOUND',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'nikkei',
    symbol: 'NIKKEI 225',
    name: 'Japan Nikkei 225',
    category: 'INDICES',
    price: 38620.00,
    change24h: -0.65,
    high24h: 38950.00,
    low24h: 38480.00,
    volume24h: '¥3.2T',
    arrowTrendSummary: 'HEAVY SELLING EXPANSION',
    simpleValuation: 'BARGAIN / ON SALE'
  },

  // --- UK & US EQUITIES (8) ---
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    category: 'UK_EQUITIES',
    price: 138.25,
    change24h: 4.15,
    high24h: 140.80,
    low24h: 133.50,
    volume24h: '$26.8B',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'OVERHEATED'
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc',
    category: 'UK_EQUITIES',
    price: 224.50,
    change24h: 0.85,
    high24h: 226.20,
    low24h: 222.80,
    volume24h: '$14.2B',
    arrowTrendSummary: 'VOLUME COMPRESSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla Inc',
    category: 'UK_EQUITIES',
    price: 248.80,
    change24h: -1.80,
    high24h: 256.00,
    low24h: 244.50,
    volume24h: '$21.4B',
    arrowTrendSummary: 'HEAVY SELLING EXPANSION',
    simpleValuation: 'OVERHEATED'
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    category: 'UK_EQUITIES',
    price: 418.00,
    change24h: 1.10,
    high24h: 421.50,
    low24h: 414.20,
    volume24h: '$11.8B',
    arrowTrendSummary: 'ACCUMULATION REBOUND',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'barc',
    symbol: 'BARC.L',
    name: 'Barclays PLC (UK)',
    category: 'UK_EQUITIES',
    price: 2.42,
    change24h: 1.65,
    high24h: 2.48,
    low24h: 2.38,
    volume24h: '£840M',
    arrowTrendSummary: 'ACCUMULATION REBOUND',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'bp',
    symbol: 'BP.L',
    name: 'BP PLC (UK Oil)',
    category: 'UK_EQUITIES',
    price: 3.95,
    change24h: -0.90,
    high24h: 4.02,
    low24h: 3.91,
    volume24h: '£1.1B',
    arrowTrendSummary: 'HEAVY SELLING EXPANSION',
    simpleValuation: 'BARGAIN / ON SALE'
  },
  {
    id: 'shel',
    symbol: 'SHEL.L',
    name: 'Shell PLC (UK)',
    category: 'UK_EQUITIES',
    price: 25.80,
    change24h: 0.35,
    high24h: 26.15,
    low24h: 25.60,
    volume24h: '£1.4B',
    arrowTrendSummary: 'VOLUME COMPRESSION',
    simpleValuation: 'FAIR VALUE'
  },
  {
    id: 'azn',
    symbol: 'AZN.L',
    name: 'AstraZeneca PLC (UK)',
    category: 'UK_EQUITIES',
    price: 118.50,
    change24h: 1.40,
    high24h: 120.20,
    low24h: 117.10,
    volume24h: '£920M',
    arrowTrendSummary: 'STRONG BUY ARROW ACCELERATION',
    simpleValuation: 'FAIR VALUE'
  }
];

// Generate dynamic arrow bar data for a given asset & timeframe
export function generateArrowBars(basePrice: number, count: number = 36): BarData[] {
  const bars: BarData[] = [];
  let currentPrice = basePrice * 0.94;
  const now = Date.now();
  const stepMs = 3600 * 1000; // 1 hour intervals

  for (let i = 0; i < count; i++) {
    const timeDate = new Date(now - (count - i) * stepMs);
    const timeStr = `${timeDate.getHours().toString().padStart(2, '0')}:00`;

    // Calculate swing with simulated institutional bursts
    const volatility = basePrice * (0.004 + (i % 5 === 0 ? 0.015 : 0.005));
    const isBull = (Math.sin(i * 0.45) + (Math.random() - 0.46)) > 0;
    const delta = (Math.random() * volatility) * (isBull ? 1 : -0.9);
    
    const open = currentPrice;
    const close = +(open + delta).toFixed(basePrice < 10 ? 4 : 2);
    const high = +(Math.max(open, close) + Math.random() * (volatility * 0.35)).toFixed(basePrice < 10 ? 4 : 2);
    const low = +(Math.min(open, close) - Math.random() * (volatility * 0.35)).toFixed(basePrice < 10 ? 4 : 2);
    
    // Volume simulation: Institutional volume creates fat arrows
    const isSpike = i === 12 || i === 22 || i === 31 || i === count - 2;
    const rawVolume = Math.floor(
      (15000 + Math.random() * 25000) * (isSpike ? 3.8 : 1.0)
    );

    // Height ratio based on price change
    const pctChange = +(((close - open) / open) * 100).toFixed(2);
    const height = Math.max(12, Math.min(130, Math.abs(close - open) / (basePrice * 0.001) * 8));

    // Arrow width based on volume relative to benchmark (wider = institutional whale flow)
    const arrowWidth = Math.max(3, Math.min(28, (rawVolume / 22000) * 8));

    bars.push({
      id: i,
      time: timeStr,
      timestamp: timeDate.getTime(),
      open,
      high,
      low,
      close,
      volume: rawVolume,
      direction: close >= open ? 'UP' : 'DOWN',
      height,
      arrowWidth,
      pctChange,
      isInstitutionalSpike: isSpike
    });

    currentPrice = close;
  }

  return bars;
}

export const FUNDAMENTALS_DATA: Record<string, FundamentalGauge[]> = {
  btc: [
    {
      id: 'vault-security',
      category: 'CASH & DEBT',
      simpleTitle: 'Debt Danger Level',
      jargonEquivalent: 'Total Debt vs Cash Reserves',
      score: 100,
      status: 'VERY SAFE',
      simpleSummary: 'ZERO debt. Bitcoin cannot default, declare bankruptcy, or be diluted by corporate loans.',
      ratioBreakdown: [
        { label: 'Total Debt', value: '$0.00', safeBench: 'Under $1B' },
        { label: 'Default Risk', value: '0.0%', safeBench: 'Under 2%' },
        { label: 'Reserve Ratio', value: '100% Cold Proof', safeBench: '> 80%' }
      ]
    },
    {
      id: 'bargain-meter',
      category: 'VALUATION',
      simpleTitle: 'Is Price a Bargain or Expensive?',
      jargonEquivalent: 'MVRV Z-Score & Market Multiple',
      score: 78,
      status: 'ON SALE',
      simpleSummary: 'Currently trading at historical fair discount compared to money printed worldwide. Still early in cycle.',
      ratioBreakdown: [
        { label: 'Current Price', value: '$94,820', safeBench: 'Base' },
        { label: 'Fair Math Price', value: '$118,500', safeBench: 'Over $100k' },
        { label: 'Discount Margin', value: '+24.9% under value', safeBench: 'Buy Zone' }
      ]
    },
    {
      id: 'money-machine',
      category: 'GROWTH SPEED',
      simpleTitle: 'Network Hashrate & Growth Speed',
      jargonEquivalent: 'Proof-of-Work Energy Security & Fee Velocity',
      score: 94,
      status: 'VERY SAFE',
      simpleSummary: 'Fastest computing security wall on Earth. Thousands of computers protecting transactions 24/7.',
      ratioBreakdown: [
        { label: 'Hashrate All-Time', value: '710 EH/s', safeBench: '> 500 EH/s' },
        { label: 'Active Wallets', value: '48.2M', safeBench: 'Growing' },
        { label: 'Annual Inflation', value: '0.85%', safeBench: 'Under 2%' }
      ]
    },
    {
      id: 'shield',
      category: 'SAFETY SHIELD',
      simpleTitle: 'Sovereign & Whale Holding Lock',
      jargonEquivalent: 'Illiquid Supply & Institutional ETF Float',
      score: 89,
      status: 'VERY SAFE',
      simpleSummary: 'Whales & ETFs are locking up coins. 74% of all bitcoins haven’t moved in over 1 year.',
      ratioBreakdown: [
        { label: 'Coins Locked Up', value: '74.2%', safeBench: '> 60%' },
        { label: 'ETF Daily Inflow', value: '+$618M', safeBench: 'Positive' },
        { label: 'Exchange Supply', value: 'Lowest in 6 years', safeBench: 'Dropping' }
      ]
    }
  ],
  gold: [
    {
      id: 'gold-safe',
      category: 'CASH & DEBT',
      simpleTitle: '5,000 Year Survival Record',
      jargonEquivalent: 'Counterparty Solvency & Default Probability',
      score: 99,
      status: 'VERY SAFE',
      simpleSummary: 'Physical gold has outlived every paper currency and empire in human history. Zero counterparty risk.',
      ratioBreakdown: [
        { label: 'Default Chance', value: '0.00%', safeBench: '0%' },
        { label: 'Central Bank Buying', value: '1,037 Tons/Yr', safeBench: '> 600 Tons' },
        { label: 'Vault Purity', value: '99.99%', safeBench: '> 99.5%' }
      ]
    },
    {
      id: 'gold-val',
      category: 'VALUATION',
      simpleTitle: 'Price vs Real Purchasing Power',
      jargonEquivalent: 'Real Yield Adjusted Purchasing Power',
      score: 65,
      status: 'FAIR',
      simpleSummary: 'Fairly priced. Not dirt cheap, but protects your money from grocery and rent inflation.',
      ratioBreakdown: [
        { label: 'Inflation Adjusted', value: 'Fair Target $2,800', safeBench: 'In-line' },
        { label: 'Mining Production Cost', value: '$1,450 / oz', safeBench: 'Under Price' },
        { label: 'Retail Demand', value: 'High in Asia', safeBench: 'Sustained' }
      ]
    },
    {
      id: 'gold-shield',
      category: 'SAFETY SHIELD',
      simpleTitle: 'War & Crisis Protection Shield',
      jargonEquivalent: 'Geopolitical Risk Hedge Correlation',
      score: 95,
      status: 'VERY SAFE',
      simpleSummary: 'When stock markets crash or wars begin, money rushes into Gold within minutes.',
      ratioBreakdown: [
        { label: 'Crisis Correlation', value: '+0.88 With Fear', safeBench: '> +0.70' },
        { label: 'Central Bank Reserves', value: 'Historic High', safeBench: 'Bullish' },
        { label: 'Physical Premium', value: '+4.2% Over Paper', safeBench: 'Strong' }
      ]
    }
  ],
  gbpusd: [
    {
      id: 'gbp-cash',
      category: 'CASH & DEBT',
      simpleTitle: 'Bank of England Solvency Backing',
      jargonEquivalent: 'UK Sovereign Debt to GDP & Yield Spread',
      score: 82,
      status: 'SAFE',
      simpleSummary: 'Backed by the Bank of England and UK Gilt markets. Solid international liquidity and trade reserves.',
      ratioBreakdown: [
        { label: 'BoE Policy Rate', value: '4.75%', safeBench: '> 4.0%' },
        { label: 'UK 10Y Gilt Yield', value: '4.45%', safeBench: 'Attractive' },
        { label: 'Sovereign Default Risk', value: '0.05%', safeBench: '< 0.5%' }
      ]
    },
    {
      id: 'gbp-val',
      category: 'VALUATION',
      simpleTitle: 'Is The British Pound Cheap or Pricey?',
      jargonEquivalent: 'Purchasing Power Parity (PPP Index)',
      score: 74,
      status: 'FAIR',
      simpleSummary: 'Trading near historical median vs the US Dollar. London financial services export remains robust.',
      ratioBreakdown: [
        { label: 'Fair PPP Rate', value: '1.3400', safeBench: 'Near Fair' },
        { label: 'Discount vs Dollar', value: '-3.1% under parity', safeBench: 'Buy Zone' },
        { label: 'Foreign Direct Inflow', value: '+£18.4B/Qtr', safeBench: 'Positive' }
      ]
    },
    {
      id: 'gbp-shield',
      category: 'SAFETY SHIELD',
      simpleTitle: 'London Financial Hub Protection',
      jargonEquivalent: 'Global Reserve Currency Share',
      score: 88,
      status: 'VERY SAFE',
      simpleSummary: 'The 4th most held reserve currency in central banks globally. Trillions cleared daily in London.',
      ratioBreakdown: [
        { label: 'FX Daily Turnover', value: '38% of World Total', safeBench: '#1 Globally' },
        { label: 'UK Current Account', value: 'Stabilising', safeBench: 'Improving' },
        { label: 'Inflation Trajectory', value: 'Down to 2.2%', safeBench: '< 3.0%' }
      ]
    }
  ],
  ftse: [
    {
      id: 'ftse-cash',
      category: 'CASH & DEBT',
      simpleTitle: 'Dividend & Cash Cow Power',
      jargonEquivalent: 'Dividend Yield vs Free Cash Flow Coverage',
      score: 91,
      status: 'VERY SAFE',
      simpleSummary: 'The FTSE 100 generates massive real cash. It pays one of the highest dividend yields of any major index on Earth.',
      ratioBreakdown: [
        { label: 'Average Dividend Yield', value: '3.85%', safeBench: '> 2.0%' },
        { label: 'Cash Flow Coverage', value: '2.4x Covered', safeBench: '> 1.8x' },
        { label: 'Global Revenue', value: '75% Overseas', safeBench: 'Hedged' }
      ]
    },
    {
      id: 'ftse-val',
      category: 'VALUATION',
      simpleTitle: 'Price Tag: Bargain vs US Stocks',
      jargonEquivalent: 'Price to Earnings (PE Multiple)',
      score: 86,
      status: 'ON SALE',
      simpleSummary: 'Massively on sale! You pay only £11 for £1 of FTSE profit, compared to $28 for the US S&P 500.',
      ratioBreakdown: [
        { label: 'FTSE 100 P/E', value: '11.8x', safeBench: '< 15x' },
        { label: 'US S&P 500 P/E', value: '27.4x', safeBench: 'Expensive' },
        { label: 'UK Stock Discount', value: '55% cheaper than US', safeBench: 'Deep Value' }
      ]
    },
    {
      id: 'ftse-shield',
      category: 'SAFETY SHIELD',
      simpleTitle: 'Commodity & Healthcare Defense',
      jargonEquivalent: 'Defensive Value Sector Weighting',
      score: 87,
      status: 'VERY SAFE',
      simpleSummary: 'Dominated by companies you cannot live without: energy (BP, Shell), medicines (AstraZeneca), and food.',
      ratioBreakdown: [
        { label: 'Defensive Holdings', value: '62% of Index', safeBench: '> 40%' },
        { label: 'Buyback Programs', value: '£42B in 2024/25', safeBench: 'Bullish' },
        { label: 'Recession Resilience', value: 'High', safeBench: 'Safe' }
      ]
    }
  ],
  nvda: [
    {
      id: 'nvda-cash',
      category: 'CASH & DEBT',
      simpleTitle: 'Cash Vault vs Bills Owed',
      jargonEquivalent: 'Total Cash vs Total Debt Ratio',
      score: 92,
      status: 'VERY SAFE',
      simpleSummary: 'They have $34 Billion in pure cold cash, and their profits cover all debt interest 28 times over.',
      ratioBreakdown: [
        { label: 'Cash In Bank', value: '$34.8 Billion', safeBench: '> $10B' },
        { label: 'Debt Repayment Power', value: '28x Interest', safeBench: '> 5x' },
        { label: 'Bankruptcy Threat', value: 'Zero', safeBench: 'Low' }
      ]
    },
    {
      id: 'nvda-val',
      category: 'VALUATION',
      simpleTitle: 'Price Tag: Is It Cheap or Overpriced?',
      jargonEquivalent: 'Price to Earnings & EV/EBITDA',
      score: 45,
      status: 'EXPENSIVE',
      simpleSummary: 'Expensive. You are paying $50 for every $1 of profit they currently make. Must keep growing fast.',
      ratioBreakdown: [
        { label: 'Current Price/Profit', value: '52.4x', safeBench: '< 25x' },
        { label: 'Industry Standard', value: '28.1x', safeBench: 'Average' },
        { label: 'Overheat Rating', value: 'Hot (Expect Dips)', safeBench: 'Cool' }
      ]
    },
    {
      id: 'nvda-growth',
      category: 'GROWTH SPEED',
      simpleTitle: 'How Fast Sales Are Exploding',
      jargonEquivalent: 'Year-over-Year Revenue & Net Income Velocity',
      score: 98,
      status: 'VERY SAFE',
      simpleSummary: 'Insane demand. Every big tech giant (Microsoft, Google, Meta) is waiting in line to buy AI chips.',
      ratioBreakdown: [
        { label: 'Sales Growth Speed', value: '+122% Year/Year', safeBench: '> 15%' },
        { label: 'Profit Kept from Sales', value: '55.3% Net Margin', safeBench: '> 20%' },
        { label: 'Market Monopoly', value: '88% of all AI Chips', safeBench: '> 50%' }
      ]
    }
  ]
};

// Smart fallback generator for ANY asset in the catalog
export function getAssetFundamentals(asset: Asset): FundamentalGauge[] {
  if (FUNDAMENTALS_DATA[asset.id]) {
    return FUNDAMENTALS_DATA[asset.id];
  }

  const isBargain = asset.simpleValuation === 'BARGAIN / ON SALE';
  const isOverheated = asset.simpleValuation === 'OVERHEATED';

  return [
    {
      id: `${asset.id}-solvency`,
      category: 'CASH & DEBT',
      simpleTitle: 'Financial Solvency & Buffer',
      jargonEquivalent: 'Net Debt / Liquid Reserves Ratio',
      score: isBargain ? 88 : isOverheated ? 65 : 79,
      status: isBargain ? 'VERY SAFE' : isOverheated ? 'FAIR' : 'SAFE',
      simpleSummary: `High liquidity in ${asset.name}. Daily trading float of ${asset.volume24h} guarantees institutional order execution without slippage.`,
      ratioBreakdown: [
        { label: '24h Trading Volume', value: asset.volume24h, safeBench: 'Liquid' },
        { label: 'Default / Black Swan Risk', value: '< 0.5%', safeBench: 'Low Risk' },
        { label: 'Institutional Participation', value: 'High Tier-1', safeBench: 'Approved' }
      ]
    },
    {
      id: `${asset.id}-valuation`,
      category: 'VALUATION',
      simpleTitle: 'Price Tag: Bargain or Stretched?',
      jargonEquivalent: 'Multi-period Mean-Reversion Metric',
      score: isBargain ? 85 : isOverheated ? 42 : 70,
      status: asset.simpleValuation === 'BARGAIN / ON SALE' ? 'ON SALE' : asset.simpleValuation === 'OVERHEATED' ? 'EXPENSIVE' : 'FAIR',
      simpleSummary: `Currently assessed as ${asset.simpleValuation}. Mathematical fair value based on 90-day volume-weighted average price.`,
      ratioBreakdown: [
        { label: 'Last Traded Price', value: `$${asset.price.toLocaleString()}`, safeBench: 'Market' },
        { label: '24h Swing Range', value: `$${asset.low24h} - $${asset.high24h}`, safeBench: 'Normal' },
        { label: 'Valuation Status', value: asset.simpleValuation, safeBench: 'Tracked' }
      ]
    },
    {
      id: `${asset.id}-momentum`,
      category: 'GROWTH SPEED',
      simpleTitle: 'Arrow Vector Velocity & Order Flow',
      jargonEquivalent: 'Volume Spread & Institutional Order Flow Delta',
      score: asset.change24h > 2 ? 90 : asset.change24h < -2 ? 38 : 72,
      status: asset.change24h > 0 ? 'VERY SAFE' : 'FAIR',
      simpleSummary: `Detected pattern: ${asset.arrowTrendSummary}. Vector algorithms show active orderbook engagement.`,
      ratioBreakdown: [
        { label: '24h Directional Change', value: `${asset.change24h >= 0 ? '+' : ''}${asset.change24h}%`, safeBench: 'Momentum' },
        { label: 'Arrow Pattern', value: asset.arrowTrendSummary, safeBench: 'Active' },
        { label: 'Order Execution Speed', value: '< 2ms London L2', safeBench: 'Optimal' }
      ]
    }
  ];
}

export const NEWS_FORECAST_DATA: NewsForecastItem[] = [
  {
    id: 'n1',
    time: '12:00 GMT (Today)',
    currency: 'GBP',
    eventName: 'Bank of England Interest Rate Decision',
    stars: 3,
    previous: '5.00%',
    forecast: '4.75%',
    actual: '4.75%',
    previousPct: 100,
    forecastPct: 95,
    actualPct: 95,
    status: 'RELEASED_BEAT',
    plainImpact: 'BoE cut UK rates by 25bps! Cheaper mortgages, British Pound strengthens as UK economic growth stabilizes.',
    sentiment: 'BULLISH'
  },
  {
    id: 'n2',
    time: '13:30 GMT (Today)',
    currency: 'USD',
    eventName: 'US CPI Inflation Rate (Annual)',
    stars: 3,
    previous: '2.4%',
    forecast: '2.6%',
    actual: '2.5%',
    previousPct: 48,
    forecastPct: 52,
    actualPct: 50,
    status: 'RELEASED_BEAT',
    plainImpact: 'Lower than forecast! Great for Bitcoin and Stocks. US Dollar weakens against GBP and EUR.',
    sentiment: 'BULLISH'
  },
  {
    id: 'n3',
    time: 'Tomorrow 07:00 GMT',
    currency: 'GBP',
    eventName: 'UK Gross Domestic Product (GDP)',
    stars: 3,
    previous: '0.1%',
    forecast: '0.2%',
    previousPct: 20,
    forecastPct: 40,
    status: 'UPCOMING',
    plainImpact: 'If higher than 0.2% -> FTSE 100 and GBP/USD shoot up. If lower -> UK markets dip.',
    sentiment: 'NEUTRAL'
  },
  {
    id: 'n4',
    time: 'Tomorrow 08:30 GMT',
    currency: 'EUR',
    eventName: 'European Central Bank Economic Growth',
    stars: 2,
    previous: '0.2%',
    forecast: '0.3%',
    previousPct: 20,
    forecastPct: 30,
    status: 'UPCOMING',
    plainImpact: 'If higher than 0.3% -> EUR/USD pumps. If lower -> EUR drops.',
    sentiment: 'NEUTRAL'
  },
  {
    id: 'n5',
    time: 'Friday 13:30 GMT',
    currency: 'USD',
    eventName: 'Non-Farm Employment (NFP New Jobs Created)',
    stars: 3,
    previous: '254K',
    forecast: '110K',
    previousPct: 90,
    forecastPct: 40,
    status: 'UPCOMING',
    plainImpact: 'High jobs means sticky inflation (Dollar UP, Gold/BTC DOWN). Low jobs means rate cuts (Crypto & Gold UP).',
    sentiment: 'NEUTRAL'
  }
];

export const TRADING_SIGNALS: TradingSignal[] = [
  {
    id: 'sig-1',
    symbol: 'BTC/USDT',
    pair: 'BTC/USDT',
    direction: 'BUY',
    timeframe: '1H',
    entryPrice: 94600.00,
    stopLoss: 93200.00,
    takeProfit1: 96800.00,
    takeProfit2: 99400.00,
    riskReward: '1 : 3.42',
    arrowPattern: 'WIDE ARROW INSTITUTIONAL EXPANSION',
    confidence: 94,
    plainRule: 'Whale buyers stepped in: Arrow width exploded by 320% at the $94.2k support base.',
    timestamp: '14 MIN AGO',
    isPremiumAlert: true
  },
  {
    id: 'sig-2',
    symbol: 'GBP/USD',
    pair: 'GBP/USD',
    direction: 'BUY',
    timeframe: '4H',
    entryPrice: 1.2960,
    stopLoss: 1.2910,
    takeProfit1: 1.3050,
    takeProfit2: 1.3120,
    riskReward: '1 : 3.20',
    arrowPattern: 'UK BOE RATE CUT REVERSAL ARROW',
    confidence: 91,
    plainRule: 'London desk volume spike confirmed upward trend arrow continuation through 1.2950 liquidity pool.',
    timestamp: '28 MIN AGO',
    isPremiumAlert: true
  },
  {
    id: 'sig-3',
    symbol: 'XAU/USD',
    pair: 'XAU/USD',
    direction: 'BUY',
    timeframe: '4H',
    entryPrice: 2742.00,
    stopLoss: 2728.00,
    takeProfit1: 2770.00,
    takeProfit2: 2795.00,
    riskReward: '1 : 2.80',
    arrowPattern: 'TALL REVERSAL ARROW PINBAR',
    confidence: 88,
    plainRule: 'Deep downward arrow rejected instantly, followed by fat white arrow upward with $42B volume.',
    timestamp: '42 MIN AGO',
    isPremiumAlert: false
  },
  {
    id: 'sig-4',
    symbol: 'FTSE 100',
    pair: 'FTSE 100',
    direction: 'BUY',
    timeframe: '1D',
    entryPrice: 8230.00,
    stopLoss: 8180.00,
    takeProfit1: 8320.00,
    takeProfit2: 8400.00,
    riskReward: '1 : 3.40',
    arrowPattern: 'DEEP VALUE ARROW ACCUMULATION',
    confidence: 89,
    plainRule: 'UK institutional dividend flows triggered massive arrow expansion on the daily support zone.',
    timestamp: '1 HOUR AGO',
    isPremiumAlert: false
  }
];

export const FREE_BOTS: FreeBot[] = [
  {
    id: 'bot-arrow-breakout',
    name: 'ARROW INSTITUTIONAL VOLUME BREAKOUT BOT',
    tagline: 'Detects massive volume expansion arrows before 300+ pip moves',
    language: 'PINE SCRIPT v5',
    winRate: '72.4%',
    profitFactor: '2.84',
    sharpeRatio: '2.15',
    bestTimeframe: '15m - 1H',
    description: 'This is the exact algorithm used on our terminal. It measures volume density relative to 20-period EMA. When an arrow expands 2.5x in width and closes in the top 15% of its height, it fires an immediate market order with a 1:3 trailing risk.',
    plainEnglishLogic: 'Wait until the big institutions place orders that make the arrow super thick and tall. Hop on their back and ride the wave.',
    code: `//@version=5
strategy("Arrow Volume-Expansion Bot [QUANT]", overlay=true, initial_capital=10000, default_qty_type=strategy.percent_of_equity, default_qty_value=20)

// Parameters
volMultiplier = input.float(2.2, "Arrow Width Threshold (Volume Multiplier)")
length = input.int(20, "Volume Moving Average")

// Calculations
avgVol = ta.sma(volume, length)
isFatArrow = volume > (avgVol * volMultiplier)
priceRange = high - low
isTallArrow = (close - open) > (priceRange * 0.65)
isBullish = close > open
isBearish = close < open

// Entry conditions
longCondition = isFatArrow and isTallArrow and isBullish and (close > ta.ema(close, 50))
shortCondition = isFatArrow and (open - close) > (priceRange * 0.65) and isBearish and (close < ta.ema(close, 50))

if (longCondition)
    strategy.entry("ArrowLong", strategy.long)
    strategy.exit("TP/SL", "ArrowLong", stop=low - (priceRange * 0.5), limit=close + (priceRange * 3.0))

if (shortCondition)
    strategy.entry("ArrowShort", strategy.short)
    strategy.exit("TP/SL", "ArrowShort", stop=high + (priceRange * 0.5), limit=close - (priceRange * 3.0))

// Visual Arrow Plotting
plotshape(longCondition, style=shape.arrowup, location=location.belowbar, color=color.white, size=size.huge, text="FAT ARROW BUY")
plotshape(shortCondition, style=shape.arrowdown, location=location.abovebar, color=color.gray, size=size.huge, text="FAT ARROW SELL")`
  },
  {
    id: 'bot-python-ccxt',
    name: 'PYTHON CCXT INSTITUTIONAL DELTA BOT',
    tagline: 'Runs 24/7 on Termux, Raspberry Pi, or VPS via WebSocket',
    language: 'PYTHON (CCXT)',
    winRate: '68.9%',
    profitFactor: '2.41',
    sharpeRatio: '1.92',
    bestTimeframe: '5m - 15m',
    description: 'Autonomous Python script that connects to Binance, Bybit, or OKX using the ccxt library. Calculates orderbook delta and arrow volume width dynamically. Places limit orders inside liquidity pools and pushes notifications to your phone.',
    plainEnglishLogic: 'Reads live trades straight from the exchange in milliseconds. If buyers flood the order book with 3x normal money, it buys automatically.',
    code: `import ccxt
import time
import numpy as np

# Connect to exchange
exchange = ccxt.binance({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET_KEY',
    'enableRateLimit': True,
})

SYMBOL = 'BTC/USDT'
TIMEFRAME = '15m'
VOLUME_MULT = 2.4

def run_arrow_bot():
    print(f"[*] Arrow Quant Bot Started on {SYMBOL} [{TIMEFRAME}]...")
    while True:
        try:
            bars = exchange.fetch_ohlcv(SYMBOL, timeframe=TIMEFRAME, limit=30)
            volumes = [b[5] for b in bars[:-1]]
            avg_vol = np.mean(volumes)
            
            latest = bars[-1]
            o, h, l, c, v = latest[1], latest[2], latest[3], latest[4], latest[5]
            
            arrow_width = v / avg_vol
            arrow_height = abs(c - o)
            is_bull = c > o
            
            print(f"[STATUS] Close: {c} | Arrow Width Ratio: {arrow_width:.2f}x | Bull: {is_bull}")
            
            if arrow_width >= VOLUME_MULT and is_bull:
                print(f"[!] WHALE ARROW BUY DETECTED! Price: {c} Vol: {v}")
                # Place market buy order
                # order = exchange.create_market_buy_order(SYMBOL, 0.05)
                # Send alert to WhatsApp / SMS phone
                # send_alert_push(f"Fat Arrow Buy on {SYMBOL}: {c}")
                
            time.sleep(30)
        except Exception as e:
            print(f"[!] Error: {e}")
            time.sleep(10)

if __name__ == '__main__':
    run_arrow_bot()`
  },
  {
    id: 'bot-mql5-forex',
    name: 'METATRADER 5 ARROW SCALPER (GBP/USD & GOLD)',
    tagline: 'Instant execution Expert Advisor for prop firms & FTMO challenges',
    language: 'MT5 MQL5',
    winRate: '75.1%',
    profitFactor: '3.12',
    sharpeRatio: '2.40',
    bestTimeframe: '15m',
    description: 'Hardened MQL5 Expert Advisor built specifically for passing Forex Prop Firm challenges (FTMO, The Funded Trader). Strictly manages 0.5% max risk per trade with auto breakeven once price moves 1.5R.',
    plainEnglishLogic: 'Never gambles. Calculates your exact lot size so you can never lose more than 0.5% of your account on a bad day.',
    code: `//+------------------------------------------------------------------+
//|                                     ArrowQuantScalper.mq5        |
//|                        Copyright 2026, Arrow Quant Systems       |
//+------------------------------------------------------------------+
#property copyright "Arrow Quant Systems"
#property link      "https://arrowquant.terminal"
#property version   "2.00"

input double InpRiskPercent = 0.5;   // Max Risk % per trade
input double InpVolMultiplier = 2.5; // Arrow Volume Width Factor
input int    InpMAPeriod = 20;       // Volume Benchmark Period

// Core tick handler
void OnTick()
{
   // Check bar close
   static datetime lastBar;
   datetime currentBar = iTime(_Symbol, _Period, 0);
   if (currentBar == lastBar) return;
   lastBar = currentBar;
   
   double vol[];
   CopyTickVolume(_Symbol, _Period, 1, InpMAPeriod + 1, vol);
   
   double sum = 0;
   for(int i = 0; i < InpMAPeriod; i++) sum += vol[i];
   double avgVol = sum / InpMAPeriod;
   
   double lastVol = vol[InpMAPeriod];
   double ratio = lastVol / avgVol;
   
   MqlRates rates[];
   CopyRates(_Symbol, _Period, 1, 1, rates);
   
   bool isBull = rates[0].close > rates[0].open;
   
   if (ratio >= InpVolMultiplier && isBull) {
      Print("Fat Arrow Buy triggered! Volume Ratio: ", ratio);
      // Auto lot size calculation based on ATR SL
   }
}`
  }
];

export const HISTORICAL_SIGNALS: HistoricalSignal[] = [
  {
    id: 'hs-1',
    date: 'Yesterday',
    timeUTC: '14:30 UTC',
    symbol: 'GBP/USD',
    direction: 'BUY',
    timeframe: '15M',
    entryPrice: 1.2965,
    exitPrice: 1.3060,
    result: 'TP2_HIT',
    pnlR: '+3.15R',
    returnPct: '+0.73%',
    arrowPattern: 'WIDE ARROW ABSORPTION (3.2x VOL)',
    plainSummary: 'London BoE rate cut absorption. Fat white arrow formed on 1.2950 support; drove straight into TP2 target.',
  },
  {
    id: 'hs-2',
    date: 'Yesterday',
    timeUTC: '09:15 UTC',
    symbol: 'BTC/USDT',
    direction: 'BUY',
    timeframe: '1H',
    entryPrice: 92400.00,
    exitPrice: 94800.00,
    result: 'TP2_HIT',
    pnlR: '+3.42R',
    returnPct: '+2.60%',
    arrowPattern: 'WHALE INFLOW PINBAR',
    confidence: 94,
    plainSummary: 'Institutional ETFs poured $410M into market depth. Fat upward arrow pushed to $95k.',
  } as any,
  {
    id: 'hs-3',
    date: '02 Nov 2026',
    timeUTC: '13:00 UTC',
    symbol: 'XAU/USD',
    direction: 'BUY',
    timeframe: '4H',
    entryPrice: 2730.00,
    exitPrice: 2758.00,
    result: 'TP1_HIT',
    pnlR: '+2.00R',
    returnPct: '+1.02%',
    arrowPattern: 'CENTRAL BANK RESERVE ACCUMULATION',
    plainSummary: 'Sovereign vault buy order swept through liquidity; closed 50% at TP1, trailing stop moved to breakeven.',
  },
  {
    id: 'hs-4',
    date: '01 Nov 2026',
    timeUTC: '16:45 UTC',
    symbol: 'EUR/USD',
    direction: 'SELL',
    timeframe: '1H',
    entryPrice: 1.0890,
    exitPrice: 1.0890,
    result: 'BREAKEVEN',
    pnlR: '+0.00R',
    returnPct: '0.00%',
    arrowPattern: 'ECB GROWTH REJECTION',
    plainSummary: 'Price moved +1.4R before stalling at support. Auto-breakeven rule triggered with zero monetary loss.',
  },
  {
    id: 'hs-5',
    date: '31 Oct 2026',
    timeUTC: '11:20 UTC',
    symbol: 'FTSE 100',
    direction: 'BUY',
    timeframe: '1D',
    entryPrice: 8190.00,
    exitPrice: 8265.00,
    result: 'TP2_HIT',
    pnlR: '+3.50R',
    returnPct: '+0.91%',
    arrowPattern: 'UK DIVIDEND INFLOW ARROW',
    plainSummary: 'UK blue-chip cash yields triggered tall white expansion arrow off 8,180 key level.',
  },
  {
    id: 'hs-6',
    date: '30 Oct 2026',
    timeUTC: '15:30 UTC',
    symbol: 'NVDA',
    direction: 'BUY',
    timeframe: '15M',
    entryPrice: 139.50,
    exitPrice: 137.80,
    result: 'SL_HIT',
    pnlR: '-1.00R',
    returnPct: '-1.22%',
    arrowPattern: 'TECH EARNINGS VOLATILITY SWEEP',
    plainSummary: 'Clean stop loss executed according to rules. Controlled loss of exactly 1.0R (pre-calculated £15).',
  },
  {
    id: 'hs-7',
    date: '29 Oct 2026',
    timeUTC: '08:00 UTC',
    symbol: 'BRENT/USD',
    direction: 'SELL',
    timeframe: '1H',
    entryPrice: 76.80,
    exitPrice: 74.30,
    result: 'TP2_HIT',
    pnlR: '+2.85R',
    returnPct: '+3.25%',
    arrowPattern: 'OPEC SUPPLY RELEASE DOWN-ARROW',
    plainSummary: 'Widening red/hollow arrow confirmed breakdown below $76.20 support floor.',
  }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-1',
    timestamp: Date.now() - 3600 * 1000 * 5,
    dateStr: 'Today',
    timeStr: '11:42 UTC',
    assetSymbol: 'GBP/USD',
    assetName: 'British Pound / US Dollar',
    direction: 'BUY',
    linkedSignalId: 'hs-1',
    linkedSignalSummary: 'Desk Alert: London BoE Rate Cut Reversal (1.2965)',
    entryPrice: 1.2968,
    exitPrice: 1.3055,
    positionSizeLots: 0.12,
    pnlAmount: 78.30,
    outcome: 'WIN',
    riskReward: '1 : 2.9',
    notes: 'Followed desk alert strictly. Waited for fat arrow confirmation on 15M. Resisted the urge to close early when price paused at 1.3000.',
    emotionsRating: 'PERFECT_EXECUTION',
  },
  {
    id: 'j-2',
    timestamp: Date.now() - 3600 * 1000 * 28,
    dateStr: 'Yesterday',
    timeStr: '14:15 UTC',
    assetSymbol: 'XAU/USD',
    assetName: 'Gold Spot',
    direction: 'BUY',
    linkedSignalId: 'hs-3',
    linkedSignalSummary: 'Desk Alert: Central Bank Reserve Accumulation (2730)',
    entryPrice: 2732.00,
    exitPrice: 2755.00,
    positionSizeLots: 0.08,
    pnlAmount: 147.20,
    outcome: 'WIN',
    riskReward: '1 : 2.5',
    notes: 'Used the Never Blow Up calculator before entering. Sized my risk at exactly £40. Closed half position at TP1 and let the rest run.',
    emotionsRating: 'DISCIPLINED',
  },
  {
    id: 'j-3',
    timestamp: Date.now() - 3600 * 1000 * 52,
    dateStr: '02 Nov',
    timeStr: '16:00 UTC',
    assetSymbol: 'NVDA',
    assetName: 'NVIDIA Corp',
    direction: 'BUY',
    linkedSignalId: 'hs-6',
    linkedSignalSummary: 'Desk Alert: Tech Earnings Volatility (139.50)',
    entryPrice: 139.60,
    exitPrice: 137.90,
    positionSizeLots: 0.05,
    pnlAmount: -25.50,
    outcome: 'LOSS',
    riskReward: '1 : 1.0',
    notes: 'Market reversed suddenly on chip export news. Respected my pre-set Stop Loss and did NOT move it down. Small controlled loss.',
    emotionsRating: 'DISCIPLINED',
  }
];
