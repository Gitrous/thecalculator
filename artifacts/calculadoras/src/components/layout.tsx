import React from "react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CATEGORIES,
  getCalculatorsByCategory,
  calcPath,
} from "@/lib/calculators";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 no-print">
        <div className="container mx-auto px-4 h-16 grid grid-cols-3 items-center">
          <div />
          <Link href="/" className="flex items-center justify-center gap-2">
            <img src="/favicon.svg" alt="Logo" className="h-9 w-9" />
            <span className="font-semibold text-lg tracking-tight text-gray-900 dark:text-gray-100">
              Simuladores y Calculadoras
            </span>
          </Link>
          <div className="flex items-center justify-end gap-3">
            <nav className="hidden md:flex gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary"
              >
                Inicio
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 py-12 mt-auto no-print">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/favicon.svg" alt="Logo" className="h-6 w-6" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Simuladores Online
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Herramientas gratuitas para finanzas, hogar, trabajo, educación
                y productividad.
              </p>
              <nav className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/calculadoras/${cat.id}`}
                    className="text-xs text-gray-400 hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>

            {CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <Link href={`/calculadoras/${cat.id}`}>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 hover:text-primary transition-colors cursor-pointer">
                    {cat.name}
                  </h3>
                </Link>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  {getCalculatorsByCategory(cat.id).map((calc) => (
                    <li key={calc.slug}>
                      <Link
                        href={calcPath(calc)}
                        className="hover:text-primary transition-colors"
                      >
                        {calc.shortLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Simuladores y Calculadoras Online.
            Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
