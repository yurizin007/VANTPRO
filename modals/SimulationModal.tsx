
import React, { useState, useMemo } from 'react';
import { X, TrendingUp, ShieldCheck, Landmark, Coins, AlertTriangle, ArrowRight, Info, Sparkles, Binary, HeartPulse } from 'lucide-react';
import { Card, Badge } from '../components/SharedUI';
import { UserProfile } from '../types';
import { formatCurrency } from '../utils/math';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, onClose, profile }) => {
  const [amount, setAmount] = useState(500);

  const selicReturn = useMemo(() => amount * Math.pow(1.12, 5), [amount]);
  const stockReturn = useMemo(() => amount * Math.pow(1.18, 5), [amount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)] relative overflow-hidden flex flex-col h-full max-h-[90vh]">
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-600/5 to-transparent">
          <div className="flex items-center gap-6">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-xl">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Planejador de Aporte <span className="text-emerald-500 italic">IA</span></h3>
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[4px]">Simulação Contextual para Perfil {profile.perfilRisco}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all text-gray-600 hover:text-white"><X size={28} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          {/* Slider de Valor */}
          <div className="space-y-8 text-center bg-black/40 p-10 rounded-[2.5rem] border border-white/5 shadow-inner">
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-[5px]">Quanto você pretende investir hoje?</p>
             <h4 className="text-6xl font-black text-white font-mono tracking-tighter">{formatCurrency(amount)}</h4>
             <input 
               type="range" min="100" max="10000" step="100"
               value={amount}
               onChange={(e) => setAmount(Number(e.target.value))}
               className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Opção Recomendada */}
            <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${profile.faseAtual < 3 ? 'border-emerald-500/40 bg-emerald-500/[0.02]' : 'border-white/5 opacity-50'}`}>
               <div className="flex justify-between items-start mb-6">
                  <Badge color="emerald">Recomendado</Badge>
                  <Landmark className="text-emerald-500" />
               </div>
               <h5 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Tesouro Selic 2029</h5>
               <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[3px] mb-6">Renda Fixa • Liquidez Diária</p>
               
               <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-gray-500">Segurança</span>
                     <span className="text-emerald-500">Máxima</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Previsão 5 Anos</span>
                     <span className="text-xl font-black text-white font-mono">{formatCurrency(selicReturn)}</span>
                  </div>
                  <button className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                     Simular na Carteira <ArrowRight size={14} />
                  </button>
               </div>
            </div>

            {/* Opção de Risco */}
            <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${profile.faseAtual === 3 ? 'border-blue-500/40 bg-blue-500/[0.02]' : 'border-white/5 grayscale opacity-30'}`}>
               <div className="flex justify-between items-start mb-6">
                  <Badge color="blue">Risco Elevado</Badge>
                  <TrendingUp className="text-blue-500" />
               </div>
               <h5 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Carteira Alpha (B3)</h5>
               <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[3px] mb-6">Ações & FIIs • Volatilidade</p>
               
               <div className="space-y-4 pt-6 border-t border-white/5 text-left">
                  {profile.faseAtual < 3 && (
                    <div className="flex items-start gap-3 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 mb-4">
                       <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                       <p className="text-[9px] text-rose-400 font-black uppercase leading-tight tracking-widest">
                          Kernel Alerta: Você ainda não tem Reserva de Emergência. Investir aqui agora é temerário.
                       </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-gray-500">Segurança</span>
                     <span className="text-rose-500">Baixa</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Previsão 5 Anos</span>
                     <span className="text-xl font-black text-white font-mono">{formatCurrency(stockReturn)}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-8 group">
             <div className="bg-emerald-600/20 p-5 rounded-3xl shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles size={32} className="text-emerald-500" />
             </div>
             <div className="text-left space-y-1">
                <h6 className="text-emerald-500 text-[9px] font-black uppercase tracking-[4px]">Dica Vantez Mastery</h6>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                   "Ao investir {formatCurrency(amount)} mensalmente por 10 anos, seu patrimônio estimado chegará a <span className="text-white font-black">{formatCurrency(amount * 180)}</span>. O segredo não é o valor, é a **consistência**."
                </p>
             </div>
          </div>
        </div>

        <div className="p-10 border-t border-white/5 bg-black/40 flex justify-center">
           <button onClick={onClose} className="text-[10px] font-black text-gray-700 hover:text-white uppercase tracking-[5px] transition-all">✕ Fechar Simulador JIT</button>
        </div>
      </Card>
    </div>
  );
};
