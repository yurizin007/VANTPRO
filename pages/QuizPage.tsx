
import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Target, ShieldCheck, TrendingUp, Wallet, BrainCircuit, HeartPulse, GraduationCap, Coins, Info, AlertCircle, CheckCircle2, Loader2, Cpu, Fingerprint, Activity } from 'lucide-react';
import { Card } from '../components/SharedUI';
import { QuizResult, UserProfile } from '../types';
// Added missing formatCurrency import
import { formatCurrency } from '../utils/math';

interface QuizPageProps {
  onComplete: (result: QuizResult) => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisText, setAnalysisText] = useState("Sincronizando Séries Temporais...");
  
  const [formData, setFormData] = useState({
    nome: '',
    conhecimento: '',
    objetivo: '',
    aporte: 500,
    temReserva: 'Nao',
    horizonte: '1-5',
    reacaoEmocional: '',
    temDividas: false
  });

  const steps = [
    {
      title: "Identificação",
      desc: "Bem-vindo ao Vantez. Como devemos te chamar?",
      input: "text",
      key: "nome",
      placeholder: "Digite seu nome..."
    },
    {
      title: "Experiência",
      desc: "Qual seu nível de familiaridade com investimentos?",
      options: [
        { label: "Nunca investi.", value: "Iniciante", icon: GraduationCap },
        { label: "Já invisto o básico.", value: "Intermediario", icon: Wallet },
        { label: "Sou investidor ativo.", value: "Avancado", icon: BrainCircuit }
      ],
      key: "conhecimento"
    },
    {
      title: "Status Financeiro",
      desc: "Você possui dívidas (cartão, empréstimos) agora?",
      options: [
        { label: "Sim, tenho dívidas.", value: true, icon: AlertCircle },
        { label: "Não, vida limpa.", value: false, icon: CheckCircle2 }
      ],
      key: "temDividas"
    },
    {
      title: "Reserva de Emergência",
      desc: "Você tem dinheiro guardado para 6 meses?",
      options: [
        { label: "Sim, integral.", value: "Sim", icon: ShieldCheck },
        { label: "Não tenho reserva.", value: "Nao", icon: HeartPulse }
      ],
      key: "temReserva"
    },
    {
      title: "Psicologia de Risco",
      desc: "O que faria se seus ativos caíssem -20%?",
      options: [
        { label: "Vendo tudo com medo.", value: "Vende", icon: HeartPulse },
        { label: "Mantenho a calma.", value: "Espera", icon: Info },
        { label: "Aproveito para comprar.", value: "Compra", icon: TrendingUp }
      ],
      key: "reacaoEmocional"
    },
    {
      title: "Capacidade Mensal",
      desc: "Quanto pretende poupar todo mês?",
      slider: true,
      min: 100,
      max: 20000,
      key: "aporte"
    }
  ];

  const finishQuiz = () => {
    setIsAnalyzing(true);
    const messages = ["Analisando Perfil Cognitivo...", "Calculando Score de Risco...", "Mapeando Fase da Jornada...", "Finalizando Dossiê..."];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length - 1) { i++; setAnalysisText(messages[i]); }
      else { clearInterval(interval); setIsAnalyzing(false); setShowResults(true); }
    }, 1200);
  };

  const handleFinalize = () => {
    const riskScore = formData.reacaoEmocional === 'Compra' ? 90 : formData.reacaoEmocional === 'Espera' ? 60 : 30;
    
    let fase: 1 | 2 | 3 = 3;
    if (formData.temDividas) fase = 1;
    else if (formData.temReserva === 'Nao') fase = 2;

    const profile: UserProfile = {
      nome: formData.nome || 'Investidor',
      nivelConhecimento: formData.conhecimento as any,
      perfilRisco: riskScore >= 80 ? 'Arrojado' : riskScore >= 50 ? 'Moderado' : 'Conservador',
      objetivo: 'Crescimento',
      aporteMensal: formData.aporte,
      temReserva: formData.temReserva as any,
      temDividas: formData.temDividas,
      horizonteAnos: 10,
      faseAtual: fase,
      scoreRisco: riskScore,
      unlockedPages: ['dashboard', 'myplan', 'academy', 'health', 'advisor', 'news'],
      xp: 100
    };
    onComplete({ profile });
  };

  if (isAnalyzing) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#08080a]">
      <Card className="w-full max-w-lg p-12 text-center border-emerald-500/20 space-y-10">
         <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin" />
            <Cpu size={56} className="text-emerald-500 animate-bounce" />
         </div>
         <p className="text-[10px] text-gray-500 font-black uppercase tracking-[5px] animate-pulse">{analysisText}</p>
      </Card>
    </div>
  );

  if (showResults) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#08080a]">
      <Card className="w-full max-w-4xl p-12 border-emerald-500/20 text-left space-y-12 shadow-2xl">
         <div className="flex justify-between items-center border-b border-white/5 pb-10">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">Diagnóstico <span className="text-emerald-500">IA</span></h2>
            <div className="bg-white/[0.03] p-6 rounded-3xl text-center">
               <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Score Risco</p>
               <p className="text-5xl font-black text-emerald-500 font-mono tracking-tighter">
                  {formData.reacaoEmocional === 'Compra' ? 90 : formData.reacaoEmocional === 'Espera' ? 60 : 30}/100
               </p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2rem]">
                  <h4 className="text-[10px] text-emerald-500 font-black uppercase mb-4 tracking-widest flex items-center gap-2">
                     <Fingerprint size={16}/> Perfil Mapeado
                  </h4>
                  <p className="text-3xl font-black text-white">
                    {formData.reacaoEmocional === 'Compra' ? 'Arrojado' : formData.reacaoEmocional === 'Espera' ? 'Moderado' : 'Conservador'}
                  </p>
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed">Sua jornada foi personalizada para atingir metas sem comprometer sua base financeira.</p>
               </div>
               <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2rem]">
                  <h4 className="text-[10px] text-blue-500 font-black uppercase mb-4 tracking-widest flex items-center gap-2">
                     <Activity size={16}/> Status de Partida
                  </h4>
                  <p className="text-xl font-black text-white">
                    {formData.temDividas ? 'Etapa 1: Saneamento' : formData.temReserva === 'Nao' ? 'Etapa 2: Emergência' : 'Etapa 3: Crescimento'}
                  </p>
               </div>
            </div>
            <div className="p-10 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[2.5rem] flex flex-col justify-between">
               <div className="space-y-6">
                  <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[5px] border-b border-emerald-500/10 pb-4">Plano de Ativação</h4>
                  <p className="text-sm text-gray-400 font-medium">Você iniciará na <span className="text-white font-black uppercase">Etapa {formData.temDividas ? '1' : formData.temReserva === 'Nao' ? '2' : '3'}</span>. Recursos avançados serão desbloqueados conforme você evolui.</p>
               </div>
               <button onClick={handleFinalize} className="w-full mt-10 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[4px] transition-all flex items-center justify-center gap-4">
                  Desbloquear Terminal <ArrowRight size={20}/>
               </button>
            </div>
         </div>
      </Card>
    </div>
  );

  const current = steps[step];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#08080a]">
      <Card className="w-full max-w-2xl p-12 border-white/10 relative z-10 bg-[#0d0d0f]">
        <div className="flex justify-between items-center mb-14">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
                <Sparkles className="text-white w-7 h-7" />
             </div>
             <span className="text-2xl font-black text-white tracking-tighter uppercase italic">Vantez <span className="text-emerald-500">Flow</span></span>
          </div>
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-10 bg-emerald-500' : i < step ? 'w-5 bg-emerald-500/30' : 'w-2 bg-white/10'}`} />
            ))}
          </div>
        </div>

        <div className="space-y-10 animate-in slide-in-from-bottom-8">
           <div className="text-left space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none">{current.title}</h2>
              <p className="text-gray-400 text-lg font-medium">{current.desc}</p>
           </div>

           <div className="space-y-4">
              {current.options && current.options.map((opt, i) => (
                <button key={i} onClick={() => { setFormData({...formData, [current.key]: opt.value}); if (step < steps.length - 1) setStep(step + 1); else finishQuiz(); }} className="w-full p-6 bg-white/[0.03] border-2 border-white/5 rounded-3xl text-left hover:border-emerald-500 transition-all font-bold flex justify-between items-center group shadow-lg">
                  <div className="flex items-center gap-6">
                    <opt.icon size={28} className="text-emerald-500" />
                    <p className="text-xl text-gray-200">{opt.label}</p>
                  </div>
                  <ArrowRight size={24} className="text-gray-700 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
                </button>
              ))}
              {current.slider && (
                <div className="space-y-10">
                   <div className="text-center p-10 bg-white/[0.02] border border-white/5 rounded-3xl">
                      <span className="text-6xl font-black text-white font-mono tracking-tighter">{formatCurrency(formData.aporte)}</span>
                   </div>
                   <input type="range" min={current.min} max={current.max} step={100} value={formData.aporte} onChange={(e) => setFormData({...formData, aporte: Number(e.target.value)})} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500" />
                   <button onClick={() => finishQuiz()} className="w-full py-7 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl">Confirmar e Finalizar</button>
                </div>
              )}
              {current.input === 'text' && (
                <div className="space-y-6">
                  <input type="text" placeholder={current.placeholder} className="w-full bg-black/40 border-2 border-white/5 rounded-3xl p-10 text-3xl font-black text-white focus:border-emerald-500 outline-none text-center" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && setStep(step + 1)} />
                  <button onClick={() => setStep(step + 1)} className="w-full py-7 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest">Prosseguir</button>
                </div>
              )}
           </div>
        </div>

        {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-10 text-gray-600 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={14}/> Voltar</button>}
      </Card>
    </div>
  );
};
