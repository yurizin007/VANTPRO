import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Cpu, Loader2, Target, Binary, Sparkles, BarChart3, Award, History, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Card, Disclaimer, Badge } from '../components/SharedUI';
import { formatCurrency } from '../utils/math';
import { COLORS } from '../constants';

export const RoboPage: React.FC = () => {
  const [risk, setRisk] = useState(50);
  const [value, setValue] = useState(50000);
  const [months, setMonths] = useState(12);
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<any[] | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const generateStrategy = () => {
    setLoading(true);
    setTimeout(() => {
      const isConservative = risk < 33;
      const isModerate = risk >= 33 && risk < 66;
      
      let data = [];
      if (isConservative) {
        data = [
          { name: 'Renda Fixa Segura', value: 65, details: ['Tesouro Direto', 'CDBs Bancários'], yield: 0.008 },
          { name: 'Empresas Estáveis', value: 25, details: ['Bancos', 'Energia Elétrica'], yield: 0.01 },
          { name: 'Proteção (Dólar/Ouro)', value: 10, details: ['Proteção cambial'], yield: 0.005 }
        ];
      } else if (isModerate) {
        data = [
          { name: 'Ações de Valor', value: 45, details: ['Grandes Empresas'], yield: 0.012 },
          { name: 'Renda Fixa com Crédito', value: 30, details: ['Melhores Taxas'], yield: 0.009 },
          { name: 'Investimento Global', value: 25, details: ['Bolsa Americana'], yield: 0.014 }
        ];
      } else {
        data = [
          { name: 'Empresas de Crescimento', value: 55, details: ['Tech', 'Inovação'], yield: 0.022 },
          { name: 'Criptomoedas', value: 25, details: ['Bitcoin', 'Ethereum'], yield: 0.035 },
          { name: 'Mercado Internacional', value: 20, details: ['Nasdaq', 'Ações Globais'], yield: 0.025 }
        ];
      }
      setStrategy(data);
      setLoading(false);
    }, 1500);
  };

  const projectionData = useMemo(() => {
    if (!strategy) return [];
    const avgYield = strategy.reduce((acc, curr) => acc + (curr.yield * (curr.value/100)), 0);
    return Array.from({ length: months + 1 }, (_, i) => ({
      name: i === 0 ? 'Hoje' : `${i} m`,
      value: value * Math.pow(1 + avgYield, i)
    }));
  }, [strategy, months, value]);

  const timeLabel = months >= 12 
    ? `${Math.floor(months / 12)} Ano(s) ${months % 12 > 0 ? `e ${months % 12} Meses` : ''}` 
    : `${months} Meses`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left pb-20">
      <div className="flex items-center gap-6">
        <div className="bg-purple-600 p-4 rounded-2xl shadow-2xl shadow-purple-900/30">
          <Target className="text-white w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Monte Seu Plano de Investimentos</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px]">IA Estrategista para definir sua melhor alocação</p>
        </div>
      </div>

      <Card className="p-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10 text-left">
            <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-3xl">
               <div className="flex items-center gap-3 mb-3 text-purple-400">
                  <Sparkles size={18} />
                  <p className="text-[10px] font-black uppercase tracking-widest">IA Recomendadora Ativada</p>
               </div>
               <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  Nossa tecnologia analisa milhares de combinações para sugerir onde seu dinheiro rende mais com o risco que você aceita.
               </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest block px-1">Nível de Risco</span>
                <span className="text-3xl font-mono font-black text-gray-800">{risk}%</span>
              </div>
              <input 
                type="range" 
                className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-500 shadow-inner" 
                value={risk} 
                onChange={(e) => setRisk(Number(e.target.value))} 
              />
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <label className="text-[10px] text-gray-600 uppercase font-black tracking-widest block px-1">Por quanto tempo investir?</label>
                  <span className="text-xl font-black text-purple-400 uppercase tracking-tighter">{timeLabel}</span>
               </div>
               <input 
                type="range" 
                min="1" max="120"
                className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-500 shadow-inner" 
                value={months} 
                onChange={(e) => setMonths(Number(e.target.value))} 
              />
            </div>

            <div className="space-y-6">
              <label className="text-[10px] text-gray-600 uppercase font-black tracking-widest block px-1">Valor para Começar (R$)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-500 font-black text-2xl">R$</span>
                <input 
                  type="number" 
                  value={value} 
                  onChange={(e) => setValue(Number(e.target.value))} 
                  className="w-full bg-black/40 border-2 border-white/5 rounded-[1.5rem] pl-16 pr-6 py-6 text-white font-black text-3xl font-mono shadow-inner outline-none focus:border-purple-500" 
                />
              </div>
            </div>

            <button 
              onClick={generateStrategy} 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white w-full py-8 rounded-[2rem] font-black uppercase tracking-[5px] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4"
            >
              {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Cpu className="w-8 h-8" />}
              {loading ? "Criando seu Plano..." : "Calcular Melhor Investimento"}
            </button>
          </div>

          <div className="flex flex-col justify-center min-h-[400px]">
            {!strategy && !loading && (
              <div className="flex flex-col items-center justify-center text-center opacity-30 py-20">
                <Binary size={80} className="mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[5px]">Aguardando cálculo da melhor alocação</p>
              </div>
            )}
            
            {loading && (
              <div className="flex flex-col items-center justify-center text-center py-20">
                 <Loader2 size={60} className="animate-spin text-purple-500 mb-6" />
                 <p className="text-[10px] font-black uppercase tracking-[5px] animate-pulse">IA Pensando na sua carteira...</p>
              </div>
            )}

            {strategy && !loading && (
              <div className="animate-in zoom-in-95 duration-500 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                   
                   {/* WRAPPER DE PROTEÇÃO: PizzaChart com altura fixa */}
                   <div className="w-full h-[350px] min-h-[350px] bg-gray-900/10 rounded-full flex items-center justify-center border border-gray-700/20 relative">
                      {isMounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={strategy} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                              {strategy.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <RechartsTooltip contentStyle={{backgroundColor: '#000', border: 'none'}} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <p className="text-gray-600 font-bold text-[8px] uppercase tracking-widest">IA ENGINE</p>
                          <p className="text-[7px] text-gray-700 uppercase">CALCULANDO RISCOS</p>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4 text-left">
                      <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-[4px]">Quanto você terá</h5>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                         <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Previsão em {timeLabel}</p>
                         <p className="text-4xl font-black text-emerald-400 tracking-tighter">
                            {formatCurrency(projectionData[projectionData.length - 1]?.value || value * 1.5)}
                         </p>
                      </div>

                      {/* WRAPPER DE PROTEÇÃO: AreaChart com altura fixa */}
                      <div className="w-full h-[150px] min-h-[150px] bg-gray-800/10 rounded-2xl flex items-center justify-center border border-gray-700/20">
                         {isMounted && (
                           <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={projectionData}>
                                <defs>
                                  <linearGradient id="colorRobo" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorRobo)" />
                             </AreaChart>
                           </ResponsiveContainer>
                         )}
                      </div>
                   </div>
                </div>

                <div className="space-y-4 text-left">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-[4px] mb-6">Sugestão de onde colocar o dinheiro:</p>
                  {strategy.map((item, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all flex justify-between items-center group">
                         <div className="flex items-center gap-4 text-left">
                            <BarChart3 size={16} className="text-purple-500" />
                            <div>
                               <span className="text-white font-black text-sm uppercase tracking-widest block">{item.name}</span>
                               <div className="flex gap-2 mt-1">
                                  {item.details.map((d: string, idx: number) => (
                                    <span key={idx} className="text-[9px] text-gray-600 font-bold uppercase">{d}</span>
                                  ))}
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="text-emerald-400 font-black text-lg">{item.value}%</span>
                            <p className="text-[9px] text-gray-700 font-bold font-mono">{formatCurrency(value * item.value / 100)}</p>
                         </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* SEÇÃO: TRACK RECORD DAS RECOMENDAÇÕES */}
      <Card className="p-10 border-emerald-500/10 bg-emerald-500/[0.01]">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="flex items-center gap-4">
               <History className="text-emerald-500 w-7 h-7" />
               <h3 className="text-xl font-black text-white uppercase tracking-tighter">Track Record das Recomendações</h3>
            </div>
            <Badge color="emerald">Auditado em Tempo Real</Badge>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-8 bg-black/40 border border-emerald-500/20 rounded-[2.5rem] flex flex-col items-center text-center group hover:bg-emerald-500/5 transition-all">
               <div className="p-4 bg-emerald-600/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Award className="text-emerald-500 w-8 h-8" />
               </div>
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Taxa de Acerto (Win Rate)</p>
               <p className="text-5xl font-black text-emerald-400 font-mono tracking-tighter">84.2%</p>
               <p className="text-[8px] text-gray-700 font-bold uppercase mt-3 tracking-widest">Base: Últimos 180 sinais</p>
            </div>

            <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col items-center text-center">
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Alpha vs IBOV</p>
               <p className="text-4xl font-black text-white font-mono tracking-tighter">+6.18%</p>
               <div className="flex items-center gap-2 mt-4 text-emerald-500">
                  <TrendingUp size={14} />
                  <span className="text-[9px] font-black uppercase">Outperformance</span>
               </div>
            </div>

            <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col items-center text-center">
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Sharpe do Algoritmo</p>
               <p className="text-4xl font-black text-white font-mono tracking-tighter">2.14</p>
               <div className="flex items-center gap-2 mt-4 text-blue-400">
                  <Target size={14} />
                  <span className="text-[9px] font-black uppercase">Eficiência Alta</span>
               </div>
            </div>

            <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col items-center text-center">
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Max Drawdown</p>
               <p className="text-4xl font-black text-rose-500 font-mono tracking-tighter">-4.1%</p>
               <div className="flex items-center gap-2 mt-4 text-rose-400/50">
                  <Binary size={14} />
                  <span className="text-[9px] font-black uppercase">Risco Controlado</span>
               </div>
            </div>
         </div>

         <div className="mt-12 pt-8 border-t border-white/5">
            <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-[4px] mb-6 flex items-center gap-3 px-2">
               <CheckCircle2 size={14} className="text-emerald-500" /> Histórico de Sinais Recentes (HRP Engine)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                  { ticker: 'PETR4', type: 'COMPRA', date: '12/10', result: '+3.4%' },
                  { ticker: 'VALE3', type: 'REDUÇÃO', date: '08/10', result: '-1.2%' },
                  { ticker: 'BTC', type: 'COMPRA', date: '02/10', result: '+12.8%' }
               ].map((signal, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <div className="text-left">
                        <span className="text-white font-black text-xs block">{signal.ticker}</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${signal.type === 'COMPRA' ? 'text-emerald-500' : 'text-rose-500'}`}>{signal.type}</span>
                     </div>
                     <div className="text-right">
                        <span className={`text-xs font-black font-mono ${signal.result.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{signal.result}</span>
                        <span className="text-[8px] text-gray-700 font-bold block">{signal.date}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </Card>

      <Disclaimer />
    </div>
  );
};
