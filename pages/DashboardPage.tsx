import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import { 
  Zap, Activity, TrendingUp, Target, 
  ShieldCheck, BrainCircuit, Rocket, HeartPulse, Fingerprint, ArrowRight, ArrowUpRight, ShieldAlert, Cpu
} from 'lucide-react';
import { Card, MetricCard, Disclaimer, Badge } from '../components/SharedUI';
import { ChartDefinitivo } from '../components/ChartDefinitivo';
import { UserProfile, PageId } from '../types';
import { COLORS } from '../constants';
import { formatCurrency } from '../utils/math';

interface DashboardPageProps {
  userProfile?: UserProfile;
  setActivePage: (id: PageId) => void;
  onAporteClick: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ userProfile, setActivePage, onAporteClick }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);
  
  const profile = useMemo(() => userProfile || {
    nome: 'Investidor',
    faseAtual: 1,
    perfilRisco: 'Moderado',
    nivelConhecimento: 'Iniciante',
    aporteMensal: 500,
    temDividas: false,
    temReserva: 'Nao',
    objetivo: 'Multiplicar',
    horizonteAnos: 5,
    scoreRisco: 60
  }, [userProfile]);

  const suggestedAllocation = useMemo(() => {
    const risk = profile.perfilRisco;
    if (risk === 'Conservador') {
      return [
        { name: 'Renda Fixa Pós', value: 70 },
        { name: 'Renda Fixa IPCA', value: 20 },
        { name: 'FIIs', value: 10 },
      ];
    } else if (risk === 'Moderado') {
      return [
        { name: 'Renda Fixa', value: 40 },
        { name: 'Ações BR', value: 30 },
        { name: 'FIIs', value: 20 },
        { name: 'Global', value: 10 },
      ];
    } else {
      return [
        { name: 'Ações BR', value: 35 },
        { name: 'Ações USA', value: 25 },
        { name: 'Cripto', value: 15 },
        { name: 'FIIs', value: 15 },
        { name: 'Renda Fixa', value: 10 },
      ];
    }
  }, [profile.perfilRisco]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-16 text-left font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-3 border-emerald-500/10 bg-emerald-500/[0.02] flex flex-col md:flex-row items-center gap-10 p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <BrainCircuit size={180} className="text-emerald-500" />
          </div>
          <div className="bg-emerald-600/10 p-8 rounded-3xl shrink-0 shadow-2xl shadow-emerald-900/20">
            <Zap className="text-emerald-500 w-12 h-12 animate-pulse" />
          </div>
          <div className="flex-1 space-y-4 text-left relative z-10">
            <div className="flex items-center gap-4">
              <Badge color="emerald">Kernel Vantez Ativado</Badge>
              <span className="text-gray-700 text-[9px] font-black uppercase tracking-[3px]">Assistente v2.5.8</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tighter">
              Seu Diagnóstico: <span className="text-emerald-500">{profile.nome}</span>, sua fase é de <span className="text-emerald-500">{profile.faseAtual === 1 ? 'Segurança Estrutural' : 'Expansão Patrimonial'}</span>.
            </h1>
            <p className="text-gray-500 text-sm font-medium max-w-2xl">
              Baseado nas suas respostas, detectamos um viés de <span className="text-white font-bold">{profile.perfilRisco}</span>. 
              {profile.temDividas ? ' Prioridade absoluta: Liquidação de dívidas de alto juro.' : ' Foco em otimização de aportes para o objetivo de ' + profile.objetivo + '.'}
            </p>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
               <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <ShieldCheck size={16} className="text-emerald-500" /> Score Risco: {profile.scoreRisco}/100
               </div>
               <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <Target size={16} className="text-blue-500" /> Meta: {profile.objetivo}
               </div>
               <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <Activity size={16} className="text-amber-500" /> Aporte: {formatCurrency(profile.aporteMensal)}
               </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-[#0e0e11] border-white/5 flex flex-col justify-between items-center text-center">
           <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[3px] mb-6">Onde Investir (IA)</h4>
           
           <div className="w-full h-[160px] min-h-[160px] relative flex items-center justify-center">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={suggestedAllocation} innerRadius={45} outerRadius={60} paddingAngle={8} dataKey="value" stroke="none">
                       {suggestedAllocation.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px'}}
                      itemStyle={{fontSize: '10px', color: '#fff'}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-[8px] text-gray-600 font-black uppercase">Perfil</span>
                 <span className="text-xs font-black text-white">{profile.perfilRisco}</span>
              </div>
           </div>

           <div className="mt-6 w-full space-y-2">
              <button 
                onClick={() => setActivePage('wallet')}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-[9px] font-black text-white uppercase tracking-widest rounded-xl transition-all"
              >
                Ver Detalhes
              </button>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card className="p-10 border-blue-500/10 bg-blue-500/[0.01]">
              <div className="flex justify-between items-center mb-12">
                 <h3 className="text-white font-black text-xs uppercase tracking-[5px] flex items-center gap-4">
                    <Rocket className="text-blue-500 w-6 h-6" /> Seu Plano para {profile.objetivo}
                 </h3>
                 <Badge color="blue">Passo 0{profile.faseAtual} de 03</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                 <div className="absolute top-10 left-[15%] right-[15%] h-0.5 bg-white/5 hidden md:block" />
                 
                 {[
                   { step: 1, label: profile.temDividas ? 'Quitar Dívidas' : 'Reserva de Liquidez', status: profile.faseAtual >= 1 ? 'active' : 'pending', icon: ShieldCheck },
                   { step: 2, label: 'Acúmulo de Ativos', status: profile.faseAtual >= 2 ? 'active' : 'pending', icon: TrendingUp },
                   { step: 3, label: 'Independência', status: 'pending', icon: Target }
                 ].map((s, i) => (
                   <div key={i} className={`flex flex-col items-center text-center space-y-4 relative z-10 transition-all duration-700 ${s.status === 'pending' ? 'opacity-30 grayscale' : ''}`}>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${s.status === 'active' ? 'bg-emerald-600 text-white scale-110 rotate-3' : 'bg-white/5 text-gray-700'}`}>
                         <s.icon size={24} />
                      </div>
                      <div>
                         <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Passo {s.step}</p>
                         <p className="text-xs font-black text-white uppercase">{s.label}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8">
                 <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[3px]">Termômetro do Ibovespa (30D)</h4>
                    <TrendingUp size={14} className="text-emerald-500" />
                 </div>
                 <div className="w-full h-[180px] bg-black/20 rounded-2xl overflow-hidden p-2">
                    <ChartDefinitivo ticker="IBOV" color="#10b981" />
                 </div>
              </Card>
              <Card className="p-8">
                 <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[3px]">Preço do Dólar (30D)</h4>
                    <Activity size={14} className="text-blue-500" />
                 </div>
                 <div className="w-full h-[180px] bg-black/20 rounded-2xl overflow-hidden p-2">
                    <ChartDefinitivo ticker="USDBRL" color="#3b82f6" />
                 </div>
              </Card>
           </div>
        </div>

        <div className="space-y-8">
           <Card className="p-10 border-rose-500/10 bg-rose-500/[0.01] text-left">
              <div className="flex items-center gap-4 mb-8">
                 <HeartPulse className="text-rose-500 w-6 h-6" />
                 <h4 className="text-[10px] font-black text-white uppercase tracking-[4px]">Minha Segurança</h4>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <ShieldAlert size={16} className={profile.temDividas ? "text-rose-500" : "text-emerald-500"} />
                       <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Dívidas</span>
                    </div>
                    <span className={`text-xs font-black uppercase ${profile.temDividas ? 'text-rose-500' : 'text-emerald-500'}`}>
                       {profile.temDividas ? 'Ativo' : 'Zero'}
                    </span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={16} className={profile.temReserva === 'Sim' ? "text-emerald-500" : "text-amber-500"} />
                       <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Reserva</span>
                    </div>
                    <span className={`text-xs font-black uppercase ${profile.temReserva === 'Sim' ? 'text-emerald-500' : 'text-amber-500'}`}>
                       {profile.temReserva}
                    </span>
                 </div>
                 <div className="pt-6 border-t border-white/5">
                    <p className="text-[11px] text-gray-500 font-medium italic leading-relaxed">
                       "Recomendamos que você destine <span className="text-emerald-500 font-bold">R$ {Math.round(profile.aporteMensal * 0.4)}</span> para sua reserva de emergência."
                    </p>
                 </div>
              </div>
           </Card>

           <Card className="p-8 bg-gradient-to-br from-blue-600/[0.05] to-transparent border-blue-500/10 text-left">
              <div className="flex items-center gap-4 mb-6">
                 <Cpu className="text-blue-500 w-6 h-6" />
                 <h4 className="text-[10px] font-black text-white uppercase tracking-[3px]">Previsão de Tempo</h4>
              </div>
              <div className="space-y-4">
                 <div>
                    <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Tempo Estimado p/ Objetivo</p>
                    <p className="text-2xl font-black text-white font-mono">~{(profile.horizonteAnos * 1.2).toFixed(0)} ANOS</p>
                 </div>
                 <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                    <ArrowUpRight size={14} /> Sucesso: 82%
                 </div>
              </div>
              <button 
                onClick={onAporteClick}
                className="w-full mt-8 py-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3"
              >
                 Refinar <ArrowRight size={14} />
              </button>
           </Card>

           <Card className="p-8 space-y-6 text-left border-amber-500/10 bg-amber-500/[0.01]">
              <div className="flex items-center gap-4">
                 <Fingerprint className="text-amber-500 w-6 h-6" />
                 <h4 className="text-[10px] font-black text-white uppercase tracking-[3px]">Meu Perfil</h4>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                 Seu perfil <span className="text-white">{profile.perfilRisco}</span> indica foco em {profile.perfilRisco === 'Conservador' ? 'segurança' : 'retorno'}.
              </p>
           </Card>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
};