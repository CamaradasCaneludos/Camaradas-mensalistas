import { infoJogo, rankingVergonha } from "@/data/mockData";
import { MapPin, Clock, DollarSign, Users, Skull, Flame, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const cards = [
  { icon: MapPin, label: "Local", value: infoJogo.local },
  { icon: Clock, label: "Horário", value: infoJogo.horario },
  { icon: DollarSign, label: "Valor Mensal", value: `R$ ${infoJogo.valor.toFixed(2).replace(".", ",")}` },
  { icon: Users, label: "Vagas", value: `${infoJogo.vagas} mensalistas` },
];

export default function Dashboard() {
  const topFaltoso = [...rankingVergonha].sort((a, b) => b.faltas - a.faltas)[0];
  const topInitials = topFaltoso.nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Ranking da Vergonha */}
        <Link
          to="/ranking"
          className="group relative flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
        >
          <div className="absolute right-4 top-4">
            <Crown className="h-5 w-5 text-primary opacity-60 transition-opacity group-hover:opacity-100" />
          </div>
          
          <Avatar className="h-20 w-20 ring-2 ring-primary/40 transition-all group-hover:ring-primary">
            <AvatarImage src={topFaltoso.foto} alt={topFaltoso.nome} className="object-cover" />
            
            <AvatarFallback className="bg-primary/20 font-display text-2xl text-primary">
              {topInitials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-display text-xl tracking-wide text-primary">
                RANKING DA VERGONHA
              </h2>
            </div>
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
      </div>
    </div>
  );
}
