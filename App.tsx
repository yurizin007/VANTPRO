import React, { useState, useEffect, createContext, useContext } from 'react';
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
import { AddAssetModal } from './modals/AddAssetModal';
import { SimulationModal } from './modals/SimulationModal';
import { AssetAnalysisModal } from './modals/AssetAnalysisModal';
import { Asset, PageId, Expense, Debt, UserProfile } from './types';
import { Info, LayoutDashboard } from 'lucide-react';

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
  if (!context) throw new Error("useNotification deve ser usado dentro de um provedor");
  return context;
};

// Componente simples para seções futuras
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-700">
    <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 max-w-xl">
      <LayoutDashboard size={48} className="text-emerald-500 opacity-50 mx-auto mb-6" />
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{title}</h2>
      <p className="text-gray-500 text-sm font-medium mt-4">Esta inteligência está sendo processada pelo Kernel Vantez e estará disponível em seu terminal em breve.</p>
    </div>
  </div>
);

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vantez_user_profile');
    if (saved) return JSON.parse(saved);
    
    return {
      nome: 'Investidor Pro',
      nivelConhecimento: 'Avancado',
      perfilRisco: 'Arrojado',
      objetivo: 'Independência Financeira',
      aporteMensal: 2500,
      temReserva: 'Sim',
      temDividas: false,
      horizonteAnos: 15,
      faseAtual: 3, 
      scoreRisco: 85,
      unlockedPages: [],
      xp: 500
    };
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('vantez_assets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vantez_assets', JSON.stringify(assets));
  }, [assets]);
  
  const [income, setIncome] = useState(12000);
  const [debtList, setDebtList] = useState<Debt[]>([]);
  const [savings, setSavings] = useState(50000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Essencial', label: 'Moradia', value: 3500 },
    { id: '2', category: 'Estilo de Vida', label: 'Lazer', value: 1500 }
  ]);

  const [selectedAnalysisAsset, setSelectedAnalysisAsset] = useState<Asset | null>(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const refreshPrices = async (forced = false) => {
    if (assets.length === 0) return;
    setIsRefreshingPrices(true);
    addNotification("Sincronizando com B3 real-time...", "info");
    try {
      const b3Assets = assets.filter(a => a.type === 'Ação' || a.type === 'FII');
      if (b3Assets.length > 0) {
        const tickers = b3Assets.map(a => a.ticker).join(',');
        const response = await fetch(`https://brapi.dev/api/quote/${tickers}?token=demo`);
        const data = await response.json();
        if (data.results) {
          const updatedAssets = assets.map(item => {
            const liveData = data.results.find((d: any) => d.symbol === item.ticker);
            return liveData ? { ...item, currentPrice: liveData.regularMarketPrice } : item;
          });
          setAssets(updatedAssets);
          addNotification("B3: Carteira atualizada.", "success");
        }
      }
    } catch (e) {
      addNotification("Falha na conexão B3.", "error");
    } finally {
      setIsRefreshingPrices(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage userProfile={userProfile} setActivePage={setActivePage} onAporteClick={() => setIsSimulationOpen(true)} />;
      case 'myplan': return <MyPlanPage profile={userProfile} setUserProfile={setUserProfile} setExpenses={setExpenses} onAporteClick={() => setIsSimulationOpen(true)} setActivePage={setActivePage} />;
      case 'wallet': return <WalletPage assets={assets} onRemove={(idx) => setAssets(prev => prev.filter((_, i) => i !== idx))} onAddClick={() => setIsAddAssetOpen(true)} onRefresh={() => refreshPrices(true)} isRefreshing={isRefreshingPrices} />;
      case 'stocks': return <StocksPage onAnalyze={setSelectedAnalysisAsset} />;
      case 'crypto': return <CryptoPage onAnalyze={setSelectedAnalysisAsset} />;
      case 'funds': return <FundsPage onAnalyze={setSelectedAnalysisAsset} />;
      case 'tesouro': return <TesouroPage />;
      case 'offshore': return <OffshorePage />;
      case 'previdencia': return <PrevidenciaPage />;
      case 'coe': return <CoePage />;
      case 'advisor': return <AdvisorPage assets={assets} />;
      case 'robo': return <RoboPage />;
      case 'news': return <NewsPage />;
      case 'academy': return <AcademyPage />;
      case 'health': return <HealthPage expenses={expenses} setExpenses={setExpenses} income={income} setIncome={setIncome} debts={debtList} setDebts={setDebtList} savingsAccount={savings} setSavingsAccount={setSavings} />;
      case 'tax': return <PlaceholderPage title="Impostos Simplificados" />;
      default: return <DashboardPage userProfile={userProfile} setActivePage={setActivePage} onAporteClick={() => setIsSimulationOpen(true)} />;
    }
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      <div className="flex min-h-screen bg-[#08080a] text-gray-100 font-sans overflow-hidden">
        <Sidebar activePage={activePage} setActivePage={setActivePage} profile={userProfile} />
        
        <main className="flex-1 overflow-y-auto h-screen relative custom-scrollbar bg-[#08080a]">
          <div className="p-10 max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
            <Breadcrumbs activePage={activePage} setActivePage={setActivePage} />
            {renderPage()}
          </div>
        </main>

        <div className="fixed top-8 right-8 z-[200] space-y-4">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-8 ${
              n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              n.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
              n.type === 'unlock' ? 'bg-blue-600/20 border-blue-500/30 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' :
              'bg-white/5 border-white/10 text-gray-400'
            }`}>
              <Info size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{n.message}</span>
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