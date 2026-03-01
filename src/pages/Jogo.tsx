import { infoJogo } from "@/data/mockData";
import { MapPin, Clock, AlertCircle } from "lucide-react";

export default function Jogo() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wider text-primary">
          INFORMAÇÕES DO FUTEBOL
        </h1>
        <p className="mt-1 text-muted-foreground">
          Tudo sobre o nosso mensal.
        </p>
      </div>

      <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
          <MapPin className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Local</p>
            <p className="text-lg font-semibold text-foreground">{infoJogo.local}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
          <Clock className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Horário</p>
            <p className="text-lg font-semibold text-foreground">{infoJogo.horario}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Observações</p>
            <ul className="mt-2 space-y-1">
              {infoJogo.observacoes.map((obs, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {obs}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
