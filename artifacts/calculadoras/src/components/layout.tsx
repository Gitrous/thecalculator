import React from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { CookieConsent } from "@/components/cookie-consent";
import {
  CATEGORIES,
  getCalculatorsByCategory,
  calcPath,
  enCalcPath,
  localeSwitchPath,
  EN_CATEGORY_SLUGS,
} from "@/lib/calculators";
import { useLocale } from "@/lib/locale";

export function Layout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const [location] = useLocation();
  const isEn = locale === "en";

  // Language toggle: stay on the equivalent page in the other locale
  const langToggleHref = localeSwitchPath(location, isEn);

  const footerDesc = isEn
    ? "Free tools for finance, home, work, education and health."
    : "Herramientas gratuitas para finanzas, hogar, trabajo, educación y productividad.";

  const homeHref = isEn ? "/en" : "/";
  const homeLabel = isEn ? "Home" : "Inicio";
  const siteTitle = "thecalculator.tech";
  const copyright = isEn
    ? `© ${new Date().getFullYear()} thecalculator.tech. All rights reserved.`
    : `© ${new Date().getFullYear()} thecalculator.tech. Todos los derechos reservados.`;

  const legalLinks = isEn
    ? [
        { href: "/en/privacy", label: "Privacy Policy" },
        { href: "/en/cookies", label: "Cookie Policy" },
        { href: "/en/legal-notice", label: "Legal Notice" },
        { href: "/en/contact", label: "Contact" },
      ]
    : [
        { href: "/privacidad", label: "Privacidad" },
        { href: "/cookies", label: "Cookies" },
        { href: "/aviso-legal", label: "Aviso legal" },
        { href: "/contacto", label: "Contacto" },
      ];

  return (
    <div className="min-h-[100dvh] flex flex-col mesh-bg">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 dark:bg-black/20 border-gray-200 dark:border-white/10 backdrop-blur-md no-print">
        <div className="container mx-auto px-4 h-16 grid grid-cols-3 items-center">
          <div />
          <Link href={homeHref} className="flex items-center justify-center gap-2">
            <img src="/favicon.svg" alt="Logo" className="h-9 w-9" />
            <span className="hidden sm:inline-block font-semibold text-lg tracking-tight text-gray-900 dark:text-white">
              {siteTitle}
            </span>
          </Link>
          <div className="flex items-center justify-end gap-3">
            {/* Language toggle */}
            <Link
              href={langToggleHref}
              className="text-xs font-semibold px-2 py-1 rounded border border-gray-200 dark:border-white/20 text-gray-600 dark:text-white/70 hover:text-primary dark:hover:text-white hover:border-primary dark:hover:border-white/40 transition-colors"
            >
              {isEn ? "ES" : "EN"}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white dark:bg-black/40 border-t border-gray-200 dark:border-white/5 py-12 mt-auto no-print">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/favicon.svg" alt="Logo" className="h-6 w-6" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  thecalculator.tech
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
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="text-center text-sm text-gray-500">{copyright}</p>
          </div>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
}
