import React, { useState, useEffect, useMemo } from 'react';
import { Newspaper, RefreshCw, Loader2, Globe, ArrowRight, Zap, Search } from 'lucide-react';
import { Card, Disclaimer } from '../components/SharedUI';
import { geminiService } from '../services/geminiService';
import { NewsItem } from '../types';

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([
    { id: 1, tag: 'POLÍTICA MONETÁRIA', time: '12m', title: 'Relatório Focus: Mercado projeta inflação estável, mas vigia câmbio.', source: 'Bloomberg Vantez', content: 'A nova rodada de expectativas sugere que os investidores estão precificando um dólar mais volátil.' },
    { id: 2, tag: 'AÇÕES / BLUE CHIPS', time: '45m', title: 'VALE3 reage positivamente ao minério em Singapura.', source: 'Investing.com', content: 'A alta das commodities metálicas impulsiona o Ibovespa.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const liveNews = await geminiService.getNewsFeed();
      if (liveNews.length > 0) {
        setNews(prev => [...liveNews, ...prev].slice(0, 8));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    if (!searchTerm) return news;
    return news.filter(n => 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [news, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#161a20] p-10 rounded-[2.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Zap className="w-32 h-32 text-amber-500" />
        </div>
        <div className="space-y-2 relative z-10 text-left">
          <h2 className="text-4xl font-black text-white flex items-center gap-6 uppercase tracking-tighter">
            <Newspaper className="text-amber-500 w-12 h-12" /> Terminal Global News
          </h2>
          <p className="text-[11px] text-gray-500 uppercase font-black tracking-[5px] ml-20">Conexão direta com Bloomberg & Agências de Risco</p>
        </div>
        <div className="mt-8 lg:mt-0 relative z-10 flex gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Filtrar eventos..." 
                className="bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white focus:border-amber-500 outline-none w-64 transition-all" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
             onClick={fetchNews}
             disabled={loading}
             className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-4 shadow-xl shadow-emerald-900/30 disabled:opacity-50"
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
             {loading ? "Sincronizando..." : "Sincronizar"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredNews.length === 0 ? (
          <div className="lg:col-span-2 py-20 text-center opacity-30">
             <Search size={48} className="mx-auto mb-4" />
             <p className="font-black uppercase tracking-widest text-xs">Nenhuma notícia encontrada para "{searchTerm}"</p>
          </div>
        ) : filteredNews.map((item) => (
          <Card 
            key={item.id} 
            className={`hover:border-amber-500/40 cursor-pointer transition-all hover:bg-white/[0.01] group flex flex-col justify-between h-full p-10 relative ${selectedId === item.id ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-white/5'}`}
            onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
          >
            <div className="text-left relative z-10">
              <div className="flex justify-between items-start mb-8">
                <span className="px-5 py-2 bg-black/40 text-gray-400 text-[10px] font-black rounded-xl uppercase tracking-[4px] border border-white/5">{item.tag}</span>
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{item.time} atrás</span>
              </div>
              <h3 className="text-white font-black group-hover:text-amber-400 transition-colors text-2xl mb-8 leading-tight tracking-tight">{item.title}</h3>
              {selectedId === item.id && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <p className="text-base text-gray-400 border-l-4 border-amber-500 pl-8 py-6 bg-amber-500/5 rounded-r-3xl font-medium leading-relaxed italic">
                    {item.content}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
               <p className="text-[10px] text-gray-600 italic flex items-center gap-3 font-black uppercase tracking-[3px]">
                 <Globe className="w-4 h-4 text-emerald-500" /> Fonte: {item.source}
               </p>
               <ArrowRight className={`w-5 h-5 text-gray-700 transition-all ${selectedId === item.id ? 'rotate-90 text-amber-500' : 'group-hover:translate-x-2'}`} />
            </div>
          </Card>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
};