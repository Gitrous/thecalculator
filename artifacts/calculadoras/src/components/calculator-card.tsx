import { Link } from "wouter";
import { type CalculatorMeta, calcPath, enCalcPath } from "@/lib/calculators";
import { useLocale } from "@/lib/locale";

export function CalculatorCard({ calc }: { calc: CalculatorMeta }) {
  const locale = useLocale();
  const Icon = calc.icon;
  const isEn = locale === "en";
  const href = isEn ? enCalcPath(calc) : calcPath(calc);
  const title = isEn ? calc.enTitle : calc.title;
  const description = isEn ? calc.enDescription : calc.description;

  return (
    <Link href={href}>
      <div className="rounded-xl h-full cursor-pointer group glass-card">
        <div className="flex flex-col space-y-1.5 p-6">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${calc.color}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="font-semibold tracking-tight text-lg mt-3 group-hover:text-primary dark:text-white dark:group-hover:text-blue-300 transition-colors">
            {title}
          </div>
          <div className="text-muted-foreground text-base mt-1 dark:text-white/60">
            {description}
          </div>
        </div>
      </div>
    </Link>
  );
}
