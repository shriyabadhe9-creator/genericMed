import React, { useState } from 'react';
import { PortalView, UserProfile } from '../types';
import { 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Layers, 
  Monitor, 
  Sparkles,
  AlertCircle,
  LogIn,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';

interface TopPortalNavProps {
  currentView: PortalView;
  onSelectView: (view: PortalView) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  unreadCount?: number;
  onOpenVerificationModal?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const TopPortalNav: React.FC<TopPortalNavProps> = ({
  currentView,
  onSelectView,
  isMobileFrame,
  onToggleMobileFrame,
  unreadCount = 2,
  onOpenVerificationModal,
  currentUser = null,
  onOpenAuth = (_mode: 'login' | 'register') => {},
  onLogout = () => {},
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
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

          <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live SLA: 99.98%</span>
          </div>

          {/* User Account / Auth Trigger */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg bg-[#16253b] hover:bg-[#1f334f] border border-slate-700 text-xs transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-[#00685f] text-white font-bold text-[11px] flex items-center justify-center">
                  {currentUser.avatarInitials}
                </span>
                <span className="font-semibold text-slate-200 hidden md:inline text-xs">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-teal-300 font-mono hidden sm:inline">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* User dropdown popup */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-1.5 w-60 bg-white text-[#0b1c30] rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="p-2 border-b border-slate-100">
                    <div className="font-bold text-xs text-[#0b1c30] flex items-center justify-between">
                      <span>{currentUser.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-[#eff4ff] text-[#00685f] rounded uppercase font-bold">
                        {currentUser.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  </div>

                  <div className="py-1 text-xs space-y-0.5">
                    <button
                      onClick={() => {
                        onOpenAuth('login');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 flex items-center justify-between text-slate-700 hover:text-[#00685f]"
                    >
                      <span>Switch Demo Profile</span>
                      <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500">1-Click</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenAuth('register');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 flex items-center space-x-1.5 text-slate-700"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Register Another Account</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-red-50 text-red-600 flex items-center space-x-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#00685f] hover:bg-[#008378] text-white font-bold transition-colors shadow-xs"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition-colors"
              >
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
