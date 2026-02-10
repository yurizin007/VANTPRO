
import React, { useState } from 'react';
import { Landmark, Calculator, Tag, Info, ArrowRight, Clock } from 'lucide-react';
import { Card, Disclaimer } from '../components/SharedUI';
import { formatCurrency } from '../utils/math';

export const TesouroPage: React.FC = () => {
  const [aporte, setAporte] = useState(1000);
  const [taxa, setTaxa] = useState(11.75);
  const [months, setMonths] = useState(120); // 10 anos padrão em meses
  
  const total = aporte * Math.pow((1 + (taxa/100)), months/12);

  const timeLabel = months >= 12 
    ? `${Math.floor(months / 12)} Ano(s) ${months % 12 > 0 ? `e ${months % 12} Meses` : ''}` 
    : `${months} Meses`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-6">
        <div className="bg-gray-700 p-4 rounded-2xl shadow-2xl shadow-black">
          <Landmark className="text-white w-8 h-8" />
        </div>
        <div className="text-left">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Investimentos Seguros</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px]">Tesouro Direto e Renda Fixa com Garantia do Governo</p>
        </div>
      </div>

      <Card className="p-10 text-left">
        <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-10">
           <Calculator className="w-7 h-7 text-emerald-500" />
           <h3 className="text-xl font-black text-white uppercase tracking-widest">Calculadora de Futuro</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] text-gray-600 uppercase font-black tracking-[4px] block px-1">Quanto vou investir (R$)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 font-black">R$</span>
                <input 
                  type="number" 
                  value={aporte} 
                  onChange={(e) => setAporte(Number(e.target.value))} 
                  className="w-full bg-black/40 border-2 border-white/5 rounded-[1.5rem] pl-16 pr-6 py-6 text-white font-mono font-black text-3xl focus:border-emerald-500 outline-none transition-all shadow-inner" 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] text-gray-600 uppercase font-black tracking-[4px] block px-1">Qual o rendimento esperado? (% ao ano)</label>
              <div className="relative">
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-xl">%</span>
                <input 
                  type="number" 
                  step="0.01" 
                  value={taxa} 
                  onChange={(e) => setTaxa(Number(e.target.value))} 
                  className="w-full bg-black/40 border-2 border-white/5 rounded-[1.5rem] px-6 py-6 text-white font-mono font-black text-3xl focus:border-emerald-500 outline-none transition-all shadow-inner" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] text-gray-600 uppercase font-black tracking-[4px] px-1">Por quanto tempo?</label>
                <span className="text-emerald-500 font-black font-mono text-xl">{timeLabel}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="480" 
                value={months} 
                onChange={(e) => setMonths(Number(e.target.value))} 
                className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner" 
              />
            </div>
            
            <div className="pt-12 border-t border-white/5 relative group">
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[5px] mb-4">Valor total ao final do tempo</p>
              <p className="text-7xl font-black text-emerald-400 font-mono tracking-tighter transition-transform group-hover:scale-105 duration-500">
                {formatCurrency(total)}
              </p>
            </div>
          </div>

          <div className="bg-[#16161a] rounded-[2.5rem] p-10 border-2 border-white/5 flex flex-col h-full shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Tag className="w-40 h-40 text-emerald-500" />
            </div>
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[5px] flex items-center gap-4 border-b border-white/5 pb-8 mb-8 relative z-10">
              <Tag className="w-5 h-5 text-emerald-500" /> Melhores Investimentos do Momento
            </h4>
            <div className="space-y-6 relative z-10">
              {[
                { name: 'Tesouro Selic 2029', type: 'Reserva e Liquidez Diária', rate: 'Rende ~1% ao mês' },
                { name: 'Tesouro IPCA+ 2035', type: 'Proteção contra Inflação', rate: 'Garante ganho real' },
                { name: 'Tesouro Prefixado 2031', type: 'Taxa Fixa Garantida', rate: 'Rende 12.45% a.a.' }
              ].map((t, idx) => (
                <div key={idx} className="flex justify-between items-center p-6 bg-white/[0.02] rounded-[1.5rem] hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/10 group cursor-pointer">
                  <div className="text-left">
                    <span className="text-lg font-black text-white tracking-tighter uppercase block group-hover:text-emerald-400 transition-colors">{t.name}</span>
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-[3px] mt-1 block">{t.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-500 font-black font-mono bg-emerald-500/10 px-4 py-2 rounded-xl text-xs border border-emerald-500/20">{t.rate}</span>
                    <ArrowRight size={18} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-10 flex items-center gap-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest border-t border-white/5 relative z-10">
               <Info size={16} className="text-blue-500" /> Dica: Esses valores são brutos (antes do imposto).
            </div>
          </div>
        </div>
      </Card>
      <Disclaimer />
    </div>
  );
};
