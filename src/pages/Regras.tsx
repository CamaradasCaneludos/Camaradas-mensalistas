import { ListaTextos, PageHeader, painel } from "@/components/Editaveis";

export default function Regras() {
  return (
    <>
      <PageHeader kicker="Regulamento" titulo="Regras do mensal">
        Leia com atenção e respeite as regras pra manter tudo organizado.
      </PageHeader>
      <section className={`${painel} rise max-w-3xl`}>
        <ListaTextos secao="regra" numerada />
      </section>
    </>
  );
}
