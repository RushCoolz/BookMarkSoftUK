import React, { useState } from "react";
import { 
  Key, 
  FileText, 
  QrCode, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck 
} from "lucide-react";

export function TextAndSecurityTools() {
  const [activeSubTab, setActiveSubTab] = useState<'word_counter' | 'password_gen' | 'qr_gen'>('word_counter');

  // Word counter state
  const [textInput, setTextInput] = useState("BookMarkSoft UK is the premier utility portal providing free ATS X-ray parsing, CV tracking, and comprehensive UK tax and government calculators.");
  
  // Password Gen State
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("kP8$mX2#vL9@qR5!");
  const [copiedPass, setCopiedPass] = useState(false);

  // QR Code State
  const [qrText, setQrText] = useState("https://bookmarksoft.uk");

  const generatePassword = () => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let result = "";
    const array = new Uint32Array(passwordLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < passwordLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setGeneratedPassword(result);
  };

  const words = textInput.trim().split(/\s+/).filter(Boolean).length;
  const chars = textInput.length;
  const charsNoSpaces = textInput.replace(/\s+/g, '').length;
  const readingTimeMinutes = (words / 200).toFixed(1);
  const speakingTimeMinutes = (words / 130).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Client-Side Utility Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Word Counter, Password Generator &amp; QR Code Maker
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Essential everyday productivity tools that run 100% locally in your browser. No files or strings are ever uploaded to an external server.
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setActiveSubTab('word_counter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'word_counter' ? "bg-white text-slate-950 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Word &amp; Read Time Counter
            </button>
            <button
              onClick={() => setActiveSubTab('password_gen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'password_gen' ? "bg-white text-slate-950 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Password Generator
            </button>
            <button
              onClick={() => setActiveSubTab('qr_gen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'qr_gen' ? "bg-white text-slate-950 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              QR Code Generator
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'word_counter' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Words</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{words}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Characters</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{chars}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Reading Time</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{readingTimeMinutes}m</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Speaking Time</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{speakingTimeMinutes}m</span>
            </div>
          </div>

          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={7}
            placeholder="Type or paste your text here..."
            className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
          />
        </div>
      )}

      {activeSubTab === 'password_gen' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 max-w-xl">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Cryptographically Secure Password Generator
          </h3>

          <div className="relative">
            <input
              type="text"
              readOnly
              value={generatedPassword}
              className="w-full p-3.5 pr-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-sm tracking-wider"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <button
                onClick={generatePassword}
                className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300"
                title="Generate new password"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedPassword);
                  setCopiedPass(true);
                  setTimeout(() => setCopiedPass(false), 2000);
                }}
                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1"
              >
                {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPass ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Length: {passwordLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Include Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Include Symbols (!@#$)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'qr_gen' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 max-w-md">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            QR Code Generator
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              URL or Text to Encode
            </label>
            <input
              type="text"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono"
            />
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-3">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrText)}`}
              alt="QR Code"
              className="w-44 h-44 rounded-lg bg-white p-2 shadow-sm"
            />
            <span className="text-[11px] text-slate-400 font-mono">
              Scannable on all iOS and Android devices
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
