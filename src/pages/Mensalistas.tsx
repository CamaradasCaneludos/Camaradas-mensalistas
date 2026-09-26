import { PageHeader } from "@/components/Editaveis";
import { ListaMensalistas } from "@/components/ListaMensalistas";

export default function Mensalistas() {
  return (
    <>
      <PageHeader kicker="Elenco" titulo="Mensalistas">
        Quem joga todo domingo e como está o pagamento do mês.
      </PageHeader>
      <div className="rise max-w-3xl">
        <ListaMensalistas />
      </div>
    </>
  );
}
