
import React, { useState } from 'react';
import { Bot, Send, Loader2, Sparkles, ExternalLink, Binary, Terminal, TrendingUp, Lightbulb, ChevronRight, MessageSquareCode, FileText } from 'lucide-react';
import { Card, Disclaimer, Badge } from '../components/SharedUI';
import { geminiService } from '../services/geminiService';
import { Asset, GroundingChunk } from '../types';

export const AdvisorPage: React.FC<{ assets: Asset[] }> = ({ assets }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [sources, setSources] = useState<GroundingChunk[]>([]);

  const handleAsk = async (text?: string) => {
    const finalQuery = text || query;
    if (!finalQuery || !process.env.API_KEY) return;
    setLoading(true);
    setResponse("");
    setSources([]);

    try {
      const context = `Carteira: ${assets.map(a => `${a.ticker}`).join(', ')}`;
      const result = await geminiService.analyzeMarket(
        `${finalQuery}. Utilize dados oficiais e cite fontes B3/CVM.`, 
        context
      );
      setResponse(result.text);
      setSources(result.sources);
    } catch (err) {
      setResponse("Erro ao consultar a IA. Tente novamente em alguns segundos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-24 text-left">
      <div className="flex items-center gap-8">
        <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-[2rem]">
          <Bot className="text-emerald-500 w-10 h-10" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-mono">Assistente <span className="text-emerald-500 italic">Inteligente</span></h2>
          <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[5px] mt-2">Tire Dúvidas com IA conectada ao mercado</p>
        </div>
      </div>

      <Card className="p-10 border-white/5 bg-[#0c0c0e]">
        <div className="space-y-8 relative z-10 text-left">
          <textarea 
            placeholder="Ex: 'Vale a pena investir em Vale hoje?' ou 'O que é Dividend Yield?'" 
            className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-10 text-white focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-gray-800 min-h-[180px] text-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAsk()}
          />
          <div className="flex justify-end">
             <button onClick={() => handleAsk()} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[4px] flex items-center gap-4 transition-all shadow-xl active:scale-95">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {loading ? "Buscando Resposta..." : "Perguntar agora"}
             </button>
          </div>
        </div>

        {response && (
          <div className="mt-16 animate-in slide-in-from-bottom-10 bg-black/60 border border-white/10 rounded-[3.5rem] p-12 shadow-2xl text-left">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
              <Badge color="emerald">Resposta Verificada</Badge>
              <FileText size={16} className="text-gray-700" />
            </div>
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6">
              {response.split('\n').map((line, i) => <p key={i} className="text-lg font-medium">{line}</p>)}
            </div>
            {sources.length > 0 && (
              <div className="mt-16 pt-10 border-t border-white/5">
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-6">Sites Consultados:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sources.map((s, idx) => s.web && (
                    <a key={idx} href={s.web.uri} target="_blank" className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black text-gray-500 hover:text-white transition-all">
                      <ExternalLink size={14} /> {s.web.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
      <Disclaimer />
    </div>
  );
};
