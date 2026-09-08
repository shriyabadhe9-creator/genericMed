import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  ShoppingBag, 
  Search, 
  Mic, 
  ShieldCheck, 
  FileText, 
  Camera, 
  Upload, 
  Bookmark, 
  TrendingDown, 
  Store, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  Droplet,
  HeartPulse,
  Pill,
  Bandage,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { MEDICINES } from '../../data/mockData';
import { Medicine } from '../../types';

interface CustomerDiscoveryProps {
  onSelectMedicine: (medicine: Medicine) => void;
  onNavigateToCart: () => void;
  cartCount: number;
  onOpenRxUpload: () => void;
}

export const CustomerDiscovery: React.FC<CustomerDiscoveryProps> = ({
  onSelectMedicine,
  onNavigateToCart,
  cartCount,
  onOpenRxUpload
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedItem, setSavedItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredMedicines = MEDICINES.filter(med => 
    med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.brandReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredMed = MEDICINES[0]; // Atorvastatin

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff] text-[#0b1c30] pb-24">
      {/* Top Navigation Shell (Responsive Mobile Docked) */}
      <header className="sticky top-0 z-40 bg-[#f8f9ff] shadow-sm border-b border-[#bcc9c6]/40">
        <div className="flex justify-between items-center w-full px-4 h-12 max-w-md mx-auto">
          {/* Location Picker */}
          <div className="flex items-center space-x-2">
            <MapPin className="text-[#00685f] w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#3d4947] leading-none">Deliver to:</span>
              <button className="flex items-center space-x-1 text-left active:scale-95 transition-transform duration-150">
                <span className="text-xs font-semibold text-[#0b1c30]">10001 New York</span>
                <ChevronDown className="text-[#00685f] w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Center Brand genericMed */}
          <span className="text-lg font-bold text-[#00685f] tracking-tight">genericMed</span>

          {/* Cart Icon */}
          <div className="flex items-center">
            <button 
              onClick={onNavigateToCart}
              aria-label="Cart" 
              className="relative p-1.5 rounded-full hover:bg-[#dce9ff] transition-colors active:scale-95 duration-150"
            >
              <ShoppingBag className="text-[#00685f] w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[9px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full px-4 pt-3 space-y-3.5">
        {/* Search Section with Autocomplete Pill Hints */}
        <section className="space-y-1.5">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-[#6d7a77] w-4 h-4" />
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-10 bg-white border border-[#bcc9c6] rounded-lg text-sm text-[#0b1c30] placeholder-[#3d4947] focus:outline-none focus:ring-2 focus:ring-[#00685f] focus:border-[#00685f] transition-all shadow-sm" 
              placeholder="Search generic medicine, brand, or salt..." 
              type="text"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Mic className="text-[#6d7a77] w-4 h-4 cursor-pointer hover:text-[#0b1c30]" />
            </div>
          </div>

          {/* Quick Salt Suggestion Tags */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 text-nowrap">
            <span className="text-[10px] text-[#3d4947] uppercase font-bold tracking-wider">Suggested:</span>
            {['Atorvastatin', 'Metformin', 'Amoxicillin'].map((drug) => (
              <button 
                key={drug}
                onClick={() => {
                  setSearchQuery(drug);
                  const found = MEDICINES.find(m => m.genericName.toLowerCase().includes(drug.toLowerCase()));
                  if (found) onSelectMedicine(found);
                }}
                className="px-2.5 py-1 bg-white border border-[#bcc9c6] rounded-full text-xs text-[#00685f] hover:bg-[#eff4ff] transition-colors font-medium shadow-2xs"
              >
                {drug}
              </button>
            ))}
          </div>
        </section>

        {/* Trust & Regulatory Compliance Banner */}
        <section className="bg-white border border-[#bcc9c6] rounded-lg p-2.5 shadow-sm">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-1 text-[#00685f]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00685f]" />
              <span className="font-semibold">100% Verified</span>
            </div>
            <span className="text-[#bcc9c6]">•</span>
            <div className="flex items-center space-x-1 text-[#006948]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-semibold">Live Price Delta</span>
            </div>
            <span className="text-[#bcc9c6]">•</span>
            <div className="flex items-center space-x-1 text-[#00685f]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-semibold">Equivalence SLA</span>
            </div>
          </div>
        </section>

        {/* Prescription Upload CTA Card */}
        <section className="bg-white border-2 border-dashed border-[#6bd8cb] rounded-xl p-3.5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1 pr-2">
              <div className="flex items-center space-x-1.5">
                <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
                  Rx Required
                </span>
                <span className="text-base font-semibold text-[#0b1c30]">
                  Upload Prescription
                </span>
              </div>
              <p className="text-xs text-[#3d4947] leading-relaxed">
                Instant matching to FDA-approved bioequivalent generic drugs & lowest local quotes.
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#dce9ff] flex items-center justify-center flex-shrink-0 text-[#00685f]">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex space-x-2">
            <button 
              onClick={onOpenRxUpload}
              className="flex-1 h-10 bg-[#00685f] text-white rounded-lg flex items-center justify-center space-x-1.5 text-xs font-semibold hover:bg-[#008378] active:scale-95 transition-all shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Camera Snap</span>
            </button>
            <button 
              onClick={onOpenRxUpload}
              className="flex-1 h-10 bg-[#eff4ff] text-[#00685f] border border-[#bcc9c6] rounded-lg flex items-center justify-center space-x-1.5 text-xs font-semibold hover:bg-[#dce9ff] transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </button>
          </div>
          <p className="text-[10px] text-[#3d4947] text-center mt-2">
            HIPAA Compliant & End-to-End Encrypted
          </p>
        </section>

        {/* Featured Medicine Spotlight: Price Delta Highlight */}
        <section className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0b1c30]">Featured Molecule Spotlight</h2>
            <span className="text-[10px] font-bold bg-[#85f8c4] text-[#002114] px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Save up to 88%
            </span>
          </div>

          <div className="bg-white border border-[#bcc9c6] rounded-xl p-3.5 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-[#0b1c30]">{featuredMed.genericName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-[10px] font-bold">
                    20 mg
                  </span>
                </div>
                <p className="text-xs text-[#3d4947] mt-0.5">
                  Generic for {featuredMed.brandReference} • Strip of 10 Tablets
                </p>
              </div>
              <button 
                onClick={() => setSavedItem(!savedItem)}
                className="text-[#3d4947] hover:text-[#00685f] active:scale-95 transition-transform"
                title="Save medicine"
              >
                <Bookmark className={`w-5 h-5 ${savedItem ? 'fill-[#00685f] text-[#00685f]' : ''}`} />
              </button>
            </div>

            {/* Comparative Price Spread Box */}
            <div className="mt-3 grid grid-cols-2 gap-2 p-2.5 bg-[#eff4ff] rounded-lg border border-[#bcc9c6]/60">
              <div className="border-r border-[#bcc9c6]/60 pr-2">
                <span className="text-[10px] text-[#3d4947] line-through block">Brand Lipitor®</span>
                <div className="text-base font-semibold text-[#3d4947]/80 line-through">$34.50</div>
                <span className="text-[10px] text-[#3d4947]">$3.45 / tablet</span>
              </div>
              <div className="pl-2">
                <span className="text-[10px] text-[#006948] font-bold block">Lowest Generic</span>
                <div className="text-xl font-bold text-[#006948] leading-tight">$4.20</div>
                <span className="text-[10px] text-[#006948] font-semibold">$0.42 / tablet</span>
              </div>
            </div>

            {/* Real-time Verification & Action */}
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#bcc9c6]/40">
              <div className="flex items-center space-x-1.5 text-[#3d4947]">
                <Store className="w-3.5 h-3.5 text-[#00685f]" />
                <span className="text-xs">CVS, Walgreens & 3 local</span>
              </div>
              <button 
                onClick={() => onSelectMedicine(featuredMed)}
                className="h-9 px-3 bg-[#00685f] text-white rounded-md text-xs font-semibold flex items-center space-x-1 hover:bg-[#008378] active:scale-95 transition-all shadow-sm"
              >
                <span>Compare 5 Sellers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Popular Canonical Categories & Common Chronic Conditions */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0b1c30]">Therapeutic Categories</h2>
            <button className="text-xs text-[#00685f] font-semibold hover:underline">See All</button>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center">
            {[
              { name: 'Diabetes Care', icon: Droplet },
              { name: 'Cardiac Health', icon: HeartPulse },
              { name: 'Antibiotics', icon: Pill },
              { name: 'Pain Relief', icon: Bandage },
              { name: 'Gastro', icon: Activity },
            ].map((cat, idx) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xs ${
                    isSelected ? 'bg-[#00685f] text-white ring-2 ring-[#00685f]' : 'bg-[#dce9ff] text-[#00685f] group-hover:bg-[#89f5e7]'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#0b1c30] mt-1.5 font-medium leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Comparison Cards with Real-time Freshness Tag */}
        <section className="space-y-2 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0b1c30]">Recent Live Price Checks</h2>
            <span className="text-[10px] text-[#3d4947] flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#006948] mr-1 animate-pulse"></span>
              Live Market
            </span>
          </div>

          <div className="space-y-2">
            {/* Item 1: Metformin 500mg */}
            <div className="bg-white border border-[#bcc9c6] rounded-lg p-3 shadow-sm hover:border-[#00685f] transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-bold text-[#0b1c30]">Metformin Hydrochloride</h3>
                    <span className="bg-[#dae2fd] text-[#131b2e] text-[10px] font-semibold px-1.5 py-0.2 rounded">
                      500mg
                    </span>
                  </div>
                  <p className="text-xs text-[#3d4947] mt-0.5">Generic for Glucophage® • 60 Tablets</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#00685f] block">$3.10</span>
                  <span className="text-[10px] text-[#006948] font-bold">Save 82%</span>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-[#bcc9c6]/50 flex justify-between items-center text-[10px]">
                <span className="text-[#3d4947] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#00685f]" />
                  Updated 4m ago
                </span>
                <button 
                  onClick={() => onSelectMedicine(MEDICINES[1])}
                  className="text-[#00685f] font-semibold flex items-center hover:underline"
                >
                  Compare 8 Sellers
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Item 2: Amoxicillin 875mg */}
            <div className="bg-white border border-[#bcc9c6] rounded-lg p-3 shadow-sm hover:border-[#00685f] transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-bold text-[#0b1c30]">Amoxicillin Trihydrate</h3>
                    <span className="bg-[#dae2fd] text-[#131b2e] text-[10px] font-semibold px-1.5 py-0.2 rounded">
                      875mg
                    </span>
                  </div>
                  <p className="text-xs text-[#3d4947] mt-0.5">Generic for Amoxil® • 20 Capsules</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#00685f] block">$5.80</span>
                  <span className="text-[10px] text-[#006948] font-bold">Save 74%</span>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-[#bcc9c6]/50 flex justify-between items-center text-[10px]">
                <span className="text-[#3d4947] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#00685f]" />
                  Updated 7m ago
                </span>
                <button 
                  onClick={() => onSelectMedicine(MEDICINES[2])}
                  className="text-[#00685f] font-semibold flex items-center hover:underline"
                >
                  Compare 6 Sellers
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Item 3: Omeprazole DR 20mg */}
            <div className="bg-white border border-[#bcc9c6] rounded-lg p-3 shadow-sm hover:border-[#00685f] transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-bold text-[#0b1c30]">Omeprazole DR</h3>
                    <span className="bg-[#dae2fd] text-[#131b2e] text-[10px] font-semibold px-1.5 py-0.2 rounded">
                      20mg
                    </span>
                  </div>
                  <p className="text-xs text-[#3d4947] mt-0.5">Generic for Prilosec® • 30 Capsules</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#00685f] block">$6.40</span>
                  <span className="text-[10px] text-[#006948] font-bold">Save 65%</span>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-[#bcc9c6]/50 flex justify-between items-center text-[10px]">
                <span className="text-[#3d4947] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#00685f]" />
                  Updated 12m ago
                </span>
                <button 
                  onClick={() => onSelectMedicine(MEDICINES[3])}
                  className="text-[#00685f] font-semibold flex items-center hover:underline"
                >
                  Compare 4 Sellers
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
