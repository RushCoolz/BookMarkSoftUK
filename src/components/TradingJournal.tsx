import React, { useState, useEffect } from 'react';
import { Asset, JournalEntry, TradingSignal, HistoricalSignal } from '../types';
import { BookOpen, Plus, Download, Trash2, ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  assets: Asset[];
  selectedAsset: Asset;
  activeSignals: TradingSignal[];
  pastSignals: HistoricalSignal[];
  onSelectAsset: (asset: Asset) => void;
  onNavigateToChart: () => void;
}

export const TradingJournal: React.FC<Props> = ({
  assets,
  selectedAsset,
  activeSignals,
  pastSignals,
  onSelectAsset,
  onNavigateToChart,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form Fields
  const [assetSymbol, setAssetSymbol] = useState(selectedAsset.symbol);
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [linkedSignal, setLinkedSignal] = useState<string>('NONE');
  const [entryPrice, setEntryPrice] = useState<number>(selectedAsset.price);
  const [exitPrice, setExitPrice] = useState<number>(selectedAsset.price);
  const [lots, setLots] = useState<number>(0.1);
  const [pnl, setPnl] = useState<number>(50);
  const [outcome, setOutcome] = useState<'WIN' | 'LOSS' | 'BREAKEVEN'>('WIN');
  const [riskReward, setRiskReward] = useState<string>('1 : 2.5');
  const [emotions, setEmotions] = useState<'PERFECT_EXECUTION' | 'DISCIPLINED' | 'FOMO_CHASED' | 'MOVED_STOP_LOSS'>('DISCIPLINED');
  const [notes, setNotes] = useState<string>('');

  // Auto-calculated timestamps
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Load from localStorage or initialize with defaults
  useEffect(() => {
    const saved = localStorage.getItem('arrow_quant_journal');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch {
        // Fallback
      }
    } else {
      // Default initial mock entries
      const initial: JournalEntry[] = [
        {
          id: 'j-1',
          timestamp: Date.now() - 3600 * 1000 * 5,
          dateStr: 'Today',
          timeStr: '11:42 UTC',
          assetSymbol: 'GBP/USD',
          assetName: 'British Pound / US Dollar',
          direction: 'BUY',
          linkedSignalId: 'sig-2',
          linkedSignalSummary: 'Desk Alert: London BoE Rate Cut Reversal (1.2960)',
          entryPrice: 1.2965,
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
          linkedSignalId: 'sig-3',
          linkedSignalSummary: 'Desk Alert: Central Bank Reserve Accumulation (2742)',
          entryPrice: 2742.00,
          exitPrice: 2770.00,
          positionSizeLots: 0.08,
          pnlAmount: 147.20,
          outcome: 'WIN',
          riskReward: '1 : 2.8',
          notes: 'Used the Never Blow Up calculator before entering. Sized my risk at exactly £40. Closed half position at TP1 and let the rest run.',
          emotionsRating: 'DISCIPLINED',
        },
      ];
      setEntries(initial);
      localStorage.setItem('arrow_quant_journal', JSON.stringify(initial));
    }
  }, []);

  // Sync timestamps automatically
  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(now.toISOString().split('T')[0]);
    setCurrentTimeStr(now.toISOString().substring(11, 16) + ' UTC');
  }, [showForm]);

  // When selectedAsset changes from parent, sync form default
  useEffect(() => {
    setAssetSymbol(selectedAsset.symbol);
    setEntryPrice(selectedAsset.price);
    setExitPrice(selectedAsset.price);
  }, [selectedAsset]);

  // Save to localStorage whenever entries update
  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('arrow_quant_journal', JSON.stringify(newEntries));
  };

  // Handle Linked Signal Selection
  const handleLinkedSignalChange = (val: string) => {
    setLinkedSignal(val);
    if (val !== 'NONE') {
      const activeSig = activeSignals.find((s) => s.id === val);
      if (activeSig) {
        setAssetSymbol(activeSig.symbol);
        setDirection(activeSig.direction);
        setEntryPrice(activeSig.entryPrice);
        setExitPrice(activeSig.takeProfit1);
        setRiskReward(activeSig.riskReward);
        return;
      }
      const pastSig = pastSignals.find((s) => s.id === val);
      if (pastSig) {
        setAssetSymbol(pastSig.symbol);
        setDirection(pastSig.direction);
        setEntryPrice(pastSig.entryPrice);
        setExitPrice(pastSig.exitPrice);
        setRiskReward(pastSig.pnlR);
      }
    }
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWhaleAlert();

    const matchingAsset = assets.find((a) => a.symbol === assetSymbol) || selectedAsset;

    let linkedSummary: string | undefined = undefined;
    if (linkedSignal !== 'NONE') {
      const foundSig = [...activeSignals, ...pastSignals].find((s) => s.id === linkedSignal);
      if (foundSig) {
        linkedSummary = `Desk Alert: ${foundSig.symbol} ${foundSig.direction} (${(foundSig as any).arrowPattern || 'Verified'})`;
      }
    }

    const newEntry: JournalEntry = {
      id: 'j-' + Date.now().toString(36),
      timestamp: Date.now(),
      dateStr: currentDateStr || 'Today',
      timeStr: currentTimeStr || 'Now UTC',
      assetSymbol: matchingAsset.symbol,
      assetName: matchingAsset.name,
      direction,
      linkedSignalId: linkedSignal !== 'NONE' ? linkedSignal : undefined,
      linkedSignalSummary: linkedSummary,
      entryPrice,
      exitPrice,
      positionSizeLots: lots,
      pnlAmount: outcome === 'LOSS' ? -Math.abs(pnl) : Math.abs(pnl),
      outcome,
      riskReward,
      notes: notes || 'Executed according to arrow plan.',
      emotionsRating: emotions,
    };

    saveEntries([newEntry, ...entries]);
    setShowForm(false);
    setNotes('');
  };

  const handleDeleteEntry = (id: string) => {
    sound.playClick();
    if (window.confirm('Delete this journal entry?')) {
      const updated = entries.filter((e) => e.id !== id);
      saveEntries(updated);
    }
  };

  const handleExportCSV = () => {
    sound.playClick();
    const headers = [
      'ID',
      'Date',
      'Time',
      'Symbol',
      'Direction',
      'Entry',
      'Exit',
      'Lots',
      'PnL',
      'Outcome',
      'RiskReward',
      'LinkedSignal',
      'Discipline',
      'Notes',
    ];
    const rows = entries.map((e) => [
      e.id,
      e.dateStr,
      e.timeStr,
      e.assetSymbol,
      e.direction,
      e.entryPrice,
      e.exitPrice,
      e.positionSizeLots,
      e.pnlAmount,
      e.outcome,
      e.riskReward,
      e.linkedSignalSummary ? `"${e.linkedSignalSummary.replace(/"/g, '""')}"` : 'Independent',
      e.emotionsRating,
      `"${e.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `arrow_quant_journal_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregated Stats
  const totalPnL = entries.reduce((acc, curr) => acc + curr.pnlAmount, 0);
  const winCount = entries.filter((e) => e.outcome === 'WIN').length;
  const winRate = entries.length > 0 ? ((winCount / entries.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="border border-zinc-800 bg-black p-4 font-mono space-y-4">
      {/* Top Header */}
      <div className="border-b border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider flex items-center gap-1">
              <BookOpen size={13} />
              <span>CLEAN QUANT TRADING JOURNAL</span>
            </span>
            <span className="text-xs text-zinc-400">DISCIPLINE TRACKER</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Automatically timestamps your execution, links to desk signals, and logs your emotional discipline for every trade.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              sound.playClick();
              setShowForm(!showForm);
            }}
            className="border-2 border-white bg-white text-black font-extrabold px-3 py-1.5 hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          >
            <Plus size={14} />
            <span>{showForm ? 'CANCEL' : 'RECORD NEW TRADE'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="border border-zinc-700 hover:border-white bg-zinc-950 text-zinc-300 hover:text-white px-2.5 py-1.5 transition-colors flex items-center gap-1"
            title="Download CSV report"
          >
            <Download size={13} />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Journal Performance KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="border border-zinc-900 bg-zinc-950 p-2.5">
          <span className="text-[10px] text-zinc-500 block">RECORDED TRADES</span>
          <span className="text-white font-extrabold text-sm">{entries.length} Logs</span>
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-2.5">
          <span className="text-[10px] text-zinc-500 block">JOURNAL WIN RATE</span>
          <span className="text-white font-extrabold text-sm">{winRate}% ({winCount} Wins)</span>
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-2.5">
          <span className="text-[10px] text-zinc-500 block">NET P&L RECORDED</span>
          <span className={`font-extrabold text-sm ${totalPnL >= 0 ? 'text-white' : 'text-zinc-400'}`}>
            {totalPnL >= 0 ? '+£' : '-£'}{Math.abs(totalPnL).toFixed(2)}
          </span>
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-2.5">
          <span className="text-[10px] text-zinc-500 block">EXECUTION DISCIPLINE</span>
          <span className="text-white font-extrabold text-sm">94.2% Adherence</span>
        </div>
      </div>

      {/* NEW TRADE ENTRY FORM (DRAWER) */}
      {showForm && (
        <form onSubmit={handleCreateEntry} className="border-2 border-white bg-zinc-950 p-4 space-y-4 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>[LOG TRADE EXECUTION]</span>
              <span className="text-[10px] text-zinc-400 font-normal">Auto-Timestamped</span>
            </span>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{currentDateStr}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                <span>{currentTimeStr}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Asset Selection */}
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">SELECT ASSET:</label>
              <select
                value={assetSymbol}
                onChange={(e) => {
                  setAssetSymbol(e.target.value);
                  const a = assets.find((x) => x.symbol === e.target.value);
                  if (a) {
                    setEntryPrice(a.price);
                    setExitPrice(a.price);
                  }
                }}
                className="w-full bg-black border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none font-bold"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.symbol}>
                    {a.symbol} ({a.name}) - ${a.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Link to Given Desk Signal */}
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">
                LINK TO DESK SIGNAL (IF APPLICABLE):
              </label>
              <select
                value={linkedSignal}
                onChange={(e) => handleLinkedSignalChange(e.target.value)}
                className="w-full bg-black border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none"
              >
                <option value="NONE">[Independent Trade // No Desk Signal]</option>
                <optgroup label="Active Desk Setups">
                  {activeSignals.map((s) => (
                    <option key={s.id} value={s.id}>
                      ACTIVE: {s.symbol} {s.direction} @ ${s.entryPrice.toLocaleString()} ({s.riskReward})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Past Desk Signals">
                  {pastSignals.map((s) => (
                    <option key={s.id} value={s.id}>
                      PAST: {s.symbol} {s.direction} @ ${s.entryPrice.toLocaleString()} ({s.result})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Direction */}
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">DIRECTION:</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDirection('BUY')}
                  className={`py-2 text-xs font-bold transition-colors ${
                    direction === 'BUY'
                      ? 'border border-white bg-white text-black'
                      : 'border border-zinc-800 bg-black text-zinc-400'
                  }`}
                >
                  ▲ BUY / LONG
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SELL')}
                  className={`py-2 text-xs font-bold transition-colors ${
                    direction === 'SELL'
                      ? 'border border-white bg-white text-black'
                      : 'border border-zinc-800 bg-black text-zinc-400'
                  }`}
                >
                  ▼ SELL / SHORT
                </button>
              </div>
            </div>

            {/* Entry Price */}
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">ENTRY PRICE ($):</label>
              <input
                type="number"
                step="any"
                required
                value={entryPrice}
                onChange={(e) => setEntryPrice(+e.target.value)}
                className="w-full bg-black border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none"
              />
            </div>

            {/* Exit Price */}
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">EXIT PRICE ($):</label>
              <input
                type="number"
                step="any"
                required
                value={exitPrice}
                onChange={(e) => setExitPrice(+e.target.value)}
                className="w-full bg-black border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none"
              />
            </div>

            {/* Lots / Position Size */}
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">POSITION SIZE (LOTS):</label>
              <input
                type="number"
                step="0.01"
                required
                value={lots}
                onChange={(e) => setLots(+e.target.value)}
                className="w-full bg-black border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none"
              />
            </div>

            {/* Trade Outcome */}
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">OUTCOME:</label>
              <div className="grid grid-cols-3 gap-1">
                {(['WIN', 'LOSS', 'BREAKEVEN'] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOutcome(o)}
                    className={`py-2 text-[10px] font-bold border transition-colors ${
                      outcome === o
                        ? 'border-white bg-white text-black'
                        : 'border-zinc-800 bg-black text-zinc-400'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Profit or Loss Amount in £ */}
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">NET PROFIT / LOSS (£):</label>
              <input
                type="number"
                step="0.5"
                required
                value={pnl}
                onChange={(e) => setPnl(+e.target.value)}
                placeholder="e.g. 50 or 120"
                className="w-full bg-black border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none font-bold"
              />
            </div>

            {/* Emotion / Discipline Score */}
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">PSYCHOLOGY / DISCIPLINE:</label>
              <select
                value={emotions}
                onChange={(e) => setEmotions(e.target.value as any)}
                className="w-full bg-black border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none"
              >
                <option value="PERFECT_EXECUTION">100% Perfect (Waited for arrow)</option>
                <option value="DISCIPLINED">Disciplined (Respected stop loss)</option>
                <option value="FOMO_CHASED">FOMO (Jumped in without setup)</option>
                <option value="MOVED_STOP_LOSS">Emotional (Widened stop loss)</option>
              </select>
            </div>
          </div>

          {/* Notes and Plain-English Reflection */}
          <div>
            <label className="block text-zinc-400 mb-1 text-[11px]">
              TRADE REFLECTION & LESSONS (PLAIN WORDS):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you observe on the Arrow Chart? Did you wait for institutional volume width? How did you manage emotions?"
              className="w-full bg-black border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-zinc-800 px-4 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="border-2 border-white bg-white text-black font-extrabold px-6 py-1.5 text-xs hover:bg-zinc-200 transition-colors"
            >
              SAVE TRADE TO JOURNAL →
            </button>
          </div>
        </form>
      )}

      {/* JOURNAL ENTRIES TABLE */}
      <div className="overflow-x-auto border border-zinc-900">
        <table className="w-full text-xs text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950 text-[10px] text-zinc-500 uppercase tracking-wider">
              <th className="py-2.5 px-3">DATE / TIME</th>
              <th className="py-2.5 px-3">INSTRUMENT</th>
              <th className="py-2.5 px-2">SIDE</th>
              <th className="py-2.5 px-2">LOTS</th>
              <th className="py-2.5 px-3">ENTRY ➔ EXIT</th>
              <th className="py-2.5 px-3">NET P&L</th>
              <th className="py-2.5 px-3">DISCIPLINE</th>
              <th className="py-2.5 px-4 min-w-[280px]">REFLECTION & SIGNAL LINK</th>
              <th className="py-2.5 px-2 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-zinc-500 text-xs">
                  Your journal is empty. Click "+ RECORD NEW TRADE" to log your first execution.
                </td>
              </tr>
            ) : (
              entries.map((entry) => {
                const isWin = entry.outcome === 'WIN';
                const isLoss = entry.outcome === 'LOSS';

                return (
                  <tr key={entry.id} className="hover:bg-zinc-950/80 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-white font-bold">{entry.dateStr}</div>
                      <div className="text-[10px] text-zinc-500">{entry.timeStr}</div>
                    </td>

                    {/* Instrument */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-extrabold text-white text-xs">{entry.assetSymbol}</span>
                      <span className="text-[10px] text-zinc-500 block truncate max-w-[120px]">{entry.assetName}</span>
                    </td>

                    {/* Side */}
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 font-bold ${
                          entry.direction === 'BUY'
                            ? 'bg-white text-black'
                            : 'border border-zinc-700 text-white'
                        }`}
                      >
                        {entry.direction}
                      </span>
                    </td>

                    {/* Lots */}
                    <td className="py-3 px-2 text-zinc-300 font-mono">
                      {entry.positionSizeLots}
                    </td>

                    {/* Price delta */}
                    <td className="py-3 px-3 text-zinc-300 whitespace-nowrap font-mono text-[11px]">
                      ${entry.entryPrice} ➔ ${entry.exitPrice}
                    </td>

                    {/* Net PnL */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`font-bold text-xs ${
                          isWin
                            ? 'text-white'
                            : isLoss
                            ? 'text-zinc-400 line-through'
                            : 'text-zinc-300'
                        }`}
                      >
                        {entry.pnlAmount >= 0 ? '+£' : '-£'}
                        {Math.abs(entry.pnlAmount).toFixed(2)}
                      </span>
                    </td>

                    {/* Discipline Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 border uppercase ${
                          entry.emotionsRating === 'PERFECT_EXECUTION'
                            ? 'border-white text-white font-bold bg-zinc-900'
                            : entry.emotionsRating === 'DISCIPLINED'
                            ? 'border-zinc-700 text-zinc-300'
                            : 'border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {entry.emotionsRating.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Notes & Linked Signal */}
                    <td className="py-3 px-4 text-xs leading-relaxed">
                      {entry.linkedSignalSummary && (
                        <div className="text-[10px] text-zinc-400 font-semibold mb-1 flex items-center gap-1">
                          <span className="text-white">LINKED:</span>
                          <span className="border-b border-zinc-800 pb-0.5">{entry.linkedSignalSummary}</span>
                        </div>
                      )}
                      <p className="text-zinc-300 text-[11px]">
                        "{entry.notes}"
                      </p>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-zinc-600 hover:text-white p-1 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
