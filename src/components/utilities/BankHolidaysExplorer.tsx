import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  CalendarDays, 
  ArrowRight 
} from "lucide-react";
import { UkDisclaimer } from "../common/UkDisclaimer";

interface BankHolidayEvent {
  title: string;
  date: string;
  notes?: string;
  bunting?: boolean;
}

export function BankHolidaysExplorer() {
  const [division, setDivision] = useState<'england-and-wales' | 'scotland' | 'northern-ireland'>('england-and-wales');
  const [holidays, setHolidays] = useState<BankHolidayEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Working Days & Notice Calculator
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [workingDaysToAdd, setWorkingDaysToAdd] = useState(10);
  const [targetDateResult, setTargetDateResult] = useState<string>("");

  useEffect(() => {
    fetchBankHolidays();
  }, [division]);

  const fetchBankHolidays = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://www.gov.uk/bank-holidays.json");
      const json = await res.json();
      if (json && json[division] && json[division].events) {
        // Filter future & current year
        const nowStr = new Date().toISOString().slice(0, 4);
        const filtered = json[division].events.filter((e: BankHolidayEvent) => e.date >= `${nowStr}-01-01`).slice(0, 12);
        setHolidays(filtered);
      }
    } catch (err) {
      // Fallback official dates
      setHolidays([
        { title: "New Year's Day", date: "2026-01-01" },
        { title: "Good Friday", date: "2026-04-03" },
        { title: "Easter Monday", date: "2026-04-06" },
        { title: "Early May bank holiday", date: "2026-05-04" },
        { title: "Spring bank holiday", date: "2026-05-25" },
        { title: "Summer bank holiday", date: "2026-08-31" },
        { title: "Christmas Day", date: "2026-12-25" },
        { title: "Boxing Day", date: "2026-12-28" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate working days excluding weekends and bank holidays
  useEffect(() => {
    let current = new Date(startDate);
    let added = 0;
    const holidayDates = new Set(holidays.map(h => h.date));

    while (added < workingDaysToAdd) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      const dateString = current.toISOString().slice(0, 10);

      // Exclude Saturday (6) and Sunday (0) and Bank Holidays
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.has(dateString)) {
        added++;
      }
    }

    setTargetDateResult(current.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, [startDate, workingDaysToAdd, holidays]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Calendar className="w-3.5 h-3.5" />
            Official GOV.UK Open Data Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            UK Bank Holidays &amp; Working Days Calculator
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Live integration with the official <code className="text-blue-300">gov.uk/bank-holidays.json</code> registry. 
            View upcoming public holidays across England &amp; Wales, Scotland, and Northern Ireland, 
            and accurately calculate legal notice deadlines or statutory response windows.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl="https://www.gov.uk/bank-holidays"
        customSourceLabel="GOV.UK Bank Holidays Official Feed"
        notes="Data is consumed dynamically from the Crown Copyright Cabinet Office digital service."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Working Days & Statutory Deadline Calculator (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Working Days &amp; Notice Deadline Calculator
          </h3>
          <p className="text-xs text-slate-500">
            Automatically skips weekends (Saturday/Sunday) and official UK bank holidays.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Starting Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Business Working Days to Add
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={workingDaysToAdd}
                onChange={(e) => setWorkingDaysToAdd(Number(e.target.value) || 1)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono font-bold"
              />
              <div className="flex gap-2 mt-2">
                {[5, 10, 20, 28].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setWorkingDaysToAdd(d)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    +{d} days
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Calculated Expiry / Due Date
              </span>
              <div className="text-base font-extrabold text-blue-950 dark:text-blue-100">
                {targetDateResult || "Calculating..."}
              </div>
              <span className="text-[11px] text-blue-800 dark:text-blue-300">
                Strict UK business days excluding bank holidays
              </span>
            </div>
          </div>
        </div>

        {/* Bank Holidays List (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Upcoming UK Bank Holidays
            </h3>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setDivision('england-and-wales')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  division === 'england-and-wales' ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" : "text-slate-500"
                }`}
              >
                England &amp; Wales
              </button>
              <button
                onClick={() => setDivision('scotland')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  division === 'scotland' ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" : "text-slate-500"
                }`}
              >
                Scotland
              </button>
              <button
                onClick={() => setDivision('northern-ireland')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  division === 'northern-ireland' ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" : "text-slate-500"
                }`}
              >
                N. Ireland
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {holidays.map((h, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-2"
              >
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    {h.title}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(h.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Public Holiday
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
