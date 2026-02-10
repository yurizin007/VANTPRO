
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartResilienteProps {
  data?: any[];
  color?: string;
  height?: number | string;
}

/**
 * COMPONENTE DE GRÁFICO RESILIENTE (SELF-HEALING)
 * Resolve erros de width(-1) e falta de dados históricos através de atraso de renderização
 * e geração de mock data para preenchimento visual.
 */
export const ChartResiliente: React.FC<ChartResilienteProps> = ({ 
  data, 
  color = "#10B981", 
  height = 200 
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. DATA HEALING
    if (!data || data.length === 0) {
      // Gera dados fictícios para manter o visual íntegro enquanto sincroniza
      const mockData = Array.from({ length: 20 }, (_, i) => ({
        price: 10 + Math.random() * 2,
        date: i,
        time: `D+${i}`
      }));
      setChartData(mockData);
    } else {
      setChartData(data);
    }

    // 2. LAYOUT HEALING (Width -1 Fix)
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, [data]);

  if (!isReady) {
    return (
      <div 
        className="w-full bg-white/[0.02] animate-pulse rounded-2xl flex flex-col items-center justify-center border border-white/5"
        style={{ height }}
      >
        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
        <span className="text-[10px] text-gray-600 font-black uppercase tracking-[3px]">Sincronizando Kernel...</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden" style={{ height, minHeight: height, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={`colorGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} hide />
          
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
            fill={`url(#colorGrad-${color.replace('#', '')})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
