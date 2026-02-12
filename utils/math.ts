
import { Asset } from '../types';

/**
 * CONSTANTES MACRO TERMINAL 2026
 */
export const MACRO_2026 = {
  RISK_FREE_RATE: 0.1225, // Selic Projetada 12.25%
  INFLATION_EXPECTED: 0.0397, // IPCA 3.97%
  GDP_GROWTH: 0.02,
  EQUITY_RISK_PREMIUM: 0.05 // 5% de prêmio de risco BR
};

export class FinancialEngine {
  /**
   * Executa o Scan Completo de um Ativo (Equities ou FIIs)
   */
  static analyze(asset: Asset): Partial<Asset> {
    if (asset.type === 'Renda Fixa' || asset.type === 'Tesouro') {
       return asset; // Renda fixa segue lógica simplificada de juros compostos
    }

    // 1. Valuation
    const valuation = this.calculateValuation(asset);
    
    // 2. Risco
    const risk_metrics = this.calculateRisk(asset);
    
    // 3. Tags / Factor Investing
    const tags = this.generateTags(asset, valuation);

    return {
      ...asset,
      valuation,
      risk_metrics,
      tags
    };
  }

  /**
   * Calcula projeção de Renda Fixa (Juros Compostos)
   */
  static projectFixedIncome(asset: Asset, years: number, currentSelic: number): number {
    const p = asset.averagePrice * asset.quantity;
    const taxa = asset.taxa || 0;
    let annualRate = 0;

    if (asset.indexador === 'PRE') {
      annualRate = taxa / 100;
    } else if (asset.indexador === 'CDI') {
      annualRate = (taxa / 100) * (currentSelic / 100);
    } else if (asset.indexador === 'IPCA') {
      annualRate = (taxa / 100) + MACRO_2026.INFLATION_EXPECTED;
    }

    return p * Math.pow(1 + annualRate, years);
  }

  /**
   * Busca Selic atual via API do Banco Central
   */
  static async fetchCurrentSelic(): Promise<number> {
    try {
      const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados/ultimos/1?formato=json');
      const data = await response.json();
      return parseFloat(data[0].valor) || 11.25;
    } catch (e) {
      return 11.25; // Fallback
    }
  }

  private static calculateValuation(asset: Asset) {
    const lpa = Number(asset.lpa) || 1;
    const vpa = Number(asset.vpa) || 1;
    
    // Parser seguro para DY (Pode vir como "14.5%" ou 0.145)
    const dyRaw = typeof asset.dy === 'string' ? parseFloat(asset.dy.replace('%', '')) : (asset.dy || 0);
    const dyValue = dyRaw > 1 ? dyRaw / 100 : dyRaw;
    
    const divPerShare = asset.currentPrice * dyValue;

    // Graham: sqrt(22.5 * LPA * VPA)
    const grahamPrice = lpa > 0 ? Math.sqrt(22.5 * lpa * vpa) : null;

    // Bazin: Dividendos / 0.06
    const bazinCeiling = divPerShare / 0.06;

    // Gordon: D1 / (k - g)
    const k = MACRO_2026.RISK_FREE_RATE + MACRO_2026.EQUITY_RISK_PREMIUM;
    const g = MACRO_2026.INFLATION_EXPECTED;
    const gordonPrice = divPerShare > 0 ? divPerShare / (k - g) : 0;

    // Parser seguro para PL (Pode vir como string "8.2" ou number 8.2)
    const plValue = typeof asset.pl === 'string' ? parseFloat(asset.pl.replace(',', '.')) : (asset.pl || 0);
    const shillerCape = Number(plValue) || 10;

    // Status logic
    let status: 'UNDERVALUED' | 'FAIR' | 'OVERVALUED' = 'FAIR';
    if (grahamPrice && asset.currentPrice < grahamPrice * 0.8) status = 'UNDERVALUED';
    else if (grahamPrice && asset.currentPrice > grahamPrice * 1.2) status = 'OVERVALUED';

    return {
      grahamPrice,
      bazinCeiling,
      gordonPrice,
      shillerCape,
      status
    };
  }

  private static calculateRisk(asset: Asset) {
    const vol = Number(asset.vol) || 0.25;
    const beta = Number(asset.beta) || 1.1;
    
    // Sharpe Projetado 2026
    const annualReturn = 0.15; 
    const sharpeProjected = (annualReturn - MACRO_2026.RISK_FREE_RATE) / vol;

    const var95 = -(1.65 * (vol / Math.sqrt(252)));
    const cvar95 = var95 * 1.2; 

    return {
      volatility: vol,
      beta,
      sharpeProjected,
      var95: var95 * 100,
      cvar95: cvar95 * 100
    };
  }

  private static generateTags(asset: Asset, valuation: any): string[] {
    const tags: string[] = [];
    const dyRaw = typeof asset.dy === 'string' ? parseFloat(asset.dy.replace('%', '')) : (asset.dy || 0);
    const dy = dyRaw > 1 ? dyRaw : dyRaw * 100;
    
    const payout = Number(asset.payout) || 0;
    const roe = Number(asset.roe) || 0;
    const dividaEbitda = Number(asset.dividaEbitda) || 0;
    const marketCap = Number(asset.marketCap) || 50000000000;
    const pl = typeof asset.pl === 'string' ? parseFloat(asset.pl) : (asset.pl || 0);
    const pvp = typeof asset.pvp === 'string' ? parseFloat(asset.pvp) : (asset.pvp || 0);

    if (dy > 8 && payout < 100) tags.push("#DividendKing");
    if (roe > 18 && dividaEbitda < 2) tags.push("#Quality");
    if (marketCap < 10000000000) tags.push("#SmallCap");
    if (Number(pl) < 6 && Number(pvp) < 0.8) tags.push("#DeepValue");
    if (asset.ticker.startsWith('P') || asset.ticker.startsWith('B')) tags.push("#StateOwnedRisk");

    return tags;
  }
}

export function geometricBrownianMotion(
  S0: number, 
  mu: number, 
  sigma: number, 
  T: number, 
  steps: number, 
  simulations: number = 500
) {
  const dt = T / steps;
  const paths: number[][] = [];
    
  for (let sim = 0; sim < simulations; sim++) {
    const path = [S0];
    let S = S0;
        
    for (let i = 1; i <= steps; i++) {
      const u1 = Math.random() || 0.0000001;
      const u2 = Math.random();
      const Z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      
      const drift = (mu - 0.5 * sigma ** 2) * dt;
      const diffusion = sigma * Math.sqrt(dt) * Z;
      S = S * Math.exp(drift + diffusion);
      path.push(S);
    }
    paths.push(path);
  }
    
  const percentiles = [];
  for (let step = 0; step <= steps; step++) {
    const values = paths.map(p => p[step]).sort((a, b) => a - b);
    percentiles.push({
      time: `D+${step}`,
      p10: values[Math.floor(simulations * 0.1)],
      p50: values[Math.floor(simulations * 0.5)],
      p90: values[Math.floor(simulations * 0.9)]
    });
  }
  return percentiles;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function parsePrice(val: any): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.replace('R$', '').replace('$', '').replace(/\s/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  }
  return 0;
}
