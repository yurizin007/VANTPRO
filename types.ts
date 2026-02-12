
export type AssetType = 'Ação' | 'FII' | 'Cripto' | 'Tesouro' | 'Offshore' | 'Previdência' | 'Renda Fixa';

export interface Asset {
  ticker: string;
  name?: string;
  nome?: string; // Mantido para compatibilidade
  type: AssetType | string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  setor?: string;
  change?: number;
  dy?: string;
  pl?: string | number;
  pvp?: string | number;
  isTopPick?: boolean;
  lpa?: number;
  vpa?: number;
  payout?: number;
  roe?: number;
  dividaEbitda?: number;
  marketCap?: number;
  updatedAt?: string;
  
  // Proventos e Dividendos
  lastDividend?: number;
  dividendsHistory?: { date: string, rate: number, type: string }[];
  nextEstimatedDate?: string;

  // Novos campos para Renda Fixa
  maturityDate?: string;
  indexador?: 'CDI' | 'IPCA' | 'PRE';
  taxa?: number; // Ex: 11.5 ou 110 (para 110% CDI)
  emissor?: string;
  fgcCoberto?: boolean;

  valuation?: {
    grahamPrice: number | null;
    bazinCeiling: number;
    gordonPrice: number;
    shillerCape: number;
    status: 'UNDERVALUED' | 'FAIR' | 'OVERVALUED';
  };
  risk_metrics?: {
    volatility: number;
    beta: number;
    sharpeProjected: number;
    cvar95: number;
    var95: number;
  };
  tags?: string[];
  piotroski?: number;
  altman?: number;
  vol?: number;
  beta?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  exchangeFlow?: string;
  correlationSPX?: number;
  mvrv?: number;
  supplyShock?: boolean;
  onChainScore?: number;
  whaleActivity?: string;
}

export interface Trade {
  id: string;
  ticker: string;
  type: 'Compra' | 'Venda';
  assetType: 'Ação' | 'FII' | 'Cripto';
  strategy: 'Swing Trade' | 'Day Trade';
  quantity: number;
  price: number;
  date: string;
  profit?: number; // Calculado no momento da venda
  taxDue?: number; // Calculado no momento da venda
}

export interface UserProfile {
  nome: string;
  nivelConhecimento: 'Iniciante' | 'Intermediario' | 'Avancado';
  perfilRisco: 'Conservador' | 'Moderado' | 'Arrojado';
  objetivo: string;
  aporteMensal: number;
  temReserva: 'Sim' | 'Parcial' | 'Nao';
  temDividas: boolean;
  horizonteAnos: number;
  faseAtual: 1 | 2 | 3; 
  scoreRisco: number;
  unlockedPages: PageId[];
  xp: number;
}

export interface QuizResult {
  profile: UserProfile;
}

export type PageId = 
  | 'dashboard' | 'myplan' | 'wallet' | 'stocks' | 'crypto' | 'funds' 
  | 'tesouro' | 'offshore' | 'previdencia' | 'advisor' 
  | 'robo' | 'coe' | 'news' | 'health' | 'academy' | 'tax' | 'quiz';

export interface NewsItem {
  id: number;
  tag: string;
  time: string;
  title: string;
  source: string;
  content: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Expense {
  id: string;
  category: 'Essencial' | 'Estilo de Vida' | 'Investimento';
  label: string;
  value: number;
}

export interface Debt {
  id: string;
  label: string;
  balance: number;
  interestRate: number;
  minPayment: number;
}
