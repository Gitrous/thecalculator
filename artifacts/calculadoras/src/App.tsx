import { Switch, Route, Redirect, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import { LocaleContext, type Locale } from "@/lib/locale";

import Home from "@/pages/home";
import Category from "@/pages/category";
import CalculatorPage from "@/pages/calculator-page";
import Privacidad from "@/pages/privacidad";
import Cookies from "@/pages/cookies";
import AvisoLegal from "@/pages/aviso-legal";
import Contacto from "@/pages/contacto";
import Blog from "@/pages/blog";
import BlogArticle from "@/pages/blog-article";

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
  const [location] = useLocation();
  const locale: Locale = location.startsWith("/en") ? "en" : "es";

  return (
    <LocaleContext.Provider value={locale}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/en" component={Home} />

          {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
            <Route key={from} path={`/calculadoras/${from}`}>
              <Redirect to={to} replace />
            </Route>
          ))}

          {/* Páginas legales (ES / EN) */}
          <Route path="/privacidad" component={Privacidad} />
          <Route path="/en/privacy" component={Privacidad} />
          <Route path="/cookies" component={Cookies} />
          <Route path="/en/cookies" component={Cookies} />
          <Route path="/aviso-legal" component={AvisoLegal} />
          <Route path="/en/legal-notice" component={AvisoLegal} />
          <Route path="/contacto" component={Contacto} />
          <Route path="/en/contact" component={Contacto} />

          <Route path="/blog" component={Blog} />
          <Route path="/en/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogArticle} />
          <Route path="/en/blog/:slug" component={BlogArticle} />

          <Route path="/calculadoras/:categoria/:slug" component={CalculatorPage} />
          <Route path="/calculadoras/:categoria" component={Category} />
          <Route path="/en/calculators/:categoria/:slug" component={CalculatorPage} />
          <Route path="/en/calculators/:categoria" component={Category} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </LocaleContext.Provider>
  );
}

function App({ ssrPath }: { ssrPath?: string } = {}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")} ssrPath={ssrPath}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
