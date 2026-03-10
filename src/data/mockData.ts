import alissonImg from "@/assets/alisson.png"; // Usando o alias @ que está no seu config

export const infoJogo = {
  local: "Campo do América",
  horario: "Domingo às 08h",
  valor: 25.0,
  vagas: 18,
  observacoes: [
    "Chegar com antecedência",
    "Respeitar horário e organização",
  ],
};

export const regras = [
  "Máximo de 18 vagas",
  "Enquete de comparecimento liberada de segunda-feira até sábado às 11h",
  "Caso não haja 18 confirmados até sábado às 11h, vagas liberadas para avulsos no grupo geral",
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
  { nome: "Diego Padilha(DiNego)", status: "em_dia" },
  { nome: "Lucas Pessoa", status: "em_dia" },
  { nome: "Antônio Carvalho", status: "em_dia" },
  { nome: "João Malbec", status: "em_dia" },
  { nome: "Igor Cardoso", status: "em_dia" },
  { nome: "Gabriel Junior (Cael)", status: "em_dia" },
  { nome: "Matheus Leite", status: "em_dia" },
  { nome: "Mauthos Sepini", status: "em_dia" },
  { nome: "Leonardo Augusto", status: "em_dia" },
  { nome: "Márcio Júnior", status: "em_dia" },
  { nome: "Erick Pessoa", status: "em_dia" },
  { nome: "Lucas Souza", status: "em_dia" },
  { nome: "Lucas Alberto", status: "em_dia" },
  { nome: "Marcelo Mascarin", status: "em_dia" },
  { nome: "Pedro Carvalho", status: "em_dia" },
  { nome: "Alisson Vieira", status: "em_dia" },
  { nome: "Vinicius Lopes (Vinico)", status: "em_dia" },
  { nome: "Pedro (Gnose)", status: "em_dia" },
];

export const rankingVergonha: { nome: string; faltas: number; foto?: string }[] = [
  { 
    nome: "Alisson Vieira", 
    faltas: 1, 
    foto: "/Camaradas-mensalistas/alisson.png"
  },
];

export const observacoes = [
  "Todo dinheiro extra arrecadado será utilizado para compra de bola, colete, bombinha e luva de goleiro",
  "Controle de pagamento feito pelo Lucas Pessoa",
  "O comprovante geral do mensal será sempre enviado",
  "Mensalistas não precisam enviar comprovante, apenas marcar presença na enquete de controle (realizada na última semana de cada mês)",
];
