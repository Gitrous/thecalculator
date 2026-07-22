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
    q5: "¿Qué es la depreciación y por qué no aparece en el cálculo?",
    a5: "La depreciación es la pérdida de valor del vehículo con el paso del tiempo y suele ser el mayor coste oculto de tener coche, aunque no se paga mes a mes. Un turismo nuevo pierde en torno al 20-25 % de su valor el primer año y alrededor del 50 % a los cinco años. Esta calculadora se centra en los gastos corrientes que sí desembolsas cada mes, pero si quieres conocer el coste total de propiedad deberías sumar la depreciación anual: para un coche de 25.000 € que valdrá 12.500 € en cinco años, son 2.500 € adicionales al año.",
    q6: "¿Sale más barato un coche eléctrico?",
    a6: "Depende sobre todo de los kilómetros que recorras y de dónde recargues. En consumo, un eléctrico gasta unos 15-20 kWh cada 100 km: recargando en casa con tarifa valle el coste ronda los 2-3 € por cada 100 km, frente a los 8-10 € de un gasolina equivalente. El mantenimiento también es menor, al no haber cambios de aceite, filtros ni embrague. En contra juegan un precio de compra más alto y una depreciación históricamente más rápida. La regla general es que el eléctrico compensa a partir de unos 15.000 km anuales si puedes recargar en casa.",
    deepTitle: "Cómo se calcula el coste real de un coche",
    deep: "El cálculo suma dos bloques. El primero es el gasto variable, que depende directamente de los kilómetros que recorres: el combustible se obtiene multiplicando tu consumo medio (litros cada 100 km) por los kilómetros anuales y por el precio del carburante, dividido entre cien. El segundo bloque son los gastos fijos, que pagas conduzcas mucho o poco: seguro, impuesto de circulación, ITV, mantenimiento programado, neumáticos, aparcamiento y, si procede, la cuota de financiación. La suma de ambos dividida entre los kilómetros anuales da el coste por kilómetro, que es la cifra más útil para comparar alternativas de transporte.",
    exampleTitle: "Ejemplo resuelto",
    example: "Un conductor recorre 15.000 km al año con un coche que consume 6 l/100 km y paga el gasóleo a 1,50 €/l. El combustible le cuesta (6 × 15.000 / 100) × 1,50 = 900 × 1,50 = 1.350 € anuales. A eso suma 450 € de seguro, 120 € de impuesto de circulación, 45 € de ITV prorrateada, 400 € de mantenimiento y neumáticos y 600 € de parking: 1.615 € de gastos fijos. El total asciende a 2.965 € al año, unos 247 € al mes, lo que supone un coste por kilómetro de 0,20 €.",
    tableTitle: "Coste orientativo por tipo de gasto (15.000 km/año)",
    tableCol1: "Concepto",
    tableCol2: "Coste anual",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "La cifra clave no es el total anual sino el coste por kilómetro, porque es lo que te permite comparar de forma justa con otras opciones. Si tu coste por kilómetro supera los 0,35 €, probablemente estés recorriendo pocos kilómetros para los gastos fijos que asumes: en ese escenario el transporte público, el carsharing o el alquiler puntual suelen salir más a cuenta. Por debajo de 0,25 € el coche está bien amortizado. Recuerda que este cálculo no incluye la depreciación del vehículo, que puede añadir fácilmente entre 1.500 y 3.000 € anuales en un coche relativamente nuevo y es el factor que más distorsiona las comparaciones.",
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
    q5: "What is depreciation and why isn't it in the calculation?",
    a5: "Depreciation is the loss of value of the vehicle over time and is usually the biggest hidden cost of car ownership, even though you do not pay it month by month. A new car loses around 20-25% of its value in the first year and roughly 50% after five years. This calculator focuses on the running costs you actually pay out each month, but if you want the total cost of ownership you should add annual depreciation: for a €25,000 car worth €12,500 in five years, that is an extra €2,500 a year.",
    q6: "Is an electric car cheaper?",
    a6: "It depends mainly on your mileage and where you charge. On energy, an EV uses about 15-20 kWh per 100 km: charging at home on an off-peak tariff costs around €2-3 per 100 km, against €8-10 for an equivalent petrol car. Maintenance is also lower, with no oil changes, filters or clutch. Against that, the purchase price is higher and depreciation has historically been faster. The general rule is that an EV pays off from around 15,000 km a year if you can charge at home.",
    deepTitle: "How the real cost of a car is calculated",
    deep: "The calculation adds two blocks. The first is variable spending, which depends directly on the kilometres you drive: fuel is obtained by multiplying your average consumption (litres per 100 km) by annual kilometres and by the fuel price, divided by one hundred. The second block is fixed costs, which you pay whether you drive a lot or a little: insurance, road tax, MOT, scheduled maintenance, tyres, parking and, where applicable, the finance instalment. The sum of both divided by annual kilometres gives the cost per kilometre, the most useful figure for comparing transport alternatives.",
    exampleTitle: "Worked example",
    example: "A driver covers 15,000 km a year in a car that uses 6 l/100 km, paying €1.50/l for diesel. Fuel costs (6 × 15,000 / 100) × 1.50 = 900 × 1.50 = €1,350 per year. To that they add €450 insurance, €120 road tax, €45 prorated MOT, €400 maintenance and tyres and €600 parking: €1,615 of fixed costs. The total comes to €2,965 a year, about €247 a month, giving a cost per kilometre of €0.20.",
    tableTitle: "Indicative cost by expense type (15,000 km/year)",
    tableCol1: "Item",
    tableCol2: "Annual cost",
    interpretTitle: "How to interpret the result",
    interpret: "The key figure is not the annual total but the cost per kilometre, because that is what lets you compare fairly with other options. If your cost per kilometre exceeds €0.35, you are probably driving too few kilometres for the fixed costs you carry: in that scenario public transport, carsharing or occasional rental usually work out cheaper. Below €0.25 the car is well amortised. Remember this calculation does not include vehicle depreciation, which can easily add between €1,500 and €3,000 a year on a relatively new car and is the factor that most distorts comparisons.",
  },
};

const COST_TABLE = [
  { es: "Combustible", en: "Fuel", coste: "1.350 €" },
  { es: "Seguro", en: "Insurance", coste: "450 €" },
  { es: "Mantenimiento y neumáticos", en: "Maintenance and tyres", coste: "400 €" },
  { es: "Aparcamiento / garaje", en: "Parking / garage", coste: "600 €" },
  { es: "Impuesto de circulación", en: "Road tax", coste: "120 €" },
  { es: "ITV (prorrateada)", en: "MOT (prorated)", coste: "45 €" },
];

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

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.tableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-md">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableCol1}</th>
              <th className="py-2 font-medium">{t.tableCol2}</th>
            </tr>
          </thead>
          <tbody>
            {COST_TABLE.map((row) => (
              <tr key={row.en} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{isEn ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.coste}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.interpretTitle}</h2>
        <p>{t.interpret}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          {(["q1", "q2", "q3", "q4", "q5", "q6"] as const).map((q) => (
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
