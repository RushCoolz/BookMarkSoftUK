import React from 'react';
import { 
  Sprout, 
  Home, 
  Shirt, 
  Heart, 
  Droplets, 
  Wind, 
  Thermometer, 
  Sun,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { WeatherData, TempUnit } from '../../types/weather';
import { formatTempWithUnit } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface MicroClimateStudioProps {
  weather: WeatherData;
  unit: TempUnit;
}

export function MicroClimateStudio({ weather, unit }: MicroClimateStudioProps) {
  const { theme } = useWeatherTheme();

  const tempC = weather.current.temperature;
  const rh = weather.current.relativeHumidity;
  const windKmh = weather.current.windSpeed;
  const uv = weather.current.uvIndex;
  const precipNow = weather.current.precipitation;

  // Magnus formula for exact outdoor Dew Point (°C)
  const alpha = (17.27 * tempC) / (237.7 + tempC) + Math.log(Math.max(1, rh) / 100);
  const dewPointC = Math.round(((237.7 * alpha) / (17.27 - alpha)) * 10) / 10;

  // 48-hour precipitation sum from daily forecast
  const rain48hMm =
    Math.round(
      ((weather.daily[0]?.precipitationSum ?? 0) + (weather.daily[1]?.precipitationSum ?? 0)) * 10
    ) / 10;

  // Daily Evapotranspiration rate approximation (mm/day)
  const etRateMm = Math.max(
    0.6,
    Math.round(
      (0.14 * Math.max(0, tempC + 5) * (1 - rh / 130) * (1 + windKmh / 45) + uv * 0.25) * 10
    ) / 10
  );

  // 1. Botanical Watering Verdict
  const netMoistureBalance = Math.round((rain48hMm - etRateMm * 2) * 10) / 10;
  const needsWatering = rain48hMm < 3.5 && rh < 78;
  const frostRisk = (weather.daily[0]?.temperatureMin ?? tempC) <= 2.5;

  // 2. Home Ventilation & Window Condensation
  // Standard indoor comfort: 20°C at 50% RH has a dew point of ~9.3°C
  const indoorDewPointC = 9.3;
  const willDehumidifyIndoors = dewPointC < indoorDewPointC && precipNow === 0;
  const minNightTempC = weather.daily[0]?.temperatureMin ?? tempC - 4;
  const windowCondensationRisk =
    minNightTempC < 7 && rh > 75
      ? 'Elevated Interior Sill Condensation Risk'
      : minNightTempC < 12 && rh > 82
      ? 'Mild Morning Glass Mist'
      : 'Dry Clear Glazing';

  // 3. Outdoor Laundry Line-Drying Timer
  // Vapour Pressure Deficit factor
  const dryingPower = Math.max(
    0.1,
    ((100 - rh) / 35) * (1 + windKmh / 25) * (1 + tempC / 25) * (weather.current.isDay ? 1.25 : 0.65)
  );
  const canDryOutdoors = precipNow === 0 && (weather.hourly[0]?.precipitationProbability ?? 0) < 35 && rh < 84;
  const dryingMinutes = canDryOutdoors ? Math.max(35, Math.min(360, Math.round(165 / dryingPower))) : null;
  const dryingTimeFormatted = dryingMinutes
    ? `${Math.floor(dryingMinutes / 60)}h ${dryingMinutes % 60}m`
    : 'Indoor Rack Advised';

  // 4. Pet Paw-Pad & Asphalt Thermal Safety
  // Direct sunlight heats dark asphalt significantly above ambient air temp
  const solarAsphaltOffsetC = weather.current.isDay
    ? Math.max(2, Math.round((100 - weather.current.cloudCover) * 0.16 + uv * 1.4))
    : 0;
  const asphaltTempC = Math.round(tempC + solarAsphaltOffsetC);
  const pawStatus =
    asphaltTempC >= 52
      ? 'Hot Pavement Hazard — Walk on Grass'
      : tempC <= -2
      ? 'Freezing Grit & Ice Salt Alert — Rinse Paws'
      : 'Optimal Paw-Pad Surface Temperature';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: Botanical & Garden Soil Moisture Sanctuary */}
        <div className={`relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden flex flex-col justify-between gap-5`}>
          <ThemeCardArtWrapper theme={theme} variant="standard" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}>
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-base font-black ${theme.ui.primaryText} tracking-tight`}>
                  Botanical &amp; Garden Soil Moisture Advisor
                </h2>
                <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                  Evapotranspiration balance vs. 48-hour natural rainfall
                </p>
              </div>
            </div>

            <span className={`text-xs font-mono font-black ${theme.ui.subheadingText}`}>
              {needsWatering ? 'Water Today' : 'Natural Rain Sufficient'}
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3">
            <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
              <ThemeTileArt theme={theme} variant="gauge" index={0} />
              <span className={`relative z-10 text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                48h Rainfall Total
              </span>
              <span className={`relative z-10 text-2xl font-black font-mono ${theme.ui.primaryText}`}>
                {rain48hMm} mm
              </span>
              <span className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} block mt-0.5`}>
                Natural precipitation input
              </span>
            </div>

            <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
              <ThemeTileArt theme={theme} variant="gauge" index={1} />
              <span className={`relative z-10 text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                Evapotranspiration
              </span>
              <span className={`relative z-10 text-2xl font-black font-mono ${theme.ui.primaryText}`}>
                {etRateMm} mm/day
              </span>
              <span className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} block mt-0.5`}>
                Topsoil moisture loss rate
              </span>
            </div>
          </div>

          <div className={`relative z-10 overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5`}>
            <ThemeTileArt theme={theme} variant="row" index={2} />
            <div className="relative z-10 flex items-center gap-2 text-xs font-black">
              {frostRisk ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <CheckCircle2 className={`w-4 h-4 ${theme.ui.accentText}`} />
              )}
              <span className={theme.ui.primaryText}>
                {frostRisk
                  ? 'Overnight Frost Protection Required for Tender Perennials'
                  : needsWatering
                  ? 'Water Outdoor Containers & Beds at Early Dusk'
                  : 'Hold Irrigation — Soil Horizon Retains Adequate Moisture'}
              </span>
            </div>
            <p className={`relative z-10 text-xs font-semibold ${theme.ui.secondaryText}`}>
              Net 48h moisture balance: <strong className={theme.ui.primaryText}>{netMoistureBalance > 0 ? `+${netMoistureBalance}` : netMoistureBalance} mm</strong>. {frostRisk ? 'Bring citrus and basil pots indoors before nightfall.' : 'Foliar transpirational stress is currently low.'}
            </p>
          </div>
        </div>

        {/* CARD 2: Home Ventilation & Dew Point Sanctuary */}
        <div className={`relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden flex flex-col justify-between gap-5`}>
          <ThemeCardArtWrapper theme={theme} variant="standard" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}>
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-base font-black ${theme.ui.primaryText} tracking-tight`}>
                  Home Ventilation &amp; Condensation Guide
                </h2>
                <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                  Indoor vs. outdoor vapour pressure &amp; window glazing mist check
                </p>
              </div>
            </div>

            <span className={`text-xs font-mono font-black ${theme.ui.subheadingText}`}>
              Dew Point {formatTempWithUnit(dewPointC, unit)}
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3">
            <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
              <ThemeTileArt theme={theme} variant="gauge" index={2} />
              <span className={`relative z-10 text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                Window Purge Effect
              </span>
              <span className={`relative z-10 text-lg font-black ${theme.ui.primaryText} block mt-0.5`}>
                {willDehumidifyIndoors ? 'Lowers Indoor Humidity' : 'Adds Moisture Indoors'}
              </span>
              <span className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} block mt-0.5`}>
                Compared to 20°C / 50% RH room
              </span>
            </div>

            <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
              <ThemeTileArt theme={theme} variant="gauge" index={3} />
              <span className={`relative z-10 text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                Overnight Glazing Status
              </span>
              <span className={`relative z-10 text-lg font-black ${theme.ui.primaryText} block mt-0.5`}>
                {minNightTempC < 8 && rh > 75 ? 'Sill Mist Likely' : 'Clear Glass'}
              </span>
              <span className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} block mt-0.5`}>
                Overnight low {formatTempWithUnit(minNightTempC, unit)}
              </span>
            </div>
          </div>

          <div className={`relative z-10 overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5`}>
            <ThemeTileArt theme={theme} variant="row" index={3} />
            <span className={`relative z-10 text-xs font-black ${theme.ui.primaryText} block`}>
              {windowCondensationRisk}
            </span>
            <p className={`relative z-10 text-xs font-semibold ${theme.ui.secondaryText}`}>
              {willDehumidifyIndoors
                ? 'Outdoor air carries less absolute water vapour than standard indoor air — a 15-minute cross-breeze window purge will crisp and dry your home.'
                : 'Outdoor dew point is elevated — keep windows tilted only briefly if running a dehumidifier indoors.'}
            </p>
          </div>
        </div>

        {/* CARD 3: Outdoor Laundry Line-Drying Physics Timer */}
        <div className={`relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden flex flex-col justify-between gap-5`}>
          <ThemeCardArtWrapper theme={theme} variant="standard" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}>
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-base font-black ${theme.ui.primaryText} tracking-tight`}>
                  Outdoor Laundry Line-Drying Calculator
                </h2>
                <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                  Cotton fabric evaporation timer from wind velocity &amp; humidity deficit
                </p>
              </div>
            </div>

            <span className={`text-lg font-mono font-black ${theme.ui.subheadingText}`}>
              {dryingTimeFormatted}
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-2.5">
            <div className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
              <ThemeTileArt theme={theme} variant="pill" index={0} />
              <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} flex items-center gap-1`}>
                <Droplets className="w-3 h-3" /> Humidity
              </span>
              <span className={`relative z-10 text-base font-black font-mono ${theme.ui.primaryText} block mt-1`}>
                {rh}%
              </span>
            </div>
            <div className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
              <ThemeTileArt theme={theme} variant="pill" index={1} />
              <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} flex items-center gap-1`}>
                <Wind className="w-3 h-3" /> Airflow
              </span>
              <span className={`relative z-10 text-base font-black font-mono ${theme.ui.primaryText} block mt-1`}>
                {Math.round(windKmh)} km/h
              </span>
            </div>
            <div className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
              <ThemeTileArt theme={theme} variant="pill" index={2} />
              <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} flex items-center gap-1`}>
                <Sun className="w-3 h-3" /> UV Assist
              </span>
              <span className={`relative z-10 text-base font-black font-mono ${theme.ui.primaryText} block mt-1`}>
                UV {uv.toFixed(1)}
              </span>
            </div>
          </div>

          <p className={`relative z-10 text-xs font-semibold ${theme.ui.secondaryText}`}>
            {canDryOutdoors
              ? `Ideal evaporation gradient — a standard spin-dried cotton load hung outdoors now will dry in approximately ${dryingTimeFormatted}.`
              : 'High ambient humidity or imminent rain showers prevent outdoor evaporation today — use an indoor heated airer.'}
          </p>
        </div>

        {/* CARD 4: Pet Paw-Pad & Asphalt Thermal Walk Safety */}
        <div className={`relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden flex flex-col justify-between gap-5`}>
          <ThemeCardArtWrapper theme={theme} variant="standard" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}>
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-base font-black ${theme.ui.primaryText} tracking-tight`}>
                  Pet Paw-Pad &amp; Pavement Thermal Safety
                </h2>
                <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                  Solar asphalt radiant heat estimate &amp; canine thermal comfort
                </p>
              </div>
            </div>

            <span className={`text-xs font-mono font-black ${theme.ui.subheadingText}`}>
              Asphalt ~{formatTempWithUnit(asphaltTempC, unit)}
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3">
            <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
              <ThemeTileArt theme={theme} variant="gauge" index={4} />
              <span className={`relative z-10 text-[10px] font-bold uppercase ${theme.ui.secondaryText} flex items-center gap-1`}>
                <Thermometer className="w-3 h-3" /> Air Temperature
              </span>
              <span className={`relative z-10 text-2xl font-black font-mono ${theme.ui.primaryText} block mt-1`}>
                {formatTempWithUnit(tempC, unit)}
              </span>
            </div>

            <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
              <ThemeTileArt theme={theme} variant="gauge" index={5} />
              <span className={`relative z-10 text-[10px] font-bold uppercase ${theme.ui.secondaryText} flex items-center gap-1`}>
                <Sun className="w-3 h-3" /> Sunlit Tarmac
              </span>
              <span className={`relative z-10 text-2xl font-black font-mono ${theme.ui.primaryText} block mt-1`}>
                {formatTempWithUnit(asphaltTempC, unit)}
              </span>
            </div>
          </div>

          <div className={`relative z-10 overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1`}>
            <ThemeTileArt theme={theme} variant="row" index={4} />
            <span className={`relative z-10 text-xs font-black ${theme.ui.primaryText} block`}>
              {pawStatus}
            </span>
            <p className={`relative z-10 text-xs font-semibold ${theme.ui.secondaryText}`}>
              {asphaltTempC >= 50
                ? 'Dark tarmac absorbs intense solar radiation above 50°C — stick to shaded grass trails or early morning/evening walks.'
                : 'Surface temperatures are comfortable for extended outdoor walks and park runs.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
