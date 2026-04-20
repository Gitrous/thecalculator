import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, Calculator, Coins, HomeIcon, Car, Zap, 
  Clock, Activity, ArrowRightLeft, Briefcase
} from "lucide-react";

const calculators = [
  {
    title: "Hipoteca Avanzada",
    description: "Simula tu cuota mensual, tabla de amortización e intereses totales.",
    icon: Building,
    href: "/calculadoras/hipoteca-avanzada",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "IRPF por CCAA",
    description: "Calcula tu retención y sueldo neto según tu Comunidad Autónoma en 2024.",
    icon: Calculator,
    href: "/calculadoras/irpf",
    color: "text-primary bg-primary/10",
  },
  {
    title: "Interés Compuesto",
    description: "Proyecta el crecimiento de tus inversiones a largo plazo.",
    icon: Coins,
    href: "/calculadoras/interes-compuesto",
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  },
  {
    title: "Alquiler vs Compra",
    description: "Compara si te sale más rentable alquilar o comprar vivienda.",
    icon: HomeIcon,
    href: "/calculadoras/alquiler-vs-compra",
    color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    title: "Salario Neto",
    description: "Calcula tu sueldo neto mensual a partir de tu salario bruto.",
    icon: Briefcase,
    href: "/calculadoras/salario-neto",
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    title: "Gasto de Coche",
    description: "Descubre cuánto te cuesta realmente mantener tu vehículo.",
    icon: Car,
    href: "/calculadoras/gasto-coche",
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
  },
  {
    title: "Consumo Eléctrico",
    description: "Estima tu factura de la luz basándote en tus electrodomésticos.",
    icon: Zap,
    href: "/calculadoras/consumo-electrico",
    color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    title: "Horas Trabajadas",
    description: "Lleva el control de tus horas extra y tiempo trabajado.",
    icon: Clock,
    href: "/calculadoras/horas-trabajadas",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "Física: MRU",
    description: "Calculadora de Movimiento Rectilíneo Uniforme.",
    icon: Activity,
    href: "/calculadoras/mru",
    color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30",
  },
  {
    title: "Física: MRUA",
    description: "Calculadora de Movimiento Rectilíneo Uniformemente Acelerado.",
    icon: Activity,
    href: "/calculadoras/mrua",
    color: "text-sky-600 bg-sky-100 dark:bg-sky-900/30",
  },
  {
    title: "Conversor de Unidades",
    description: "Convierte fácilmente entre diferentes medidas y magnitudes.",
    icon: ArrowRightLeft,
    href: "/calculadoras/conversor-unidades",
    color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30",
  }
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <section className="text-center space-y-4 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          Simuladores y Calculadoras Online
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Herramientas útiles y precisas para finanzas, física, hogar y productividad.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc, i) => {
          const Icon = calc.icon;
          return (
            <Link key={i} href={calc.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-transparent hover:border-primary/20">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${calc.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{calc.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {calc.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
