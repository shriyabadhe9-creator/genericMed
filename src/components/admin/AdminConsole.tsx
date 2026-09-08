import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Database, 
  Cpu, 
  Lock, 
  Eye, 
  Sliders, 
  AlertOctagon, 
  ArrowUpRight, 
  TrendingUp, 
  Check, 
  XCircle, 
  Store,
  Layers,
  ChevronRight,
  Server
} from 'lucide-react';
import { OPERATIONAL_EXCEPTIONS, AUDIT_LEDGER } from '../../data/mockData';
import { OperationalException, AuditLedgerEvent } from '../../types';

export const AdminConsole: React.FC = () => {
  const [exceptions, setExceptions] = useState<OperationalException[]>(OPERATIONAL_EXCEPTIONS);
  const [selectedException, setSelectedException] = useState<OperationalException>(OPERATIONAL_EXCEPTIONS[0]);
  const [activeSubTab, setActiveSubTab] = useState<'drift' | 'mappings' | 'sellers' | 'sla'>('drift');
  const [isPinging, setIsPinging] = useState(false);
  const [lockoutModal, setLockoutModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLedgerEvent[]>(AUDIT_LEDGER);

  const handlePingRevalidation = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      const newLog: AuditLedgerEvent = {
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        actor: 'Admin Operator Sarah.K',
        action: 'forced cluster-wide revalidation ping across 184 active pharmacy nodes',
        detail: 'Parity check completed in 218ms • 0 discrepancies detected',
        statusPill: { label: 'Cluster Parity OK', color: 'emerald' },
        txHash: '0x' + Math.random().toString(16).substring(2, 10) + '...f902'
      };
      setAuditLogs([newLog, ...auditLogs]);
    }, 800);
  };

  const handleResolveException = (action: 'approve' | 'flag_salt' | 'suspend') => {
    if (!selectedException) return;
    const actionText = 
      action === 'approve' ? 'approved price drift linkage' :
      action === 'flag_salt' ? 'flagged incorrect chemical salt mapping' :
      'triggered emergency seller suspension';

    const newLog: AuditLedgerEvent = {
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      actor: 'Admin Operator Sarah.K',
      action: `${actionText} for ${selectedException.id} (${selectedException.moleculeName})`,
      detail: `Target Pharmacy: ${selectedException.pharmacyName}`,
      statusPill: { 
        label: action === 'suspend' ? 'Seller Suspended' : 'Action Resolved', 
        color: action === 'suspend' ? 'red' : 'emerald' 
      },
      txHash: '0x' + Math.random().toString(16).substring(2, 10) + '...b184'
    };
    setAuditLogs([newLog, ...auditLogs]);

    setExceptions(prev => prev.map(ex => ex.id === selectedException.id ? { ...ex, resolved: true } : ex));
    alert(`Action executed: ${actionText}. Audit record committed to cryptographic ledger.`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col pb-16">
      {/* Top Operations Header */}
      <header className="bg-[#0b1c30] text-white border-b border-[#213145] px-4 lg:px-6 py-3 sticky top-12 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#00685f] text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-white">
                  genericMed Console v2.4
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#00685f] text-white text-[10px] font-mono">
                  PROD-US-EAST
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Central Operations & Autonomous Integrity Center
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-white block">Sarah.K</span>
              <span className="text-[10px] text-emerald-400">Senior Ops Admin</span>
            </div>

            <button
              onClick={() => setLockoutModal(true)}
              className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-red-500 shadow-sm transition-all"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Emergency Lockout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Real-time Telemetry Ribbon */}
      <div className="bg-[#131b2e] text-slate-300 text-xs border-b border-slate-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono text-[11px]">
          <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>RabbitMQ Ingestion: <strong className="text-emerald-300">1,420 msgs/s</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <span>Elasticsearch Lag: <strong className="text-emerald-300">140ms</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <span>Redis Hit Parity: <strong className="text-emerald-300">94.2%</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <span>Cron Revalidation: <strong className="text-cyan-300">Active (Next in 01:42)</strong></span>
            </div>
          </div>

          <button 
            onClick={handlePingRevalidation}
            disabled={isPinging}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] flex items-center space-x-1 border border-slate-700"
          >
            <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isPinging ? 'Pinging Nodes...' : 'Force Revalidation Ping'}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-6 space-y-5 flex-1">
        {/* 4 Executive KPI Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-[#3d4947] block">Live Catalog Offers</span>
            <div className="text-2xl font-bold text-[#0b1c30]">24,850</div>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2% vs yesterday
            </span>
          </div>

          <div className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-[#3d4947] block">Revalidation Accuracy</span>
            <div className="text-2xl font-bold text-emerald-700">99.82%</div>
            <span className="text-[10px] text-amber-700 font-semibold">
              -0.04% flag threshold
            </span>
          </div>

          <div className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-[#3d4947] block">Active Pharmacies</span>
            <div className="text-2xl font-bold text-[#0b1c30]">184 Stores</div>
            <span className="text-[10px] text-slate-500">
              12 in Audit Review
            </span>
          </div>

          <div className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-[#3d4947] block">Platform GMV / Comm</span>
            <div className="text-2xl font-bold text-[#00685f]">$142,850</div>
            <span className="text-[10px] text-emerald-700 font-semibold">
              $12,042 Net Rev (8.4%)
            </span>
          </div>
        </section>

        {/* Freshness SLA Threshold Alert Banner */}
        <section className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-900">
                Freshness SLA Threshold Warning: 12 Seller Endpoints Delayed
              </h3>
              <p className="text-[11px] text-amber-800 leading-tight">
                Endpoints exceed the 15-minute price freshness threshold. Automated price freeze protocol is active for non-compliant inventory feeds to prevent checkout price shocks.
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={() => alert("Showing 12 delayed seller endpoints across NY, CA, and IL hubs...")}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-100"
            >
              Inspect Delayed Feeds
            </button>
            <button 
              onClick={handlePingRevalidation}
              className="px-3 py-1.5 bg-amber-700 text-white rounded-lg text-xs font-bold hover:bg-amber-800"
            >
              Force Sync
            </button>
          </div>
        </section>

        {/* Exceptions & Match Drawer Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Exceptions Table (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#bcc9c6] rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-3.5 border-b border-[#bcc9c6] flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  Operational Exceptions & Reconciliation
                </h2>
                <span className="text-[10px] text-[#3d4947]">Click any row to inspect unit economics and cluster telemetry</span>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 text-[11px]">
                {[
                  { id: 'drift', label: 'Price Drift (14)' },
                  { id: 'mappings', label: 'Mappings (8)' },
                  { id: 'sellers', label: 'Sellers (3)' },
                  { id: 'sla', label: 'SLA (2)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveSubTab(t.id as any)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      activeSubTab === t.id 
                        ? 'bg-[#00685f] text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[#3d4947] font-semibold bg-slate-50 text-[11px]">
                    <th className="p-2.5">ID / Molecule</th>
                    <th className="p-2.5">Dispensing Hub</th>
                    <th className="p-2.5">Reported vs Live</th>
                    <th className="p-2.5">Drift Delta</th>
                    <th className="p-2.5">Freshness</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exceptions.map((exc) => {
                    const isSelected = selectedException?.id === exc.id;
                    return (
                      <tr
                        key={exc.id}
                        onClick={() => setSelectedException(exc)}
                        className={`cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-[#eff4ff] font-semibold' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-2.5">
                          <span className="font-mono text-[10px] text-[#00685f] block">
                            #{exc.id}
                          </span>
                          <span className="text-[#0b1c30]">{exc.moleculeName}</span>
                        </td>
                        <td className="p-2.5 text-[#3d4947]">
                          {exc.pharmacyName}
                        </td>
                        <td className="p-2.5 font-mono">
                          ${exc.reportedPrice.toFixed(2)} → ${exc.livePrice.toFixed(2)}
                        </td>
                        <td className="p-2.5">
                          <span className={`font-bold ${exc.status === 'breach' ? 'text-red-600' : 'text-emerald-700'}`}>
                            {exc.driftDelta} ({exc.driftPercent})
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-500 font-mono text-[10px]">
                          {exc.freshness}
                        </td>
                        <td className="p-2.5">
                          {exc.resolved ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Resolved
                            </span>
                          ) : exc.status === 'breach' ? (
                            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                              BREACH
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                              VALID
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspection & Match Drawer (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#bcc9c6] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00685f]">
                  Inspection & Match Drawer
                </span>
                <h3 className="text-sm font-bold text-[#0b1c30]">
                  #{selectedException.id} • {selectedException.moleculeName}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] text-[10px] font-mono font-bold">
                {selectedException.ndc}
              </span>
            </div>

            {/* Canonical Salt Mapping */}
            <div className="bg-[#eff4ff] rounded-lg p-2.5 text-xs space-y-1">
              <span className="font-bold text-[#0b1c30] block">RxNorm & Molecular Profile:</span>
              <p className="text-[11px] text-[#3d4947]">
                Ingested SKU mapped to RxNorm 83367 • InChiKey: XZZNDPVIUZKVDT-UHFFFAOYSA-N • FDA Code AB
              </p>
            </div>

            {/* Unit Economics Audit */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-[#0b1c30] uppercase tracking-wider block text-[10px]">
                Unit Economics Audit Breakdown:
              </span>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Base Pharmacy Wholesale (API)</span>
                  <span>$4.20</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cold Chain & Blister Packaging</span>
                  <span>$1.30</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pharmacy Dispensing Margin</span>
                  <span>$2.50</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Service Fee (8.4%)</span>
                  <span>$1.00</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Volume Subsidy Discount</span>
                  <span>-$0.50</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Final Consumer Checkout</span>
                  <span className="text-[#00685f]">$8.50 (Save $32.70 vs Brand)</span>
                </div>
              </div>
            </div>

            {/* Cluster Inventory Comparison */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#0b1c30] uppercase tracking-wider block text-[10px]">
                Cluster Comparison across Sellers:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div className="p-1.5 bg-red-50 border border-red-200 rounded">
                  <span className="text-slate-600 block">MedPlus</span>
                  <strong className="text-red-700 font-mono">$8.50 (Breach)</strong>
                </div>
                <div className="p-1.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-600 block">Apollo Care</span>
                  <strong className="text-slate-800 font-mono">$9.20 (Fresh)</strong>
                </div>
                <div className="p-1.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-600 block">PrimePharma</span>
                  <strong className="text-slate-800 font-mono">$8.90 (Fresh)</strong>
                </div>
              </div>
            </div>

            {/* Operator Decisioning Matrix */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="font-bold text-[#0b1c30] uppercase tracking-wider block text-[10px]">
                Operator Decisioning Matrix:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleResolveException('approve')}
                  className="py-2 px-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  Approve Linkage
                </button>
                <button
                  onClick={() => handleResolveException('flag_salt')}
                  className="py-2 px-2 border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold transition-all"
                >
                  Flag Bad Salt
                </button>
                <button
                  onClick={() => handleResolveException('suspend')}
                  className="py-2 px-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  Suspend Seller
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Immutable Audit Ledger Events */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-[#00685f]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                Cryptographic Audit Ledger & Activity Stream
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              SHA-256 Verified Immutable Block Log
            </span>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="pt-2 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-slate-500">{log.timestamp}</span>
                    <strong className="text-[#0b1c30]">{log.actor}</strong>
                    <span className="text-slate-600">{log.action}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{log.detail}</p>
                </div>

                <div className="flex items-center space-x-2">
                  {log.statusPill && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.statusPill.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                      log.statusPill.color === 'amber' ? 'bg-amber-100 text-amber-800' :
                      log.statusPill.color === 'red' ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {log.statusPill.label}
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {log.txHash}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Emergency Lockout Modal */}
      {lockoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border-2 border-red-600 space-y-4">
            <div className="flex items-center space-x-2.5 text-red-600">
              <AlertOctagon className="w-6 h-6" />
              <h3 className="text-base font-bold text-red-700">Platform Emergency Lockout Protocol</h3>
            </div>
            <p className="text-xs text-slate-700">
              This will immediately halt customer order placement, freeze all live Redis price feeds, and prevent automated pharmacy dispatch. Use only during severe catalog contamination or regulatory directive.
            </p>
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => setLockoutModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("EMERGENCY LOCKOUT INITIATED. Cluster nodes frozen. Super Admin notified.");
                  setLockoutModal(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
              >
                Engage Emergency Lockout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
