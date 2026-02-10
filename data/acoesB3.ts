export const ACOES_B3_POR_SETOR = {
  FINANCEIRO: ['ITUB4', 'BBDC4', 'BBAS3', 'SANB11', 'BBSE3', 'BPAC11', 'BRSR6', 'ITSA4', 'B3SA3', 'IRBR3'],
  VAREJO: ['MGLU3', 'LREN3', 'AMER3', 'PETZ3', 'CRFB3', 'SOMA3', 'GUAR3', 'AMAR3', 'CEAB3', 'ARZZ3'],
  ENERGIA: ['PETR4', 'PETR3', 'ELET3', 'ELET6', 'CMIG4', 'ENGI11', 'CPLE6', 'TAEE11', 'ENEV3', 'NEOE3', 'EGIE3'],
  MINERACAO: ['VALE3', 'CSNA3', 'GGBR4', 'USIM5', 'GOAU4', 'CMIN3', 'FESA4', 'SUZB3'],
  CONSUMO: ['ABEV3', 'JBSS3', 'BEEF3', 'MRFG3', 'SMTO3', 'BRFS3', 'NTCO3', 'MDIA3', 'GRND3'],
  TECNOLOGIA: ['LWSA3', 'TOTS3', 'POSI3', 'CASH3', 'IFCM3', 'WEGE3'],
  IMOBILIARIO: ['CYRE3', 'MRVE3', 'EZTC3', 'JHSF3', 'CURY3'],
  LOGISTICA: ['RAIL3', 'STBP3', 'CCRO3'],
  SAUDE: ['RDOR3', 'FLRY3', 'HAPV3', 'VVTR3'],
  FII_PAPEL: ['KNCR11', 'MXRF11', 'CPTS11', 'RBRR11', 'VGIP11', 'MCCI11', 'KNSC11', 'VRTA11'],
  FII_TIJOLO: ['HGLG11', 'BTLG11', 'XPML11', 'VISC11', 'HGRU11', 'BRCO11', 'ALZR11', 'VILG11']
};

export const NOMES_EMPRESAS: Record<string, string> = {
  ITUB4: 'Itaú Unibanco',
  BBDC4: 'Bradesco',
  BBAS3: 'Banco do Brasil',
  SANB11: 'Santander',
  BBSE3: 'BB Seguridade',
  MGLU3: 'Magazine Luiza',
  LREN3: 'Lojas Renner',
  PETR4: 'Petrobras',
  VALE3: 'Vale',
  SUZB3: 'Suzano',
  WEGE3: 'WEG',
  ABEV3: 'Ambev',
  ITSA4: 'Itaúsa',
  B3SA3: 'B3 S.A.',
  KNCR11: 'Kinea Rendimentos',
  MXRF11: 'Maxi Renda',
  HGLG11: 'CSHG Logística',
  XPML11: 'XP Malls',
  PRIO3: 'Prio',
  EMBR3: 'Embraer'
};

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function gerarDadosMockDeterministico(ticker: string) {
  const hash = hashString(ticker);
  const precoBase = 10 + (hash % 90); 
  const decimais = (hash % 100) / 100;
  const preco = parseFloat((precoBase + decimais).toFixed(2));
  
  const variacaoHash = hashString(ticker + 'var');
  const variacao = ((variacaoHash % 600) - 300) / 100; 
  
  const dy = (hash % 8) + (hash % 100 / 100) + 2; // Garante DY entre 2% e 10%
  const pl = (hash % 12) + 6;

  let setor = ticker.endsWith('11') ? 'FII / Híbrido' : 'Outros / Diversos';
  
  // Busca exata por setor mapeado
  for (const [s, acoes] of Object.entries(ACOES_B3_POR_SETOR)) {
    if (acoes.includes(ticker)) {
      setor = s;
      break;
    }
  }

  // Tenta adivinhar FII se não estiver no mapeamento mas terminar em 11
  if (setor === 'Outros / Diversos' && ticker.endsWith('11')) {
    setor = 'FII_PAPEL';
  }

  return {
    ticker,
    nome: NOMES_EMPRESAS[ticker] || `${ticker.replace(/\d+$/, '')} S.A.`,
    currentPrice: preco,
    change: parseFloat(variacao.toFixed(2)),
    setor,
    dy: `${dy.toFixed(2)}%`,
    pl: pl.toFixed(1),
    pvp: (0.7 + (hash % 50) / 100).toFixed(2),
    isMock: true,
    type: ticker.length <= 5 ? 'Ação' : 'FII',
    quantity: 0,
    averagePrice: 0,
    tags: ["#LocalSeeding"]
  };
}