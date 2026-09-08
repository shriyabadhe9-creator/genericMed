import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Clock, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  Minus, 
  CreditCard, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Truck
} from 'lucide-react';
import { CartItem } from '../../types';

interface CustomerCheckoutProps {
  cart: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onBack: () => void;
  onPlaceOrder: () => void;
}

export const CustomerCheckout: React.FC<CustomerCheckoutProps> = ({
  cart,
  onUpdateQuantity,
  onBack,
  onPlaceOrder
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(899); // 14:59
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'fsa'>('apple_pay');
  const [prescriptionAttached, setPrescriptionAttached] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Pricing math
  const defaultItem = cart[0];
  const quantity = defaultItem?.quantity || 2;
  const unitPrice = defaultItem?.selectedOffer?.price || 3.90;
  const itemsTotal = quantity * unitPrice;
  const brandRefPrice = (defaultItem?.medicine?.brandPrice || 34.50) * quantity;
  const packagingFee = 0.50;
  const total = itemsTotal + packagingFee;
  const totalSavings = brandRefPrice - itemsTotal;

  const handleCheckout = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      onPlaceOrder();
    }, 700);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff] text-[#0b1c30] pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#f8f9ff] border-b border-[#bcc9c6]/40 shadow-sm">
        <div className="flex justify-between items-center max-w-md mx-auto px-4 h-12">
          <button 
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-[#dce9ff] text-[#0b1c30] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base font-bold text-[#0b1c30]">Review Cart & Checkout</h1>

          <div className="flex items-center space-x-1 text-[#00685f] text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">256-Bit SSL</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full px-4 pt-3 space-y-3.5">
        {/* Step Indicator */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-[#00685f] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#00685f] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Review Cart</span>
            </div>
            <span className="h-0.5 w-6 bg-[#00685f]"></span>
            <div className="flex items-center space-x-1.5 text-[#00685f] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#00685f] text-white flex items-center justify-center text-[10px]">2</span>
              <span>Address & Rx</span>
            </div>
            <span className="h-0.5 w-6 bg-[#bcc9c6]"></span>
            <div className="flex items-center space-x-1.5 text-[#3d4947]">
              <span className="w-5 h-5 rounded-full bg-[#dce9ff] text-[#00685f] flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Payment</span>
            </div>
          </div>
        </section>

        {/* Live Stock & Price Lock Banner */}
        <section className="bg-[#eff4ff] border border-[#6bd8cb] rounded-lg p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-[#00685f]">
            <Clock className="w-4 h-4 flex-shrink-0 animate-spin text-[#00685f]" />
            <span className="font-semibold">
              Live Stock & Price Locked for: <strong className="font-mono text-sm">{formatTimer(secondsRemaining)}</strong>
            </span>
          </div>
          <span className="text-[10px] text-[#006948] bg-[#85f8c4] px-1.5 py-0.5 rounded font-bold">
            Guaranteed
          </span>
        </section>

        {/* Cart Item Card */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00685f]">
                {defaultItem?.selectedOffer?.pharmacyName || 'MedPlus Central Pharmacy'}
              </span>
              <h2 className="text-sm font-bold text-[#0b1c30]">
                {defaultItem?.medicine?.genericName || 'Atorvastatin Calcium'} {defaultItem?.selectedStrength || '20mg'}
              </h2>
              <p className="text-xs text-[#3d4947]">
                Generic for {defaultItem?.medicine?.brandReference || 'Lipitor®'} • Strip of {defaultItem?.selectedPackSize || 10} Tablets
              </p>
            </div>

            <span className="text-xs font-bold text-[#00685f]">
              ${unitPrice.toFixed(2)} / pack
            </span>
          </div>

          <div className="pt-2 border-t border-[#bcc9c6]/40 flex items-center justify-between">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-2 bg-[#eff4ff] border border-[#bcc9c6] rounded-lg px-2 py-1">
              <button 
                onClick={() => onUpdateQuantity(0, -1)}
                className="text-[#00685f] hover:text-[#0b1c30] p-1 active:scale-95"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-[#0b1c30] w-4 text-center">
                {quantity}
              </span>
              <button 
                onClick={() => onUpdateQuantity(0, 1)}
                className="text-[#00685f] hover:text-[#0b1c30] p-1 active:scale-95"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total Line */}
            <div className="text-right">
              <span className="text-sm font-bold text-[#0b1c30] block">
                ${itemsTotal.toFixed(2)}
              </span>
              <span className="text-[10px] font-semibold text-[#006948]">
                Save ${totalSavings.toFixed(2)} vs Brand
              </span>
            </div>
          </div>
        </section>

        {/* Prescription Verification Status Card */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#00685f]" />
              <h3 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
                Prescription Attached
              </h3>
            </div>
            <span className="text-[10px] text-[#006948] bg-[#85f8c4] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              100% OCR Match
            </span>
          </div>

          <div className="bg-[#eff4ff] border border-[#bcc9c6]/60 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-red-500 border border-red-200">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0b1c30] block">
                  Dr_Smith_Prescription_Sept.pdf
                </span>
                <span className="text-[10px] text-[#3d4947]">
                  Dr. Robert H. Smith MD • NPI: 1487920194
                </span>
              </div>
            </div>
            <button 
              onClick={() => alert("Previewing e-Prescription with cryptographic certificate...")}
              className="text-xs text-[#00685f] font-semibold hover:underline"
            >
              View
            </button>
          </div>

          <p className="text-[11px] text-[#3d4947] leading-tight">
            A supervising licensed pharmacist will verify this Rx prior to packaging & dispatch.
          </p>
        </section>

        {/* Delivery Address Card */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#00685f]" />
              <h3 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
                Delivery Address
              </h3>
            </div>
            <button className="text-xs text-[#00685f] font-semibold hover:underline">
              Change
            </button>
          </div>

          <div className="text-xs text-[#3d4947] space-y-0.5">
            <p className="font-bold text-[#0b1c30]">Eleanor Vance (Home)</p>
            <p>742 Evergreen Terrace, Springfield, OR 97477</p>
            <p className="text-[11px] text-[#00685f] font-medium pt-1 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Temperature-controlled courier dispatch arrives in ~25-45 mins
            </p>
          </div>
        </section>

        {/* Payment Options */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-2.5">
          <h3 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
            Payment Method
          </h3>

          <div className="space-y-2">
            {[
              { id: 'apple_pay', title: 'Apple Pay / Google Pay', subtitle: 'Instant 1-tap checkout' },
              { id: 'card', title: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, Amex' },
              { id: 'fsa', title: 'HSA / FSA Healthcare Card', subtitle: 'Tax-exempt prescription benefit' }
            ].map((method) => (
              <div 
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === method.id 
                    ? 'border-[#00685f] bg-[#eff4ff] ring-1 ring-[#00685f]' 
                    : 'border-[#bcc9c6] hover:bg-slate-50'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] block">{method.title}</span>
                  <span className="text-[10px] text-[#3d4947]">{method.subtitle}</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === method.id ? 'border-[#00685f] bg-[#00685f]' : 'border-slate-300'
                }`}>
                  {paymentMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transparent Price Breakdown */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
            Transparent Price Breakdown
          </h3>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[#3d4947]">
              <span>Brand Reference MRP ({defaultItem?.medicine?.brandReference || 'Lipitor®'})</span>
              <span className="line-through">${brandRefPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#0b1c30]">
              <span>Generic Medicine Price ({quantity} packs)</span>
              <span className="font-semibold">${itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#3d4947]">
              <span>Cold-Chain Packaging & Seal</span>
              <span>${packagingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#006948]">
              <span>Delivery Fee (Partner Promo)</span>
              <span className="font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-[#006948] font-semibold pt-1 border-t border-[#bcc9c6]/40">
              <span>Platform Savings</span>
              <span>-${totalSavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#0b1c30] text-sm font-bold pt-1.5 border-t border-[#bcc9c6]">
              <span>Total Payable</span>
              <span className="text-base text-[#00685f]">${total.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Action */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#bcc9c6] shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3 space-y-2">
          <button
            onClick={handleCheckout}
            disabled={isPlacingOrder}
            className="w-full h-11 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-md disabled:opacity-75"
          >
            {isPlacingOrder ? (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" /> Authorizing Payment & Dispatch...
              </span>
            ) : (
              <span>Pay ${total.toFixed(2)} & Authorize Dispensing</span>
            )}
          </button>

          <p className="text-[10px] text-[#3d4947] text-center">
            Zero surprise markups. If prescription is modified or rejected, 100% immediate refund.
          </p>
        </div>
      </footer>
    </div>
  );
};
