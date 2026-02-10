
import React from 'react';
import { ChevronRight, Home, LayoutDashboard, Map, GraduationCap, HeartPulse, Wallet, TrendingUp, Building2, Landmark, Coins, Globe, Umbrella, Tag, Bot, Cpu, Newspaper, Calculator } from 'lucide-react';
import { PageId } from '../types';

interface BreadcrumbsProps {
  activePage: PageId;
  setActivePage: (id: PageId) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activePage, setActivePage }) => {
  // Mapeamento de rótulos e ícones
  const pageMap: Record<string, { label: string; icon: any }> = {
    dashboard: { label: 'Painel Geral', icon: LayoutDashboard },
    myplan: { label: 'Meu Plano', icon: Map },
    academy: { label: 'Vantez Academy', icon: GraduationCap },
    health: { label: 'Saúde Financeira', icon: HeartPulse },
    wallet: { label: 'Meus Investimentos', icon: Wallet },
    stocks: { label: 'Ações Brasileiras', icon: TrendingUp },
    funds: { label: 'Fundos Imobiliários', icon: Building2 },
    tesouro: { label: 'Renda Fixa / Tesouro', icon: Landmark },
    crypto: { label: 'Bitcoin e Criptos', icon: Coins },
    offshore: { label: 'Dólar e Exterior', icon: Globe },
    previdencia: { label: 'Aposentadoria', icon: Umbrella },
    coe: { label: 'Oportunidades / COE', icon: Tag },
    advisor: { label: 'Assistente IA', icon: Bot },
    robo: { label: 'Estrategista HRP', icon: Cpu },
    news: { label: 'Terminal News', icon: Newspaper },
    tax: { label: 'Impostos', icon: Calculator },
  };

  if (activePage === 'quiz') return null;

  const currentPage = pageMap[activePage] || { label: 'Terminal', icon: Home };

  return (
    <nav className="flex items-center gap-3 py-2 px-1 mb-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <button 
        onClick={() => setActivePage('dashboard')}
        className="flex items-center gap-2 text-gray-600 hover:text-emerald-500 transition-all group"
      >
        <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-emerald-500/10 transition-colors border border-white/5">
          <Home size={14} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Vantez Terminal</span>
      </button>

      <ChevronRight size={12} className="text-gray-800" />

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
        <currentPage.icon size={14} className="text-emerald-500" />
        <span className="text-[10px] font-black text-white uppercase tracking-[2px] font-mono">
          {currentPage.label}
        </span>
      </div>

      {/* Indicador de Status do Kernel */}
      <div className="ml-auto hidden lg:flex items-center gap-2 opacity-30">
        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Sincronizado via Kernel v2.5</span>
      </div>
    </nav>
  );
};
