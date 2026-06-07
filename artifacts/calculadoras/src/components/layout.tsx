import React from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CATEGORIES,
  getCalculatorsByCategory,
  calcPath,
  enCalcPath,
  EN_CATEGORY_SLUGS,
} from "@/lib/calculators";
import { useLocale } from "@/lib/locale";

export function Layout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const [location] = useLocation();
  const isEn = locale === "en";

  // Language toggle: swap between /en and /
  const langToggleHref = isEn ? "/" : "/en";

  const footerDesc = isEn
    ? "Free tools for finance, home, work, education and health."
    : "Herramientas gratuitas para finanzas, hogar, trabajo, educación y productividad.";

  const homeHref = isEn ? "/en" : "/";
  const homeLabel = isEn ? "Home" : "Inicio";
  const siteTitle = isEn ? "Online Calculators" : "Simuladores y Calculadoras";
  const copyright = isEn
    ? `© ${new Date().getFullYear()} Online Calculators. All rights reserved.`
    : `© ${new Date().getFullYear()} Simuladores y Calculadoras Online. Todos los derechos reservados.`;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 no-print">
        <div className="container mx-auto px-4 h-16 grid grid-cols-3 items-center">
          <div />
          <Link href={homeHref} className="flex items-center justify-center gap-2">
            <img src="/favicon.svg" alt="Logo" className="h-9 w-9" />
            <span className="hidden sm:inline-block font-semibold text-lg tracking-tight text-gray-900 dark:text-gray-100">
              {siteTitle}
            </span>
          </Link>
          <div className="flex items-center justify-end gap-3">
            <nav className="hidden md:flex gap-6">
              <Link
                href={homeHref}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary"
              >
                {homeLabel}
              </Link>
            </nav>
            {/* Language toggle */}
            <Link
              href={langToggleHref}
              className="text-xs font-semibold px-2 py-1 rounded border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary transition-colors"
            >
              {isEn ? "ES" : "EN"}
            </Link>
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
                  {isEn ? "Online Calculators" : "Simuladores Online"}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {footerDesc}
              </p>
              <nav className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const href = isEn
                    ? `/en/calculators/${EN_CATEGORY_SLUGS[cat.id]}`
                    : `/calculadoras/${cat.id}`;
                  return (
                    <Link
                      key={cat.id}
                      href={href}
                      className="text-xs text-gray-400 hover:text-primary transition-colors"
                    >
                      {isEn ? cat.enName : cat.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {CATEGORIES.map((cat) => {
              const catHref = isEn
                ? `/en/calculators/${EN_CATEGORY_SLUGS[cat.id]}`
                : `/calculadoras/${cat.id}`;
              return (
                <div key={cat.id}>
                  <Link href={catHref}>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 hover:text-primary transition-colors cursor-pointer">
                      {isEn ? cat.enName : cat.name}
                    </h3>
                  </Link>
                  <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    {getCalculatorsByCategory(cat.id).map((calc) => (
                      <li key={calc.slug}>
                        <Link
                          href={isEn ? enCalcPath(calc) : calcPath(calc)}
                          className="hover:text-primary transition-colors"
                        >
                          {isEn ? calc.enShortLabel : calc.shortLabel}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 text-center text-sm text-gray-500">
            {copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
