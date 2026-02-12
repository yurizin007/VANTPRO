
import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Plus, Trash2, ArrowUpRight, ArrowDownRight, Info, AlertTriangle, CheckCircle2, History, TrendingUp, Calendar, Tag, DollarSign, Scale } from 'lucide-react';
import { Card, MetricCard, Badge, Disclaimer } from '../components/SharedUI';
import { Trade } from '../types';
import { formatCurrency } from '../utils/math';
import { useNotification } from '../App';

export const TaxPage: React.FC = () => {
  const { addNotification } = useNotification();
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('vantez_trades');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    ticker: '',
    type: 'Compra' as 'Compra' | 'Venda',
    assetType: 'Ação' as 'Ação' | 'FII' | 'Cripto',
    strategy: 'Swing Trade' as 'Swing Trade' | 'Day Trade',
    quantity: 0,
    price: 0,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    localStorage.setItem('vantez_trades', JSON.stringify(trades));
  }, [trades]);

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ticker || formData.quantity <= 0 || formData.price <= 0) {
      addNotification("Preencha todos os campos corretamente.", "error");
      return;
    }

    let calculatedProfit = 0;
    let calculatedTax = 0;

    if (formData.type === 'Venda') {
      // Cálculo simplificado de Lucro: Baseado no preço médio do ticker
      const tickerTrades = trades.filter(t => t.ticker === formData.ticker.toUpperCase());
      const buys = tickerTrades.filter(t => t.type === 'Compra');
      
      const totalCost = buys.reduce((acc, b) => acc + (b.price * b.quantity), 0);
      const totalQty = buys.reduce((acc, b) => acc + b.quantity, 0);
      const avgPrice = totalQty > 0 ? totalCost / totalQty : formData.price; // Fallback se não houver compra

      calculatedProfit = (formData.price - avgPrice) * formData.quantity;

      // Alíquotas: 
      // Day Trade: 20% (Ação, FII, Cripto)
      // Swing Trade: 15% (Ação, Cripto), 20% (FII)
      if (formData.strategy === 'Day Trade') {
        calculatedTax = calculatedProfit > 0 ? calculatedProfit * 0.20 : 0;
      } else {
        const rate = formData.assetType === 'FII' ? 0.20 : 0.15;
        calculatedTax = calculatedProfit > 0 ? calculatedProfit * rate : 0;
      }
    }

    const newTrade: Trade = {
      id: Date.now().toString(),
      ticker: formData.ticker.toUpperCase(),
      type: formData.type,
      assetType: formData.assetType,
      strategy: formData.strategy,
      quantity: formData.quantity,
      price: formData.price,
      date: formData.date,
      profit: formData.type === 'Venda' ? calculatedProfit : undefined,
      taxDue: formData.type === 'Venda' ? calculatedTax : undefined
    };

    setTrades([newTrade, ...trades]);
    addNotification(`Operação em ${newTrade.ticker} registrada!`, "success");
    setFormData({ ...formData, ticker: '', quantity: 0, price: 0 });
  };

  const removeTrade = (id: string) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  // Consolidação Mensal (Mês Atual)
  const monthlySummary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthTrades = trades.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalSales = monthTrades
      .filter(t => t.type === 'Venda' && t.assetType === 'Ação')
      .reduce((acc, t) => acc + (t.price * t.quantity), 0);

    const totalProfit = monthTrades
      .filter(t => t.type === 'Venda')
      .reduce((acc, t) => acc + (t.profit || 0), 0);

    const isExempt = totalSales < 20000;
    
    const totalTaxDue = monthTrades
      .filter(t => t.type === 'Venda')
      .reduce((acc, t) => {
        // Se for Swing Trade em Ações e Isento, tax é 0
        if (t.assetType === 'Ação' && t.strategy === 'Swing Trade' && isExempt) return acc;
        return acc + (t.taxDue || 0);
      }, 0);

    return { totalSales, totalProfit, totalTaxDue, isExempt };
  }, [trades]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-emerald-600/10 border border-emerald-500/20 p-5 rounded-3xl shadow-2xl">
            <Calculator className="text-emerald-500 w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Gestão de Impostos</h2>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[4px] mt-1">Audit de Lucros e Alíquotas DARF</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className={`px-6 py-4 rounded-2xl flex flex-col items-center justify-center border ${monthlySummary.isExempt ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
              <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Status de Isenção (Ações)</span>
              <span className={`text-sm font-black uppercase ${monthlySummary.isExempt ? 'text-emerald-500' : 'text-rose-500'}`}>
                {monthlySummary.isExempt ? 'Isento (< 20k)' : 'Tributável'}
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <MetricCard title="Vendas no Mês (Ações)" value={formatCurrency(monthlySummary.totalSales)} change={monthlySummary.isExempt ? "Dentro do Limite" : "Limite Excedido"} isPositive={monthlySummary.isExempt} />
        <MetricCard title="Lucro/Prejuízo Mensal" value={formatCurrency(monthlySummary.totalProfit)} isPositive={monthlySummary.totalProfit >= 0} />
        <MetricCard title="Imposto Estimado" value={formatCurrency(monthlySummary.totalTaxDue)} isPositive={false} tooltipTitle="Alíquotas Aplicadas" tooltipContent="Considera 15% para Swing Trade e 20% para Day Trade/FIIs." />
        <MetricCard title="Eficiência Fiscal" value={monthlySummary.totalProfit > 0 ? `${((1 - (monthlySummary.totalTaxDue / monthlySummary.totalProfit)) * 100).toFixed(1)}%` : "---"} isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulário de Registro */}
        <Card className="lg:col-span-4 p-8 space-y-8 bg-[#0c0c0e] border-white/5 h-fit">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <Plus className="text-emerald-500" />
            <h3 className="text-[11px] font-black text-white uppercase tracking-[4px]">Registrar Operação</h3>
          </div>
          
          <form onSubmit={handleAddTrade} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-2">Ativo (Ticker)</label>
                <input 
                  type="text" placeholder="PETR4" 
                  value={formData.ticker} onChange={e => setFormData({...formData, ticker: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-black uppercase outline-none focus:border-emerald-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-2">Tipo</label>
                  <select 
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs font-bold outline-none"
                  >
                    <option value="Compra">Compra</option>
                    <option value="Venda">Venda</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-2">Classe</label>
                  <select 
                    value={formData.assetType} onChange={e => setFormData({...formData, assetType: e.target.value as any})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs font-bold outline-none"
                  >
                    <option value="Ação">Ação</option>
                    <option value="FII">Fundo Imobiliário</option>
                    <option value="Cripto">Criptomoeda</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-2">Estratégia</label>
                  <select 
                    value={formData.strategy} onChange={e => setFormData({...formData, strategy: e.target.value as any})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs font-bold outline-none"
                  >
                    <option value="Swing Trade">Swing Trade</option>
                    <option value="Day Trade">Day Trade</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-2">Data</label>
                  <input 
                    type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-2">Qtd</label>
                  <input 
                    type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-sm outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-2">Preço Unit.</label>
                  <input 
                    type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-sm outline-none" 
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[4px] shadow-2xl transition-all active:scale-95">
              Registrar Operação
            </button>
          </form>
        </Card>

        {/* Histórico e Audit */}
        <Card className="lg:col-span-8 p-0 overflow-hidden border-white/5">
          <div className="p-8 border-b border-white/5 bg-[#0e0e11] flex justify-between items-center">
            <div className="flex items-center gap-4">
              <History className="text-gray-500" />
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[5px]">Log de Operações e Cálculo Tributário</h4>
            </div>
            <Badge color="blue">Local Sync Only</Badge>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-black/20 text-[9px] text-gray-600 uppercase font-black tracking-[3px]">
                <tr>
                  <th className="p-6">Ativo / Data</th>
                  <th className="p-6">Tipo / Estratégia</th>
                  <th className="p-6 text-right">Volume</th>
                  <th className="p-6 text-right">Resultado</th>
                  <th className="p-6 text-right">Imp. Est.</th>
                  <th className="p-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-gray-600 uppercase font-black tracking-widest opacity-20">Nenhuma operação registrada no log.</td>
                  </tr>
                ) : trades.map((t) => (
                  <tr key={t.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black text-white">{t.ticker}</span>
                        <span className="text-[8px] text-gray-600 uppercase">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <Badge color={t.type === 'Compra' ? 'emerald' : 'rose'}>{t.type}</Badge>
                        <span className="text-[8px] text-gray-700 font-bold uppercase">{t.strategy}</span>
                      </div>
                    </td>
                    <td className="p-6 text-right font-mono text-gray-400">
                      {t.quantity} x {formatCurrency(t.price)}
                    </td>
                    <td className={`p-6 text-right font-black ${t.profit ? (t.profit >= 0 ? 'text-emerald-500' : 'text-rose-500') : 'text-gray-700'}`}>
                      {t.profit ? formatCurrency(t.profit) : '---'}
                    </td>
                    <td className="p-6 text-right font-black text-rose-400/80">
                      {t.taxDue ? formatCurrency(t.taxDue) : '---'}
                    </td>
                    <td className="p-6 text-right">
                      <button onClick={() => removeTrade(t.id)} className="p-2 hover:bg-rose-500/10 text-gray-800 hover:text-rose-500 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-amber-500/20 bg-amber-500/[0.02] flex items-start gap-6">
           <div className="bg-amber-600 p-4 rounded-2xl shadow-xl">
              <AlertTriangle className="text-white w-6 h-6" />
           </div>
           <div className="space-y-2">
              <h5 className="text-amber-500 font-black uppercase text-[10px] tracking-[4px]">Dica Kernel: Prejuízos Acumulados</h5>
              <p className="text-sm text-gray-300 font-medium leading-relaxed">
                 Você pode compensar prejuízos de meses anteriores para abater o imposto devido agora. Mantenha seu log atualizado para cálculos precisos de compensação automática em versões futuras.
              </p>
           </div>
        </Card>
        <Card className="p-8 border-blue-500/20 bg-blue-500/[0.02] flex items-start gap-6">
           <div className="bg-blue-600 p-4 rounded-2xl shadow-xl">
              <Scale className="text-white w-6 h-6" />
           </div>
           <div className="space-y-2">
              <h5 className="text-blue-500 font-black uppercase text-[10px] tracking-[4px]">Isenção de IR em Ações</h5>
              <p className="text-sm text-gray-300 font-medium leading-relaxed">
                 Vendas de ações na modalidade Swing Trade abaixo de R$ 20.000,00 por mês calendário são isentas de Imposto de Renda. FIIs e Day Trade não possuem isenção.
              </p>
           </div>
        </Card>
      </div>

      <Disclaimer />
    </div>
  );
};
