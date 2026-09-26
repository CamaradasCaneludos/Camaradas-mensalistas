import { createClient, type PostgrestError, type Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { toast } from "sonner";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export interface Config {
  id: number;
  local: string;
  horario: string;
  valor: number;
  vagas: number;
  pix_chave: string;
  pix_banco: string;
  pix_titular: string;
  pix_prazo: string;
  pix_qr_url: string | null;
}

export type Secao = "regra" | "observacao" | "jogo" | "pagamento";

export interface Texto {
  id: number;
  secao: Secao;
  texto: string;
}

export interface Mensalista {
  id: number;
  nome: string;
  em_dia: boolean;
}

export interface Vergonhoso {
  id: number;
  nome: string;
  faltas: number;
  foto_url: string | null;
}

// Um único listener para o app todo; INITIAL_SESSION dispara logo no início.
let sessao: Session | null | undefined = undefined;
const ouvintes = new Set<() => void>();
supabase.auth.onAuthStateChange((_evento, s) => {
  sessao = s;
  ouvintes.forEach((avisar) => avisar());
});

/** undefined enquanto carrega, null quando deslogado. */
export function useSession() {
  return useSyncExternalStore(
    (avisar) => {
      ouvintes.add(avisar);
      return () => ouvintes.delete(avisar);
    },
    () => sessao,
  );
}

export function useRows<T>(tabela: string, ordem = "id") {
  return useQuery({
    queryKey: [tabela],
    queryFn: async () => {
      const { data, error } = await supabase.from(tabela).select("*").order(ordem);
      if (error) throw error;
      return data as T[];
    },
  });
}

export function useConfig() {
  const q = useRows<Config>("config");
  return { ...q, data: q.data?.[0] };
}

/** Roda uma escrita, avisa o erro e recarrega a tabela. */
export function useMutar(tabela: string) {
  const qc = useQueryClient();
  return async (op: PromiseLike<{ error: PostgrestError | null }>, ok?: string) => {
    const { error } = await op;
    if (error) {
      toast.error(`Não foi possível salvar: ${error.message}`);
      return false;
    }
    await qc.invalidateQueries({ queryKey: [tabela] });
    if (ok) toast.success(ok);
    return true;
  };
}

export async function enviarFoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("fotos").upload(path, file);
  if (error) throw error;
  return supabase.storage.from("fotos").getPublicUrl(path).data.publicUrl;
}
