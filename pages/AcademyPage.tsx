
import React, { useState, useEffect } from 'react';
import { GraduationCap, Lock, Info, Sparkles, BrainCircuit, Activity } from 'lucide-react';
import { Card, Disclaimer, Badge } from '../components/SharedUI';
import { videosReais, VideoLesson } from '../data/academy-videos';
import VideoPlayer from '../components/academy/VideoPlayer';
import { useNotification } from '../App';

// @fix: Changed from default export to named export to resolve import error in App.tsx
export const AcademyPage: React.FC = () => {
  const { addNotification } = useNotification();
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [userXP, setUserXP] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('vantez_academy_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedVideos(data.completedVideos || []);
      setUserXP(data.xp || 0);
    }
  }, []);

  const saveProgress = (videos: string[], xp: number) => {
    localStorage.setItem('vantez_academy_progress', JSON.stringify({
      completedVideos: videos,
      xp: xp,
      lastUpdate: new Date().toISOString()
    }));
  };

  const handleVideoComplete = (videoId: string, xp: number) => {
    if (!completedVideos.includes(videoId)) {
      const newCompleted = [...completedVideos, videoId];
      const newXP = userXP + xp;
      setCompletedVideos(newCompleted);
      setUserXP(newXP);
      saveProgress(newCompleted, newXP);
      addNotification(`🎉 Parabéns! Ganhou +${xp} XP.`, "success");
    }
  };

  const isVideoBlocked = (index: number, etapaVideos: VideoLesson[]) => {
    if (index === 0) return false;
    const previousVideo = etapaVideos[index - 1];
    return !completedVideos.includes(previousVideo.id);
  };

  const renderEtapa = (titulo: string, videos: VideoLesson[], requisitoAnteriorCompleto = true) => {
    if (!requisitoAnteriorCompleto) {
      return (
        <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/5 mb-12">
          <div className="absolute inset-0 bg-[#08080a]/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-white/5">
             <div className="bg-gray-800/50 p-6 rounded-3xl mb-6">
                <Lock size={48} className="text-gray-600" />
             </div>
             <h2 className="text-2xl font-black text-gray-500 uppercase tracking-tighter mb-2">🔒 {titulo}</h2>
             <p className="text-[10px] text-gray-700 font-black uppercase tracking-[4px]">Complete a etapa anterior para desbloquear este módulo</p>
          </div>
          <div className="opacity-10 pointer-events-none filter blur-lg p-10">
            <h2 className="text-2xl font-black text-white mb-8 border-l-4 border-blue-500 pl-6 uppercase tracking-tighter">{titulo}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map(v => <div key={v.id} className="h-64 bg-gray-800 rounded-3xl"></div>)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-2xl font-black text-white mb-8 border-l-4 border-blue-500 pl-6 uppercase tracking-tighter italic">
          {titulo}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => {
            const isBlocked = isVideoBlocked(index, videos);
            if (isBlocked) {
              return (
                <div key={video.id} className="bg-[#0e0e11]/40 rounded-[2rem] p-10 flex flex-col items-center justify-center border border-white/5 h-full text-center group border-dashed">
                  <div className="bg-gray-900/50 p-5 rounded-2xl mb-4 text-gray-800 group-hover:scale-110 transition-transform">
                    <Lock size={32} />
                  </div>
                  <h3 className="text-gray-600 font-black uppercase text-sm tracking-widest leading-tight">{video.titulo}</h3>
                  <p className="text-[9px] text-gray-800 font-black uppercase tracking-widest mt-4">Assista ao conteúdo anterior para desbloquear</p>
                </div>
              );
            }
            return (
              <VideoPlayer
                key={video.id}
                {...video}
                isCompleted={completedVideos.includes(video.id)}
                onComplete={() => handleVideoComplete(video.id, video.xp)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const etapa1Completa = videosReais.etapa1.every(v => completedVideos.includes(v.id));
  const etapa2Completa = videosReais.etapa2.every(v => completedVideos.includes(v.id));

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 text-left font-sans">
      {/* Header Estilizado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#161a20] p-10 rounded-[2.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <GraduationCap className="w-32 h-32 text-blue-500" />
        </div>
        <div className="flex items-center gap-8 relative z-10">
          <div className="bg-blue-600 p-5 rounded-3xl shadow-2xl shadow-blue-900/40">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Vantez <span className="text-blue-500">Academy</span></h1>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[5px] mt-1">Sua jornada guiada para a liberdade financeira</p>
          </div>
        </div>
        
        <div className="mt-8 lg:mt-0 relative z-10 flex items-center gap-6 bg-black/40 p-6 rounded-[2rem] border border-white/10">
          <div className="text-left">
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Nível de Domínio</p>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-blue-400 font-mono tracking-tighter">{Math.floor(userXP / 200) + 1}</span>
              <div className="h-10 w-px bg-white/5" />
              <div className="space-y-1">
                 <span className="text-xs font-black text-white uppercase tracking-widest block">{userXP} XP</span>
                 <Badge color="blue">Vantez Scholar</Badge>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-glow flex items-center justify-center p-1">
             <BrainCircuit className="text-blue-500 w-8 h-8" />
          </div>
        </div>
      </div>

      {/* AI Kernel Advice (Consistency with other pages) */}
      <div className="bg-emerald-600/10 border border-emerald-500/20 p-8 rounded-[2.5rem] flex items-center gap-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5">
            <Activity className="w-40 h-40 text-emerald-500" />
         </div>
         <div className="bg-emerald-600 p-5 rounded-3xl shadow-xl shrink-0">
            <Sparkles className="text-white w-10 h-10" />
         </div>
         <div className="space-y-2 relative z-10 text-left">
            <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[5px]">Academy Insight • IA</h4>
            <p className="text-lg text-gray-200 font-bold leading-relaxed italic">
              "Investir em conhecimento rende os melhores juros. Siga a trilha sequencial para desbloquear ferramentas avançadas de análise no seu terminal."
            </p>
         </div>
      </div>

      {/* Seções de Etapas */}
      <div className="space-y-12">
        {renderEtapa("ETAPA 1: Liberdade Financeira", videosReais.etapa1)}
        {renderEtapa("ETAPA 2: Segurança Estrutural", videosReais.etapa2, etapa1Completa)}
        {renderEtapa("ETAPA 3: Crescimento Inteligente", videosReais.etapa3, etapa1Completa && etapa2Completa)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
        <Card className="p-8 border-blue-500/10 bg-blue-500/[0.01] flex items-start gap-6">
           <div className="bg-blue-600 p-4 rounded-2xl shadow-xl">
              <Info className="text-white w-6 h-6" />
           </div>
           <div className="space-y-2">
              <h5 className="text-white font-black uppercase text-[10px] tracking-[4px]">Por que assistir?</h5>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                 As aulas foram curadas pelos melhores analistas para garantir que você não cometa erros básicos. Concluir etapas desbloqueia XP que aumenta seu score no terminal.
              </p>
           </div>
        </Card>
        <Card className="p-8 border-emerald-500/10 bg-emerald-500/[0.01] flex items-start gap-6">
           <div className="bg-emerald-600 p-4 rounded-2xl shadow-xl">
              <BrainCircuit className="text-white w-6 h-6" />
           </div>
           <div className="space-y-2">
              <h5 className="text-white font-black uppercase text-[10px] tracking-[4px]">Próximos Passos</h5>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                 Após concluir a Etapa 3, você será elegível para o modo 'Advanced Quant', com acesso a modelos de IA de alta performance.
              </p>
           </div>
        </Card>
      </div>

      <Disclaimer />
    </div>
  );
};
