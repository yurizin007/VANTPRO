import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Umbrella, Calculator, Target, Download, ChevronRight, TrendingUp, Loader2 } from 'lucide-react';
import { Card, Disclaimer } from '../components/SharedUI';
import { formatCurrency } from '../utils/math';
import { useNotification } from '../App';

export const PrevidenciaPage: React.FC = () => {
  const { addNotification } = useNotification();
  const [salary, setSalary] = useState(150000);
  const [contribution, setContribution] = useState(1500);
  const [years, setYears] = useState(25);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);
  
  const maxDed = salary * 0.12;
  const taxSaving = maxDed * 0.275;

  const handleApplyMax = () => {
    const idealMonthly = Math.ceil(maxDed / 12);
    setContribution(idealMonthly);
    addNotification(`Aporte ajustado para R$ ${idealMonthly} (Teto Fiscal).`, "success");
  };

  const projectionData = useMemo(() => {
     return Array.from({length: years}, (_, i) => {
       const year = new Date().getFullYear() + i;
       const total = contribution * 12 * (i + 1) * Math.pow(1.06, i); 
       return { name: year, valor: Math.round(total) };
     });
  }, [years, contribution]);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex items-center gap-6">
        <div className="bg-amber-600 p-4 rounded-2xl shadow-2xl shadow-amber-900/40">
          <Umbrella className="text-white w-8 h-8" />
        </div>
        <div className="text-left">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Planejamento Previdenciário</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px]">Otimização de Benefício Fiscal e Renda Perpétua</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
        <Card className="p-10 space-y-10">
          <div className="flex items-center gap-4 border-b border-white/5 pb-8">
            <Calculator className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xs font-black text-white uppercase tracking-[4px]">Vantagem Fiscal (PGBL)</h3>
          </div>
          
          <div className="space-y-8 text-left">
            <div className="space-y-3">
              <label className="text-[10px] text-gray-600 uppercase font-black tracking-widest block px-1">Renda Bruta Tributável (Anual)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 font-black">R$</span>
                <input 
                  type="number" 
                  value={salary} 
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full bg-black/40 border-2 border-white/5 rounded-[1.5rem] p-6 pl-16 text-white font-mono text-2xl focus:border-emerald-500 outline-none transition-all shadow-inner font-black"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600/10 to-transparent p-8 rounded-[2rem] border border-emerald-500/20 shadow-2xl">
              <div className="flex justify-between items-center mb-4 text-left">
                <span className="text-[9px] text-emerald-400/70 font-black uppercase tracking-[3px]">Teto Dedutível (12%)</span>
                <span className="text-2xl font-black text-white">{formatCurrency(maxDed)}</span>
              </div>
              <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div className="bg-emerald-500 h-full w-[12%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
              </div>
              <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs text-gray-300 font-black uppercase tracking-widest">Economia IRPF</span>
                </div>
                <span className="text-3xl font-black text-emerald-400 tracking-tighter">
                  {formatCurrency(taxSaving)}
                </span>
              </div>
            </div>

            <button 
              onClick={handleApplyMax}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[5px] transition-all shadow-2xl shadow-emerald-900/40 active:scale-95"
            >
              Aplicar Teto Máximo
            </button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-10">
          <Card className="p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
               <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-4">
                  <TrendingUp className="w-6 h-6 text-amber-500" /> Projeção Patrimonial
               </h3>
               <div className="flex gap-6">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Aporte Mensal</p>
                    <input type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} className="bg-transparent text-right text-white font-black text-base border-b border-white/5 w-24 outline-none focus:border-amber-500 py-1" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Horizonte (Anos)</p>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="bg-transparent text-right text-white font-black text-base border-b border-white/5 w-16 outline-none focus:border-amber-500 py-1" />
                  </div>
               </div>
            </div>
            
            <div className="w-full h-[350px] min-h-[350px] bg-black/20 rounded-[2.5rem] p-4">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#444" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '15px' }} 
                      itemStyle={{fontSize: '11px', fontWeight: 'bold'}}
                     />
                    <Area type="monotone" dataKey="valor" stroke="#f59e0b" strokeWidth={4} fill="url(#colorWealth)" animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <p className="text-center text-[10px] text-gray-600 mt-6 italic font-bold uppercase tracking-widest">Simulação com taxa real líquida de 6.0% a.a.</p>
          </Card>

          <Card className="p-0 overflow-hidden border border-white/5 text-left">
             <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[4px]">Curadoria Vantez Select</h3>
                <span className="text-[9px] bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 font-black uppercase tracking-widest">Premium Allocation</span>
             </div>
             <div className="divide-y divide-white/[0.03]">
                {[
                  { name: 'Vantez Prev Quality', type: 'Renda Fixa Ativa', ret: '13.4%' },
                  { name: 'Vantez Macro Prev', type: 'Multimercado', ret: '11.2%' },
                  { name: 'Vantez Global Growth', type: 'Ações / BDRs', ret: '18.8%' }
                ].map((fund, i) => (
                  <div 
                    key={i} 
                    onClick={() => addNotification(`Solicitando lâmina do fundo ${fund.name}...`, "info")}
                    className="flex justify-between items-center p-8 hover:bg-white/[0.02] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xs text-emerald-500 border border-white/10 group-hover:scale-110 transition-transform">
                          {fund.name[0]}
                       </div>
                       <div className="text-left">
                          <p className="font-black text-white text-lg tracking-tighter group-hover:text-amber-500 transition-colors uppercase">{fund.name}</p>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{fund.type}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="text-emerald-500 font-black text-base">{fund.ret}</p>
                          <p className="text-[9px] text-gray-600 uppercase font-black">12 Meses</p>
                       </div>
                       <ChevronRight size={24} className="text-gray-700 group-hover:text-white transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
};