
import React, { useState, useMemo } from 'react';
import { X, Plus, TrendingUp, Building2, Coins, Loader2, Search, Info, CheckCircle2, Landmark } from 'lucide-react';
import { Card } from '../components/SharedUI';
import { useNotification } from '../App';
import { Asset, AssetType } from '../types';
import { B3_MARKET_DATA } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (asset: Asset) => void;
}

export const AddAssetModal: React.FC<ModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { addNotification } = useNotification();
  const [mode, setMode] = useState<'Search' | 'RendaFixa'>('Search');
  const [busca, setBusca] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Campos específicos Renda Fixa
  const [rfData, setRfData] = useState({
    ticker: '',
    emissor: '',
    indexador: 'CDI' as 'CDI' | 'IPCA' | 'PRE',
    taxa: '',
    maturity: '',
    fgc: true
  });

  // Busca instantânea no banco de dados local
  const resultados = useMemo(() => {
    if (busca.length < 2) return [];
    return B3_MARKET_DATA.filter(t => 
      t.ticker.includes(busca.toUpperCase()) || 
      t.nome.toLowerCase().includes(busca.toLowerCase())
    ).slice(0, 5);
  }, [busca]);

  if (!isOpen) return null;

  const handleSelect = (asset: any) => {
    setSelectedAsset(asset);
    setPrice(asset.preco.toString());
    setBusca(asset.ticker);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'Search') {
      if (!selectedAsset || !qty || !price) {
        addNotification("Selecione um ativo e preencha os dados.", "error");
        setLoading(false);
        return;
      }

      setTimeout(() => {
        onAdd({
          ticker: selectedAsset.ticker,
          nome: selectedAsset.nome,
          quantity: Number(qty),
          averagePrice: Number(price),
          currentPrice: selectedAsset.preco,
          type: selectedAsset.tipo,
          setor: selectedAsset.setor,
          change: selectedAsset.var,
          updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });
        addNotification(`✅ ${selectedAsset.ticker} integrado com sucesso!`, "success");
        setLoading(false);
        onClose();
      }, 500);
    } else {
      // Renda Fixa manual
      if (!rfData.ticker || !rfData.emissor || !price) {
        addNotification("Preencha todos os campos obrigatórios.", "error");
        setLoading(false);
        return;
      }

      setTimeout(() => {
        onAdd({
          ticker: rfData.ticker.toUpperCase(),
          nome: `${rfData.emissor} (${rfData.indexador})`,
          quantity: 1,
          averagePrice: Number(price),
          currentPrice: Number(price), // Renda fixa mantém o valor nominal se não reavaliar
          type: 'Renda Fixa',
          emissor: rfData.emissor,
          indexador: rfData.indexador,
          taxa: Number(rfData.taxa),
          maturityDate: rfData.maturity,
          fgcCoberto: rfData.fgc,
          updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });
        addNotification(`✅ Título ${rfData.ticker} registrado!`, "success");
        setLoading(false);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-xl border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)] relative overflow-hidden p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 p-3 rounded-2xl shadow-xl">
              <Plus className="text-white w-6 h-6" />
            </div>
            <div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Mapear Ativo</h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px]">Inclusão Manual ou Automática</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-full"><X size={24} /></button>
        </div>

        {/* Toggle de Modo */}
        <div className="flex gap-2 p-1 bg-black/40 rounded-2xl mb-8 relative z-10">
          <button 
            onClick={() => setMode('Search')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'Search' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            B3 Search
          </button>
          <button 
            onClick={() => { setMode('RendaFixa'); setSelectedAsset(null); }}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'RendaFixa' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Renda Fixa
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {mode === 'Search' ? (
            <>
              <div className="space-y-4 relative">
                <label className="text-[10px] text-gray-600 uppercase font-black tracking-[3px] block px-1">Buscar Ticker ou Empresa</label>
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-emerald-500" />
                  <input 
                    type="text" 
                    value={busca} 
                    onChange={(e) => {
                        setBusca(e.target.value);
                        if (selectedAsset) setSelectedAsset(null);
                    }} 
                    className="w-full bg-black/40 border-2 border-white/5 rounded-[1.5rem] p-6 pl-16 text-white outline-none focus:border-emerald-500 transition-all font-black text-xl placeholder:text-gray-800"
                    placeholder="Ex: PETR4, VALE3, MXRF11..." 
                    autoComplete="off"
                  />
                </div>

                {resultados.length > 0 && !selectedAsset && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#121214] border border-white/10 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in slide-in-from-top-2">
                    {resultados.map((res) => (
                      <button
                        key={res.ticker}
                        type="button"
                        onClick={() => handleSelect(res)}
                        className="w-full p-5 text-left hover:bg-emerald-600/10 border-b border-white/5 last:border-0 transition-colors flex justify-between items-center group"
                      >
                        <div>
                          <span className="text-white font-black text-lg block group-hover:text-emerald-400">{res.ticker}</span>
                          <span className="text-[10px] text-gray-600 font-bold uppercase">{res.nome}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-500 font-mono font-black text-sm">R$ {res.preco.toFixed(2)}</span>
                          <span className="text-[9px] text-gray-700 block uppercase font-bold">{res.setor}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedAsset && (
                <div className="animate-in zoom-in-95 duration-300 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] text-gray-600 uppercase font-black tracking-[3px] block px-1">Quantidade</label>
                      <input 
                        type="number" value={qty} onChange={(e) => setQty(e.target.value)} 
                        className="w-full bg-black/40 border-2 border-white/5 rounded-[1.5rem] p-6 text-white outline-none focus:border-emerald-500 transition-all font-mono font-black text-2xl" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-gray-600 uppercase font-black tracking-[3px] block px-1">Preço Médio (R$)</label>
                      <input 
                        type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} 
                        className="w-full bg-black/40 border-2 border-white/5 rounded-[1.5rem] p-6 text-white outline-none focus:border-emerald-500 transition-all font-mono font-black text-2xl" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="animate-in slide-in-from-right-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-600 uppercase font-black tracking-widest px-1">Ticker / Ref</label>
                  <input 
                    type="text" placeholder="CDB-ITAU" value={rfData.ticker} onChange={(e) => setRfData({...rfData, ticker: e.target.value})}
                    className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 text-white font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-600 uppercase font-black tracking-widest px-1">Emissor</label>
                  <input 
                    type="text" placeholder="Banco Itaú" value={rfData.emissor} onChange={(e) => setRfData({...rfData, emissor: e.target.value})}
                    className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-600 uppercase font-black tracking-widest px-1">Indexador</label>
                  <select 
                    value={rfData.indexador} onChange={(e) => setRfData({...rfData, indexador: e.target.value as any})}
                    className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 text-white font-bold"
                  >
                    <option value="CDI">Pós-Fixado (CDI)</option>
                    <option value="IPCA">Híbrido (IPCA+)</option>
                    <option value="PRE">Pré-Fixado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-600 uppercase font-black tracking-widest px-1">Taxa (% ou %CDI)</label>
                  <input 
                    type="number" step="0.01" placeholder="11.5 ou 110" value={rfData.taxa} onChange={(e) => setRfData({...rfData, taxa: e.target.value})}
                    className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] text-gray-600 uppercase font-black tracking-widest px-1">Vencimento</label>
                  <input 
                    type="date" value={rfData.maturity} onChange={(e) => setRfData({...rfData, maturity: e.target.value})}
                    className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 text-white font-bold"
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] text-gray-600 uppercase font-black tracking-widest px-1">Valor Investido (R$)</label>
                   <input 
                     type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                     className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 text-white font-mono font-bold"
                   />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                 <input 
                   type="checkbox" checked={rfData.fgc} onChange={(e) => setRfData({...rfData, fgc: e.target.checked})}
                   className="w-5 h-5 accent-emerald-500"
                 />
                 <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Possui Garantia FGC / Governo?</span>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || (mode === 'Search' && !selectedAsset)}
            className={`w-full py-8 rounded-[1.5rem] font-black uppercase tracking-[5px] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 ${mode === 'Search' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
            {loading ? "Registrando..." : "Confirmar Custódia"}
          </button>
        </form>
      </Card>
    </div>
  );
};
