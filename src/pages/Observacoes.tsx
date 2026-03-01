import { observacoes } from "@/data/mockData";
import { AlertCircle } from "lucide-react";

export default function Observacoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wider text-primary">OBSERVAÇÕES</h1>
        <p className="mt-1 text-muted-foreground">
          Informações importantes sobre o mensal.
        </p>
      </div>

      <div className="space-y-3">
        {observacoes.map((obs, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-primary/20 bg-card p-5 shadow-sm"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">{obs}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
