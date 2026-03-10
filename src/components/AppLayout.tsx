import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ScrollText,
  MapPin,
  CreditCard,
  Users,
  AlertCircle,
  Skull,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Início", icon: LayoutDashboard },
  { to: "/regras", label: "Regras", icon: ScrollText },
  { to: "/jogo", label: "Futebol", icon: MapPin },
  { to: "/pagamento", label: "Pagamento", icon: CreditCard },
  { to: "/mensalistas", label: "Mensalistas", icon: Users },
  { to: "/observacoes", label: "Observações", icon: AlertCircle },
  { to: "/ranking", label: "Ranking da Vergonha", icon: Skull },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        {/* Container da Logo */}
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
          <img 
            src="logo-site.png" 
            alt="Logo Camaradas Caneludos"
            className="h-full w-full object-cover" 
          />
        </div>

        {/* Texto ao lado */}
        <div>
          <h1 className="font-display text-xl leading-tight tracking-wider text-primary">
            CAMARADAS
          </h1>
          <p className="text-xs text-sidebar-foreground/60">CANELUDOS</p>
        </div>
      </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-xs text-sidebar-foreground/40">
            © 2026 Camaradas Caneludos
          </p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-foreground hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg tracking-wider text-primary">CAMARADAS CANELUDOS</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
