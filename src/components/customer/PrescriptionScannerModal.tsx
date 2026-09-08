import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Medicine } from '../../types';
import { MEDICINES } from '../../data/mockData';

interface PrescriptionScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMatchedMedicine: (medicine: Medicine) => void;
}

export const PrescriptionScannerModal: React.FC<PrescriptionScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectMatchedMedicine
}) => {
  const [mode, setMode] = useState<'options' | 'camera' | 'uploading' | 'results'>('options');
  const [progress, setProgress] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<number>(0);

  if (!isOpen) return null;

  const presets = [
    {
      medicine: MEDICINES[0], // Atorvastatin
      sig: 'Take 1 tablet (20mg) orally once daily at bedtime',
      doctor: 'Dr. Robert H. Smith, MD (NPI: 1487920194)',
      patient: 'Eleanor Vance (58 Yrs)',
      brand: 'Lipitor® 20mg',
      generic: 'Atorvastatin Calcium 20mg',
      savings: '$30.60 per month'
    },
    {
      medicine: MEDICINES[1], // Metformin
      sig: 'Take 1 tablet (500mg) orally twice daily with meals',
      doctor: 'Dr. Arthur Pendelton, MD (NPI: 1982401923)',
      patient: 'Eleanor Vance (58 Yrs)',
      brand: 'Glucophage® XR 500mg',
      generic: 'Metformin HCl ER 500mg',
      savings: '$14.40 per month'
    }
  ];

  const handleStartScan = (presetIndex: number = 0) => {
    setSelectedPreset(presetIndex);
    setMode('uploading');
    setProgress(15);
    
    setTimeout(() => setProgress(45), 400);
    setTimeout(() => setProgress(80), 800);
    setTimeout(() => {
      setProgress(100);
      setMode('results');
    }, 1200);
  };

  const currentPreset = presets[selectedPreset] || presets[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full my-auto overflow-hidden shadow-2xl border border-[#bcc9c6] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0b1c30] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center font-bold text-sm">
              <Camera className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                Prescription AI Scanner &amp; OCR
              </h2>
              <span className="text-[10px] text-[#89f5e7] font-mono">
                FDA Bioequivalence Salt Extraction
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

        {/* Content */}
        <div className="p-5 space-y-4">
          {mode === 'options' && (
            <div className="space-y-4 text-xs">
              <p className="text-[#3d4947]">
                Capture your doctor's handwritten or electronic prescription. Our secure optical extraction identifies the canonical molecule, verifies bioequivalence, and searches real-time local pharmacy prices.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('camera')}
                  className="p-4 bg-[#eff4ff] hover:bg-[#dce9ff] border-2 border-dashed border-[#00685f] rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#00685f] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-[#0b1c30]">Camera Snap</span>
                  <span className="text-[10px] text-[#3d4947]">Live scanner with framing reticle</span>
                </button>

                <button
                  onClick={() => handleStartScan(0)}
                  className="p-4 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-[#bcc9c6] rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-[#0b1c30] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-[#0b1c30]">Upload File / PDF</span>
                  <span className="text-[10px] text-[#3d4947]">Drop photo or document scan</span>
                </button>
              </div>

              {/* Sample Prescriptions to test */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-[#3d4947] uppercase tracking-wider block">
                  Quick Demo: Try with Sample Clinical Rx:
                </span>

                <div className="space-y-1.5">
                  <div 
                    onClick={() => handleStartScan(0)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-[#00685f] hover:bg-[#eff4ff] cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <strong className="text-[#0b1c30] block">Dr. Smith Rx • Lipitor 20mg</strong>
                      <span className="text-[10px] text-slate-500">Atorvastatin Calcium eq. • Eleanor Vance</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#00685f]">Scan &rarr;</span>
                  </div>

                  <div 
                    onClick={() => handleStartScan(1)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-[#00685f] hover:bg-[#eff4ff] cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <strong className="text-[#0b1c30] block">Dr. Pendelton Rx • Glucophage XR 500mg</strong>
                      <span className="text-[10px] text-slate-500">Metformin HCl ER eq. • Eleanor Vance</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#00685f]">Scan &rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'camera' && (
            <div className="space-y-3 text-xs">
              {/* Simulated Camera Viewfinder */}
              <div className="relative h-60 bg-black rounded-xl overflow-hidden flex flex-col justify-between p-3 border-2 border-[#00685f]">
                {/* Viewfinder reticle corners */}
                <div className="absolute inset-4 border-2 border-white/60 rounded-lg pointer-events-none border-dashed flex items-center justify-center">
                  <span className="text-[11px] bg-black/60 text-white px-2 py-1 rounded backdrop-blur-xs font-mono">
                    Align Prescription Inside Frame
                  </span>
                </div>

                <div className="flex justify-between items-center text-white text-[11px] z-10">
                  <span className="bg-red-600 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> REC
                  </span>
                  <span className="bg-black/40 px-2 py-0.5 rounded font-mono">Auto-Focus: LOCKED</span>
                </div>

                <div className="z-10 flex justify-center pb-2">
                  <button
                    onClick={() => handleStartScan(0)}
                    className="w-14 h-14 rounded-full bg-white border-4 border-[#00685f] flex items-center justify-center text-[#00685f] hover:scale-105 active:scale-95 transition-transform shadow-lg"
                    title="Capture photo"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#00685f]"></div>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setMode('options')}
                  className="text-[#3d4947] hover:text-[#0b1c30] text-xs font-semibold"
                >
                  &larr; Back
                </button>
                <span className="text-[10px] text-slate-500">
                  Hold steady under clear lighting
                </span>
              </div>
            </div>
          )}

          {mode === 'uploading' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="w-10 h-10 text-[#00685f] animate-spin" />
              <div>
                <h3 className="text-sm font-bold text-[#0b1c30]">Analyzing Electronic Prescription</h3>
                <p className="text-xs text-[#3d4947] mt-1">
                  Parsing medical terms, active salt, and FDA Orange Book equivalence...
                </p>
              </div>

              <div className="w-full max-w-xs bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div 
                  className="bg-[#00685f] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{progress}% Completed</span>
            </div>
          )}

          {mode === 'results' && (
            <div className="space-y-3.5 text-xs">
              {/* Extraction Successful Alert */}
              <div className="p-3 bg-[#f4fffc] border border-[#85f8c4] rounded-xl flex items-start space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#006948] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#006948]">Prescription Successfully Parsed</h3>
                  <p className="text-[11px] text-[#3d4947]">
                    Matched to 100% bioequivalent generic molecule with FDA AB therapeutic rating.
                  </p>
                </div>
              </div>

              {/* Parsed Drug Details Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                      Prescribed Brand Reference:
                    </span>
                    <strong className="text-sm text-[#0b1c30]">{currentPreset.brand}</strong>
                  </div>
                  <span className="text-[10px] bg-[#dae2fd] text-[#131b2e] px-2 py-0.5 rounded font-bold">
                    FDA AB Rated
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-[#3d4947]">
                  <p><strong>Generic Bioequivalent:</strong> <span className="text-[#00685f] font-bold">{currentPreset.generic}</span></p>
                  <p><strong>Dosage Instruction:</strong> {currentPreset.sig}</p>
                  <p><strong>Prescriber:</strong> {currentPreset.doctor}</p>
                  <p><strong>Patient:</strong> {currentPreset.patient}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-[#3d4947]">Estimated Patient Savings:</span>
                  <span className="text-[#006948] font-bold">{currentPreset.savings}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onSelectMatchedMedicine(currentPreset.medicine);
                  onClose();
                }}
                className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95"
              >
                <span>Compare Local Pharmacy Offers for {currentPreset.medicine.genericName}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
