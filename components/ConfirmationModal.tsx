
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const themes = {
    danger: {
      icon: 'fa-triangle-exclamation',
      bg: 'bg-red-500',
      text: 'text-red-600 dark:text-red-400',
      button: 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-red-900/40',
      light: 'bg-red-50 dark:bg-red-900/20'
    },
    warning: {
      icon: 'fa-circle-exclamation',
      bg: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200 dark:shadow-amber-900/40',
      light: 'bg-amber-50 dark:bg-amber-900/20'
    },
    info: {
      icon: 'fa-circle-info',
      bg: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/40',
      light: 'bg-blue-50 dark:bg-blue-900/20'
    }
  };

  const theme = themes[variant];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onCancel}
      />
      
      {/* Modal - Added max-height and overflow for mobile accessibility */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md max-h-[calc(100dvh-2rem)] rounded-[2.5rem] shadow-2xl overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-800 no-scrollbar">
        <div className={`p-8 ${theme.light} flex justify-center sticky top-0 z-10 backdrop-blur-sm`}>
          <div className={`w-20 h-20 ${theme.bg} text-white rounded-3xl flex items-center justify-center shadow-2xl animate-in zoom-in-50 duration-500`}>
            <i className={`fa-solid ${theme.icon} text-3xl`}></i>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight leading-tight">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className={`w-full py-4 min-h-[54px] ${theme.button} text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg transition-all active:scale-95`}
            >
              {confirmLabel}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-4 min-h-[54px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200/50 dark:border-slate-700"
            >
              Keep My Data
            </button>
          </div>
        </div>
        
        {/* Progress bar visual for finality */}
        <div className={`h-1.5 w-full ${theme.bg} opacity-20 sticky bottom-0`}></div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
