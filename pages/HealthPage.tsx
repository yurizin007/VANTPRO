import React, { useMemo } from 'react';
import { 
  HeartPulse, Calculator, Plus, Trash2, TrendingUp, 
  AlertCircle, HandMetal, BrainCircuit, PiggyBank, 
  ShieldAlert, ShieldCheck, Flame, Zap, ArrowRight,
  Target, Info, Wallet
} from 'lucide-react';
import { Card, Disclaimer, Badge } from '../components/SharedUI';
import { formatCurrency } from '../utils/math';
import { Expense, Debt } from '../types';

interface HealthPageProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  income: number;
  setIncome: (val: number) => void;
  debts: Debt[];
  setDebts: React.Dispatch<React.SetStateAction<Debt[]>>;
  savingsAccount: number;
  setSavingsAccount: (val: number) => void;
}

export const HealthPage: React.FC<HealthPageProps> = ({ 
  expenses, setExpenses, 
  income, setIncome, 
  debts, setDebts, 
  savingsAccount, setSavingsAccount 
}) => {
  // CÁLCULOS TÉCNICOS
  const totalEssencial = useMemo(() => expenses.filter(e => e.category === 'Essencial').reduce((acc, curr) => acc + curr.value, 0), [expenses]);
  const totalEstilo = useMemo(() => expenses.filter(e => e.category === 'Estilo de Vida').reduce((acc, curr) => acc + curr.value, 0), [expenses]);
  const totalExpenses = totalEssencial + totalEstilo;
  const totalDebtBalance = useMemo(() => debts.reduce((acc, d) => acc + d.balance, 0), [debts]);
  const totalDebtPayments = useMemo(() => debts.reduce((acc, d) => acc + d.minPayment, 0), [debts]);
  
  const investableAmount = income - totalExpenses - totalDebtPayments;
  const burnRate = (totalExpenses / (income || 1)) * 100;
  const monthsOfRunway = totalExpenses > 0 ? (savingsAccount / totalExpenses).toFixed(1) : "0";

  // Score de Saúde Financeira
  const healthScore = useMemo(() => {
    let score = 100;
    if (burnRate > 70) score -= 30;
    if (totalDebtBalance > income * 2) score -= 40;
    if (parseFloat(monthsOfRunway) < 3) score -= 20;
    if (investableAmount < 0) score -= 50;
    return Math.max(0, score);
  }, [burnRate, totalDebtBalance, income, monthsOfRunway, investableAmount]);

  const addExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      category: 'Essencial',
      label: 'Novo Item',
      value: 0
    };
    setExpenses([...expenses, newExpense]);
  };

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      label: 'Nova Dívida',
      balance: 0,
      interestRate: 0,
      minPayment: 0
    };
    setDebts([...debts, newDebt]);
  };

  const adviceText = useMemo(() => {
    const statusText = healthScore < 50 ? 'Sua situação é crítica.' : 'Você está no caminho certo.';
    const debtAdvice = totalDebtBalance > 0 
      ? `Priorize o pagamento de suas dívidas devido às taxas de juros incidentes.` 
      : 'Seus passivos estão sob controle.';
    return `${statusText} Sua reserva atual cobre ${monthsOfRunway} meses de vida. ${debtAdvice}`;
  }, [healthScore, monthsOfRunway, totalDebtBalance]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-rose-600 p-5 rounded-[1.5rem] shadow-2xl shadow-rose-900/30">
            <HeartPulse className="text-white w-8 h-8" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Audit de <span className="text-rose-500">Sobrevivência</span></h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px] mt-1">Diagnóstico de Solvência e Reserva Estrutural</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="bg-black/40 border border-white/5 px-8 py-4 rounded-2xl flex flex-col items-center justify-center">
              <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Custo de Vida</span>
              <span className="text-xl font-black text-white font-mono">{formatCurrency(totalExpenses)}</span>
           </div>
           <div className="bg-emerald-600/10 border border-emerald-500/20 px-8 py-4 rounded-2xl flex flex-col items-center justify-center">
              <span className="text-[8px] text-emerald-500/50 font-black uppercase tracking-widest mb-1">Capacidade de Aporte</span>
              <span className="text-xl font-black text-emerald-500 font-mono">{formatCurrency(investableAmount)}</span>
           </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5">
            <BrainCircuit className="w-48 h-48 text-blue-500" />
         </div>
         <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-500">
            <HandMetal className="text-white w-10 h-10" />
         </div>
         <div className="space-y-3 relative z-10 text-left">
            <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-[6px]">Vantez Kernel Advice</h4>
            <p className="text-xl text-gray-200 font-bold leading-relaxed italic max-w-4xl">
              {adviceText}
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <Card className="p-10 space-y-12">
            <div className="flex justify-between items-center border-b border-white/5 pb-8">
               <div className="flex items-center gap-4">
                 <PiggyBank className="w-7 h-7 text-emerald-500" />
                 <h3 className="font-black text-white uppercase text-sm tracking-[4px]">Fluxo de Caixa Mensal</h3>
               </div>
               <div className="flex gap-3">
                  <button onClick={addExpense} className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-3">
                    <Plus size={14} /> Novo Gasto
                  </button>
               </div>
            </div>

            <div className="space-y-12">
               <div className="space-y-4">
                  <label className="text-[10px] text-emerald-500 uppercase font-black tracking-widest block px-1">Renda Mensal Líquida (O que cai na conta)</label>
                  <div className="relative">
                     <span className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-2xl">R$</span>
                     <input 
                       type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))}
                       className="w-full bg-black/40 border-2 border-white/5 rounded-[2rem] p-8 pl-20 text-white font-mono font-black text-4xl focus:border-emerald-500 outline-none shadow-inner transition-all"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-[4px] px-2 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-blue-500" /> Essenciais
                     </h4>
                     <div className="space-y-3">
                        {expenses.filter(e => e.category === 'Essencial').map(exp => (
                          <div key={exp.id} className="flex gap-3 items-center group bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                             <input 
                               type="text" value={exp.label} onChange={(e) => setExpenses(prev => prev.map(p => p.id === exp.id ? {...p, label: e.target.value} : p))}
                               className="flex-1 bg-transparent border-none p-3 text-xs font-bold text-gray-400 outline-none"
                             />
                             <input 
                               type="number" value={exp.value} onChange={(e) => setExpenses(prev => prev.map(p => p.id === exp.id ? {...p, value: Number(e.target.value)} : p))}
                               className="w-24 bg-black/40 rounded-xl p-3 text-right font-mono font-black text-white text-xs border border-white/5 outline-none"
                             />
                             <button onClick={() => setExpenses(prev => prev.filter(p => p.id !== exp.id))} className="p-3 text-gray-700 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-[4px] px-2 flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" /> Estilo de Vida
                     </h4>
                     <div className="space-y-3">
                        {expenses.filter(e => e.category === 'Estilo de Vida').map(exp => (
                          <div key={exp.id} className="flex gap-3 items-center group bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                             <input 
                               type="text" value={exp.label} onChange={(e) => setExpenses(prev => prev.map(p => p.id === exp.id ? {...p, label: e.target.value} : p))}
                               className="flex-1 bg-transparent border-none p-3 text-xs font-bold text-gray-400 outline-none"
                             />
                             <input 
                               type="number" value={exp.value} onChange={(e) => setExpenses(prev => prev.map(p => p.id === exp.id ? {...p, value: Number(e.target.value)} : p))}
                               className="w-24 bg-black/40 rounded-xl p-3 text-right font-mono font-black text-white text-xs border border-white/5 outline-none"
                             />
                             <button onClick={() => setExpenses(prev => prev.filter(p => p.id !== exp.id))} className="p-3 text-gray-700 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </Card>

          <Card className="p-10 border-rose-500/10 bg-rose-500/[0.01] space-y-10">
             <div className="flex justify-between items-center border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                   <ShieldAlert className="w-7 h-7 text-rose-500" />
                   <h3 className="font-black text-white uppercase text-sm tracking-[4px]">Passivos e Dívidas (Fase 1)</h3>
                </div>
                <button onClick={addDebt} className="bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-rose-500/20 flex items-center gap-3">
                   <Plus size={14} /> Mapear Dívida
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {debts.map(debt => (
                  <div key={debt.id} className="bg-black/60 p-6 rounded-3xl border border-white/5 relative group">
                     <button 
                       onClick={() => setDebts(prev => prev.filter(p => p.id !== debt.id))}
                       className="absolute top-4 right-4 text-gray-800 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                        <Trash2 size={14} />
                     </button>
                     <div className="space-y-5 text-left">
                        <input 
                           type="text" value={debt.label} 
                           onChange={(e) => setDebts(prev => prev.map(p => p.id === debt.id ? {...p, label: e.target.value} : p))}
                           className="bg-transparent border-none p-0 text-white font-black uppercase text-sm w-full outline-none"
                        />
                        <div className="space-y-4">
                           <div>
                              <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Saldo Devedor</p>
                              <div className="flex items-center gap-2">
                                 <span className="text-gray-500 font-bold text-xs">R$</span>
                                 <input 
                                    type="number" value={debt.balance} 
                                    onChange={(e) => setDebts(prev => prev.map(p => p.id === debt.id ? {...p, balance: Number(e.target.value)} : p))}
                                    className="bg-transparent border-none text-white font-mono font-black text-xl w-full outline-none"
                                 />
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Juros (% p.m.)</p>
                                 <input 
                                    type="number" value={debt.interestRate} 
                                    onChange={(e) => setDebts(prev => prev.map(p => p.id === debt.id ? {...p, interestRate: Number(e.target.value)} : p))}
                                    className="bg-transparent border-none text-rose-500 font-mono font-black text-sm w-full outline-none"
                                 />
                              </div>
                              <div>
                                 <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Parcela</p>
                                 <input 
                                    type="number" value={debt.minPayment} 
                                    onChange={(e) => setDebts(prev => prev.map(p => p.id === debt.id ? {...p, minPayment: Number(e.target.value)} : p))}
                                    className="bg-transparent border-none text-white font-mono font-black text-sm w-full outline-none"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <Card className="p-10 flex flex-col items-center text-center bg-gradient-to-b from-[#121214] to-black border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-20" />
              <p className="text-gray-600 text-[11px] font-black uppercase tracking-[5px] mb-12">Survival Audit Score</p>
              
              <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full blur-[50px] opacity-10 ${healthScore > 70 ? 'bg-emerald-500' : healthScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-white/[0.03]" />
                    <circle 
                      cx="128" cy="128" r="110" 
                      stroke="currentColor" strokeWidth="14" fill="transparent" 
                      strokeDasharray="690" 
                      strokeDashoffset={690 - (690 * healthScore) / 100} 
                      className={`${healthScore > 70 ? 'text-emerald-500' : healthScore > 40 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-[2000ms] shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-7xl font-black text-white font-mono tracking-tighter">{healthScore}</span>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Pontos</span>
                  </div>
              </div>

              <div className="mt-12 space-y-6 w-full">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Burn Rate</p>
                       <p className={`text-xl font-black ${burnRate > 80 ? 'text-rose-500' : 'text-white'}`}>{burnRate.toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Runway</p>
                       <p className="text-xl font-black text-emerald-500">{monthsOfRunway} m</p>
                    </div>
                 </div>
                 <Badge color={healthScore > 70 ? "emerald" : healthScore > 40 ? "amber" : "rose"}>
                    {healthScore > 70 ? 'Terminal Seguro' : healthScore > 40 ? 'Sinal de Atenção' : 'Risco de Insolvência'}
                 </Badge>
              </div>
           </Card>

           <Card className="p-10 border-blue-500/10 bg-blue-500/[0.01] space-y-8 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Target className="w-32 h-32 text-blue-500" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                 <div className="bg-blue-600 p-3 rounded-2xl">
                    <Target className="text-white w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[4px]">Reserva de Emergência</h4>
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Meta de 6 meses</p>
                 </div>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Valor Guardado</span>
                       <span className="text-2xl font-black text-white font-mono">{formatCurrency(savingsAccount)}</span>
                    </div>
                    <input 
                       type="range" min="0" max={totalExpenses * 12} step="500"
                       value={savingsAccount} onChange={(e) => setSavingsAccount(Number(e.target.value))}
                       className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                 </div>

                 <div className="p-6 bg-black/40 border border-white/5 rounded-[2rem]">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                       <span className="text-gray-600">Progresso da Meta</span>
                       <span className="text-blue-400">{Math.min(100, (savingsAccount / (totalExpenses * 6 || 1)) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                       <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${Math.min(100, (savingsAccount / (totalExpenses * 6 || 1)) * 100)}%` }} />
                    </div>
                    <p className="text-[9px] text-gray-700 mt-4 font-medium italic">
                       Sua meta é acumular <span className="text-white font-black">{formatCurrency(totalExpenses * 6)}</span> para total segurança.
                    </p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
};