/** Atributos da carta, na ordem em que aparecem (duas colunas de três). */
export const ATRIBUTOS_LINHA = [
  { sigla: "RIT", nome: "Ritmo" },
  { sigla: "FIN", nome: "Finalização" },
  { sigla: "PAS", nome: "Passe" },
  { sigla: "DRI", nome: "Drible" },
  { sigla: "DEF", nome: "Defesa" },
  { sigla: "FIS", nome: "Físico" },
];

/** Goleiro usa os mesmos 6 espaços da carta, como no FIFA. */
export const ATRIBUTOS_GOLEIRO = [
  { sigla: "ELA", nome: "Elasticidade" },
  { sigla: "MAN", nome: "Manejo" },
  { sigla: "CHU", nome: "Chute" },
  { sigla: "REF", nome: "Reflexos" },
  { sigla: "VEL", nome: "Velocidade" },
  { sigla: "POS", nome: "Posicionamento" },
];

export const atributosDe = (goleiro: boolean) => (goleiro ? ATRIBUTOS_GOLEIRO : ATRIBUTOS_LINHA);

export interface Jogador {
  id: string;
  nome: string;
  nota: number; // nota geral, de 1 a 10
  goleiro: boolean;
  /** 6 valores de 0 a 10 na ordem da carta; null quando a nota geral foi dada direto */
  atributos?: number[] | null;
  foto_url?: string | null;
}

/**
 * Nota geral = média dos atributos com uma casa decimal.
 * ponytail: piso de 1 porque nota 0 zeraria o produto do time no sorteio.
 */
export function notaGeral(atributos: number[]): number {
  const media = atributos.reduce((acc, v) => acc + v, 0) / atributos.length;
  return Math.max(1, Math.round(media * 10) / 10);
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

/* ── Medidas de equilíbrio ── */

/** Os 6 atributos do jogador; quem tem só a nota geral conta ela nos seis. */
export function vetorAtributos(j: Jogador): number[] {
  return j.atributos ?? Array(6).fill(j.nota);
}

/** Média de cada atributo no time. Goleiro fica de fora: os atributos dele são outros. */
export function mediasAtributos(jogadores: Jogador[]): number[] {
  const linha = jogadores.filter((j) => !j.goleiro);
  return Array.from({ length: 6 }, (_, d) =>
    linha.length ? linha.reduce((acc, j) => acc + vetorAtributos(j)[d], 0) / linha.length : 0,
  );
}

/** Média geométrica da nota geral (coerente com o produto das notas), só jogadores de linha. */
function mediaNota(jogadores: Jogador[]): number[] {
  const linha = jogadores.filter((j) => !j.goleiro);
  if (!linha.length) return [0];
  return [Math.exp(linha.reduce((acc, j) => acc + Math.log(j.nota), 0) / linha.length)];
}

type Medida = (jogadores: Jogador[]) => number[];

/** Soma, em cada dimensão, o quanto a média de cada time se afasta da média entre os times. */
function desequilibrio(grupos: Jogador[][], medir: Medida): number {
  const medias = grupos.map(medir);
  let total = 0;
  for (let d = 0; d < medias[0].length; d++) {
    const geral = medias.reduce((acc, m) => acc + m[d], 0) / medias.length;
    for (const m of medias) total += (m[d] - geral) ** 2;
  }
  return total;
}

/** Maior diferença entre o time mais forte e o mais fraco em alguma dimensão, em pontos de nota. */
function maiorDiferenca(grupos: Jogador[][], medir: Medida): number {
  const medias = grupos.map(medir);
  return Math.max(
    ...medias[0].map((_, d) => Math.max(...medias.map((m) => m[d])) - Math.min(...medias.map((m) => m[d]))),
  );
}

/** Duplas que jogaram juntas (ids em ordem, para comparar entre sorteios). */
function duplas(grupos: Jogador[][]): Set<string> {
  const pares = new Set<string>();
  for (const g of grupos)
    for (let i = 0; i < g.length; i++)
      for (let k = i + 1; k < g.length; k++) pares.add([g[i].id, g[k].id].sort().join("|"));
  return pares;
}

/* ── Sorteio ── */

/**
 * Quanto um sorteio pode ficar pior que o melhor equilíbrio encontrado (em pontos de nota,
 * na dimensão mais desigual) e ainda valer. É essa folga que deixa os times variarem.
 * ponytail: valor no olho; aumente se os times ainda repetirem, diminua se ficarem desiguais.
 */
export const FOLGA = 0.3;

/**
 * Distribui os jogadores de linha em `numTimes` times de até 5. `timesBase` fixa jogadores
 * já alocados (os goleiros), que não ocupam vaga nem entram nas médias. Com número
 * quebrado só o último time fica incompleto (13 em 3 → 5, 5, 3); quem sobra vira reserva.
 *
 * 1. Parte de várias distribuições aleatórias e, em cada uma, troca pares de jogadores
 *    entre times enquanto a troca diminuir o desequilíbrio.
 * 2. Fica com todas as que chegaram até `FOLGA` do melhor equilíbrio.
 * 3. Rodízio: entre elas escolhe a que menos repete duplas do sorteio `anterior`
 *    (desempate aleatório). Assim "sortear de novo" mistura a galera de verdade.
 * ponytail: busca local, não garante o ótimo; mais `tentativas` chega mais perto.
 */
function sortearEquilibrado(
  jogadoresLinha: Jogador[],
  numTimes: number,
  medir: Medida,
  timesBase?: Time[],
  anterior?: Time[],
  tentativas = 60,
): ResultadoSorteio {
  const capacidades = capacidadesTimes(jogadoresLinha.length, numTimes);
  const totalVagas = capacidades.reduce((acc, c) => acc + c, 0);
  const sorteados = embaralhar(jogadoresLinha);
  const reservas = sorteados.slice(totalVagas);
  const emCampo = sorteados.slice(0, totalVagas);

  const encontrados: Jogador[][][] = [];
  for (let t = 0; t < tentativas; t++) {
    const ordem = embaralhar(emCampo);
    let inicio = 0;
    const grupos = capacidades.map((c) => ordem.slice(inicio, (inicio += c)));

    let custo = desequilibrio(grupos, medir);
    let melhorou = true;
    while (melhorou) {
      melhorou = false;
      for (let a = 0; a < grupos.length; a++)
        for (let b = a + 1; b < grupos.length; b++)
          for (let i = 0; i < grupos[a].length; i++)
            for (let j = 0; j < grupos[b].length; j++) {
              [grupos[a][i], grupos[b][j]] = [grupos[b][j], grupos[a][i]];
              const novo = desequilibrio(grupos, medir);
              if (novo < custo - 1e-9) {
                custo = novo;
                melhorou = true;
              } else {
                [grupos[a][i], grupos[b][j]] = [grupos[b][j], grupos[a][i]];
              }
            }
    }
    encontrados.push(grupos);
  }

  const diferencas = encontrados.map((g) => maiorDiferenca(g, medir));
  const melhor = Math.min(...diferencas);
  const bons = encontrados.filter((_, i) => diferencas[i] <= melhor + FOLGA + 1e-9);

  const antes = anterior ? duplas(anterior.map((t) => t.jogadores.filter((j) => !j.goleiro))) : new Set<string>();
  const repetidas = bons.map((g) => [...duplas(g)].filter((p) => antes.has(p)).length);
  const menos = Math.min(...repetidas);
  const opcoes = bons.filter((_, i) => repetidas[i] === menos);
  const escolhido = opcoes[Math.floor(Math.random() * opcoes.length)];

  const base =
    timesBase && timesBase.length === numTimes ? timesBase : capacidades.map(() => ({ jogadores: [], produto: 1 }));
  return {
    times: base.map((time, i) => comoTime([...time.jogadores, ...escolhido[i]])),
    reservas,
  };
}

/** Equilibra pela nota geral (média geométrica, coerente com o produto das notas). */
export function sortearTimes(jogadoresLinha: Jogador[], numTimes: number, timesBase?: Time[], anterior?: Time[]) {
  return sortearEquilibrado(jogadoresLinha, numTimes, mediaNota, timesBase, anterior);
}

/** Equilibra os 6 atributos ao mesmo tempo: médias parecidas em ritmo, finalização, passe etc. */
export function sortearPorAtributos(jogadoresLinha: Jogador[], numTimes: number, timesBase?: Time[], anterior?: Time[]) {
  return sortearEquilibrado(jogadoresLinha, numTimes, mediasAtributos, timesBase, anterior);
}

/* ── Ajuste manual ── */

export function comoTime(jogadores: Jogador[]): Time {
  return { jogadores, produto: jogadores.reduce((acc, j) => acc * j.nota, 1) };
}

/**
 * Troca dois jogadores de lugar entre grupos (times e, por último, a lista de reservas).
 * Se estiverem no mesmo grupo, nada muda.
 */
export function trocarJogadores(grupos: Jogador[][], idA: string, idB: string): Jogador[][] {
  const onde = (id: string) => grupos.findIndex((g) => g.some((j) => j.id === id));
  const ga = onde(idA);
  const gb = onde(idB);
  if (ga < 0 || gb < 0 || ga === gb) return grupos;
  const a = grupos[ga].find((j) => j.id === idA)!;
  const b = grupos[gb].find((j) => j.id === idB)!;
  return grupos.map((g, i) =>
    i === ga ? g.map((j) => (j.id === idA ? b : j)) : i === gb ? g.map((j) => (j.id === idB ? a : j)) : g,
  );
}

/** Move um jogador para outro grupo (muda o tamanho dos dois times). */
export function moverJogador(grupos: Jogador[][], id: string, destino: number): Jogador[][] {
  const jogador = grupos.flat().find((j) => j.id === id);
  if (!jogador) return grupos;
  return grupos.map((g, i) => {
    const sem = g.filter((j) => j.id !== id);
    return i === destino ? [...sem, jogador] : sem;
  });
}

/** Média geométrica das notas do time — a "nota média" coerente com o produto. */
export function mediaTime(time: Time): number {
  if (time.jogadores.length === 0) return 0;
  return Math.pow(time.produto, 1 / time.jogadores.length);
}
