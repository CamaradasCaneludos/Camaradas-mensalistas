import { rankingVergonha } from "@/data/mockData";
import { Trophy, Flame, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Ranking() {
  const sorted = [...rankingVergonha].sort((a, b) => b.faltas - a.faltas);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wider text-primary">
          RANKING DA VERGONHA
        </h1>
      </div>

      <div className="space-y-3">
        {sorted.map((p, i) => {
          const isFirst = i === 0;
          const initials = p.nome
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <div
              key={p.nome}
              className={`flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-colors ${
                isFirst
                  ? "border-primary/50 bg-primary/5"
                  : "border-primary/20"
              }`}
            >
              {/* Position */}
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-lg ${
                  isFirst
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>

              {/* Avatar */}
              <Avatar className="h-10 w-10 shrink-0">
                {/* A propriedade 'foto' do seu mock vai aqui no src */}
                <AvatarImage src={p.foto} alt={p.nome} className="object-cover" />
                
                <AvatarFallback
                  className={`text-sm font-bold ${
                    isFirst
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Name */}
              <span className="flex-1 text-sm font-medium text-foreground">
                {p.nome}
                {isFirst && (
                  <Crown className="ml-2 inline h-4 w-4 text-primary" />
                )}
              </span>

              {/* Score */}
              <span className="font-display text-xl tracking-wide text-primary">
                {p.faltas}
              </span>
              <span className="text-xs text-muted-foreground">
                {p.faltas === 1 ? "falta" : "faltas"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-primary/20 bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 text-primary" />
          <span>
            Ranking atualizado manualmente. Não falte pra não subir no ranking!
          </span>
        </div>
      </div>
    </div>
  );
}
