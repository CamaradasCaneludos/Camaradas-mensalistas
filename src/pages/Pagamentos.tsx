import { pagamento } from "@/data/mockData";
import { CreditCard, Key, Building, User, DollarSign, Clock, AlertTriangle } from "lucide-react";

const infoItems = [
  { icon: CreditCard, label: "Forma de pagamento", value: pagamento.forma },
  { icon: Key, label: "Chave PIX", value: pagamento.chave },
  { icon: Building, label: "Banco", value: pagamento.banco },
  { icon: User, label: "Titular", value: pagamento.titular },
  { icon: DollarSign, label: "Valor", value: `R$ ${pagamento.valor.toFixed(2).replace(".", ",")}` },
  { icon: Clock, label: "Prazo de pagamento", value: pagamento.prazo },
];

export default function Pagamentos() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-wider text-primary">PAGAMENTO</h1>
        <p className="mt-1 text-muted-foreground">Informações para pagamento da mensalidade.</p>
      </div>

      <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          {infoItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
              <item.icon className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code PIX */}
      <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm flex flex-col items-center gap-3">
        <h2 className="font-display text-xl tracking-wider text-primary">QR CODE PIX</h2>
        <p className="text-sm text-muted-foreground">Escaneie o código abaixo para pagar via PIX</p>
        <div className="rounded-lg bg-white p-3">
          <img src="/pix-qrcode.JPG" alt="QR Code PIX" className="h-48 w-48" />
        </div>
        <p className="text-xs text-muted-foreground">Chave: {pagamento.chave}</p>
      </div>

      {/* Avisos */}
      <div className="rounded-xl border border-primary/40 bg-primary/5 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl tracking-wider text-primary">ATENÇÃO</h2>
        </div>
        <ul className="space-y-2">
          {pagamento.avisos.map((aviso, i) => (
            <li key={i} className="flex items-center gap-2 text-sm font-semibold text-primary">
              <span>⚠️</span> {aviso}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
