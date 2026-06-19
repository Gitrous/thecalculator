import { Link, useParams } from "wouter";
import { ChevronRight } from "lucide-react";
import {
  getCategory,
  getCalculatorsByCategory,
  EN_TO_ES_CATEGORY,
  EN_CATEGORY_SLUGS,
} from "@/lib/calculators";
import { CalculatorCard } from "@/components/calculator-card";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { Seo } from "@/components/seo";
import NotFound from "@/pages/not-found";
import { useLocale } from "@/lib/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CategoryContent {
  intro: { es: string; en: string };
  faqs: Array<{ q: { es: string; en: string }; a: { es: string; en: string } }>;
}

const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  finanzas: {
    intro: {
      es: "Las calculadoras financieras de TheCalculator te ayudan a planificar tus finanzas personales con datos actualizados a 2026. Desde calcular la cuota mensual de una hipoteca o el coste real de un préstamo hasta estimar tu salario neto tras IRPF y Seguridad Social, cada herramienta incluye explicaciones detalladas para que entiendas el resultado, no solo el número. Todas las fórmulas siguen los estándares bancarios y la legislación fiscal vigente en España.",
      en: "TheCalculator's financial calculators help you plan your personal finances with data updated for 2026. From working out your monthly mortgage payment or the true cost of a loan to estimating your net take-home pay after income tax and Social Security, each tool includes detailed explanations so you understand the result, not just the number. All formulas follow standard banking conventions and current Spanish tax legislation.",
    },
    faqs: [
      {
        q: { es: "¿Son fiables los resultados de las calculadoras financieras?", en: "How reliable are the results from these financial calculators?" },
        a: { es: "Los cálculos son orientativos y se basan en fórmulas estándar del sector y en los datos fiscales vigentes en España para 2026 (tramos IRPF, tipos de cotización, etc.). Para decisiones de gran impacto —hipoteca, inversión o planificación de jubilación—, contrasta siempre los resultados con un asesor financiero o con la entidad bancaria correspondiente.", en: "The calculations are indicative and are based on standard industry formulas and current Spanish tax data for 2026 (income tax brackets, contribution rates, etc.). For high-stakes decisions—mortgage, investment or retirement planning—always cross-check the results with a financial adviser or your bank." },
      },
      {
        q: { es: "¿Qué diferencia hay entre TIN y TAE?", en: "What is the difference between TIN and APR?" },
        a: { es: "El TIN (Tipo de Interés Nominal) es el interés puro del préstamo, sin comisiones ni gastos adicionales. La TAE (Tasa Anual Equivalente) incluye todos los costes —comisiones de apertura, seguros vinculados, gastos de gestión— y refleja el coste real anual del producto financiero. Siempre debes comparar préstamos e hipotecas por su TAE, no por su TIN.", en: "The TIN (nominal interest rate) is the pure interest rate on the loan, excluding fees and additional costs. The TAE (Annual Percentage Rate) includes all costs—opening fees, linked insurance, management charges—and reflects the true annual cost of the financial product. Always compare loans and mortgages by their APR, not their nominal rate." },
      },
      {
        q: { es: "¿Con qué frecuencia se actualizan los datos fiscales?", en: "How often is the tax data updated?" },
        a: { es: "Actualizamos los tramos de IRPF, los tipos de cotización a la Seguridad Social y las tablas de retención al inicio de cada año fiscal, cuando la Agencia Tributaria publica los nuevos valores. En 2026 ya están incorporados los tramos aprobados en los Presupuestos Generales del Estado.", en: "We update the income tax brackets, Social Security contribution rates and withholding tables at the start of each tax year, when the Tax Agency publishes the new values. The 2026 figures approved in the General State Budget are already incorporated." },
      },
    ],
  },
  hogar: {
    intro: {
      es: "Las calculadoras de hogar de TheCalculator te permiten desglosar y controlar los dos grandes gastos variables del día a día: el coche y la electricidad. Conocer el coste real anual de tu vehículo —sumando combustible, seguro, mantenimiento, impuestos y amortización— o saber qué electrodomésticos disparan tu factura de la luz son el punto de partida para tomar decisiones de ahorro con datos reales.",
      en: "TheCalculator's home calculators let you break down and control the two biggest variable day-to-day expenses: your car and your electricity. Knowing the true annual cost of your vehicle—adding fuel, insurance, maintenance, taxes and depreciation—or understanding which appliances are driving up your electricity bill are the starting point for making genuine savings decisions based on real data.",
    },
    faqs: [
      {
        q: { es: "¿Cuánto cuesta realmente mantener un coche en España?", en: "What does it really cost to run a car in Spain?" },
        a: { es: "El coste total de un coche de gama media en España oscila entre 4.000 y 7.000 € anuales si se suman combustible, seguro, ITV, revisiones, neumáticos e impuestos municipales (IVTM). La amortización del precio de compra suele ser la partida más alta pero la más invisible: un coche de 20.000 € con 10 años de vida útil supone 2.000 € anuales solo por el paso del tiempo.", en: "The total annual cost of a mid-range car in Spain ranges from €4,000 to €7,000 once you add fuel, insurance, roadworthiness test, services, tyres and local taxes. Depreciation is usually the largest but most invisible item: a €20,000 car with a 10-year useful life represents €2,000 per year just from the passage of time." },
      },
      {
        q: { es: "¿Qué electrodomésticos consumen más electricidad?", en: "Which appliances use the most electricity?" },
        a: { es: "Los mayores consumidores en un hogar típico español son el calentador eléctrico o termo (1.500-2.500 W), el horno (2.000-3.500 W), el aire acondicionado (1.000-3.000 W según potencia) y la secadora (2.000-3.000 W). La nevera, aunque siempre encendida, suele ser más eficiente gracias a los ciclos de compresor. Consulta la etiqueta energética de cada aparato y usa la calculadora para estimar el coste mensual real.", en: "The biggest consumers in a typical Spanish home are the electric water heater (1,500–2,500 W), the oven (2,000–3,500 W), the air conditioning unit (1,000–3,000 W depending on capacity) and the tumble dryer (2,000–3,000 W). The fridge, although always on, is usually more efficient thanks to compressor cycles. Check the energy label on each appliance and use the calculator to estimate the real monthly cost." },
      },
    ],
  },
  trabajo: {
    intro: {
      es: "Las calculadoras de trabajo de TheCalculator cubren los aspectos laborales más habituales en España: calcular el paro al que tienes derecho tras un despido o ERTE, estimar el finiquito que te corresponde, llevar el registro de horas trabajadas o simular tu cuota como autónomo en el nuevo sistema de cotización por ingresos reales. Todas las herramientas incorporan la legislación laboral vigente en 2026.",
      en: "TheCalculator's work calculators cover the most common employment situations in Spain: calculating the unemployment benefit you are entitled to after a dismissal or furlough, estimating your severance pay, tracking your working hours or simulating your self-employed contribution under the new real-income-based system. All tools incorporate current 2026 labour legislation.",
    },
    faqs: [
      {
        q: { es: "¿Cuánto paro me corresponde si me despiden?", en: "How much unemployment benefit am I entitled to if I am dismissed?" },
        a: { es: "El subsidio de desempleo en España equivale al 70% de tu base reguladora durante los primeros 180 días y al 60% a partir del día 181. La base reguladora se calcula como la media de las bases de cotización de los últimos 180 días trabajados. El tiempo máximo de prestación depende de los años cotizados: desde 4 meses con 1 año cotizado hasta 2 años con más de 6 años cotizados.", en: "Unemployment benefit in Spain equals 70% of your regulatory base for the first 180 days and 60% from day 181 onwards. The regulatory base is calculated as the average contribution base over the last 180 days worked. The maximum benefit period depends on years of contributions: from 4 months with 1 year's contributions up to 2 years with more than 6 years." },
      },
      {
        q: { es: "¿Qué incluye el finiquito en caso de despido?", en: "What does severance pay include on dismissal?" },
        a: { es: "El finiquito recoge los conceptos pendientes en el momento de la extinción del contrato: los días de vacaciones no disfrutadas, la parte proporcional de las pagas extraordinarias (si no se han prorrateado) y los salarios devengados y no cobrados. No incluye la indemnización por despido, que es un concepto separado: 33 días por año trabajado en despido improcedente o 20 días en despido objetivo.", en: "Severance pay covers amounts outstanding at the time the contract ends: unused holiday days, the proportional share of bonus payments (if not already spread across monthly pay) and accrued but unpaid wages. It does not include the dismissal compensation, which is a separate concept: 33 days per year worked for unfair dismissal or 20 days for objective grounds dismissal." },
      },
      {
        q: { es: "¿Cómo funciona la cuota de autónomos en 2026?", en: "How does the self-employed contribution work in 2026?" },
        a: { es: "Desde 2023, la cuota de autónomos en España se calcula en función de los rendimientos netos previstos, no de una base de cotización elegida libremente. Existen 15 tramos: los ingresos más bajos pagan desde 200 € al mes y los más altos llegan a más de 500 €. La cuota se regulariza al año siguiente cuando se conocen los rendimientos reales declarados en la renta.", en: "Since 2023, self-employed contributions in Spain are calculated based on projected net income, not a freely chosen contribution base. There are 15 brackets: the lowest incomes pay from €200 per month and the highest reach over €500. Contributions are settled the following year once the actual income declared in the tax return is known." },
      },
    ],
  },
  educacion: {
    intro: {
      es: "Las calculadoras de educación de TheCalculator resuelven problemas de matemáticas, física y conversión de unidades de forma inmediata. Desde el teorema de Pitágoras y la regla de tres hasta el movimiento uniformemente acelerado o la conversión entre sistemas de unidades internacionales, cada herramienta explica el procedimiento y la fórmula utilizada para que puedas entender —y aprender— cómo se llega al resultado.",
      en: "TheCalculator's education calculators solve maths, physics and unit conversion problems instantly. From the Pythagorean theorem and the rule of three to uniformly accelerated motion or conversion between international unit systems, each tool explains the procedure and formula used so you can understand—and learn—how the result is reached.",
    },
    faqs: [
      {
        q: { es: "¿Puedo usar estas calculadoras para estudiar?", en: "Can I use these calculators to study?" },
        a: { es: "Sí. Cada calculadora muestra el resultado junto con la fórmula aplicada y ejemplos resueltos en las preguntas frecuentes. Son útiles para verificar ejercicios de clase, comprobar que el procedimiento manual es correcto y entender el método detrás de cada cálculo. También permiten explorar cómo cambia el resultado al variar los parámetros, lo que ayuda a desarrollar la intuición matemática.", en: "Yes. Each calculator shows the result alongside the formula used and worked examples in the frequently asked questions. They are useful for checking classroom exercises, verifying that a manual calculation is correct and understanding the method behind each calculation. They also let you explore how the result changes when you vary the parameters, which helps develop mathematical intuition." },
      },
      {
        q: { es: "¿Qué unidades soporta el conversor?", en: "What units does the converter support?" },
        a: { es: "El conversor de unidades cubre longitud, masa, temperatura, energía, velocidad, área y volumen. Incluye conversiones entre el Sistema Internacional (metros, kilogramos, joules, kelvin) y unidades del sistema anglosajón (millas, libras, BTU, fahrenheit), así como unidades de uso cotidiano como kilocalorías, kilómetros por hora o litros.", en: "The unit converter covers length, mass, temperature, energy, speed, area and volume. It includes conversions between the International System (metres, kilograms, joules, kelvin) and imperial units (miles, pounds, BTU, fahrenheit), as well as everyday units such as kilocalories, kilometres per hour and litres." },
      },
    ],
  },
  salud: {
    intro: {
      es: "Las calculadoras de salud de TheCalculator ofrecen referencias rápidas sobre tu composición corporal y necesidades energéticas diarias, basadas en fórmulas clínicas validadas. El Índice de Masa Corporal (IMC) sigue los criterios de clasificación de la Organización Mundial de la Salud y la calculadora de calorías utiliza la ecuación de Mifflin-St Jeor (1990), considerada la más precisa para adultos no deportistas de alto rendimiento según la evidencia científica actual.",
      en: "TheCalculator's health calculators provide quick references on your body composition and daily energy needs, based on validated clinical formulas. The Body Mass Index (BMI) follows World Health Organisation classification criteria and the calorie calculator uses the Mifflin-St Jeor equation (1990), considered the most accurate for non-elite-athlete adults according to current scientific evidence.",
    },
    faqs: [
      {
        q: { es: "¿Son sustitutos de un profesional médico?", en: "Are these a substitute for a medical professional?" },
        a: { es: "No. Los resultados son orientativos y se basan en promedios estadísticos de la población general, no en tu historial clínico individual. El IMC, por ejemplo, no distingue masa muscular de grasa corporal ni tiene en cuenta factores como la edad, el sexo o la distribución de la grasa. Para diagnóstico nutricional, tratamiento o dieta personalizada, consulta siempre con tu médico o con un dietista-nutricionista colegiado.", en: "No. The results are indicative and are based on statistical averages for the general population, not your individual medical history. BMI, for example, does not distinguish muscle mass from body fat and does not account for factors such as age, sex or fat distribution. For nutritional diagnosis, treatment or personalised diet, always consult your doctor or a registered dietitian." },
      },
      {
        q: { es: "¿Por qué el IMC puede ser inexacto para deportistas?", en: "Why can BMI be inaccurate for athletes?" },
        a: { es: "El IMC mide únicamente la relación entre peso y talla, sin distinguir entre músculo y grasa. Una persona con mucha masa muscular puede tener un IMC en la categoría de 'sobrepeso' o incluso 'obesidad' siendo completamente sana y con un bajo porcentaje de grasa corporal. Para evaluar la composición corporal de forma más precisa, los profesionales de la salud utilizan otras métricas como el porcentaje de grasa corporal, el perímetro abdominal o la bioimpedancia.", en: "BMI only measures the ratio between weight and height, without distinguishing between muscle and fat. A very muscular person can have a BMI in the 'overweight' or even 'obese' category while being completely healthy and having a low body fat percentage. To assess body composition more accurately, health professionals use other metrics such as body fat percentage, waist circumference or bioelectrical impedance." },
      },
    ],
  },
};

export default function Category() {
  const { categoria = "" } = useParams();
  const locale = useLocale();
  const isEn = locale === "en";

  const categoryId = isEn ? EN_TO_ES_CATEGORY[categoria] : categoria;
  const category = getCategory(categoryId ?? categoria);

  if (!category) return <NotFound />;

  const calcs = getCalculatorsByCategory(category.id);
  const Icon = category.icon;

  const displayName = isEn ? category.enName : category.name;
  const displayDesc = isEn ? category.enDescription : category.description;
  const seoPath = isEn
    ? `/en/calculators/${EN_CATEGORY_SLUGS[category.id]}`
    : `/calculadoras/${category.id}`;
  const alternatePath = isEn
    ? `/calculadoras/${category.id}`
    : `/en/calculators/${EN_CATEGORY_SLUGS[category.id]}`;
  const homeHref = isEn ? "/en" : "/";
  const homeLabel = isEn ? "Home" : "Inicio";
  const pageTitle = isEn
    ? `${displayName} Calculators`
    : `Calculadoras de ${displayName}`;

  const content = CATEGORY_CONTENT[category.id];
  const intro = content ? (isEn ? content.intro.en : content.intro.es) : null;
  const faqs = content ? content.faqs : [];
  const faqLabel = isEn ? "Frequently asked questions" : "Preguntas frecuentes";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Seo
        title={pageTitle}
        description={displayDesc}
        path={seoPath}
        alternatePath={alternatePath}
      />

      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link href={homeHref} className="hover:text-primary transition-colors">
          {homeLabel}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-200">{displayName}</span>
      </nav>

      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${category.color}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
            {pageTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {displayDesc}
          </p>
        </div>
      </div>

      {intro && (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {intro}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {calcs.map((calc) => (
          <CalculatorCard key={calc.slug} calc={calc} />
        ))}
      </div>

      <AdUnit slot={AD_SLOTS.afterResult} className="mt-10" />

      {faqs.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xl font-semibold mb-4">{faqLabel}</h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`q${i + 1}`}>
                <AccordionTrigger>{isEn ? faq.q.en : faq.q.es}</AccordionTrigger>
                <AccordionContent>{isEn ? faq.a.en : faq.a.es}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}
    </div>
  );
}
