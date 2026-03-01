import { infoJogo } from "@/data/mockData";
import { MapPin, Clock, DollarSign, Users } from "lucide-react";

const cards = [
  {
    icon: MapPin,
    label: "Local",
    value: infoJogo.local,
  },
  {
    icon: Clock,
    label: "Horário",
    value: infoJogo.horario,
  },
  {
    icon: DollarSign,
    label: "Valor Mensal",
    value: `R$ ${infoJogo.valor.toFixed(2).replace(".", ",")}`,
  },
  {
    icon: Users,
    label: "Vagas",
    value: `${infoJogo.vagas} mensalistas`,
  },
];

export default function Dashboard() {
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
    </div>
  );
}
