
import React, { useMemo } from 'react';
import { gerarHistoricoSintetico } from '../services/marketGenerator';

interface ChartDefinitivoProps {
  data?: any[];
  color?: string;
  ticker?: string;
}

/**
 * CHART DEFINITIVO - SVG NATIVO (ZERO DEPENDÊNCIAS)
 * Esta é a solução final para o erro width(-1) do Recharts. 
 * O SVG escala automaticamente com o container pai sem depender de cálculos de largura do JS.
 */
export const ChartDefinitivo: React.FC<ChartDefinitivoProps> = ({ 
  data, 
  color = "#10B981", 
  ticker = "MOCK3" 
}) => {
  // 1. DATA HEALING & BYPASS
  const chartData = useMemo(() => {
    const raw = (data && data.length > 0) ? data : gerarHistoricoSintetico(ticker);
    // Extrai apenas os preços para o mapeamento SVG
    return raw.map(item => typeof item === 'number' ? item : (item.price || 0));
  }, [data, ticker]);

  // 2. NORMALIZAÇÃO MATEMÁTICA (viewBox 0-100)
  const paths = useMemo(() => {
    if (chartData.length === 0) return { line: '', area: '' };

    const min = Math.min(...chartData);
    const max = Math.max(...chartData);
    const range = max - min || 1;

    const points = chartData.map((val, i) => {
      const x = (i / (chartData.length - 1)) * 100;
      const y = 100 - ((val - min) / range) * 90 - 5; // Margem de 5% topo/fundo
      return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    const areaPath = `${linePath} L 100,100 L 0,100 Z`;

    return { line: linePath, area: areaPath };
  }, [chartData]);

  const gradId = `grad-${ticker.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="w-full h-full relative group min-h-[120px]">
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Área de Preenchimento */}
        <path 
          d={paths.area} 
          fill={`url(#${gradId})`} 
          stroke="none" 
          className="transition-all duration-700 ease-in-out"
        />
        
        {/* Linha do Gráfico */}
        <path 
          d={paths.line} 
          fill="none" 
          stroke={color} 
          strokeWidth="2.5" 
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-700 ease-in-out"
        />
      </svg>
      
      {/* Tooltip Simulado (Opcional - Invisível por padrão para manter estética) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute top-0 right-0 p-2">
           <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">Visualização SVG Ativa</span>
        </div>
      </div>
    </div>
  );
};
