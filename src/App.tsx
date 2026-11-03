import React, { useState, useMemo, useEffect } from 'react';
import {
  ASSETS,
  generateArrowBars,
  getAssetFundamentals,
  NEWS_FORECAST_DATA,
  TRADING_SIGNALS,
  FREE_BOTS,
  HISTORICAL_SIGNALS
} from './data/marketData';
import { Asset, UserProfile } from './types';
import { TerminalHeader } from './components/TerminalHeader';
import { ArrowVolumeChart } from './components/ArrowVolumeChart';
import { SimpleFundamentals } from './components/SimpleFundamentals';
import { NewsForecastTable } from './components/NewsForecastTable';
import { SignalAlertCard } from './components/SignalAlertCard';
import { BotVaultModal } from './components/BotVaultModal';
import { InstrumentsExplorer } from './components/InstrumentsExplorer';
import { DocumentationView } from './components/DocumentationView';
import { RiskCalculator } from './components/RiskCalculator';
import { WhaleScanner } from './components/WhaleScanner';
import { TradingJournal } from './components/TradingJournal';
import { UserDashboard } from './components/UserDashboard';
import { AuthModal } from './components/AuthModal';
import { LegalModal } from './components/LegalModal';
import { sound } from './utils/audio';
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Smartphone,
  Cpu,
  Layers,
  HelpCircle,
  Shield,
  Terminal as TerminalIcon,
  ShieldAlert,
  Lock,
  FileText,
  Calculator,
  Zap,
  BookOpen,
  User,
  History
} from 'lucide-react';

export type NavPage =
  | 'CHART'
  | 'JOURNAL'
  | 'DASHBOARD'
  | 'SCANNER'
  | 'CALCULATOR'
  | 'INSTRUMENTS'
  | 'FUNDAMENTALS'
  | 'NEWS'
  | 'SIGNALS'
  | 'BOTS'
  | 'DOCS'
  | 'ALL';

export const App: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0]);
  const [timeframe, setTimeframe] = useState<string>('1H');
  const [activePage, setActivePage] = useState<NavPage>('CHART');
  
  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Legal Modal State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'DISCLAIMER' | 'PRIVACY' | 'TERMS'>('DISCLAIMER');

  // Load user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('arrow_quant_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        // Fallback
      }
    }
  }, []);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('arrow_quant_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('arrow_quant_user');
  };

  // Handle URL hash navigation for clean browser history and bookmarking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toUpperCase();
      if (
        [
          'CHART',
          'JOURNAL',
          'DASHBOARD',
          'SCANNER',
          'CALCULATOR',
          'INSTRUMENTS',
          'FUNDAMENTALS',
          'NEWS',
          'SIGNALS',
          'BOTS',
          'DOCS',
          'ALL',
        ].includes(hash)
      ) {
        setActivePage(hash as NavPage);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page: NavPage) => {
    sound.playClick();
    setActivePage(page);
    window.location.hash = page.toLowerCase();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAsset = (asset: Asset) => {
    sound.playClick();
    setSelectedAsset(asset);
  };

  const openLegal = (tab: 'DISCLAIMER' | 'PRIVACY' | 'TERMS') => {
    sound.playClick();
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  // Generate dynamic arrow bars for active asset and timeframe
  const bars = useMemo(() => {
    const barCount = timeframe === '15M' ? 44 : timeframe === '1H' ? 36 : timeframe === '4H' ? 28 : 20;
    return generateArrowBars(selectedAsset.price, barCount);
  }, [selectedAsset, timeframe]);

  // Fundamentals for active asset (smart fallback covers all 42 instruments)
  const fundamentals = useMemo(() => {
    return getAssetFundamentals(selectedAsset);
  }, [selectedAsset]);

  const navItems: { id: NavPage; label: string; tag: string }[] = [
    { id: 'CHART', label: '01 // ARROW CHART', tag: 'PRICE × VOL' },
    { id: 'JOURNAL', label: '02 // TRADING JOURNAL', tag: 'AUTOTIMED' },
    { id: 'DASHBOARD', label: '03 // DASHBOARD & PAST SIGNALS', tag: 'ARCHIVE' },
    { id: 'SCANNER', label: '04 // WHALE RADAR', tag: '42 PAIRS' },
    { id: 'CALCULATOR', label: '05 // RISK & LOTS', tag: 'SAFE SIZING' },
    { id: 'INSTRUMENTS', label: '06 // ALL PAIRS', tag: `${ASSETS.length} ASSETS` },
    { id: 'FUNDAMENTALS', label: '07 // FUNDAMENTALS', tag: 'PLAIN WORDS' },
    { id: 'NEWS', label: '08 // NEWS RADAR', tag: '3-STAR IMPACT' },
    { id: 'SIGNALS', label: '09 // LIVE SIGNALS', tag: 'WHATSAPP/SMS' },
    { id: 'BOTS', label: '10 // FREE BOTS', tag: 'BACKTESTED' },
    { id: 'DOCS', label: '11 // HOW IT WORKS', tag: 'MANUAL' },
    { id: 'ALL', label: 'MASTER // ALL-IN-ONE', tag: 'FULL DESK' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col selection:bg-white selection:text-black">
      {/* Topmost Terminal Header with Unified Wide Search & User Session Trigger */}
      <TerminalHeader
        allAssets={ASSETS}
        selectedAsset={selectedAsset}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSelectAsset={handleSelectAsset}
        onOpenInstruments={() => navigateTo('INSTRUMENTS')}
      />

      {/* Primary Dedicated Page Navigation Bar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/90 sticky top-0 z-40 backdrop-blur-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5">
          <span className="text-[10px] text-zinc-500 mr-1 hidden sm:inline">VIEW:</span>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`px-3 py-1.5 text-xs border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'border-white bg-white text-black font-extrabold shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                    : 'border-zinc-800 bg-black text-zinc-400 hover:text-white hover:border-zinc-600'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 ${
                    isActive ? 'bg-black text-white' : 'text-zinc-600'
                  }`}
                >
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Current Active Asset indicator with click-to-open directory */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="text-zinc-500 text-[11px] uppercase">
            ACTIVE ASSET:
          </span>
          <button
            onClick={() => navigateTo('INSTRUMENTS')}
            className="text-white font-extrabold border border-white bg-black px-2.5 py-1 hover:bg-zinc-900 transition-colors shadow-[0_0_8px_rgba(255,255,255,0.2)] flex items-center gap-1.5"
            title="Search & browse all instruments"
          >
            <span>{selectedAsset.symbol}</span>
            <span className="text-zinc-300 font-mono">
              ${selectedAsset.price.toLocaleString(undefined, {
                minimumFractionDigits: selectedAsset.price < 10 ? 3 : 2,
                maximumFractionDigits: selectedAsset.price < 10 ? 3 : 2,
              })}
            </span>
            <span
              className={`text-[9px] px-1 py-0.2 ${
                selectedAsset.change24h >= 0 ? 'bg-white text-black' : 'border border-zinc-700 text-zinc-300'
              }`}
            >
              {selectedAsset.change24h >= 0 ? '▲' : '▼'} {Math.abs(selectedAsset.change24h)}%
            </span>
          </button>
        </div>
      </nav>

      {/* Main Page Content Canvas */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 space-y-6">
        {/* Terminal Header Alert Banner */}
        <div className="border border-white/80 bg-zinc-950 p-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 border border-white bg-black">
                <span className="text-xl font-bold">▲</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm tracking-wider">
                    ARROW QUANT PROTOCOL // LONDON REGION (UK)
                  </span>
                  <span className="bg-white text-black text-[10px] font-bold px-1.5 py-0.2">
                    ACTIVE
                  </span>
                </div>
                <p className="text-zinc-400 mt-1 max-w-4xl leading-relaxed">
                  The alternative to Japanese candlesticks: <strong className="text-white">Arrows get taller with price movement</strong> and <strong className="text-white">wider with trading volume</strong>. Zero confusing jargon.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="border border-zinc-800 p-2 bg-black text-right">
                <span className="text-[10px] text-zinc-500 block">SELECTED ASSET</span>
                <span className="text-white font-bold">{selectedAsset.symbol} ({selectedAsset.name})</span>
              </div>
              <div className="border border-zinc-800 p-2 bg-black text-right">
                <span className="text-[10px] text-zinc-500 block">VALUATION STATUS</span>
                <span className="text-white font-bold">{selectedAsset.simpleValuation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PAGE 1: ARROW VECTOR CHART VIEW                          */}
        {/* ======================================================== */}
        {(activePage === 'CHART' || activePage === 'ALL') && (
          <section id="chart-section" className="space-y-4">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[01 // PROPRIETARY ARROW VECTOR CHART]</span>
              </div>
            )}
            <ArrowVolumeChart
              asset={selectedAsset}
              bars={bars}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />

            {/* Quick Risk Calculator integrated below chart for immediate execution */}
            {activePage === 'CHART' && (
              <RiskCalculator selectedAsset={selectedAsset} />
            )}
          </section>
        )}

        {/* ======================================================== */}
        {/* PAGE 2: CLEAN TRADING JOURNAL                            */}
        {/* ======================================================== */}
        {(activePage === 'JOURNAL' || activePage === 'ALL') && (
          <section id="journal-section" className="space-y-3">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[02 // CLEAN QUANT TRADING JOURNAL & DISCIPLINE LOG]</span>
              </div>
            )}
            <TradingJournal
              assets={ASSETS}
              selectedAsset={selectedAsset}
              activeSignals={TRADING_SIGNALS}
              pastSignals={HISTORICAL_SIGNALS}
              onSelectAsset={handleSelectAsset}
              onNavigateToChart={() => navigateTo('CHART')}
            />
          </section>
        )}

        {/* ======================================================== */}
        {/* PAGE 3: USER DASHBOARD & PAST DESK SIGNALS ARCHIVE       */}
        {/* ======================================================== */}
        {(activePage === 'DASHBOARD' || activePage === 'ALL') && (
          <section id="dashboard-section" className="space-y-3">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[03 // USER DASHBOARD & HISTORICAL DESK SIGNALS ARCHIVE]</span>
              </div>
            )}
            <UserDashboard
              user={user}
              historicalSignals={HISTORICAL_SIGNALS}
              onOpenAuth={() => setAuthModalOpen(true)}
              onSelectAsset={handleSelectAsset}
              onNavigateToJournal={() => navigateTo('JOURNAL')}
              onNavigateToChart={() => navigateTo('CHART')}
              assets={ASSETS}
            />
          </section>
        )}

        {/* ======================================================== */}
        {/* PAGE 4: WHALE MARKET SCANNER                             */}
        {/* ======================================================== */}
        {(activePage === 'SCANNER' || activePage === 'ALL') && (
          <section id="scanner-section" className="space-y-3">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[04 // LIVE FAT ARROW WHALE MARKET SCANNER]</span>
              </div>
            )}
            <WhaleScanner
              assets={ASSETS}
              onSelectAsset={handleSelectAsset}
              onNavigateToChart={() => navigateTo('CHART')}
            />
          </section>
        )}

        {/* ======================================================== */}
        {/* PAGE 5: PLAIN ENGLISH RISK CALCULATOR                    */}
        {/* ======================================================== */}
        {(activePage === 'CALCULATOR' || activePage === 'ALL') && (
          <section id="calculator-section" className="space-y-3">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[05 // JARGON-FREE RISK & LOT SIZE CALCULATOR]</span>
              </div>
            )}
            <RiskCalculator selectedAsset={selectedAsset} />
          </section>
        )}

        {/* ======================================================== */}
        {/* PAGE 6: INSTRUMENTS EXPLORER DIRECTORY                   */}
        {/* ======================================================== */}
        {(activePage === 'INSTRUMENTS' || activePage === 'ALL') && (
          <section id="instruments-section" className="space-y-3">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[06 // ALL MARKET INSTRUMENTS & DIRECTORY]</span>
              </div>
            )}
            <InstrumentsExplorer
              assets={ASSETS}
              selectedAsset={selectedAsset}
              onSelectAsset={handleSelectAsset}
              onNavigateToChart={() => navigateTo('CHART')}
            />
          </section>
        )}

        {/* ======================================================== */}
        {/* PAGE 7: PLAIN-ENGLISH FUNDAMENTALS VIEW                  */}
        {/* ======================================================== */}
        {(activePage === 'FUNDAMENTALS' || activePage === 'ALL') && (
          <section id="fundamentals-section" className="space-y-3">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[07 // PLAIN ENGLISH FUNDAMENTALS & SOLVENCY CHEATSHEET]</span>
              </div>
            )}
            <SimpleFundamentals
              gauges={fundamentals}
              selectedAsset={selectedAsset}
            />
          </section>
        )}

        {/* ======================================================== */}
        {/* PAGE 8: ECONOMIC NEWS FORECAST CALENDAR                  */}
        {/* ======================================================== */}
        {(activePage === 'NEWS' || activePage === 'ALL') && (
          <section id="news-section" className="space-y-3">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[08 // ECONOMIC NEWS FORECAST & IMPACT RADAR]</span>
              </div>
            )}
            <NewsForecastTable news={NEWS_FORECAST_DATA} />
          </section>
        )}

        {/* ======================================================== */}
        {/* PAGE 9: REAL-TIME SIGNALS & PHONE ALERTS                 */}
        {/* ======================================================== */}
        {(activePage === 'SIGNALS' || activePage === 'ALL') && (
          <section id="signals-section" className="space-y-3">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[09 // REAL-TIME ARROW SIGNALS & SAMPLE TESTER]</span>
              </div>
            )}
            <SignalAlertCard signals={TRADING_SIGNALS} />
          </section>
        )}

        {/* ======================================================== */}
        {/* PAGE 10: FREE TRADING BOT CODE VAULT                     */}
        {/* ======================================================== */}
        {(activePage === 'BOTS' || activePage === 'ALL') && (
          <section id="bots-section" className="space-y-3">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[10 // FREE TRADING BOT CODE VAULT & 30-DAY BACKTEST]</span>
              </div>
            )}
            <BotVaultModal bots={FREE_BOTS} />
          </section>
        )}

        {/* ======================================================== */}
        {/* PAGE 11: DOCUMENTATION & SPEC SHEET                      */}
        {/* ======================================================== */}
        {(activePage === 'DOCS' || activePage === 'ALL') && (
          <section id="docs-section" className="space-y-3">
            {activePage === 'ALL' && (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-900 pb-1">
                <span>[11 // SYSTEM SPECIFICATION & TRADING MANUAL]</span>
              </div>
            )}
            <DocumentationView />
          </section>
        )}
      </main>

      {/* Terminal Footer with Legal Compliance Links */}
      <footer className="border-t border-zinc-800 bg-black py-6 px-6 font-mono text-xs text-zinc-400">
        <div className="max-w-[1600px] mx-auto space-y-4">
          {/* Main Footer Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white font-bold">
                <TerminalIcon size={14} />
                <span>ARROW QUANT PROTOCOL // LONDON REGION (UK)</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Monochrome vector execution terminal. Engineered for clarity, speed, and institutional transparency.
              </p>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div>
                <span className="text-zinc-500">MONETIZATION:</span>{' '}
                <strong className="text-white">Free Open Bots + Paid WhatsApp/SMS/Email Alerts (£24/mo)</strong>
              </div>
              <span className="text-zinc-700">|</span>
              <div>
                <span className="text-zinc-500">ENGINE:</span>{' '}
                <strong className="text-white">v2.4.0 (LONDON QUANT DESK)</strong>
              </div>
            </div>
          </div>

          {/* Legal Compliance & Disclaimer Bar */}
          <div className="border-t border-zinc-900 pt-3 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => openLegal('DISCLAIMER')}
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
              >
                <ShieldAlert size={12} />
                <span className="underline underline-offset-2">FINANCIAL RISK DISCLAIMER</span>
              </button>
              <span className="text-zinc-700">•</span>
              <button
                onClick={() => openLegal('PRIVACY')}
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
              >
                <Lock size={12} />
                <span className="underline underline-offset-2">PRIVACY POLICY (UK GDPR)</span>
              </button>
              <span className="text-zinc-700">•</span>
              <button
                onClick={() => openLegal('TERMS')}
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
              >
                <FileText size={12} />
                <span className="underline underline-offset-2">TERMS OF SERVICE</span>
              </button>
            </div>

            <div className="text-zinc-500">
              © {new Date().getFullYear()} Arrow Quant Systems UK Ltd. All rights reserved.
            </div>
          </div>

          {/* FCA Standard Risk Warning Snippet */}
          <div className="text-[10px] text-zinc-600 bg-zinc-950 p-2 border border-zinc-900 leading-normal">
            <strong className="text-zinc-400">High Risk Investment Notice:</strong> Financial trading carries a high degree of risk to your capital. Spread bets, CFDs, and cryptocurrency derivatives are complex instruments with a high risk of losing money rapidly due to leverage. Our terminal provides mathematical vector indicators and algorithmic models for research purposes only.
          </div>
        </div>
      </footer>

      {/* Auth / Login Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Legal & Compliance Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </div>
  );
};

export default App;
