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
  /** Extra calculators this guide also covers, as "categoria/slug". They show
   * the guide in their "Guía relacionada" block after merging short articles. */
  alsoCalcs?: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "que-es-el-imc",
    enSlug: "what-is-bmi",
    category: "salud",
    date: "2026-06-28",
    relatedCalcSlug: "imc",
    relatedCalcCategory: "salud",

    title: "Peso, calorías, hidratación y pulso: cómo leer tus números de salud",
    description:
      "Qué mide y qué no mide el IMC, cuántas calorías necesitas al día, cuánta agua beber de verdad y cómo usar las zonas de frecuencia cardíaca.",

    enTitle: "Weight, calories, hydration and heart rate: reading your health numbers",
    enDescription:
      "What BMI does and does not measure, how many calories you need a day, how much water you really need, and how to use heart rate training zones.",
    alsoCalcs: ["salud/calorias", "salud/agua-diaria", "salud/frecuencia-cardiaca"],
  },

  // ─── FINANZAS ───────────────────────────────────────────────────────────────
  {
    slug: "como-calcular-cuota-hipoteca",
    enSlug: "how-to-calculate-mortgage-payment",
    title: "La hipoteca de principio a fin: cuota, intereses y amortización anticipada",
    enTitle: "The mortgage from start to finish: payment, interest and early repayment",
    description: "Cómo se calcula la cuota de tu hipoteca, por qué al principio casi todo son intereses y cuánto ahorras de verdad si amortizas antes de tiempo.",
    enDescription: "How your mortgage payment is calculated, why almost all of it is interest at the start, and how much you really save by repaying early.",
    category: "finanzas",
    date: "2026-06-01",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "hipoteca",
    alsoCalcs: ["finanzas/amortizacion-anticipada"],
  },
  {
    slug: "que-es-la-tae-diferencia-tin",
    enSlug: "what-is-apr-difference-from-nominal-rate",
    title: "TAE, TIN y cómo comparar préstamos sin equivocarte",
    enTitle: "APR, nominal rate and how to compare loans without getting it wrong",
    description: "La diferencia entre el tipo nominal y la TAE, qué gastos incluye cada uno y cómo comparar dos ofertas de préstamo que parecen iguales y no lo son.",
    enDescription: "The difference between the nominal rate and the APR, which costs each one includes, and how to compare two loan offers that look alike but are not.",
    category: "finanzas",
    date: "2026-06-02",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "tae",
    alsoCalcs: ["finanzas/prestamo-personal"],
  },
  {
    slug: "como-funciona-interes-compuesto",
    enSlug: "how-compound-interest-works",
    title: "Interés compuesto y porcentajes: las matemáticas del ahorro",
    enTitle: "Compound interest and percentages: the maths of saving",
    description: "Por qué el tiempo importa más que la cantidad, cómo se calculan los porcentajes del día a día y qué se llevan la inflación y las comisiones.",
    enDescription: "Why time matters more than amount, how everyday percentages are calculated, and what inflation and fees quietly take away.",
    category: "finanzas",
    date: "2026-06-03",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "interes-compuesto",
    alsoCalcs: ["finanzas/porcentajes"],
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
    slug: "como-calcular-salario-neto-espana",
    enSlug: "how-to-calculate-net-salary-spain",
    title: "Tu nómina explicada: del salario bruto al neto y el IRPF que te retienen",
    enTitle: "Your payslip explained: from gross to net and the tax withheld",
    description: "Qué se descuenta exactamente de tu nómina, cómo funciona la retención del IRPF y por qué la declaración sale a devolver o a pagar.",
    enDescription: "What is actually deducted from your payslip, how income tax withholding works and why your tax return ends in a refund or a payment.",
    category: "finanzas",
    date: "2026-06-07",
    relatedCalcCategory: "finanzas",
    relatedCalcSlug: "salario-neto",
    alsoCalcs: ["finanzas/irpf"],
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
  // ─── HOGAR ──────────────────────────────────────────────────────────────────
  {
    slug: "coste-real-tener-coche",
    enSlug: "real-cost-owning-a-car",
    title: "Los dos gastos fijos que más pesan en casa: el coche y la luz",
    enTitle: "The two fixed costs that weigh most at home: your car and your electricity",
    description: "Cuánto cuesta realmente tener coche sumando depreciación, seguro y mantenimiento, y cómo entender y reducir la factura eléctrica.",
    enDescription: "What a car really costs once you add depreciation, insurance and maintenance, and how to understand and reduce your electricity bill.",
    category: "hogar",
    date: "2026-06-11",
    relatedCalcCategory: "hogar",
    relatedCalcSlug: "gasto-coche",
    alsoCalcs: ["hogar/consumo-electrico"],
  },
  // ─── TRABAJO ────────────────────────────────────────────────────────────────
  {
    slug: "que-incluye-finiquito-como-calcularlo",
    enSlug: "what-is-in-severance-payment-spain",
    title: "Fin de contrato: finiquito, paro y los plazos que empiezan a correr",
    enTitle: "End of contract: final settlement, unemployment benefit and the deadlines",
    description: "Qué conceptos integran el finiquito, cuánto y cuánto tiempo se cobra de paro, y los plazos legales que se cuentan desde tu último día de trabajo.",
    enDescription: "What makes up your final settlement, how much unemployment benefit you get and for how long, and the legal deadlines counted from your last day at work.",
    category: "trabajo",
    date: "2026-06-13",
    relatedCalcCategory: "trabajo",
    relatedCalcSlug: "finiquito",
    alsoCalcs: ["trabajo/paro", "trabajo/dias-entre-fechas"],
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
    slug: "regla-de-tres-directa-inversa",
    enSlug: "rule-of-three-direct-inverse",
    title: "Matemáticas de andar por casa: proporciones, unidades y medias ponderadas",
    enTitle: "Everyday maths: proportions, units and weighted averages",
    description: "La regla de tres directa e inversa, el teorema de Pitágoras aplicado a problemas reales, cómo convertir unidades sin liarse y cómo se pondera una nota media.",
    enDescription: "Direct and inverse rule of three, the Pythagorean theorem applied to real problems, converting units without confusion, and how a weighted grade average works.",
    category: "educacion",
    date: "2026-06-20",
    relatedCalcCategory: "educacion",
    relatedCalcSlug: "regla-de-tres",
    alsoCalcs: ["educacion/pitagoras", "educacion/nota-media", "educacion/conversor-unidades"],
  },
  {
    slug: "mru-mrua-fisica-ejemplos",
    enSlug: "uniform-motion-physics-examples",
    title: "Cinemática con ejemplos reales: movimiento uniforme y acelerado",
    enTitle: "Kinematics with real examples: uniform and accelerated motion",
    description: "MRU y MRUA explicados con trenes, frenadas y caídas libres: qué fórmula usar en cada caso, cómo leer las gráficas y dónde están los errores de signo.",
    enDescription: "Uniform and accelerated motion explained with trains, braking distances and free fall: which formula to use, how to read the graphs and where sign errors hide.",
    category: "educacion",
    date: "2026-06-22",
    relatedCalcCategory: "educacion",
    relatedCalcSlug: "mru",
    alsoCalcs: ["educacion/mrua"],
  },
  {
    slug: "como-calcular-letra-dni",
    enSlug: "how-to-calculate-dni-letter",
    category: "educacion",
    date: "2026-06-30",
    relatedCalcSlug: "letra-dni",
    relatedCalcCategory: "trabajo",

    title: "Cómo se calcula la letra del DNI (y por qué existe)",
    description:
      "La letra del DNI español no es aleatoria: se obtiene dividiendo el número entre 23 y mirando el resto. Te explicamos el algoritmo completo, la tabla de letras y por qué se eligió este sistema.",
    enTitle: "How the Spanish DNI letter is calculated (and why it exists)",
    enDescription:
      "The letter in a Spanish DNI is not random: it is obtained by dividing the number by 23 and looking up the remainder. We explain the full algorithm, the letter table, and why this system was chosen.",
  },
];

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=400&q=80`;

export const ARTICLE_IMAGES: Record<string, string> = {
  // Salud
  "que-es-el-imc":                              U("1571019613454-1cb2f99b2d8b"),
  // Finanzas
  "como-calcular-cuota-hipoteca":               U("1560518883-ce09059eeffa"),
  "que-es-la-tae-diferencia-tin":               U("1554224154-26032ffc0d07"),
  "como-funciona-interes-compuesto":            U("1611974789855-9c2a0a7236a3"),
  "alquilar-o-comprar-vivienda":                U("1570129477492-45c003edd2be"),
  "como-calcular-salario-neto-espana":          U("1579621970795-87facc2f976d"),
  "iva-tipos-espana-guia":                      U("1556742049-0cfed4f6a45d"),
  // Hogar
  "coste-real-tener-coche":                     U("1494976388531-d1058494cdd8"),
  // Trabajo
  "que-incluye-finiquito-como-calcularlo":      U("1450101499163-c8848c66ca85"),
  "cuota-autonomo-2026-tramos":                 U("1522202176988-66273c2fd55f"),
  "pension-jubilacion-espana-como-funciona":    U("1573496546038-82f9c39f6365"),
  "registro-jornada-horas-trabajadas":          U("1484480974693-6ca0a78fb36b"),
  "como-calcular-letra-dni":                    U("1614680376408-81e91ffe3db7"),
  // Educación
  "regla-de-tres-directa-inversa":              U("1635070041078-e363dbe005cb"),
  "mru-mrua-fisica-ejemplos":                   U("1446776858070-70c3d5ed6758"),
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
  "que-es-el-imc": [S.oms, S.mifflin, S.efsa, S.tanaka],
  "como-calcular-cuota-hipoteca": [S.bde, S.ley5],
  "que-es-la-tae-diferencia-tin": [S.bde],
  "como-funciona-interes-compuesto": [S.bde],
  "alquilar-o-comprar-vivienda": [S.bde],
  "como-calcular-salario-neto-espana": [S.aeat, S.ss],
  "iva-tipos-espana-guia": [S.aeat],
  "coste-real-tener-coche": [S.dgt, S.carb, S.esios, S.idae],
  "que-incluye-finiquito-como-calcularlo": [S.et, S.trabajo, S.sepe, S.ley39],
  "cuota-autonomo-2026-tramos": [S.ss],
  "pension-jubilacion-espana-como-funciona": [S.ss],
  "registro-jornada-horas-trabajadas": [S.rdl8, S.trabajo],
  "como-calcular-letra-dni": [S.interior],
};

/**
 * Minutos de lectura estimados a partir del texto real del artículo, a 200
 * palabras por minuto. Se calcula en lugar de fijarse a mano para que no se
 * desincronice al editar un artículo.
 */
