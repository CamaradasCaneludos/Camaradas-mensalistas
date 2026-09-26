import { Link } from "react-router-dom";
import { ArrowUpRight, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Retrato, reais } from "@/components/Editaveis";
import { useConfig, useRows, type Mensalista, type Vergonhoso } from "@/lib/supabase";

const bloco =
  "group relative flex flex-col rounded-2xl border border-border/70 bg-card/80 p-5 transition-colors hover:border-primary/50 md:p-6";

function Seta() {
  return (
    <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
  );
}

export default function Dashboard() {
  const { data: config } = useConfig();
  const { data: vergonha } = useRows<Vergonhoso>("vergonha");
  const { data: mensalistas } = useRows<Mensalista>("mensalistas");

  const podio = [...(vergonha ?? [])].sort((a, b) => b.faltas - a.faltas).slice(0, 3);
  const [top, ...resto] = podio;
  const emDia = mensalistas?.filter((m) => m.em_dia).length ?? 0;
  const total = mensalistas?.length ?? 0;

  return (
    <div className="space-y-10 md:space-y-14">
      <section className="rise">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Mensal do futebol</p>
        <h1 className="mt-3 text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.85]">
          Camaradas
          <br />
          <span className="text-primary">Caneludos</span>
        </h1>
        <div className="mt-5 text-lg text-muted-foreground">
          {config ? (
            <>
              {config.horario} · {config.local}
            </>
          ) : (
            <Skeleton className="h-6 w-64" />
          )}
        </div>
      </section>

      <section className="rise grid gap-4 lg:grid-cols-3 [animation-delay:80ms]">
        <Link to="/ranking" className={`${bloco} lg:col-span-2 lg:row-span-3`}>
          <Seta />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Mural da vergonha</p>
          <h2 className="mt-2 text-3xl md:text-4xl">Quem mais faltou</h2>

          {top ? (
            <div className="mt-8 flex flex-1 items-end gap-5 md:gap-8">
              <div className="flex flex-col gap-3">
                <Retrato nome={top.nome} foto={top.foto_url} className="h-32 w-32 text-4xl ring-2 ring-primary/50 md:h-44 md:w-44" />
                <div>
                  <p className="flex items-center gap-1.5 font-medium">
                    <Crown className="h-4 w-4 text-primary" /> {top.nome}
                  </p>
                  <p className="font-display text-5xl text-primary">{String(top.faltas).replace(".", ",")}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 pb-2">
                {resto.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <Retrato nome={p.nome} foto={p.foto_url} className="h-12 w-12 opacity-80" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">{i + 2}º · {p.nome.split(" ")[0]}</p>
                      <p className="font-mono-num">{String(p.faltas).replace(".", ",")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : vergonha ? (
            <p className="mt-6 text-muted-foreground">Ninguém no mural. Todo mundo compareceu.</p>
          ) : (
            <Skeleton className="mt-8 h-44 w-44 rounded-xl" />
          )}
        </Link>

        <Link to="/mensalistas" className={bloco}>
          <Seta />
          <p className="text-sm text-muted-foreground">Mensalistas em dia</p>
          <p className="font-mono-num mt-3 text-4xl">
            {emDia}
            <span className="text-muted-foreground">/{total}</span>
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-success" style={{ width: `${total ? (emDia / total) * 100 : 0}%` }} />
          </div>
        </Link>

        <Link to="/pagamento" className={bloco}>
          <Seta />
          <p className="text-sm text-muted-foreground">Mensalidade</p>
          <p className="font-mono-num mt-3 text-4xl">{config ? reais(config.valor) : "—"}</p>
          <p className="mt-1 text-sm text-muted-foreground">via PIX</p>
        </Link>

        <Link to="/regras" className={bloco}>
          <Seta />
          <p className="text-sm text-muted-foreground">Vagas fixas</p>
          <p className="font-mono-num mt-3 text-4xl">{config?.vagas ?? "—"}</p>
          <p className="mt-1 text-sm text-muted-foreground">Ver as regras do mensal</p>
        </Link>
      </section>
    </div>
  );
}
