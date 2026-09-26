import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Regras from "./pages/Regras";
import Jogo from "./pages/Jogo";
import Pagamentos from "./pages/Pagamentos";
import Mensalistas from "./pages/Mensalistas";
import Observacoes from "./pages/Observacoes";
import NotFound from "./pages/NotFound";
import Ranking from "./pages/Ranking";
import Sorteador from "./pages/Sorteador";
import Login from "./pages/Login";
import { useSession } from "./lib/supabase";

const queryClient = new QueryClient();

function SoLogado({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const location = useLocation();
  if (session === undefined) return null;
  if (!session) return <Navigate to="/login" replace state={{ de: location.pathname }} />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster theme="dark" position="top-center" />
      <HashRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/regras" element={<Regras />} />
            <Route path="/jogo" element={<Jogo />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/pagamento" element={<Pagamentos />} />
            <Route path="/mensalistas" element={<Mensalistas />} />
            <Route path="/observacoes" element={<Observacoes />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/sorteador"
              element={
                <SoLogado>
                  <Sorteador />
                </SoLogado>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
