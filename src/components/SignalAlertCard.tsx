import React, { useState } from 'react';
import { TradingSignal } from '../types';
import { Smartphone, Mail, MessageSquare, Check, ChevronRight, Zap, ShieldCheck, Send, BellRing, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  signals: TradingSignal[];
}

export const SignalAlertCard: React.FC<Props> = ({ signals }) => {
  const [showModal, setShowModal] = useState(false);
  const [alertMethod, setAlertMethod] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [contactValue, setContactValue] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Live Sample Alert Simulator State
  const [sampleChannel, setSampleChannel] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');
  const [sampleNumber, setSampleNumber] = useState('');
  const [sampleSent, setSampleSent] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactValue.trim()) {
      sound.playWhaleAlert();
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setShowModal(false);
        setContactValue('');
      }, 2500);
    }
  };

  const handleSendSample = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWhaleAlert();
    setSampleSent(true);
    setTimeout(() => {
      setSampleSent(false);
    }, 8000);
  };

  return (
    <div className="border border-zinc-800 bg-black p-4 font-mono space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider">
              REAL-TIME ARROW SIGNALS & SETUP FEED
            </span>
            <span className="text-xs text-zinc-400">INSTITUTIONAL DETECTOR</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Verified algorithmic setups. Never enter without confirmed arrow volume expansion.
          </p>
        </div>

        {/* Paid WhatsApp / SMS / Email alerts button */}
        <button
          onClick={() => {
            sound.playClick();
            setShowModal(true);
          }}
          className="flex items-center gap-2 border-2 border-white bg-white text-black px-3 py-1.5 font-extrabold text-xs tracking-wider hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          <Smartphone size={14} />
          <span>GET ALERTS (WHATSAPP / SMS / EMAIL)</span>
          <span className="bg-black text-white text-[9px] px-1 py-0.2 font-normal">£24/MO</span>
        </button>
      </div>

      {/* INTERACTIVE SAMPLE ALERT TESTER BAR */}
      <div className="border border-white/60 bg-zinc-950 p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BellRing size={15} className="text-white" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              TEST A LIVE SAMPLE ALERT TO YOUR PHONE (100% FREE):
            </span>
          </div>
          <span className="text-[10px] text-zinc-400">ZERO CREDIT CARD NEEDED</span>
        </div>

        <form onSubmit={handleSendSample} className="flex flex-wrap items-center gap-2">
          <div className="flex border border-zinc-700 bg-black">
            {(['WhatsApp', 'SMS', 'Email'] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSampleChannel(ch);
                }}
                className={`px-2.5 py-1 text-xs transition-colors ${
                  sampleChannel === ch
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          <input
            type="text"
            required
            value={sampleNumber}
            onChange={(e) => setSampleNumber(e.target.value)}
            placeholder={
              sampleChannel === 'Email'
                ? 'Enter email for test sample...'
                : '+44 7911 123456 or your phone/WhatsApp...'
            }
            className="flex-1 min-w-[220px] bg-black border border-zinc-700 px-3 py-1 text-xs text-white placeholder-zinc-500 focus:border-white focus:outline-none"
          />

          <button
            type="submit"
            className="border border-white bg-white text-black font-extrabold px-3 py-1 text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
          >
            <Send size={12} />
            <span>SEND TEST SAMPLE NOW</span>
          </button>
        </form>

        {/* Realistic Mobile Push Simulation Card */}
        {sampleSent && (
          <div className="border-2 border-white bg-black p-3 animate-pulse space-y-1 relative">
            <button
              onClick={() => setSampleSent(false)}
              className="absolute right-2 top-2 text-zinc-500 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>📱 INCOMING {sampleChannel.toUpperCase()} ALERT DELIVERED (&lt; 90ms):</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-white font-mono leading-relaxed">
              <p className="font-bold">⚡ [ARROW QUANT // LONDON L2 ALERT]</p>
              <p className="text-zinc-300">
                PAIR: <strong className="text-white">GBP/USD (15M)</strong> ➔ <strong className="text-white">▲ BUY / LONG</strong><br />
                ENTRY: <strong className="text-white">1.2985</strong> | SL: <strong className="text-zinc-400">1.2940</strong> | TP1: <strong className="text-white">1.3050</strong> | TP2: <strong className="text-white">1.3120</strong><br />
                RISK / REWARD: <strong className="text-white">1 : 3.20</strong> | PROBABILITY: <strong className="text-white">91%</strong><br />
                TRIGGER: <strong className="text-zinc-400">Fat Arrow Expansion (3.2x Volume Absorption at London Open)</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Signals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {signals.map((sig) => {
          const isBuy = sig.direction === 'BUY';

          return (
            <div
              key={sig.id}
              className="border border-zinc-800 bg-zinc-950 p-3.5 flex flex-col justify-between hover:border-zinc-500 transition-colors relative overflow-hidden"
            >
              {sig.isPremiumAlert && (
                <div className="absolute top-0 right-0 bg-white text-black text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                  HOT SETUP
                </div>
              )}

              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{sig.symbol}</span>
                    <span className="text-[10px] text-zinc-400 border border-zinc-800 px-1">
                      {sig.timeframe}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500">{sig.timestamp}</span>
                </div>

                {/* Direction Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs px-2 py-0.5 font-extrabold flex items-center gap-1 ${
                      isBuy
                        ? 'bg-white text-black border border-white'
                        : 'bg-zinc-900 text-white border border-white'
                    }`}
                  >
                    {isBuy ? '▲ BUY / LONG' : '▼ SELL / SHORT'}
                  </span>
                  <span className="text-[11px] text-zinc-300 font-semibold">
                    {sig.confidence}% PROBABILITY
                  </span>
                </div>

                {/* Numeric Execution Table */}
                <div className="bg-black border border-zinc-900 p-2 text-xs space-y-1 mb-3">
                  <div className="flex justify-between text-zinc-400">
                    <span>ENTRY LEVEL:</span>
                    <span className="font-bold text-white">${sig.entryPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>STOP LOSS:</span>
                    <span className="text-zinc-300">${sig.stopLoss.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>TAKE PROFIT 1:</span>
                    <span className="font-bold text-white">${sig.takeProfit1.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>TAKE PROFIT 2:</span>
                    <span className="font-bold text-white">${sig.takeProfit2.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-[10px] pt-1 border-t border-zinc-900">
                    <span>RISK / REWARD:</span>
                    <span className="text-white font-bold">{sig.riskReward}</span>
                  </div>
                </div>

                {/* Arrow Pattern & Plain English Logic */}
                <div className="text-xs text-zinc-300 leading-relaxed mb-3">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                    DETECTED ARROW TRIGGER:
                  </span>
                  <p className="text-white font-medium text-[11px] mt-0.5">
                    {sig.arrowPattern}
                  </p>
                  <p className="text-zinc-400 text-[11px] mt-1 border-l-2 border-zinc-700 pl-2">
                    {sig.plainRule}
                  </p>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  sound.playClick();
                  setShowModal(true);
                }}
                className="w-full border border-zinc-800 hover:border-white bg-zinc-900 text-white text-xs py-1.5 font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <span>PUSH TO WHATSAPP / SMS / EMAIL</span>
                <ChevronRight size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Subscription Modal / Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="border-2 border-white bg-black max-w-md w-full p-6 text-white font-mono shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            <div className="flex justify-between items-start mb-4 border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] bg-white text-black font-bold px-1.5 py-0.5">
                  PREMIUM SIGNAL PUSH
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  DIRECT PHONE & WHATSAPP DELIVERY
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold px-2 py-0.5 border border-zinc-800"
              >
                ✕
              </button>
            </div>

            {subscribed ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 border-2 border-white mx-auto flex items-center justify-center text-white text-xl">
                  ✓
                </div>
                <h4 className="font-bold text-base text-white">ACCESS CONFIRMED</h4>
                <p className="text-xs text-zinc-400">
                  Welcome aboard. A 6-digit confirmation PIN has been sent via your chosen channel ({alertMethod}).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4 text-xs">
                <p className="text-zinc-300 leading-relaxed">
                  The moment an arrow explodes in width (institutional order filled), your phone buzzes with exact Entry, Stop Loss, and Take Profit levels within <strong>120 milliseconds</strong>.
                </p>

                {/* Delivery Channel Selector */}
                <div>
                  <span className="block text-zinc-400 mb-1.5 text-[11px] uppercase">
                    CHOOSE ALERT CHANNEL:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
                      { id: 'SMS', label: 'Phone SMS', icon: Smartphone },
                      { id: 'EMAIL', label: 'Email', icon: Mail },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isActive = alertMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setAlertMethod(method.id as any);
                          }}
                          className={`p-2 border text-center flex flex-col items-center justify-center gap-1 transition-colors ${
                            isActive
                              ? 'border-white bg-white text-black font-bold'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Icon size={14} />
                          <span className="text-[10px]">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-zinc-800 p-3 bg-zinc-950 space-y-2">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>⚡ Average Monthly Trades:</span>
                    <span className="text-white font-bold">42 Setups</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>★ Historical Win Rate:</span>
                    <span className="text-white font-bold">71.8%</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>⏱ Delivery Latency:</span>
                    <span className="text-white font-bold">&lt; 150ms Direct Push</span>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 text-[11px] uppercase">
                    {alertMethod === 'WHATSAPP' && 'ENTER WHATSAPP NUMBER (WITH COUNTRY CODE):'}
                    {alertMethod === 'SMS' && 'ENTER MOBILE PHONE NUMBER:'}
                    {alertMethod === 'EMAIL' && 'ENTER EMAIL ADDRESS:'}
                  </label>
                  <input
                    type={alertMethod === 'EMAIL' ? 'email' : 'text'}
                    required
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder={
                      alertMethod === 'EMAIL'
                        ? 'trader@domain.co.uk'
                        : '+44 7911 123456 (or international format)'
                    }
                    className="w-full bg-zinc-950 border border-zinc-700 p-2 text-white text-xs focus:border-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs">
                    <span className="text-zinc-400 block text-[10px]">SUBSCRIPTION RATE:</span>
                    <span className="text-white font-bold text-sm">£24 / month</span>
                    <span className="text-[10px] text-zinc-500 block">(~$29 USD)</span>
                  </div>
                  <button
                    type="submit"
                    className="border-2 border-white bg-white text-black font-extrabold px-4 py-2 hover:bg-zinc-200 transition-colors"
                  >
                    ACTIVATE ALERTS NOW →
                  </button>
                </div>

                <p className="text-[10px] text-zinc-500 text-center pt-2">
                  Cancel anytime with 1 click. Zero lock-in. 100% money back within 7 days.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
