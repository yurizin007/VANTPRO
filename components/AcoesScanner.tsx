import React, { useState, useEffect } from 'react';
import { todasAcoesB3 } from '../data/acoes-b3';
import './AcoesScanner.css';

const SETORES_CONHECIDOS: Record<string, string> = {
  PETR4: 'Petróleo', VALE3: 'Mineração', ITUB4: 'Bancos', BBDC4: 'Bancos',
  BBAS3: 'Bancos', WEGE3: 'Indústria', MGLU3: 'Varejo', LREN3: 'Varejo',
  ELET3: 'Elétrica', TAEE11: 'Elétrica', HAPV3: 'Saúde', RDOR3: 'Saúde',
  MXRF11: 'FII Papel', HGLG11: 'FII Tijolo', KNRI11: 'FII Misto'
};

interface AcoesScannerProps {
  assets?: import('../types').Asset[];
  onAddAsset?: (asset: import('../types').Asset) => void;
}

const AcoesScanner: React.FC<AcoesScannerProps> = ({ assets = [], onAddAsset }) => {
  const [acoes, setAcoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState('');
  const [monitorados, setMonitorados] = useState<string[]>([]);
  const [stockToScan, setStockToScan] = useState<any | null>(null);
  const [scanning, setScanning] = useState(false);

  const ACOES_POR_PAGINA = 12;

  // GERADOR DE PERFIL DA EMPRESA (Texto Inteligente)
  const getCompanyProfile = (ticker: string, setor: string, nome: string) => {
    return `A ${nome} é uma das principais empresas do setor de ${setor} listadas na B3. A companhia foca em eficiência operacional e geração de valor aos acionistas através de estratégias de crescimento e dividendos consistentes. Negociada sob o ticker ${ticker}, possui alta liquidez e relevância no índice Ibovespa.`;
  };

  // SIMULADOR DE DADOS FUNDAMENTALISTAS
  const gerarFundamentos = (ticker: string, setor: string, nome: string) => {
    let hash = 0;
    for (let i = 0; i < ticker.length; i++) hash = ticker.charCodeAt(i) + ((hash << 5) - hash);

    const dy = (Math.abs(hash) % 1200) / 100;
    const pl = (Math.abs(hash) % 2500) / 100 + 3;
    const pvp = (Math.abs(hash) % 400) / 100 + 0.4;
    const roe = (Math.abs(hash) % 3000) / 100;
    const isBanco = setor === 'Bancos';
    const divida = isBanco ? 0 : ((Math.abs(hash) % 500) / 100 - 1);
    
    let veredito = "MANTER / NEUTRO";
    let corVeredito = "text-yellow-400";
    let acaoSugerida = "AGUARDAR";

    if (divida > 3.5) {
      veredito = "ALTO RISCO DE DÍVIDA";
      corVeredito = "text-red-500";
      acaoSugerida = "VENDA / FICAR FORA";
    } else if (pl < 9 && dy > 7 && roe > 10) {
      veredito = "OPORTUNIDADE (BARATA)";
      corVeredito = "text-green-400";
      acaoSugerida = "COMPRA FORTE";
    } else if (pl > 30) {
      veredito = "CARA (ESTICADA)";
      corVeredito = "text-orange-500";
      acaoSugerida = "VENDA PARCIAL";
    }
    
    return { 
      dy, pl, pvp, roe, divida, veredito, corVeredito, acaoSugerida,
      descricao: getCompanyProfile(ticker, setor, nome)
    };
  };

  // GRÁFICO SIMULADO (SVG PURO)
  const GraficoSimulado = ({ positivo }: { positivo: boolean }) => {
    const color = positivo ? "#4ade80" : "#f87171";
    // Caminho pseudo-aleatório baseado no estado positivo
    const points = positivo 
      ? "0,80 10,75 20,82 30,70 40,75 50,60 60,65 70,50 80,45 90,30 100,20"
      : "0,20 10,35 20,30 30,45 40,40 50,55 60,50 70,75 80,70 90,85 100,90";
    
    return (
      <div className="w-full h-48 bg-gray-900/50 rounded-2xl border border-gray-700 p-4 relative overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={`M${points} L100,100 L0,100 Z`}
            fill={positivo ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)"}
          />
        </svg>
        <div className="absolute top-2 left-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Desempenho Estimado (30D)</div>
      </div>
    );
  };

  const openScanner = (acao: any) => {
    setStockToScan(null);
    setScanning(true);
    setTimeout(() => {
      const fundamentos = gerarFundamentos(acao.ticker, acao.setor, acao.nome);
      setStockToScan({ ...acao, ...fundamentos });
      setScanning(false);
    }, 1200);
  };

  const toggleMonitorar = (ticker: string) => {
    if (monitorados.includes(ticker)) setMonitorados(monitorados.filter(t => t !== ticker));
    else setMonitorados([...monitorados, ticker]);
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      let lista = busca.length > 0 ? todasAcoesB3.filter(t => t.includes(busca.toUpperCase())) : todasAcoesB3;
      const inicio = (pagina - 1) * ACOES_POR_PAGINA;
      const tickersPagina = lista.slice(inicio, inicio + ACOES_POR_PAGINA);

      if (tickersPagina.length === 0) { setAcoes([]); setLoading(false); return; }
      try {
        const response = await fetch(`https://brapi.dev/api/quote/${tickersPagina.join(',')}?token=demo`);
        if (!response.ok) throw new Error('Offline');
        const data = await response.json();
        setAcoes(data.results.map((item: any) => ({
          ticker: item.symbol, 
          nome: item.longName || item.shortName || item.symbol,
          preco: item.regularMarketPrice, 
          variacao: item.regularMarketChangePercent,
          logo: item.logourl, 
          setor: SETORES_CONHECIDOS[item.symbol] || "Mercado B3"
        })));
      } catch (error) {
        setAcoes(tickersPagina.map(ticker => {
          let hash = 0; for (let i = 0; i < ticker.length; i++) hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
          return {
            ticker, 
            nome: "Empresa Listada B3", 
            preco: (Math.abs(hash)%9000)/100+10,
            variacao: (Math.abs(hash)%600)/100-3, 
            logo: null, 
            setor: SETORES_CONHECIDOS[ticker] || "Ação / FII"
          };
        }));
      } finally { setLoading(false); }
    };
    const timer = setTimeout(carregarDados, 300);
    return () => clearTimeout(timer);
  }, [pagina, busca]);

  // BARRA DE PROGRESSO GRANDE
  const BigMetricBar = ({ label, valor, tipo, sufixo }: { label: string, valor: number, tipo: string, sufixo: string }) => {
    let color = "bg-gray-500";
    let w = 50;
    if (tipo === 'DY') { color = valor > 8 ? "bg-green-500" : valor > 4 ? "bg-blue-400" : "bg-gray-600"; w = Math.min(valor * 8, 100); }
    if (tipo === 'PL') { color = valor < 10 ? "bg-green-500" : valor < 20 ? "bg-blue-400" : "bg-red-500"; w = Math.min((30/valor)*100, 100); }
    if (tipo === 'DIVIDA') { color = valor > 3 ? "bg-red-600" : "bg-green-500"; w = Math.min(valor * 25, 100); }

    return (
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400 font-bold uppercase text-sm">{label}</span>
          <span className="text-white font-bold text-lg">{valor.toFixed(1)}{sufixo}</span>
        </div>
        <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${w}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="acoes-scanner">
      <div className="scanner-header">
        <h1 className="neon-text">MARKET <span className="text-blue-500">SCANNER</span></h1>
        <p className="subtitle">
           {loading ? 'Sincronizando Kernel...' : `Exibindo ${acoes.length} ativos em tempo real`}
        </p>
      </div>

      <div className="busca-wrapper">
        <input type="text" placeholder="🔍 Buscar ativo (Ex: PETR4, VALE3)..." value={busca} onChange={(e) => { setBusca(e.target.value); setPagina(1); }} className="input-neon" />
      </div>

      {loading ? <div className="loading-container"><div className="spinner"></div></div> : (
        <div className="acoes-grid">
          {acoes.map((acao) => (
            <div key={acao.ticker} className={`acao-card-kinvo group ${assets.some(a => a.ticker === acao.ticker) ? 'border-emerald-500' : ''}`}>
              <div className="card-header">
                <div className="flex items-center gap-3">
                  {acao.logo ? <img src={acao.logo} alt={acao.ticker} className="w-10 h-10 rounded bg-white p-1 object-contain" /> : <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center font-bold text-gray-500">{acao.ticker.substring(0, 2)}</div>}
                  <div className="text-left">
                    <div className="ticker-badge uppercase">{acao.ticker}</div>
                    <div className="nome-empresa truncate w-32" title={acao.nome}>{acao.nome?.substring(0, 15)}</div>
                  </div>
                </div>
                <div className="badge-setor">{acao.setor}</div>
              </div>
              <div className="card-price text-left mt-4">
                <span className="currency text-emerald-500 font-black text-xs">R$</span>
                <span className="value text-2xl font-black text-white font-mono">{acao.preco?.toFixed(2)}</span>
              </div>
              <div className="card-footer mt-6">
                <div className={`variacao-pill font-black text-[10px] px-2 py-1 rounded-lg ${(acao.variacao || 0) >= 0 ? 'up' : 'down'}`}>
                  {(acao.variacao || 0) >= 0 ? '▲' : '▼'} {Math.abs(acao.variacao || 0).toFixed(2)}%
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openScanner(acao)} className="btn-scan">🔍 DETALHES</button>
                  <button onClick={() => {
                    if (assets.some(a => a.ticker === acao.ticker)) return;
                    if (onAddAsset) {
                      onAddAsset({
                        ticker: acao.ticker,
                        nome: acao.nome,
                        name: acao.nome,
                        type: acao.ticker.endsWith('11') ? 'FII' : 'Ação',
                        quantity: 1,
                        averagePrice: acao.preco,
                        currentPrice: acao.preco,
                        setor: acao.setor,
                        change: acao.variacao,
                        updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                      });
                    }
                  }} className={`btn-monitorar ${assets.some(a => a.ticker === acao.ticker) ? 'ativo' : ''}`}>
                    {assets.some(a => a.ticker === acao.ticker) ? '✓' : '+'}
                  </button>
                </div>
              </div>
              <div className={`bottom-glow ${(acao.variacao || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
          ))}
        </div>
      )}

      <div className="paginacao-container flex items-center justify-center gap-10 mt-10">
        <button disabled={pagina === 1} onClick={() => setPagina(p => p - 1)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-500 hover:text-white disabled:opacity-20 transition-all">Anterior</button>
        <span className="page-number font-mono font-black text-white text-xl">{pagina}</span>
        <button onClick={() => setPagina(p => p + 1)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-all">Próxima</button>
      </div>

      {/* ======================================================== */}
      {/* O NOVO MODAL GIGANTE (PAINEL DE COMANDO) */}
      {/* ======================================================== */}
      {(stockToScan || scanning) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => !scanning && setStockToScan(null)}>
          <div className="bg-[#111827] w-full max-w-6xl h-[90vh] rounded-[2.5rem] border border-gray-700 shadow-2xl overflow-hidden flex flex-col relative" onClick={e => e.stopPropagation()}>
            
            {scanning ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <h2 className="text-3xl font-black text-white animate-pulse tracking-tighter uppercase font-mono">Acessando Terminal B3...</h2>
                <div className="text-gray-400 font-bold uppercase text-[10px] tracking-[4px]">Coletando balanços e indicadores estruturais</div>
              </div>
            ) : (
              <>
                {/* CABEÇALHO DO MODAL */}
                <div className="bg-gray-800/50 p-8 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 backdrop-blur-md z-10">
                  <div className="flex items-center gap-6">
                    {stockToScan.logo ? (
                      <img src={stockToScan.logo} className="w-20 h-20 bg-white rounded-2xl p-2 object-contain shadow-2xl" alt={stockToScan.ticker} />
                    ) : (
                      <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center text-3xl font-black text-white">{stockToScan.ticker.substring(0, 2)}</div>
                    )}
                    <div className="text-left">
                      <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-mono">{stockToScan.ticker}</h1>
                      <p className="text-xl text-gray-400 font-medium">{stockToScan.nome}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-6xl font-black text-white font-mono tracking-tighter">R$ {stockToScan.preco?.toFixed(2)}</div>
                    <div className={`text-2xl font-black mt-2 ${stockToScan.variacao >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stockToScan.variacao >= 0 ? '▲' : '▼'} {Math.abs(stockToScan.variacao).toFixed(2)}% (Hoje)
                    </div>
                  </div>
                  <button onClick={() => setStockToScan(null)} className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-full text-white transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-12 gap-12 custom-scrollbar">
                  
                  {/* COLUNA ESQUERDA: PERFIL + GRÁFICO */}
                  <div className="md:col-span-7 space-y-10 text-left">
                    
                    {/* GRÁFICO */}
                    <div className="space-y-4">
                      <h3 className="text-white font-black uppercase text-xs tracking-[4px] flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        Comportamento de Preço
                      </h3>
                      <GraficoSimulado positivo={stockToScan.variacao >= 0} />
                    </div>

                    {/* SOBRE */}
                    <div className="bg-gray-800/30 p-8 rounded-[2rem] border border-gray-700/50 space-y-6">
                      <h3 className="text-blue-400 font-black uppercase text-xs tracking-[4px]">Perfil Corporativo</h3>
                      <p className="text-gray-300 leading-relaxed text-xl font-medium">
                        {stockToScan.descricao}
                      </p>
                      <div className="flex gap-4">
                        <span className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-[10px] text-white uppercase font-black tracking-widest">{stockToScan.setor}</span>
                        <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-500 uppercase font-black tracking-widest">Listada B3</span>
                      </div>
                    </div>
                  </div>

                  {/* COLUNA DIREITA: INDICADORES E VEREDITO */}
                  <div className="md:col-span-5 space-y-8">
                    
                    {/* CAIXA DE VEREDITO GIGANTE */}
                    <div className={`p-8 rounded-[2.5rem] border-2 text-center shadow-2xl transition-all ${stockToScan.acaoSugerida.includes('COMPRA') ? 'border-green-500 bg-green-500/5 shadow-green-500/10' : stockToScan.acaoSugerida.includes('VENDA') ? 'border-red-500 bg-red-500/5 shadow-red-500/10' : 'border-yellow-500 bg-yellow-500/5 shadow-yellow-500/10'}`}>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[5px] mb-4">Recomendação Vantez Kernel</p>
                      <h2 className={`text-5xl font-black tracking-tighter ${stockToScan.corVeredito}`}>{stockToScan.acaoSugerida}</h2>
                      <div className="mt-4 px-6 py-2 bg-white/5 rounded-full inline-block text-white font-bold text-sm">
                        {stockToScan.veredito}
                      </div>
                    </div>

                    {/* BARRAS DE MÉTRICAS */}
                    <div className="bg-gray-800/30 p-8 rounded-[2rem] border border-gray-700/50">
                      <h3 className="text-white font-black uppercase text-xs tracking-[4px] mb-10 border-b border-gray-700 pb-4">Audit Fundamentalista</h3>
                      
                      <BigMetricBar label="Dividend Yield (Anual)" valor={stockToScan.dy} tipo="DY" sufixo="%" />
                      <BigMetricBar label="P/L (Tempo p/ Retorno)" valor={stockToScan.pl} tipo="PL" sufixo=" Anos" />
                      <BigMetricBar label="Dívida / EBITDA (Solvência)" valor={stockToScan.divida} tipo="DIVIDA" sufixo="x" />
                      
                      <div className="grid grid-cols-2 gap-6 mt-10 pt-8 border-t border-gray-700">
                        <div className="text-left">
                          <span className="block text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Preço / VP</span>
                          <span className="text-white text-3xl font-black font-mono">{stockToScan.pvp.toFixed(2)}</span>
                        </div>
                        <div className="text-left">
                          <span className="block text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Rentab. ROE</span>
                          <span className="text-white text-3xl font-black font-mono">{stockToScan.roe.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {assets.some(a => a.ticker === stockToScan.ticker) ? (
                      <div className="w-full py-6 bg-emerald-600/20 border-2 border-emerald-500/40 text-emerald-400 font-black uppercase tracking-[5px] rounded-2xl text-lg text-center">
                        ✓ Já está na sua Carteira
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (onAddAsset) {
                            onAddAsset({
                              ticker: stockToScan.ticker,
                              nome: stockToScan.nome,
                              name: stockToScan.nome,
                              type: stockToScan.ticker.endsWith('11') ? 'FII' : 'Ação',
                              quantity: 1,
                              averagePrice: stockToScan.preco,
                              currentPrice: stockToScan.preco,
                              setor: stockToScan.setor,
                              change: stockToScan.variacao,
                              updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                            });
                          }
                          setStockToScan(null);
                        }}
                        className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[5px] rounded-2xl text-lg transition-all shadow-2xl shadow-blue-900/30 active:scale-[0.98]"
                      >
                        Adicionar à Minha Carteira
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <p className="disclaimer-text mt-8 opacity-30">
        * Dados fundamentalistas e descrições geradas pelo Kernel Vantez para fins de simulação e análise de ativos B3.
      </p>
    </div>
  );
};

export default AcoesScanner;