import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Thermometer, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Download, 
  Share2, 
  QrCode, 
  Truck, 
  Store,
  ExternalLink,
  ChevronDown,
  Play,
  PenTool,
  X,
  AlertTriangle
} from 'lucide-react';
import { PRIMARY_ORDER } from '../../data/mockData';

interface CustomerOrderTrackingProps {
  onBack: () => void;
  onOpenHelp: () => void;
}

export const CustomerOrderTracking: React.FC<CustomerOrderTrackingProps> = ({
  onBack,
  onOpenHelp
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showItemDetails, setShowItemDetails] = useState(true);
  
  // Interactive delivery simulation state
  const [currentStep, setCurrentStep] = useState<number>(4); // 4 = Out for Delivery, 5 = Delivered
  const [etaMins, setEtaMins] = useState<number>(PRIMARY_ORDER.estimatedDeliveryMins);
  const [courierDistance, setCourierDistance] = useState<string>(PRIMARY_ORDER.courier.distance);
  const [tempAlert, setTempAlert] = useState<boolean>(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [signatureDone, setSignatureDone] = useState<boolean>(false);

  const order = PRIMARY_ORDER;

  const handleAdvanceDelivery = () => {
    if (currentStep === 4 && etaMins > 3) {
      setEtaMins(3);
      setCourierDistance('0.4 miles away (Turning on 5th Ave)');
    } else if (currentStep === 4 && etaMins <= 3) {
      setEtaMins(0);
      setCourierDistance('Arrived at front desk');
      setIsSignModalOpen(true);
    }
  };

  const handleConfirmDelivery = () => {
    setCurrentStep(5);
    setIsSignModalOpen(false);
    setSignatureDone(true);
  };

  const handleShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadInvoice = () => {
    const text = `genericMed Tax Invoice & Monograph\nOrder ID: ${order.id}\nItem: ${order.item.name}\nBatch: ${order.item.batchNumber}\nNDC: ${order.item.ndc}\nTotal: $${order.pricing.total.toFixed(2)}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genericMed-Invoice-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff] text-[#0b1c30] pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#f8f9ff] border-b border-[#bcc9c6]/40 shadow-sm">
        <div className="flex justify-between items-center max-w-md mx-auto px-4 h-12">
          <button 
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-[#dce9ff] text-[#0b1c30] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-sm font-bold text-[#0b1c30]">Order #{order.id}</h1>
            <span className="text-[10px] text-[#3d4947] block text-center">Placed today at {order.placedAt}</span>
          </div>

          <button 
            onClick={onOpenHelp}
            className="p-1.5 rounded-full hover:bg-[#dce9ff] text-[#00685f] transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Support</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full px-4 pt-3 space-y-3.5">
        {/* Status Header Banner */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${currentStep === 5 ? 'bg-[#006948]' : 'bg-[#006948] animate-ping'}`}></span>
              <h2 className="text-base font-bold text-[#00685f]">
                {currentStep === 5 ? 'Delivered & Recipient Verified' : order.status}
              </h2>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              currentStep === 5 ? 'bg-[#85f8c4] text-[#002114]' : 'bg-[#85f8c4] text-[#006948]'
            }`}>
              {currentStep === 5 ? 'Completed' : `~${etaMins} mins away`}
            </span>
          </div>

          <p className="text-xs text-[#3d4947]">
            Dispatched from <strong className="text-[#0b1c30]">{order.pharmacy.name}</strong> ({order.pharmacy.license})
          </p>

          {/* Interactive Simulation Controls */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500">Demo Sim:</span>
              <button
                onClick={handleAdvanceDelivery}
                disabled={currentStep === 5}
                className="px-2.5 py-1 bg-[#eff4ff] hover:bg-[#dce9ff] border border-[#bcc9c6] rounded text-[11px] font-bold text-[#00685f] flex items-center gap-1 disabled:opacity-40"
              >
                <Play className="w-3 h-3" />
                <span>{etaMins === 0 ? 'Sign for Delivery' : etaMins <= 3 ? 'Arrive at Door' : 'Advance Courier'}</span>
              </button>
            </div>

            <button
              onClick={() => setTempAlert(!tempAlert)}
              className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                tempAlert ? 'bg-red-50 text-red-700 border-red-300' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Simulate Sensor: {tempAlert ? 'High Temp Warning' : '19.4°C Safe'}
            </button>
          </div>
        </section>

        {/* Live Map & Courier Card */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl overflow-hidden shadow-sm">
          {/* Visual Simulated Map Display */}
          <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-[#bcc9c6]">
            {/* Map Background Grid & Roads */}
            <svg className="w-full h-full object-cover" viewBox="0 0 400 200" fill="none">
              <rect width="400" height="200" fill="#e5eeff" />
              {/* Streets */}
              <path d="M 20 0 L 20 200 M 120 0 L 120 200 M 240 0 L 240 200 M 340 0 L 340 200" stroke="#bcc9c6" strokeWidth="6" strokeOpacity="0.4" />
              <path d="M 0 40 L 400 40 M 0 110 L 400 110 M 0 170 L 400 170" stroke="#bcc9c6" strokeWidth="6" strokeOpacity="0.4" />
              {/* Active Route Path */}
              <path d="M 60 140 Q 180 80 320 60" stroke="#00685f" strokeWidth="4" strokeDasharray="6 4" />
              {/* Pharmacy Pin */}
              <circle cx="60" cy="140" r="10" fill="#00685f" />
              <text x="54" y="144" fill="white" fontSize="11" fontWeight="bold">P</text>
              {/* Delivery Pin */}
              <circle cx="320" cy="60" r="10" fill="#ba1a1a" />
              <text x="316" y="64" fill="white" fontSize="11" fontWeight="bold">H</text>
              {/* Courier Vehicle Marker */}
              <circle cx={currentStep === 5 || etaMins === 0 ? 320 : etaMins <= 3 ? 280 : 210} cy={currentStep === 5 || etaMins === 0 ? 60 : etaMins <= 3 ? 70 : 95} r="14" fill="#006948" />
              <circle cx={currentStep === 5 || etaMins === 0 ? 320 : etaMins <= 3 ? 280 : 210} cy={currentStep === 5 || etaMins === 0 ? 60 : etaMins <= 3 ? 70 : 95} r="22" fill="#85f8c4" fillOpacity="0.3" className="animate-pulse" />
            </svg>

            {/* Live Telemetry Floating Pill */}
            <div className={`absolute top-2.5 left-2.5 rounded-md px-2 py-1 text-[11px] font-semibold shadow-xs flex items-center space-x-1.5 ${
              tempAlert ? 'bg-red-500 text-white animate-pulse' : 'bg-white/95 text-[#0b1c30] border border-[#bcc9c6]'
            }`}>
              <Thermometer className="w-3.5 h-3.5" />
              <span>Cold-Chain: <strong>{tempAlert ? '26.1°C (Thermal Warning)' : '19.4°C Safe'}</strong></span>
            </div>

            <div className="absolute bottom-2.5 right-2.5 bg-[#0b1c30] text-white rounded-md px-2.5 py-1 text-[11px] font-mono shadow-md">
              {courierDistance}
            </div>
          </div>

          {/* Courier Controls */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#dce9ff] text-[#00685f] flex items-center justify-center font-bold text-sm">
                MV
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#0b1c30]">{order.courier.name}</h3>
                <p className="text-[10px] text-[#3d4947]">{order.courier.vehicle}</p>
              </div>
            </div>

            <div className="flex space-x-1.5">
              <button 
                onClick={() => alert(`Connecting securely to courier ${order.courier.name}...`)}
                className="w-8 h-8 rounded-full border border-[#bcc9c6] flex items-center justify-center text-[#00685f] hover:bg-[#eff4ff] active:scale-95"
                title="Call courier"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => alert(`Direct in-app messaging with ${order.courier.name}`)}
                className="w-8 h-8 rounded-full border border-[#bcc9c6] flex items-center justify-center text-[#00685f] hover:bg-[#eff4ff] active:scale-95"
                title="Message courier"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* 5-Step Vertical Fulfillment Timeline */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
            Verification & Fulfillment Timeline
          </h3>

          <div className="space-y-4 pl-1">
            {/* Step 1 */}
            <div className="flex items-start space-x-3 relative">
              <div className="w-6 h-6 rounded-full bg-[#85f8c4] text-[#002114] flex items-center justify-center flex-shrink-0 z-10">
                <CheckCircle2 className="w-4 h-4 text-[#006948]" />
              </div>
              <div className="absolute top-6 left-3 w-0.5 h-6 bg-[#85f8c4]"></div>
              <div className="pt-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-[#0b1c30]">Order Placed & Rx Linked</h4>
                  <span className="text-[10px] text-[#3d4947]">10:14 AM</span>
                </div>
                <p className="text-[11px] text-[#3d4947]">Electronic prescription uploaded and verified via OCR.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-3 relative">
              <div className="w-6 h-6 rounded-full bg-[#85f8c4] text-[#002114] flex items-center justify-center flex-shrink-0 z-10">
                <CheckCircle2 className="w-4 h-4 text-[#006948]" />
              </div>
              <div className="absolute top-6 left-3 w-0.5 h-6 bg-[#85f8c4]"></div>
              <div className="pt-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-[#0b1c30]">Pharmacist Clinical Approval</h4>
                  <span className="text-[10px] text-[#3d4947]">10:22 AM</span>
                </div>
                <p className="text-[11px] text-[#3d4947]">
                  Approved by Dr. Arthur Pendelton, RPh (#8491) for therapeutic equivalence.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-3 relative">
              <div className="w-6 h-6 rounded-full bg-[#85f8c4] text-[#002114] flex items-center justify-center flex-shrink-0 z-10">
                <CheckCircle2 className="w-4 h-4 text-[#006948]" />
              </div>
              <div className="absolute top-6 left-3 w-0.5 h-6 bg-[#85f8c4]"></div>
              <div className="pt-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-[#0b1c30]">Packed & Tamper-Sealed</h4>
                  <span className="text-[10px] text-[#3d4947]">10:35 AM</span>
                </div>
                <p className="text-[11px] text-[#3d4947]">
                  Barcoded in tamper-evident seal <span className="font-mono font-semibold">#GM-SEAL-8924</span>.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-3 relative">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                currentStep >= 5 
                  ? 'bg-[#85f8c4] text-[#002114]' 
                  : 'bg-[#00685f] text-white ring-4 ring-[#89f5e7]/50'
              }`}>
                {currentStep >= 5 ? <CheckCircle2 className="w-4 h-4 text-[#006948]" /> : <Truck className="w-3.5 h-3.5" />}
              </div>
              <div className={`absolute top-6 left-3 w-0.5 h-6 ${currentStep >= 5 ? 'bg-[#85f8c4]' : 'bg-[#bcc9c6]'}`}></div>
              <div className="pt-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className={`text-xs font-bold ${currentStep >= 5 ? 'text-[#0b1c30]' : 'text-[#00685f]'}`}>
                    {currentStep >= 5 ? 'Courier Transit Completed' : 'Out for Delivery'}
                  </h4>
                  <span className="text-[10px] text-[#006948] font-bold">10:48 AM</span>
                </div>
                <p className="text-[11px] text-[#3d4947]">
                  {currentStep >= 5 ? 'Cold-chain telemetry logged 19.4°C throughout transport.' : 'Courier in transit with active cold-chain temperature telemetry.'}
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                currentStep === 5 
                  ? 'bg-[#00685f] text-white ring-4 ring-[#89f5e7]/50' 
                  : 'bg-slate-100 border border-[#bcc9c6] text-[#3d4947]'
              }`}>
                {currentStep === 5 ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Clock className="w-3.5 h-3.5" />}
              </div>
              <div className="pt-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className={`text-xs font-bold ${currentStep === 5 ? 'text-[#00685f]' : 'text-[#3d4947]'}`}>
                    {currentStep === 5 ? 'Delivered & Recipient Signature Verified' : 'Delivered & Recipient Signature'}
                  </h4>
                  <span className="text-[10px] text-[#3d4947]">{currentStep === 5 ? '11:02 AM (Now)' : '~11:15 AM'}</span>
                </div>
                <p className="text-[11px] text-[#3d4947]">
                  {currentStep === 5 ? 'Signed by Eleanor Vance (OTP #4892 verified at doorstep).' : 'Recipient ID check required at doorstep.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Order Item Snapshot */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-2">
          <div 
            onClick={() => setShowItemDetails(!showItemDetails)}
            className="flex justify-between items-center cursor-pointer"
          >
            <h3 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
              Order Item Snapshot
            </h3>
            <ChevronDown className={`w-4 h-4 text-[#3d4947] transition-transform ${showItemDetails ? 'rotate-180' : ''}`} />
          </div>

          {showItemDetails && (
            <div className="pt-2 border-t border-[#bcc9c6]/40 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[#0b1c30]">{order.item.name}</h4>
                  <p className="text-[11px] text-[#3d4947]">
                    Generic for {order.item.equivalentTo} • {order.item.packaging}
                  </p>
                  <p className="text-[10px] font-mono text-[#00685f] mt-0.5">
                    NDC: {order.item.ndc} • Batch: {order.item.batchNumber}
                  </p>
                </div>
                <div className="text-right font-bold text-[#0b1c30]">
                  ${order.pricing.total.toFixed(2)}
                </div>
              </div>

              <div className="bg-[#eff4ff] rounded-md p-2 flex justify-between items-center text-[11px]">
                <span className="text-[#3d4947]">Brand Price Equivalent: $69.00</span>
                <span className="text-[#006948] font-bold">89% Savings Realized</span>
              </div>
            </div>
          )}
        </section>

        {/* Safety & Batch Verification Guarantee */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-[#00685f]">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
                  USP & FDA Authenticity Verified
                </h4>
              </div>
              <p className="text-[11px] text-[#3d4947] leading-relaxed">
                Scan the batch QR code to inspect laboratory testing certificate and temperature logs.
              </p>
            </div>

            {/* Visual 2D QR Code Simulation */}
            <div className="w-14 h-14 bg-white border border-slate-300 rounded p-1 flex items-center justify-center flex-shrink-0">
              <QrCode className="w-11 h-11 text-[#0b1c30]" />
            </div>
          </div>

          <div className="flex space-x-2 pt-1">
            <button 
              onClick={handleDownloadInvoice}
              className="flex-1 h-9 bg-[#eff4ff] text-[#00685f] border border-[#bcc9c6] rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 hover:bg-[#dce9ff]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </button>
            <button 
              onClick={handleShareLink}
              className="flex-1 h-9 bg-[#eff4ff] text-[#00685f] border border-[#bcc9c6] rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 hover:bg-[#dce9ff]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Live Tracking'}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Doorstep Recipient Verification & Signature Modal */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 relative space-y-4">
            <button 
              onClick={() => setIsSignModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#00685f]">
              <PenTool className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#0b1c30]">Doorstep Delivery Verification</h3>
            </div>

            <p className="text-xs text-slate-600">
              State Board of Pharmacy requires recipient confirmation for prescription generic delivery.
            </p>

            <div className="bg-[#eff4ff] p-3 rounded-lg border border-[#bcc9c6]/40 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Name:</span>
                <span className="font-bold text-[#0b1c30]">Eleanor Vance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rx Drug:</span>
                <span className="font-bold text-[#00685f]">Atorvastatin Calcium 20mg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Courier:</span>
                <span className="font-semibold text-[#0b1c30]">Marcus Vance (ID #7842)</span>
              </div>
            </div>

            {/* OTP Verification Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Enter Delivery OTP (Sent via SMS):
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="4892"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  className="w-full text-center text-lg font-mono font-bold tracking-widest py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00685f] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setOtpValue('4892')}
                  className="px-2.5 py-2 text-[10px] font-bold text-[#00685f] bg-[#eff4ff] hover:bg-[#dce9ff] rounded-lg whitespace-nowrap border border-[#bcc9c6]"
                >
                  Auto-Fill
                </button>
              </div>
            </div>

            {/* Recipient Signature Simulation Pad */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Digital Recipient Signature:
              </label>
              <div 
                onClick={() => setSignatureDone(true)}
                className="h-20 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors p-2 text-center"
              >
                {signatureDone ? (
                  <span className="font-serif italic text-xl text-[#00685f] font-bold tracking-wider select-none">
                    Eleanor Vance
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5" />
                    Click or tap here to apply signature
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleConfirmDelivery}
              disabled={!signatureDone && otpValue !== '4892'}
              className="w-full py-3 bg-[#00685f] hover:bg-[#008378] disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Receipt & Sign Delivery</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
