import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

// Pages
import Home from "@/pages/home";
import HipotecaAvanzada from "@/pages/hipoteca-avanzada";
import IRPF from "@/pages/irpf";
import InteresCompuesto from "@/pages/interes-compuesto";
import AlquilerVsCompra from "@/pages/alquiler-vs-compra";
import SalarioNeto from "@/pages/salario-neto";
import GastoCoche from "@/pages/gasto-coche";
import ConsumoElectrico from "@/pages/consumo-electrico";
import HorasTrabajadas from "@/pages/horas-trabajadas";
import MRU from "@/pages/mru";
import MRUA from "@/pages/mrua";
import ConversorUnidades from "@/pages/conversor-unidades";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/calculadoras/hipoteca-avanzada" component={HipotecaAvanzada} />
      <Route path="/calculadoras/irpf" component={IRPF} />
      <Route path="/calculadoras/interes-compuesto" component={InteresCompuesto} />
      <Route path="/calculadoras/alquiler-vs-compra" component={AlquilerVsCompra} />
      <Route path="/calculadoras/salario-neto" component={SalarioNeto} />
      <Route path="/calculadoras/gasto-coche" component={GastoCoche} />
      <Route path="/calculadoras/consumo-electrico" component={ConsumoElectrico} />
      <Route path="/calculadoras/horas-trabajadas" component={HorasTrabajadas} />
      <Route path="/calculadoras/mru" component={MRU} />
      <Route path="/calculadoras/mrua" component={MRUA} />
      <Route path="/calculadoras/conversor-unidades" component={ConversorUnidades} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
