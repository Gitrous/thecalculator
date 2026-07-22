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
    intro1: "El IVA (Impuesto sobre el Valor Añadido) es un impuesto indirecto que grava el consumo y se aplica en España en tres tipos: superreducido (4%), reducido (10%) y general (21%). En las facturas de autónomos y empresas es imprescindible saber cómo añadir o desglosar el IVA correctamente, ya que los errores de cálculo pueden derivar en problemas con Hacienda.",
    intro2: "Esta calculadora permite tanto sumar el IVA al precio base (precio sin IVA → precio con IVA) como extraerlo de un precio final ya incluido (precio con IVA → base imponible). Especialmente útil para autónomos, contables y cualquier persona que trabaje con facturas en España.",
    disclaimer: "Los importes son orientativos. Para declaraciones fiscales oficiales, utiliza siempre el software homologado por la AEAT.",
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
    q4: "¿Qué es el recargo de equivalencia?",
    a4: "Es un régimen especial de IVA obligatorio para los comerciantes minoristas que venden a consumidor final sin transformar los productos. En lugar de presentar declaraciones trimestrales de IVA, el minorista paga a su proveedor un recargo adicional sobre el IVA normal y queda liberado de las obligaciones de liquidación. Los tipos del recargo son del 5,2 % cuando el IVA es del 21 %, del 1,4 % cuando es del 10 % y del 0,5 % cuando es del 4 %. A cambio de esa simplificación, el comerciante no puede deducirse el IVA soportado en sus compras.",
    q5: "¿Cuándo se aplica la inversión del sujeto pasivo?",
    a5: "Es un mecanismo por el que la obligación de declarar el IVA se traslada del vendedor al comprador, de modo que la factura se emite sin IVA y es el destinatario quien lo autoliquida. Se aplica en supuestos concretos: ejecuciones de obra inmobiliaria entre empresas, entregas de determinados materiales como chatarra o metales, operaciones intracomunitarias entre empresas con NIF-IVA válido y algunas entregas de inmuebles. En la factura debe constar expresamente la mención «inversión del sujeto pasivo» para justificar la ausencia de IVA repercutido.",
    deepTitle: "Los tipos de IVA en España y qué grava cada uno",
    deep: "España aplica tres tipos impositivos. El general del 21 % se aplica por defecto a la mayoría de bienes y servicios: electrónica, ropa, vehículos, bebidas alcohólicas, servicios profesionales o suministros. El reducido del 10 % cubre alimentos en general, transporte de viajeros, hostelería y restauración, entradas a espectáculos culturales y deportivos, y determinadas obras de renovación de vivienda. El superreducido del 4 % se reserva a bienes de primera necesidad: pan común, leche, huevos, frutas, verduras, cereales, quesos, libros, periódicos, medicamentos de uso humano, prótesis y vehículos para personas con movilidad reducida.",
    workedTitle: "Ejemplo resuelto",
    worked: "Para añadir el IVA general a una base de 250 €, se multiplica por 1,21: 250 × 1,21 = 302,50 €, de los cuales 52,50 € son IVA. La operación inversa, extraer el IVA de un precio final de 302,50 €, exige dividir y no restar: 302,50 / 1,21 = 250 € de base imponible, y la diferencia de 52,50 € es la cuota. Si restaras directamente el 21 % de 302,50 € obtendrías 238,98 €, un resultado incorrecto que subestima la base en más de once euros.",
    tableTitle: "Tipos de IVA vigentes en España",
    tableCol1: "Tipo",
    tableCol2: "Se aplica a",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "Recuerda que el IVA es un impuesto neutro para la empresa y lo soporta realmente el consumidor final: el autónomo o la sociedad repercuten el IVA en sus ventas, se deducen el soportado en sus compras y liquidan la diferencia trimestralmente ante Hacienda. Por eso, cuando compares presupuestos entre profesionales, asegúrate de contrastar cifras homogéneas, todas con IVA o todas sin él, porque un 21 % de diferencia distorsiona por completo la comparación. Y si eres particular, la cifra relevante es siempre el precio final con impuestos incluidos, que es lo que la normativa de consumo obliga a mostrar de forma destacada en la publicidad dirigida a consumidores.",
  },
  en: {
    title: "VAT Calculator",
    subtitle: "Add or remove VAT from any price instantly. Designed for freelancers, businesses and individuals who need absolute accuracy.",
    intro1: "VAT (Value Added Tax) is an indirect tax on consumption applied in Spain at three rates: super-reduced (4%), reduced (10%) and standard (21%). On invoices for freelancers and businesses it is essential to know how to add or break down VAT correctly, since calculation errors can lead to problems with the tax authority.",
    intro2: "This calculator lets you both add VAT to a net price (price excl. VAT → price incl. VAT) and extract it from a gross price already including VAT (price incl. VAT → taxable base). Particularly useful for freelancers, accountants and anyone working with invoices in Spain.",
    disclaimer: "Amounts are indicative. For official tax filings always use AEAT-approved software.",
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
    q4: "What is the equivalence surcharge?",
    a4: "It is a special VAT regime that is compulsory for retailers selling to end consumers without transforming the products. Instead of filing quarterly VAT returns, the retailer pays their supplier an additional surcharge on top of the normal VAT and is relieved of settlement obligations. The surcharge rates are 5.2% when VAT is 21%, 1.4% when it is 10% and 0.5% when it is 4%. In exchange for that simplification, the trader cannot deduct the input VAT on their purchases.",
    q5: "When does the reverse charge apply?",
    a5: "It is a mechanism whereby the obligation to declare VAT shifts from the seller to the buyer, so the invoice is issued without VAT and the recipient self-assesses it. It applies in specific cases: construction work between businesses, supplies of certain materials such as scrap or metals, intra-Community transactions between businesses with a valid VAT number, and some property transfers. The invoice must expressly state 'reverse charge' to justify the absence of output VAT.",
    deepTitle: "Spanish VAT rates and what each one covers",
    deep: "Spain applies three tax rates. The standard 21% rate is the default for most goods and services: electronics, clothing, vehicles, alcoholic drinks, professional services or utilities. The reduced 10% rate covers food in general, passenger transport, hospitality and catering, tickets to cultural and sporting events, and certain home renovation work. The super-reduced 4% rate is reserved for basic necessities: ordinary bread, milk, eggs, fruit, vegetables, cereals, cheese, books, newspapers, medicines for human use, prostheses and vehicles for people with reduced mobility.",
    workedTitle: "Worked example",
    worked: "To add standard VAT to a base of €250, multiply by 1.21: 250 × 1.21 = €302.50, of which €52.50 is VAT. The inverse operation, extracting VAT from a final price of €302.50, requires dividing rather than subtracting: 302.50 / 1.21 = €250 taxable base, and the €52.50 difference is the VAT. If you simply subtracted 21% from €302.50 you would get €238.98, an incorrect result that underestimates the base by more than eleven euros.",
    tableTitle: "VAT rates in force in Spain",
    tableCol1: "Rate",
    tableCol2: "Applies to",
    interpretTitle: "How to interpret the result",
    interpret: "Remember that VAT is neutral for the business and is really borne by the end consumer: the self-employed worker or company charges VAT on sales, deducts the VAT paid on purchases and settles the difference quarterly with the tax authority. That is why, when comparing quotes between professionals, you must compare like with like, either all figures with VAT or all without, because a 21% difference completely distorts the comparison. And if you are a private individual, the relevant figure is always the final price including taxes, which consumer law requires to be displayed prominently in advertising aimed at consumers.",
  },
};

const IVA_TABLE = [
  { es: "General — 21 %", en: "Standard — 21%", ap: "Mayoría de bienes y servicios", apEn: "Most goods and services" },
  { es: "Reducido — 10 %", en: "Reduced — 10%", ap: "Alimentos, transporte, hostelería", apEn: "Food, transport, hospitality" },
  { es: "Superreducido — 4 %", en: "Super-reduced — 4%", ap: "Pan, leche, huevos, libros, medicamentos", apEn: "Bread, milk, eggs, books, medicines" },
  { es: "Exento — 0 %", en: "Exempt — 0%", ap: "Sanidad, educación, seguros", apEn: "Healthcare, education, insurance" },
];

export default function Iva() {
  const locale = useLocale();
  const isEn = locale === "en";
  const t = T[isEn ? "en" : "es"];

  const [rawAmount, setRawAmount] = useState("");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [rate, setRate] = useState(21);
  const [result, setResult] = useState<{ base: number; tax: number; total: number } | null>(null);

  function calculate() {
    const amount = parseFloat(rawAmount) || 0;
    if (amount <= 0) return;
    let base = 0, tax = 0, total = 0;
    if (mode === "add") {
      base = amount;
      tax = (amount * rate) / 100;
      total = base + tax;
    } else {
      total = amount;
      base = total / (1 + rate / 100);
      tax = total - base;
    }
    setResult({ base, tax, total });
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Receipt className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      {/* ── Centered input card ── */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md glass-card rounded-2xl p-6 space-y-6">
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
                onChange={(e) => { setRawAmount(e.target.value); setResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && calculate()}
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
                onClick={() => { setMode("add"); setResult(null); }}
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
                onClick={() => { setMode("remove"); setResult(null); }}
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
            <div className="grid grid-cols-4 gap-2">
              {RATES.map((r) => (
                <button
                  key={r.rate}
                  onClick={() => { setRate(r.rate); setResult(null); }}
                  className={cn(
                    "flex flex-col items-center justify-center py-3 px-1 rounded-xl border-2 transition-all bg-white/60 dark:bg-white/5",
                    rate === r.rate
                      ? "border-primary"
                      : "border-transparent hover:border-gray-200 dark:hover:border-white/20"
                  )}
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{r.rate}%</span>
                  <span className="text-xs text-gray-500 dark:text-white/40 mt-0.5 leading-tight text-center">
                    {isEn ? r.labelEn : r.labelEs}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Calculate button */}
          <Button onClick={calculate} className="w-full gap-2 hover-elevate active-elevate-2">
            <RefreshCw className="w-4 h-4" />
            {t.calculateBtn}
          </Button>
        </div>
      </div>

      {/* ── Results (shown only after calculate) ── */}
      {result && (
        <div className="space-y-4 mb-8">
          {/* Base Imponible */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 dark:bg-primary/10 p-8">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
              {mode === "add" ? t.baseLabel : t.totalLabel}
            </p>
            <p className="text-5xl font-bold text-gray-900 dark:text-white">
              {eur(mode === "add" ? result.base : result.total)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">{t.baseDesc}</p>
          </div>

          {/* Cuota IVA + Tipo Aplicado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                {t.taxLabel}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{eur(result.tax)}</p>
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
              {eur(mode === "add" ? result.total : result.base)}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400">{t.totalDesc}</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.how1}</p>
        <p className="text-muted-foreground mb-4">{t.how2}</p>
        <h3 className="text-lg font-semibold mb-2">{t.exampleTitle}</h3>
        <p className="text-muted-foreground">{t.example}</p>
      </section>

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.workedTitle}</h3>
        <p>{t.worked}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.tableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-lg">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableCol1}</th>
              <th className="py-2 font-medium">{t.tableCol2}</th>
            </tr>
          </thead>
          <tbody>
            {IVA_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{locale === "en" ? row.apEn : row.ap}</td>
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
