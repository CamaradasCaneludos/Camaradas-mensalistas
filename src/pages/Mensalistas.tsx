import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Estado, PageHeader, painel } from "@/components/Editaveis";
import { supabase, useMutar, useRows, useSession, type Mensalista } from "@/lib/supabase";

export default function Mensalistas() {
  const session = useSession();
  const q = useRows<Mensalista>("mensalistas");
  const mutar = useMutar("mensalistas");
  const [nome, setNome] = useState("");

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    if (await mutar(supabase.from("mensalistas").insert({ nome: nome.trim() }), "Mensalista adicionado.")) setNome("");
  }

  const lista = q.data ?? [];
  const emDia = lista.filter((m) => m.em_dia).length;

  return (
    <>
      <PageHeader kicker="Elenco" titulo="Mensalistas">
        Quem joga todo domingo e como está o pagamento do mês.
        {session && " Toque no status para alternar."}
      </PageHeader>

      {!q.data ? (
        <Estado q={q} linhas={6} />
      ) : (
        <div className="rise max-w-3xl space-y-4">
          <div className={painel}>
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-muted-foreground">Pagamentos em dia</p>
              <p className="font-mono-num text-2xl">
                {emDia}
                <span className="text-muted-foreground">/{lista.length}</span>
              </p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success transition-[width] duration-500"
                style={{ width: `${lista.length ? (emDia / lista.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <ul className={`${painel} divide-y divide-border/70 !py-2`}>
            {lista.map((m, i) => (
              <li key={m.id} className="flex items-center gap-4 py-3">
                <span className="font-mono-num w-6 text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-foreground">{m.nome}</span>
                <button
                  disabled={!session}
                  onClick={() => mutar(supabase.from("mensalistas").update({ em_dia: !m.em_dia }).eq("id", m.id))}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors disabled:cursor-default ${
                    m.em_dia ? "bg-success/15 text-success" : "bg-primary/15 text-primary"
                  } ${session ? "hover:brightness-125" : ""}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${m.em_dia ? "bg-success" : "bg-primary"}`} />
                  {m.em_dia ? "Em dia" : "Pendente"}
                </button>
                {session && (
                  <button
                    aria-label={`Remover ${m.nome}`}
                    onClick={() => confirm(`Remover ${m.nome}?`) && mutar(supabase.from("mensalistas").delete().eq("id", m.id))}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
            {lista.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">Nenhum mensalista cadastrado.</li>}
          </ul>

          {session && (
            <form onSubmit={adicionar} className="flex gap-2">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do novo mensalista" />
              <Button type="submit">
                <Plus /> Adicionar
              </Button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
