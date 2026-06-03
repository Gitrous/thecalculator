import { Link } from "wouter";
import {
  CATEGORIES,
  getCalculatorsByCategory,
} from "@/lib/calculators";
import { CalculatorCard } from "@/components/calculator-card";

export default function Home() {
  const featured = CATEGORIES.filter((c) => c.featuredOnHome);

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <section className="text-center space-y-5 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          Simuladores y Calculadoras Online
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Herramientas precisas y gratuitas para finanzas, hogar, trabajo y
          física. Sin registro ni publicidad.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
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
      </section>

      {featured.map((cat) => {
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
