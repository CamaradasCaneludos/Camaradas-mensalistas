import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { painel } from "@/components/Editaveis";
import { supabase, useSession } from "@/lib/supabase";

export default function Login() {
  const session = useSession();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (session) return <Navigate to={location.state?.de ?? "/"} replace />;

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setEnviando(false);
    if (error) setErro("E-mail ou senha incorretos.");
  }

  return (
    <div className="rise mx-auto max-w-sm pt-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Área da organização</p>
      <h1 className="mt-2 text-5xl">Entrar</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Acesso para quem cuida do mensal: sorteador de times e edição do site.
      </p>

      <form onSubmit={entrar} className={`${painel} mt-8 space-y-4`}>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="senha">Senha</Label>
          <Input
            id="senha"
            type="password"
            autoComplete="current-password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        {erro && (
          <p role="alert" className="text-sm text-primary">
            {erro}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={enviando}>
          <LogIn /> {enviando ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
