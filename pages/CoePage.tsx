import React, { useState } from 'react';
import { Tag, ChevronDown, ChevronUp, FileText, Calendar, Lock, Globe, Target, Landmark } from 'lucide-react';
import { Card, Disclaimer } from '../components/SharedUI';
import { useNotification } from '../App';

export const CoePage: React.FC = () => {
  const { addNotification } = useNotification();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const coes = [
     {id: 1, name: 'MSCI World c/ Proteção', issuer: 'Morgan Stanley', type: 'Capital Protegido', time: '3 Anos', rent: 'Ilimitada (1.5x)', min: 'R$ 5.000', risk: 'Baixo'},
     {id: 2, name: 'Gigantes Tech Cupom', issuer: 'Goldman Sachs', type: 'Autocallable', time: '5 Anos', rent: '12% a.a. em USD', min: 'R$ 10.000', risk: 'Médio'},
     {id: 3, name: 'Energia Limpa Global', issuer: 'JP Morgan', type: 'Participação', time: '4 Anos', rent: 'Alta Ilimitada', min: 'R$ 1.000', risk: 'Alto'}
  ];

  const handleReserve = (name: string) => {
    addNotification(`Processando reserva para: ${name}`, "info");
    setTimeout(() => {
      addNotification("Reserva confirmada no Book de Ofertas!", "success");
    }, 2000);
  };

  const handleAlerts = () => {
    addNotification("Alertas Push ativados!", "success");
  };

  const handleViewLamina = (name: string) => {
    addNotification(`Iniciando download da lâmina de ${name}...`, "info");
    setTimeout(() => {
      addNotification("Documento baixado com sucesso.", "success");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-6">
        <div className="bg-purple-600 p-4 rounded-2xl shadow-2xl shadow-purple-900/40">
          <Tag className="text-white w-8 h-8" />
        </div>
        <div className="text-left">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">COE & Ofertas Públicas</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px]">Acesso a Estruturados e Novas Emissões</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-10 space-y-10 text-left">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter border-b border-white/5 pb-6 flex items-center gap-4">
             <Target className="w-8 h-8 text-purple-500" /> Oportunidades em COEs
          </h3>
          <div className="space-y-4">
             {coes.map((coe) => (
                 <div key={coe.id} className={`bg-black/40 rounded-3xl border transition-all duration-300 overflow-hidden ${expandedId === coe.id ? 'border-purple-500/50 bg-purple-500/[0.02]' : 'border-white/5 hover:border-white/10'}`}>
                    <div 
                       className="p-8 cursor-pointer flex justify-between items-center"
                       onClick={() => setExpandedId(expandedId === coe.id ? null : coe.id)}
                    >
                       <div>
                          <p className="font-black text-white text-lg tracking-tight uppercase">{coe.name}</p>
                          <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mt-1">{coe.issuer} • {coe.type}</p>
                       </div>
                       <div className="text-right flex items-center gap-6">
                          <div className="text-right">
                             <span className="block text-emerald-500 font-black text-sm uppercase tracking-widest">{coe.rent}</span>
                             <span className="text-[9px] text-gray-700 font-bold uppercase">Rentabilidade Est.</span>
                          </div>
                          {expandedId === coe.id ? <ChevronUp size={20} className="text-gray-500"/> : <ChevronDown size={20} className="text-gray-500"/>}
                       </div>
                    </div>
                    
                    <div className={`px-8 transition-all duration-500 ease-in-out ${expandedId === coe.id ? 'max-h-96 py-8 opacity-100 border-t border-white/5' : 'max-h-0 py-0 opacity-0'}`}>
                       <div className="grid grid-cols-3 gap-6 mb-8 text-center">
                          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                             <p className="text-[9px] text-gray-600 uppercase font-black mb-2 tracking-widest">Vencimento</p>
                             <p className="text-xs text-white font-black">{coe.time}</p>
                          </div>
                          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                             <p className="text-[9px] text-gray-600 uppercase font-black mb-2 tracking-widest">Mínimo</p>
                             <p className="text-xs text-white font-black">{coe.min}</p>
                          </div>
                          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                             <p className="text-[9px] text-gray-600 uppercase font-black mb-2 tracking-widest">Risco</p>
                             <p className={`text-xs font-black uppercase ${coe.risk === 'Baixo' ? 'text-emerald-500' : coe.risk === 'Médio' ? 'text-amber-500' : 'text-rose-500'}`}>{coe.risk}</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => handleReserve(coe.name)}
                            className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black uppercase tracking-[3px] transition-all shadow-xl shadow-purple-900/20 active:scale-95">Reservar Agora</button>
                          <button 
                            onClick={() => handleViewLamina(coe.name)}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-black uppercase tracking-[3px] transition-all flex items-center justify-center gap-3"
                          >
                            <FileText size={18}/> Ver Lâmina
                          </button>
                       </div>
                    </div>
                 </div>
             ))}
          </div>
        </Card>

        <Card className="p-10 space-y-10 relative overflow-hidden bg-gradient-to-br from-blue-600/[0.02] to-transparent text-left">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
             <Calendar className="w-48 h-48 text-blue-500" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter border-b border-white/5 pb-6 flex items-center gap-4 relative z-10">
             <Calendar className="w-8 h-8 text-blue-500" /> Calendário de IPOs & Follow-ons
          </h3>
          <div className="space-y-6 relative z-10">
             {[
               {company: 'Stripe Inc.', sector: 'Fintech / Pagamentos', date: 'Q3 2025', status: 'Rumor', region: 'Global'},
               {company: 'SpaceX Starlink', sector: 'Aeroespacial / Tech', date: '2026', status: 'Aguardando', region: 'Global'},
               {company: 'Smart Money Corp', sector: 'IA Financeira', date: 'Dez 2024', status: 'Em Análise', region: 'Brasil'}
             ].map((ipo, i) => (
                 <div key={i} className="flex justify-between items-center p-6 bg-black/40 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer shadow-lg">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {ipo.region === 'Global' ? <Globe size={20} className="text-blue-500" /> : <Landmark size={20} className="text-emerald-500" />}
                       </div>
                       <div>
                          <p className="font-black text-white text-lg group-hover:text-blue-400 transition-colors uppercase tracking-tight">{ipo.company}</p>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">{ipo.sector}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-white tracking-tighter">{ipo.date}</p>
                       <span className="text-[9px] bg-white/5 border border-white/10 text-gray-500 px-3 py-1 rounded-lg uppercase font-black tracking-widest mt-1 inline-block">{ipo.status}</span>
                    </div>
                 </div>
             ))}
             <div className="p-10 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.01] mt-10">
                 <p className="text-xs text-gray-500 mb-6 font-bold uppercase tracking-widest">Deseja ser notificado sobre novas emissões?</p>
                 <button 
                  onClick={handleAlerts}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all text-[10px]">Ativar Alertas Push</button>
             </div>
          </div>
        </Card>
      </div>
      <Disclaimer />
    </div>
  );
};