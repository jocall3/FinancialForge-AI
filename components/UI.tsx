
import React from 'react';

export const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm ${className}`}>
        {title && (
            <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/80">
                <h3 className="text-lg font-bold text-slate-100">{title}</h3>
            </div>
        )}
        <div className="p-6">{children}</div>
    </div>
);

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
    <button 
        className={`px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 ${className}`}
        {...props}
    >
        {children}
    </button>
);

export const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
    <button 
        className={`px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 ${className}`}
        {...props}
    >
        {children}
    </button>
);

export const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-400">{label}</label>
        <input 
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
            {...props} 
        />
    </div>
);

export const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-400">{label}</label>
        <textarea 
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all min-h-[100px] placeholder:text-slate-600"
            {...props} 
        />
    </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'cyan' }) => {
    const colors: Record<string, string> = {
        cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.slate}`}>
            {children}
        </span>
    );
};
