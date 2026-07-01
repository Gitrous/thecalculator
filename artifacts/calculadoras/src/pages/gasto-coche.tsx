import { useState } from "react";
import { Link } from "wouter";
import { Car, Lightbulb, ArrowRight, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

// Programmatic SVG export — no recharts needed
function downloadBreakdownSvg(
  breakdown: { name: string; value: number; color: string }[],
  titleStr: string,
  fmtFn: (n: number) => string,
  filename: string,
) {
  const total = breakdown.reduce((s, b) => s + b.value, 0);
  if (total === 0) return;
  const W = 580, barH = 30, gap = 14, labelW = 170, metaW = 130;
  const contentW = W - labelW - metaW - 30;
  const H = breakdown.length * (barH + gap) + 90;

  const rows = breakdown.map((item, i) => {
    const y = 65 + i * (barH + gap);
    const bw = (item.value / total) * contentW;
    const pct = Math.round((item.value / total) * 100);
    return `
      <text x="${labelW - 8}" y="${y + barH / 2 + 5}" font-family="system-ui,sans-serif" font-size="13" fill="#555" text-anchor="end">${item.name}</text>
      <rect x="${labelW}" y="${y}" width="${contentW}" height="${barH}" rx="5" fill="#f3f4f6"/>
      <rect x="${labelW}" y="${y}" width="${Math.max(bw, 4)}" height="${barH}" rx="5" fill="${item.color}"/>
      <text x="${labelW + contentW + 10}" y="${y + barH / 2 + 5}" font-family="system-ui,sans-serif" font-size="12" fill="#374151">${pct}% · ${fmtFn(item.value)}</text>
    `;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="white"/>
    <text x="${W / 2}" y="28" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" font-weight="600" fill="#111">${titleStr}</text>
    <text x="${W / 2}" y="48" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#777">Total: ${fmtFn(total)}</text>
    ${rows}
  </svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `${filename}.svg`;
  a.href = url;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Input with right-side unit label
function AmountInput({
  label, value, onChange, unit, placeholder = "0",
}: {
  label: string; value: string; onChange: (v: string) => void;
  unit: string; placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          min="0"
          step="any"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-14 bg-white dark:bg-white/5"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
          {unit}
        </span>
      </div>
    </div>
  );
}

const T = {
  es: {
    title: "Gasto Real del Coche",
    subtitle: "Calcula el coste total de mantener tu vehículo, incluyendo gastos ocultos y coste por kilómetro.",
    intro1: "El coste real de un coche va mucho más allá del combustible y el seguro. Incluye la financiación o amortización del vehículo, el aparcamiento, el mantenimiento y las revisiones, el impuesto de circulación y la ITV. Muchos conductores infravaloran en un 30–50% el coste real de su vehículo al no tener en cuenta todos estos conceptos de forma conjunta.",
    intro2: "Esta calculadora te ayuda a conocer el coste mensual total y el coste por kilómetro, los dos indicadores más útiles para comparar el coche propio con alternativas como el transporte público, el carsharing o el alquiler de vehículos.",
    drivingDetails: "Detalles de Conducción",
    fixedCosts: "Costes Fijos Anuales",
    consumoLabel: "Consumo (l/100km)",
    kmLabel: "Km anuales",
    precioLabel: "Precio combustible",
    seguroLabel: "Seguro (anual)",
    mantenimientoLabel: "Mantenimiento y neumáticos (anual)",
    impuestosLabel: "Impuestos + ITV (anual)",
    aparcamientoLabel: "Aparcamiento (mensual)",
    financiacionLabel: "Financiación / Amortización (mensual)",
    monthlyEstimation: "ESTIMACIÓN MENSUAL",
    monthlyDesc: "Calculado según tu consumo y hábitos de conducción.",
    perMonth: "/ mes",
    annualTotal: "Total Anual",
    perKm: "Coste por km",
    distribution: "Distribución de Gastos",
    downloadChart: "Descargar gráfico",
    fuel: "Combustible",
    insurance: "Seguro",
    maintenance: "Mantenimiento",
    parking: "Aparcamiento",
    financing: "Financiación",
    taxes: "Impuestos + ITV",
    proTipLabel: "EFFICIENCY PRO TIP",
    proTip: "\"Reducir la velocidad de 120 km/h a 110 km/h puede reducir el consumo hasta un 15%. En 15.000 km anuales, eso supone un ahorro de unos €150 en combustible al año.\"",
    articleTitle: "El coste real de tener un coche en España",
    articleDesc: "Analizamos todos los gastos: combustible, seguro, impuestos, mantenimiento y depreciación. ¿Sabes cuánto te cuesta cada kilómetro?",
    articleLink: "Leer artículo →",
    disclaimer: "Los importes son estimativos y dependen del uso, el modelo y las condiciones particulares de cada conductor.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué gastos incluye el coste real del coche?",
    a1: "El coste real incluye todos los gastos directos e indirectos: combustible (calculado por consumo × km × precio), seguro, mantenimiento y neumáticos, aparcamiento o garaje, impuesto de circulación, ITV y, si el coche está financiado, la cuota mensual. Muchos conductores solo cuentan el combustible y el seguro, infravalorando el verdadero coste.",
    q2: "¿Cuánto cuesta de media mantener un coche en España?",
    a2: "Según la OCU y la DGT, el coste medio de mantenimiento de un turismo en España oscila entre 3.500 € y 6.500 € al año, dependiendo del modelo, los kilómetros recorridos y si el vehículo está financiado. El coste por kilómetro suele estar entre 0,20 € y 0,45 €.",
    q3: "¿Cuándo sale a cuenta tener coche frente al transporte público?",
    a3: "El vehículo propio resulta más económico cuando se recorren muchos kilómetros al año (más de 15.000-20.000), se vive en una zona con mala red de transporte público o se comparten trayectos. En ciudades con buenas redes de metro y autobús, el abono de transporte puede ser hasta 4 veces más barato.",
    q4: "¿Cómo puedo reducir el coste de mi coche?",
    a4: "Las principales palancas para reducir el coste son: conducción eficiente (velocidad constante, anticipación en frenadas, presión de neumáticos correcta), comparar seguros anualmente, revisar el precio del combustible por zonas, y considerar un vehículo más eficiente o eléctrico si tu consumo anual es elevado.",
  },
  en: {
    title: "Real Car Costs",
    subtitle: "Calculate the total cost of owning your vehicle, including hidden costs and cost per kilometre.",
    intro1: "The real cost of a car goes far beyond fuel and insurance. It includes vehicle finance or depreciation, parking, maintenance and servicing, road tax and MOT. Many drivers underestimate their vehicle's real cost by 30–50% by not taking all these items into account together.",
    intro2: "This calculator helps you find the total monthly cost and cost per kilometre, the two most useful indicators for comparing your own car with alternatives such as public transport, car-sharing or vehicle rental.",
    drivingDetails: "Driving Details",
    fixedCosts: "Fixed & Yearly Costs",
    consumoLabel: "Fuel Consumption (l/100km)",
    kmLabel: "Annual Mileage (km)",
    precioLabel: "Fuel Price",
    seguroLabel: "Insurance (annual)",
    mantenimientoLabel: "Maintenance & Tyres (annual)",
    impuestosLabel: "Taxes + MOT (annual)",
    aparcamientoLabel: "Parking (monthly)",
    financiacionLabel: "Finance / Loan Payment (monthly)",
    monthlyEstimation: "MONTHLY ESTIMATION",
    monthlyDesc: "Calculated based on your specific consumption and annual driving habits.",
    perMonth: "/ month",
    annualTotal: "Annual Total",
    perKm: "Cost per KM",
    distribution: "Expense Distribution",
    downloadChart: "Download chart",
    fuel: "Fuel",
    insurance: "Insurance",
    maintenance: "Maintenance",
    parking: "Parking",
    financing: "Finance",
    taxes: "Taxes + MOT",
    proTipLabel: "EFFICIENCY PRO TIP",
    proTip: "\"Reducing your highway speed from 120km/h to 110km/h can lower fuel consumption by up to 15%. Over 15,000km, that's roughly €150 saved per year.\"",
    articleTitle: "The Real Cost of Owning a Car in Spain",
    articleDesc: "We analyse all the costs: fuel, insurance, taxes, maintenance and depreciation. Do you know how much each kilometre actually costs you?",
    articleLink: "Read article →",
    disclaimer: "Amounts are estimates and depend on usage, model and the specific circumstances of each driver.",
    faqTitle: "Frequently asked questions",
    q1: "What expenses make up the real cost of a car?",
    a1: "The real cost includes all direct and indirect expenses: fuel (calculated from consumption × km × price), insurance, maintenance and tyres, parking or garage fees, road tax, MOT and, if the car is financed, the monthly repayment. Many drivers only count fuel and insurance, underestimating the true cost.",
    q2: "How much does it cost on average to run a car in Spain?",
    a2: "According to the OCU and DGT, the average cost of running a standard car in Spain ranges from €3,500 to €6,500 per year, depending on the model, kilometres driven and whether the vehicle is financed. The cost per kilometre is typically between €0.20 and €0.45.",
    q3: "When is owning a car cheaper than public transport?",
    a3: "A private vehicle is more economical when you cover a lot of kilometres per year (more than 15,000–20,000), you live in an area with poor public transport, or you share journeys. In cities with good metro and bus networks, a transit pass can be up to four times cheaper.",
    q4: "How can I reduce my car running costs?",
    a4: "The main levers to reduce costs are: efficient driving (steady speed, anticipating braking, correct tyre pressure), comparing insurance annually, checking fuel prices by area, and considering a more efficient or electric vehicle if your annual mileage is high.",
  },
};

const COLORS = {
  fuel: "#3b82f6",
  insurance: "#f59e0b",
  maintenance: "#10b981",
  parking: "#8b5cf6",
  financing: "#6b7280",
  taxes: "#ef4444",
};

export default function GastoCoche() {
  const locale = useLocale();
  const isEn = locale === "en";
  const t = T[locale];

  const [consumo, setConsumo] = useState("");
  const [km, setKm] = useState("");
  const [precio, setPrecio] = useState("");
  const [seguro, setSeguro] = useState("");
  const [mantenimiento, setMantenimiento] = useState("");
  const [impuestos, setImpuestos] = useState("");
  const [aparcamiento, setAparcamiento] = useState("");
  const [financiacion, setFinanciacion] = useState("");

  const v = (s: string) => parseFloat(s) || 0;

  const combustibleAnual = (v(consumo) / 100) * v(km) * v(precio);
  const seguroAnual = v(seguro);
  const mantenimientoAnual = v(mantenimiento);
  const impuestosAnual = v(impuestos);
  const aparcamientoAnual = v(aparcamiento) * 12;
  const financiacionAnual = v(financiacion) * 12;

  const totalAnual =
    combustibleAnual + seguroAnual + mantenimientoAnual +
    impuestosAnual + aparcamientoAnual + financiacionAnual;
  const totalMensual = totalAnual / 12;
  const costePorKm = v(km) > 0 ? totalAnual / v(km) : 0;

  const breakdown = [
    { key: "fuel", name: t.fuel, value: combustibleAnual, color: COLORS.fuel },
    { key: "insurance", name: t.insurance, value: seguroAnual, color: COLORS.insurance },
    { key: "maintenance", name: t.maintenance, value: mantenimientoAnual, color: COLORS.maintenance },
    { key: "parking", name: t.parking, value: aparcamientoAnual, color: COLORS.parking },
    { key: "financing", name: t.financing, value: financiacionAnual, color: COLORS.financing },
    { key: "taxes", name: t.taxes, value: impuestosAnual, color: COLORS.taxes },
  ].filter((b) => b.value > 0);

  const fmtEur = (n: number) =>
    n.toLocaleString(isEn ? "en-GB" : "es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
  const fmtKm = (n: number) =>
    n.toLocaleString(isEn ? "en-GB" : "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

  const articleHref = isEn ? "/en/blog/real-cost-owning-a-car" : "/blog/coste-real-tener-coche";

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
          <Car className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* LEFT: inputs */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">

          {/* Driving Details */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-sm">{t.drivingDetails}</span>
            </div>
            <div className="space-y-4">
              <AmountInput label={t.consumoLabel} value={consumo} onChange={setConsumo} unit="L/100" />
              <AmountInput label={t.kmLabel} value={km} onChange={setKm} unit="km" />
              <AmountInput label={t.precioLabel} value={precio} onChange={setPrecio} unit="€/L" />
            </div>
          </div>

          {/* Fixed Costs */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                <span className="text-sm">📋</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-sm">{t.fixedCosts}</span>
            </div>
            <div className="space-y-4">
              <AmountInput label={t.seguroLabel} value={seguro} onChange={setSeguro} unit="€" />
              <AmountInput label={t.mantenimientoLabel} value={mantenimiento} onChange={setMantenimiento} unit="€" />
              <AmountInput label={t.impuestosLabel} value={impuestos} onChange={setImpuestos} unit="€" />
              <AmountInput label={t.aparcamientoLabel} value={aparcamiento} onChange={setAparcamiento} unit="€/mes" />
              <AmountInput label={t.financiacionLabel} value={financiacion} onChange={setFinanciacion} unit="€/mes" />
            </div>
          </div>
        </div>

        {/* RIGHT: results */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Monthly headline */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{t.monthlyEstimation}</p>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-bold text-gray-900 dark:text-white">
                {fmtEur(totalMensual)}
              </span>
              <span className="text-lg text-gray-400">{t.perMonth}</span>
            </div>
            <p className="text-sm text-gray-400 mb-5">{t.monthlyDesc}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.annualTotal}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{fmtEur(totalAnual)}</p>
              </div>
              <div className="rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.perKm}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{fmtKm(costePorKm)}</p>
              </div>
            </div>
          </div>

          {/* Expense distribution */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm">{t.distribution}</h2>
              <button
                onClick={() => downloadBreakdownSvg(breakdown, t.distribution, fmtEur, "grafico-gasto-coche")}
                title={t.downloadChart}
                className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {breakdown.length > 0 ? (
              <div className="space-y-4">
                {breakdown.map((item) => {
                  const pct = totalAnual > 0 ? (item.value / totalAnual) * 100 : 0;
                  return (
                    <div key={item.key}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {Math.round(pct)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
                {isEn ? "Fill in your expenses to see the distribution." : "Introduce tus gastos para ver la distribución."}
              </div>
            )}
          </div>

          {/* Pro Tip */}
          <div className="rounded-r-2xl border border-gray-200 dark:border-white/10 border-l-4 border-l-amber-400 bg-amber-50 dark:bg-amber-900/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                {t.proTipLabel}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">{t.proTip}</p>
          </div>

          {/* Article promo (replaces "Considering an EV?") */}
          <Link href={articleHref} className="block group">
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gradient-to-br from-purple-600 to-purple-800 p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-base font-bold text-white mb-2">{t.articleTitle}</h3>
              <p className="text-sm text-purple-200 mb-4 leading-relaxed">{t.articleDesc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                {t.articleLink} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic mt-8 mb-2">{t.disclaimer}</p>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          {(["q1", "q2", "q3", "q4"] as const).map((q) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger>{t[q]}</AccordionTrigger>
              <AccordionContent>{t[`a${q.slice(1)}` as keyof typeof t]}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
