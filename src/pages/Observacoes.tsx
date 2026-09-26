import { ListaTextos, PageHeader, painel } from "@/components/Editaveis";

export default function Observacoes() {
  return (
    <>
      <PageHeader kicker="Bom saber" titulo="Observações">
        Informações importantes sobre o mensal.
      </PageHeader>
      <section className={`${painel} rise max-w-3xl`}>
        <ListaTextos secao="observacao" />
      </section>
    </>
  );
}
