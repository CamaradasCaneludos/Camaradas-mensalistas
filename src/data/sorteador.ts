export interface Jogador {
  id: string;
  nome: string;
  nota: number; // escala de 1 a 10 (aceita meio ponto)
  goleiro: boolean;
}

export interface Time {
  jogadores: Jogador[];
  /** produto das notas dos jogadores do time (1 quando vazio) */
  produto: number;
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
 * Distribui jogadores de linha em `numTimes` times equilibrados pelo produto das notas.
 * `timesBase` permite fixar jogadores já alocados (ex: goleiros) — os jogadores de
 * linha são acrescentados sobre essa base.
 *
 * Estratégia: ordena por nota (desc) com embaralhamento prévio (para variar a cada
 * sorteio) e vai colocando cada jogador no time com menos gente e menor produto,
 * com desempate aleatório — mantém times balanceados em tamanho e em nível.
 *
 * A comparação é feita sobre a soma dos logaritmos das notas (equivalente a comparar
 * os produtos, mas sem estourar a precisão quando há muitos jogadores).
 */
export function sortearTimes(
  jogadoresLinha: Jogador[],
  numTimes: number,
  timesBase?: Time[],
): Time[] {
  const times: Time[] =
    timesBase && timesBase.length === numTimes
      ? timesBase.map((t) => ({ jogadores: [...t.jogadores], produto: t.produto }))
      : Array.from({ length: numTimes }, () => ({ jogadores: [], produto: 1 }));

  // log do produto acumulado de cada time, usado só para comparar
  const logs = times.map((t) =>
    t.jogadores.reduce((acc, j) => acc + Math.log(j.nota), 0),
  );

  const ordenados = embaralhar(jogadoresLinha).sort((a, b) => b.nota - a.nota);

  for (const jogador of ordenados) {
    // 1) prioriza os times com menos jogadores (mantém tamanhos parelhos)
    const menorQtd = Math.min(...times.map((t) => t.jogadores.length));
    const indices = times
      .map((_, i) => i)
      .filter((i) => times[i].jogadores.length === menorQtd);

    // 2) entre esses, escolhe os de menor produto de notas
    const menorLog = Math.min(...indices.map((i) => logs[i]));
    const empatados = indices.filter((i) => logs[i] === menorLog);

    // 3) desempate aleatório
    const escolhido = empatados[Math.floor(Math.random() * empatados.length)];
    times[escolhido].jogadores.push(jogador);
    times[escolhido].produto *= jogador.nota;
    logs[escolhido] += Math.log(jogador.nota);
  }

  return times;
}

/** Média geométrica das notas do time — a "nota média" coerente com o produto. */
export function mediaTime(time: Time): number {
  if (time.jogadores.length === 0) return 0;
  return Math.pow(time.produto, 1 / time.jogadores.length);
}
