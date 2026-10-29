import React, { useEffect } from 'react';
import { 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  Info 
} from 'lucide-react';
import { SevereAlert } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface SevereWeatherAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SevereAlert[];
  locationName: string;
}

export function SevereWeatherAlertsModal({
  isOpen,
  onClose,
  alerts,
  locationName
}: SevereWeatherAlertsModalProps) {
  const { theme } = useWeatherTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#120626]/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} rounded-[32px] overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {/* Bespoke Scenic Artwork & Filigrees */}
        <ThemeCardArtWrapper theme={theme} variant="standard" />

        <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

        {/* Modal Header */}
        <div className={`relative z-10 flex items-center justify-between px-6 py-5 border-b ${theme.ui.dividerBorder}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${theme.ui.badgeBg} border ${theme.ui.badgeBorder} flex items-center justify-center ${theme.ui.accentText}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-black ${theme.ui.primaryText}`}>
                Severe Weather Advisories
              </h2>
              <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                Official meteorological bulletins for {locationName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`relative overflow-hidden w-9 h-9 rounded-full flex items-center justify-center ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} transition-transform active:scale-95 cursor-pointer`}
            aria-label="Close modal"
          >
            <ThemeTileArt theme={theme} variant="pill" index={0} />
            <X className="relative z-10 w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
          {alerts.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/25 border border-emerald-500/45 flex items-center justify-center text-emerald-500">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className={`text-base font-black ${theme.ui.primaryText}`}>
                  No Active Weather Warnings
                </h3>
                <p className={`text-xs font-semibold ${theme.ui.secondaryText} max-w-sm mx-auto`}>
                  Meteorological indices are within standard seasonal thresholds. No structural wind, convective storm, or flood risks currently flagged.
                </p>
              </div>
            </div>
          ) : (
            alerts.map((alert, idx) => {
              const isWarning = alert.severity === 'Warning';
              return (
                <div 
                  key={alert.id}
                  className={`relative overflow-hidden rounded-2xl border-2 p-5 space-y-4 ${
                    isWarning 
                      ? 'bg-rose-500/25 border-rose-500/50' 
                      : 'bg-amber-500/25 border-amber-500/50'
                  }`}
                >
                  <ThemeTileArt theme={theme} variant="banner" index={idx} />
                  {/* Status Bar */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                      isWarning
                        ? 'bg-rose-600 text-amber-50'
                        : 'bg-amber-500 text-amber-950'
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {alert.severity.toUpperCase()}
                    </span>
                    <div className={`flex items-center gap-2 text-[11px] font-bold ${theme.ui.secondaryText} font-mono`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{alert.validUntil}</span>
                    </div>
                  </div>

                  {/* Title & Headline */}
                  <div className="relative z-10">
                    <h3 className={`text-base font-black ${theme.ui.primaryText}`}>
                      {alert.title}
                    </h3>
                    <p className={`text-xs font-bold mt-1 ${
                      isWarning ? 'text-rose-800 dark:text-rose-200' : 'text-amber-900 dark:text-amber-200'
                    }`}>
                      {alert.headline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className={`relative z-10 text-xs ${theme.ui.secondaryText} leading-relaxed font-semibold`}>
                    {alert.description}
                  </p>

                  {/* Recommended Action Checklist */}
                  <div className={`relative z-10 overflow-hidden p-3.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-2`}>
                    <ThemeTileArt theme={theme} variant="pill" index={idx + 1} />
                    <div className={`relative z-10 flex items-center gap-1.5 text-xs font-black ${theme.ui.primaryText}`}>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Recommended Safety Guidance</span>
                    </div>
                    <p className={`relative z-10 text-xs font-semibold ${theme.ui.secondaryText} leading-relaxed`}>
                      {alert.recommendedAction}
                    </p>
                  </div>

                  {/* Source Footer */}
                  <div className={`relative z-10 pt-2 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-[11px] font-bold ${theme.ui.secondaryText}`}>
                    <span>Issued: {alert.issuedTime}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider">Alert ID: {alert.id}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className={`relative z-10 px-6 py-4 border-t ${theme.ui.dividerBorder} flex items-center justify-between`}>
          <span className={`text-[11px] font-bold ${theme.ui.secondaryText} flex items-center gap-1.5`}>
            <Info className="w-3.5 h-3.5" />
            Harmonized WMO Met Desk feeds
          </span>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-black ${theme.ui.activePill} ${theme.ui.activePillText} transition-all cursor-pointer shadow-sm active:scale-95`}
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
