
import React, { useState, useMemo, useEffect } from 'react';
import { Gem, Activity, Landmark, Calendar, ShieldCheck, Coins, RefreshCw, Loader2, Trash2, ChevronDown, ChevronUp, AlertTriangle, ShieldAlert, Globe } from 'lucide-react';
import { Card, MetricCard, Disclaimer, Badge } from '../components/SharedUI';
import { Asset } from '../types';
import { formatCurrency, FinancialEngine } from '../utils/math';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

interface WalletPageProps {
  assets: Asset[];
  onRemove: (index: number) => void;
  onAddClick: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const WalletPage: React.FC<WalletPageProps> = ({ assets, onRemove, onAddClick, onRefresh, isRefreshing }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selic, setSelfic] = useState(11.25);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Correctly handle the promise returned by fetchCurrentSelic
    FinancialEngine.fetchCurrentSelic().then(setSelfic);
    const timer = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // PROVENTOS
  const dividendStats = useMemo(() => {
    let totalDividends12m = 0;
    let nextEstimated = 0;
    const monthlyData: Record<string, number> = {};
    assets.forEach(asset => {
      const history = asset.dividendsHistory || [];
      history.slice(0, 12).forEach(div => {
        const date = new Date(div.date);
        const monthYear = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).toUpperCase();
        const val = (div.rate || 0) * (asset.quantity || 0);
        totalDividends12m += val;
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + val;
      });
      if (asset.type === 'FII' && asset.lastDividend) {
        nextEstimated += asset.lastDividend * asset.quantity;
      }
    });
    const chartData = Object.entries(monthlyData).map(([name, value]) => ({ name, value })).slice(-6);
    const avgMonthly = chartData.length > 0 ? chartData.reduce((acc, c) => acc + c.value, 0) / chartData.length : 0;
    return { totalDividends12m, nextEstimated, chartData, avgMonthly };
  }, [assets]);

  // ATRIBUIÇÃO DE PERFORMANCE
  const contributionData = useMemo(() => {
    const totalEquity = assets.reduce((acc, a) => acc + (a.quantity * a.currentPrice), 0);
    if (totalEquity === 0) return [];
    return assets.map(a => {
      const weight = (a.quantity * a.currentPrice) / totalEquity;
      const ret = a.averagePrice > 0 ? (a.currentPrice / a.averagePrice) - 1 : 0;
      return { ticker: a.ticker, value: weight * ret * 100 };
    }).sort((a, b) => b.value - a.value);
  }, [assets]);

  // MONITORAMENTO FGC
  const fgcMonitor = useMemo(() => {
    const data: Record<string, number> = {};
    assets.forEach(a => {
      if ((a.type === 'Renda Fixa' || a.fgcCoberto) && a.emissor) {
        data[a.emissor] = (data[a.emissor] || 0) + (a.currentPrice * a.quantity);
      }
    });
    return Object.entries(data).map(([emissor, total]) => ({
      emissor, total, percent: (total / 250000) * 100, isRisk: total > 200000
    }));
  }, [assets]);

  const stats = useMemo(() => {
    const totalEquity = assets.reduce((acc, a) => acc + (a.quantity * a.currentPrice), 0);
    const totalInvested = assets.reduce((acc, a) => acc + (a.quantity * a.averagePrice), 0);
    const pctPL = totalInvested > 0 ? ((totalEquity / totalInvested) - 1) * 100 : 0;
    const retornoReal = (((1 + (pctPL / 100)) / (1 + 0.0397)) - 1) * 100;
    return { totalEquity, totalInvested, pctPL, retornoReal };
  }, [assets]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-3xl shadow-2xl">
            <Gem className="text-blue-500 w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Custódia & Riscos</h2>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[4px] mt-1">Audit de Vieses & Heatmap de Correlação</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onRefresh} disabled={isRefreshing} className="bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 disabled:opacity-30">
            {isRefreshing ? <Loader2 size={14} className="animate-spin text-emerald-500" /> : <RefreshCw size={14} className="text-emerald-500" />}
            Sincronizar Terminal
          </button>
          <button onClick={onAddClick} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] shadow-2xl">
            Registrar Ativo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard title="Patrimônio Total" value={formatCurrency(stats.totalEquity)} change={`${stats.pctPL >= 0 ? '+' : ''}${stats.pctPL.toFixed(2)}%`} isPositive={stats.pctPL >= 0} />
        <MetricCard title="Retorno Real" value={`${stats.retornoReal >= 0 ? '+' : ''}${stats.retornoReal.toFixed(2)}%`} isPositive={stats.retornoReal >= 0} tooltipTitle="Poder de Compra" tooltipContent="Considera inflação oficial de 3.97%." />
        <MetricCard title="DY Médio (12M)" value={`${((dividendStats.totalDividends12m / (stats.totalInvested || 1)) * 100).toFixed(2)}%`} isPositive={true} />
        <MetricCard title="VaR (95%)" value="R$ 2.450" isPositive={true} />
        <MetricCard title="Volatilidade" value="16.4%" isPositive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-8 space-y-8 bg-emerald-500/[0.01] border-emerald-500/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white uppercase tracking-[4px] flex items-center gap-3"><Coins className="text-emerald-500"/> Proventos</h3>
            <Badge color="emerald">Média: {formatCurrency(dividendStats.avgMonthly)}</Badge>
          </div>
          <div className="h-[180px] w-full bg-black/20 rounded-2xl p-4">
             {isMounted && (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={dividendStats.chartData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                   <XAxis dataKey="name" fontSize={8} stroke="#444" hide />
                   <Bar dataKey="value" radius={[4,4,0,0]}>
                     {dividendStats.chartData.map((_, i) => <Cell key={i} fill={i === dividendStats.chartData.length-1 ? '#10b981' : '#333'} />)}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             )}
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <p className="text-[8px] text-gray-600 uppercase font-black">Total 12M</p>
                <p className="text-sm font-black text-white">{formatCurrency(dividendStats.totalDividends12m)}</p>
             </div>
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <p className="text-[8px] text-gray-600 uppercase font-black">Estimado Próximo</p>
                <p className="text-sm font-black text-emerald-400">{formatCurrency(dividendStats.nextEstimated)}</p>
             </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-0 overflow-hidden border-white/5">
          <div className="p-8 border-b border-white/5 bg-[#0e0e11] flex justify-between items-center">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[5px]">Composição Drill-Down</h4>
            <Badge color="blue">Global Sync</Badge>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-black/20 text-[9px] text-gray-600 uppercase font-black tracking-[3px]">
                <tr>
                  <th className="p-6">Ativo</th>
                  <th className="p-6 text-right">Preço</th>
                  <th className="p-6 text-right">P&L (%)</th>
                  <th className="p-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {assets.map((a, i) => (
                  <React.Fragment key={i}>
                    <tr onClick={() => setExpandedRow(expandedRow === a.ticker ? null : a.ticker)} className="border-b border-white/[0.02] hover:bg-white/[0.02] cursor-pointer">
                      <td className="p-6 font-black text-white flex items-center gap-3">
                        {a.type === 'Cripto' ? <Coins size={14} className="text-orange-500"/> : <Activity size={14} className="text-emerald-500"/>}
                        {a.ticker} <span className="text-[8px] text-gray-600 uppercase">{a.type}</span>
                      </td>
                      <td className="p-6 text-right font-mono text-gray-400">R$ {a.currentPrice?.toFixed(2)}</td>
                      <td className={`p-6 text-right font-black ${((a.currentPrice/a.averagePrice)-1) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {(((a.currentPrice/a.averagePrice)-1)*100).toFixed(2)}%
                      </td>
                      <td className="p-6 text-right"><Trash2 size={14} onClick={(e) => { e.stopPropagation(); onRemove(i); }} className="hover:text-rose-500 cursor-pointer"/></td>
                    </tr>
                    {expandedRow === a.ticker && (
                      <tr className="bg-black/40 border-b border-white/[0.02]">
                        <td colSpan={4} className="p-8">
                          <div className="grid grid-cols-4 gap-6">
                            <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                               <p className="text-[8px] text-gray-600 uppercase font-black mb-1">
                                  {a.type === 'Cripto' ? 'Market Cap (BRL)' : 'Último Provento'}
                               </p>
                               <p className="text-sm font-black text-white">
                                  {a.type === 'Cripto' 
                                    ? (a.marketCap ? `R$ ${(a.marketCap/1e9).toFixed(1)}B` : 'Sincronizar') 
                                    : (a.lastDividend ? `R$ ${a.lastDividend.toFixed(2)}` : 'N/A')}
                               </p>
                            </div>
                            <div className="col-span-3 p-4 bg-white/[0.02] rounded-xl border border-white/5 flex gap-4 overflow-x-auto">
                               {a.dividendsHistory?.slice(0, 4).map((h, idx) => (
                                 <div key={idx} className="shrink-0 flex flex-col">
                                    <span className="text-[10px] text-emerald-500 font-bold">R$ {h.rate.toFixed(2)}</span>
                                    <span className="text-[8px] text-gray-700 uppercase">{new Date(h.date).toLocaleDateString()}</span>
                                 </div>
                               ))}
                               {a.type === 'Cripto' && (
                                 <div className="flex items-center gap-4 text-gray-500 italic text-[10px]">
                                    <Globe size={14} className="text-blue-500" /> Sincronizado via CoinGecko v3 API
                                 </div>
                               )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-white/5 bg-[#0e0e11] min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[4px]">Atribuição de Performance</h4>
            <Badge color="emerald">P&L Contribution</Badge>
          </div>
          <div className="flex-1">
            {isMounted && contributionData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contributionData} layout="vertical" margin={{ left: 5, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="ticker" type="category" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px'}} itemStyle={{fontSize: '10px'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {contributionData.map((e, i) => <Cell key={i} fill={e.value >= 0 ? '#10b981' : '#f43f5e'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-8 space-y-6 flex flex-col border-white/5 bg-[#0e0e11]">
          <h4 className="text-[10px] font-black text-white uppercase tracking-[4px]">Monitoramento FGC</h4>
          <div className="space-y-6 overflow-y-auto max-h-[200px] custom-scrollbar pr-2">
            {fgcMonitor.map((item, idx) => (
              <div key={idx} className="space-y-2">
                 <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-gray-400 uppercase truncate max-w-[120px]">{item.emissor}</span>
                    <span className={`text-[10px] font-mono font-black ${item.isRisk ? 'text-rose-500' : 'text-white'}`}>{formatCurrency(item.total)}</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${item.isRisk ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, item.percent)}%` }} />
                 </div>
                 {item.isRisk && <div className="flex items-center gap-2 text-rose-500 animate-pulse"><ShieldAlert size={10} /><span className="text-[7px] font-black uppercase">Concentração Elevada</span></div>}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Disclaimer />
    </div>
  );
};
