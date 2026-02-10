import React, { useState, useMemo } from 'react';
import { X, Plus, TrendingUp, Building2, Coins, Loader2, Search, Info, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/SharedUI';
import { useNotification } from '../App';
import { Asset } from '../types';
import { B3_MARKET_DATA } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (asset: Asset) => void;
}

export const AddAssetModal: React.FC<ModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { addNotification } = useNotification();
  const [busca, setBusca] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (!selectedAsset || !qty || !price) {
      addNotification("Selecione um ativo e preencha a quantidade.", "error");
      return;
    }

    setLoading(true);
    // Simula processamento para UX, mas usa dados locais
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
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-xl border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)] relative overflow-hidden p-10">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 p-3 rounded-2xl shadow-xl">
              <Plus className="text-white w-6 h-6" />
            </div>
            <div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Mapear Ativo</h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px]">Busca Instantânea B3</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-full"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* CAMPO DE BUSCA INSTANTÂNEA */}
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

            {/* DROPDOWN DE RESULTADOS LOCAIS */}
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
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <CheckCircle2 className="text-emerald-500" size={24} />
                    <div>
                       <p className="text-[10px] text-emerald-500 font-black uppercase">Ativo Selecionado</p>
                       <p className="text-xl font-black text-white">{selectedAsset.ticker} - {selectedAsset.nome}</p>
                    </div>
                 </div>
                 <button type="button" onClick={() => setSelectedAsset(null)} className="text-gray-600 hover:text-white text-[10px] font-black uppercase underline">Trocar</button>
              </div>

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

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-8 rounded-[1.5rem] font-black uppercase tracking-[5px] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                {loading ? "Integrando..." : `Adicionar ${selectedAsset.ticker}`}
              </button>
            </div>
          )}
        </form>

        {!selectedAsset && busca.length < 2 && (
          <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-4">
             <Info size={20} className="text-blue-500 shrink-0" />
             <p className="text-[11px] text-gray-600 font-medium leading-relaxed uppercase tracking-widest">
               Digite o código do ativo (ex: PETR) para buscar instantaneamente no banco de dados B3 local.
             </p>
          </div>
        )}
      </Card>
    </div>
  );
};