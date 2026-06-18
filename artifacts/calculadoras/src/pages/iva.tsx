import { useState } from "react";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { COUNTRIES, getCountry, fmtCurrency } from "@/lib/countries";
import { useLocale } from "@/lib/locale";

const T = {
  es: {
    title: "Calculadora de IVA / Impuesto Indirecto",
    subtitle: "Suma o resta el impuesto indirecto (IVA, GST, Sales Tax…) a cualquier precio según el país.",
    cardTitle: "Datos",
    countryLabel: "País",
    addVat: "Añadir impuesto",
    removeVat: "Quitar impuesto",
    labelAdd: "Importe sin impuesto (base)",
    labelRemove: "Importe con impuesto (total)",
    vatType: "Tipo de impuesto",
    taxBase: "Base imponible",
    vatAmount: "Impuesto",
    total: "Total",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué diferencia hay entre IVA, GST y Sales Tax?",
    a1: "El IVA (Impuesto sobre el Valor Añadido) es un impuesto que se aplica en cada fase de la cadena de producción y distribución, común en Europa, Latinoamérica y Asia. El GST (Goods and Services Tax) es equivalente al IVA y se usa en países como Canadá, Australia, India o Singapur. El Sales Tax estadounidense solo se aplica en la venta final al consumidor y varía por estado.",
    q2: "¿Cómo se quita el impuesto de un precio final?",
    a2: "Se divide el precio con impuesto entre (1 + tipo/100). Por ejemplo, con un 21%: base = total / 1,21.",
  },
  en: {
    title: "VAT / Indirect Tax Calculator",
    subtitle: "Add or remove indirect tax (VAT, GST, Sales Tax…) from any price based on the country.",
    cardTitle: "Data",
    countryLabel: "Country",
    addVat: "Add tax",
    removeVat: "Remove tax",
    labelAdd: "Amount without tax (base)",
    labelRemove: "Amount with tax (total)",
    vatType: "Tax rate",
    taxBase: "Tax base",
    vatAmount: "Tax",
    total: "Total",
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between VAT, GST and Sales Tax?",
    a1: "VAT (Value Added Tax) is applied at each stage of the production and distribution chain, common in Europe, Latin America and Asia. GST (Goods and Services Tax) is equivalent to VAT and is used in countries like Canada, Australia, India or Singapore. US Sales Tax is only applied at the final sale to the consumer and varies by state.",
    q2: "How do you remove the tax from a final price?",
    a2: "Divide the price with tax by (1 + rate/100). For example, at 21%: base = total / 1.21.",
  },
};

export default function Iva() {
  const locale = useLocale();
  const t = T[locale];

  const [countryCode, setCountryCode] = useState("es");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const country = getCountry(countryCode);
  const [rate, setRate] = useState(country.vatRates[0]);

  const handleCountryChange = (code: string) => {
    const c = getCountry(code);
    setCountryCode(code);
    setRate(c.vatRates[0]);
  };

  const value = parseFloat(amount);
  const valid = !isNaN(value) && value >= 0;

  let base = 0;
  let tax = 0;
  let total = 0;
  if (valid) {
    if (mode === "add") {
      base = value;
      tax = (value * rate) / 100;
      total = base + tax;
    } else {
      total = value;
      base = value / (1 + rate / 100);
      tax = total - base;
    }
  }

  const fmt = (n: number) => fmtCurrency(n, country.currency, country.numberLocale);
  const vatName = locale === "es" ? country.vatNameEs : country.vatNameEn;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Receipt className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Country selector */}
          <div>
            <Label>{t.countryLabel}</Label>
            <Select value={countryCode} onValueChange={handleCountryChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {locale === "es" ? c.nameEs : c.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant={mode === "add" ? "default" : "outline"} onClick={() => setMode("add")}>
              {t.addVat}
            </Button>
            <Button variant={mode === "remove" ? "default" : "outline"} onClick={() => setMode("remove")}>
              {t.removeVat}
            </Button>
          </div>

          <div>
            <Label htmlFor="amount">
              {mode === "add" ? t.labelAdd : t.labelRemove} ({country.currencySymbol})
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
              placeholder="0"
            />
          </div>

          <div>
            <Label>{t.vatType} — {vatName}</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {country.vatRates.map((r) => (
                <Button
                  key={r}
                  variant={rate === r ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRate(r)}
                >
                  {r}%
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {valid && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">{t.taxBase}</p>
                <p className="text-xl font-bold">{fmt(base)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.vatAmount} ({rate}%)</p>
                <p className="text-xl font-bold">{fmt(tax)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.total}</p>
                <p className="text-xl font-bold text-primary">{fmt(total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
