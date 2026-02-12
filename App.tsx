
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

// --- Componentes Auxiliares ---
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-700">
    <div className="bg-[#0e0e11] p-16 rounded-[4rem] border border-white/5 max-w-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <Terminal size={64} className="text-emerald-500/30 mx-auto mb-8" />
      <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{title}</h2>
      <p className="text-gray-500 text-sm font-medium mt-6 leading-relaxed">
        O Kernel Vantez está processando dados estruturais para esta seção. A disponibilidade no seu terminal ocorrerá em breve.
      </p>
    </div>
  </div>
);

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  
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
    if (assets.length === 0) return;
    setIsRefreshingPrices(true);
    addNotification("Sincronizando Kernel com B3 via AI...", "info");
    try {
      const b3Assets = assets.filter(a => a.type === 'Ação' || a.type === 'FII');
      if (b3Assets.length > 0) {
        const tickers = b3Assets.map(a => a.ticker).join(',');
        const response = await fetch(`https://brapi.dev/api/quote/${tickers}?token=demo`);
        const data = await response.json();
        if (data.results) {
          const updatedAssets = assets.map(item => {
            const liveData = data.results.find((d: any) => d.symbol === item.ticker);
            return liveData ? { ...item, currentPrice: liveData.regularMarketPrice, updatedAt: new Date().toLocaleTimeString() } : item;
          });
          setAssets(updatedAssets);
          addNotification("Preços atualizados com sucesso.", "success");
        }
      }
    } catch (e) {
      addNotification("Erro na sincronização B3.", "error");
    } finally {
      setIsRefreshingPrices(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage userProfile={userProfile} setActivePage={setActivePage} onAporteClick={() => setIsSimulationOpen(true)} />;
      case 'myplan': return <MyPlanPage profile={userProfile} setUserProfile={setUserProfile} setExpenses={setExpenses} onAporteClick={() => setIsSimulationOpen(true)} setActivePage={setActivePage} />;
      case 'wallet': return <WalletPage assets={assets} onRemove={(idx) => setAssets(prev => prev.filter((_, i) => i !== idx))} onAddClick={() => setIsAddAssetOpen(true)} onRefresh={refreshPrices} isRefreshing={isRefreshingPrices} />;
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
      case 'tax': return <PlaceholderPage title="Gestão de Impostos" />;
      default: return <DashboardPage userProfile={userProfile} setActivePage={setActivePage} onAporteClick={() => setIsSimulationOpen(true)} />;
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

        {/* Sistema de Notificações */}
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

        {/* Modais */}
        {isSimulationOpen && <SimulationModal isOpen={isSimulationOpen} onClose={() => setIsSimulationOpen(false)} profile={userProfile} />}
        {isAddAssetOpen && <AddAssetModal isOpen={isAddAssetOpen} onClose={() => setIsAddAssetOpen(false)} onAdd={(a) => setAssets(prev => [...prev, a])} />}
        {selectedAnalysisAsset && <AssetAnalysisModal asset={selectedAnalysisAsset} isOpen={!!selectedAnalysisAsset} onClose={() => setSelectedAnalysisAsset(null)} />}
      </div>
    </NotificationContext.Provider>
  );
}
