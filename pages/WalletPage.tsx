
import React, { useState, useMemo } from 'react';
import { Download, Plus, Wallet, Trash2, ArrowUpRight, ArrowDownRight, Gem, Activity, Binary, BarChart3, AlertTriangle, Sparkles, BrainCircuit, ShieldAlert, ChevronDown, ChevronUp, RefreshCw, Loader2 } from 'lucide-react';
import { Card, MetricCard, Disclaimer, Badge } from '../components/SharedUI';
import { Asset } from '../types';
import { formatCurrency } from '../utils/math';
import { useNotification } from '../App';
import { reportService } from '../services/reportService';

interface WalletPageProps {
  assets: Asset[];
  onRemove: (index: number) => void;
  onAddClick: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const WalletPage: React.FC<WalletPageProps> = ({ assets, onRemove, onAddClick, onRefresh, isRefreshing }) => {
  const { addNotification } = useNotification();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalEquity = assets.reduce((acc, a) => acc + (a.quantity * a.currentPrice), 0);
    const totalInvested = assets.reduce((acc, a) => acc + (a.quantity * (a.averagePrice || a.currentPrice)), 0);
    const totalPL = totalEquity - totalInvested;
    const pctPL = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
    return { totalEquity, totalInvested, totalPL, pctPL };
  }, [assets]);

  const lastUpdateDisplay = useMemo(() => {
    const updates = assets.filter(a => a.updatedAt).map(a => a.updatedAt);
    return updates.length > 0 ? updates[0] : null;
  }, [assets]);

  const handleExportCSV = () => {
    if (assets.length === 0) {
      addNotification("Custódia vazia. Nada para exportar.", "error");
      return;
    }
    addNotification("Gerando relatório consolidado...", "info");
    reportService.exportToPowerBI(assets, "VANTEZ_CUSTODIA");
    addNotification("Dataset CSV exportado com sucesso!", "success");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-3xl shadow-2xl">
            <Gem className="text-blue-500 w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Custódia & Riscos</h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[4px]">Audit de Vieses & Heatmap de Correlação</p>
              {lastUpdateDisplay && (
                <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-emerald-500/20">
                  Real-time: {lastUpdateDisplay}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onRefresh}
            disabled={isRefreshing || assets.length === 0}
            className={`bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-[3px] transition-all text-[10px] flex items-center gap-3 disabled:opacity-30`}
          >
            {isRefreshing ? <Loader2 size={14} className="animate-spin text-emerald-500" /> : <RefreshCw size={14} className="text-emerald-500" />}
            {isRefreshing ? "Sincronizando..." : "Atualizar Cotações"}
          </button>
          <button 
            onClick={handleExportCSV}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[3px] transition-all text-[10px]"
          >
            Exportar CSV
          </button>
          <button onClick={onAddClick} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[3px] transition-all shadow-2xl text-[10px]">
            Registrar Ativo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Patrimônio Total" value={formatCurrency(stats.totalEquity)} change={`${stats.pctPL >= 0 ? '+' : ''}${stats.pctPL.toFixed(2)}%`} isPositive={stats.pctPL >= 0} />
        <MetricCard title="VaR (95%)" value="R$ 2.450" isPositive={true} tooltipTitle="Value at Risk" tooltipContent="Perda máxima estimada em 1 mês." />
        <MetricCard title="Sharpe Ratio" value="1.42" isPositive={true} />
        <MetricCard title="Volatilidade Anual" value="16.4%" isPositive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-0 overflow-hidden border-white/5">
           <div className="p-8 border-b border-white/5 bg-[#0e0e11] flex justify-between items-center">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[5px]">Composição da Carteira (Drill-Down)</h4>
              <Badge color="blue">B3 Live Connect</Badge>
           </div>
           <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-left border-collapse">
               <thead className="bg-black/20 text-[9px] text-gray-600 uppercase font-black tracking-[3px]">
                 <tr>
                    <th className="p-6">Ativo</th>
                    <th className="p-6 text-right">Qtd</th>
                    <th className="p-6 text-right">P. Médio</th>
                    <th className="p-6 text-right">Atual</th>
                    <th className="p-6 text-right">P&L (%)</th>
                    <th className="p-6 text-right">Ação</th>
                 </tr>
               </thead>
               <tbody className="text-xs">
                 {assets.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-20 text-center text-gray-600 uppercase font-black tracking-widest opacity-20">Nenhum ativo em custódia.</td>
                   </tr>
                 ) : assets.map((a, i) => (
                   <React.Fragment key={i}>
                    <tr 
                      className={`border-b border-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer ${expandedRow === a.ticker ? 'bg-emerald-500/[0.02]' : ''}`}
                      onClick={() => setExpandedRow(expandedRow === a.ticker ? null : a.ticker)}
                    >
                      <td className="p-6 font-black text-white">
                        {a.ticker}
                        {a.updatedAt && <span className="ml-2 text-[7px] text-emerald-500 opacity-50 uppercase">Live</span>}
                      </td>
                      <td className="p-6 text-right font-mono text-gray-400">{a.quantity}</td>
                      <td className="p-6 text-right font-mono text-gray-400">R$ {a.averagePrice.toFixed(2)}</td>
                      <td className="p-6 text-right font-mono text-white font-bold">R$ {a.currentPrice.toFixed(2)}</td>
                      <td className={`p-6 text-right font-black ${((a.currentPrice/a.averagePrice)-1) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {(((a.currentPrice/a.averagePrice)-1)*100).toFixed(2)}%
                      </td>
                      <td className="p-6 text-right flex justify-end gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                          className="p-2 hover:bg-rose-500/10 text-gray-700 hover:text-rose-500 rounded-lg transition-all"
                        >
                           <Trash2 size={14} />
                        </button>
                        {expandedRow === a.ticker ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                    </tr>
                    {expandedRow === a.ticker && (
                      <tr className="bg-black/40 border-b border-white/[0.02] animate-in slide-in-from-top-1">
                        <td colSpan={6} className="p-8">
                           <div className="grid grid-cols-4 gap-6 text-left">
                              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                 <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Piotroski F-Score</p>
                                 <p className="text-lg font-black text-white">8/9</p>
                              </div>
                              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                 <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Altman Z-Score</p>
                                 <p className="text-lg font-black text-white">3.2</p>
                              </div>
                              <div className="col-span-2 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                 <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Análise Quant Vantez</p>
                                 <p className="text-[10px] text-gray-400 font-medium">Ativo com baixo beta e alta geração de caixa. Seguro para o longo prazo.</p>
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

        <Card className="p-8 space-y-6 flex flex-col justify-between border-white/5">
           <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[4px]">Heatmap de Correlação</h4>
              <Badge color="amber">Beta 2.0</Badge>
           </div>
           
           <div className="flex-1 grid grid-cols-4 grid-rows-4 gap-2 py-4">
              {[...Array(16)].map((_, i) => (
                <div 
                  key={i} 
                  className={`rounded-lg transition-all hover:scale-110 cursor-help ${
                    i === 0 || i === 5 || i === 10 || i === 15 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                    i === 1 || i === 4 ? 'bg-rose-600' :
                    i === 2 || i === 8 ? 'bg-blue-600 opacity-60' :
                    'bg-gray-800'
                  }`}
                  title={`Ponto de Correlação ${i}`}
                />
              ))}
           </div>
           
           <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                A correlação <span className="text-rose-500 font-black">PETR4 vs Brent (0.88)</span> indica alta dependência de commodities internacionais.
              </p>
           </div>
        </Card>
      </div>

      <Disclaimer />
    </div>
  );
};
