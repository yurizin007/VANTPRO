
import React, { useState } from 'react';
import { 
  Coins, Activity, Zap, RefreshCw, Bot, ShieldAlert, 
  ArrowDownLeft, ArrowUpRight, BarChart3, Binary, 
  Network, Eye, Ghost, TrendingUp, Search, Info
} from 'lucide-react';
import { Card, MetricCard, Disclaimer, Badge, Tooltip } from '../components/SharedUI';
import { Asset } from '../types';

export const CryptoPage: React.FC<{ onAnalyze: (asset: Asset) => void }> = ({ onAnalyze }) => {
  const cryptoAssets: Asset[] = [
    { 
      ticker: 'BTC', name: 'Bitcoin', currentPrice: 68500, change: 2.4, 
      setor: 'Ouro Digital', type: 'Cripto', exchangeFlow: '-$420M', 
      mvrv: 1.8, vol: 0.45, averagePrice: 0, quantity: 0, supplyShock: true,
      onChainScore: 88, whaleActivity: 'Alta Acumulação', correlationSPX: 0.35
    },
    { 
      ticker: 'ETH', name: 'Ethereum', currentPrice: 3450, change: 1.1, 
      setor: 'Smart Contracts', type: 'Cripto', exchangeFlow: '-$80M', 
      mvrv: 1.4, vol: 0.55, averagePrice: 0, quantity: 0, supplyShock: false,
      onChainScore: 72, whaleActivity: 'Moderada', correlationSPX: 0.52
    },
    { 
      ticker: 'SOL', name: 'Solana', currentPrice: 145.20, change: 5.8, 
      setor: 'High Performance L1', type: 'Cripto', exchangeFlow: '+$12M', 
      mvrv: 2.1, vol: 0.75, averagePrice: 0, quantity: 0, supplyShock: true,
      onChainScore: 91, whaleActivity: 'Institucional Ativo', correlationSPX: 0.48
    },
    { 
      ticker: 'LINK', name: 'Chainlink', currentPrice: 18.45, change: -1.2, 
      setor: 'Oracles', type: 'Cripto', exchangeFlow: '-$5M', 
      mvrv: 1.1, vol: 0.60, averagePrice: 0, quantity: 0, supplyShock: false,
      onChainScore: 65, whaleActivity: 'Estável', correlationSPX: 0.30
    }
  ];

  const [selectedCrypto, setSelectedCrypto] = useState(cryptoAssets[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = cryptoAssets.filter(c => 
    c.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 text-left">
      {/* Header Estratégico */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-orange-600 p-4 rounded-2xl shadow-2xl shadow-orange-900/40">
            <Coins className="text-white w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Bitcoin e Criptos</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px] mt-1">Análise de Dados Reais e Fluxo de Baleias</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
              <Activity size={16} className="text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor Global: $2.54T</span>
           </div>
           <Badge color="amber">Sentimento: Ganância (78)</Badge>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Dominância do BTC" value="52.4%" change="+0.2%" isPositive={true} 
          tooltipTitle="BTC Dominance" tooltipContent="Percentual do mercado total ocupado pelo Bitcoin."
        />
        <MetricCard 
          title="Taxa de Rede (Gas)" value="12 Gwei" change="Baixo" isPositive={true} 
          tooltipTitle="Network Gas" tooltipContent="Custo médio de transação na rede Ethereum."
        />
        <MetricCard 
          title="Fluxo de Corretoras" value="-4.2%" change="Saindo" isPositive={true} 
          tooltipTitle="Reserva em Exchanges" tooltipContent="Quantidade de moedas saindo de corretoras para carteiras privadas."
        />
        <MetricCard 
          title="Grandes Investidores" value="84/100" isPositive={true} 
          tooltipTitle="Institutional Index" tooltipContent="Mede a atividade de grandes carteiras (baleias) em relação ao varejo."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lado Esquerdo: Lista de Ativos e Scanner */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 space-y-6 border-white/5">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={16} />
                 <input 
                   type="text" placeholder="Buscar Moeda..." 
                   className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-white outline-none focus:border-orange-500/50"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="space-y-2">
                 {filtered.map(crypto => (
                   <button 
                     key={crypto.ticker}
                     onClick={() => setSelectedCrypto(crypto)}
                     className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${selectedCrypto.ticker === crypto.ticker ? 'bg-orange-500/10 border-orange-500/30 ring-1 ring-orange-500/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedCrypto.ticker === crypto.ticker ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}>
                           {crypto.ticker[0]}
                        </div>
                        <div className="text-left">
                           <p className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">{crypto.ticker}</p>
                           <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{crypto.name}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-mono font-black text-white">${crypto.currentPrice.toLocaleString()}</p>
                        <p className={`text-[9px] font-black ${crypto.change! >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{crypto.change! > 0 ? '+' : ''}{crypto.change}%</p>
                     </div>
                   </button>
                 ))}
              </div>
           </Card>

           <Card className="p-8 space-y-6 bg-blue-600/[0.02] border-blue-500/10">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[4px] flex items-center gap-3">
                 <Ghost size={16} /> Compras Escondidas
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                 Detectamos <span className="text-white">grandes compras</span> nas últimas 2 horas. Isso costuma acontecer antes de grandes movimentos de alta.
              </p>
              <div className="pt-4 border-t border-white/5">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <span>Confiança Baleias</span>
                    <span className="text-emerald-500">Alta</span>
                 </div>
              </div>
           </Card>
        </div>

        {/* Lado Direito: Dashboard Detalhado do Ativo */}
        <div className="lg:col-span-8 space-y-8">
           <Card className="p-10 bg-gradient-to-br from-[#121214] to-black border-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                 <Binary size={200} className="text-orange-500" />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500 text-4xl font-black italic shadow-2xl">
                       {selectedCrypto.ticker[0]}
                    </div>
                    <div>
                       <div className="flex items-center gap-4">
                          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">{selectedCrypto.name}</h1>
                          <Badge color="amber">Top 10 Global</Badge>
                       </div>
                       <p className="text-xl text-gray-500 font-mono mt-2">${selectedCrypto.currentPrice.toLocaleString()} <span className="text-xs ml-4 text-gray-700">Preço em Tempo Real</span></p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => onAnalyze(selectedCrypto)}
                      className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[3px] shadow-2xl transition-all active:scale-95 flex items-center gap-3"
                    >
                       <BarChart3 size={18} /> Ver Análise IA
                    </button>
                 </div>
              </div>

              {/* Grid de Métricas On-Chain */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 relative z-10">
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Network size={12} /> Nota da Rede
                    </p>
                    <p className="text-2xl font-black text-white">{selectedCrypto.onChainScore}/100</p>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-3">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedCrypto.onChainScore}%` }} />
                    </div>
                 </div>
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Eye size={12} /> Grandes Carteiras
                    </p>
                    <p className="text-sm font-black text-white uppercase mt-1">{selectedCrypto.whaleActivity}</p>
                 </div>
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <TrendingUp size={12} /> Valor Justo
                    </p>
                    <p className="text-2xl font-black text-orange-500 font-mono">{selectedCrypto.mvrv}</p>
                 </div>
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Activity size={12} /> Relação c/ Bolsa
                    </p>
                    <p className="text-2xl font-black text-blue-400 font-mono">{selectedCrypto.correlationSPX}</p>
                 </div>
              </div>
              
              <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex items-center gap-8 relative z-10 group">
                 <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shrink-0 group-hover:scale-110 transition-transform">
                    <Bot size={40} className="text-white" />
                 </div>
                 <div className="space-y-2 text-left">
                    <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-[5px]">Diagnóstico da IA • {selectedCrypto.ticker}</h4>
                    <p className="text-lg text-gray-200 font-bold leading-relaxed italic">
                      "O fluxo de moedas saindo de corretoras sugere que grandes investidores estão guardando {selectedCrypto.ticker} para o longo prazo. No preço atual, o ativo se comporta como um {selectedCrypto.correlationSPX! > 0.5 ? 'Ativo de Risco Tradicional' : 'Investimento Alternativo'} neste ciclo."
                    </p>
                 </div>
              </div>
           </Card>

           {/* Alertas e Insights em Tempo Real */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 border-orange-500/20 bg-orange-500/[0.02] flex items-start gap-6">
                 <div className="bg-orange-600 p-4 rounded-2xl shadow-xl">
                    <Zap className="text-white w-6 h-6 animate-pulse" />
                 </div>
                 <div className="space-y-2 text-left">
                    <h5 className="text-orange-500 font-black uppercase text-[10px] tracking-[4px]">Dica IA: Poucas Moedas à Venda</h5>
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">
                       {selectedCrypto.supplyShock ? 
                         `Alerta! Quase não há moedas de ${selectedCrypto.ticker} para comprar em corretoras. Isso costuma gerar altas rápidas.` : 
                         `Estoque estável. Há moedas suficientes sendo trocadas no mercado agora.`}
                    </p>
                 </div>
              </Card>

              <Card className="p-8 border-rose-500/20 bg-rose-500/[0.02] flex items-start gap-6">
                 <div className="bg-rose-600 p-4 rounded-2xl shadow-xl">
                    <ShieldAlert className="text-white w-6 h-6" />
                 </div>
                 <div className="space-y-2 text-left">
                    <h5 className="text-rose-500 font-black uppercase text-[10px] tracking-[4px]">Atenção ao Risco</h5>
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">
                       Este ativo balança muito (Volatilidade: {selectedCrypto.vol}). Cuidado ao investir valores que você pode precisar logo.
                    </p>
                 </div>
              </Card>
           </div>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
};
