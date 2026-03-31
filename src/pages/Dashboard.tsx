import { infoJogo, rankingVergonha, caixaAtual } from "@/data/mockData";
import { MapPin, Clock, DollarSign, Users, Flame, Crown, Wallet, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const cards = [
  { icon: MapPin, label: "Local", value: infoJogo.local },
  { icon: Clock, label: "Horário", value: infoJogo.horario },
  { icon: DollarSign, label: "Valor Mensal", value: `R$ ${infoJogo.valor.toFixed(2).replace(".", ",")}` },
  { icon: Users, label: "Vagas", value: `${infoJogo.vagas} mensalistas` },
];

function getInitials(nome: string) {
  return nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function Dashboard() {
  const sorted = [...rankingVergonha].sort((a, b) => b.faltas - a.faltas);
  const [top, ...rest] = sorted;
  const runners = rest.slice(0, 2);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-5xl tracking-wider text-primary">
          CAMARADAS CANELUDOS
        </h1>
        <p className="mt-2 text-xl text-foreground">Mensal do Futebol</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <card.icon className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            </div>
            <p className="mt-3 font-display text-3xl tracking-wide text-foreground">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Shortcut Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Ranking da Vergonha — com pódio */}
        <Link
          to="/ranking"
          className="group relative flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
        >
          <div className="absolute right-4 top-4">
            <Crown className="h-5 w-5 text-primary opacity-60 transition-opacity group-hover:opacity-100" />
          </div>

          {/* Pódio: runners ao lado do líder */}
          <div className="flex items-end gap-3">
            {/* 2º lugar */}
            {runners[0] && (
              <div className="flex flex-col items-center gap-1 opacity-70">
                <span className="text-xs font-medium text-muted-foreground">2º</span>
                <Avatar className="h-10 w-10 ring-1 ring-border">
                  <AvatarImage src={runners[0].foto} alt={runners[0].nome} className="object-cover" />
                  <AvatarFallback className="bg-muted text-xs font-display text-muted-foreground">
                    {getInitials(runners[0].nome)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[60px] truncate text-[10px] text-muted-foreground">
                  {runners[0].nome.split(" ")[0]}
                </span>
                <span className="text-xs font-display text-primary">{runners[0].faltas}</span>
              </div>
            )}

            {/* 1º lugar */}
            <div className="flex flex-col items-center gap-1">
              <Flame className="h-4 w-4 text-primary animate-pulse" />
              <Avatar className="h-20 w-20 ring-2 ring-primary/40 transition-all group-hover:ring-primary">
                <AvatarImage src={top.foto} alt={top.nome} className="object-cover" />
                <AvatarFallback className="bg-primary/20 font-display text-2xl text-primary">
                  {getInitials(top.nome)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{top.nome.split(" ")[0]}</span>
              <span className="font-display text-lg text-primary">{top.faltas}</span>
            </div>

            {/* 3º lugar */}
            {runners[1] && (
              <div className="flex flex-col items-center gap-1 opacity-70">
                <span className="text-xs font-medium text-muted-foreground">3º</span>
                <Avatar className="h-10 w-10 ring-1 ring-border">
                  <AvatarImage src={runners[1].foto} alt={runners[1].nome} className="object-cover" />
                  <AvatarFallback className="bg-muted text-xs font-display text-muted-foreground">
                    {getInitials(runners[1].nome)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[60px] truncate text-[10px] text-muted-foreground">
                  {runners[1].nome.split(" ")[0]}
                </span>
                <span className="text-xs font-display text-primary">{runners[1].faltas}</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <h2 className="font-display text-xl tracking-wide text-primary">
              MURAL DA VERGONHA
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quem mais faltou no futebol
            </p>
          </div>
        </Link>

        {/* Mensalistas */}
        <Link
          to="/mensalistas"
          className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-primary/20 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/40 transition-all group-hover:ring-primary">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="font-display text-xl tracking-wide text-primary">
              MENSALISTAS
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Lista de participantes e status de pagamento
            </p>
          </div>
        </Link>

        {/* Caixa + Transparência */}
        <Link
          to="/transparencia"
          className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-primary/20 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/40 transition-all group-hover:ring-primary">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          <span className="font-display text-3xl tracking-wide text-primary">
            R$ {caixaAtual.toFixed(2).replace(".", ",")}
          </span>
          <div className="text-center">
            <h2 className="font-display text-xl tracking-wide text-primary">
              CAIXA DO FUTEBOL
            </h2>
            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              Ver Portal da Transparência
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
