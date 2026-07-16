import React from 'react';
import { LucideIcon } from 'lucide-react';

// --- Cyber Input ---
interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

export const CyberInput: React.FC<CyberInputProps> = ({ label, icon: Icon, className, ...props }) => {
  return (
    <div className="w-full group">
      <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-cyan-400 transition-colors duration-300 ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
          {Icon && <Icon size={20} />}
        </div>
        <input
          className={`w-full bg-slate-800/40 border border-slate-700 text-slate-100 rounded-sm py-3.5 pl-12 pr-4 
            focus:outline-none focus:border-cyan-500 focus:bg-slate-800/80 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] 
            transition-all duration-300 placeholder-slate-600 font-medium text-base ${className}
            disabled:opacity-60 disabled:cursor-not-allowed`}
          {...props}
        />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-600 group-focus-within:border-cyan-500 transition-colors" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-600 group-focus-within:border-cyan-500 transition-colors" />
      </div>
    </div>
  );
};

// --- Cyber Button ---
interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary';
  isLoading?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false,
  className, 
  ...props 
}) => {
  const baseStyles = "relative px-8 py-3.5 font-bold uppercase tracking-widest transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shadow-lg";
  
  const variants = {
    primary: "bg-cyan-600/10 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]",
    secondary: "bg-slate-800 border border-slate-600 text-slate-300 hover:border-slate-400 hover:bg-slate-700 hover:text-white",
    danger: "bg-red-500/10 border border-red-500 text-red-400 hover:bg-red-500 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          PROCESSING
        </span>
      ) : (
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      )}
      
      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
    </button>
  );
};

// --- Cyber Card ---
export const CyberCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={`relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-sm shadow-2xl ${className}`}>
      <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-cyan-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      
      <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
      <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
