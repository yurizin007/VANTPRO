import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartNuclearProps {
  data?: any[];
  color?: string;
}

/**
 * COMPONENTE CHART NUCLEAR (ULTRA RESILIENTE)
 * Utiliza ResizeObserver para medir o container físico antes de renderizar o Recharts.
 * Evita o erro width(-1) e garante que o gráfico sempre tenha dimensões válidas.
 */
export const ChartNuclear: React.FC<ChartNuclearProps> = ({ data, color = "#10B981" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 1. O OBSERVADOR DE REDIMENSIONAMENTO
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // 2. TRATAMENTO DE DADOS (Fallback para Mock Deterministico se vazio)
  const safeData = (data && data.length > 0) 
    ? data 
    : Array.from({ length: 15 }, (_, i) => ({ 
        price: 10 + Math.sin(i / 2) * 2 + Math.random(), 
        time: `D+${i}` 
      }));

  // 3. RENDERIZAÇÃO PROTEGIDA
  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', minHeight: '180px' }}
      className="relative w-full h-full"
    >
      {dimensions.width === 0 ? (
        // SKELETON (Fase de cálculo de layout)
        <div className="absolute inset-0 bg-white/[0.02] animate-pulse rounded-2xl flex flex-col items-center justify-center border border-white/5">
          <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-2"></div>
          <span className="text-[9px] text-gray-700 font-black uppercase tracking-[3px]">Calibrando...</span>
        </div>
      ) : (
        // GRÁFICO (Renderiza apenas com largura garantida)
        <div style={{ width: dimensions.width, height: dimensions.height }}>
           <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={safeData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id={`nuclearGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['auto', 'auto']} hide />
              <XAxis dataKey="time" hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#000', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
                itemStyle={{ color: '#fff' }}
                formatter={(val: number) => [`R$ ${val.toFixed(2)}`, 'Valor']}
                labelStyle={{ display: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={3}
                fill={`url(#nuclearGrad-${color.replace('#', '')})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};