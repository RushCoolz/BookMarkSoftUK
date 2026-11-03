import React, { useState } from 'react';
import { ShieldAlert, Lock, FileText, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'DISCLAIMER' | 'PRIVACY' | 'TERMS';
}

export const LegalModal: React.FC<Props> = ({ isOpen, onClose, initialTab = 'DISCLAIMER' }) => {
  const [tab, setTab] = useState<'DISCLAIMER' | 'PRIVACY' | 'TERMS'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 font-mono select-none">
      <div className="border-2 border-white bg-black max-w-2xl w-full p-6 text-white shadow-[0_0_35px_rgba(255,255,255,0.2)] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider">
                LEGAL COMPLIANCE // UK SPEC
              </span>
              <span className="text-xs text-zinc-400">REGULATORY ARCHITECTURE</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">
              GOVERNANCE, PRIVACY & CAPITAL PROTECTION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-lg font-bold px-2 py-0.5 border border-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-zinc-800 mb-4 text-xs gap-1">
          {[
            { id: 'DISCLAIMER', label: 'FINANCIAL RISK DISCLAIMER', icon: ShieldAlert },
            { id: 'PRIVACY', label: 'PRIVACY POLICY (GDPR)', icon: Lock },
            { id: 'TERMS', label: 'TERMS OF SERVICE', icon: FileText },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-3 py-1.5 flex items-center gap-1.5 border-t border-x transition-colors ${
                  active
                    ? 'border-white bg-zinc-900 text-white font-bold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={13} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-2 text-xs text-zinc-300 space-y-4 leading-relaxed">
          {tab === 'DISCLAIMER' && (
            <div className="space-y-3">
              <div className="border border-white/60 bg-zinc-950 p-3 text-white font-bold flex items-center gap-2">
                <ShieldAlert className="text-white flex-shrink-0" size={18} />
                <span>HIGH RISK INVESTMENT WARNING (UK / FCA REGULATORY NOTICE)</span>
              </div>

              <p>
                Trading financial products—including Foreign Exchange (Forex), Contracts for Difference (CFDs), Commodities, Equities, and Cryptocurrencies—carries a high level of risk and may not be suitable for all investors. Leveraged trading creates risk of rapid capital loss exceeding your initial deposits.
              </p>

              <div className="border-l-2 border-white pl-3 text-zinc-300 py-1">
                <strong className="text-white block mb-0.5">NOT FINANCIAL ADVICE:</strong>
                Arrow Quant Terminal, its algorithms, indicators, arrow vector models, bots, and alerts are strictly mathematical computation and market observation tools provided for educational and analytical purposes only. Nothing on this website constitutes investment advice, tax advice, or a personal recommendation.
              </div>

              <p>
                Past performance of indicators, backtested bots, or historical arrow formations does not guarantee or predict future results. You should always conduct independent due diligence, evaluate your financial situation, and consult an independent FCA-authorized financial advisor before executing trades.
              </p>

              <div className="text-[11px] text-zinc-500 bg-zinc-950 p-2 border border-zinc-900">
                UK Jurisdiction Reference: Financial Services and Markets Act 2000 (FSMA) & FCA Conduct of Business Sourcebook (COBS).
              </div>
            </div>
          )}

          {tab === 'PRIVACY' && (
            <div className="space-y-3">
              <div className="border border-white/60 bg-zinc-950 p-3 text-white font-bold flex items-center gap-2">
                <Lock className="text-white flex-shrink-0" size={18} />
                <span>UK GDPR & DATA PROTECTION ACT 2018 COMPLIANCE</span>
              </div>

              <p>
                We respect your personal privacy. Arrow Quant Terminal operates under strict data minimization principles:
              </p>

              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>
                  <strong className="text-white">Data We Collect:</strong> When you subscribe to mobile signals, we collect only your chosen delivery destination (WhatsApp number, phone number for SMS, or email address).
                </li>
                <li>
                  <strong className="text-white">Zero Third-Party Sharing:</strong> We do not sell, rent, broker, or transfer your contact data or trading activity to any advertisers, brokers, or data brokers.
                </li>
                <li>
                  <strong className="text-white">Bank-Grade Encryption:</strong> All webhook communication and database storage employ AES-256 encryption at rest and TLS 1.3 in transit.
                </li>
                <li>
                  <strong className="text-white">Your Right to Erasure:</strong> You can unsubscribe or request complete deletion of your records at any time by replying "STOP" or clicking unsubscribe in your alert channel.
                </li>
              </ul>
            </div>
          )}

          {tab === 'TERMS' && (
            <div className="space-y-3">
              <div className="border border-white/60 bg-zinc-950 p-3 text-white font-bold flex items-center gap-2">
                <FileText className="text-white flex-shrink-0" size={18} />
                <span>TERMS OF SERVICE & USAGE AGREEMENT</span>
              </div>

              <p>
                By using Arrow Quant Terminal, you agree to these Terms governed by the laws of England and Wales:
              </p>

              <div className="space-y-2">
                <div className="border border-zinc-900 p-2.5 bg-black">
                  <h4 className="text-white font-bold mb-1">1. Non-Custodial Software</h4>
                  <p className="text-zinc-400">
                    We are a technology and software platform. We do not hold client funds, execute brokerage orders on your behalf, or act as an exchange.
                  </p>
                </div>

                <div className="border border-zinc-900 p-2.5 bg-black">
                  <h4 className="text-white font-bold mb-1">2. Open Source Bot License</h4>
                  <p className="text-zinc-400">
                    All bots provided in the Free Bot Vault (Pine Script v5, Python CCXT, MQL5) are licensed under the MIT License for free individual use and inspection.
                  </p>
                </div>

                <div className="border border-zinc-900 p-2.5 bg-black">
                  <h4 className="text-white font-bold mb-1">3. Subscription Billing & Refund Policy</h4>
                  <p className="text-zinc-400">
                    Real-time WhatsApp/SMS/Email push alerts are billed at £24/month on a recurring basis. Subscribers may cancel anytime without penalty. A 7-day no-questions-asked refund policy applies to initial purchases.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 pt-3 mt-4 flex items-center justify-between text-xs">
          <span className="text-[11px] text-zinc-500">
            JURISDICTION: ENGLAND & WALES (UNITED KINGDOM)
          </span>
          <button
            onClick={onClose}
            className="border border-white bg-white text-black font-bold px-4 py-1 hover:bg-zinc-200 transition-colors"
          >
            ACKNOWLEDGE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
