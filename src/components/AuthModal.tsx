import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Lock, Mail, User, ShieldCheck, X, Check, ArrowRight, KeyRound } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, user, onLogin, onLogout }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [destination, setDestination] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleDemoLogin = () => {
    sound.playWhaleAlert();
    const demoUser: UserProfile = {
      id: 'usr_demo_01',
      email: 'london.trader@arrowquant.co.uk',
      username: 'TRADER_LONDON_01',
      plan: 'PRO_MONTHLY',
      alertChannel: 'WHATSAPP',
      contactDestination: '+44 7911 123456',
      joinedDate: '01 Nov 2026',
      tradesLoggedCount: 14,
    };
    onLogin(demoUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWhaleAlert();
    setSuccessMsg(true);

    const newUser: UserProfile = {
      id: 'usr_' + Date.now().toString(36),
      email: email || 'trader@arrowquant.co.uk',
      username: username || (email ? email.split('@')[0].toUpperCase() : 'QUANT_TRADER'),
      plan: 'FREE',
      alertChannel: channel,
      contactDestination: destination || email,
      joinedDate: 'Today',
      tradesLoggedCount: 0,
    };

    setTimeout(() => {
      onLogin(newUser);
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 font-mono select-none">
      <div className="border-2 border-white bg-black max-w-md w-full p-6 text-white shadow-[0_0_35px_rgba(255,255,255,0.2)] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white text-lg font-bold px-2 py-0.5 border border-zinc-800"
        >
          ✕
        </button>

        {/* If Already Logged In */}
        {user ? (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <span className="text-[10px] bg-white text-black font-bold px-1.5 py-0.5">
                AUTHENTICATED SESSION
              </span>
              <h3 className="text-base font-bold text-white mt-1.5">
                WELCOME BACK, {user.username}
              </h3>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-3 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>ACCOUNT ID:</span>
                <span className="text-white font-bold">{user.id}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>MEMBERSHIP PLAN:</span>
                <span className="text-white font-extrabold border border-white px-1.5 py-0.2">
                  {user.plan}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>ACTIVE ALERTS:</span>
                <span className="text-zinc-200">{user.alertChannel} ({user.contactDestination})</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>JOURNAL TRADES:</span>
                <span className="text-white font-bold">{user.tradesLoggedCount} Recorded</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onLogout();
                }}
                className="flex-1 border border-zinc-700 bg-black hover:border-white text-zinc-400 hover:text-white py-2 text-xs font-bold transition-colors"
              >
                LOG OUT
              </button>
              <button
                onClick={onClose}
                className="flex-1 border-2 border-white bg-white text-black py-2 text-xs font-extrabold hover:bg-zinc-200 transition-colors"
              >
                CONTINUE TO TERMINAL →
              </button>
            </div>
          </div>
        ) : (
          /* Login / Sign Up Form */
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-white" />
                <span className="text-[10px] bg-white text-black font-bold px-1.5 py-0.5">
                  SECURE QUANT PORTAL
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1.5">
                {mode === 'LOGIN' ? 'LOG IN TO YOUR TERMINAL' : 'CREATE TRADER ACCOUNT'}
              </h3>
            </div>

            {/* Quick 1-Click Demo Login */}
            <div className="border border-zinc-800 bg-zinc-950 p-3 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-white">WANT A QUICK PREVIEW?</span>
                <span className="text-[9px] text-zinc-500 font-mono">1-CLICK INSTANT</span>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full border-2 border-white bg-white text-black font-extrabold py-2 text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
              >
                <KeyRound size={13} />
                <span>INSTANT 1-CLICK DEMO ACCESS (PRO SUITE)</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-zinc-600 text-xs">
              <div className="flex-1 border-t border-zinc-800"></div>
              <span>OR USE YOUR EMAIL</span>
              <div className="flex-1 border-t border-zinc-800"></div>
            </div>

            {/* Auth Form */}
            {successMsg ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 border-2 border-white mx-auto flex items-center justify-center text-white text-xl">
                  ✓
                </div>
                <h4 className="font-bold text-sm text-white">ACCESS GRANTED</h4>
                <p className="text-xs text-zinc-400">Loading your encrypted journal & signals...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {mode === 'SIGNUP' && (
                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">TRADER HANDLE / USERNAME:</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. ALPHA_TRADER_UK"
                      className="w-full bg-zinc-950 border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-zinc-400 mb-1 text-[11px]">EMAIL ADDRESS:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@domain.co.uk"
                    className="w-full bg-zinc-950 border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none"
                  />
                </div>

                {mode === 'SIGNUP' && (
                  <div>
                    <label className="block text-zinc-400 mb-1 text-[11px]">
                      PHONE / WHATSAPP FOR SIGNALS (OPTIONAL):
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="+44 7911 123456"
                      className="w-full bg-zinc-950 border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full border border-zinc-700 hover:border-white bg-zinc-900 hover:bg-black text-white font-bold py-2 text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{mode === 'LOGIN' ? 'CONTINUE WITH EMAIL MAGIC LINK' : 'CREATE ACCOUNT & ENTER'}</span>
                  <ArrowRight size={13} />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                    }}
                    className="text-[11px] text-zinc-400 hover:text-white underline underline-offset-2"
                  >
                    {mode === 'LOGIN' ? "Don't have an account? Sign up here" : 'Already have an account? Log in'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
