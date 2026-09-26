import { AlertTriangle, Building, Clock, Copy, DollarSign, Key, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CampoConfig, ListaTextos, PageHeader, painel, reais } from "@/components/Editaveis";
import { ListaMensalistas } from "@/components/ListaMensalistas";
import { enviarFoto, supabase, useConfig, useMutar, useSession } from "@/lib/supabase";

export default function Pagamentos() {
  const session = useSession();
  const { data: config } = useConfig();
  const mutar = useMutar("config");

  async function trocarQr(file?: File) {
    if (!file) return;
    try {
      const url = await enviarFoto(file);
      await mutar(supabase.from("config").update({ pix_qr_url: url }).eq("id", 1), "QR code atualizado.");
    } catch {
      toast.error("Não foi possível enviar a imagem.");
    }
  }

  async function copiarChave() {
    if (!config) return;
    await navigator.clipboard.writeText(config.pix_chave);
    toast.success("Chave PIX copiada.");
  }

  return (
    <>
      <PageHeader kicker="Mensalidade" titulo="Pagamento">
        Como pagar a mensalidade do futebol.
      </PageHeader>

      <div className="rise grid gap-4 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <section className={`${painel} flex flex-col items-center gap-4 text-center`}>
          <h2 className="text-2xl">QR code PIX</h2>
          <div className="w-full max-w-[15rem] rounded-xl bg-white p-3">
            {config?.pix_qr_url ? (
              <img src={config.pix_qr_url} alt="QR code para pagamento via PIX" className="w-full" />
            ) : (
              <Skeleton className="aspect-square w-full bg-neutral-200" />
            )}
          </div>
          <Button variant="secondary" className="w-full" onClick={copiarChave} disabled={!config}>
            <Copy /> Copiar chave PIX
          </Button>
          {session && (
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Upload className="h-4 w-4" /> Trocar imagem do QR
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => trocarQr(e.target.files?.[0])} />
            </label>
          )}
        </section>

        <div className="grid content-start gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <CampoConfig campo="valor" label="Valor" icon={DollarSign} formatar={reais} />
            <CampoConfig campo="pix_chave" label="Chave PIX" icon={Key} />
            <CampoConfig campo="pix_banco" label="Banco" icon={Building} />
            <CampoConfig campo="pix_titular" label="Titular" icon={User} />
            <CampoConfig campo="pix_prazo" label="Prazo" icon={Clock} className="sm:col-span-2" />
          </div>

          <section className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-5 md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-2xl text-primary">
              <AlertTriangle className="h-5 w-5" /> Atenção
            </h2>
            <ListaTextos secao="pagamento" />
          </section>
        </div>
      </div>

      <section className="rise mt-12 max-w-3xl">
        <h2 className="mb-4 text-3xl">Quem já pagou</h2>
        <ListaMensalistas />
      </section>
    </>
  );
}
