import React, { useState } from 'react';
import { 
  X, 
  AlertOctagon, 
  Send, 
  RefreshCcw, 
  Ban, 
  FileWarning, 
  ShieldAlert, 
  CheckSquare, 
  MessageSquare, 
  Lock 
} from 'lucide-react';

interface ClinicalExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitException: (details: {
    category: string;
    routing: string;
    justification: string;
  }) => void;
}

export const ClinicalExceptionModal: React.FC<ClinicalExceptionModalProps> = ({
  isOpen,
  onClose,
  onSubmitException,
}) => {
  const [category, setCategory] = useState<'contraindication' | 'regulatory' | 'ambiguity'>('contraindication');
  const [routing, setRouting] = useState<'clarify' | 'hard_reject' | 'adapt'>('clarify');
  const [justification, setJustification] = useState('Renal clearance threshold verification required prior to high-dose titration. Confirm baseline serum creatinine level with prescriber office.');
  const [attest, setAttest] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmitException({ category, routing, justification });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl border border-red-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#ba1a1a] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <AlertOctagon className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Clinical Exception & Rejection Protocol
              </h2>
              <span className="text-xs text-red-100">
                Order #GM-89248 • Patient: Eleanor Vance • Metformin 500mg
              </span>
            </div>
          </div>

          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Identified Exception Category */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#0b1c30] uppercase tracking-wider block">
              1. Identified Exception Category:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'contraindication', title: 'Clinical Contraindication', desc: 'Renal, hepatic, DDI or allergy flag' },
                { id: 'regulatory', title: 'Regulatory / Script Defect', desc: 'Missing DEA/NPI, expired, tamper' },
                { id: 'ambiguity', title: 'Prescription Ambiguity', desc: 'Conflicting sig, unavailable salt' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setCategory(item.id as any)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    category === item.id 
                      ? 'border-red-600 bg-red-50 ring-1 ring-red-500' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <strong className="block text-[#0b1c30] text-xs">{item.title}</strong>
                  <span className="text-[10px] text-slate-500">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Routing */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#0b1c30] uppercase tracking-wider block">
              2. Resolution Routing Protocol:
            </label>
            <div className="space-y-2">
              <label className={`p-3 rounded-lg border flex items-start space-x-2.5 cursor-pointer ${
                routing === 'clarify' ? 'border-[#00685f] bg-[#f4fffc]' : 'border-slate-200'
              }`}>
                <input 
                  type="radio" 
                  name="routing" 
                  checked={routing === 'clarify'} 
                  onChange={() => setRouting('clarify')} 
                  className="mt-0.5" 
                />
                <div>
                  <strong className="text-[#0b1c30] text-xs block">Request Clarification from Prescriber (4-hour SLA)</strong>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Order is placed in a clinical hold state. Dispatches a priority inquiry to Dr. Robert H. Smith via Surescripts Direct clinical portal.
                  </p>
                </div>
              </label>

              <label className={`p-3 rounded-lg border flex items-start space-x-2.5 cursor-pointer ${
                routing === 'hard_reject' ? 'border-red-600 bg-red-50' : 'border-slate-200'
              }`}>
                <input 
                  type="radio" 
                  name="routing" 
                  checked={routing === 'hard_reject'} 
                  onChange={() => setRouting('hard_reject')} 
                  className="mt-0.5" 
                />
                <div>
                  <strong className="text-red-700 text-xs block">Hard Clinical Rejection & Patient Refund</strong>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Order is permanently canceled. Returns inventory to shelf and issues immediate 100% financial refund to patient's payment method.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Clinical Justification Textarea */}
          <div className="space-y-1">
            <label className="font-bold text-[#0b1c30] uppercase tracking-wider block">
              3. Pharmacist Clinical Justification (Permanent Legal Audit Record):
            </label>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-[#0b1c30] focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
              placeholder="Provide exact clinical reasoning..."
              required
            />
          </div>

          {/* Patient Transparency Notice Preview */}
          <div className="p-3 bg-[#eff4ff] border border-[#bcc9c6] rounded-lg space-y-1">
            <div className="flex items-center space-x-1.5 text-[#00685f] font-bold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Automated Patient Notification Preview:</span>
            </div>
            <p className="text-[11px] text-slate-700 italic">
              "genericMed Clinical Alert: Your prescription order for Metformin ER requires safety verification with Dr. Smith. Your payment is safely held and zero charges will settle until cleared by our supervising pharmacist."
            </p>
          </div>

          {/* Attestation */}
          <label className="flex items-start space-x-2 pt-1 cursor-pointer">
            <input 
              type="checkbox" 
              checked={attest} 
              onChange={(e) => setAttest(e.target.checked)} 
              className="mt-0.5" 
              required
            />
            <span className="text-[11px] text-slate-700">
              I certify under penalty of pharmacy board revocation that this clinical rejection complies with State Dispensing Protocols and National Patient Safety Standards.
            </span>
          </label>

          {/* Buttons */}
          <div className="pt-2 flex justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!attest || submitting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting Exception...' : 'Submit Clinical Exception & Dispatch Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
