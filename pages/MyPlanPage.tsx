import React, { useMemo, useState, useEffect } from 'react';
import { 
  Target, ShieldCheck, TrendingUp, ArrowRight, 
  CheckCircle2, Lock, Sparkles, BrainCircuit, HandMetal,
  GraduationCap, Circle, LayoutDashboard, Shield, Activity,
  Projector, X
} from 'lucide-react';
import { Card, Badge, Disclaimer } from '../components/SharedUI';
import { UserProfile, PageId, Expense } from '../types';
import { useNotification } from '../App';

interface MyPlanPageProps {
  profile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  onAporteClick: () => void;
  setActivePage: (id: PageId) => void;
}

export const MyPlanPage: React.FC<MyPlanPageProps> = ({ profile, setUserProfile, setExpenses, onAporteClick, setActivePage }) => {
  const { addNotification } = useNotification();
  const [showM3Modal, setShowM3Modal] = useState(false);

  // ESTADO DAS MISSÕES: Sincronizado com a chave principal solicitada
  const [missionStatus, setMissionStatus] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('vantez_step1_status');
    return saved ? JSON.parse(saved) : {
      m1: false, 
      m2: false, 
      m3: false,
      s2m1: false, s2m2: false, s2m3: false,
      s3m1: false, s3m2: false, s3m3: false
    };
  });

  // AUTO-DETECÇÃO: Verifica se o usuário já tem reserva ou dívidas mapeadas no sistema
  useEffect(() => {
    const checkExternalData = () => {
      const hasDebtsMapped = localStorage.getItem('vantez_user_profile');
      const hasDebtList = localStorage.getItem('vantez_debts_data');
      const hasReservaMeta = localStorage.getItem('vantez_reserva_meta');
      
      setMissionStatus(prev => {
        let changed = false;
        const newState = { ...prev };
        
        // Auto-detecta M1 (Dívidas) se houver dados no perfil ou lista
        if ((hasDebtsMapped || hasDebtList) && !prev.m1) {
          newState.m1 = true;
          changed = true;
        }
        
        // Auto-detecta M2 (Reserva) se a meta já existir no storage
        if (hasReservaMeta && !prev.m2) {
          newState.m2 = true;
          changed = true;
        }

        if (changed) {
          localStorage.setItem('vantez_step1_status', JSON.stringify(newState));
          return newState;
        }
        return prev;
      });
    };

    checkExternalData();
  }, []);

  // Persistência local para mudanças manuais
  useEffect(() => {
    localStorage.setItem('vantez_step1_status', JSON.stringify(missionStatus));
  }, [missionStatus]);

  const completarMissao = (id: string) => {
    const newState = { ...missionStatus, [id]: true };
    setMissionStatus(newState);
    localStorage.setItem('vantez_step1_status', JSON.stringify(newState));
  };

  /**
   * LÓGICA REATIVA PARA MISSÃO 2 (RESERVA)
   */
  const handleReservaM2 = () => {
     const novoEstado = { ...missionStatus, m2: true };
     setMissionStatus(novoEstado);
     localStorage.setItem('vantez_step1_status', JSON.stringify(novoEstado));
     localStorage.setItem('vantez_reserva_meta', '12000');
     console.log("✅ Missão 2 Concluída com sucesso!");
  };

  // Cálculo de Progresso das Etapas
  const steps = useMemo(() => {
    const calcProgress = (ids: string[]) => {
      const completed = ids.filter(id => missionStatus[id]).length;
      return Math.round((completed / ids.length) * 100);
    };

    const s1Ids = ['m1', 'm2', 'm3'];
    const s2Ids = ['s2m1', 's2m2', 's2m3'];
    const s3Ids = ['s3m1', 's3m2', 's3m3'];

    return [
      {
        id: 1,
        title: "LIBERDADE FINANCEIRA",
        phase: "Saneamento de Passivos",
        desc: "Sua prioridade é liquidar dívidas para parar de perder dinheiro para os juros.",
        status: calcProgress(s1Ids) === 100 ? "CONCLUÍDO" : "EM ANDAMENTO",
        active: true,
        completed: calcProgress(s1Ids) === 100,
        deadline: "Fase 01",
        icon: ShieldCheck,
        progress: calcProgress(s1Ids),
        missions: [
          { 
            label: missionStatus.m1 ? "DÍVIDAS MAPEADAS" : "MAPEAR DÍVIDAS NO TERMINAL", 
            done: missionStatus.m1, 
            action: () => { completarMissao('m1'); setActivePage('health'); }, 
            buttonLabel: missionStatus.m1 ? "REVISAR DÍVIDAS" : "IR PARA SAÚDE FINANCEIRA",
            icon: TrendingUp
          },
          { 
            label: missionStatus.m2 ? "RESERVA DEFINIDA" : "CRIAR COLCHÃO DE SEGURANÇA", 
            done: missionStatus.m2, 
            action: handleReservaM2, 
            buttonLabel: "ATIVAR META DE SEGURANÇA",
            icon: Shield
          },
          { 
            label: missionStatus.m3 ? "AULA ASSISTIDA" : "AULA: COMO NEGOCIAR DÍVIDAS", 
            done: missionStatus.m3, 
            action: () => setShowM3Modal(true), 
            buttonLabel: missionStatus.m3 ? "REVER AULA" : "VER AULA",
            icon: GraduationCap
          }
        ],
        rewards: ["✓ Desbloqueia Etapa 2", "✓ Economia de Juros", "✓ Badge: Livre de Dívidas"]
      },
      {
        id: 2,
        title: "SEGURANÇA ESTRUTURAL",
        phase: "Acúmulo de Liquidez",
        desc: "Construção do seu patrimônio de proteção e primeiros aportes seguros.",
        status: calcProgress(s1Ids) < 100 ? "BLOQUEADO" : calcProgress(s2Ids) === 100 ? "CONCLUÍDO" : "EM ANDAMENTO",
        active: calcProgress(s1Ids) === 100,
        completed: calcProgress(s2Ids) === 100,
        deadline: "Fase 02",
        icon: Target,
        progress: calcProgress(s2Ids),
        missions: [
          { label: "Primeiro Aporte Tesouro", done: missionStatus.s2m1, action: () => { completarMissao('s2m1'); setActivePage('tesouro'); }, buttonLabel: "Simular Tesouro", icon: Target },
          { label: "Otimizar Renda Fixa", done: missionStatus.s2m2, action: () => completarMissao('s2m2'), buttonLabel: "Otimizar", icon: BrainCircuit },
          { label: "Review de Gastos IA", done: missionStatus.s2m3, action: () => { completarMissao('s2m3'); setActivePage('health'); }, buttonLabel: "Audit IA", icon: Activity }
        ],
        rewards: ["✓ Módulo Investimentos", "✓ Calculadoras Avançadas"]
      },
      {
        id: 3,
        title: "CRESCIMENTO INTELIGENTE",
        phase: "Alocação Estratégica",
        desc: "Diversificação em ativos geradores de renda e ganho de capital global.",
        status: calcProgress(s2Ids) < 100 ? "BLOQUEADO" : "EM ANDAMENTO",
        active: calcProgress(s2Ids) === 100,
        completed: false,
        deadline: "Fase 03",
        icon: TrendingUp,
        progress: calcProgress(s3Ids),
        missions: [
          { label: "Mapear Ações B3", done: missionStatus.s3m1, action: () => { completarMissao('s3m1'); setActivePage('stocks'); }, buttonLabel: "Scanner B3", icon: TrendingUp },
          { label: "Configurar Robô HRP", done: missionStatus.s3m2, action: () => { completarMissao('s3m2'); setActivePage('robo'); }, buttonLabel: "Ativar Robô", icon: BrainCircuit },
          { label: "Análise de Dividendos", done: missionStatus.s3m3, action: () => { completarMissao('s3m3'); setActivePage('funds'); }, buttonLabel: "Ver FIIs", icon: GraduationCap }
        ],
        rewards: ["✓ Terminal Full Unlocked", "✓ Robô Estrategista"]
      }
    ];
  }, [missionStatus, setActivePage]);

  const generalProgress = useMemo(() => {
    const total = 9;
    const completed = Object.values(missionStatus).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }, [missionStatus]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 text-left font-sans max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-emerald-600/10 border border-emerald-500/20 p-5 rounded-3xl">
            <Sparkles className="text-emerald-500 w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Plano de Ativação <span className="text-emerald-500">Vantez</span></h2>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[4px] mt-1">Status do Terminal: {generalProgress === 100 ? 'Operacional Total' : 'Em Evolução'}</p>
          </div>
        </div>
        <button onClick={onAporteClick} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[3px] transition-all shadow-2xl active:scale-95 flex items-center gap-3">
          <TrendingUp size={18} /> Simular Aporte
        </button>
      </div>

      {/* IA Mentor Box */}
      <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] flex items-center gap-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5">
            <BrainCircuit className="w-40 h-40 text-blue-500" />
         </div>
         <div className="bg-blue-600 p-5 rounded-3xl shadow-xl shrink-0">
            <HandMetal className="text-white w-10 h-10" />
         </div>
         <div className="space-y-2 relative z-10 text-left">
            <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-[5px]">Mensagem do seu Mentor IA</h4>
            <div className="text-lg text-gray-200 font-bold leading-relaxed italic">
              "{profile.nome}, o sucesso financeiro é 20% conhecimento e 80% comportamento. Complete as missões abaixo para solidificar sua base."
            </div>
         </div>
      </div>

      {/* Progresso Geral */}
      <Card className="p-8 border-white/5 bg-white/[0.01]">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-white font-black text-xs uppercase tracking-[4px] flex items-center gap-3">
             <LayoutDashboard size={18} className="text-emerald-500" /> Progresso da Jornada
          </h4>
          <span className="text-emerald-500 font-black text-xl">{generalProgress}%</span>
        </div>
        <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
           <div 
             className="bg-emerald-500 h-full rounded-full transition-all duration-[1500ms] shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
             style={{ width: `${generalProgress}%` }} 
           />
        </div>
      </Card>

      {/* Linha do Tempo das Etapas */}
      <div className="relative space-y-16 pl-8 border-l-2 border-white/5">
        {steps.map((step) => (
          <div key={step.id} className={`relative transition-all duration-700 ${!step.active && !step.completed ? 'opacity-40 grayscale' : 'opacity-100'}`}>
            <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-[#08080a] z-20 ${step.completed ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : step.active ? 'bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-800'}`} />
            
            <Card className={`p-8 border-white/5 ${step.active ? 'border-emerald-500/20 bg-emerald-500/[0.01]' : ''}`}>
              <div className="flex flex-col gap-10">
                {/* Cabeçalho da Etapa */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1 space-y-4 text-left">
                    <div className="flex items-center gap-4">
                      <Badge color={step.completed ? 'emerald' : 'blue'}>Etapa 0{step.id}</Badge>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{step.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">{step.desc}</p>
                    <div className="flex gap-6 pt-2">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-600 tracking-widest">
                          <CheckCircle2 size={14} className={step.completed ? 'text-emerald-500' : 'text-gray-800'} /> {step.status}
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-600 tracking-widest">
                          <Circle size={10} fill={step.active ? "#3b82f6" : "#111"} /> {step.deadline}
                       </div>
                    </div>
                  </div>
                  <div className="shrink-0 w-full md:w-48">
                    <div className="text-center p-4 bg-black/40 rounded-lg border border-white/5">
                       <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Conclusão</p>
                       <p className={`text-4xl font-black font-mono ${step.completed ? 'text-emerald-500' : 'text-blue-400'}`}>{step.progress}%</p>
                    </div>
                  </div>
                </div>

                {/* Grid de Missões */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {step.missions.map((mission, i) => (
                     <div key={i} className={`p-6 rounded-[2rem] border transition-all flex flex-col justify-between h-full ${mission.done ? 'bg-emerald-500/[0.03] border-emerald-500/20' : step.active ? 'bg-white/[0.02] border-white/10 hover:border-blue-500/30' : 'bg-black/20 border-transparent'}`}>
                        <div className="space-y-4 mb-8 text-left">
                           <div className="flex justify-between items-center">
                              {mission.done ? <CheckCircle2 size={24} className="text-emerald-500" /> : <mission.icon size={20} className="text-blue-500" />}
                              <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">M{i+1}</span>
                           </div>
                           <h5 className={`text-xs font-black uppercase leading-relaxed tracking-widest ${mission.done ? 'text-emerald-400' : 'text-white'}`}>{mission.label}</h5>
                        </div>
                        
                        {step.id === 1 && i === 1 ? (
                          <button
                            className={`w-full py-3 mt-4 rounded-lg text-xs font-bold transition-all shadow-lg ${
                              missionStatus.m2 
                                ? 'bg-green-600 text-white cursor-default' 
                                : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
                            }`}
                            disabled={missionStatus.m2}
                            onClick={() => {
                              const novoEstado = { ...missionStatus, m2: true };
                              setMissionStatus(novoEstado);
                              localStorage.setItem('vantez_step1_status', JSON.stringify(novoEstado));
                              localStorage.setItem('vantez_reserva_meta', '12000');
                              console.log("✅ Missão 2 Concluída com sucesso!");
                            }}
                          >
                            {missionStatus.m2 ? '✅ META DEFINIDA (CONCLUÍDO)' : 'ATIVAR META DE SEGURANÇA'}
                          </button>
                        ) : (
                          <>
                            {step.active && !mission.done && (
                              <button 
                                onClick={mission.action}
                                className="relative z-50 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer pointer-events-auto shadow-lg active:scale-95"
                              >
                                {mission.buttonLabel}
                              </button>
                            )}
                            {mission.done && (
                              <div className="w-full py-4 bg-emerald-600/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest text-center cursor-default">
                                ✓ CONCLUÍDO
                              </div>
                            )}
                            {!step.active && !mission.done && (
                              <div className="w-full py-4 bg-black/40 text-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-center cursor-not-allowed">
                                Bloqueado
                              </div>
                            )}
                          </>
                        )}
                     </div>
                   ))}
                </div>

                {/* Recompensas da Etapa */}
                <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 flex items-center gap-6 flex-wrap">
                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">✨ Recompensas:</span>
                   {step.rewards.map((reward, idx) => (
                     <div key={idx} className="px-4 py-2 bg-white/[0.02] rounded-lg border border-white/5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {reward}
                     </div>
                   ))}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal Missão 3 - Aula de Dívidas */}
      {showM3Modal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[300] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
           <Card className="w-full max-w-4xl border-emerald-500/20 shadow-2xl relative overflow-hidden p-0">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                 <div className="flex items-center gap-4">
                    <GraduationCap className="text-emerald-500" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Missão 3: Dossiê de Negociação</h3>
                 </div>
                 <button onClick={() => setShowM3Modal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X size={24} className="text-gray-600" />
                 </button>
              </div>

              <div className="p-8 space-y-8 text-center">
                 <div className="aspect-video w-full rounded-3xl overflow-hidden border-2 border-white/5 shadow-2xl">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/ZlOqO-xdCxw?autoplay=1" 
                      title="Como Negociar Dívidas - Me Poupe"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                 </div>

                 <div className="space-y-4 text-left bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Tópicos da Aula:</h4>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                       Aprenda a estratégia da "Dívida Ruim vs Dívida Boa" e como forçar os bancos a aceitarem descontos de até 90% através de portabilidade e liquidação à vista.
                    </p>
                 </div>

                 <button
                    className={`w-full py-3 rounded-lg text-xs font-bold transition-all shadow-lg mt-4 ${
                      missionStatus.m3
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                    disabled={missionStatus.m3}
                    onClick={() => {
                      // 1. ATUALIZA ESTADO VISUAL (Sem recarregar a página)
                      const tudoConcluido = { ...missionStatus, m1: true, m2: true, m3: true };
                      setMissionStatus(tudoConcluido);
                      
                      // 2. SALVA NO LOCALSTORAGE
                      localStorage.setItem('vantez_step1_status', JSON.stringify(tudoConcluido));
                      
                      // 3. MENSAGEM DE SUCESSO
                      console.log("🎉 PARABÉNS! ETAPA 1 FINALIZADA: 100%");
                      alert("🚀 PARABÉNS! Você concluiu a Etapa 1: Liberdade Financeira!");
                      
                      // Fecha o modal após o feedback
                      setTimeout(() => setShowM3Modal(false), 500);
                    }}
                  >
                    {missionStatus.m3 ? '✅ AULA CONCLUÍDA (100%)' : 'MARCAR COMO ASSISTIDA'}
                  </button>
              </div>
           </Card>
        </div>
      )}

      {/* Rodapé de Ações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
        <Card className="p-8 border-blue-500/10 bg-blue-500/[0.01] flex items-center gap-6 group cursor-pointer hover:bg-blue-500/5 transition-all" onClick={() => setActivePage('academy')}>
          <div className="bg-blue-600 p-4 rounded-2xl shadow-xl">
             <Projector className="text-white w-6 h-6" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Aulas Recomendadas</h4>
            <p className="text-[10px] text-gray-500 font-medium">Assista 'O Poder da Disciplina' para ganhar XP</p>
          </div>
          <ArrowRight className="ml-auto text-gray-800 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
        </Card>

        <Card className="p-8 border-emerald-500/10 bg-emerald-500/[0.01] flex items-center gap-6 group cursor-pointer hover:bg-emerald-500/5 transition-all" onClick={() => setActivePage('advisor')}>
          <div className="bg-emerald-600 p-4 rounded-2xl shadow-xl">
             <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Ajustar Estratégia</h4>
            <p className="text-[10px] text-gray-500 font-medium">Fale com a IA sobre seus novos objetivos.</p>
          </div>
          <ArrowRight className="ml-auto text-gray-800 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
        </Card>
      </div>

      <Disclaimer />
    </div>
  );
};