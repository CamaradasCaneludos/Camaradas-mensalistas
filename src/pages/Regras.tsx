import { regras } from "@/data/mockData";
import { ScrollText } from "lucide-react";

export default function Regras() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wider text-primary">REGRAS DO MENSAL</h1>
        <p className="mt-1 text-muted-foreground">
          Leia com atenção e respeite as regras pra manter tudo organizado.
        </p>
      </div>

      <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ScrollText className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl tracking-wider text-foreground">REGULAMENTO</h2>
        </div>
        <ul className="space-y-3">
          {regras.map((regra, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
              <span>{regra}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
