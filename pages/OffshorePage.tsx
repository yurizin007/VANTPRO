import React, { useState } from 'react';
import { Globe, Coins, Plane, FileText, Download, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { Card, MetricCard, Disclaimer } from '../components/SharedUI';
import { formatCurrency } from '../utils/math';
import { useNotification } from '../App';
import { reportService } from '../services/reportService';
import { geminiService } from '../services/geminiService';

export const OffshorePage: React.FC = () => {
  const { addNotification } = useNotification();
  const [brlAmount, setBrlAmount] = useState(10000);
  const [usdRate] = useState(5.15);
  const [iof, setIof] = useState(1.1); 
  const [profitUsd, setProfitUsd] = useState(5000);
  const [loading, setLoading] = useState(false);
  
  const convertedUsd = (brlAmount / (usdRate * (1 + iof/100))).toFixed(2);
  const taxDue = (profitUsd * 0.15).toFixed(2); 

  const handleStartOperation = () => {
    setLoading(true);
    addNotification("Iniciando Compliance Check...", "info");
    setTimeout(() => {
      addNotification("KYC/AML Verificado.", "success");
      setTimeout(() => {
        setLoading(false);
        addNotification(`Operação de $${convertedUsd} enviada para mesa de câmbio!`, "success");
      }, 1500);
    }, 1500);
  };

  const handleGenerateDARF = async () => {
    const printWin = reportService.openLoadingPDF();
    const summary = `Ganho Offshore: $${profitUsd} | Alíquota: 15% | DARF Estimado: $${taxDue}`;
    try {
      const content = await geminiService.generateReportContent("Relatório Tributário Offshore", summary);
      reportService.finalizePDF(printWin, "DARF Simulado - Lei 14.754", content, summary);
      addNotification("Documento gerado com sucesso.", "success");
    } catch (e) {
      if (printWin) printWin.close();
      addNotification("Erro ao gerar PDF.", "error");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-6">
        <div className="bg-blue-600 p-4 rounded-2xl shadow-2xl shadow-blue-900/40">
          <Globe className="text-white w-8 h-8" />
        </div>
        <div className="text-left">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Offshore & Eficiência Tributária</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px]">Gestão de Capital Global e Planejamento Fiscal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="DÓLAR PTAX" value={`R$ ${usdRate.toFixed(2)}`} change="+0.2%" isPositive={true} />
        <MetricCard title="CARTEIRA GLOBAL" value="$ 12,450" change="+1.5%" isPositive={true} />
        <MetricCard title="IOF CONTA INV." value={`${iof}%`} change="Efetivo" isPositive={false} />
        <MetricCard title="LEI 14.754" value="15%" change="Flat Rate" isPositive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
             <Coins className="w-48 h-48 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tighter border-b border-white/5 pb-6 flex items-center gap-4 relative z-10">
             <Coins className="w-8 h-8 text-emerald-500" /> Simulador de Remessa
          </h3>
          <div className="space-y-8 relative z-10">
             <div className="space-y-4">
                <label className="text-[10px] text-gray-600 uppercase font-black tracking-[4px] block px-1">Aporte em Reais (BRL)</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 font-black">R$</span>
                   <input 
                     type="number" 
                     className="w-full bg-black/40 border-2 border-white/5 rounded-[1.5rem] pl-16 pr-6 py-6 text-white outline-none focus:border-emerald-500 transition-all font-mono font-black text-2xl shadow-inner" 
                     value={brlAmount}
                     onChange={(e) => setBrlAmount(Number(e.target.value))}
                   />
                </div>
             </div>
             
             <div className="flex flex-col md:flex-row gap-6 p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="flex-1">
                   <p className="text-[10px] text-gray-500 uppercase font-black tracking-[3px] mb-3">Taxa IOF</p>
                   <select 
                     className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all"
                     value={iof}
                     onChange={(e) => setIof(Number(e.target.value))}
                   >
                      <option value="1.1">1.1% (Mesma Titularidade)</option>
                      <option value="0.38">0.38% (Câmbio Disponibilidade)</option>
                   </select>
                </div>
                <div className="w-[1px] bg-white/5 hidden md:block"></div>
                <div className="flex-1 text-right">
                   <p className="text-[10px] text-gray-500 uppercase font-black tracking-[3px] mb-3">Valor Líquido (USD)</p>
                   <p className="text-4xl font-black text-blue-400 tracking-tighter">$ {convertedUsd}</p>
                </div>
             </div>

             <button 
               onClick={handleStartOperation}
               disabled={loading}
               className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[5px] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/30 active:scale-95 disabled:opacity-50"
             >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Plane className="w-6 h-6" />}
                {loading ? "Processando..." : "Iniciar Operação"}
             </button>
          </div>
        </Card>

        <Card className="p-10 relative overflow-hidden bg-gradient-to-br from-amber-600/[0.03] to-transparent border-amber-500/10">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
             <FileText className="w-48 h-48 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tighter border-b border-white/5 pb-6 flex items-center gap-4 relative z-10">
             <FileText className="w-8 h-8 text-amber-500" /> Auditoria Tributária (Lei 14.754)
          </h3>
          <div className="space-y-8 relative z-10">
             <div className="bg-amber-900/10 p-8 rounded-[2rem] border border-amber-500/20 shadow-xl">
                <p className="text-xs text-amber-200 mb-4 font-black flex items-center gap-3 uppercase tracking-widest">
                   <AlertTriangle size={18}/> Novo Framework 2024
                </p>
                <p className="text-[11px] text-gray-500 text-justify leading-relaxed font-medium">
                   Lucros acumulados no exterior (offshore) agora são tributados a uma alíquota anual fixa de 15% na DAA, independentemente da repatriação ou disponibilidade financeira imediata.
                </p>
             </div>
             
             <div className="space-y-4">
                <label className="text-[10px] text-gray-600 uppercase font-black tracking-[4px] block px-1">Ganho de Capital Realizado (USD)</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500 font-black">$</span>
                   <input 
                     type="number" 
                     className="w-full bg-black/40 border-2 border-white/5 rounded-[1.5rem] pl-16 pr-6 py-6 text-white outline-none focus:border-amber-500 transition-all font-mono font-black text-2xl shadow-inner" 
                     value={profitUsd}
                     onChange={(e) => setProfitUsd(Number(e.target.value))}
                   />
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-black/40 border border-white/5 rounded-[2rem] shadow-inner text-center">
                   <p className="text-[9px] text-gray-600 uppercase font-black tracking-[3px] mb-2">Alíquota Base</p>
                   <p className="text-3xl font-black text-white tracking-tighter">15%</p>
                </div>
                <div className="p-8 bg-amber-500/10 border border-amber-500/30 rounded-[2rem] shadow-xl text-center">
                   <p className="text-[9px] text-amber-200/50 uppercase font-black tracking-[3px] mb-2">Imposto Retido (Est.)</p>
                   <p className="text-3xl font-black text-amber-400 tracking-tighter">$ {taxDue}</p>
                </div>
             </div>

             <button 
               onClick={handleGenerateDARF}
               className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[5px] transition-all flex items-center justify-center gap-4 group"
             >
                <Download className="w-6 h-6 group-hover:text-amber-500 transition-colors" /> Gerar DARF Simulado
             </button>
          </div>
        </Card>
      </div>
      <Disclaimer />
    </div>
  );
};