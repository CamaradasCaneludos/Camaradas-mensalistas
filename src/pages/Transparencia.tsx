import { useState } from "react";
import { Receipt, Wallet, History, BarChart3, TrendingUp, TrendingDown, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { caixaAtual, comprovantes, movimentacoes } from "@/data/mockData";

const totalEntradas = movimentacoes
  .filter((m) => m.tipo === "entrada")
  .reduce((acc, m) => acc + m.valor, 0);

const totalSaidas = movimentacoes
  .filter((m) => m.tipo === "saida")
  .reduce((acc, m) => acc + m.valor, 0);

const chartData = [
  { name: "Entradas", valor: totalEntradas },
  { name: "Saídas", valor: totalSaidas },
];

const chartConfig = {
  valor: { label: "Valor (R$)" },
};

/* ── Componente de Comprovante ── */

function ComprovanteCard({ mes, imagem }: { mes: string; imagem: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <img
        src={imagem}
        alt={`Comprovante ${mes}`}
        className="h-auto w-full object-contain"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          target.nextElementSibling?.classList.remove("hidden");
        }}
      />
      <div className="hidden flex-col items-center justify-center gap-2 bg-muted/30 py-12 text-muted-foreground">
        <Receipt className="h-8 w-8" />
        <span className="text-sm">Imagem não disponível</span>
      </div>
    </div>
  );
}

/* ── Componente ── */

export default function Transparencia() {
  const [showAllComprovantes, setShowAllComprovantes] = useState(false);
  const comprovanteAtual = comprovantes[0];
  const comprovantesAnteriores = comprovantes.slice(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl tracking-wider text-primary md:text-5xl">
          PORTAL DA TRANSPARÊNCIA
        </h1>
        <p className="mt-2 text-muted-foreground">
          Prestação de contas do futebol mensal
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* CARD 1 — Comprovante Atual */}
        <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Receipt className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl tracking-wide text-foreground">
              COMPROVANTE DO CAMPO
            </h2>
          </div>

          {comprovanteAtual && (
            <>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                {comprovanteAtual.mes}
              </p>
              <ComprovanteCard mes={comprovanteAtual.mes} imagem={comprovanteAtual.imagem} />
            </>
          )}

          <p className="mt-3 text-sm text-muted-foreground">
            Comprovante do pagamento do campo.
          </p>
        </div>

        {/* CARD 2 — Caixa Atual */}
        <div className="flex flex-col rounded-xl border border-primary/20 bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Wallet className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl tracking-wide text-foreground">
              CAIXA ATUAL DO FUTEBOL
            </h2>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-8">
            <span className="font-display text-6xl tracking-wide text-primary">
              R$ {caixaAtual.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <p className="mt-auto text-center text-sm text-muted-foreground">
            Valor disponível para compra de bola, colete, bombinha, luva de
            goleiro ou outros materiais do futebol.
          </p>
        </div>

        {/* CARD 3 — Histórico */}
        <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <History className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl tracking-wide text-foreground">
              HISTÓRICO DE CAIXA
            </h2>
          </div>

          <div className="divide-y divide-border">
            {movimentacoes.map((mov, i) => (
              <div key={i} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {mov.descricao}
                  </p>
                  <p className="text-xs text-muted-foreground">{mov.data}</p>
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  {mov.tipo === "entrada" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-primary" />
                  )}
                  <span
                    className={`font-display text-lg ${
                      mov.tipo === "entrada"
                        ? "text-success"
                        : "text-primary"
                    }`}
                  >
                    {mov.tipo === "entrada" ? "+" : "-"} R${" "}
                    {mov.valor.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4 — Gráfico */}
        <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl tracking-wide text-foreground">
              RESUMO DO CAIXA
            </h2>
          </div>

          <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
            <BarChart data={chartData} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 18%)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(0 0% 55%)", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${v}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `R$ ${Number(value).toFixed(2).replace(".", ",")}`}
                  />
                }
              />
              <Bar
                dataKey="valor"
                radius={[6, 6, 0, 0]}
                fill="hsl(0 0% 75%)"
                name="valor"
                // Color each bar individually
                shape={(props: any) => {
                  const { x, y, width, height, index } = props;
                  const fill = index === 1 ? "hsl(0 72% 51%)" : "hsl(0 0% 75%)";
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={6}
                      ry={6}
                      fill={fill}
                    />
                  );
                }}
              />
            </BarChart>
          </ChartContainer>

          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-foreground/75" />
              <span className="text-muted-foreground">Entradas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-primary" />
              <span className="text-muted-foreground">Saídas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Comprovantes */}
      {comprovantesAnteriores.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm">
          <button
            onClick={() => setShowAllComprovantes(!showAllComprovantes)}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <History className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl tracking-wide text-foreground">
                COMPROVANTES ANTERIORES
              </h2>
            </div>
            {showAllComprovantes ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {showAllComprovantes && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {comprovantesAnteriores.map((comp, i) => (
                <div key={i}>
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {comp.mes}
                  </p>
                  <ComprovanteCard mes={comp.mes} imagem={comp.imagem} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
