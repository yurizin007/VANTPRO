
import React, { useState, useMemo } from 'react';
import { 
  Building2, Search, ChevronDown, Loader2, FileText, Activity, Plus, AlertCircle, Zap
} from 'lucide-react';
import { Card, MetricCard, Disclaimer, Badge } from '../components/SharedUI';
import { MOCK_FIIs, B3_REGISTRY } from '../constants';
import { Asset } from '../types';
import { geminiService } from '../services/geminiService';
import { reportService } from '../services/reportService';
import { FinancialEngine } from '../utils/math';
import { useNotification } from '../App';

export const FundsPage: React.FC<{ onAnalyze: (asset: Asset) => void }> = ({ onAnalyze }) => {
  // Fix typo: removed redundant assignment in destructuring which caused a constant assignment error
  const { addNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [liveFIIs, setLiveFIIs] = useState<Asset[]>(MOCK_FIIs);
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  const types = useMemo(() => {
    const filtered = liveFIIs.filter(f => 
      f.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (f.nome || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const groups: Record<string, Asset[]> = {};
    filtered.forEach(asset => {
      const s = asset.setor || "Híbrido";
      if (!groups[s]) groups[s] = [];
      groups[s].push(asset);
    });
    return groups;
  }, [liveFIIs, searchTerm]);

  const showDiscoveryPrompt = useMemo(() => {
    const term = searchTerm.toUpperCase().trim();
    const hasMatch = liveFIIs.some(f => f.ticker === term);
    const isFIITicker = /^[A-Z]{4}11$/.test(term);
    return !hasMatch && isFIITicker;
  }, [liveFIIs, searchTerm]);

  const handleDeepDiscovery = async (specificTicker?: string) => {
    if (isDiscovering) return;
    setIsDiscovering(true);
    const tickerToFind = specificTicker || searchTerm.toUpperCase().trim();
    
    addNotification(`Sincronizando Kernel com base de FIIs para ${tickerToFind}...`, "info");

    try {
      const result = await geminiService.discoverAndSyncAsset(tickerToFind);
      if (result && result.ticker) {
        setLiveFIIs(prev => {
          if (prev.some(f => f.ticker === result.ticker)) return prev;
          return [...prev, result as Asset];
        });
        addNotification(`Fundo ${tickerToFind} carregado com sucesso.`, "success");
      }
    } catch (e) {
      addNotification("Fundo não localizado nas APIs ativas.", "error");
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleDiscovery = async () => {
    if (isDiscovering) return;
    setIsDiscovering(true);
    addNotification("Sincronizando lote de fundos imobiliários...", "info");

    try {
      const currentTickers = new Set(liveFIIs.map(s => s.ticker));
      const candidates = B3_REGISTRY.FIIs.filter(t => !currentTickers.has(t)).slice(0, 3);

      if (candidates.length === 0) {
        addNotification("Todos os principais fundos já foram carregados.", "success");
        setIsDiscovering(false);
        return;
      }

      const results = await Promise.all(
        candidates.map(ticker => geminiService.discoverAndSyncAsset(ticker))
      );
      
      const newAssets = results.filter(r => r.ticker) as Asset[];
      setLiveFIIs(prev => [...prev, ...newAssets]);
      addNotification(`${newAssets.length} novos fundos adicionados.`, "success");
    } catch (e) {
      addNotification("Erro na sincronização em lote.", "error");
    } finally {
      setIsDiscovering(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-6 text-left">
          <div className="bg-sky-600 p-5 rounded-[1.5rem] shadow-2xl">
            <Building2 className="text-white w-8 h-8" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Fundos Imobiliários</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px] mt-1">Scanner de Renda Imobiliária e Dividendos</p>
          </div>
        </div>
        
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input 
            type="text" 
            placeholder="Buscar FII (ex: HGLG11)..." 
            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-white focus:border-sky-500 outline-none transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showDiscoveryPrompt && (
        <Card className="border-sky-500/20 bg-sky-500/[0.03] p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4">
           <div className="flex items-center gap-4">
              <Zap className="text-sky-400 animate-pulse" />
              <div>
                 <p className="text-white font-black uppercase text-sm">{searchTerm.toUpperCase()} não está carregado</p>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ativar descoberta profunda do Kernel para este FII?</p>
              </div>
           </div>
           <button 
             onClick={() => handleDeepDiscovery()}
             disabled={isDiscovering}
             className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2"
           >
              {isDiscovering ? <Loader2 className="animate-spin" size={14} /> : <Search size={14} />}
              Desbloquear Dados
           </button>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="ALUGUEL MÉDIO (DY)" value="11.4%" change="+0.4%" isPositive={true} />
        <MetricCard title="VOLUME DIÁRIO" value="R$ 285M" change="+5.2%" isPositive={true} />
        <MetricCard title="TAXA SELIC" value="11.25%" isPositive={true} />
        <MetricCard title="PREÇO/VALOR PATRIM." value="0.94" change="-0.02" isPositive={true} />
      </div>

      <div className="space-y-16">
        {Object.entries(types).map(([typeName, assets]) => (
          <div key={typeName} className="space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-[4px] border-l-4 border-sky-500 pl-6 text-left">{typeName}</h3>
            <div className="flex overflow-x-auto gap-6 pb-8 px-2 custom-scrollbar snap-x no-scrollbar">
              {(assets as Asset[]).map((fii) => (
                <div key={fii.ticker} className={`snap-start min-w-[320px] max-w-[320px] transition-all duration-500 ${expandedAsset === fii.ticker ? 'min-w-[660px]' : ''}`}>
                  <Card className={`p-0 overflow-hidden border-2 transition-all h-full ${expandedAsset === fii.ticker ? 'border-sky-500/40 bg-sky-500/[0.02]' : 'border-white/5'}`}>
                    <div className="p-8 flex items-center justify-between">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-sm text-gray-500">
                             {fii.ticker.substring(0, 4)}
                          </div>
                          <div className="text-left">
                             <div className="flex items-center gap-2">
                               <h4 className="font-black text-white text-xl tracking-tighter uppercase">{fii.ticker}</h4>
                               {fii.tags?.includes("#LocalSeeding") && (
                                 <span title="Dados locais aproximados">
                                   <AlertCircle size={14} className="text-amber-500" />
                                 </span>
                               )}
                             </div>
                             <p className="text-[10px] text-gray-600 font-bold uppercase truncate w-32">{fii.nome}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-mono font-black text-white">R$ {Number(fii.currentPrice).toFixed(2)}</p>
                          <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">{fii.dy}</span>
                       </div>
                    </div>
                    <div className="px-8 pb-8 flex items-center justify-between">
                       <div className="flex gap-4">
                          <div className="text-left">
                             <p className="text-[8px] text-gray-700 font-black uppercase">P/VP (Desconto)</p>
                             <p className={`text-xs font-bold ${parseFloat(fii.pvp as string) < 1 ? 'text-emerald-500' : 'text-gray-300'}`}>{fii.pvp}</p>
                          </div>
                       </div>
                       <button onClick={() => setExpandedAsset(expandedAsset === fii.ticker ? null : fii.ticker)} className="p-3 rounded-full bg-white/5 text-gray-600 hover:text-white transition-all">
                          <ChevronDown size={20} className={expandedAsset === fii.ticker ? 'rotate-180' : ''} />
                       </button>
                    </div>
                    {expandedAsset === fii.ticker && (
                      <div className="p-8 border-t border-white/5 bg-black/40 grid grid-cols-2 gap-4 animate-in slide-in-from-left-4">
                         <button onClick={() => reportService.openLoadingPDF()} className="flex items-center justify-center gap-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                            <FileText size={16} /> Relatório
                         </button>
                         <button onClick={() => onAnalyze(fii)} className="flex items-center justify-center gap-3 bg-sky-600/10 border border-sky-500/20 text-sky-400 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-all">
                            <Activity size={16} /> Analisar
                         </button>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
              <div className="snap-start min-w-[320px] flex items-center justify-center">
                 <button onClick={handleDiscovery} disabled={isDiscovering} className="flex flex-col items-center gap-4 text-gray-700 hover:text-sky-500 transition-all group disabled:opacity-50">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center group-hover:border-sky-500/50">
                       {isDiscovering ? <Loader2 className="animate-spin" size={32} /> : <Plus size={32} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{isDiscovering ? "Buscando..." : "Lote FIIs"}</span>
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
};
