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
  Flame,
  type LucideIcon,
} from "lucide-react";

export type CategoryId = "finanzas" | "hogar" | "trabajo" | "educacion" | "salud";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  enName: string;
  enDescription: string;
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
  /** English metadata */
  enTitle: string;
  enDescription: string;
  enShortLabel: string;
  enSeoTitle: string;
  enSeoDescription: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "finanzas",
    name: "Finanzas",
    description: "Hipoteca, IRPF, inversiones, salario y presupuesto personal.",
    enName: "Finance",
    enDescription: "Mortgage, income tax, investments, salary and personal budget.",
    icon: Coins,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    featuredOnHome: true,
  },
  {
    id: "hogar",
    name: "Hogar",
    description: "Coste del coche, consumo eléctrico y gastos del hogar.",
    enName: "Home",
    enDescription: "Car costs, electricity consumption and household expenses.",
    icon: House,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    featuredOnHome: true,
  },
  {
    id: "trabajo",
    name: "Trabajo",
    description: "Control de jornada, horas extra y registro laboral.",
    enName: "Work",
    enDescription: "Time tracking, overtime and work records.",
    icon: Briefcase,
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    featuredOnHome: true,
  },
  {
    id: "educacion",
    name: "Educación",
    description: "Física, cinemática y conversores de unidades.",
    enName: "Education",
    enDescription: "Physics, kinematics and unit converters.",
    icon: GraduationCap,
    color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30",
    featuredOnHome: true,
  },
  {
    id: "salud",
    name: "Salud",
    description: "Salud y bienestar: índice de masa corporal y peso ideal.",
    enName: "Health",
    enDescription: "Health and wellness: body mass index and ideal weight.",
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
    enTitle: "Mortgage Calculator",
    enShortLabel: "Mortgage",
    enSeoTitle: "Mortgage Calculator - Monthly Payment & Amortisation",
    enSeoDescription: "Calculate your monthly mortgage payment, total interest and amortisation schedule. Free online mortgage calculator.",
    enDescription: "Calculate your mortgage payment and see a full amortisation schedule.",
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
    enTitle: "Personal Loan Calculator",
    enShortLabel: "Personal Loan",
    enSeoTitle: "Personal Loan Calculator",
    enSeoDescription: "Calculate your monthly personal loan payment and total interest.",
    enDescription: "Calculate monthly payments and total cost of your personal loan.",
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
    enTitle: "Percentage Calculator",
    enShortLabel: "Percentages",
    enSeoTitle: "Percentage Calculator Online",
    enSeoDescription: "Calculate percentages, percentage increase/decrease and find what percentage one number is of another.",
    enDescription: "Calculate any percentage: what % of a number, % increase/decrease and more.",
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
    enTitle: "VAT Calculator",
    enShortLabel: "VAT",
    enSeoTitle: "VAT Calculator - Add or Remove VAT",
    enSeoDescription: "Add or remove VAT from any amount. Supports 21%, 10% and 4% VAT rates.",
    enDescription: "Add or remove VAT from any amount instantly.",
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
    enTitle: "Spanish Income Tax Calculator (IRPF)",
    enShortLabel: "Income Tax (IRPF)",
    enSeoTitle: "Spanish Income Tax Calculator (IRPF) 2024",
    enSeoDescription: "Calculate your Spanish income tax (IRPF) withholding and net salary from gross pay.",
    enDescription: "Calculate Spanish income tax (IRPF) and your net take-home pay.",
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
    enTitle: "Compound Interest Calculator",
    enShortLabel: "Compound Interest",
    enSeoTitle: "Compound Interest Calculator",
    enSeoDescription: "Calculate compound interest growth over time. See how your savings or investments grow.",
    enDescription: "See how compound interest grows your savings over time.",
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
    enTitle: "Net Salary Calculator (Spain)",
    enShortLabel: "Net Salary",
    enSeoTitle: "Net Salary Calculator Spain 2024",
    enSeoDescription: "Calculate your net take-home salary in Spain after IRPF and Social Security deductions.",
    enDescription: "Calculate your net take-home pay after taxes and Social Security in Spain.",
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
    enTitle: "Rent vs Buy Calculator",
    enShortLabel: "Rent vs Buy",
    enSeoTitle: "Rent vs Buy Calculator - Is It Better to Rent or Buy?",
    enSeoDescription: "Compare the long-term cost of renting vs buying a home. Find out which is better for your situation.",
    enDescription: "Compare renting vs buying a home over the long term.",
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
    enTitle: "Annual Car Cost Calculator",
    enShortLabel: "Car Costs",
    enSeoTitle: "Annual Car Cost Calculator",
    enSeoDescription: "Calculate the true annual cost of your car: fuel, insurance, maintenance and taxes.",
    enDescription: "Calculate the real annual cost of owning your car.",
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
    enTitle: "Electricity Consumption Calculator",
    enShortLabel: "Electricity Usage",
    enSeoTitle: "Electricity Consumption Calculator - Estimate Your Bill",
    enSeoDescription: "Estimate your electricity bill by appliance and find out what uses the most energy.",
    enDescription: "Estimate your electricity bill and find out what consumes most.",
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
    enTitle: "Severance Pay Calculator (Spain)",
    enShortLabel: "Severance Pay",
    enSeoTitle: "Spanish Severance Pay Calculator (Finiquito) 2024",
    enSeoDescription: "Calculate your severance pay in Spain including pending holidays, pro-rata bonuses and unpaid days.",
    enDescription: "Calculate your Spanish severance pay (finiquito).",
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
    enTitle: "Spanish DNI Letter Calculator",
    enShortLabel: "DNI Letter",
    enSeoTitle: "Spanish DNI / NIE Letter Calculator",
    enSeoDescription: "Calculate the check letter of a Spanish DNI or NIE identification number instantly.",
    enDescription: "Calculate the check letter for a Spanish DNI or NIE number.",
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
    enTitle: "Spanish Freelancer Tax Calculator",
    enShortLabel: "Freelancer Tax",
    enSeoTitle: "Spanish Freelancer (Autónomo) Social Security Calculator 2025",
    enSeoDescription: "Calculate your monthly Spanish freelancer Social Security contribution (RETA) based on real income.",
    enDescription: "Calculate your Spanish freelancer Social Security contribution (RETA) 2025.",
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
    enTitle: "Days Between Dates Calculator",
    enShortLabel: "Days Between Dates",
    enSeoTitle: "Days Between Dates Calculator",
    enSeoDescription: "Calculate the number of days, weeks, months and working days between two dates.",
    enDescription: "Calculate days, weeks, months and working days between two dates.",
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
    enTitle: "Work Hours Calculator",
    enShortLabel: "Work Hours",
    enSeoTitle: "Work Hours Calculator - Track Overtime",
    enSeoDescription: "Track your work hours, calculate overtime and monitor your working day.",
    enDescription: "Track work hours, calculate overtime and monitor your schedule.",
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
    enTitle: "Pythagorean Theorem Calculator",
    enShortLabel: "Pythagorean Theorem",
    enSeoTitle: "Pythagorean Theorem Calculator - Find Hypotenuse",
    enSeoDescription: "Calculate the hypotenuse or any side of a right triangle using the Pythagorean theorem: a² + b² = c².",
    enDescription: "Calculate the hypotenuse or any side of a right triangle.",
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
    enTitle: "Rule of Three Calculator",
    enShortLabel: "Rule of Three",
    enSeoTitle: "Rule of Three Calculator - Direct and Inverse",
    enSeoDescription: "Solve direct and inverse rule of three problems. Enter three values and find the fourth instantly.",
    enDescription: "Solve direct and inverse rule of three problems instantly.",
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
    enTitle: "Grade Average Calculator",
    enShortLabel: "Grade Average",
    enSeoTitle: "Grade Average Calculator - Simple and Weighted",
    enSeoDescription: "Calculate your simple or credit-weighted grade average. Add all your subjects and get your GPA.",
    enDescription: "Calculate your simple or weighted grade average.",
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
    enTitle: "Uniform Motion Calculator (ULM)",
    enShortLabel: "Uniform Motion",
    enSeoTitle: "Uniform Linear Motion Calculator (ULM / MRU)",
    enSeoDescription: "Solve uniform linear motion problems: distance, velocity and time.",
    enDescription: "Solve distance, velocity and time problems for uniform motion.",
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
    enTitle: "Uniformly Accelerated Motion Calculator",
    enShortLabel: "Accelerated Motion",
    enSeoTitle: "Uniformly Accelerated Motion Calculator (UAM)",
    enSeoDescription: "Calculate position, velocity and acceleration in uniformly accelerated linear motion.",
    enDescription: "Calculate position, velocity and acceleration in accelerated motion.",
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
    enTitle: "Unit Converter",
    enShortLabel: "Unit Converter",
    enSeoTitle: "Unit Converter Online - Length, Mass, Temperature, Volume",
    enSeoDescription: "Convert between metric and imperial units: length, mass, temperature and volume.",
    enDescription: "Convert between metric and imperial: length, mass, temperature, volume.",
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
    enTitle: "BMI Calculator",
    enShortLabel: "BMI",
    enSeoTitle: "BMI Calculator - Body Mass Index",
    enSeoDescription: "Calculate your Body Mass Index (BMI) and find out your weight category according to WHO standards.",
    enDescription: "Calculate your Body Mass Index and find your weight category.",
  },
  {
    slug: "calorias",
    category: "salud",
    title: "Calculadora de Calorías y TMB",
    description:
      "Calcula tu Tasa Metabólica Basal y las calorías diarias que necesitas según tu actividad y objetivo.",
    shortLabel: "Calorías y TMB",
    icon: Flame,
    color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    seoTitle: "Calculadora de Calorías Diarias y TMB (Tasa Metabólica Basal)",
    seoDescription:
      "Calcula cuántas calorías necesitas al día según tu peso, altura, edad, actividad y objetivo (perder peso, mantener o ganar músculo).",
    enTitle: "Calorie & BMR Calculator",
    enShortLabel: "Calories & BMR",
    enSeoTitle: "Calorie Calculator - Daily Calorie Needs & BMR",
    enSeoDescription: "Calculate your Basal Metabolic Rate (BMR) and daily calorie needs based on activity level and goal.",
    enDescription: "Calculate your BMR and daily calorie needs by activity and goal.",
  },

  // ── Finanzas (nuevas) ─────────────────────────────────────────────────────
  {
    slug: "amortizacion-anticipada",
    category: "finanzas",
    title: "Calculadora de Amortización Anticipada de Hipoteca",
    description:
      "Calcula cuánto ahorras amortizando anticipadamente tu hipoteca y elige entre reducir cuota o plazo.",
    shortLabel: "Amortización Anticipada",
    icon: Building,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    seoTitle: "Calculadora de Amortización Anticipada de Hipoteca",
    seoDescription:
      "Calcula el ahorro en intereses al amortizar tu hipoteca anticipadamente. Elige entre reducir la cuota mensual o acortar el plazo.",
    enTitle: "Early Mortgage Repayment Calculator",
    enShortLabel: "Early Repayment",
    enSeoTitle: "Early Mortgage Repayment Calculator - Interest Saved",
    enSeoDescription: "Calculate how much interest you save by making an early mortgage repayment. Choose between reducing payment or term.",
    enDescription: "Calculate interest saved by repaying your mortgage early.",
  },
  {
    slug: "tae",
    category: "finanzas",
    title: "Calculadora TAE / TIN",
    description:
      "Convierte entre TIN y TAE según la frecuencia de capitalización. Compara hipotecas, préstamos y depósitos.",
    shortLabel: "TAE / TIN",
    icon: Percent,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-900/30",
    seoTitle: "Calculadora TAE y TIN online",
    seoDescription:
      "Convierte entre TIN y TAE según la frecuencia de capitalización. Herramienta para comparar hipotecas, préstamos y depósitos bancarios.",
    enTitle: "APR / Nominal Rate Converter",
    enShortLabel: "APR / TIN",
    enSeoTitle: "APR Calculator - Convert Between APR and Nominal Rate",
    enSeoDescription: "Convert between APR (Annual Percentage Rate) and nominal interest rate for any compounding frequency.",
    enDescription: "Convert between APR and nominal rate for any compounding frequency.",
  },

  // ── Trabajo (nuevas) ──────────────────────────────────────────────────────
  {
    slug: "paro",
    category: "trabajo",
    title: "Calculadora de Paro (Prestación por Desempleo)",
    description:
      "Calcula cuánto cobrarás de paro, durante cuánto tiempo y el total de la prestación según tu salario.",
    shortLabel: "Paro / Desempleo",
    icon: Briefcase,
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
    seoTitle: "Calculadora de Paro y Prestación por Desempleo 2025",
    seoDescription:
      "Calcula cuánto cobrarás de paro según tu salario y los meses cotizados. Incluye duración, cuantía y total de la prestación.",
    enTitle: "Spanish Unemployment Benefit Calculator",
    enShortLabel: "Unemployment Benefit",
    enSeoTitle: "Spanish Unemployment Benefit Calculator 2025",
    enSeoDescription: "Calculate your Spanish unemployment benefit (paro) amount and duration based on your salary and contributions.",
    enDescription: "Calculate your Spanish unemployment benefit amount and duration.",
  },
  {
    slug: "pension",
    category: "trabajo",
    title: "Calculadora de Pensión de Jubilación",
    description:
      "Estima tu pensión mensual según los años cotizados y tu base reguladora.",
    shortLabel: "Pensión de Jubilación",
    icon: Landmark,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    seoTitle: "Calculadora de Pensión de Jubilación 2024",
    seoDescription:
      "Estima tu pensión de jubilación según los años cotizados y tu base reguladora. Calculadora orientativa del sistema de pensiones español.",
    enTitle: "Spanish Retirement Pension Calculator",
    enShortLabel: "Retirement Pension",
    enSeoTitle: "Spanish Retirement Pension Calculator 2024",
    enSeoDescription: "Estimate your Spanish state retirement pension based on years contributed and regulatory base.",
    enDescription: "Estimate your Spanish state retirement pension.",
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

export const EN_CATEGORY_SLUGS: Record<CategoryId, string> = {
  finanzas: "finance",
  hogar: "home",
  trabajo: "work",
  educacion: "education",
  salud: "health",
};

export const EN_TO_ES_CATEGORY: Record<string, CategoryId> = {
  finance: "finanzas",
  home: "hogar",
  work: "trabajo",
  education: "educacion",
  health: "salud",
};

export function enCalcPath(c: CalculatorMeta): string {
  return `/en/calculators/${EN_CATEGORY_SLUGS[c.category]}/${c.slug}`;
}

/** Equivalent path in the other locale, preserving category/calculator when possible. */
export function localeSwitchPath(location: string, currentlyEn: boolean): string {
  if (currentlyEn) {
    const m = location.match(/^\/en\/calculators\/([^/]+)(?:\/([^/]+))?/);
    if (m) {
      const [, enCat, slug] = m;
      const esCat = EN_TO_ES_CATEGORY[enCat];
      if (esCat) return slug ? `/calculadoras/${esCat}/${slug}` : `/calculadoras/${esCat}`;
    }
    return "/";
  }

  const m = location.match(/^\/calculadoras\/([^/]+)(?:\/([^/]+))?/);
  if (m) {
    const [, esCat, slug] = m;
    const enCat = EN_CATEGORY_SLUGS[esCat as CategoryId];
    if (enCat) return slug ? `/en/calculators/${enCat}/${slug}` : `/en/calculators/${enCat}`;
  }
  return "/en";
}
