import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Stethoscope, 
  Pill, 
  Check, 
  ExternalLink,
  QrCode,
  Lock,
  ArrowRight
} from 'lucide-react';

interface PrescriptionVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const PrescriptionVerificationModal: React.FC<PrescriptionVerificationModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  const [chk1, setChk1] = useState(true);
  const [chk2, setChk2] = useState(true);
  const [chk3, setChk3] = useState(false);
  const [approving, setApproving] = useState(false);

  if (!isOpen) return null;

  const allChecked = chk1 && chk2 && chk3;

  const handleApprove = () => {
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      onApprove();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl border border-slate-300 flex flex-col max-h-[92vh]">
        {/* Top Clinical Header Ribbon */}
        <div className="bg-[#0b1c30] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#213145]">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center font-bold text-sm">
              Rx
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Prescription Clinical Verification & Safety Review
                </h2>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold">
                  Order #GM-89248
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Supervising Pharmacist Console • 21 CFR § 1306 e-Prescribing Mandate
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Patient & Prescriber Strip */}
        <div className="bg-[#eff4ff] border-b border-[#bcc9c6] px-5 py-2.5 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-[#00685f]" />
            <div>
              <span className="text-[#3d4947]">Patient: </span>
              <strong className="text-[#0b1c30]">Eleanor Vance</strong> (58 Yrs, Female) •{' '}
              <span className="text-[#006948] font-bold">Allergies: NKDA</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-[#00685f]" />
            <div>
              <span className="text-[#3d4947]">Prescriber: </span>
              <strong className="text-[#0b1c30]">Dr. Robert H. Smith, MD</strong> (NPI: 1487920194 • DEA: BS9842103)
            </div>
          </div>
        </div>

        {/* Two-Pane Body Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#bcc9c6] overflow-y-auto flex-1 p-4 sm:p-5 gap-5">
          {/* Left Pane: Original Prescription Document */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b1c30] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#00685f]" />
                Original Electronic Script Scan
              </span>
              <span className="text-[10px] bg-[#85f8c4] text-[#002114] px-2 py-0.5 rounded font-bold">
                OCR Confidence: 99.8%
              </span>
            </div>

            {/* Document Simulation Box */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4 text-xs space-y-3 font-serif shadow-inner">
              <div className="border-b border-slate-300 pb-2 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">METRO HEALTH MEDICAL CENTER</h4>
                  <p className="text-[10px] text-slate-600">Department of Internal Medicine • 500 5th Ave, NY</p>
                </div>
                <span className="text-[9px] font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                  eRx-2026-98112-MH
                </span>
              </div>

              <div className="space-y-1 text-slate-700 text-[11px]">
                <p><strong>Patient:</strong> Eleanor Vance • DOB: 04/12/1968</p>
                <p><strong>Address:</strong> 742 Evergreen Terrace, Springfield, OR</p>
                <p><strong>Date Written:</strong> September 04, 2026</p>
              </div>

              <div className="bg-white border border-slate-300 rounded p-2.5 font-sans space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Rx: Metformin Hydrochloride ER 500mg</span>
                  <span>Qty: #60</span>
                </div>
                <p className="text-xs text-slate-700 italic">
                  Sig: Take 1 tablet orally twice daily with meals (Morning and Evening).
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Generic substitution permitted: YES (Therapeutic Equivalent Permitted)
                </p>
                <p className="text-[10px] text-slate-500">Refills: 2 (Two)</p>
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-500">Surescripts Digitally Signed</p>
                  <p className="font-mono text-[9px] text-slate-400">SHA-256: 8a4c9...e92f1</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">Dr. Robert H. Smith, MD</span>
                  <span className="text-[10px] text-slate-500">State Medical Board License: MD-92104</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#f4fffc] border border-[#85f8c4] rounded-lg text-xs space-y-1">
              <span className="font-bold text-[#006948] block">Automated Parsing Engine Result:</span>
              <p className="text-[#3d4947] text-[11px]">
                Mapped molecule: <strong className="text-[#0b1c30]">Metformin HCl ER (500mg)</strong> • Matches selected inventory item exactly (100% molecular equivalence).
              </p>
            </div>
          </div>

          {/* Right Pane: Clinical Safety, Monograph & Verification Checklist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0b1c30] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00685f]" />
                Clinical Monograph & Safety Checks
              </span>
              <span className="text-[10px] bg-[#dce9ff] text-[#00685f] px-2 py-0.5 rounded font-bold">
                FDA Orange Book AB
              </span>
            </div>

            {/* Clinical Checks Bento */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#006948] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0b1c30] block">Bioequivalence Verification</strong>
                  <span className="text-[#3d4947] text-[11px]">
                    Generic Metformin ER 500mg meets USP Dissolution Test 2. Rated AB therapeutically interchangeable with Glucophage® XR.
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#006948] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0b1c30] block">Renal & Organ Function Clearance</strong>
                  <span className="text-[#3d4947] text-[11px]">
                    Latest recorded eGFR: 68 mL/min/1.73m² (Normal renal clearance for Metformin therapy; contraindication threshold &lt;30).
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#006948] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0b1c30] block">Drug-Drug Interactions (DDI)</strong>
                  <span className="text-[#3d4947] text-[11px]">
                    Cross-referenced against patient's Atorvastatin 20mg order. No adverse pharmacokinetic competition or CYP3A4 conflicts.
                  </span>
                </div>
              </div>
            </div>

            {/* Bay Inventory Allocation */}
            <div className="bg-[#eff4ff] border border-[#bcc9c6] rounded-lg p-2.5 text-xs flex justify-between items-center">
              <div>
                <span className="text-[#3d4947] block text-[10px]">Allocated Batch:</span>
                <span className="font-mono font-bold text-[#0b1c30]">#MET-2026-X04 (Exp: 11/2027)</span>
              </div>
              <div className="text-right">
                <span className="text-[#3d4947] block text-[10px]">Shelf Location:</span>
                <span className="font-bold text-[#00685f]">Bay 2A • 420 in Stock</span>
              </div>
            </div>

            {/* Mandatory Pharmacist Checklist */}
            <div className="space-y-2 pt-1 border-t border-slate-200">
              <span className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider block">
                Supervising Pharmacist Attestation:
              </span>

              <label className="flex items-start space-x-2 text-xs cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={chk1} 
                  onChange={(e) => setChk1(e.target.checked)}
                  className="mt-0.5 text-[#00685f] rounded" 
                />
                <span className="text-[#3d4947]">
                  I confirm the active chemical moiety, strength, and dosage form match the valid electronic prescription.
                </span>
              </label>

              <label className="flex items-start space-x-2 text-xs cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={chk2} 
                  onChange={(e) => setChk2(e.target.checked)}
                  className="mt-0.5 text-[#00685f] rounded" 
                />
                <span className="text-[#3d4947]">
                  I have evaluated patient history, renal function guidelines, and contraindications.
                </span>
              </label>

              <label className="flex items-start space-x-2 text-xs cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={chk3} 
                  onChange={(e) => setChk3(e.target.checked)}
                  className="mt-0.5 text-[#00685f] rounded" 
                />
                <span className="text-[#0b1c30] font-semibold">
                  I authorize dispensing from Hub #4 inventory and attach my digital license signature.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-[#3d4947]">
            <Lock className="w-3.5 h-3.5 text-[#00685f]" />
            <span>Digital Certificate: <strong>Dr. Arthur Pendelton, RPh (#8491)</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onReject}
              className="px-3.5 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
            >
              Reject / Request Clarification
            </button>

            <button
              onClick={handleApprove}
              disabled={!allChecked || approving}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
                allChecked && !approving
                  ? 'bg-[#00685f] hover:bg-[#008378] text-white active:scale-95'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {approving ? (
                <span>Signing & Dispatching...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Approve & Send to Packing Bay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
