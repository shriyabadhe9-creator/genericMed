import React from 'react';
import { ToastNotification } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3 rounded-xl border shadow-xl flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 duration-200 ${
              isSuccess
                ? 'bg-[#f4fffc] border-[#85f8c4] text-[#002114]'
                : isWarning
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : isError
                ? 'bg-red-50 border-red-300 text-red-900'
                : 'bg-[#eff4ff] border-[#bcc9c6] text-[#0b1c30]'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#006948]" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-600" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#00685f]" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
                <span className="text-[10px] opacity-60 font-mono">{toast.timestamp}</span>
              </div>
              <p className="text-[11px] mt-0.5 leading-relaxed opacity-90">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="opacity-50 hover:opacity-100 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
