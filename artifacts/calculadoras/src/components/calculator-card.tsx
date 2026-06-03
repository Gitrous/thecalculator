import { Link } from "wouter";
import { type CalculatorMeta, calcPath } from "@/lib/calculators";

export function CalculatorCard({ calc }: { calc: CalculatorMeta }) {
  const Icon = calc.icon;
  return (
    <Link href={calcPath(calc)}>
      <div className="rounded-xl border bg-card text-card-foreground shadow h-full hover:shadow-lg transition-shadow cursor-pointer border-transparent hover:border-primary/20 group">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-start justify-between gap-2">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${calc.color}`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <div className="font-semibold tracking-tight text-lg mt-3 group-hover:text-primary transition-colors">
            {calc.title}
          </div>
          <div className="text-muted-foreground text-base mt-1">
            {calc.description}
          </div>
        </div>
      </div>
    </Link>
  );
}
