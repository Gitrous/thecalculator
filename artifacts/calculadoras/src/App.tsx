import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import Category from "@/pages/category";
import CalculatorPage from "@/pages/calculator-page";

const queryClient = new QueryClient();

// Old flat URLs → new category-based URLs (301-style client redirects).
const LEGACY_REDIRECTS: Record<string, string> = {
  "hipoteca-avanzada": "/calculadoras/finanzas/hipoteca",
  irpf: "/calculadoras/finanzas/irpf",
  "interes-compuesto": "/calculadoras/finanzas/interes-compuesto",
  "alquiler-vs-compra": "/calculadoras/finanzas/alquiler-vs-compra",
  "salario-neto": "/calculadoras/finanzas/salario-neto",
  "gasto-coche": "/calculadoras/hogar/gasto-coche",
  "consumo-electrico": "/calculadoras/hogar/consumo-electrico",
  "horas-trabajadas": "/calculadoras/trabajo/horas-trabajadas",
  mru: "/calculadoras/educacion/mru",
  mrua: "/calculadoras/educacion/mrua",
  "conversor-unidades": "/calculadoras/educacion/conversor-unidades",
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
        <Route key={from} path={`/calculadoras/${from}`}>
          <Redirect to={to} replace />
        </Route>
      ))}

      <Route path="/calculadoras/:categoria/:slug" component={CalculatorPage} />
      <Route path="/calculadoras/:categoria" component={Category} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout>
              <Router />
            </Layout>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
