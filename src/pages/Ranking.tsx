import { useState } from "react";
import { Camera, Crown, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Estado, PageHeader, Retrato, painel } from "@/components/Editaveis";
import { enviarFoto, supabase, useMutar, useRows, useSession, type Vergonhoso } from "@/lib/supabase";

const faltasTexto = (n: number) => `${String(n).replace(".", ",")} ${n === 1 ? "falta" : "faltas"}`;

export default function Ranking() {
  const session = useSession();
  const q = useRows<Vergonhoso>("vergonha");
  const mutar = useMutar("vergonha");
  const [nome, setNome] = useState("");

  const ordenado = [...(q.data ?? [])].sort((a, b) => b.faltas - a.faltas);

  const atualizar = (id: number, campos: Partial<Vergonhoso>) =>
    mutar(supabase.from("vergonha").update(campos).eq("id", id));

  async function trocarFoto(id: number, file?: File) {
    if (!file) return;
    try {
      await atualizar(id, { foto_url: await enviarFoto(file) });
    } catch {
      toast.error("Não foi possível enviar a foto.");
    }
  }

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    if (await mutar(supabase.from("vergonha").insert({ nome: nome.trim(), faltas: 1 }), "Adicionado ao mural.")) setNome("");
  }

  return (
    <>
      <PageHeader kicker="Hall da fama ao contrário" titulo="Mural da vergonha">
        Quem mais faltou no futebol. Não falte pra não subir no ranking.
      </PageHeader>

      {!q.data ? (
        <Estado q={q} linhas={4} />
      ) : (
        <div className="rise max-w-3xl space-y-3">
          {ordenado.map((p, i) => {
            const lider = i === 0;
            return (
              <article
                key={p.id}
                className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                  lider ? "border-primary/40 bg-primary/[0.07] md:p-6" : "border-border/70 bg-card/80"
                }`}
              >
                <span className={`font-mono-num w-6 text-sm ${lider ? "text-primary" : "text-muted-foreground"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative shrink-0">
                  <Retrato nome={p.nome} foto={p.foto_url} className={lider ? "h-20 w-20 text-2xl" : "h-12 w-12"} />
                  {session && (
                    <label
                      aria-label={`Trocar foto de ${p.nome}`}
                      className="absolute -bottom-1 -right-1 cursor-pointer rounded-lg bg-secondary p-1.5 text-muted-foreground shadow transition-colors hover:text-foreground"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => trocarFoto(p.id, e.target.files?.[0])} />
                    </label>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`truncate font-medium ${lider ? "text-lg" : ""}`}>
                    {p.nome}
                    {lider && <Crown className="ml-2 inline h-4 w-4 -translate-y-0.5 text-primary" />}
                  </p>
                  <p className="text-sm text-muted-foreground">{faltasTexto(p.faltas)}</p>
                </div>

                {session ? (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Menos meia falta"
                      disabled={p.faltas <= 0}
                      onClick={() => atualizar(p.id, { faltas: Math.max(0, p.faltas - 0.5) })}
                    >
                      <Minus />
                    </Button>
                    <span className="font-mono-num w-8 text-center">{p.faltas}</span>
                    <Button variant="ghost" size="icon" aria-label="Mais meia falta" onClick={() => atualizar(p.id, { faltas: p.faltas + 0.5 })}>
                      <Plus />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remover ${p.nome}`}
                      onClick={() => confirm(`Tirar ${p.nome} do mural?`) && mutar(supabase.from("vergonha").delete().eq("id", p.id))}
                    >
                      <Trash2 className="text-muted-foreground" />
                    </Button>
                  </div>
                ) : (
                  <span className={`font-display ${lider ? "text-5xl text-primary" : "text-3xl"}`}>
                    {String(p.faltas).replace(".", ",")}
                  </span>
                )}
              </article>
            );
          })}

          {ordenado.length === 0 && (
            <p className={`${painel} text-center text-muted-foreground`}>Ninguém no mural. Todo mundo compareceu.</p>
          )}

          {session && (
            <form onSubmit={adicionar} className="flex gap-2 pt-2">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do faltoso" />
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
