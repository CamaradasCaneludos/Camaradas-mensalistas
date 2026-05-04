import alissonImg from "@/assets/alisson.png"; // Usando o alias @ que está no seu config

export const infoJogo = {
  local: "Campo do América",
  horario: "Domingo às 08h",
  valor: 25.0,
  vagas: 16,
  observacoes: [
    "Chegar com antecedência",
    "Respeitar horário e organização",
  ],
};

export const regras = [
  "Máximo de 16 mensalistas fixos",
  "Sempre haverá 2 vagas abertas para jogadores avulsos",
  "Enquete de comparecimento liberada de segunda-feira até sábado às 11h",
  "Caso haja mensalistas ausentes até sábado às 11h, as vagas restantes serão liberadas para avulsos no grupo geral",
  "Valor do avulso: R$10,00",
  "Mensalista que não pagar ou quiser sair em algum mês será removido do grupo e a vaga será aberta para o grupo geral",
];

export const pagamento = {
  forma: "PIX (única forma)",
  chave: "173.031.376-02",
  banco: "Banco Inter",
  titular: "Lucas Pessoa",
  valor: 25.0,
  prazo: "Até um dia antes do primeiro futebol do mês",
  avisos: [
    "Não existe pagamento por cartão",
    "Apenas PIX",
  ],
};

export const mensalistas: { nome: string; status: "em_dia" | "pendente" }[] = [
  { nome: "Diego Padilha(DiNego)", status: "pendente" },
  { nome: "Lucas Pessoa", status: "em_dia" },
  { nome: "Antônio Carvalho", status: "em_dia" },
  { nome: "João Malbec", status: "em_dia" },
  { nome: "Igor Cardoso", status: "pendente" },
  { nome: "Matheus Leite", status: "pendente" },
  { nome: "Mauthos Sepini", status: "pendente" },
  { nome: "Leonardo Augusto", status: "pendente" },
  { nome: "Márcio Júnior", status: "pendente" },
  { nome: "Erick Pessoa", status: "pendente" },
  { nome: "Lucas Souza", status: "pendente" },
  { nome: "Lucas Alberto", status: "pendente" },
  { nome: "Marcelo Mascarin", status: "pendente" },
  { nome: "Alisson Vieira", status: "pendente" },
  { nome: "Vinicius Lopes (Vinico)", status: "pendente" },
  { nome: "Pedro (Gnose)", status: "pendente" },
];

export const rankingVergonha: { nome: string; faltas: number; foto?: string }[] = [
  { 
    nome: "Alisson Vieira", 
    faltas: 2.5, 
    foto: "/Camaradas-mensalistas/alisson.png"
  },
  { 
    nome: "Marcelo Mascarin", 
    faltas: 1, 
    foto: "/Camaradas-mensalistas/Marcelo.png"
  },
  { 
    nome: "Diego Padilha (Dinego)", 
    faltas: 1, 
    foto: "/Camaradas-mensalistas/Dinego.png"
  },
  { 
    nome: "Gabriel Junior (Cael)", 
    faltas: 1, 
    foto: "/Camaradas-mensalistas/Cael.png"
  },
];

export const observacoes = [
  "Todo dinheiro extra arrecadado será utilizado para compra de bola, colete, bombinha, luva de goleiro e etc",
  "Controle de pagamento feito pelo Lucas Pessoa",
  "O comprovante geral do mensal será sempre enviado",
  "Mensalistas não precisam enviar comprovante, apenas marcar presença na enquete de controle (realizada na última semana de cada mês)",
];

/* ── Portal da Transparência ── */

export const caixaAtual = 349.58;

export const comprovantes = [
  { mes: "Março 2026", imagem: "/Camaradas-mensalistas/Comprovantes/marco.png" },
];

export const movimentacoes: { data: string; valor: number; descricao: string; tipo: "entrada" | "saida" }[] = [
  { data: "Março 2026", valor: 149, descricao: "Avulsos do futebol", tipo: "entrada" },
  {data: "Abril 2026", valor: 190, descricao: "Avulsos do futebol", tipo: "entrada" },
  {data: "16 de Abril 2026", valor: 18.55, descricao: "Cronometro", tipo: "saida" }
];
