import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  RefreshCw, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  QrCode, 
  Printer, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  ChevronRight, 
  UserCheck, 
  ExternalLink,
  Sliders,
  Sparkles,
  Package,
  ArrowDownToLine,
  Truck
} from 'lucide-react';
import { PrescriptionVerificationModal } from './PrescriptionVerificationModal';
import { ClinicalExceptionModal } from './ClinicalExceptionModal';

export const PartnerConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'prescriptions' | 'settlements'>('orders');
  const [isStoreOnline, setIsStoreOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [packedOrders, setPackedOrders] = useState<Record<string, boolean>>({});
  const [approvedOrders, setApprovedOrders] = useState<Record<string, boolean>>({});

  // Editable prices state
  const [prices, setPrices] = useState({
    atorvastatin: 3.90,
    metformin: 3.10,
    amoxicillin: 5.80,
    omeprazole: 6.40,
  });

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const handleMarkPacked = (orderId: string) => {
    setPackedOrders(prev => ({ ...prev, [orderId]: true }));
  };

  const handleApproveRx = () => {
    setApprovedOrders(prev => ({ ...prev, 'GM-89248': true }));
    setIsRxModalOpen(false);
  };

  const handleDownloadSettlement = () => {
    const csvContent = `Apex Central Pharmacy Hub #4 Settlement Statement\nPeriod: Sept 01 - Sept 15, 2026\nGross GMV: $9,192.14\nPackaging Subsidy: +$112.50\nPlatform Commission (8.4%): -$772.14\nNet Payout: $8,420.00\nStatus: Pending Wire Transfer`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Settlement-Apex-Hub4-Sept2026.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col">
      {/* Top Console Navigation Bar */}
      <header className="bg-white border-b border-[#bcc9c6] px-4 lg:px-6 py-3 sticky top-12 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Pharmacy Hub Title & Switcher */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#00685f] text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-[#0b1c30]">
                  Apex Central Pharmacy • Hub #4
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#85f8c4] text-[#002114] text-[10px] font-bold">
                  State License: DL-MH-984210
                </span>
              </div>
              <p className="text-xs text-[#3d4947]">
                Supervising Pharmacist: <strong className="text-[#0b1c30]">Dr. Arthur Pendelton, RPh</strong> (#8491)
              </p>
            </div>
          </div>

          {/* Quick Actions & Search */}
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={handleSync}
              className="px-3 py-1.5 bg-[#eff4ff] border border-[#bcc9c6] rounded-lg text-xs font-semibold text-[#00685f] hover:bg-[#dce9ff] flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Feeds...' : 'Live Stock Sync'}</span>
            </button>

            {/* Store Online Toggle */}
            <button 
              onClick={() => setIsStoreOnline(!isStoreOnline)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                isStoreOnline 
                  ? 'bg-[#85f8c4] text-[#002114] border border-[#68dba9]' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isStoreOnline ? 'bg-[#006948] animate-pulse' : 'bg-red-600'}`}></span>
              <span>{isStoreOnline ? 'Store Accepting Orders' : 'Store Paused'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-4">
          <nav className="bg-white border border-[#bcc9c6] rounded-xl p-2.5 shadow-sm space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'orders' 
                  ? 'bg-[#00685f] text-white shadow-xs' 
                  : 'text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Order Queue & SLAs</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
              }`}>
                7 Pending
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'inventory' 
                  ? 'bg-[#00685f] text-white shadow-xs' 
                  : 'text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4" />
                <span>Inventory & Pricing</span>
              </div>
              <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                2 Stale
              </span>
            </button>

            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'prescriptions' 
                  ? 'bg-[#00685f] text-white shadow-xs' 
                  : 'text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Prescription Inbox</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
                3 Urgent
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settlements')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === 'settlements' 
                  ? 'bg-[#00685f] text-white shadow-xs' 
                  : 'text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Settlements & Payouts</span>
              </div>
              <span className="text-[10px] text-[#006948] font-bold">
                $8,420 Net
              </span>
            </button>
          </nav>

          {/* Freshness Health Card */}
          <div className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0b1c30]">Freshness SLA Health</span>
              <span className="text-emerald-600 font-bold">99.8%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#00685f] h-full rounded-full" style={{ width: '99.8%' }}></div>
            </div>
            <p className="text-[11px] text-[#3d4947]">
              Average packing velocity: <strong className="text-[#0b1c30]">6.4 mins</strong> (Target: &lt;15m).
            </p>
          </div>

          {/* Quick Pharmacist Modal Launcher Button */}
          <div className="p-3 bg-[#f4fffc] border border-[#85f8c4] rounded-xl space-y-2 text-xs">
            <span className="font-bold text-[#006948] block">Clinical Verification Trigger:</span>
            <p className="text-[11px] text-[#3d4947]">
              Open the full 21 CFR § 1306 eRx Clinical Verification review modal directly:
            </p>
            <button
              onClick={() => setIsRxModalOpen(true)}
              className="w-full py-2 bg-[#00685f] text-white rounded-lg font-bold text-xs hover:bg-[#008378] transition-colors"
            >
              Open Rx Verification Modal
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-5">
          {/* Executive KPI Bento Grid */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-[#3d4947] block">Today's Orders</span>
              <div className="text-xl font-bold text-[#0b1c30]">42</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +12% vs 7d avg
              </div>
            </div>

            <div className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-[#3d4947] block">Pending Dispatch</span>
              <div className="text-xl font-bold text-red-600">7 Orders</div>
              <div className="text-[10px] text-red-600 font-semibold">
                2 approaching SLA
              </div>
            </div>

            <div className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-[#3d4947] block">Active Offers</span>
              <div className="text-xl font-bold text-[#0b1c30]">318 SKUs</div>
              <div className="text-[10px] text-[#00685f] font-semibold">
                98.4% Sync Parity
              </div>
            </div>

            <div className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-[#3d4947] block">Net Accrued Payout</span>
              <div className="text-xl font-bold text-[#00685f]">$8,420.00</div>
              <div className="text-[10px] text-[#3d4947]">
                Cycle ends in 4 days
              </div>
            </div>
          </section>

          {/* Fulfillment Queue View */}
          {activeTab === 'orders' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
                  Live Dispatch & Packing Queue (7 Orders)
                </h2>
                <div className="flex items-center space-x-2 text-xs text-[#3d4947]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Auto-refreshing every 10s</span>
                </div>
              </div>

              {/* Order Card 1: #GM-89241 (Atorvastatin) */}
              <div className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] font-mono text-xs font-bold">
                      #GM-89241
                    </span>
                    <span className="text-xs font-bold text-[#0b1c30]">
                      Atorvastatin Calcium 20mg (10 Tablets)
                    </span>
                    <span className="text-xs text-[#3d4947]">• Qty: 2 ($8.30)</span>
                  </div>

                  {/* SLA Warning */}
                  <div className="flex items-center space-x-1.5 text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>08:24 mins SLA left</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-[#3d4947] bg-[#eff4ff] p-2.5 rounded-lg">
                  <div>
                    <span className="text-[10px] block">Courier:</span>
                    <strong className="text-[#0b1c30]">Marcus Vance</strong> (ETA: 6 mins)
                  </div>
                  <div>
                    <span className="text-[10px] block">Prescription:</span>
                    <span className="text-[#006948] font-bold">Approved by Dr. Pendelton</span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Shelf Location:</span>
                    <strong className="text-[#0b1c30]">Bay 1C • Batch #AT24-0982</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert("Printing Barcoded Tamper-Evident Seal #GM-SEAL-8924...")}
                      className="px-2.5 py-1.5 border border-[#bcc9c6] rounded-lg text-xs text-[#3d4947] hover:bg-slate-50 flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Barcode & Seals</span>
                    </button>
                    <button 
                      onClick={() => alert("FDA Orange Book Monograph for Atorvastatin 20mg: Code AB, Therapeutic Equivalent.")}
                      className="px-2.5 py-1.5 border border-[#bcc9c6] rounded-lg text-xs text-[#3d4947] hover:bg-slate-50 flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Monograph</span>
                    </button>
                  </div>

                  {packedOrders['GM-89241'] ? (
                    <span className="px-3 py-1.5 bg-[#85f8c4] text-[#002114] rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#006948]" />
                      Packed & Sealed in Bay 4B
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMarkPacked('GM-89241')}
                      className="px-4 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      Mark Packed & Cold-Sealed
                    </button>
                  )}
                </div>
              </div>

              {/* Order Card 2: #GM-89248 (Metformin - Requires Verification) */}
              <div className="bg-white border-2 border-red-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono text-xs font-bold">
                      #GM-89248
                    </span>
                    <span className="text-xs font-bold text-[#0b1c30]">
                      Metformin HCl ER 500mg (60 Tablets)
                    </span>
                    <span className="text-xs text-[#3d4947]">• Patient: Eleanor Vance</span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Rx Verification Required
                  </span>
                </div>

                <div className="bg-red-50/70 border border-red-200 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-red-900 block">
                      Script Attached: Dr_Smith_Prescription_Sept.pdf
                    </span>
                    <span className="text-[11px] text-red-700">
                      Dr. Robert H. Smith MD • Sig: 1 tab PO BID with meals #60
                    </span>
                  </div>

                  {approvedOrders['GM-89248'] ? (
                    <span className="px-3 py-1.5 bg-[#85f8c4] text-[#002114] rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#006948]" />
                      Rx Approved & Transferred to Bay
                    </span>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsExceptionModalOpen(true)}
                        className="px-3 py-1.5 border border-red-300 text-red-700 bg-white hover:bg-red-50 rounded-lg text-xs font-bold"
                      >
                        Reject Order
                      </button>
                      <button
                        onClick={() => setIsRxModalOpen(true)}
                        className="px-4 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Review Rx & Approve</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Card 3: #GM-89235 (Omeprazole) */}
              <div className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] font-mono text-xs font-bold">
                      #GM-89235
                    </span>
                    <span className="text-xs font-bold text-[#0b1c30]">
                      Omeprazole Delayed-Rel 20mg (28 Capsules)
                    </span>
                    <span className="text-xs text-[#3d4947]">• Bay 4B</span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-[10px] font-bold">
                    Packed & Ready for Courier
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-[#3d4947] flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#00685f]" />
                    Courier S. Jenkins arrived at counter
                  </span>

                  <button 
                    onClick={() => alert("Courier barcode scanned and verified! Handover completed.")}
                    className="px-3.5 py-1.5 bg-[#eff4ff] border border-[#bcc9c6] hover:bg-[#dce9ff] text-[#00685f] rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Handover Scan (QR)</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Inventory & Price Sync View */}
          {activeTab === 'inventory' && (
            <section className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
                    Catalog & Live Price Floor Control
                  </h2>
                  <p className="text-xs text-[#3d4947]">
                    Adjust your offers to win ranking on the consumer comparison portal.
                  </p>
                </div>
                <button 
                  onClick={() => alert("Inventory CSV template downloaded.")}
                  className="px-3 py-1.5 bg-[#eff4ff] border border-[#bcc9c6] rounded-lg text-xs font-semibold text-[#00685f] flex items-center gap-1.5"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Bulk Upload CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[#3d4947] font-semibold bg-slate-50">
                      <th className="p-2.5">Generic Molecule & Salt</th>
                      <th className="p-2.5">Brand Eq.</th>
                      <th className="p-2.5">Competitor Floor</th>
                      <th className="p-2.5">Your Offer Price</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5">
                        <strong className="text-[#0b1c30] block">Atorvastatin Calcium 20mg</strong>
                        <span className="text-[10px] text-slate-500">10 Tablets • NDC 0093-7204-56</span>
                      </td>
                      <td className="p-2.5 text-slate-600">Lipitor® ($34.50)</td>
                      <td className="p-2.5 font-semibold text-emerald-700">$3.90</td>
                      <td className="p-2.5">
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-500">$</span>
                          <input 
                            type="number" 
                            step="0.10"
                            value={prices.atorvastatin}
                            onChange={(e) => setPrices({ ...prices, atorvastatin: parseFloat(e.target.value) || 0 })}
                            className="w-16 p-1 border border-slate-300 rounded text-xs font-bold"
                          />
                        </div>
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          Rank #1 Leader
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button 
                          onClick={() => alert("Price updated across live cluster in 140ms!")}
                          className="px-2.5 py-1 bg-[#00685f] text-white rounded text-[11px] font-bold"
                        >
                          Save
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5">
                        <strong className="text-[#0b1c30] block">Metformin HCl ER 500mg</strong>
                        <span className="text-[10px] text-slate-500">60 Tablets • NDC 53808-0978-1</span>
                      </td>
                      <td className="p-2.5 text-slate-600">Glucophage® ($17.50)</td>
                      <td className="p-2.5 font-semibold text-slate-700">$2.60</td>
                      <td className="p-2.5">
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-500">$</span>
                          <input 
                            type="number" 
                            step="0.10"
                            value={prices.metformin}
                            onChange={(e) => setPrices({ ...prices, metformin: parseFloat(e.target.value) || 0 })}
                            className="w-16 p-1 border border-slate-300 rounded text-xs font-bold"
                          />
                        </div>
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                          Rank #2 (+ $0.50)
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button 
                          onClick={() => setPrices({ ...prices, metformin: 2.60 })}
                          className="px-2.5 py-1 border border-[#00685f] text-[#00685f] hover:bg-[#eff4ff] rounded text-[11px] font-bold"
                        >
                          Match Floor
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5">
                        <strong className="text-[#0b1c30] block">Amoxicillin Trihydrate 875mg</strong>
                        <span className="text-[10px] text-slate-500">20 Capsules • NDC 0093-3109-53</span>
                      </td>
                      <td className="p-2.5 text-slate-600">Amoxil® ($22.40)</td>
                      <td className="p-2.5 font-semibold text-emerald-700">$5.80</td>
                      <td className="p-2.5">
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-500">$</span>
                          <input 
                            type="number" 
                            step="0.10"
                            value={prices.amoxicillin}
                            onChange={(e) => setPrices({ ...prices, amoxicillin: parseFloat(e.target.value) || 0 })}
                            className="w-16 p-1 border border-slate-300 rounded text-xs font-bold"
                          />
                        </div>
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          Rank #1 Leader
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button 
                          onClick={() => alert("Saved!")}
                          className="px-2.5 py-1 bg-[#00685f] text-white rounded text-[11px] font-bold"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Prescription Inbox View */}
          {activeTab === 'prescriptions' && (
            <section className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
                    Supervising Pharmacist Clinical Verification Inbox
                  </h2>
                  <p className="text-xs text-[#3d4947]">
                    Pending electronic prescriptions requiring pharmacist authorization prior to packaging.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                  3 Scripts in Queue
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-[#00685f]" />
                    <div>
                      <h3 className="text-xs font-bold text-[#0b1c30]">
                        Prescription #eRx-2026-98112-MH • Eleanor Vance (58 Yrs)
                      </h3>
                      <p className="text-[11px] text-[#3d4947]">
                        Metformin HCl ER 500mg • Dr. Robert H. Smith MD • Surescripts Signed
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsRxModalOpen(true)}
                    className="px-3.5 py-1.5 bg-[#00685f] text-white rounded-lg text-xs font-bold hover:bg-[#008378]"
                  >
                    Review & Verify Script
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-[#00685f]" />
                    <div>
                      <h3 className="text-xs font-bold text-[#0b1c30]">
                        Prescription #eRx-2026-98044-NY • Marcus Brody (42 Yrs)
                      </h3>
                      <p className="text-[11px] text-[#3d4947]">
                        Atorvastatin Calcium 40mg • Dr. Clara Oswald MD
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsRxModalOpen(true)}
                    className="px-3.5 py-1.5 bg-[#00685f] text-white rounded-lg text-xs font-bold hover:bg-[#008378]"
                  >
                    Review & Verify Script
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Settlements & Payouts View */}
          {activeTab === 'settlements' && (
            <section className="bg-white border border-[#bcc9c6] rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#0b1c30] uppercase tracking-wider">
                    Settlements & Pharmacy Payouts
                  </h2>
                  <p className="text-xs text-[#3d4947]">
                    Transparent 14-day rolling automated ACH transfer ledger with unit economics breakdown.
                  </p>
                </div>
                <button 
                  onClick={handleDownloadSettlement}
                  className="px-3 py-1.5 bg-[#00685f] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#008378]"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Download Ledger CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#eff4ff] border border-[#bcc9c6] rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#3d4947]">Gross GMV Dispatched</span>
                  <div className="text-xl font-bold text-[#0b1c30] mt-1">$9,192.14</div>
                  <span className="text-[10px] text-slate-500">194 Prescriptions</span>
                </div>

                <div className="p-3 bg-[#eff4ff] border border-[#bcc9c6] rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#3d4947]">Platform Commission</span>
                  <div className="text-xl font-bold text-red-600 mt-1">-$772.14</div>
                  <span className="text-[10px] text-slate-500">8.4% Blended Rate</span>
                </div>

                <div className="p-3 bg-[#f4fffc] border border-[#85f8c4] rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#006948]">Net Accrued Payout</span>
                  <div className="text-xl font-bold text-[#006948] mt-1">$8,420.00</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Scheduled: Sept 15, 2026</span>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Clinical Verification Modal */}
      <PrescriptionVerificationModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        onApprove={handleApproveRx}
        onReject={() => {
          setIsRxModalOpen(false);
          setIsExceptionModalOpen(true);
        }}
      />

      {/* Clinical Exception Protocol Modal */}
      <ClinicalExceptionModal
        isOpen={isExceptionModalOpen}
        onClose={() => setIsExceptionModalOpen(false)}
        onSubmitException={(details) => {
          alert(`Clinical exception logged: ${details.category} via ${details.routing}. Patient notice dispatched.`);
        }}
      />
    </div>
  );
};
