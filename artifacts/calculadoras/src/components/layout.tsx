import React, { useEffect } from "react";
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
import { Mail, ChevronDown, BookOpen } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { ARTICLES } from "@/lib/articles";

export function Layout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const [location] = useLocation();
  const isEn = locale === "en";

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, [location]);

  // Language toggle: stay on the equivalent page in the other locale
  let langToggleHref = localeSwitchPath(location, isEn);

  // Blog routes not handled by localeSwitchPath (would create circular dep)
  if (location === "/blog") {
    langToggleHref = "/en/blog";
  } else if (location === "/en/blog") {
    langToggleHref = "/blog";
  } else if (location.startsWith("/blog/")) {
    const slug = location.slice("/blog/".length);
    const article = ARTICLES.find((a) => a.slug === slug);
    langToggleHref = article ? `/en/blog/${article.enSlug}` : "/en/blog";
  } else if (location.startsWith("/en/blog/")) {
    const enSlug = location.slice("/en/blog/".length);
    const article = ARTICLES.find((a) => a.enSlug === enSlug);
    langToggleHref = article ? `/blog/${article.slug}` : "/blog";
  }

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
        { href: "/en/blog", label: "Blog" },
        { href: "/en/privacy", label: "Privacy Policy" },
        { href: "/en/cookies", label: "Cookie Policy" },
        { href: "/en/legal-notice", label: "Legal Notice" },
        { href: "/en/contact", label: "Contact" },
      ]
    : [
        { href: "/blog", label: "Blog" },
        { href: "/privacidad", label: "Privacidad" },
        { href: "/cookies", label: "Cookies" },
        { href: "/aviso-legal", label: "Aviso legal" },
        { href: "/contacto", label: "Contacto" },
      ];

  return (
    <div className="min-h-[100dvh] flex flex-col mesh-bg">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 dark:bg-black/20 border-gray-200 dark:border-white/10 backdrop-blur-md no-print">
        <div className="container mx-auto px-4 h-16 grid grid-cols-3 items-center">
          {/* Left: logo */}
          <Link href={homeHref} className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Logo" className="h-11 w-11" />
            <span className="logo-text hidden sm:inline-block font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              {siteTitle}
            </span>
          </Link>
          {/* Center: nav */}
          <div className="flex items-center justify-center gap-6">
            {/* Calculadoras dropdown */}
            <div className="relative group">
              <Link href={homeHref} className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors">
                {isEn ? "Calculators" : "Calculadoras"}
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl p-2 min-w-[190px]">
                  {CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon;
                    const catHref = isEn
                      ? `/en/calculators/${EN_CATEGORY_SLUGS[cat.id]}`
                      : `/calculadoras/${cat.id}`;
                    return (
                      <Link
                        key={cat.id}
                        href={catHref}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${cat.color}`}>
                          <CatIcon className="w-3.5 h-3.5" />
                        </div>
                        {isEn ? cat.enName : cat.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <Link
              href={isEn ? "/en/blog" : "/blog"}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </Link>
            <Link
              href={isEn ? "/en/contact" : "/contacto"}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-white/50 hover:text-primary dark:hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              {isEn ? "Contact us" : "Contáctanos"}
            </Link>
          </div>
          <div className="flex items-center justify-end gap-3">
            {/* Language toggle */}
            <Link
              href={langToggleHref}
              className="text-xs font-semibold px-2 py-1 rounded border border-gray-200 dark:border-white/20 text-gray-600 dark:text-white/70 hover:text-primary dark:hover:text-white hover:border-primary dark:hover:border-white/40 transition-colors"
            >
              {isEn ? "Español" : "English"}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div key={location} className="page-enter">{children}</div>
      </main>

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
