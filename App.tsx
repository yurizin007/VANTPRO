
import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { DashboardPage } from './pages/DashboardPage';
import { MyPlanPage } from './pages/MyPlanPage';
import { WalletPage } from './pages/WalletPage';
import { StocksPage } from './pages/StocksPage';
import { CryptoPage } from './pages/CryptoPage';
import { AdvisorPage } from './pages/AdvisorPage';
import { RoboPage } from './pages/RoboPage';
import { FundsPage } from './pages/FundsPage';
import { TesouroPage } from './pages/TesouroPage';
import { NewsPage } from './pages/NewsPage';
import { OffshorePage } from './pages/OffshorePage';
import { CoePage } from './pages/CoePage';
import { PrevidenciaPage } from './pages/PrevidenciaPage';
import { HealthPage } from './pages/HealthPage';
import { AcademyPage } from './pages/AcademyPage';
import { TaxPage } from './pages/TaxPage';
import { AddAssetModal } from './modals/AddAssetModal';
import { SimulationModal } from './modals/SimulationModal';
import { AssetAnalysisModal } from './modals/AssetAnalysisModal';
import { Asset, PageId, Expense, Debt, UserProfile } from './types';
import { Info, LayoutDashboard, Terminal } from 'lucide-react';

// --- Contextos ---
interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'unlock';
}

const NotificationContext = createContext<{
  addNotification: (message: string, type?: Notification['type']) => void;
} | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification deve ser usado dentro de um NotificationProvider");
  return context;
};

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [usdRate, setUsdRate] = useState(5.15);
  const [eurRate, setEurRate] = useState(5.60);

  // Persistência de Perfil
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vantez_user_profile');
    return saved ? JSON.parse(saved) : {
      nome: 'Investidor Pro',
      nivelConhecimento: 'Avancado',
      perfilRisco: 'Arrojado',
      objetivo: 'Independência Financeira',
      aporteMensal: 5000,
      temReserva: 'Sim',
      temDividas: false,
      horizonteAnos: 20,
      faseAtual: 3, 
      scoreRisco: 90,
      unlockedPages: [],
      xp: 1250
    };
  });

  // Gestão de Ativos
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('vantez_assets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vantez_assets', JSON.stringify(assets));
    localStorage.setItem('vantez_user_profile', JSON.stringify(userProfile));
  }, [assets, userProfile]);
  
  // Gestão Financeira
  const [income, setIncome] = useState(15000);
  const [debtList, setDebtList] = useState<Debt[]>([]);
  const [savings, setSavings] = useState(120000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Essencial', label: 'Housing', value: 4500 },
    { id: '2', category: 'Estilo de Vida', label: 'Lifestyle', value: 2000 }
  ]);

  // Modais e UI
  const [selectedAnalysisAsset, setSelectedAnalysisAsset] = useState<Asset | null>(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const refreshPrices = async () => {
    setIsRefreshingPrices(true);
    addNotification("Sincronizando Kernel (B3, Crypto, FX)...", "info");

    try {
      // 1. AwesomeAPI (Dólar e Euro)
      const fxRes = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL');
      const fxData = await fxRes.json();
      if (fxData.USDBRL) setUsdRate(parseFloat(fxData.USDBRL.bid));
      if (fxData.EURBRL) setEurRate(parseFloat(fxData.EURBRL.bid));

      // 2. B3 Assets (Brapi)
      const b3Assets = assets.filter(a => a.type === 'Ação' || a.type === 'FII');
      let b3Results: any[] = [];
      if (b3Assets.length > 0) {
        const tickers = b3Assets.map(a => a.ticker).join(',');
        const response = await fetch(`https://brapi.dev/api/quote/${tickers}?token=demo&dividends=true`);
        const data = await response.json();
        b3Results = data.results || [];
      }

      // 3. Crypto Assets (CoinGecko Simple API)
      const cryptos = assets.filter(a => a.type === 'Cripto');
      let cryptoResults: any = {};
      if (cryptos.length > 0) {
        const mapIds: Record<string, string> = { 'BTC': 'bitcoin', 'ETH': 'ethereum', 'SOL': 'solana', 'LINK': 'chainlink' };
        const ids = cryptos.map(c => mapIds[c.ticker] || c.ticker.toLowerCase()).join(',');
        const cRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl&include_24hr_change=true&include_market_cap=true`);
        cryptoResults = await cRes.json();
      }

      // Merging data
      const updated = assets.map(asset => {
        if (asset.type === 'Ação' || asset.type === 'FII') {
          const live = b3Results.find((r: any) => r.symbol === asset.ticker);
          if (live) {
            const divHistory = live.dividendsData?.cashDividends?.map((dv: any) => ({
              date: dv.paymentDate || dv.approvalDate,
              rate: dv.rate,
              type: dv.label || 'Provento'
            })) || [];
            return { 
              ...asset, 
              currentPrice: live.regularMarketPrice, 
              lastDividend: divHistory[0]?.rate || 0,
              dividendsHistory: divHistory,
              updatedAt: new Date().toLocaleTimeString() 
            };
          }
        }
        if (asset.type === 'Cripto') {
          const mapIds: Record<string, string> = { 'BTC': 'bitcoin', 'ETH': 'ethereum', 'SOL': 'solana', 'LINK': 'chainlink' };
          const id = mapIds[asset.ticker] || asset.ticker.toLowerCase();
          if (cryptoResults[id]) {
            return {
              ...asset,
              currentPrice: cryptoResults[id].brl,
              change: cryptoResults[id].brl_24h_change,
              marketCap: cryptoResults[id].brl_market_cap,
              updatedAt: new Date().toLocaleTimeString()
            };
          }
        }
        return asset;
      });

      setAssets(updated);
      addNotification("Terminal Sincronizado com Sucesso.", "success");
    } catch (e) {
      addNotification("Falha na sincronização do mercado.", "error");
    } finally {
      setIsRefreshingPrices(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage userProfile={userProfile} setActivePage={setActivePage} onAporteClick={() => setIsSimulationOpen(true)} usdRate={usdRate} eurRate={eurRate} />;
      case 'myplan': return <MyPlanPage profile={userProfile} setUserProfile={setUserProfile} setExpenses={setExpenses} onAporteClick={() => setIsSimulationOpen(true)} setActivePage={setActivePage} />;
      case 'wallet': return <WalletPage assets={assets} onRemove={(idx) => setAssets(prev => prev.filter((_, i) => i !== idx))} onAddClick={() => setIsAddAssetOpen(true)} onRefresh={refreshPrices} isRefreshing={isRefreshingPrices} />;
      case 'stocks': return <StocksPage onAnalyze={setSelectedAnalysisAsset} assets={assets} onAddAsset={(a) => { setAssets(prev => [...prev, a]); addNotification(a.ticker + ' adicionado à carteira!', 'success'); }} />;
      case 'crypto': return <CryptoPage onAnalyze={setSelectedAnalysisAsset} />;
      case 'funds': return <FundsPage onAnalyze={setSelectedAnalysisAsset} />;
      case 'tesouro': return <TesouroPage />;
      case 'offshore': return <OffshorePage usdRate={usdRate} />;
      case 'previdencia': return <PrevidenciaPage />;
      case 'coe': return <CoePage />;
      case 'advisor': return <AdvisorPage assets={assets} />;
      case 'robo': return <RoboPage />;
      case 'news': return <NewsPage />;
      case 'academy': return <AcademyPage />;
      case 'health': return <HealthPage expenses={expenses} setExpenses={setExpenses} income={income} setIncome={setIncome} debts={debtList} setDebts={setDebtList} savingsAccount={savings} setSavingsAccount={setSavings} />;
      case 'tax': return <TaxPage />;
      default: return <DashboardPage userProfile={userProfile} setActivePage={setActivePage} onAporteClick={() => setIsSimulationOpen(true)} usdRate={usdRate} eurRate={eurRate} />;
    }
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      <div className="flex min-h-screen bg-[#08080a] text-gray-100 font-sans selection:bg-emerald-500/30">
        <Sidebar activePage={activePage} setActivePage={setActivePage} profile={userProfile} />
        
        <main className="flex-1 overflow-y-auto h-screen relative custom-scrollbar">
          <div className="p-10 max-w-[1600px] mx-auto space-y-8 pb-32">
            <Breadcrumbs activePage={activePage} setActivePage={setActivePage} />
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {renderPage()}
            </div>
          </div>
        </main>

        <div className="fixed top-10 right-10 z-[300] space-y-3 pointer-events-none">
          {notifications.map(n => (
            <div key={n.id} className={`pointer-events-auto flex items-center gap-4 px-8 py-5 rounded-3xl border shadow-2xl animate-in slide-in-from-right-10 duration-500 ${
              n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              n.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
              n.type === 'unlock' ? 'bg-blue-600/20 border-blue-500/30 text-blue-400' :
              'bg-[#0e0e11] border-white/5 text-gray-400'
            }`}>
              <Info size={18} className="shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-widest">{n.message}</span>
            </div>
          ))}
        </div>

        {isSimulationOpen && <SimulationModal isOpen={isSimulationOpen} onClose={() => setIsSimulationOpen(false)} profile={userProfile} />}
        {isAddAssetOpen && <AddAssetModal isOpen={isAddAssetOpen} onClose={() => setIsAddAssetOpen(false)} onAdd={(a) => setAssets(prev => [...prev, a])} />}
        {selectedAnalysisAsset && <AssetAnalysisModal asset={selectedAnalysisAsset} isOpen={!!selectedAnalysisAsset} onClose={() => setSelectedAnalysisAsset(null)} />}
      </div>
    </NotificationContext.Provider>
  );
}
