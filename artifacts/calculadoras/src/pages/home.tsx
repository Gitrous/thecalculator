import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, X, Clock } from "lucide-react";
import {
  CATEGORIES,
  CALCULATORS,
  getCalculatorsByCategory,
  type CalculatorMeta,
  calcPath,
} from "@/lib/calculators";
import { CalculatorCard } from "@/components/calculator-card";

const RECENT_KEY = "calc_recent";

function getRecentCalcs(): CalculatorMeta[] {
  try {
    const keys: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return keys
      .map((k) => {
        const [cat, slug] = k.split("/");
        return CALCULATORS.find((c) => c.category === cat && c.slug === slug);
      })
      .filter(Boolean) as CalculatorMeta[];
  } catch {
    return [];
  }
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<CalculatorMeta[]>([]);

  useEffect(() => {
    setRecent(getRecentCalcs());
  }, []);

  const featured = CATEGORIES.filter((c) => c.featuredOnHome);
  const normalized = query.toLowerCase().trim();
  const searchResults = normalized
    ? CALCULATORS.filter(
        (c) =>
          c.title.toLowerCase().includes(normalized) ||
          c.description.toLowerCase().includes(normalized) ||
          c.shortLabel.toLowerCase().includes(normalized),
      )
    : [];
  const isSearching = normalized.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <section className="text-center space-y-5 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          Simuladores y Calculadoras Online
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Más de 25 herramientas gratuitas para finanzas, hogar, trabajo,
          educación y salud. Sin registro.
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Busca una calculadora…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category pills */}
        {!isSearching && (
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {featured.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.id} href={`/calculadoras/${cat.id}`}>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-opacity hover:opacity-80 ${cat.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Search results ─────────────────────────────────────────────────── */}
      {isSearching && (
        <section>
          <p className="text-sm text-muted-foreground mb-6">
            {searchResults.length}{" "}
            {searchResults.length === 1 ? "resultado" : "resultados"} para{" "}
            <span className="font-medium text-foreground">"{query}"</span>
          </p>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.map((calc) => (
                <CalculatorCard key={calcPath(calc)} calc={calc} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-16">
              No se encontraron calculadoras para "{query}"
            </p>
          )}
        </section>
      )}

      {/* ── Recent calculators ─────────────────────────────────────────────── */}
      {!isSearching && recent.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              Usadas recientemente
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((calc) => (
              <CalculatorCard key={calcPath(calc)} calc={calc} />
            ))}
          </div>
        </section>
      )}

      {/* ── Categorised sections ───────────────────────────────────────────── */}
      {!isSearching &&
        featured.map((cat) => {
          const Icon = cat.icon;
          return (
            <section key={cat.id} id={cat.id}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <Link href={`/calculadoras/${cat.id}`}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 hover:text-primary transition-colors cursor-pointer">
                      {cat.name}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cat.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {getCalculatorsByCategory(cat.id).map((calc) => (
                  <CalculatorCard key={calc.slug} calc={calc} />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}
