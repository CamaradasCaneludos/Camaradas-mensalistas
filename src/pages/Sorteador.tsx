import { useMemo, useState } from "react";
import {
  Jogador,
  Time,
  sortearTimes,
  mediaTime,
  maxTimes,
  capacidadesTimes,
  TAMANHO_TIME,
} from "@/data/sorteador";
import { supabase, useMutar, useRows, type Mensalista } from "@/lib/supabase";
import { Estado, PageHeader } from "@/components/Editaveis";
import {
  Shuffle,
  Plus,
  Trash2,
  Pencil,
  Star,
  Hand,
  Users,
  Check,
  X,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

/** O sorteador antigo guardava os jogadores no navegador; dá para importar uma vez. */
const LEGADO_KEY = "camaradas:jogadores";

function jogadoresDoNavegador(): Omit<Jogador, "id">[] {
  try {
    const dados = JSON.parse(localStorage.getItem(LEGADO_KEY) ?? "[]");
    if (!Array.isArray(dados)) return [];
    return dados.map((j: Jogador) => ({ nome: j.nome, nota: j.nota, goleiro: !!j.goleiro }));
  } catch {
    return [];
  }
}

/** O produto cresce rápido — acima de 1 milhão mostra em notação científica. */
function formatarProduto(valor: number): string {
  if (valor >= 1e6) return valor.toExponential(2).replace("e+", " × 10^");
  return valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

/** Quantos jogadores de linha o time já tem (goleiro não ocupa vaga). */
function jogadoresDeLinha(time: Time): number {
  return time.jogadores.filter((j) => !j.goleiro).length;
}

function vagasLivres(time: Time): number {
  return TAMANHO_TIME - jogadoresDeLinha(time);
}

export default function Sorteador() {
  const q = useRows<Jogador>("jogadores", "nome");
  const jogadores = useMemo(() => q.data ?? [], [q.data]);
  const { data: mensalistas = [] } = useRows<Mensalista>("mensalistas");
  const mutar = useMutar("jogadores");
  const [legados, setLegados] = useState(jogadoresDoNavegador);

  // formulário de cadastro / edição
  const [nome, setNome] = useState("");
  const [nota, setNota] = useState("");
  const [ehGoleiro, setEhGoleiro] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // sorteio — todo mundo começa presente
  const [ausentes, setAusentes] = useState<Record<string, boolean>>({});
  const [numTimes, setNumTimes] = useState(2);
  const [goleiroPorTime, setGoleiroPorTime] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<Time[] | null>(null);
  const [reservas, setReservas] = useState<Jogador[]>([]);

  /* ── cadastro ── */
  function limparForm() {
    setNome("");
    setNota("");
    setEhGoleiro(false);
    setEditandoId(null);
  }

  async function salvarJogador() {
    const nomeTrim = nome.trim();
    const notaNum = parseFloat(nota.replace(",", "."));

    if (!nomeTrim) {
      toast.error("Informe o nome do jogador.");
      return;
    }
    if (isNaN(notaNum) || notaNum < 1 || notaNum > 10) {
      toast.error("A nota deve ser um número de 1 a 10.");
      return;
    }

    const dados = { nome: nomeTrim, nota: notaNum, goleiro: ehGoleiro };
    const ok = editandoId
      ? await mutar(supabase.from("jogadores").update(dados).eq("id", editandoId), "Jogador atualizado.")
      : await mutar(supabase.from("jogadores").insert(dados), "Jogador cadastrado.");
    if (ok) limparForm();
  }

  function editar(j: Jogador) {
    setEditandoId(j.id);
    setNome(j.nome);
    setNota(String(j.nota));
    setEhGoleiro(j.goleiro);
  }

  async function remover(j: Jogador) {
    if (!confirm(`Remover ${j.nome}?`)) return;
    const ok = await mutar(supabase.from("jogadores").delete().eq("id", j.id), "Jogador removido.");
    if (ok && editandoId === j.id) limparForm();
  }

  /** Insere só quem ainda não está cadastrado (compara pelo nome). */
  async function importar(lista: Omit<Jogador, "id">[], origem: string) {
    const existentes = new Set(jogadores.map((j) => j.nome.toLowerCase()));
    const novos = lista.filter((j) => !existentes.has(j.nome.toLowerCase()));
    if (novos.length === 0) {
      toast.info(`Todos os jogadores ${origem} já estão cadastrados.`);
      return true;
    }
    return mutar(
      supabase.from("jogadores").insert(novos),
      `${novos.length} jogador(es) ${origem} importado(s).`,
    );
  }

  function importarMensalistas() {
    importar(
      mensalistas.map((m) => ({ nome: m.nome, nota: 5, goleiro: false })),
      "dos mensalistas",
    );
  }

  async function importarDoNavegador() {
    if (await importar(legados, "do navegador")) {
      localStorage.removeItem(LEGADO_KEY);
      setLegados([]);
    }
  }

  /* ── sorteio ── */
  const jogadoresPresentes = useMemo(
    () => jogadores.filter((j) => !ausentes[j.id]),
    [jogadores, ausentes],
  );
  const goleirosPresentes = useMemo(
    () => jogadoresPresentes.filter((j) => j.goleiro),
    [jogadoresPresentes],
  );
  const linhaPresentes = useMemo(
    () => jogadoresPresentes.filter((j) => !j.goleiro),
    [jogadoresPresentes],
  );
  const timesPossiveis = maxTimes(linhaPresentes.length);
  const capacidades = useMemo(
    () => capacidadesTimes(linhaPresentes.length, numTimes),
    [linhaPresentes.length, numTimes],
  );

  function togglePresenca(id: string) {
    setAusentes((a) => ({ ...a, [id]: !a[id] }));
  }

  function marcarTodos(presentes: boolean) {
    setAusentes(presentes ? {} : Object.fromEntries(jogadores.map((j) => [j.id, true])));
  }

  function sortear() {
    if (numTimes < 2) {
      toast.error("Escolha pelo menos 2 times.");
      return;
    }
    const linha = linhaPresentes;
    if (numTimes > timesPossiveis) {
      toast.error(
        `Com ${linha.length} jogador(es) de linha dá para montar no máximo ${timesPossiveis} time(s) de ${TAMANHO_TIME}.`,
      );
      return;
    }

    // Base com goleiros fixos: cada goleiro fica preso ao time escolhido.
    const timesBase: Time[] = Array.from({ length: numTimes }, () => ({
      jogadores: [],
      produto: 1,
    }));
    for (const g of goleirosPresentes) {
      const idx = goleiroPorTime[g.id];
      if (idx !== undefined && idx >= 0 && idx < numTimes) {
        timesBase[idx].jogadores.push(g);
        timesBase[idx].produto *= g.nota;
      }
    }

    const sorteio = sortearTimes(linha, numTimes, timesBase);
    setResultado(sorteio.times);
    setReservas(sorteio.reservas);
    toast.success(
      sorteio.reservas.length > 0
        ? `Times sorteados! ${sorteio.reservas.length} jogador(es) ficaram de fora.`
        : "Times sorteados!",
    );
  }

  const notasSugeridas = [
    "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5",
    "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10",
  ];

  if (!q.data) return <Estado q={q} linhas={6} />;

  return (
    <div className="space-y-6">
      <PageHeader kicker="Só para quem está logado" titulo="Sorteador de times">
        Marque quem veio e gere times equilibrados pelo produto das notas.
      </PageHeader>

      <Tabs defaultValue="sortear" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="sortear" className="gap-2">
            <Shuffle className="h-4 w-4" /> Sortear
          </TabsTrigger>
          <TabsTrigger value="jogadores" className="gap-2">
            <Users className="h-4 w-4" /> Jogadores
          </TabsTrigger>
        </TabsList>

        {/* ─────────────── ABA SORTEAR ─────────────── */}
        <TabsContent value="sortear" className="mt-6 space-y-6">
          {jogadores.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center">
              <Users className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">
                Nenhum jogador cadastrado ainda. Vá para a aba{" "}
                <strong className="text-foreground">Jogadores</strong> para
                começar.
              </p>
            </div>
          ) : (
            <>
              {/* Configuração */}
              <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <Label htmlFor="numTimes">Número de times</Label>
                    <Input
                      id="numTimes"
                      type="number"
                      min={2}
                      max={Math.max(timesPossiveis, 2)}
                      value={numTimes}
                      onChange={(e) => setNumTimes(parseInt(e.target.value) || 2)}
                      className="mt-1 w-28"
                    />
                  </div>
                  <div className="flex-1 text-sm text-muted-foreground">
                    <p>
                      <strong className="text-foreground">
                        {jogadoresPresentes.length}
                      </strong>{" "}
                      presente(s) — {goleirosPresentes.length} goleiro(s) e{" "}
                      {linhaPresentes.length} de linha
                    </p>
                    <p className="mt-0.5">
                      Times de {TAMANHO_TIME} na linha (goleiro à parte) →{" "}
                      <strong className="text-foreground">
                        {capacidades.join(" + ")}
                      </strong>
                      {linhaPresentes.length > numTimes * TAMANHO_TIME && (
                        <>
                          {" "}
                          e{" "}
                          {linhaPresentes.length - numTimes * TAMANHO_TIME} de
                          fora
                        </>
                      )}
                    </p>
                  </div>
                  <Button onClick={sortear} className="gap-2">
                    <Shuffle className="h-4 w-4" />
                    {resultado ? "Sortear novamente" : "Sortear times"}
                  </Button>
                </div>

                {/* Goleiros fixos por time */}
                {goleirosPresentes.length > 0 && (
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Hand className="h-4 w-4 text-primary" /> Goleiros fixos
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {goleirosPresentes.map((g) => (
                        <div
                          key={g.id}
                          className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
                        >
                          <span className="text-sm text-foreground">{g.nome}</span>
                          <select
                            value={goleiroPorTime[g.id] ?? ""}
                            onChange={(e) =>
                              setGoleiroPorTime((p) => ({
                                ...p,
                                [g.id]:
                                  e.target.value === ""
                                    ? -1
                                    : parseInt(e.target.value),
                              }))
                            }
                            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                          >
                            <option value="">Sem time fixo</option>
                            {Array.from({ length: numTimes }, (_, i) => (
                              <option key={i} value={i}>
                                Time {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Presença */}
              <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    Quem vai jogar hoje?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => marcarTodos(true)}
                    >
                      Todos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => marcarTodos(false)}
                    >
                      Nenhum
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {jogadores.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => togglePresenca(j.id)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        !ausentes[j.id]
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-muted/30 opacity-60"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                          !ausentes[j.id]
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {!ausentes[j.id] ? <Check className="h-3.5 w-3.5" /> : null}
                      </span>
                      <span className="flex-1 truncate text-foreground">
                        {j.nome}
                      </span>
                      {j.goleiro && (
                        <Hand className="h-3.5 w-3.5 text-primary" />
                      )}
                      <Badge variant="secondary" className="shrink-0">
                        {j.nota}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resultado */}
              {resultado && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {resultado.map((time, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border/70 bg-card/80"
                    >
                      <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl tracking-wide text-primary">
                            TIME {i + 1}
                          </h3>
                          <Badge
                            variant={
                              vagasLivres(time) > 0 ? "outline" : "secondary"
                            }
                          >
                            {vagasLivres(time) > 0
                              ? `${jogadoresDeLinha(time)}/${TAMANHO_TIME} — falta ${vagasLivres(time)}`
                              : `${TAMANHO_TIME}/${TAMANHO_TIME}`}
                          </Badge>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p>
                            Média{" "}
                            <span className="font-semibold text-foreground">
                              {mediaTime(time).toFixed(2)}
                            </span>
                          </p>
                          <p>Produto {formatarProduto(time.produto)}</p>
                        </div>
                      </div>
                      <ul className="divide-y divide-border">
                        {time.jogadores.map((j) => (
                          <li
                            key={j.id}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm"
                          >
                            {j.goleiro ? (
                              <Hand className="h-4 w-4 text-primary" />
                            ) : (
                              <Star className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="flex-1 text-foreground">
                              {j.nome}
                            </span>
                            <Badge variant="secondary">{j.nota}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Fora dos times */}
              {resultado && reservas.length > 0 && (
                <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
                  <p className="mb-3 text-sm font-medium text-foreground">
                    Fora dos times ({reservas.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {reservas.map((j) => (
                      <Badge key={j.id} variant="outline" className="gap-1.5">
                        {j.nome}
                        <span className="text-muted-foreground">{j.nota}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* ─────────────── ABA JOGADORES ─────────────── */}
        <TabsContent value="jogadores" className="mt-6 space-y-6">
          {/* Formulário */}
          <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
            <p className="mb-4 text-sm font-medium text-foreground">
              {editandoId ? "Editar jogador" : "Cadastrar jogador"}
            </p>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[180px]">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && salvarJogador()}
                  placeholder="Nome do jogador"
                  className="mt-1"
                />
              </div>
              <div className="w-28">
                <Label htmlFor="nota">Nota (1-10)</Label>
                <Input
                  id="nota"
                  type="number"
                  min={1}
                  max={10}
                  step={0.5}
                  list="notas-sugeridas"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && salvarJogador()}
                  placeholder="5"
                  className="mt-1"
                />
                <datalist id="notas-sugeridas">
                  {notasSugeridas.map((n) => (
                    <option key={n} value={n} />
                  ))}
                </datalist>
              </div>
              <label className="flex cursor-pointer items-center gap-2 pb-2.5 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={ehGoleiro}
                  onChange={(e) => setEhGoleiro(e.target.checked)}
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                />
                <Hand className="h-4 w-4 text-primary" /> Goleiro
              </label>
              <Button onClick={salvarJogador} className="gap-2">
                {editandoId ? (
                  <>
                    <Check className="h-4 w-4" /> Salvar
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Adicionar
                  </>
                )}
              </Button>
              {editandoId && (
                <Button variant="ghost" onClick={limparForm} className="gap-2">
                  <X className="h-4 w-4" /> Cancelar
                </Button>
              )}
            </div>
          </div>

          {/* Lista */}
          <div className="rounded-2xl border border-border/70 bg-card/80">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-medium text-foreground">
                Jogadores cadastrados ({jogadores.length})
              </p>
              <div className="flex flex-wrap justify-end gap-2">
                {legados.length > 0 && (
                  <Button variant="outline" size="sm" onClick={importarDoNavegador}>
                    <Download /> Importar do navegador ({legados.length})
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={importarMensalistas}>
                  <Download /> Importar mensalistas
                </Button>
              </div>
            </div>

            {jogadores.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                Nenhum jogador cadastrado. Adicione acima ou importe os
                mensalistas.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">
                      Nome
                    </th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">
                      Nota
                    </th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">
                      Posição
                    </th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {[...jogadores]
                    .sort((a, b) => b.nota - a.nota)
                    .map((j) => (
                      <tr
                        key={j.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-2.5 text-foreground">{j.nome}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant="secondary">{j.nota}</Badge>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {j.goleiro ? (
                            <span className="inline-flex items-center gap-1.5 text-primary">
                              <Hand className="h-4 w-4" /> Goleiro
                            </span>
                          ) : (
                            "Linha"
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => editar(j)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => remover(j)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
