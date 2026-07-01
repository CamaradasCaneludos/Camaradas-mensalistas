export interface Jogador {
  id: string;
  nome: string;
  nota: number; // escala de 1 a 10 (aceita meio ponto)
  goleiro: boolean;
}

export interface Time {
  jogadores: Jogador[];
  total: number;
}

const STORAGE_KEY = "camaradas:jogadores";

/* ── Persistência (localStorage) ── */

export function carregarJogadores(): Jogador[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const dados = JSON.parse(raw) as Jogador[];
    if (!Array.isArray(dados)) return [];
    return dados;
  } catch {
    return [];
  }
}

export function salvarJogadores(jogadores: Jogador[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jogadores));
}

export function novoId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

/* ── Sorteio ── */

function embaralhar<T>(arr: T[]): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Distribui jogadores de linha em `numTimes` times equilibrados pela soma das notas.
 * `timesBase` permite fixar jogadores já alocados (ex: goleiros) — os jogadores de
 * linha são acrescentados sobre essa base.
 *
 * Estratégia: ordena por nota (desc) com embaralhamento prévio (para variar a cada
 * sorteio) e vai colocando cada jogador no time com menos gente e menor soma,
 * com desempate aleatório — mantém times balanceados em tamanho e em nível.
 */
export function sortearTimes(
  jogadoresLinha: Jogador[],
  numTimes: number,
  timesBase?: Time[],
): Time[] {
  const times: Time[] =
    timesBase && timesBase.length === numTimes
      ? timesBase.map((t) => ({ jogadores: [...t.jogadores], total: t.total }))
      : Array.from({ length: numTimes }, () => ({ jogadores: [], total: 0 }));

  const ordenados = embaralhar(jogadoresLinha).sort((a, b) => b.nota - a.nota);

  for (const jogador of ordenados) {
    // 1) prioriza os times com menos jogadores (mantém tamanhos parelhos)
    const menorQtd = Math.min(...times.map((t) => t.jogadores.length));
    const candidatos = times.filter((t) => t.jogadores.length === menorQtd);

    // 2) entre esses, escolhe os de menor soma de notas
    const menorTotal = Math.min(...candidatos.map((t) => t.total));
    const empatados = candidatos.filter((t) => t.total === menorTotal);

    // 3) desempate aleatório
    const escolhido = empatados[Math.floor(Math.random() * empatados.length)];
    escolhido.jogadores.push(jogador);
    escolhido.total += jogador.nota;
  }

  return times;
}

export function mediaTime(time: Time): number {
  if (time.jogadores.length === 0) return 0;
  return time.total / time.jogadores.length;
}
