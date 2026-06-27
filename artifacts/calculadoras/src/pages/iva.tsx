import { useState } from "react";
import { Receipt, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

function eur(n: number): string {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
}

const RATES = [
  { rate: 21, labelEs: "General",       labelEn: "Standard" },
  { rate: 10, labelEs: "Reducido",      labelEn: "Reduced" },
  { rate: 4,  labelEs: "Superreducido", labelEn: "Super-reduced" },
  { rate: 0,  labelEs: "Exento",        labelEn: "Exempt" },
];

const T = {
  es: {
    title: "Calculadora de IVA",
    subtitle: "Suma o resta el IVA a cualquier precio al instante. Diseñado para autónomos, empresas y particulares que buscan precisión absoluta.",
    amountLabel: "Importe Base o Total",
    actionLabel: "Acción",
    addVat: "Sumar IVA",
    removeVat: "Quitar IVA",
    rateLabel: "Tipo de IVA aplicable",
    calculateBtn: "Recalcular ahora",
    baseLabel: "Base Imponible",
    baseDesc: "El importe neto antes de impuestos.",
    taxLabel: "Cuota IVA",
    rateApplied: "Tipo Aplicado",
    totalLabel: "Total a Pagar",
    totalDesc: "Importe total con impuestos incluidos.",
    howTitle: "Qué es el IVA y cómo se calcula",
    how1:
      "El IVA (Impuesto sobre el Valor Añadido) es un impuesto indirecto que grava el consumo y se añade al precio de la mayoría de bienes y servicios. Quien lo soporta es el consumidor final, pero son las empresas y autónomos quienes lo recaudan en cada factura y lo ingresan en Hacienda.",
    how2:
      "Para añadir el IVA a un precio se multiplica la base imponible por el tipo: IVA = base × (tipo / 100), y el total es base + IVA. Para el cálculo inverso, averiguar la base a partir de un precio que ya incluye IVA, se divide entre (1 + tipo/100). Esta calculadora hace las dos operaciones según la acción que elijas.",
    exampleTitle: "Ejemplo",
    example:
      "Una factura con base de 100 € al 21% tiene 21 € de IVA y un total de 121 €. Al revés: si un producto cuesta 121 € con IVA incluido, su base es 121 / 1,21 = 100 € y el IVA son 21 €.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué diferencia hay entre IVA general, reducido y superreducido?",
    a1: "En España existen tres tipos de IVA vigentes. El tipo general (21%) se aplica a la mayoría de bienes y servicios: electrónica, ropa, hostelería, servicios profesionales, bricolaje y peluquería, entre otros. El tipo reducido (10%) se aplica a alimentos no esenciales, transporte de viajeros, viviendas nuevas y espectáculos culturales. El tipo superreducido (4%) se reserva a productos de primera necesidad: pan, leche, frutas, verduras, libros, periódicos, medicamentos con receta y prótesis. El tipo del 0% (exento) aplica a servicios como la educación, la sanidad pública o los seguros.",
    q2: "¿Cómo se quita el IVA de un precio final?",
    a2: "Para obtener la base imponible a partir de un precio con IVA incluido, se divide el importe total entre (1 + tipo/100). Por ejemplo, si el precio final es 121 € con IVA al 21%, la base es 121 / 1,21 = 100 €. La cuota de IVA es la diferencia: 121 − 100 = 21 €. Esta operación se llama 'desglose de IVA' y es habitual en facturas emitidas por autónomos y empresas.",
    q3: "¿Cuándo hay que aplicar el IVA en una factura?",
    a3: "En España, los autónomos y empresas que realicen actividades económicas están obligados a repercutir el IVA en sus facturas cuando el servicio o bien está sujeto a este impuesto. Las excepciones más comunes son los servicios de educación, sanidad, seguros y determinadas operaciones financieras, que están exentos. Si facturas a clientes de otros países de la Unión Europea (operaciones intracomunitarias), pueden aplicarse reglas especiales; si el cliente es una empresa con NIF-IVA europeo, la operación generalmente se factura sin IVA (inversión del sujeto pasivo).",
  },
  en: {
    title: "VAT Calculator",
    subtitle: "Add or remove VAT from any price instantly. Designed for freelancers, businesses and individuals who need absolute accuracy.",
    amountLabel: "Base or Total Amount",
    actionLabel: "Action",
    addVat: "Add VAT",
    removeVat: "Remove VAT",
    rateLabel: "Applicable VAT rate",
    calculateBtn: "Recalculate",
    baseLabel: "Tax Base",
    baseDesc: "The net amount before tax.",
    taxLabel: "VAT Amount",
    rateApplied: "Rate Applied",
    totalLabel: "Total to Pay",
    totalDesc: "Total amount including taxes.",
    howTitle: "What VAT is and how to calculate it",
    how1:
      "VAT (Value Added Tax) is an indirect tax on consumption that is added to the price of most goods and services. The final consumer bears it, but it is businesses and the self-employed who collect it on every invoice and pay it to the tax authority.",
    how2:
      "To add VAT to a price you multiply the tax base by the rate: VAT = base × (rate / 100), and the total is base + VAT. For the reverse calculation, finding the base from a VAT-inclusive price, you divide by (1 + rate/100). This calculator does both operations depending on the action you choose.",
    exampleTitle: "Example",
    example:
      "An invoice with a base of €100 at 21% has €21 of VAT and a total of €121. The other way round: if a product costs €121 including VAT, its base is 121 / 1.21 = €100 and the VAT is €21.",
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between standard, reduced and super-reduced VAT?",
    a1: "In Spain there are three active VAT rates. The standard rate (21%) applies to most goods and services: electronics, clothing, hospitality, professional services, DIY and hairdressing, among others. The reduced rate (10%) applies to non-essential food, passenger transport, new housing and cultural events. The super-reduced rate (4%) is reserved for essential goods: bread, milk, fruit, vegetables, books, newspapers, prescription medicines and prosthetics. The 0% rate (exempt) applies to services such as education, public healthcare and insurance.",
    q2: "How do you remove VAT from a final price?",
    a2: "To obtain the tax base from a VAT-inclusive price, divide the total amount by (1 + rate/100). For example, if the final price is €121 with 21% VAT, the base is 121 / 1.21 = €100. The VAT amount is the difference: 121 − 100 = €21. This operation is called 'VAT breakdown' and is common on invoices issued by freelancers and businesses.",
    q3: "When do you have to apply VAT on an invoice?",
    a3: "In Spain, freelancers and businesses carrying out economic activities are required to charge VAT on their invoices when the service or good is subject to this tax. The most common exceptions are education, healthcare, insurance and certain financial transactions, which are exempt. If you invoice customers in other EU countries (intra-community transactions), special rules may apply — if the customer is a business with a European VAT number, the transaction is generally invoiced without VAT (reverse charge mechanism).",
  },
};

export default function Iva() {
  const locale = useLocale();
  const isEn = locale === "en";
  const t = T[isEn ? "en" : "es"];

  const [rawAmount, setRawAmount] = useState("100");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [rate, setRate] = useState(21);

  const amount = parseFloat(rawAmount) || 0;

  let base = 0, tax = 0, total = 0;
  if (amount > 0) {
    if (mode === "add") {
      base = amount;
      tax = (amount * rate) / 100;
      total = base + tax;
    } else {
      total = amount;
      base = total / (1 + rate / 100);
      tax = total - base;
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Receipt className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        {/* ── Input panel ─────────────────────────────────────── */}
        <div className="w-full md:w-80 shrink-0 glass-card rounded-2xl p-6 space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-white/60">
              {t.amountLabel}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none">€</span>
              <input
                type="number"
                value={rawAmount}
                onChange={(e) => setRawAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-lg font-semibold text-gray-900 dark:text-white placeholder:text-gray-300 focus:border-primary dark:focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Action toggle */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-white/60">
              {t.actionLabel}
            </label>
            <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
              <button
                onClick={() => setMode("add")}
                className={cn(
                  "flex-1 py-2 rounded-md text-sm font-semibold transition-all",
                  mode === "add"
                    ? "bg-white dark:bg-white/15 text-primary shadow-sm"
                    : "text-gray-500 dark:text-white/40 hover:bg-white/50"
                )}
              >
                {t.addVat}
              </button>
              <button
                onClick={() => setMode("remove")}
                className={cn(
                  "flex-1 py-2 rounded-md text-sm font-semibold transition-all",
                  mode === "remove"
                    ? "bg-white dark:bg-white/15 text-primary shadow-sm"
                    : "text-gray-500 dark:text-white/40 hover:bg-white/50"
                )}
              >
                {t.removeVat}
              </button>
            </div>
          </div>

          {/* Rate cards */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-white/60">
              {t.rateLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {RATES.map((r) => (
                <button
                  key={r.rate}
                  onClick={() => setRate(r.rate)}
                  className={cn(
                    "flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all bg-white/60 dark:bg-white/5",
                    rate === r.rate
                      ? "border-primary"
                      : "border-transparent hover:border-gray-200 dark:hover:border-white/20"
                  )}
                >
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{r.rate}%</span>
                  <span className="text-xs text-gray-500 dark:text-white/40 mt-0.5">
                    {isEn ? r.labelEn : r.labelEs}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recalcular button */}
          <Button className="w-full gap-2 hover-elevate active-elevate-2">
            <RefreshCw className="w-4 h-4" />
            {t.calculateBtn}
          </Button>
        </div>

        {/* ── Results panel ────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Base Imponible */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 dark:bg-primary/10 p-8">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
              {mode === "add" ? t.baseLabel : t.totalLabel}
            </p>
            <p className="text-5xl font-bold text-gray-900 dark:text-white">
              {eur(mode === "add" ? base : total)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">{t.baseDesc}</p>
          </div>

          {/* Cuota IVA + Tipo Aplicado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                {t.taxLabel}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{eur(tax)}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">
                {t.rateApplied}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{rate}%</p>
            </div>
          </div>

          {/* Total a Pagar */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-900 dark:bg-white/10 p-8 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              {mode === "add" ? t.totalLabel : t.baseLabel}
            </p>
            <p className="text-5xl font-bold">
              {eur(mode === "add" ? total : base)}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400">{t.totalDesc}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.how1}</p>
        <p className="text-muted-foreground mb-4">{t.how2}</p>
        <h3 className="text-lg font-semibold mb-2">{t.exampleTitle}</h3>
        <p className="text-muted-foreground">{t.example}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible>
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
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
