import { useState, useRef } from "react";
import { Plus, Trash2, Hammer, Lightbulb, Download } from "lucide-react";
import { downloadChart } from "@/lib/chart-download";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

interface RenovationType {
  esLabel: string;
  enLabel: string;
  unit: string;
  unitEn: string;
  min: number;
  max: number;
}

const RENOVATION_TYPES: Record<string, RenovationType> = {
  pintura:               { esLabel: "Pintura interior (paredes/techo)",    enLabel: "Interior painting (walls/ceiling)",   unit: "m²",    unitEn: "m²",   min: 8,    max: 15    },
  parquet:               { esLabel: "Parquet / suelo laminado",             enLabel: "Parquet / laminate flooring",         unit: "m²",    unitEn: "m²",   min: 20,   max: 50    },
  suelo_ceramico:        { esLabel: "Suelo cerámico / baldosas",            enLabel: "Ceramic / tile floor",                unit: "m²",    unitEn: "m²",   min: 30,   max: 65    },
  alicatado:             { esLabel: "Alicatado (azulejos pared)",           enLabel: "Wall tiling",                         unit: "m²",    unitEn: "m²",   min: 35,   max: 75    },
  instalacion_electrica: { esLabel: "Instalación eléctrica",                enLabel: "Electrical installation",             unit: "m²",    unitEn: "m²",   min: 20,   max: 45    },
  fontaneria:            { esLabel: "Instalación de fontanería",            enLabel: "Plumbing installation",               unit: "m²",    unitEn: "m²",   min: 30,   max: 60    },
  falso_techo:           { esLabel: "Falso techo (escayola / pladur)",      enLabel: "False ceiling (plasterboard)",        unit: "m²",    unitEn: "m²",   min: 25,   max: 55    },
  banyo:                 { esLabel: "Baño completo",                        enLabel: "Full bathroom renovation",            unit: "ud",    unitEn: "unit", min: 3000, max: 8000  },
  cocina:                { esLabel: "Cocina completa",                      enLabel: "Full kitchen renovation",             unit: "ud",    unitEn: "unit", min: 5000, max: 15000 },
  ventana_pvc:           { esLabel: "Ventana PVC doble acristalamiento",    enLabel: "PVC double-glazed window",            unit: "ud",    unitEn: "unit", min: 300,  max: 700   },
  puerta_interior:       { esLabel: "Puerta interior",                      enLabel: "Interior door",                       unit: "ud",    unitEn: "unit", min: 200,  max: 450   },
  puerta_exterior:       { esLabel: "Puerta exterior de entrada",           enLabel: "Front / exterior door",               unit: "ud",    unitEn: "unit", min: 600,  max: 1500  },
  aire_acondicionado:    { esLabel: "Aire acondicionado split",             enLabel: "Air conditioning (split unit)",       unit: "ud",    unitEn: "unit", min: 800,  max: 1800  },
  radiador:              { esLabel: "Radiador",                             enLabel: "Radiator",                            unit: "ud",    unitEn: "unit", min: 150,  max: 400   },
};

const COLORS = ["#a855f7","#6366f1","#3b82f6","#0ea5e9","#10b981","#22c55e","#eab308","#f97316","#ef4444","#ec4899","#8b5cf6","#06b6d4","#14b8a6","#f43f5e"];

interface RenovationItem {
  id: number;
  typeKey: string;
  qty: string;
}

const T = {
  es: {
    title: "Calculadora de Presupuesto de Reforma del Hogar",
    subtitle: "Estima el coste de tu reforma con precios orientativos del mercado español 2025-2026.",
    intro1: "Reformar una vivienda es una de las inversiones más importantes que puede hacer un propietario. Conocer de antemano un presupuesto orientativo permite planificar la financiación, negociar con contratistas con criterio y evitar sorpresas desagradables. Los precios varían según la calidad de los materiales elegidos, la zona geográfica y la empresa contratada, pero esta calculadora te ofrece un rango de referencia basado en precios de mercado actualizados para 2025-2026.",
    intro2: "Añade las partidas de tu reforma —pintura, suelo, baño, ventanas, instalación eléctrica...— con la superficie en metros cuadrados o el número de unidades. Obtendrás al instante un presupuesto mínimo y máximo orientativo. Los precios incluyen materiales y mano de obra, pero no incluyen IVA.",
    disclaimer: "Estimaciones orientativas basadas en precios medios del mercado español (2025-2026). El presupuesto real depende de la calidad de materiales, la zona y la empresa. Solicita siempre al menos 3 presupuestos antes de contratar.",
    addItem: "Añadir partida",
    typeLabel: "Tipo de trabajo",
    qtyLabel: "Cantidad",
    totalMin: "Presupuesto mínimo",
    totalMax: "Presupuesto máximo",
    totalMid: "Estimación media",
    rangeLabel: "Rango estimado",
    noVat: "(sin IVA)",
    distribution: "Distribución por partida (valor medio)",
    emptyChart: "Añade partidas para ver la distribución.",
    tipTitle: "Consejo",
    tipText: "Pide al menos 3 presupuestos a distintas empresas. La diferencia entre el más barato y el más caro puede superar el 40%.",
    howTitle: "Cómo se calculan los precios",
    howText: "Los rangos reflejan los precios medios del sector de la construcción en España (2025-2026), incluyendo materiales y mano de obra. El precio mínimo corresponde a acabados económicos y el máximo a calidades medias-altas. Los precios no incluyen IVA: para reformas de vivienda habitual se aplica el tipo reducido del 10%.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿El precio incluye IVA?",
    a1: "No. Los precios son sin IVA. Las reformas de vivienda habitual tributan al 10% de IVA (tipo reducido). Para segundas viviendas o locales comerciales, el IVA es del 21%. Añade el IVA correspondiente al presupuesto final para calcular el coste total.",
    q2: "¿Puedo deducir una reforma en el IRPF?",
    a2: "Depende del tipo de reforma. Las obras de mejora de eficiencia energética (aislamiento térmico, ventanas de alta eficiencia, bombas de calor, calderas de biomasa) tienen deducciones del 20% al 60% en el IRPF. Las reformas estéticas como pintura o cambio de suelos no son deducibles para uso propio, aunque sí pueden ser gasto deducible si el inmueble está en alquiler.",
    q3: "¿Cuánto tiempo tarda una reforma integral?",
    a3: "Una reforma integral de un piso de 80-90 m² puede durar entre 2 y 4 meses dependiendo del alcance. Una reforma parcial de un baño o cocina suele tardar entre 2 y 4 semanas. Cuenta siempre con un margen adicional de al menos 2-3 semanas por posibles imprevistos o esperas de materiales.",
    q4: "¿Qué partidas son las más caras?",
    a4: "La cocina y el baño completos son las partidas más costosas porque concentran instalaciones de fontanería, electricidad, azulejos y carpintería. Un baño completo de calidad media ronda los 3.000-8.000 €, y una cocina completa los 5.000-15.000 €. En segundo lugar, los suelos y la pintura en toda la vivienda pueden suponer varios miles de euros.",
    q5: "¿Necesito licencia de obras?",
    a5: "Depende del municipio y el tipo de obra. Las obras menores (pintura, cambio de suelos, alicatado sin modificar estructura) generalmente solo requieren una comunicación previa al ayuntamiento. Las obras mayores (eliminación de tabiques estructurales, ampliaciones, cambios de uso) siempre necesitan licencia de obra mayor, que puede tardar semanas o meses en concederse.",
  },
  en: {
    title: "Home Renovation Budget Calculator",
    subtitle: "Estimate the cost of your renovation based on Spanish market prices 2025-2026.",
    intro1: "Renovating a home is one of the most significant investments a homeowner can make. Knowing a rough budget in advance allows you to plan financing, negotiate with contractors confidently and avoid unpleasant surprises. Prices vary depending on the quality of materials chosen, the geographical area and the company hired, but this calculator gives you a reference range based on updated market prices for 2025-2026.",
    intro2: "Add the different items in your renovation — painting, flooring, bathroom, windows, electrical installation... — with the surface area in square metres or number of units. You'll instantly get an indicative minimum and maximum budget. Prices include materials and labour, but do not include VAT.",
    disclaimer: "Indicative estimates based on average Spanish market prices (2025-2026). The actual budget depends on material quality, location and contractor. Always request at least 3 quotes before hiring.",
    addItem: "Add item",
    typeLabel: "Type of work",
    qtyLabel: "Quantity",
    totalMin: "Minimum budget",
    totalMax: "Maximum budget",
    totalMid: "Average estimate",
    rangeLabel: "Estimated range",
    noVat: "(excl. VAT)",
    distribution: "Distribution by item (midpoint value)",
    emptyChart: "Add items to see the distribution.",
    tipTitle: "Tip",
    tipText: "Request at least 3 quotes from different companies. The difference between the cheapest and the most expensive can exceed 40%.",
    howTitle: "How prices are calculated",
    howText: "The ranges reflect average construction sector prices in Spain (2025-2026), including materials and labour. The minimum price corresponds to budget finishes and the maximum to medium-high quality. Prices do not include VAT: renovations to a primary residence are taxed at the reduced rate of 10%.",
    faqTitle: "Frequently asked questions",
    q1: "Do prices include VAT?",
    a1: "No. Prices are excluding VAT. Renovations to a primary residence are taxed at 10% VAT (reduced rate). For second homes or commercial premises, VAT is 21%. Add the relevant VAT to the final budget to calculate the total cost.",
    q2: "Can I claim a tax deduction for a renovation?",
    a2: "It depends on the type of renovation. Energy efficiency improvement works (thermal insulation, high-efficiency windows, heat pumps, biomass boilers) qualify for IRPF deductions of 20% to 60%. Cosmetic renovations such as painting or floor replacement are not deductible for personal use, although they may be deductible expenses if the property is rented.",
    q3: "How long does a complete renovation take?",
    a3: "A full renovation of an 80-90 m² flat can take 2 to 4 months depending on scope. A partial bathroom or kitchen renovation usually takes 2 to 4 weeks. Always allow an additional margin of at least 2-3 weeks for possible unforeseen issues or material lead times.",
    q4: "Which items are most expensive?",
    a4: "Full kitchens and bathrooms are the most costly items because they concentrate plumbing, electrical, tiling and joinery work. A medium-quality full bathroom costs around €3,000-8,000 and a full kitchen €5,000-15,000. Secondly, flooring and painting throughout the property can amount to several thousand euros.",
    q5: "Do I need a building permit?",
    a5: "It depends on the municipality and the type of work. Minor works (painting, floor replacement, tiling without structural changes) generally only require prior notification to the town hall. Major works (removing structural walls, extensions, change of use) always require a major works permit, which can take weeks or months to be granted.",
  },
};

export default function ReformaHogar() {
  const locale = useLocale();
  const t = T[locale];
  const isEn = locale === "en";
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const chartRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<RenovationItem[]>([
    { id: 1, typeKey: "pintura",  qty: "80" },
    { id: 2, typeKey: "parquet",  qty: "60" },
    { id: 3, typeKey: "banyo",    qty: "1"  },
  ]);

  const addItem = () => {
    setItems((prev) => [...prev, { id: Date.now(), typeKey: "pintura", qty: "" }]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: number, field: keyof RenovationItem, value: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const breakdown = items
    .filter((i) => {
      const q = parseFloat(i.qty);
      return i.typeKey && !isNaN(q) && q > 0;
    })
    .map((i) => {
      const rt = RENOVATION_TYPES[i.typeKey];
      const qty = parseFloat(i.qty);
      const costMin = rt.min * qty;
      const costMax = rt.max * qty;
      const costMid = (costMin + costMax) / 2;
      const label = isEn ? rt.enLabel : rt.esLabel;
      return { name: label.length > 22 ? label.slice(0, 22) + "…" : label, fullName: label, costMin, costMax, costMid, unit: isEn ? rt.unitEn : rt.unit, qty };
    });

  const totalMin = breakdown.reduce((s, b) => s + b.costMin, 0);
  const totalMax = breakdown.reduce((s, b) => s + b.costMax, 0);
  const totalMid = (totalMin + totalMax) / 2;

  const fmt = (n: number) =>
    n.toLocaleString(isEn ? "en-GB" : "es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const fmtEur = (n: number) => `${fmt(n)} €`;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Hammer className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── LEFT: item list ── */}
        <div className="flex-1 min-w-0 space-y-3">
          {items.map((item, idx) => {
            const rt = RENOVATION_TYPES[item.typeKey];
            const qty = parseFloat(item.qty);
            const valid = !isNaN(qty) && qty > 0;
            const costMin = valid ? rt.min * qty : 0;
            const costMax = valid ? rt.max * qty : 0;
            const color = COLORS[idx % COLORS.length];

            return (
              <div key={item.id} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1"
                    style={{ background: color + "22" }}
                  >
                    <Hammer className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                        {t.typeLabel}
                      </Label>
                      <Select value={item.typeKey} onValueChange={(v) => updateItem(item.id, "typeKey", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(RENOVATION_TYPES).map(([key, rt]) => (
                            <SelectItem key={key} value={key}>
                              {isEn ? rt.enLabel : rt.esLabel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                          {t.qtyLabel} ({rt.unit})
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          placeholder={rt.unit}
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                        />
                      </div>
                      {valid && (
                        <div className="flex flex-col justify-end pb-0.5">
                          <span className="text-xs text-muted-foreground mb-0.5">{t.rangeLabel}</span>
                          <span className="text-sm font-semibold text-gray-800 dark:text-white">
                            {fmtEur(costMin)} – {fmtEur(costMax)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mt-1 text-gray-300 hover:text-red-500 dark:text-white/20 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={addItem}
            className="w-full py-3.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 text-sm text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors flex items-center justify-center gap-2 bg-white dark:bg-white/5"
          >
            <Plus className="w-4 h-4" />
            {t.addItem}
          </button>
        </div>

        {/* ── RIGHT: summary + chart ── */}
        <div className="w-full lg:w-80 shrink-0 space-y-4 lg:sticky lg:top-24">

          {/* Summary card */}
          <div className="rounded-2xl bg-gray-900 dark:bg-zinc-900 p-5 space-y-1">
            <h3 className="text-white font-semibold text-base mb-4">
              {isEn ? "Budget summary" : "Resumen del presupuesto"}
              <span className="ml-2 text-xs font-normal text-gray-500">{t.noVat}</span>
            </h3>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-gray-400 text-sm">{t.totalMin}</span>
              <span className="text-purple-400 text-xl font-bold">{fmtEur(totalMin)}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-gray-400 text-sm">{t.totalMid}</span>
              <span className="text-white text-2xl font-bold">{fmtEur(totalMid)}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-gray-400 text-sm">{t.totalMax}</span>
              <span className="text-purple-400 text-xl font-bold">{fmtEur(totalMax)}</span>
            </div>

            {totalMin > 0 && (
              <div className="bg-white/5 rounded-xl p-3 mt-2">
                <p className="text-xs text-gray-400 leading-relaxed">
                  {isEn
                    ? `With 10% VAT: ${fmtEur(totalMin * 1.1)} – ${fmtEur(totalMax * 1.1)}`
                    : `Con IVA 10%: ${fmtEur(totalMin * 1.1)} – ${fmtEur(totalMax * 1.1)}`}
                </p>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{t.distribution}</h3>
              <div className="flex gap-1">
                {(["bar", "pie"] as const).map((ct) => (
                  <button key={ct} onClick={() => setChartType(ct)}
                    className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors ${chartType === ct ? "bg-primary text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20"}`}>
                    {ct === "bar" ? (isEn ? "Bars" : "Barras") : (isEn ? "Pie" : "Tarta")}
                  </button>
                ))}
                <button
                  onClick={() => downloadChart(chartRef.current, "grafico-reforma-hogar")}
                  title={isEn ? "Download chart" : "Descargar gráfico"}
                  className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {breakdown.length > 0 ? (
              <>
                <div ref={chartRef}>
                <ResponsiveContainer width="100%" height={180}>
                  {chartType === "bar" ? (
                    <BarChart data={breakdown} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                      <Tooltip
                        formatter={(v: number, _: string, props: { payload?: { fullName?: string } }) => [fmtEur(v), props.payload?.fullName ?? ""]}
                        contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }}
                      />
                      <Bar dataKey="costMid" radius={[4, 4, 0, 0]}>
                        {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie data={breakdown} dataKey="costMid" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                        {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => [fmtEur(v), ""]}
                        contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }}
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-3">
                  {breakdown.map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="truncate">{b.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">{t.emptyChart}</p>
            )}
          </div>

          {/* Tip */}
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{t.tipTitle}</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">{t.tipText}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic mt-8 mb-2">{t.disclaimer}</p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground">{t.howText}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>{t.q1}</AccordionTrigger>
            <AccordionContent>{t.a1}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>{t.q2}</AccordionTrigger>
            <AccordionContent>{t.a2}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>{t.q3}</AccordionTrigger>
            <AccordionContent>{t.a3}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>{t.q4}</AccordionTrigger>
            <AccordionContent>{t.a4}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger>{t.q5}</AccordionTrigger>
            <AccordionContent>{t.a5}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
