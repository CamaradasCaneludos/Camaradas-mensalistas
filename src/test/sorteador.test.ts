import { describe, it, expect } from "vitest";
import {
  Jogador,
  TAMANHO_TIME,
  capacidadesTimes,
  maxTimes,
  sortearTimes,
} from "@/data/sorteador";

function criarJogadores(qtd: number, goleiro = false): Jogador[] {
  return Array.from({ length: qtd }, (_, i) => ({
    id: `${goleiro ? "g" : "j"}${i}`,
    nome: `Jogador ${i}`,
    nota: (i % 10) + 1,
    goleiro,
  }));
}

const naLinha = (jogadores: Jogador[]) => jogadores.filter((j) => !j.goleiro).length;

describe("capacidadesTimes", () => {
  it("fecha os times em 5 e deixa o resto no último", () => {
    expect(capacidadesTimes(13, 3)).toEqual([5, 5, 3]);
    expect(capacidadesTimes(15, 3)).toEqual([5, 5, 5]);
    expect(capacidadesTimes(11, 3)).toEqual([5, 5, 1]);
  });

  it("não passa das vagas quando há gente demais", () => {
    expect(capacidadesTimes(18, 3)).toEqual([5, 5, 5]);
  });
});

describe("maxTimes", () => {
  it("conta o time incompleto", () => {
    expect(maxTimes(13)).toBe(3);
    expect(maxTimes(10)).toBe(2);
    expect(maxTimes(11)).toBe(3);
  });
});

describe("sortearTimes", () => {
  it("monta 2 times fechados e 1 incompleto com 13 jogadores", () => {
    const { times, reservas } = sortearTimes(criarJogadores(13), 3);
    expect(times.map((t) => naLinha(t.jogadores))).toEqual([5, 5, 3]);
    expect(reservas).toHaveLength(0);
  });

  it("deixa o excedente como reserva", () => {
    const { times, reservas } = sortearTimes(criarJogadores(13), 2);
    expect(times.map((t) => naLinha(t.jogadores))).toEqual([
      TAMANHO_TIME,
      TAMANHO_TIME,
    ]);
    expect(reservas).toHaveLength(3);
  });

  it("goleiro fixo não ocupa vaga de linha", () => {
    const goleiro = criarJogadores(1, true)[0];
    const { times } = sortearTimes(criarJogadores(10), 2, [
      { jogadores: [goleiro], produto: goleiro.nota },
      { jogadores: [], produto: 1 },
    ]);
    expect(times.map((t) => naLinha(t.jogadores))).toEqual([5, 5]);
    expect(times[0].jogadores).toHaveLength(6);
  });

  it("não perde nem duplica jogadores", () => {
    const jogadores = criarJogadores(13);
    const { times, reservas } = sortearTimes(jogadores, 3);
    const ids = [...times.flatMap((t) => t.jogadores), ...reservas].map((j) => j.id);
    expect(new Set(ids).size).toBe(13);
  });
});
