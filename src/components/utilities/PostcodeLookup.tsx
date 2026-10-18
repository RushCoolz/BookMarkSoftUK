import React, { useState } from "react";
import { 
  MapPin, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Landmark, 
  Heart, 
  Globe, 
  Sparkles,
  ExternalLink 
} from "lucide-react";
import { UkDisclaimer } from "../common/UkDisclaimer";

interface PostcodeData {
  postcode: string;
  admin_district: string;
  parliamentary_constituency: string;
  admin_ward: string;
  region: string;
  country: string;
  nhs_ha: string;
  latitude: number;
  longitude: number;
  outcode: string;
  incode: string;
}

export function PostcodeLookup() {
  const [postcode, setPostcode] = useState("SW1A 1AA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PostcodeData | null>({
    postcode: "SW1A 1AA",
    admin_district: "Westminster",
    parliamentary_constituency: "Cities of London and Westminster",
    admin_ward: "St James's",
    region: "London",
    country: "England",
    nhs_ha: "London",
    latitude: 51.501,
    longitude: -0.141,
    outcode: "SW1A",
    incode: "1AA",
  });

  const fetchPostcode = async (query: string) => {
    const cleaned = query.trim().replace(/\s+/g, '');
    if (!cleaned) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${cleaned}`);
      const data = await res.json();

      if (data.status === 200 && data.result) {
        setResult(data.result);
      } else {
        setError(data.error || "Postcode not recognized in official UK Ordnance Survey dataset.");
      }
    } catch (err) {
      setError("Unable to reach postcodes.io. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPostcode(postcode);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <MapPin className="w-3.5 h-3.5" />
            Live UK Ordnance Survey &amp; ONS Data
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            UK Postcode &amp; Local Area Intelligence
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Instant live validation across 1.7 million UK postcodes using <code className="text-sky-300">postcodes.io</code> open data. 
            Lookup local authority council district, parliamentary constituency, NHS integrated care board, and geographic coordinates.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl="https://postcodes.io"
        customSourceLabel="Postcodes.io (Contains OS & ONS Open Data)"
        notes="All lookups are powered directly by open UK government geospatial registries."
      />

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-3.5 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              placeholder="e.g. SW1A 1AA, M1 1AE, EH1 1YZ"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold uppercase tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            {loading ? "Searching ONS..." : (
              <>
                <Search className="w-4 h-4" />
                Validate Postcode
              </>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Quick Samples:</span>
          {["SW1A 1AA (Westminster)", "M1 1AD (Manchester)", "EH1 1YZ (Edinburgh)", "CF10 1EP (Cardiff)", "BT1 5GS (Belfast)"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                const code = s.split(' ')[0] + " " + s.split(' ')[1];
                setPostcode(code);
                fetchPostcode(code);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {result.postcode}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active Royal Mail Postcode
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {result.region}, {result.country}
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Coordinates: {result.latitude.toFixed(4)}°N, {result.longitude.toFixed(4)}°E
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                Local Authority District
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {result.admin_district}
              </div>
              <span className="text-[11px] text-slate-400">Ward: {result.admin_ward}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-indigo-500" />
                UK Parliament Constituency
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {result.parliamentary_constituency}
              </div>
              <span className="text-[11px] text-slate-400">House of Commons Seat</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                NHS Health Authority
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {result.nhs_ha || "Regional ICB"}
              </div>
              <span className="text-[11px] text-slate-400">NHS Integrated Care</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                Postal Breakdown
              </span>
              <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                Out: {result.outcode} • In: {result.incode}
              </div>
              <span className="text-[11px] text-slate-400">Country: {result.country}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
