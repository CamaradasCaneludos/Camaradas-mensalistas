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
  { nome: "Diego Padilha(DiNego)", status: "pendente" },
  { nome: "Lucas Pessoa", status: "em_dia" },
  { nome: "Antônio Carvalho", status: "em_dia" },
  { nome: "João Malbec", status: "pendente" },
  { nome: "Igor Cardoso", status: "pendente" },
  { nome: "Gabriel Junior (Cael)", status: "pendente" },
  { nome: "Matheus Leite", status: "pendente" },
  { nome: "Mauthos Sepini", status: "pendente" },
  { nome: "Leonardo Augusto", status: "pendente" },
  { nome: "Márcio Júnior", status: "pendente" },
  { nome: "Erick Pessoa", status: "pendente" },
  { nome: "Lucas Souza", status: "pendente" },
  { nome: "Lucas Alberto", status: "pendente" },
  { nome: "Marcelo Mascarin", status: "pendente" },
  { nome: "Pedro Carvalho", status: "pendente" },
  { nome: "Alisson Vieira", status: "pendente" },
  { nome: "Gabriel", status: "pendente" },
  { nome: "Pedro (Gnose)", status: "pendente" },
];

export const observacoes = [
  "Todo dinheiro extra arrecadado será utilizado para compra de bola, colete, bombinha e luva de goleiro",
  "Controle de pagamento feito pelo Lucas Pessoa",
  "O comprovante geral do mensal será sempre enviado",
  "Mensalistas não precisam enviar comprovante, apenas marcar presença na enquete de controle (realizada na última semana de cada mês)",
];
