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

/* ── Sorteio ── */

/** Jogadores de linha por time (o goleiro é à parte). */
export const TAMANHO_TIME = 5;

export interface ResultadoSorteio {
  times: Time[];
  /** jogadores de linha que sobraram quando há gente demais para os times pedidos */
  reservas: Jogador[];
}

function embaralhar<T>(arr: T[]): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Quantos times dá para montar com `totalLinha` jogadores (o último pode ficar incompleto). */
export function maxTimes(totalLinha: number): number {
  return Math.ceil(totalLinha / TAMANHO_TIME);
}

/**
 * Vagas de linha de cada time: enche de 5 em 5 e o que sobrar vai para o último time.
 * Ex.: 13 jogadores em 3 times → [5, 5, 3].
 */
export function capacidadesTimes(totalLinha: number, numTimes: number): number[] {
  let restantes = Math.min(totalLinha, numTimes * TAMANHO_TIME);
  return Array.from({ length: numTimes }, () => {
    const vagas = Math.min(TAMANHO_TIME, restantes);
    restantes -= vagas;
    return vagas;
  });
}

/**
 * Distribui jogadores de linha em `numTimes` times de até 5, equilibrados pelo produto
 * das notas. `timesBase` permite fixar jogadores já alocados (ex: goleiros) — os
 * jogadores de linha são acrescentados sobre essa base e os goleiros não ocupam vaga.
 *
 * Os times fecham em 5: com número quebrado, só o último fica incompleto (13 em 3 times
 * → 5, 5, 3). Se sobrar gente para as vagas disponíveis, o excedente vira reserva.
 *
 * Estratégia: ordena por nota (desc) com embaralhamento prévio (para variar a cada
 * sorteio) e vai colocando cada jogador no time menos preenchido (proporcional às vagas)
 * e de menor média, com desempate aleatório.
 *
 * A comparação é feita sobre a soma dos logaritmos das notas (equivalente a comparar
 * os produtos, mas sem estourar a precisão quando há muitos jogadores).
 */
export function sortearTimes(
  jogadoresLinha: Jogador[],
  numTimes: number,
  timesBase?: Time[],
): ResultadoSorteio {
  const times: Time[] =
    timesBase && timesBase.length === numTimes
      ? timesBase.map((t) => ({ jogadores: [...t.jogadores], produto: t.produto }))
      : Array.from({ length: numTimes }, () => ({ jogadores: [], produto: 1 }));

  // log do produto acumulado de cada time, usado só para comparar
  const logs = times.map((t) =>
    t.jogadores.reduce((acc, j) => acc + Math.log(j.nota), 0),
  );

  const capacidades = capacidadesTimes(jogadoresLinha.length, numTimes);
  const ocupacao = times.map(() => 0); // só jogadores de linha ocupam vaga

  const sorteados = embaralhar(jogadoresLinha);
  const totalVagas = capacidades.reduce((acc, c) => acc + c, 0);
  const reservas = sorteados.slice(totalVagas);
  const emCampo = sorteados.slice(0, totalVagas).sort((a, b) => b.nota - a.nota);

  for (const jogador of emCampo) {
    // 1) só times com vaga sobrando
    const disponiveis = times
      .map((_, i) => i)
      .filter((i) => ocupacao[i] < capacidades[i]);

    // 2) prioriza os menos preenchidos em relação às próprias vagas
    const preenchimento = (i: number) => ocupacao[i] / capacidades[i];
    const menorPreenchimento = Math.min(...disponiveis.map(preenchimento));
    const indices = disponiveis.filter(
      (i) => preenchimento(i) === menorPreenchimento,
    );

    // 3) entre esses, escolhe os de menor média de notas (média geométrica, via log)
    const media = (i: number) => logs[i] / Math.max(times[i].jogadores.length, 1);
    const menorMedia = Math.min(...indices.map(media));
    const empatados = indices.filter((i) => media(i) === menorMedia);

    // 4) desempate aleatório
    const escolhido = empatados[Math.floor(Math.random() * empatados.length)];
    times[escolhido].jogadores.push(jogador);
    times[escolhido].produto *= jogador.nota;
    logs[escolhido] += Math.log(jogador.nota);
    ocupacao[escolhido] += 1;
  }

  return { times, reservas };
}

/** Média geométrica das notas do time — a "nota média" coerente com o produto. */
export function mediaTime(time: Time): number {
  if (time.jogadores.length === 0) return 0;
  return Math.pow(time.produto, 1 / time.jogadores.length);
}
