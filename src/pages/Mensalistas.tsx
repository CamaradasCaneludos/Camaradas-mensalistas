import { mensalistas } from "@/data/mockData";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Mensalistas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wider text-primary">MENSALISTAS</h1>
        <p className="mt-1 text-muted-foreground">
          Lista de mensalistas e status de pagamento.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-primary/20 bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Nome</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {mensalistas.map((m, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 text-foreground">{m.nome}</td>
                <td className="px-4 py-3">
                  {m.status === "em_dia" ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> Em dia
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      <XCircle className="h-4 w-4" /> Pendente
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
