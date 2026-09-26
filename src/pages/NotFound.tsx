import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="rise py-16">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Erro 404</p>
      <h1 className="mt-2 text-7xl">Bola fora</h1>
      <p className="mt-3 text-muted-foreground">Essa página não existe.</p>
      <Link to="/" className="mt-6 inline-block text-primary underline-offset-4 hover:underline">
        Voltar para o início
      </Link>
    </div>
  );
}
