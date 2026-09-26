import { Link, NavLink } from "react-router-dom";
import { Lock, LogIn, LogOut } from "lucide-react";
import { supabase, useSession } from "@/lib/supabase";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/jogo", label: "Futebol" },
  { to: "/regras", label: "Regras" },
  { to: "/mensalistas", label: "Mensalistas" },
  { to: "/pagamento", label: "Pagamento" },
  { to: "/ranking", label: "Mural da vergonha" },
  { to: "/observacoes", label: "Observações" },
  { to: "/sorteador", label: "Sorteador", privado: true },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();

  const links = navItems.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end
      className={({ isActive }) =>
        `inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
          isActive
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
        }`
      }
    >
      {item.label}
      {item.privado && !session && <Lock className="h-3 w-3 opacity-60" />}
    </NavLink>
  ));

  return (
    <div className="flex min-h-dvh flex-col">
      <button
        onClick={() => document.getElementById("conteudo")?.focus()}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </button>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src={`${import.meta.env.BASE_URL}logo-site.png`}
              alt="Escudo Camaradas Caneludos"
              className="h-9 w-9 rounded-lg object-cover"
            />
            <span className="font-display text-xl leading-none tracking-wider">
              CAMARADAS <span className="text-primary">CANELUDOS</span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-0.5 lg:flex">{links}</nav>

          <div className="ml-auto lg:ml-0">
            {session ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/60"
              >
                <LogIn className="h-4 w-4" /> Entrar
              </Link>
            )}
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-4 pb-2.5 [scrollbar-width:none] lg:hidden">
          {links}
        </nav>
      </header>

      <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 outline-none md:py-14">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 pt-4 text-xs text-muted-foreground">
        © 2026 Camaradas Caneludos · domingo é sagrado
      </footer>
    </div>
  );
}
