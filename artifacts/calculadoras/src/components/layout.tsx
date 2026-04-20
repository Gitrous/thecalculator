import React from "react";
import { Link } from "wouter";
import { Calculator } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-gray-900 dark:text-gray-100">
              Simuladores y Calculadoras
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Inicio
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-primary" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Simuladores Online
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Herramientas profesionales y gratuitas para finanzas, física, hogar y productividad.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Finanzas</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/calculadoras/hipoteca-avanzada" className="hover:text-primary">Hipoteca Avanzada</Link></li>
                <li><Link href="/calculadoras/irpf" className="hover:text-primary">Calculadora IRPF</Link></li>
                <li><Link href="/calculadoras/interes-compuesto" className="hover:text-primary">Interés Compuesto</Link></li>
                <li><Link href="/calculadoras/alquiler-vs-compra" className="hover:text-primary">Alquiler vs Compra</Link></li>
                <li><Link href="/calculadoras/salario-neto" className="hover:text-primary">Salario Neto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Hogar & Trabajo</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/calculadoras/gasto-coche" className="hover:text-primary">Gasto de Coche</Link></li>
                <li><Link href="/calculadoras/consumo-electrico" className="hover:text-primary">Consumo Eléctrico</Link></li>
                <li><Link href="/calculadoras/horas-trabajadas" className="hover:text-primary">Horas Trabajadas</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Ciencia & Utilidades</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/calculadoras/mru" className="hover:text-primary">MRU</Link></li>
                <li><Link href="/calculadoras/mrua" className="hover:text-primary">MRUA</Link></li>
                <li><Link href="/calculadoras/conversor-unidades" className="hover:text-primary">Conversor de Unidades</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Simuladores y Calculadoras Online. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
