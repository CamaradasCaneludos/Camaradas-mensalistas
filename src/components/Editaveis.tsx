import { useState, type ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Check, Pencil, Plus, Trash2, X, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  supabase,
  useConfig,
  useMutar,
  useRows,
  useSession,
  type Config,
  type Secao,
  type Texto,
} from "@/lib/supabase";

export const painel = "rounded-2xl border border-border/70 bg-card/80 p-5 md:p-6";

export function PageHeader({
  kicker,
  titulo,
  children,
}: {
  kicker: string;
  titulo: string;
  children?: ReactNode;
}) {
  return (
    <header className="rise mb-8 max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{kicker}</p>
      <h1 className="mt-2 text-5xl text-foreground md:text-6xl">{titulo}</h1>
      {children && <p className="mt-3 text-muted-foreground">{children}</p>}
    </header>
  );
}

/** Esqueleto enquanto carrega, mensagem clara se falhar. */
export function Estado({ q, linhas = 3 }: { q: UseQueryResult<unknown>; linhas?: number }) {
  if (q.isError)
    return (
      <p className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
        Não foi possível carregar os dados. Verifique a conexão e recarregue a página.
      </p>
    );
  return (
    <div className="space-y-2">
      {Array.from({ length: linhas }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}

/** Lista de textos de uma seção. Logado: adiciona e remove itens. */
export function ListaTextos({ secao, numerada = false }: { secao: Secao; numerada?: boolean }) {
  const session = useSession();
  const q = useRows<Texto>("textos");
  const mutar = useMutar("textos");
  const [novo, setNovo] = useState("");

  if (!q.data) return <Estado q={q} />;
  const itens = q.data.filter((t) => t.secao === secao);

  async function adicionar() {
    const texto = novo.trim();
    if (!texto) return;
    if (await mutar(supabase.from("textos").insert({ secao, texto }))) setNovo("");
  }

  return (
    <div>
      <ol className="divide-y divide-border/70">
        {itens.map((t, i) => (
          <li key={t.id} className="group flex items-start gap-4 py-3.5 first:pt-0">
            {numerada ? (
              <span className="font-mono-num w-6 shrink-0 pt-0.5 text-sm text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
            ) : (
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            )}
            <span className="flex-1 leading-relaxed text-foreground/85">{t.texto}</span>
            {session && (
              <button
                aria-label="Remover item"
                onClick={() => mutar(supabase.from("textos").delete().eq("id", t.id))}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:text-primary"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
        {itens.length === 0 && (
          <li className="py-3 text-sm text-muted-foreground">Nada por aqui ainda.</li>
        )}
      </ol>
      {session && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            adicionar();
          }}
          className="mt-4 flex gap-2"
        >
          <Input value={novo} onChange={(e) => setNovo(e.target.value)} placeholder="Novo item" />
          <Button type="submit" size="icon" aria-label="Adicionar item">
            <Plus />
          </Button>
        </form>
      )}
    </div>
  );
}

/** Um campo da tabela config. Logado: edita inline. */
export function CampoConfig({
  campo,
  label,
  icon: Icon,
  formatar = String,
  className = "",
}: {
  campo: keyof Omit<Config, "id" | "pix_qr_url">;
  label: string;
  icon: LucideIcon;
  formatar?: (v: string | number) => string;
  className?: string;
}) {
  const session = useSession();
  const { data: config } = useConfig();
  const mutar = useMutar("config");
  const [editando, setEditando] = useState<string | null>(null);

  const numerico = campo === "valor" || campo === "vagas";

  async function salvar() {
    if (editando === null) return;
    const valor = numerico ? Number(editando.replace(",", ".")) : editando.trim();
    if (numerico ? Number.isNaN(valor) : !valor) return;
    if (await mutar(supabase.from("config").update({ [campo]: valor }).eq("id", 1))) setEditando(null);
  }

  return (
    <div className={`rounded-xl bg-muted/50 p-4 ${className}`}>
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
        {session && editando === null && config && (
          <button
            aria-label={`Editar ${label}`}
            onClick={() => setEditando(String(config[campo]))}
            className="ml-auto rounded p-0.5 transition-colors hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </p>
      {editando !== null ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            salvar();
          }}
          className="mt-2 flex gap-1.5"
        >
          <Input
            autoFocus
            inputMode={numerico ? "decimal" : undefined}
            value={editando}
            onChange={(e) => setEditando(e.target.value)}
            className="h-9"
          />
          <Button type="submit" size="icon" className="h-9 w-9 shrink-0" aria-label="Salvar">
            <Check />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            aria-label="Cancelar"
            onClick={() => setEditando(null)}
          >
            <X />
          </Button>
        </form>
      ) : (
        <div className="mt-1.5 font-semibold text-foreground">
          {config ? formatar(config[campo]) : <Skeleton className="h-5 w-32" />}
        </div>
      )}
    </div>
  );
}

export const reais = (v: string | number) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Foto quadrada com iniciais de reserva. */
export function Retrato({ nome, foto, className = "" }: { nome: string; foto: string | null; className?: string }) {
  const iniciais = nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <Avatar className={`rounded-xl ${className}`}>
      {foto && <AvatarImage src={foto} alt={`Foto de ${nome}`} className="object-cover" />}
      <AvatarFallback className="rounded-xl bg-muted font-display text-muted-foreground">{iniciais}</AvatarFallback>
    </Avatar>
  );
}
