import React from 'react';
import { 
  LayoutDashboard, Bot, Cpu, Building2, HeartPulse, Newspaper, 
  TrendingUp, Wallet, Coins, GraduationCap, Calculator, ShieldCheck,
  Landmark, Globe, Umbrella, Tag, Lock, Map, Zap
} from 'lucide-react';
import { PageId, UserProfile } from '../types';

interface SidebarProps {
  activePage: PageId;
  setActivePage: (id: PageId) => void;
  profile?: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, profile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'myplan', label: 'Meu Plano', icon: Map },
    { id: 'academy', label: 'Aprenda', icon: GraduationCap },
    { id: 'health', label: 'Saúde Financeira', icon: HeartPulse },
    { id: 'divider1', label: 'Onde Investir', isDivider: true },
    { id: 'wallet', label: 'Meus Investimentos', icon: Wallet },
    { id: 'stocks', label: 'Ações Brasileiras', icon: TrendingUp },
    { id: 'funds', label: 'Fundos Imobiliários', icon: Building2 },
    { id: 'tesouro', label: 'Investimentos Seguros', icon: Landmark },
    { id: 'crypto', label: 'Bitcoin e Criptos', icon: Coins },
    { id: 'offshore', label: 'Dólar e Exterior', icon: Globe },
    { id: 'previdencia', label: 'Aposentadoria', icon: Umbrella },
    { id: 'coe', label: 'Oportunidades', icon: Tag },
    { id: 'divider2', label: 'IA e Avançado', isDivider: true },
    { id: 'advisor', label: 'Assistente Inteligente', icon: Bot },
    { id: 'robo', label: 'Plano de Investimentos', icon: Cpu },
    { id: 'news', label: 'Notícias do Mercado', icon: Newspaper },
    { id: 'tax', label: 'Impostos Simplificados', icon: Calculator },
  ];

  return (
    <aside className="w-72 bg-[#08080a] border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-hidden z-50 shrink-0">
      {/* Brand Header */}
      <div className="p-10 flex items-center gap-5">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <Zap className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-white tracking-tighter leading-none">
            VANTEZ<span className="text-emerald-500 italic">.PRO</span>
          </span>
          <span className="text-[8px] text-gray-700 font-black uppercase tracking-[3px] mt-1">Kernel v3.0.1</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 custom-scrollbar px-5">
        {menuItems.map((item) => {
          if (item.isDivider) {
            return (
              <div key={item.id} className="px-5 py-6 text-[9px] font-black text-gray-700 uppercase tracking-[5px]">
                {item.label}
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as PageId)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 transition-all rounded-2xl group relative ${
                isActive 
                  ? 'bg-emerald-500/5 text-white shadow-xl border border-emerald-500/10' 
                  : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Icon size={18} className={`${isActive ? 'text-emerald-500' : 'group-hover:text-emerald-400 transition-colors'}`} />
              <span className="text-[11px] font-black uppercase tracking-widest leading-none">{item.label}</span>
              
              {isActive && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile Snapshot */}
      <div className="p-8 border-t border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-4 px-4 py-4 rounded-3xl bg-[#0e0e11] border border-white/5">
          <div className="bg-emerald-600/10 p-2.5 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-white uppercase tracking-wider">{profile?.nome || 'Usuário'}</p>
            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[2px]">{profile?.perfilRisco} • XP: {profile?.xp}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};