import type { ReactNode } from "react";
import { Retrato } from "@/components/Editaveis";
import { atributosDe, type Jogador } from "@/data/sorteador";

// Cor da carta pela nota geral, como no FIFA.
function metal(nota: number) {
  if (nota >= 7.5) return "from-[#f6e7a6] via-[#dcbc5f] to-[#b28a36] text-[#3a2c0c]";
  if (nota >= 6.5) return "from-[#f1f3f4] via-[#c3c9ce] to-[#8e979e] text-[#22272b]";
  return "from-[#ecc19b] via-[#c4834f] to-[#8c522c] text-[#2e1a0c]";
}

export const numero = (n: number) => String(n).replace(".", ",");

export function CartaJogador({ jogador, children }: { jogador: Jogador; children?: ReactNode }) {
  const siglas = atributosDe(jogador.goleiro);
  return (
    <article
      className={`relative flex flex-col rounded-b-[2.25rem] rounded-t-2xl bg-gradient-to-br p-3 pb-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] sm:p-4 sm:pb-5 ${metal(jogador.nota)}`}
    >
      <div className="flex items-start">
        <div className="flex w-14 flex-col items-center">
          <span className="font-display text-4xl leading-[0.85] sm:text-5xl">{numero(jogador.nota)}</span>
          <span className="font-display text-lg leading-none sm:text-xl">{jogador.goleiro ? "GOL" : "LIN"}</span>
        </div>
        <Retrato nome={jogador.nome} foto={jogador.foto_url ?? null} className="ml-auto h-14 w-14 text-xl sm:h-20 sm:w-20 sm:text-2xl" />
      </div>

      <h3 className="mt-3 truncate border-b border-black/15 pb-1.5 text-center text-xl sm:text-2xl">{jogador.nome}</h3>

      {jogador.atributos ? (
        <dl className="mx-auto mt-2 grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-3 font-display text-lg leading-tight sm:gap-x-5 sm:text-xl">
          {siglas.map((a, i) => (
            <div key={a.sigla} className="flex gap-2" title={a.nome}>
              <dt className="order-2">{a.sigla}</dt>
              <dd className="w-6 text-right sm:w-7">{numero(jogador.atributos![i])}</dd>
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
