export type SectionType = "p" | "h2" | "ul" | "callout" | "tip" | "checklist" | "quote";

export interface ArticleSection {
  type: SectionType;
  text?: string;
  items?: string[];
}

export interface Article {
  slug: string;
  enSlug: string;
  category: string;
  date: string;
  title: string;
  description: string;
  enTitle: string;
  enDescription: string;
  relatedCalcSlug: string;
  relatedCalcCategory: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "que-es-el-imc",
    enSlug: "what-is-bmi",
    category: "salud",
    date: "2026-06-28",
    relatedCalcSlug: "imc",
    relatedCalcCategory: "salud",

    title: "¿Qué es el IMC y cómo interpretarlo correctamente?",
    description:
      "El IMC es el indicador de peso más usado en el mundo, pero tiene limitaciones que conviene conocer. Te explicamos qué mide, cómo se interpreta y cuándo no es suficiente.",

    enTitle: "What is BMI and how to interpret it correctly?",
    enDescription:
      "BMI is the world's most widely used weight indicator, but it has limitations worth knowing. We explain what it measures, how to interpret it, and when it is not enough.",
  },

  {
    slug: "cuantas-calorias-necesito-al-dia",
    enSlug: "how-many-calories-do-i-need-per-day",
    category: "salud",
    date: "2026-06-28",
    relatedCalcSlug: "calorias",
    relatedCalcCategory: "salud",

    title: "¿Cuántas calorías necesito al día? Guía sobre TMB y TDEE",
    description:
      "Entender tu Tasa Metabólica Basal y tu gasto energético total es clave para perder peso, ganar músculo o mantener tu forma física. Te lo explicamos paso a paso.",

    enTitle: "How many calories do I need per day? A guide to BMR and TDEE",
    enDescription:
      "Understanding your Basal Metabolic Rate and total energy expenditure is key to losing weight, gaining muscle or staying in shape. We explain it step by step.",
  },

  {
    slug: "cuanta-agua-debo-beber-al-dia",
    enSlug: "how-much-water-should-i-drink-per-day",
    category: "salud",
    date: "2026-06-28",
    relatedCalcSlug: "agua-diaria",
    relatedCalcCategory: "salud",

    title: "¿Cuánta agua debo beber al día? Guía completa de hidratación",
    description:
      "La cantidad de agua que necesitas depende de tu peso, actividad y clima. Te explicamos cómo calcularlo, los errores más comunes y los consejos para hidratarte mejor.",

    enTitle: "How much water should I drink per day? A complete hydration guide",
    enDescription:
      "The amount of water you need depends on your weight, activity and climate. We explain how to calculate it, the most common mistakes and tips for staying better hydrated.",
  },

  {
    slug: "frecuencia-cardiaca-maxima-zonas-entrenamiento",
    enSlug: "maximum-heart-rate-and-training-zones",
    category: "salud",
    date: "2026-06-28",
    relatedCalcSlug: "frecuencia-cardiaca",
    relatedCalcCategory: "salud",

    title: "Frecuencia cardíaca máxima y zonas de entrenamiento: guía práctica",
    description:
      "Conocer tu FCmáx y tus zonas de entrenamiento te permite controlar la intensidad del ejercicio con precisión. Te explicamos cómo calcularla, qué significa cada zona y cómo usarlas.",

    enTitle: "Maximum heart rate and training zones: a practical guide",
    enDescription:
      "Knowing your MHR and training zones lets you control exercise intensity with precision. We explain how to calculate it, what each zone means and how to use them.",
  },
  // ─── FINANZAS ───────────────────────────────────────────────────────────────
  {
    slug: "como-calcular-cuota-hipoteca",
    enSlug: "how-to-calculate-mortgage-payment",
    title: "Cómo calcular la cuota de una hipoteca paso a paso",
    enTitle: "How to Calculate a Mortgage Payment Step by Step",
    description: "Aprende la fórmula del sistema de amortización francés, entiende cómo se reparten capital e intereses cada mes y usa un simulador para comparar plazos y tipos.",
    enDescription: "Learn the French amortisation formula, understand how capital and interest are split each month, and use a simulator to compare terms and rates.",
    category: "finanzas",
    date: "2026-06-01",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "hipoteca",
  },
  {
    slug: "que-es-la-tae-diferencia-tin",
    enSlug: "what-is-apr-difference-from-nominal-rate",
    title: "TAE vs TIN: qué son y por qué la TAE es el dato que importa",
    enTitle: "APR vs Nominal Rate: What They Are and Why APR Is What Matters",
    description: "Entiende la diferencia entre el tipo de interés nominal y la tasa anual equivalente, y aprende a usarla para comparar préstamos, hipotecas y depósitos de verdad.",
    enDescription: "Understand the difference between the nominal interest rate and the annual percentage rate, and learn to use it to genuinely compare loans, mortgages and deposits.",
    category: "finanzas",
    date: "2026-06-02",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "tae",
  },
  {
    slug: "como-funciona-interes-compuesto",
    enSlug: "how-compound-interest-works",
    title: "Qué es el interés compuesto y cómo hacer crecer tu dinero",
    enTitle: "What Is Compound Interest and How to Grow Your Money",
    description: "El interés compuesto es el mecanismo que hace que pequeñas cantidades ahorradas durante décadas se conviertan en grandes patrimonios. Aquí lo explicamos con números reales.",
    enDescription: "Compound interest is the mechanism that turns small amounts saved over decades into significant wealth. We explain it here with real numbers.",
    category: "finanzas",
    date: "2026-06-03",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "interes-compuesto",
  },
  {
    slug: "irpf-como-funciona-retencion-nomina",
    enSlug: "income-tax-spain-how-withholding-works",
    title: "IRPF: cómo se calcula la retención en nómina",
    enTitle: "Income Tax in Spain: How Payroll Withholding Is Calculated",
    description: "Entiende qué es el IRPF, cómo funciona la escala de tramos y por qué la retención de tu nómina puede ser diferente a la de un compañero con el mismo sueldo.",
    enDescription: "Understand what IRPF is, how the tax brackets work and why your payroll withholding can differ from a colleague on the same salary.",
    category: "finanzas",
    date: "2026-06-04",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "irpf",
  },
  {
    slug: "alquilar-o-comprar-vivienda",
    enSlug: "rent-or-buy-home-spain",
    title: "¿Alquilar o comprar vivienda en España? La guía definitiva",
    enTitle: "Rent or Buy a Home in Spain? The Definitive Guide",
    description: "Analizamos los factores clave que determinan cuándo compensa más comprar que alquilar: precio/alquiler, horizonte temporal, tipo hipotecario y coste de oportunidad.",
    enDescription: "We analyse the key factors that determine when buying is better than renting: price/rent ratio, time horizon, mortgage rate and opportunity cost.",
    category: "finanzas",
    date: "2026-06-05",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "alquiler-vs-compra",
  },
  {
    slug: "amortizacion-anticipada-hipoteca-ahorro",
    enSlug: "early-mortgage-repayment-savings",
    title: "Amortización anticipada de hipoteca: ¿cuánto se ahorra y cuándo conviene?",
    enTitle: "Early Mortgage Repayment: How Much Do You Save and When Is It Worth It?",
    description: "Descubre cuánto ahorras en intereses amortizando anticipadamente, cuándo elegir reducir plazo vs. cuota, y qué comisiones pueden comerse parte del ahorro.",
    enDescription: "Find out how much you save in interest with early repayment, when to choose shorter term vs. lower payment, and which fees can eat into your savings.",
    category: "finanzas",
    date: "2026-06-06",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "amortizacion-anticipada",
  },
  {
    slug: "como-calcular-salario-neto-espana",
    enSlug: "how-to-calculate-net-salary-spain",
    title: "Cómo calcular tu salario neto en España: del bruto al bolsillo",
    enTitle: "How to Calculate Your Net Salary in Spain: From Gross to Take-Home",
    description: "Explicamos las cotizaciones a la Seguridad Social y la retención del IRPF que se descuentan de tu nómina, con un ejemplo completo para un salario de 30.000 € brutos.",
    enDescription: "We explain the Social Security contributions and income tax withholding deducted from your payslip, with a full worked example for a €30,000 gross salary.",
    category: "finanzas",
    date: "2026-06-07",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "salario-neto",
  },
  {
    slug: "iva-tipos-espana-guia",
    enSlug: "vat-rates-spain-guide",
    title: "Tipos de IVA en España: general, reducido y superreducido",
    enTitle: "VAT Rates in Spain: Standard, Reduced and Super-Reduced",
    description: "Guía completa sobre los tres tipos de IVA en España, qué productos y servicios incluye cada uno, y cómo calcular el IVA correctamente en tus facturas.",
    enDescription: "Complete guide to the three VAT rates in Spain, which products and services each covers, and how to correctly calculate VAT on your invoices.",
    category: "finanzas",
    date: "2026-06-08",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "iva",
  },
  {
    slug: "porcentajes-calculos-cotidianos",
    enSlug: "percentage-calculations-everyday-use",
    title: "Cómo calcular porcentajes: los 4 casos que necesitas dominar",
    enTitle: "How to Calculate Percentages: The 4 Cases You Need to Master",
    description: "Descuentos, aumentos, variaciones y proporciones. Los cuatro tipos de cálculo de porcentajes más comunes explicados con ejemplos prácticos del día a día.",
    enDescription: "Discounts, increases, variations and proportions. The four most common types of percentage calculation explained with practical everyday examples.",
    category: "finanzas",
    date: "2026-06-09",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "porcentajes",
  },
  {
    slug: "prestamo-personal-como-comparar",
    enSlug: "personal-loan-how-to-compare",
    title: "Préstamo personal: cómo comparar ofertas y evitar errores costosos",
    enTitle: "Personal Loan: How to Compare Offers and Avoid Costly Mistakes",
    description: "Aprende a comparar préstamos personales usando la TAE, entiende el cuadro de amortización y evita los errores más comunes que hacen que un préstamo «barato» acabe siendo caro.",
    enDescription: "Learn to compare personal loans using the APR, understand the amortisation schedule and avoid the most common mistakes that make a 'cheap' loan end up expensive.",
    category: "finanzas",
    date: "2026-06-10",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "prestamo-personal",
  },
  // ─── HOGAR ──────────────────────────────────────────────────────────────────
  {
    slug: "coste-real-tener-coche",
    enSlug: "real-cost-owning-a-car",
    title: "El coste real de tener un coche en España: mucho más que la gasolina",
    enTitle: "The Real Cost of Owning a Car in Spain: Much More Than Petrol",
    description: "Analizamos todos los gastos de un vehículo privado — combustible, seguro, impuestos, mantenimiento y depreciación — y calculamos el coste por kilómetro real.",
    enDescription: "We analyse all the costs of a private vehicle — fuel, insurance, taxes, maintenance and depreciation — and calculate the true cost per kilometre.",
    category: "hogar",
    date: "2026-06-11",
    relatedCalcCategory: "hogar",
    relatedCalcSlug: "gasto-coche",
  },
  {
    slug: "como-reducir-factura-luz",
    enSlug: "how-to-reduce-electricity-bill",
    title: "Cómo reducir la factura de la luz: guía práctica por electrodoméstico",
    enTitle: "How to Reduce Your Electricity Bill: A Practical Guide by Appliance",
    description: "Identifica qué electrodomésticos consumen más, entiende cómo se calcula el kWh y aplica los trucos que realmente funcionan para bajar tu factura eléctrica.",
    enDescription: "Identify which appliances consume the most, understand how kWh is calculated and apply the tricks that really work to lower your electricity bill.",
    category: "hogar",
    date: "2026-06-12",
    relatedCalcCategory: "hogar",
    relatedCalcSlug: "consumo-electrico",
  },
  // ─── TRABAJO ────────────────────────────────────────────────────────────────
  {
    slug: "que-incluye-finiquito-como-calcularlo",
    enSlug: "what-is-in-severance-payment-spain",
    title: "Qué incluye el finiquito y cómo calcularlo correctamente",
    enTitle: "What Is Included in a Severance Payment in Spain and How to Calculate It",
    description: "Salario pendiente, pagas extra proporcionales y vacaciones no disfrutadas: así se calcula el finiquito en España, con un ejemplo paso a paso.",
    enDescription: "Outstanding salary, pro-rata bonus and unused holiday: this is how the severance payment is calculated in Spain, with a step-by-step example.",
    category: "trabajo",
    date: "2026-06-13",
    relatedCalcCategory: "trabajo",
    relatedCalcSlug: "finiquito",
  },
  {
    slug: "cuota-autonomo-2026-tramos",
    enSlug: "self-employed-contribution-2026-brackets",
    title: "Cuota de autónomo 2026: tramos por ingresos reales y novedades",
    enTitle: "Self-Employed Contribution 2026: Income Brackets and What's New",
    description: "El sistema de cotización de autónomos por rendimientos netos en España, con los 15 tramos de 2026, la tarifa plana y los pasos para calcular tu cuota mensual.",
    enDescription: "Spain's self-employed contribution system based on actual net income, with the 15 brackets for 2026, the flat rate and steps to calculate your monthly contribution.",
    category: "trabajo",
    date: "2026-06-14",
    relatedCalcCategory: "trabajo",
    relatedCalcSlug: "autonomos",
  },
  {
    slug: "prestacion-desempleo-paro-como-calcular",
    enSlug: "unemployment-benefit-spain-how-to-calculate",
    title: "Prestación por desempleo en España: importe, duración y cómo solicitarla",
    enTitle: "Unemployment Benefit in Spain: Amount, Duration and How to Apply",
    description: "Todo lo que necesitas saber sobre el paro contributivo: cómo se calcula el importe, cuánto dura según los meses cotizados y los pasos para solicitarlo al SEPE.",
    enDescription: "Everything you need to know about contributory unemployment benefit: how the amount is calculated, how long it lasts by months contributed and how to apply to the SEPE.",
    category: "trabajo",
    date: "2026-06-15",
    relatedCalcCategory: "trabajo",
    relatedCalcSlug: "paro",
  },
  {
    slug: "pension-jubilacion-espana-como-funciona",
    enSlug: "retirement-pension-spain-how-it-works",
    title: "La pensión de jubilación en España: cómo funciona y cuánto cobrarás",
    enTitle: "Retirement Pension in Spain: How It Works and How Much You Will Receive",
    description: "Explicamos el cálculo de la pensión pública de jubilación: base reguladora, porcentaje según años cotizados, edad de jubilación y cómo estimar tu pensión futura.",
    enDescription: "We explain how the public retirement pension is calculated: regulatory base, percentage by years contributed, retirement age and how to estimate your future pension.",
    category: "trabajo",
    date: "2026-06-16",
    relatedCalcCategory: "trabajo",
    relatedCalcSlug: "pension",
  },
  {
    slug: "dias-entre-fechas-plazos-legales",
    enSlug: "days-between-dates-legal-deadlines",
    title: "Días entre fechas: cómo contar plazos legales y laborales",
    enTitle: "Days Between Dates: How to Count Legal and Employment Deadlines",
    description: "Aprende la diferencia entre días naturales y hábiles, cómo cuentan los festivos y los fines de semana en los plazos legales, y evita errores costosos con fechas límite.",
    enDescription: "Learn the difference between calendar days and working days, how public holidays and weekends count in legal deadlines, and avoid costly mistakes with cut-off dates.",
    category: "trabajo",
    date: "2026-06-17",
    relatedCalcCategory: "trabajo",
    relatedCalcSlug: "dias-entre-fechas",
  },
  {
    slug: "registro-jornada-horas-trabajadas",
    enSlug: "working-hours-tracking-spain",
    title: "Registro de jornada obligatorio en España: qué es y cómo cumplir la ley",
    enTitle: "Mandatory Working Time Recording in Spain: What It Is and How to Comply",
    description: "Desde 2019 todas las empresas deben registrar la jornada de sus trabajadores. Te explicamos qué exige la ley, cuánto vale una sanción y qué métodos son válidos.",
    enDescription: "Since 2019 all companies must record their employees' working hours. We explain what the law requires, how much a penalty costs and which methods are valid.",
    category: "trabajo",
    date: "2026-06-18",
    relatedCalcCategory: "trabajo",
    relatedCalcSlug: "horas-trabajadas",
  },
  // ─── EDUCACION ──────────────────────────────────────────────────────────────
  {
    slug: "teorema-pitagoras-aplicaciones-reales",
    enSlug: "pythagorean-theorem-real-applications",
    title: "El teorema de Pitágoras: más allá del triángulo rectángulo del colegio",
    enTitle: "The Pythagorean Theorem: Beyond the Right-Angled Triangle at School",
    description: "Descubre por qué el teorema de Pitágoras es mucho más que un ejercicio de geometría: arquitectura, GPS, pantallas, y cómo se usa en problemas reales.",
    enDescription: "Discover why the Pythagorean theorem is much more than a geometry exercise: architecture, GPS, screens and how it is used in real-world problems.",
    category: "educacion",
    date: "2026-06-19",
    relatedCalcCategory: "educacion",
    relatedCalcSlug: "pitagoras",
  },
  {
    slug: "regla-de-tres-directa-inversa",
    enSlug: "rule-of-three-direct-inverse",
    title: "Regla de tres directa e inversa: cuándo usar cada una con ejemplos",
    enTitle: "Direct and Inverse Rule of Three: When to Use Each with Examples",
    description: "La diferencia entre proporcionalidad directa e inversa, cómo identificar cuál aplicar en cada problema y ejercicios resueltos de precio, velocidad, mezclas y más.",
    enDescription: "The difference between direct and inverse proportion, how to identify which applies to each problem, and solved exercises on price, speed, mixtures and more.",
    category: "educacion",
    date: "2026-06-20",
    relatedCalcCategory: "educacion",
    relatedCalcSlug: "regla-de-tres",
  },
  {
    slug: "nota-media-ponderada-universidad",
    enSlug: "weighted-grade-average-university",
    title: "Cómo calcular la nota media ponderada para acceso a másters y oposiciones",
    enTitle: "How to Calculate Weighted Grade Average for Master's and Public Exam Applications",
    description: "La diferencia entre media aritmética y ponderada, cómo influyen los créditos ECTS en el cálculo y por qué la nota media puede ser distinta según quién la calcule.",
    enDescription: "The difference between arithmetic mean and weighted average, how ECTS credits influence the calculation and why the grade average can differ depending on who calculates it.",
    category: "educacion",
    date: "2026-06-21",
    relatedCalcCategory: "educacion",
    relatedCalcSlug: "nota-media",
  },
  {
    slug: "mru-mrua-fisica-ejemplos",
    enSlug: "uniform-motion-physics-examples",
    title: "MRU y MRUA: diferencias, fórmulas y ejemplos resueltos",
    enTitle: "URM and UARM: Differences, Formulas and Solved Examples",
    description: "Explicamos las diferencias entre movimiento rectilíneo uniforme y uniformemente acelerado, con las fórmulas cinemáticas y ejercicios resueltos paso a paso.",
    enDescription: "We explain the differences between uniform rectilinear motion and uniformly accelerated motion, with kinematic formulas and step-by-step solved exercises.",
    category: "educacion",
    date: "2026-06-22",
    relatedCalcCategory: "educacion",
    relatedCalcSlug: "mru",
  },
  {
    slug: "conversor-unidades-guia-completa",
    enSlug: "unit-converter-complete-guide",
    title: "Conversión de unidades: los errores más comunes y cómo evitarlos",
    enTitle: "Unit Conversion: The Most Common Mistakes and How to Avoid Them",
    description: "Miles, millas marinas, grados Fahrenheit, libras troy... Los errores de conversión de unidades pueden costar vidas. Te explicamos los factores exactos y los errores más frecuentes.",
    enDescription: "Nautical miles, troy ounces, Fahrenheit, knots... Unit conversion errors can cost lives. We explain the exact factors and the most common mistakes.",
    category: "educacion",
    date: "2026-06-23",
    relatedCalcCategory: "educacion",
    relatedCalcSlug: "conversor-unidades",
  },
  {
    slug: "como-calcular-letra-dni",
    enSlug: "how-to-calculate-dni-letter",
    category: "educacion",
    date: "2026-06-30",
    relatedCalcSlug: "letra-dni",
    relatedCalcCategory: "educacion",

    title: "Cómo se calcula la letra del DNI (y por qué existe)",
    description:
      "La letra del DNI español no es aleatoria: se obtiene dividiendo el número entre 23 y mirando el resto. Te explicamos el algoritmo completo, la tabla de letras y por qué se eligió este sistema.",
    enTitle: "How the Spanish DNI letter is calculated (and why it exists)",
    enDescription:
      "The letter in a Spanish DNI is not random: it is obtained by dividing the number by 23 and looking up the remainder. We explain the full algorithm, the letter table, and why this system was chosen.",
  },
  {
    slug: "mrua-movimiento-uniformemente-acelerado",
    enSlug: "mrua-uniformly-accelerated-motion",
    category: "educacion",
    date: "2026-06-30",
    relatedCalcSlug: "mrua",
    relatedCalcCategory: "educacion",

    title: "MRUA: qué es el movimiento uniformemente acelerado y cómo se calcula",
    description:
      "El MRUA describe objetos que cambian de velocidad de forma constante: una pelota en caída libre, un coche que frena, un tren que arranca. Te explicamos las 4 ecuaciones cinemáticas y cómo aplicarlas.",
    enTitle: "MRUA: what is uniformly accelerated motion and how to calculate it",
    enDescription:
      "MRUA describes objects that change speed at a constant rate: a ball in free fall, a braking car, a departing train. We explain the 4 kinematic equations and how to apply them.",
  },
];

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=400&q=80`;

export const ARTICLE_IMAGES: Record<string, string> = {
  // Salud
  "que-es-el-imc":                              U("1571019613454-1cb2f99b2d8b"),
  "cuantas-calorias-necesito-al-dia":           U("1490645935967-10de6ba17061"),
  "cuanta-agua-debo-beber-al-dia":              U("1548839140-29a749e1cf4d"),
  "frecuencia-cardiaca-maxima-zonas-entrenamiento": U("1476480862126-209bfaa8edc8"),
  // Finanzas
  "como-calcular-cuota-hipoteca":               U("1560518883-ce09059eeffa"),
  "que-es-la-tae-diferencia-tin":               U("1554224154-26032ffc0d07"),
  "como-funciona-interes-compuesto":            U("1611974789855-9c2a0a7236a3"),
  "irpf-como-funciona-retencion-nomina":        U("1568598035424-7070b67317d2"),
  "alquilar-o-comprar-vivienda":                U("1570129477492-45c003edd2be"),
  "amortizacion-anticipada-hipoteca-ahorro":    U("1560520031-3a4dc4e9de0c"),
  "como-calcular-salario-neto-espana":          U("1579621970795-87facc2f976d"),
  "iva-tipos-espana-guia":                      U("1556742049-0cfed4f6a45d"),
  "porcentajes-calculos-cotidianos":            U("1551288049-bebda4e38f71"),
  "prestamo-personal-como-comparar":            U("1563986768609-322da13575f3"),
  // Hogar
  "coste-real-tener-coche":                     U("1494976388531-d1058494cdd8"),
  "como-reducir-factura-luz":                   U("1466611653911-95081537e5b7"),
  // Trabajo
  "que-incluye-finiquito-como-calcularlo":      U("1450101499163-c8848c66ca85"),
  "cuota-autonomo-2026-tramos":                 U("1522202176988-66273c2fd55f"),
  "prestacion-desempleo-paro-como-calcular":    U("1507679799987-c73779587ccf"),
  "pension-jubilacion-espana-como-funciona":    U("1573496546038-82f9c39f6365"),
  "registro-jornada-horas-trabajadas":          U("1484480974693-6ca0a78fb36b"),
  "como-calcular-letra-dni":                    U("1614680376408-81e91ffe3db7"),
  // Educación
  "dias-entre-fechas-plazos-legales":           U("1506784983877-45594efa4cbe"),
  "teorema-pitagoras-aplicaciones-reales":      U("1509228468518-180dd4864904"),
  "regla-de-tres-directa-inversa":              U("1635070041078-e363dbe005cb"),
  "nota-media-ponderada-universidad":           U("1427504494785-3a9ca7044f45"),
  "mru-mrua-fisica-ejemplos":                   U("1446776858070-70c3d5ed6758"),
  "conversor-unidades-guia-completa":           U("1504868584819-f8e8b4b6d7e3"),
  "mrua-movimiento-uniformemente-acelerado":    U("1518770660439-4636190af475"),
};

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug || a.enSlug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return ARTICLES.filter((a) => a.category === category);
}


/** Primary/official reference sources shown as "Fuentes y referencias" at the
 * end of YMYL articles (finance, work, health). Keyed by the ES slug. Only real
 * official bodies, legal texts (BOE) and peer-reviewed references are used. */
export interface ArticleSource { es: string; en: string; url: string; }

const S = {
  oms:   { es: "OMS — Organización Mundial de la Salud", en: "WHO — World Health Organization", url: "https://www.who.int/" },
  efsa:  { es: "EFSA — Autoridad Europea de Seguridad Alimentaria", en: "EFSA — European Food Safety Authority", url: "https://www.efsa.europa.eu/" },
  aeat:  { es: "Agencia Tributaria (AEAT)", en: "Spanish Tax Agency (AEAT)", url: "https://sede.agenciatributaria.gob.es/" },
  bde:   { es: "Banco de España", en: "Bank of Spain", url: "https://www.bde.es/" },
  ss:    { es: "Seguridad Social", en: "Spanish Social Security", url: "https://www.seg-social.es/" },
  sepe:  { es: "SEPE — Servicio Público de Empleo Estatal", en: "SEPE — Spanish Public Employment Service", url: "https://www.sepe.es/" },
  et:    { es: "Estatuto de los Trabajadores (BOE)", en: "Workers' Statute (BOE)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430" },
  ley5:  { es: "Ley 5/2019 de crédito inmobiliario (BOE)", en: "Law 5/2019 on real estate credit (BOE)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2019-3814" },
  rdl8:  { es: "Real Decreto-ley 8/2019 (BOE)", en: "Royal Decree-Law 8/2019 (BOE)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2019-3481" },
  ley39: { es: "Ley 39/2015 del Procedimiento Administrativo (BOE)", en: "Law 39/2015 on Administrative Procedure (BOE)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10565" },
  bipm:  { es: "BIPM — Sistema Internacional de Unidades (SI)", en: "BIPM — International System of Units (SI)", url: "https://www.bipm.org/en/measurement-units" },
  tanaka:{ es: "Tanaka et al. (2001), J Am Coll Cardiol", en: "Tanaka et al. (2001), J Am Coll Cardiol", url: "https://doi.org/10.1016/S0735-1097(00)01054-8" },
  mifflin:{ es: "Mifflin-St Jeor (1990), Am J Clin Nutr", en: "Mifflin-St Jeor (1990), Am J Clin Nutr", url: "https://doi.org/10.1093/ajcn/51.2.241" },
  dgt:   { es: "DGT — Dirección General de Tráfico", en: "DGT — Spanish traffic authority", url: "https://www.dgt.es/" },
  carb:  { es: "Portal de precios de carburantes (Gobierno de España)", en: "Government fuel-price portal", url: "https://geoportalgasolineras.es/" },
  esios: { es: "ESIOS — Red Eléctrica de España", en: "ESIOS — Red Eléctrica de España", url: "https://www.esios.ree.es/es/pvpc" },
  idae:  { es: "IDAE — Instituto para la Diversificación y Ahorro de la Energía", en: "IDAE — Spanish energy agency", url: "https://www.idae.es/" },
  trabajo:{ es: "Ministerio de Trabajo y Economía Social", en: "Spanish Ministry of Labour", url: "https://www.mites.gob.es/" },
  interior:{ es: "Ministerio del Interior — DNI/NIE", en: "Spanish Ministry of the Interior — DNI/NIE", url: "https://www.interior.gob.es/" },
} as const;

export const ARTICLE_SOURCES: Record<string, ArticleSource[]> = {
  "que-es-el-imc": [S.oms],
  "cuantas-calorias-necesito-al-dia": [S.mifflin, S.oms],
  "cuanta-agua-debo-beber-al-dia": [S.efsa, S.oms],
  "frecuencia-cardiaca-maxima-zonas-entrenamiento": [S.tanaka, S.oms],
  "como-calcular-cuota-hipoteca": [S.bde, S.ley5],
  "que-es-la-tae-diferencia-tin": [S.bde],
  "como-funciona-interes-compuesto": [S.bde],
  "irpf-como-funciona-retencion-nomina": [S.aeat],
  "alquilar-o-comprar-vivienda": [S.bde],
  "amortizacion-anticipada-hipoteca-ahorro": [S.bde, S.ley5],
  "como-calcular-salario-neto-espana": [S.aeat, S.ss],
  "iva-tipos-espana-guia": [S.aeat],
  "prestamo-personal-como-comparar": [S.bde],
  "coste-real-tener-coche": [S.dgt, S.carb],
  "como-reducir-factura-luz": [S.esios, S.idae],
  "que-incluye-finiquito-como-calcularlo": [S.et, S.trabajo],
  "cuota-autonomo-2026-tramos": [S.ss],
  "prestacion-desempleo-paro-como-calcular": [S.sepe],
  "pension-jubilacion-espana-como-funciona": [S.ss],
  "dias-entre-fechas-plazos-legales": [S.ley39],
  "registro-jornada-horas-trabajadas": [S.rdl8, S.trabajo],
  "conversor-unidades-guia-completa": [S.bipm],
  "como-calcular-letra-dni": [S.interior],
};

/**
 * Minutos de lectura estimados a partir del texto real del artículo, a 200
 * palabras por minuto. Se calcula en lugar de fijarse a mano para que no se
 * desincronice al editar un artículo.
 */
