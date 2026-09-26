import type { ReactNode } from "react";
import { Retrato } from "@/components/Editaveis";
import { ATRIBUTOS, type Jogador } from "@/data/sorteador";

// Cor da carta pela nota geral, como no FIFA.
function metal(nota: number) {
  if (nota >= 75) return "from-[#f6e7a6] via-[#dcbc5f] to-[#b28a36] text-[#3a2c0c]";
  if (nota >= 65) return "from-[#f1f3f4] via-[#c3c9ce] to-[#8e979e] text-[#22272b]";
  return "from-[#ecc19b] via-[#c4834f] to-[#8c522c] text-[#2e1a0c]";
}

export function temAtributos(j: Jogador) {
  return ATRIBUTOS.every((a) => j[a.campo] != null);
}

export function CartaJogador({ jogador, children }: { jogador: Jogador; children?: ReactNode }) {
  return (
    <article
      className={`relative flex flex-col rounded-b-[2.25rem] rounded-t-2xl bg-gradient-to-br p-4 pb-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] ${metal(jogador.nota)}`}
    >
      <div className="flex items-start">
        <div className="flex w-12 flex-col items-center">
          <span className="font-display text-5xl leading-[0.85]">{jogador.nota}</span>
          <span className="font-display text-xl leading-none">{jogador.goleiro ? "GOL" : "LIN"}</span>
        </div>
        <Retrato nome={jogador.nome} foto={jogador.foto_url ?? null} className="ml-auto h-20 w-20 text-2xl" />
      </div>

      <h3 className="mt-3 truncate border-b border-black/15 pb-1.5 text-center text-2xl">{jogador.nome}</h3>

      {temAtributos(jogador) ? (
        <dl className="mx-auto mt-2 grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-5 font-display text-xl leading-tight">
          {ATRIBUTOS.map((a) => (
            <div key={a.campo} className="flex gap-2" title={a.nome}>
              <dd className="w-6 text-right">{jogador[a.campo]}</dd>
              <dt>{a.sigla}</dt>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-3 text-center text-xs font-medium uppercase tracking-widest opacity-60">Nota geral direta</p>
      )}

      {children}
    </article>
  );
}
