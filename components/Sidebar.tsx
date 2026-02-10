import React from 'react';
import { 
  LayoutDashboard, Bot, Cpu, Building2, HeartPulse, Newspaper, 
  TrendingUp, Wallet, Coins, GraduationCap, Calculator, ShieldCheck,
  Landmark, Globe, Umbrella, Tag, Lock, Map
} from 'lucide-react';
import { PageId, UserProfile } from '../types';

interface SidebarProps {
  activePage: PageId;
  setActivePage: (id: PageId) => void;
  profile?: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, profile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard, alwaysUnlocked: true },
    { id: 'myplan', label: 'Meu Plano', icon: Map, alwaysUnlocked: true },
    { id: 'academy', label: 'Aprenda', icon: GraduationCap, alwaysUnlocked: true },
    { id: 'health', label: 'Saúde Financeira', icon: HeartPulse, alwaysUnlocked: true },
    { id: 'divider', label: 'Onde Investir', isDivider: true },
    { id: 'wallet', label: 'Meus Investimentos', icon: Wallet },
    { id: 'stocks', label: 'Ações Brasileiras', icon: TrendingUp },
    { id: 'funds', label: 'Fundos Imobiliários', icon: Building2 },
    { id: 'tesouro', label: 'Investimentos Seguros', icon: Landmark },
    { id: 'crypto', label: 'Bitcoin e Criptos', icon: Coins },
    { id: 'offshore', label: 'Dólar e Exterior', icon: Globe },
    { id: 'previdencia', label: 'Aposentadoria', icon: Umbrella },
    { id: 'coe', label: 'Oportunidades', icon: Tag },
    { id: 'divider2', label: 'IA e Avançado', isDivider: true },
    { id: 'advisor', label: 'Assistente Inteligente', icon: Bot, alwaysUnlocked: true },
    { id: 'robo', label: 'Plano de Investimentos', icon: Cpu },
    { id: 'news', label: 'Notícias do Mercado', icon: Newspaper, alwaysUnlocked: true },
    { id: 'tax', label: 'Impostos Simplificados', icon: Calculator },
  ];

  const isUnlocked = (itemId: string, alwaysUnlocked?: boolean) => {
    // DESBLOQUEIO TOTAL: Sempre retorna true conforme solicitado
    return true;
  };

  return (
    <div className="w-64 bg-[#08080a] border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-hidden z-50 shrink-0">
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <span className="font-black text-white text-xl">V</span>
        </div>
        <span className="text-xl font-black text-white tracking-tighter text-left">
          VANTEZ<span className="text-emerald-500 italic">.PRO</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 custom-scrollbar px-3">
        {menuItems.map((item) => {
          if (item.isDivider) {
            return (
              <div key={item.id} className="px-6 py-4 text-[8px] font-black text-gray-700 uppercase tracking-[4px] text-left">
                {item.label}
              </div>
            );
          }

          const unlocked = isUnlocked(item.id, item.alwaysUnlocked);
          const Icon = item.icon!;

          return (
            <button
              key={item.id}
              disabled={!unlocked}
              onClick={() => setActivePage(item.id as PageId)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all rounded-xl group relative ${
                activePage === item.id 
                  ? 'bg-emerald-500/10 text-white shadow-lg border border-emerald-500/20' 
                  : unlocked 
                    ? 'text-gray-500 hover:text-white hover:bg-white/[0.02]' 
                    : 'text-gray-800 cursor-not-allowed grayscale'
              }`}
            >
              <div className="relative">
                <Icon size={16} className={`${activePage === item.id ? 'text-emerald-500' : unlocked ? 'group-hover:text-emerald-400' : 'text-gray-800'}`} />
                {!unlocked && <Lock size={8} className="absolute -top-1 -right-1 text-gray-700" />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest leading-tight text-left">{item.label}</span>
              {activePage === item.id && (
                <div className="absolute right-3 w-1 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
           <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-black text-gray-600 uppercase">Progresso IA</span>
              <span className="text-[8px] font-black text-emerald-500">{profile?.xp || 0} XP</span>
           </div>
           <div className="w-full bg-black h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${Math.min(100, (profile?.xp || 0) / 10)}%` }}></div>
           </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <div className="text-left">
            <p className="text-[9px] font-black text-white uppercase">{profile?.perfilRisco || 'Online'}</p>
            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Score: {profile?.scoreRisco || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};