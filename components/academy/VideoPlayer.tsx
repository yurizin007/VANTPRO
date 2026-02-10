
import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Zap, Clock } from 'lucide-react';
import { Badge } from '../SharedUI';

interface VideoPlayerProps {
  youtubeId: string;
  titulo: string;
  descricao: string;
  xp: number;
  onComplete: () => void;
  isCompleted: boolean;
  duracao: string;
  canal: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  youtubeId, titulo, descricao, xp, onComplete, isCompleted, duracao, canal 
}) => {
  const [hasWatched, setHasWatched] = useState(isCompleted);

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    if (!document.getElementById('youtube-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-api-script';
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };
  }, [youtubeId]);

  const initPlayer = () => {
    new window.YT.Player(`player-${youtubeId}`, {
      events: {
        onStateChange: (event: any) => {
          // YT.PlayerState.ENDED is 0
          if (event.data === 0 && !hasWatched) {
            setHasWatched(true);
            onComplete();
          }
        }
      }
    });
  };

  return (
    <div className="bg-[#0e0e11] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 hover:border-blue-500/30 transition-all flex flex-col h-full group">
      <div className="relative w-full pb-[56.25%] bg-black">
        <iframe
          id={`player-${youtubeId}`}
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&showinfo=0`}
          title={titulo}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
              {titulo}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 text-[10px] font-black uppercase tracking-widest shrink-0">
               <Clock size={12} /> {duracao}
            </div>
          </div>
          <p className="text-gray-500 text-xs font-medium leading-relaxed">{descricao}</p>
          <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest italic">{canal}</p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Badge color="blue">⚡ +{xp} XP</Badge>
          {isCompleted ? (
            <span className="text-emerald-500 text-[10px] font-black flex items-center gap-1 uppercase tracking-widest">
              <CheckCircle2 size={14} /> Concluído
            </span>
          ) : (
            <span className="text-gray-700 text-[10px] font-black uppercase tracking-widest">Pendente</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
