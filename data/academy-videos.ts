export interface VideoLesson {
  id: string;
  titulo: string;
  canal: string;
  youtubeId: string;
  duracao: string;
  descricao: string;
  xp: number;
  missao: string;
}

export const videosReais: Record<string, VideoLesson[]> = {
  etapa1: [
    {
      id: "v1",
      titulo: "5 Passos Para Sair Das Dívidas",
      canal: "Me Poupe!",
      youtubeId: "qGm49nJ_JQQ",
      duracao: "13:24",
      descricao: "Método comprovado da Nathalia Arcuri",
      xp: 50,
      missao: "mapear_dividas"
    },
    {
      id: "v2",
      titulo: "Como Fazer Planilha de Controle Financeiro",
      canal: "Primo Rico",
      youtubeId: "8ww3KM0lGYk",
      duracao: "10:42",
      descricao: "Organize seus gastos passo a passo",
      xp: 50,
      missao: "cortar_gastos"
    },
    {
      id: "v3",
      titulo: "Dívidas: Quita, Negocia ou Deixa de Pagar?",
      canal: "Me Poupe!",
      youtubeId: "ZlOqO-xdCxw",
      duracao: "15:45",
      descricao: "Técnicas de negociação profissional com Nathalia Arcuri",
      xp: 100,
      missao: "negociar_bancos"
    }
  ],
  etapa2: [
    {
      id: "v4",
      titulo: "Tesouro Direto Para Iniciantes",
      canal: "Primo Rico",
      youtubeId: "zJZcJqID4Zc",
      duracao: "15:20",
      descricao: "Seu primeiro investimento seguro",
      xp: 75,
      missao: "primeiro_aporte"
    },
    {
      id: "v5",
      titulo: "Reserva de Emergência: Quanto Ter?",
      canal: "Me Poupe!",
      youtubeId: "LJbJRUJlqKI",
      duracao: "9:35",
      descricao: "Calcule sua reserva ideal",
      xp: 75,
      missao: "definir_reserva"
    },
    {
      id: "v6",
      titulo: "Como Abrir Conta em Corretora",
      canal: "Investidor Sardinha",
      youtubeId: "0MrZ_0sG8Kk",
      duracao: "12:10",
      descricao: "Passo a passo completo",
      xp: 50,
      missao: "abrir_conta"
    }
  ],
  etapa3: [
    {
      id: "v7",
      titulo: "Ações Para Iniciantes",
      canal: "Primo Rico",
      youtubeId: "KNcOlaAcSjE",
      duracao: "18:45",
      descricao: "Como escolher suas primeiras ações",
      xp: 100,
      missao: "primeira_acao"
    },
    {
      id: "v8",
      titulo: "Fundos Imobiliários Explicados",
      canal: "O Primo Rico",
      youtubeId: "QC3eLam4XrM",
      duracao: "14:20",
      descricao: "Receba aluguel todo mês",
      xp: 100,
      missao: "primeiro_fii"
    },
    {
      id: "v9",
      titulo: "Como Diversificar Sua Carteira",
      canal: "Me Poupe!",
      youtubeId: "lzQz8vPMFMI",
      duracao: "11:30",
      descricao: "Não coloque todos os ovos na mesma cesta",
      xp: 75,
      missao: "diversificar"
    }
  ]
};