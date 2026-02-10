
/**
 * GERADOR DE MERCADO MATEMÁTICO (VANTEZ KERNEL FALLBACK)
 * Gera dados instantâneos para o gráfico não quebrar em caso de latência ou falha externa.
 */
export function gerarHistoricoSintetico(ticker: string) {
  const historico = [];
  const dias = 30;
  
  // Cria um número base usando as letras do Ticker (estabilidade visual por ticker)
  let seed = 0;
  for (let i = 0; i < ticker.length; i++) {
    seed += ticker.charCodeAt(i);
  }
  
  let precoBase = (seed % 50) + 10; // Preço entre 10 e 60 reais
  
  for (let i = dias; i >= 0; i--) {
    // Seno + Random para criar uma curva de mercado realista
    const oscilacao = Math.sin(i + seed) * 2 + (Math.random() - 0.5);
    const preco = Math.max(1, precoBase + oscilacao);

    historico.push({
      time: `D+${dias - i}`,
      date: new Date(Date.now() - i * 86400000).toLocaleDateString('pt-BR'),
      price: parseFloat(preco.toFixed(2))
    });
  }

  return historico;
}
