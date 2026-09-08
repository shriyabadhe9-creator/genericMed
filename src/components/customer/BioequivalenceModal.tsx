import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Award, Info, Activity, AlertCircle } from 'lucide-react';
import { Medicine } from '../../types';

interface BioequivalenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine;
}

export const BioequivalenceModal: React.FC<BioequivalenceModalProps> = ({
  isOpen,
  onClose,
  medicine,
}) => {
  const [activeTab, setActiveTab] = useState<'curve' | 'excipients' | 'regulations'>('curve');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full my-auto overflow-hidden shadow-2xl border border-[#bcc9c6] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0b1c30] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">
                FDA Bioequivalence &amp; Clinical Monograph
              </h2>
              <span className="text-[10px] text-[#89f5e7] font-mono">
                {medicine.genericName} vs {medicine.brandReference}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('curve')}
            className={`pb-2 px-2 border-b-2 transition-colors ${
              activeTab === 'curve' ? 'border-[#00685f] text-[#00685f]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Absorption &amp; Blood Levels
          </button>
          <button
            onClick={() => setActiveTab('excipients')}
            className={`pb-2 px-2 border-b-2 transition-colors ${
              activeTab === 'excipients' ? 'border-[#00685f] text-[#00685f]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active vs Inactive Ingredients
          </button>
          <button
            onClick={() => setActiveTab('regulations')}
            className={`pb-2 px-2 border-b-2 transition-colors ${
              activeTab === 'regulations' ? 'border-[#00685f] text-[#00685f]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            FDA AB Rating Standard
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
          {activeTab === 'curve' && (
            <div className="space-y-3">
              <p className="text-[#3d4947] leading-relaxed">
                By FDA law, an approved generic drug must achieve the exact same blood plasma concentration curve (AUC and Cmax) within a strict 80%–125% 90% confidence statistical interval.
              </p>

              {/* Graphic Chart representation */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#00685f] font-bold">--- Generic {medicine.genericName}</span>
                  <span className="text-slate-600 font-bold">--- Brand {medicine.brandReference}</span>
                </div>

                <div className="h-32 bg-white rounded-lg border border-slate-200 relative overflow-hidden flex items-end px-4 pb-2">
                  {/* SVG Curves */}
                  <svg className="w-full h-full" viewBox="0 0 300 100" fill="none">
                    {/* Brand Curve */}
                    <path
                      d="M 10 90 Q 60 10 120 40 T 290 85"
                      stroke="#475569"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      fill="none"
                    />
                    {/* Generic Curve */}
                    <path
                      d="M 10 90 Q 58 12 122 39 T 290 86"
                      stroke="#00685f"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    {/* Peak Marker */}
                    <circle cx="60" cy="11" r="3" fill="#00685f" />
                    <text x="68" y="16" fill="#00685f" fontSize="8" fontWeight="bold">Cmax Parity</text>
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                  <span>0 hrs (Ingestion)</span>
                  <span>2 hrs (Peak Blood Concentration)</span>
                  <span>24 hrs (Clearance)</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#f4fffc] border border-[#85f8c4] rounded-lg text-xs space-y-1">
                <strong className="text-[#006948] block">Bioequivalence Ratio: 99.4% Match</strong>
                <p className="text-[#3d4947] text-[11px]">
                  Clinical human pharmacokinetic trials confirmed identical bioavailability and therapeutic lipid-lowering efficacy.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'excipients' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-[#0b1c30]">Active Pharmaceutical Ingredient (API)</h4>
                <div className="flex justify-between text-[11px] pb-1 border-b border-slate-200">
                  <span className="text-slate-600">Chemical Substance</span>
                  <strong className="text-[#00685f]">{medicine.activeIngredient}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Molecular Formula Parity</span>
                  <strong className="text-slate-800">100% Identical Chemical Structure</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-[#0b1c30]">Inactive Ingredients (Binders &amp; Excipients)</h4>
                <p className="text-[11px] text-[#3d4947]">
                  Inactive ingredients (such as microcrystalline cellulose, lactose monohydrate, and magnesium stearate) give the tablet its shape and stability. They do not alter the drug's therapeutic effect.
                </p>
                <div className="flex items-center space-x-1.5 text-emerald-700 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tested allergen-free, USP-NF Grade Non-Toxic Ingredients</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'regulations' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#eff4ff] border border-[#bcc9c6] rounded-xl space-y-1.5">
                <span className="text-[10px] bg-[#dae2fd] text-[#131b2e] px-2 py-0.5 rounded font-bold">
                  FDA Orange Book Rating: Code AB
                </span>
                <p className="text-[11px] text-[#3d4947] leading-relaxed">
                  "Products meeting necessary bioequivalence requirements." Code AB signifies that actual or potential bioequivalence problems have been resolved with adequate in vivo and in vitro evidence supporting therapeutic equivalence.
                </p>
              </div>

              <ul className="space-y-2 text-[11px] text-[#3d4947]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006948] flex-shrink-0 mt-0.5" />
                  <span>Manufactured under current Good Manufacturing Practices (cGMP) mandated by 21 CFR Part 211.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006948] flex-shrink-0 mt-0.5" />
                  <span>Batch-level testing ensures dissolution uniformity and potency stability across its entire shelf life.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            Got It, Back to Offers
          </button>
        </div>
      </div>
    </div>
  );
};
