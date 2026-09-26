import { Clock, MapPin } from "lucide-react";
import { CampoConfig, ListaTextos, PageHeader, painel } from "@/components/Editaveis";

export default function Jogo() {
  return (
    <>
      <PageHeader kicker="Onde e quando" titulo="Informações do futebol">
        Tudo sobre o nosso mensal.
      </PageHeader>

      <div className="rise grid max-w-3xl gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <CampoConfig campo="local" label="Local" icon={MapPin} />
          <CampoConfig campo="horario" label="Horário" icon={Clock} />
        </div>
        <section className={painel}>
          <h2 className="mb-4 text-2xl">Combinados do dia</h2>
          <ListaTextos secao="jogo" />
        </section>
      </div>
    </>
  );
}
