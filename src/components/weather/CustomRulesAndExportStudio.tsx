import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  FileDown,
  Plus,
  Trash2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  WeatherData,
  CustomWeatherRule,
  TempUnit,
  SpeedUnit
} from '../../types/weather';
import {
  formatTempWithUnit,
  formatSpeed,
  decodeWmoCode
} from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface CustomRulesAndExportStudioProps {
  weather: WeatherData;
  unit: TempUnit;
  speedUnit: SpeedUnit;
}

const DEFAULT_RULES: CustomWeatherRule[] = [
  {
    id: 'rule-frost',
    name: 'Garden Frost Protection Alert',
    metric: 'temperature',
    operator: '<=',
    threshold: 2,
    unitLabel: '°C',
    enabled: true
  },
  {
    id: 'rule-sailing',
    name: 'Prime Wind Sport / Sailing Breeze',
    metric: 'windSpeed',
    operator: '>=',
    threshold: 22,
    unitLabel: 'km/h',
    enabled: true
  },
  {
    id: 'rule-astro',
    name: 'Clear-Sky Astrophotography Window',
    metric: 'cloudCover',
    operator: '<=',
    threshold: 25,
    unitLabel: '%',
    enabled: true
  },
  {
    id: 'rule-uv',
    name: 'High Solar UV Skin Protection',
    metric: 'uvIndex',
    operator: '>=',
    threshold: 5,
    unitLabel: 'UV',
    enabled: true
  }
];

function evaluateCondition(val: number, op: CustomWeatherRule['operator'], target: number): boolean {
  if (op === '<') return val < target;
  if (op === '<=') return val <= target;
  if (op === '>') return val > target;
  return val >= target;
}

export function CustomRulesAndExportStudio({
  weather,
  unit,
  speedUnit
}: CustomRulesAndExportStudioProps) {
  const { theme } = useWeatherTheme();

  const [rules, setRules] = useState<CustomWeatherRule[]>(() => {
    try {
      const saved = localStorage.getItem('aether_custom_rules');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_RULES;
  });

  const [newRuleName, setNewRuleName] = useState<string>('');
  const [newMetric, setNewMetric] = useState<CustomWeatherRule['metric']>('temperature');
  const [newOperator, setNewOperator] = useState<CustomWeatherRule['operator']>('>=');
  const [newThreshold, setNewThreshold] = useState<number>(18);

  const saveRules = (next: CustomWeatherRule[]) => {
    setRules(next);
    try {
      localStorage.setItem('aether_custom_rules', JSON.stringify(next));
    } catch {}
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const unitMap: Record<CustomWeatherRule['metric'], string> = {
      temperature: '°C',
      windSpeed: 'km/h',
      precipitation: 'mm',
      cloudCover: '%',
      uvIndex: 'UV'
    };
    const created: CustomWeatherRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName.trim() || `Custom ${newMetric} Trigger`,
      metric: newMetric,
      operator: newOperator,
      threshold: newThreshold,
      unitLabel: unitMap[newMetric],
      enabled: true
    };
    saveRules([created, ...rules]);
    setNewRuleName('');
  };

  const handleDeleteRule = (id: string) => {
    saveRules(rules.filter((r) => r.id !== id));
  };

  // 1-Click .ics Calendar Event Download
  const handleDownloadIcs = (eventType: 'golden-hour' | 'stargazing' | 'outdoor') => {
    const now = new Date();
    const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
    const title =
      eventType === 'golden-hour'
        ? `Golden Hour Photography Window (${weather.location.name})`
        : eventType === 'stargazing'
        ? `Deep-Sky Stargazing Window (${weather.location.name})`
        : `Prime Outdoor Weather Window (${weather.location.name})`;

    const startHr = eventType === 'golden-hour' ? '173000' : eventType === 'stargazing' ? '220000' : '100000';
    const endHr = eventType === 'golden-hour' ? '184500' : eventType === 'stargazing' ? '235900' : '120000';
    const desc = `Aether Observatory Weather Window for ${weather.location.name}. Temp: ${formatTempWithUnit(
      weather.current.temperature,
      unit
    )}, Wind: ${formatSpeed(weather.current.windSpeed, speedUnit)}, Clouds: ${
      weather.current.cloudCover
    }%.`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aether Atmos Observatory//EN',
      'BEGIN:VEVENT',
      `UID:aether-${eventType}-${Date.now()}@aether.observatory`,
      `DTSTAMP:${ymd}T120000Z`,
      `DTSTART:${ymd}T${startHr}`,
      `DTEND:${ymd}T${endHr}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${weather.location.name}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-${eventType}-${weather.location.name.toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 1-Click Printable Weather Dossier Download
  const handleDownloadDossier = () => {
    const wmo = decodeWmoCode(weather.current.weatherCode, weather.current.isDay);
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Aether Meteorological Dossier - ${weather.location.name}</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 32px; color: #0f172a; max-width: 820px; margin: 0 auto; }
  h1 { margin-bottom: 4px; }
  .meta { color: #475569; font-size: 13px; margin-bottom: 24px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .box { border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border-bottom: 1px solid #e2e8f0; padding: 8px; text-align: left; }
</style>
</head>
<body>
  <h1>AETHER ATMOS · Meteorological Briefing Dossier</h1>
  <div class="meta">Location: <strong>${weather.location.name}, ${weather.location.country}</strong> (${weather.location.latitude.toFixed(3)}°N, ${weather.location.longitude.toFixed(3)}°E) · Generated: ${new Date().toLocaleString()}</div>
  <div class="grid">
    <div class="box"><strong>Current Condition</strong><br/>${wmo.description} · ${formatTempWithUnit(weather.current.temperature, unit)} (Feels ${formatTempWithUnit(weather.current.apparentTemperature, unit)})</div>
    <div class="box"><strong>Wind &amp; Barometer</strong><br/>${formatSpeed(weather.current.windSpeed, speedUnit)} (Gusts ${formatSpeed(weather.current.windGusts, speedUnit)}) · ${weather.current.pressureMsl} hPa</div>
    <div class="box"><strong>Sky &amp; UV</strong><br/>Cloud Cover: ${weather.current.cloudCover}% · Humidity: ${weather.current.relativeHumidity}% · UV Index: ${weather.current.uvIndex}</div>
  </div>
  <h2>7-Day Synoptic Outlook</h2>
  <table>
    <thead><tr><th>Date</th><th>High / Low</th><th>Precip Sum</th><th>Rain Prob</th><th>Peak Wind</th><th>Sunrise / Sunset</th></tr></thead>
    <tbody>
      ${weather.daily
        .slice(0, 7)
        .map(
          (d) =>
            `<tr><td>${d.date}</td><td>${formatTempWithUnit(d.temperatureMax, unit)} / ${formatTempWithUnit(
              d.temperatureMin,
              unit
            )}</td><td>${d.precipitationSum} mm</td><td>${d.precipitationProbabilityMax}%</td><td>${formatSpeed(
              d.windSpeedMax,
              speedUnit
            )}</td><td>${d.sunrise.split('T')[1] || ''} / ${d.sunset.split('T')[1] || ''}</td></tr>`
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-weather-dossier-${weather.location.name.toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`relative w-full rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden space-y-6`}
    >
      <ThemeCardArtWrapper theme={theme} variant="standard" />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`}
      />

      {/* Top Header & Export Actions */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md shrink-0`}
          >
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black ${theme.ui.primaryText}`}>
              Custom Weather Alert Rule Builder &amp; Dossier / Calendar Export
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              Personal threshold rules evaluated against live &amp; 24-hour forecast telemetry + 1-click .ics &amp; briefing exports
            </p>
          </div>
        </div>

        {/* 1-Click Calendar & Dossier Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleDownloadIcs('golden-hour')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Golden Hour .ics</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownloadIcs('stargazing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform`}
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Stargazing .ics</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadDossier}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-transform`}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Briefing Dossier</span>
          </button>
        </div>
      </div>

      {/* Add Custom Threshold Rule Form */}
      <form
        onSubmit={handleAddRule}
        className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center`}
      >
        <input
          type="text"
          value={newRuleName}
          onChange={(e) => setNewRuleName(e.target.value)}
          placeholder="Rule name (e.g., Kitesurfing Wind Alert)..."
          className={`sm:col-span-4 px-3 py-2 rounded-xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} text-xs font-bold ${theme.ui.primaryText} placeholder:opacity-60 focus:outline-none`}
        />
        <select
          value={newMetric}
          onChange={(e) => setNewMetric(e.target.value as CustomWeatherRule['metric'])}
          className={`sm:col-span-3 px-3 py-2 rounded-xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} text-xs font-bold ${theme.ui.primaryText} focus:outline-none`}
        >
          <option value="temperature">Temperature (°C)</option>
          <option value="windSpeed">Wind Speed (km/h)</option>
          <option value="precipitation">Precipitation (mm)</option>
          <option value="cloudCover">Cloud Cover (%)</option>
          <option value="uvIndex">UV Index</option>
        </select>
        <select
          value={newOperator}
          onChange={(e) => setNewOperator(e.target.value as CustomWeatherRule['operator'])}
          className={`sm:col-span-2 px-3 py-2 rounded-xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} text-xs font-mono font-black ${theme.ui.primaryText} focus:outline-none`}
        >
          <option value=">=">&ge; (At least)</option>
          <option value="<=">&le; (At most)</option>
          <option value=">">&gt; (Above)</option>
          <option value="<">&lt; (Below)</option>
        </select>
        <input
          type="number"
          step="any"
          value={newThreshold}
          onChange={(e) => setNewThreshold(parseFloat(e.target.value) || 0)}
          className={`sm:col-span-1 px-2.5 py-2 rounded-xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} text-xs font-mono font-black ${theme.ui.primaryText} focus:outline-none`}
        />
        <button
          type="submit"
          className={`sm:col-span-2 px-3 py-2 rounded-xl text-xs font-black ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center gap-1 cursor-pointer shadow-sm`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Rule</span>
        </button>
      </form>

      {/* Active Rules Evaluation Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {rules.map((rule, idx) => {
          const liveVal = weather.current[rule.metric] ?? 0;
          const isMatchedNow = evaluateCondition(liveVal, rule.operator, rule.threshold);

          const nextMatchHour = weather.hourly
            .slice(0, 24)
            .find((h) => evaluateCondition(h[rule.metric] ?? 0, rule.operator, rule.threshold));
          const nextMatchTime = nextMatchHour?.time?.split('T')[1]?.slice(0, 5);

          return (
            <div
              key={rule.id}
              className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex flex-col justify-between gap-3`}
            >
              <ThemeTileArt theme={theme} variant="metric" index={idx} />
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isMatchedNow
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : nextMatchTime
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-500/20 text-slate-300'
                    }`}
                  >
                    {isMatchedNow ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        TRIGGERED NOW
                      </>
                    ) : nextMatchTime ? (
                      <>
                        <Clock className="w-3 h-3" />
                        MATCH AT {nextMatchTime}
                      </>
                    ) : (
                      'STANDBY (24H)'
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.id)}
                    className={`p-1 rounded-lg hover:bg-rose-500/20 ${theme.ui.secondaryText} hover:text-rose-300 cursor-pointer`}
                    title="Remove rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className={`text-sm font-black ${theme.ui.primaryText}`}>
                  {rule.name}
                </h3>
                <p className={`text-xs font-mono font-bold ${theme.ui.secondaryText}`}>
                  Condition: {rule.metric} {rule.operator} {rule.threshold}
                  {rule.unitLabel}
                </p>
              </div>

              <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className={theme.ui.secondaryText}>Current Value:</span>
                <span className={`font-black ${theme.ui.primaryText}`}>
                  {Math.round(liveVal * 10) / 10}
                  {rule.unitLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
