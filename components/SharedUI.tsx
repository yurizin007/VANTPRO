
import React, { useState } from 'react';
import { Info, AlertTriangle, ArrowUpRight, ArrowDownRight, HelpCircle, X } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick} 
    className={`bg-[#0e0e11] border border-white/[0.05] rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-white/[0.12] hover:bg-[#121216] ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
  >
    {children}
  </div>
);

export const Tooltip: React.FC<{ title: string, content: string }> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block ml-1">
      <button 
        onMouseEnter={() => setIsOpen(true)} 
        onMouseLeave={() => setIsOpen(false)}
        className="text-gray-600 hover:text-emerald-500 transition-colors"
      >
        <HelpCircle size={12} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-[#16161a] border border-white/10 rounded-2xl shadow-2xl z-[100] animate-in fade-in zoom-in-95">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">{title}</p>
          <p className="text-[11px] text-gray-400 leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
};

export const MetricCard: React.FC<{ 
  title: string, 
  value: string | number, 
  change?: string, 
  isPositive?: boolean, 
  tooltipTitle?: string,
  tooltipContent?: string,
  dataSource?: string
}> = ({ title, value, change, isPositive, tooltipTitle, tooltipContent, dataSource }) => (
  <Card className="flex flex-col justify-between group relative overflow-hidden">
    <div className="flex flex-col text-left relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-500 text-[9px] font-black uppercase tracking-[2px]">
          {title}
        </span>
        {tooltipTitle && <Tooltip title={tooltipTitle} content={tooltipContent || ''} />}
      </div>
      <span className="text-3xl font-black text-white font-mono tracking-tighter group-hover:text-emerald-500 transition-colors">
        {value}
      </span>
      {dataSource && (
        <span className="text-[8px] text-gray-700 font-bold uppercase mt-1 tracking-widest">
          Fonte: {dataSource}
        </span>
      )}
    </div>
    
    {change && (
      <div className="mt-4 flex items-center justify-between">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${isPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
          {change}
        </span>
      </div>
    )}
  </Card>
);

export const Disclaimer = () => (
  <footer className="mt-20 border-t border-white/[0.03] pt-12 pb-12 opacity-50 hover:opacity-100 transition-opacity">
    <div className="max-w-4xl mx-auto flex gap-6 items-start">
      <AlertTriangle className="w-5 h-5 text-gray-600 shrink-0 mt-1" />
      <div className="space-y-2 text-left">
        <h5 className="text-gray-500 font-black text-[9px] uppercase tracking-[3px]">Financial Disclosure & Compliance</h5>
        <p className="text-[10px] text-gray-600 leading-relaxed">
          O Vantez Terminal Pro é uma plataforma de simulação e análise de dados. As informações aqui contidas não constituem recomendação de investimento. Investir no mercado financeiro envolve riscos. Dados de mercado podem sofrer latência de até 15 minutos.
        </p>
      </div>
    </div>
  </footer>
);

export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = "emerald" }) => {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${colors[color] || colors.emerald}`}>
      {children}
    </span>
  );
};
