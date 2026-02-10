
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Activity, Download, Binary, ShieldAlert, Loader2, Info
} from 'lucide-react';
import { Asset } from '../types';
import { Card, Badge, MetricCard } from '../components/SharedUI';
import { ChartDefinitivo } from '../components/ChartDefinitivo';
import { geometricBrownianMotion, parsePrice, FinancialEngine } from '../utils/math';
import { useNotification } from '../App';
import { geminiService } from '../services/geminiService';
import { reportService } from '../services/reportService';

export const AssetAnalysisModal: React.FC<{ asset: Asset, isOpen: boolean, onClose: () => void }> = ({ asset, isOpen, onClose }) => {
  const { addNotification } = useNotification();
  const [stressScenario, setStressScenario] = useState('Normal');
  const [isExporting, setIsExporting] = useState(false);

  const analyzed = useMemo(() => asset.valuation ? asset : FinancialEngine.analyze(asset) as Asset, [asset]);
  const price = parsePrice(analyzed.currentPrice);

  const monteCarloData = useMemo(() => {
    let volMultiplier = stressScenario === 'Crise' ? 2.5 : stressScenario === 'Pandemia' ? 4 : 1;
    const sigma = (analyzed.risk_metrics?.volatility || 0.25) * volMultiplier;
    const paths = geometricBrownianMotion(price, 0.12, sigma, 30/365, 30);
    return paths.map(p => ({
        time: p.time,
        price: p.p50,
        p90: p.p90,
        p10: p.p10
    }));
  }, [price, stressScenario, analyzed]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 overflow-hidden text-left font-sans">
      <div className="bg-[#0a0a0c] border border-white/10 w-full max-w-7xl h-full rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-600/5 via-transparent">
          <div className="flex items-center gap-8">
            <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem]">
              <Binary className="text-blue-500 w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-mono">{analyzed.ticker}</h2>
              <Badge color={analyzed.valuation?.status === 'UNDERVALUED' ? 'emerald' : 'blue'}>
                {analyzed.valuation?.status === 'UNDERVALUED' ? 'Desconto Detectado' : 'Valuation Justo'}
              </Badge>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-full transition-colors text-gray-700 hover:text-white">
            <X size={32} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <MetricCard title="Preço Graham" value={analyzed.valuation?.grahamPrice ? `R$ ${analyzed.valuation.grahamPrice.toFixed(2)}` : 'N/A'} />
            <MetricCard title="Teto Bazin (6%)" value={analyzed.valuation?.bazinCeiling ? `R$ ${analyzed.valuation.bazinCeiling.toFixed(2)}` : 'N/A'} />
            <MetricCard title="Gordon Dynamic" value={analyzed.valuation?.gordonPrice ? `R$ ${analyzed.valuation.gordonPrice.toFixed(2)}` : 'N/A'} />
            <MetricCard title="VaR (95%)" value={`${analyzed.risk_metrics?.var95?.toFixed(2)}%`} />
          </div>

          <Card className="p-10 border-white/[0.06] bg-[#0c0c0e] text-left">
             <div className="flex justify-between items-center mb-10">
                <h5 className="text-white font-black text-lg uppercase tracking-widest flex items-center gap-4">
                    <Activity className="w-7 h-7 text-emerald-500" /> Previsão Monte Carlo (30D)
                </h5>
                <div className="flex gap-2">
                   {['Normal', 'Crise', 'Pandemia'].map(sc => (
                     <button key={sc} onClick={() => setStressScenario(sc)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${stressScenario === sc ? 'bg-rose-600 text-white shadow-lg' : 'text-gray-600 hover:text-white'}`}>{sc}</button>
                   ))}
                </div>
             </div>
             
             {/* USO DO COMPONENTE DEFINITIVO COM ALTURA FIXA GARANTIDA NO CONTAINER PAI */}
             <div className="chart-wrapper h-[350px] w-full bg-black/20 rounded-3xl overflow-hidden p-4">
                <ChartDefinitivo data={monteCarloData} color={stressScenario === 'Normal' ? '#3b82f6' : '#ef4444'} />
             </div>
             
             <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-start gap-4">
                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Este modelo utiliza 500 simulações de **Movimento Browniano Geométrico** com a volatilidade ajustada pelo cenário de estresse selecionado. A linha principal representa a mediana dos retornos.
                </p>
             </div>
          </Card>
        </div>

        <div className="p-10 border-t border-white/5 bg-[#08080a] flex justify-between items-center">
          <div className="flex gap-4">
             <Badge color="blue">Sharpe: {analyzed.risk_metrics?.sharpeProjected?.toFixed(2)}</Badge>
             <Badge color="amber">Beta: {analyzed.risk_metrics?.beta?.toFixed(2)}</Badge>
          </div>
          <button 
            onClick={() => { setIsExporting(true); setTimeout(() => setIsExporting(false), 2000); reportService.openLoadingPDF(); }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[4px] shadow-2xl transition-all flex items-center gap-3"
          >
            {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
            Exportar Deep Analysis (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};
