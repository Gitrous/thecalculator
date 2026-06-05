import {
  Building,
  Landmark,
  Percent,
  Receipt,
  Calculator,
  Coins,
  Briefcase,
  House,
  Car,
  Zap,
  FileText,
  IdCard,
  UserCheck,
  CalendarDays,
  Clock,
  GitCompare,
  GraduationCap,
  Activity,
  ArrowRightLeft,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";

export type CategoryId = "finanzas" | "hogar" | "trabajo" | "educacion" | "salud";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes for the coloured badge/icon chip. */
  color: string;
  /** Whether this category is featured as a section on the home page. */
  featuredOnHome: boolean;
}

export interface CalculatorMeta {
  /** URL slug within the category, e.g. "hipoteca". */
  slug: string;
  category: CategoryId;
  /** Card title shown on the home and category pages. */
  title: string;
  /** Short marketing description for cards. */
  description: string;
  /** Footer link label (shorter than the title). */
  shortLabel: string;
  icon: LucideIcon;
  color: string;
  /** SEO <title>. */
  seoTitle: string;
  /** SEO meta description. */
  seoDescription: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "finanzas",
    name: "Finanzas",
    description: "Hipoteca, IRPF, inversiones, salario y presupuesto personal.",
    icon: Coins,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    featuredOnHome: true,
  },
  {
    id: "hogar",
    name: "Hogar",
    description: "Coste del coche, consumo eléctrico y gastos del hogar.",
    icon: House,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    featuredOnHome: true,
  },
  {
    id: "trabajo",
    name: "Trabajo",
    description: "Control de jornada, horas extra y registro laboral.",
    icon: Briefcase,
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    featuredOnHome: true,
  },
  {
    id: "educacion",
    name: "Educación",
    description: "Física, cinemática y conversores de unidades.",
    icon: GraduationCap,
    color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30",
    featuredOnHome: true,
  },
  {
    id: "salud",
    name: "Salud",
    description: "Salud y bienestar: índice de masa corporal y peso ideal.",
    icon: HeartPulse,
    color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30",
    featuredOnHome: false,
  },
];

export const CALCULATORS: CalculatorMeta[] = [
  // ── Finanzas ──────────────────────────────────────────────────────────────
  {
    slug: "hipoteca",
    category: "finanzas",
    title: "Calculadora de Hipoteca",
    description:
      "Cuota mensual, amortización completa e intereses totales. Compara fija vs. variable.",
    shortLabel: "Hipoteca",
    icon: Building,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    seoTitle: "Calculadora de Hipoteca: cuota, amortización e intereses",
    seoDescription:
      "Calcula la cuota mensual de tu hipoteca, la tabla de amortización completa y los intereses totales. Compara tipo fijo y variable.",
  },
  {
    slug: "prestamo-personal",
    category: "finanzas",
    title: "Calculadora de Préstamo Personal",
    description:
      "Calcula la cuota mensual de tu préstamo, el total de intereses y el cuadro de amortización mes a mes.",
    shortLabel: "Préstamo Personal",
    icon: Landmark,
    color: "text-sky-600 bg-sky-100 dark:bg-sky-900/30",
    seoTitle: "Calculadora de Préstamo Personal: cuota e intereses",
    seoDescription:
      "Calcula la cuota mensual de tu préstamo personal, el total de intereses y el cuadro de amortización mes a mes.",
  },
  {
    slug: "porcentajes",
    category: "finanzas",
    title: "Calculadora de Porcentajes",
    description:
      "Calcula porcentajes al instante: qué % es X de Y, cuánto es el X% de Y, variación entre dos valores, y subir o bajar un % a un número.",
    shortLabel: "Porcentajes",
    icon: Percent,
    color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30",
    seoTitle: "Calculadora de Porcentajes online",
    seoDescription:
      "Calcula porcentajes al instante: qué porcentaje es X de Y, cuánto es el X% de Y, la variación entre dos valores y subir o bajar un % a un número.",
  },
  {
    slug: "iva",
    category: "finanzas",
    title: "Calculadora de IVA",
    description:
      "Suma o resta el IVA a cualquier precio. Tipos 21%, 10%, 4% y 0%. Para autónomos, empresas y particulares.",
    shortLabel: "IVA",
    icon: Receipt,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-900/30",
    seoTitle: "Calculadora de IVA: sumar o quitar el IVA",
    seoDescription:
      "Suma o resta el IVA a cualquier precio. Tipos 21%, 10%, 4% y 0%. Ideal para autónomos, empresas y particulares.",
  },
  {
    slug: "irpf",
    category: "finanzas",
    title: "Calculadora IRPF",
    description:
      "Retención y sueldo neto por país y comunidad autónoma. Tramos 2024 actualizados.",
    shortLabel: "IRPF",
    icon: Calculator,
    color: "text-primary bg-primary/10",
    seoTitle: "Calculadora IRPF por Comunidad Autónoma",
    seoDescription:
      "Calcula tu retención de IRPF y tu sueldo neto según tu comunidad autónoma. Tramos actualizados.",
  },
  {
    slug: "interes-compuesto",
    category: "finanzas",
    title: "Interés Compuesto",
    description:
      "Proyecta el crecimiento de tus inversiones con aportes periódicos opcionales.",
    shortLabel: "Interés Compuesto",
    icon: Coins,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    seoTitle: "Calculadora de Interés Compuesto",
    seoDescription:
      "Proyecta el crecimiento de tus inversiones a largo plazo con aportaciones periódicas opcionales.",
  },
  {
    slug: "salario-neto",
    category: "finanzas",
    title: "Calculadora de Salario Neto",
    description:
      "Convierte tu salario bruto anual en neto mensual estimado en España.",
    shortLabel: "Salario Neto",
    icon: Briefcase,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    seoTitle: "Calculadora de Salario Neto en España",
    seoDescription:
      "Convierte tu salario bruto anual en el sueldo neto mensual estimado en España.",
  },
  {
    slug: "alquiler-vs-compra",
    category: "finanzas",
    title: "Alquiler vs Compra",
    description:
      "Compara si es más rentable alquilar o comprar vivienda en tu caso concreto.",
    shortLabel: "Alquiler vs Compra",
    icon: House,
    color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
    seoTitle: "Calculadora Alquiler vs Compra de vivienda",
    seoDescription:
      "Compara si te sale más rentable alquilar o comprar vivienda según tu situación concreta.",
  },

  // ── Hogar ─────────────────────────────────────────────────────────────────
  {
    slug: "gasto-coche",
    category: "hogar",
    title: "Calculadora de Gasto de Coche",
    description:
      "Coste real anual de tu vehículo: combustible, seguro, mantenimiento y más.",
    shortLabel: "Gasto de Coche",
    icon: Car,
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
    seoTitle: "Calculadora de Gasto de Coche anual",
    seoDescription:
      "Descubre el coste real anual de tu vehículo: combustible, seguro, mantenimiento, impuestos y más.",
  },
  {
    slug: "consumo-electrico",
    category: "hogar",
    title: "Calculadora de Consumo Eléctrico",
    description:
      "Estima tu factura eléctrica por electrodoméstico y descubre qué consume más.",
    shortLabel: "Consumo Eléctrico",
    icon: Zap,
    color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    seoTitle: "Calculadora de Consumo Eléctrico y factura de la luz",
    seoDescription:
      "Estima tu factura de la luz por electrodoméstico y descubre qué aparatos consumen más en tu hogar.",
  },

  // ── Trabajo ───────────────────────────────────────────────────────────────
  {
    slug: "finiquito",
    category: "trabajo",
    title: "Calculadora de Finiquito",
    description:
      "Calcula el finiquito que te corresponde: indemnización, vacaciones pendientes, pagas extra y días no cobrados.",
    shortLabel: "Finiquito",
    icon: FileText,
    color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    seoTitle: "Calculadora de Finiquito",
    seoDescription:
      "Calcula tu finiquito: vacaciones no disfrutadas, parte proporcional de pagas extra y días trabajados no cobrados.",
  },
  {
    slug: "letra-dni",
    category: "trabajo",
    title: "Calculadora Letra del DNI",
    description:
      "Calcula la letra de tu DNI o NIE al instante. Introduce los 8 dígitos y obtén la letra correcta.",
    shortLabel: "Letra del DNI",
    icon: IdCard,
    color: "text-slate-600 bg-slate-100 dark:bg-slate-900/30",
    seoTitle: "Calculadora de la Letra del DNI y NIE",
    seoDescription:
      "Calcula la letra de tu DNI o NIE al instante. Introduce los dígitos y obtén la letra correcta del documento.",
  },
  {
    slug: "autonomos",
    category: "trabajo",
    title: "Calculadora Cuota Autónomos",
    description:
      "Calcula tu cuota mensual al RETA según el nuevo sistema de tramos por ingresos reales 2025. Incluye tarifa plana.",
    shortLabel: "Cuota Autónomos",
    icon: UserCheck,
    color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
    seoTitle: "Calculadora de Cuota de Autónomos 2025 (RETA)",
    seoDescription:
      "Calcula tu cuota mensual de autónomos según el sistema de tramos por ingresos reales 2025. Incluye la tarifa plana.",
  },
  {
    slug: "dias-entre-fechas",
    category: "trabajo",
    title: "Calculadora de Días entre Fechas",
    description:
      "Calcula cuántos días, semanas, meses y días laborables hay entre dos fechas.",
    shortLabel: "Días entre Fechas",
    icon: CalendarDays,
    color: "text-teal-600 bg-teal-100 dark:bg-teal-900/30",
    seoTitle: "Calculadora de Días entre Fechas",
    seoDescription:
      "Calcula cuántos días, semanas, meses y días laborables hay entre dos fechas cualesquiera.",
  },
  {
    slug: "horas-trabajadas",
    category: "trabajo",
    title: "Calculadora de Horas Trabajadas",
    description:
      "Registra entradas y salidas, calcula horas extra y controla tu jornada laboral.",
    shortLabel: "Horas Trabajadas",
    icon: Clock,
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    seoTitle: "Calculadora de Horas Trabajadas y horas extra",
    seoDescription:
      "Registra entradas y salidas, calcula horas extra y controla tu jornada laboral.",
  },

  // ── Educación ─────────────────────────────────────────────────────────────
  {
    slug: "pitagoras",
    category: "educacion",
    title: "Calculadora de Pitágoras",
    description:
      "Calcula la hipotenusa o un cateto de un triángulo rectángulo aplicando el teorema de Pitágoras: a² + b² = c².",
    shortLabel: "Pitágoras",
    icon: Calculator,
    color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
    seoTitle: "Calculadora del Teorema de Pitágoras",
    seoDescription:
      "Calcula la hipotenusa o un cateto de un triángulo rectángulo con el teorema de Pitágoras: a² + b² = c².",
  },
  {
    slug: "regla-de-tres",
    category: "educacion",
    title: "Calculadora Regla de Tres",
    description:
      "Resuelve la regla de tres directa e inversa. Introduce tres valores y calcula el cuarto al instante.",
    shortLabel: "Regla de Tres",
    icon: GitCompare,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-900/30",
    seoTitle: "Calculadora de Regla de Tres directa e inversa",
    seoDescription:
      "Resuelve la regla de tres directa e inversa. Introduce tres valores y obtén el cuarto al instante.",
  },
  {
    slug: "nota-media",
    category: "educacion",
    title: "Calculadora de Nota Media",
    description:
      "Calcula tu nota media simple o ponderada por créditos ECTS. Añade todas tus asignaturas.",
    shortLabel: "Nota Media",
    icon: GraduationCap,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    seoTitle: "Calculadora de Nota Media (simple y ponderada)",
    seoDescription:
      "Calcula tu nota media simple o ponderada por créditos ECTS añadiendo todas tus asignaturas.",
  },
  {
    slug: "mru",
    category: "educacion",
    title: "Calculadora MRU",
    description:
      "Resuelve problemas de Movimiento Rectilíneo Uniforme: distancia, velocidad y tiempo.",
    shortLabel: "MRU",
    icon: Activity,
    color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30",
    seoTitle: "Calculadora MRU (Movimiento Rectilíneo Uniforme)",
    seoDescription:
      "Resuelve problemas de Movimiento Rectilíneo Uniforme: distancia, velocidad y tiempo.",
  },
  {
    slug: "mrua",
    category: "educacion",
    title: "Calculadora MRUA",
    description:
      "Calcula posición, velocidad y aceleración en movimiento rectilíneo acelerado.",
    shortLabel: "MRUA",
    icon: Activity,
    color: "text-sky-600 bg-sky-100 dark:bg-sky-900/30",
    seoTitle: "Calculadora MRUA (Movimiento Rectilíneo Uniformemente Acelerado)",
    seoDescription:
      "Calcula posición, velocidad y aceleración en el movimiento rectilíneo uniformemente acelerado.",
  },
  {
    slug: "conversor-unidades",
    category: "educacion",
    title: "Conversor de Unidades",
    description:
      "Convierte entre sistemas métrico e imperial: longitud, masa, temperatura, volumen.",
    shortLabel: "Conversor de Unidades",
    icon: ArrowRightLeft,
    color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30",
    seoTitle: "Conversor de Unidades online",
    seoDescription:
      "Convierte entre los sistemas métrico e imperial: longitud, masa, temperatura y volumen.",
  },

  // ── Salud ─────────────────────────────────────────────────────────────────
  {
    slug: "imc",
    category: "salud",
    title: "Calculadora de IMC",
    description:
      "Calcula tu Índice de Masa Corporal y descubre en qué rango de peso te encuentras según tu altura.",
    shortLabel: "IMC",
    icon: HeartPulse,
    color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30",
    seoTitle: "Calculadora de IMC (Índice de Masa Corporal)",
    seoDescription:
      "Calcula tu Índice de Masa Corporal (IMC) y descubre en qué rango de peso te encuentras según tu altura.",
  },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCalculatorsByCategory(id: string): CalculatorMeta[] {
  return CALCULATORS.filter((c) => c.category === id);
}

export function getCalculator(
  category: string,
  slug: string,
): CalculatorMeta | undefined {
  return CALCULATORS.find((c) => c.category === category && c.slug === slug);
}

/** Canonical site path for a calculator, e.g. "/calculadoras/finanzas/hipoteca". */
export function calcPath(c: CalculatorMeta): string {
  return `/calculadoras/${c.category}/${c.slug}`;
}
