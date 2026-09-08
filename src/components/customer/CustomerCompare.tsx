import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  ShoppingBag, 
  ShieldCheck, 
  Star, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Info, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  Award,
  Calculator,
  Activity,
  LineChart as LineChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Medicine, MedicineOffer } from '../../types';
import { BioequivalenceModal } from './BioequivalenceModal';

interface CustomerCompareProps {
  medicine: Medicine;
  onBack: () => void;
  onAddToCartAndCheckout: (offer: MedicineOffer, strength: string, packSize: number) => void;
  onNavigateToCart: () => void;
  cartCount: number;
}

export const CustomerCompare: React.FC<CustomerCompareProps> = ({
  medicine,
  onBack,
  onAddToCartAndCheckout,
  onNavigateToCart,
  cartCount
}) => {
  const [selectedStrength, setSelectedStrength] = useState(medicine.dosageStrengths[1] || medicine.dosageStrengths[0] || '20mg');
  const [selectedPackSize, setSelectedPackSize] = useState(medicine.packSizes[0] || 10);
  const [sortOption, setSortOption] = useState<'price' | 'delivery' | 'rating' | 'freeDelivery'>('price');
  const [selectedOfferId, setSelectedOfferId] = useState<string>(medicine.offers[0]?.id || '');
  const [copiedToast, setCopiedToast] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [savingsDuration, setSavingsDuration] = useState<'30' | '90' | '365'>('30');

  // Sorting
  const sortedOffers = [...medicine.offers].sort((a, b) => {
    if (sortOption === 'price') return a.price - b.price;
    if (sortOption === 'delivery') return a.deliveryEta.localeCompare(b.deliveryEta);
    if (sortOption === 'rating') return b.rating - a.rating;
    if (sortOption === 'freeDelivery') return a.shippingFee - b.shippingFee;
    return 0;
  });

  const activeSelectedOffer = medicine.offers.find(o => o.id === selectedOfferId) || medicine.offers[0];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Calculate duration savings
  const monthlySavings = medicine.brandPrice - activeSelectedOffer.price;
  const durationMultiplier = savingsDuration === '30' ? 1 : savingsDuration === '90' ? 3 : 12;
  const totalDurationSavings = (monthlySavings * durationMultiplier).toFixed(2);
  const totalGenericCost = (activeSelectedOffer.price * durationMultiplier).toFixed(2);
  const totalBrandCost = (medicine.brandPrice * durationMultiplier).toFixed(2);

  // 6-Month Historical Price Trend Data
  const priceHistoryData = useMemo(() => {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const brandBase = medicine.brandPrice;
    const genericCurrent = activeSelectedOffer.price;

    // Generic competition trend over past 6 months
    const genericMultipliers = [1.38, 1.29, 1.21, 1.14, 1.06, 1.00];
    const brandMultipliers = [0.98, 0.98, 0.99, 1.00, 1.01, 1.00];

    return months.map((month, idx) => {
      const genericPrice = Number((genericCurrent * genericMultipliers[idx]).toFixed(2));
      const brandPrice = Number((brandBase * brandMultipliers[idx]).toFixed(2));
      const savings = Number((brandPrice - genericPrice).toFixed(2));
      return {
        month,
        genericPrice,
        brandPrice,
        savings,
      };
    });
  }, [medicine.brandPrice, activeSelectedOffer.price]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff] text-[#0b1c30] pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#f8f9ff] border-b border-[#bcc9c6]/40 shadow-sm">
        <div className="flex justify-between items-center max-w-md mx-auto px-4 h-12">
          <button 
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-[#dce9ff] text-[#0b1c30] transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base font-bold text-[#0b1c30]">Compare Offers</h1>

          <div className="flex items-center space-x-1">
            <button 
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-[#dce9ff] text-[#00685f] transition-colors relative"
              title="Share offer"
            >
              <Share2 className="w-4 h-4" />
              {copiedToast && (
                <span className="absolute -bottom-7 right-0 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
            <button 
              onClick={onNavigateToCart}
              className="p-1.5 rounded-full hover:bg-[#dce9ff] text-[#00685f] transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[9px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full px-4 pt-3 space-y-4">
        {/* Canonical Medicine Header */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold text-[#0b1c30]">{medicine.genericName}</h2>
                <span className="px-1.5 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] text-[10px] font-bold">
                  {selectedStrength}
                </span>
              </div>
              <p className="text-xs text-[#3d4947] mt-0.5">
                Equivalent to <span className="font-semibold text-[#0b1c30]">{medicine.brandReference}</span> (USP Verified)
              </p>
            </div>
            <span className="px-2 py-1 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold uppercase tracking-wider">
              Rx Required
            </span>
          </div>

          <div className="bg-[#eff4ff] rounded-lg p-2.5 flex items-start justify-between space-x-2 text-xs text-[#3d4947] border border-[#bcc9c6]/40">
            <div className="flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#00685f] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#0b1c30]">FDA Code: {medicine.fdaCode} • Bioequivalent</p>
                <p className="text-[11px] text-[#3d4947]">
                  Therapeutically interchangeable with brand reference in dosage form, strength, and clinical efficacy.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsBioModalOpen(true)}
              className="px-2 py-1 bg-white border border-[#00685f] text-[#00685f] hover:bg-[#00685f] hover:text-white rounded text-[10px] font-bold whitespace-nowrap transition-all shadow-xs"
            >
              Inspect Proof
            </button>
          </div>

          {/* Chronic Care Savings Calculator */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Chronic Care Savings Calculator</span>
              </span>
              <span className="text-[10px] text-[#006948] font-bold">
                Save ${totalDurationSavings}
              </span>
            </div>

            {/* Duration Selector */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '30', label: '30-Day Refill' },
                { id: '90', label: '90-Day Supply' },
                { id: '365', label: '1-Year Annual' },
              ].map((dur) => (
                <button
                  key={dur.id}
                  onClick={() => setSavingsDuration(dur.id as any)}
                  className={`py-1 px-1.5 rounded text-[10px] font-semibold border transition-all ${
                    savingsDuration === dur.id
                      ? 'bg-[#00685f] text-white border-[#00685f]'
                      : 'bg-white text-[#3d4947] border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-[10px] pt-1 text-slate-600 border-t border-slate-200/60 font-mono">
              <span>Brand Cost: <s className="text-red-700">${totalBrandCost}</s></span>
              <span className="text-[#00685f] font-bold">Generic Cost: ${totalGenericCost}</span>
            </div>
          </div>

          {/* 6-Month Price History Trend Visual Chart (Recharts) */}
          <div className="bg-white border border-[#bcc9c6] rounded-xl p-3 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <LineChartIcon className="w-3.5 h-3.5 text-[#00685f]" />
                <span className="text-xs font-bold text-[#0b1c30]">6-Month Price Trend & Savings</span>
              </div>
              <span className="text-[10px] font-semibold text-[#006948] bg-[#f4fffc] border border-[#85f8c4] px-2 py-0.5 rounded-full">
                Generic price fell ~28%
              </span>
            </div>

            <p className="text-[11px] text-[#3d4947]">
              Compare historical monthly pricing for {medicine.name} vs. {medicine.brandReference} to observe cumulative consumer savings.
            </p>

            {/* Visual Chart using Recharts */}
            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistoryData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="genericFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00685f" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00685f" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="brandFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const generic = payload.find(p => p.dataKey === 'genericPrice')?.value;
                        const brand = payload.find(p => p.dataKey === 'brandPrice')?.value;
                        const diff = (Number(brand) - Number(generic)).toFixed(2);
                        return (
                          <div className="bg-[#0b1c30] text-white p-2 rounded-lg shadow-xl text-[11px] border border-slate-700 space-y-1">
                            <span className="font-bold text-slate-300 block font-mono">{label} 2026</span>
                            <div className="flex justify-between gap-3 text-emerald-400 font-semibold">
                              <span>Generic Price:</span>
                              <span>${generic}</span>
                            </div>
                            <div className="flex justify-between gap-3 text-slate-300">
                              <span>{medicine.brandReference}:</span>
                              <span className="line-through">${brand}</span>
                            </div>
                            <div className="pt-1 border-t border-slate-700 flex justify-between gap-3 text-[#89f5e7] font-bold">
                              <span>Patient Saved:</span>
                              <span>+${diff}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={24}
                    formatter={(value) => (
                      <span className="text-[10px] font-semibold text-slate-700">
                        {value === 'genericPrice' ? `Generic Market Floor ($${activeSelectedOffer.price.toFixed(2)})` : `${medicine.brandReference} Reference ($${medicine.brandPrice.toFixed(2)})`}
                      </span>
                    )}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="brandPrice" 
                    stroke="#94a3b8" 
                    strokeDasharray="4 3" 
                    strokeWidth={1.5}
                    fill="url(#brandFill)"
                    name="brandPrice"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="genericPrice" 
                    stroke="#00685f" 
                    strokeWidth={2.5}
                    fill="url(#genericFill)"
                    name="genericPrice"
                    activeDot={{ r: 4, fill: '#00685f', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Savings Insight Metrics */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono">
              <div className="bg-slate-50 border border-slate-200/80 rounded p-1.5">
                <span className="text-[9px] text-slate-500 uppercase block">Apr 2026 Generic</span>
                <span className="text-xs font-bold text-slate-700">${(activeSelectedOffer.price * 1.38).toFixed(2)}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded p-1.5">
                <span className="text-[9px] text-slate-500 uppercase block">Current Price</span>
                <span className="text-xs font-bold text-[#00685f]">${activeSelectedOffer.price.toFixed(2)}</span>
              </div>
              <div className="bg-[#f4fffc] border border-[#85f8c4] rounded p-1.5">
                <span className="text-[9px] text-[#006948] uppercase block">Current Savings</span>
                <span className="text-xs font-bold text-[#006948]">${(medicine.brandPrice - activeSelectedOffer.price).toFixed(2)}/mo</span>
              </div>
            </div>
          </div>

          {/* Dosage Strength Selector */}
          <div>
            <span className="text-[11px] font-bold text-[#3d4947] uppercase tracking-wider block mb-1.5">
              Select Strength:
            </span>
            <div className="flex gap-2">
              {medicine.dosageStrengths.map((str) => (
                <button
                  key={str}
                  onClick={() => setSelectedStrength(str)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    selectedStrength === str
                      ? 'bg-[#00685f] text-white border-[#00685f] shadow-xs'
                      : 'bg-white text-[#0b1c30] border-[#bcc9c6] hover:bg-[#eff4ff]'
                  }`}
                >
                  {str}
                </button>
              ))}
            </div>
          </div>

          {/* Pack Size Selector */}
          <div>
            <span className="text-[11px] font-bold text-[#3d4947] uppercase tracking-wider block mb-1.5">
              Pack Size:
            </span>
            <div className="flex gap-2">
              {medicine.packSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedPackSize(size)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    selectedPackSize === size
                      ? 'bg-[#dae2fd] text-[#131b2e] border-[#565e74] shadow-xs'
                      : 'bg-white text-[#0b1c30] border-[#bcc9c6] hover:bg-[#eff4ff]'
                  }`}
                >
                  {size} Tablets
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Live Revalidation Status Strip */}
        <section className="bg-white border border-[#bcc9c6] rounded-lg p-2.5 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
            <span className="font-semibold text-[#0b1c30]">
              {medicine.offers.length} Verified Local Sellers
            </span>
          </div>
          <span className="text-[10px] text-[#3d4947]">Revalidated 2m ago</span>
        </section>

        {/* Filter & Sort Chips */}
        <section className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          {[
            { id: 'price', label: 'Lowest Price' },
            { id: 'delivery', label: 'Fastest Delivery' },
            { id: 'rating', label: 'Top Rated' },
            { id: 'freeDelivery', label: 'Free Delivery' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSortOption(chip.id as any)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium border transition-all ${
                sortOption === chip.id
                  ? 'bg-[#00685f] text-white border-[#00685f] shadow-xs'
                  : 'bg-white text-[#3d4947] border-[#bcc9c6] hover:bg-[#eff4ff]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </section>

        {/* Ranked Offers Feed */}
        <section className="space-y-3">
          {sortedOffers.map((offer, index) => {
            const isSelected = selectedOfferId === offer.id;
            const savings = offer.savingsVsBrand || (medicine.brandPrice - offer.price);

            return (
              <div
                key={offer.id}
                onClick={() => setSelectedOfferId(offer.id)}
                className={`bg-white rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#00685f] ring-2 ring-[#00685f]/20 bg-gradient-to-b from-[#f4fffc] to-white'
                    : 'border-[#bcc9c6] hover:border-[#00685f]/60'
                }`}
              >
                {/* Best Offer / Rank Badge */}
                {offer.badge && (
                  <div className="absolute -top-2.5 left-3 px-2 py-0.5 bg-[#85f8c4] text-[#002114] text-[9px] font-extrabold rounded-full tracking-wider uppercase flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-2.5 h-2.5" />
                    {offer.badge}
                  </div>
                )}

                <div className="flex justify-between items-start pt-1">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm font-bold text-[#0b1c30]">{offer.pharmacyName}</h3>
                      {offer.isLicensedPartner && (
                        <ShieldCheck className="w-4 h-4 text-[#00685f]" title="Licensed Partner Pharmacy" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5 text-xs text-[#3d4947]">
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                        {offer.rating}
                      </span>
                      <span>({offer.reviewCount} reviews)</span>
                      <span className="text-[#bcc9c6]">•</span>
                      <span className="text-[10px] text-[#006948] font-semibold">
                        {offer.lastStockCheck}
                      </span>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#00685f] leading-none block">
                      ${offer.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#3d4947]">
                      ${offer.unitPrice.toFixed(2)} / tab
                    </span>
                  </div>
                </div>

                {/* Delivery & Stock Info */}
                <div className="mt-3 pt-2.5 border-t border-[#bcc9c6]/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-[#3d4947]">
                    <Truck className="w-3.5 h-3.5 text-[#00685f]" />
                    <span>{offer.deliveryEta}</span>
                    <span className="text-[#bcc9c6]">•</span>
                    <span className="font-medium text-[#0b1c30]">
                      {offer.shippingFee === 0 ? 'FREE' : `$${offer.shippingFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-[#006948] font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock</span>
                  </div>
                </div>

                {/* Savings Callout */}
                <div className="mt-2.5 bg-[#eff4ff] rounded-md px-2.5 py-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-[#3d4947]">
                    Brand reference {medicine.brandReference} is ${medicine.brandPrice.toFixed(2)}
                  </span>
                  <span className="text-[#006948] font-bold flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    Save ${savings.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Transparency & Unit Economics Guarantee Box */}
        <section className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-xs space-y-2">
          <div className="flex items-center space-x-1.5 text-[#00685f]">
            <Award className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
              Our Unit Economics & Quality Guarantee
            </h3>
          </div>
          <p className="text-xs text-[#3d4947] leading-relaxed">
            Zero hidden pharmacy markups or secret broker kickbacks. We connect patients directly to state-licensed dispensing chemists with verifiable FDA Orange Book therapeutic bioequivalence. Every cold-sensitive drug includes tamper-evident cold-chain dispatch.
          </p>
        </section>
      </main>

      {/* Sticky Bottom Purchase Tray */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#bcc9c6] shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#3d4947] block font-medium">Selected Offer:</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-bold text-[#00685f]">
                ${activeSelectedOffer.price.toFixed(2)}
              </span>
              <span className="text-[11px] text-[#3d4947] line-clamp-1 max-w-[130px]">
                from {activeSelectedOffer.pharmacyName}
              </span>
            </div>
          </div>

          <button
            onClick={() => onAddToCartAndCheckout(activeSelectedOffer, selectedStrength, selectedPackSize)}
            className="h-11 px-5 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-xs font-bold flex items-center space-x-2 active:scale-95 transition-all shadow-md"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* FDA Bioequivalence Clinical Monograph Modal */}
      <BioequivalenceModal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        medicine={medicine}
      />
    </div>
  );
};
