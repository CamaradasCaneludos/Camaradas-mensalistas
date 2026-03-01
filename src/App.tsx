import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// TROQUE BrowserRouter por HashRouter aqui:
import { HashRouter, Routes, Route, BrowserRouter } from "react-router-dom"; 
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Regras from "./pages/Regras";
import Jogo from "./pages/Jogo";
import Pagamentos from "./pages/Pagamentos";
import Mensalistas from "./pages/Mensalistas";
import Observacoes from "./pages/Observacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Adicione o basename aqui apontando para o nome do repo */}
      <BrowserRouter basename="/Camaradas-mensalistas">
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/regras" element={<Regras />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/regras" element={<Regras />} />
            <Route path="/jogo" element={<Jogo />} />
            <Route path="/pagamento" element={<Pagamentos />} />
            <Route path="/mensalistas" element={<Mensalistas />} />
            <Route path="/observacoes" element={<Observacoes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;