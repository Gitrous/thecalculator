import { Link, useParams } from "wouter";
import { ChevronRight } from "lucide-react";
import {
  getCategory,
  getCalculatorsByCategory,
} from "@/lib/calculators";
import { CalculatorCard } from "@/components/calculator-card";
import { Seo } from "@/components/seo";
import NotFound from "@/pages/not-found";

export default function Category() {
  const { categoria = "" } = useParams();
  const category = getCategory(categoria);

  if (!category) return <NotFound />;

  const calcs = getCalculatorsByCategory(category.id);
  const Icon = category.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Seo
        title={`Calculadoras de ${category.name}`}
        description={category.description}
        path={`/calculadoras/${category.id}`}
      />

      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-200">{category.name}</span>
      </nav>

      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${category.color}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
            Calculadoras de {category.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {category.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {calcs.map((calc) => (
          <CalculatorCard key={calc.slug} calc={calc} />
        ))}
      </div>
    </div>
  );
}
