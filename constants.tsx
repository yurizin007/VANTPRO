import { Asset } from './types';

export const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

// BANCO DE DADOS LOCAL - SNAPSHOT REALISTA (SOLUÇÃO INFALÍVEL PARA BUSCA)
export const B3_MARKET_DATA = [
  { ticker: 'PETR4', nome: 'Petrobras PN', setor: 'Petróleo', preco: 41.60, var: 1.25, tipo: 'Ação' },
  { ticker: 'VALE3', nome: 'Vale ON', setor: 'Mineração', preco: 69.50, var: -0.80, tipo: 'Ação' },
  { ticker: 'ITUB4', nome: 'Itaú Unibanco', setor: 'Bancos', preco: 33.80, var: 0.55, tipo: 'Ação' },
  { ticker: 'BBAS3', nome: 'Banco do Brasil', setor: 'Bancos', preco: 58.20, var: 0.90, tipo: 'Ação' },
  { ticker: 'WEGE3', nome: 'WEG ON', setor: 'Indústria', preco: 37.50, var: 2.10, tipo: 'Ação' },
  { ticker: 'MXRF11', nome: 'Maxi Renda', setor: 'FII Papel', preco: 10.42, var: 0.10, tipo: 'FII' },
  { ticker: 'HGLG11', nome: 'CSHG Logística', setor: 'FII Tijolo', preco: 161.50, var: -0.15, tipo: 'FII' },
  { ticker: 'KNRI11', nome: 'Kinea Renda', setor: 'FII Tijolo', preco: 158.90, var: 0.30, tipo: 'FII' },
  { ticker: 'XPML11', nome: 'XP Malls', setor: 'FII Shopping', preco: 115.10, var: 0.75, tipo: 'FII' },
  { ticker: 'MGLU3', nome: 'Magalu', setor: 'Varejo', preco: 2.05, var: -4.20, tipo: 'Ação' },
  { ticker: 'BBDC4', nome: 'Bradesco PN', setor: 'Bancos', preco: 14.90, var: -1.10, tipo: 'Ação' },
  { ticker: 'VGHF11', nome: 'Valora Hedge', setor: 'FII Papel', preco: 9.20, var: 0.00, tipo: 'FII' },
  { ticker: 'TAEE11', nome: 'Taesa Unit', setor: 'Elétrica', preco: 35.40, var: 0.40, tipo: 'Ação' },
  { ticker: 'ALZR11', nome: 'Alianza Trust', setor: 'FII Tijolo', preco: 117.80, var: 0.20, tipo: 'FII' },
  { ticker: 'CPLE6', nome: 'Copel', setor: 'Elétrica', preco: 9.80, var: 1.50, tipo: 'Ação' },
  { ticker: 'BTC', nome: 'Bitcoin', setor: 'Cripto', preco: 385000, var: 0.50, tipo: 'Cripto' },
  { ticker: 'ETH', nome: 'Ethereum', setor: 'Cripto', preco: 12500, var: -0.20, tipo: 'Cripto' }
];

export const B3_REGISTRY = {
  STOCKS: B3_MARKET_DATA.filter(d => d.tipo === 'Ação').map(d => d.ticker),
  FIIs: B3_MARKET_DATA.filter(d => d.tipo === 'FII').map(d => d.ticker)
};

export const MOCK_STOCKS: Asset[] = B3_MARKET_DATA.filter(d => d.tipo === 'Ação').map(d => ({
  ticker: d.ticker,
  nome: d.nome,
  dy: '---',
  pl: '---',
  currentPrice: d.preco,
  type: 'Ação',
  setor: d.setor,
  quantity: 0,
  averagePrice: 0,
  change: d.var
}));

export const MOCK_FIIs: Asset[] = B3_MARKET_DATA.filter(d => d.tipo === 'FII').map(d => ({
  ticker: d.ticker,
  nome: d.nome,
  dy: '---',
  pvp: '---',
  currentPrice: d.preco,
  type: 'FII',
  setor: d.setor,
  quantity: 0,
  averagePrice: 0,
  change: d.var
}));

export const SUPPLY_CHAIN_DB: Record<string, any> = {
    'PETROLEO_GAS': {
        suppliers: [{ name: "SBM Offshore", status: "Estável" }, { name: "Halliburton", status: "Seguro" }],
        clients: [{ name: "Refinarias China", status: "Alta" }, { name: "Distribuidoras BR", status: "Estável" }],
        description: `Dependência crítica de infraestrutura marítima e demanda asiática.`
    },
    'FINANCEIRO': {
        suppliers: [{ name: "AWS Cloud", status: "Seguro" }, { name: "B3 Clearing", status: "Monopólio" }],
        clients: [{ name: "Consumo Varejo", status: "Inadimplência" }, { name: "Agroindústria", status: "Forte" }],
        description: `Sensibilidade à taxa Selic e ciclo de crédito varejista.`
    }
};