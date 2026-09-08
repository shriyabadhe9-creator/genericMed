import React from 'react';
import { PortalView } from '../types';
import { 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Layers, 
  Monitor, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface TopPortalNavProps {
  currentView: PortalView;
  onSelectView: (view: PortalView) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  unreadCount?: number;
  onOpenVerificationModal?: () => void;
}

export const TopPortalNav: React.FC<TopPortalNavProps> = ({
  currentView,
  onSelectView,
  isMobileFrame,
  onToggleMobileFrame,
  unreadCount = 2,
  onOpenVerificationModal,
}) => {
  return (
    <nav className="bg-[#0b1c30] text-white border-b border-[#213145] px-3 py-2 z-50 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Brand & Mode Label */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-[#00685f] text-white flex items-center justify-center font-bold text-xs tracking-wider">
              gM
            </span>
            <span className="font-bold tracking-tight text-sm text-white hidden sm:inline">
              genericMed
            </span>
            <span className="text-[11px] bg-[#213145] text-[#89f5e7] px-2 py-0.5 rounded font-mono">
              Multi-Portal System
            </span>
          </div>

          <span className="h-4 w-px bg-slate-700 hidden md:inline" />

          {/* Quick interactive trigger for Pharmacist modal */}
          {onOpenVerificationModal && (
            <button
              onClick={onOpenVerificationModal}
              className="text-xs bg-[#ba1a1a]/30 hover:bg-[#ba1a1a]/50 text-red-200 border border-red-500/40 px-2 py-1 rounded flex items-center gap-1.5 transition-colors"
              title="Open the Clinical Pharmacist Verification Modal"
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden lg:inline">Quick Modal:</span> Rx Verification
            </button>
          )}
        </div>

        {/* Portal Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#131b2e] p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onSelectView('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'customer'
                ? 'bg-[#00685f] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer App</span>
          </button>

          <button
            onClick={() => onSelectView('partner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'partner'
                ? 'bg-[#00685f] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Pharmacy Partner</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </button>

          <button
            onClick={() => onSelectView('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'admin'
                ? 'bg-[#00685f] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operations Console</span>
            <span className="bg-red-500 text-white text-[10px] px-1 rounded-full font-bold">12</span>
          </button>

          <button
            onClick={() => onSelectView('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'architecture'
                ? 'bg-[#00685f] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SaaS Architecture</span>
          </button>
        </div>

        {/* Right Tools & Frame Toggle */}
        <div className="flex items-center gap-2">
          {currentView === 'customer' && (
            <button
              onClick={onToggleMobileFrame}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors ${
                isMobileFrame 
                  ? 'bg-teal-950 border-teal-500 text-teal-300' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Toggle mobile device frame container"
            >
              {isMobileFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isMobileFrame ? 'Expand Layout' : 'Mobile Frame'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live SLA: 99.98%</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
