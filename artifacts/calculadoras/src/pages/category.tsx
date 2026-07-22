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
  intro2: { es: string; en: string };
  faqs: Array<{ q: { es: string; en: string }; a: { es: string; en: string } }>;
}

const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  finanzas: {
    intro: {
      es: "Las calculadoras financieras de TheCalculator te ayudan a planificar tus finanzas personales con datos actualizados a 2026. Desde calcular la cuota mensual de una hipoteca o el coste real de un préstamo hasta estimar tu salario neto tras IRPF y Seguridad Social, cada herramienta incluye explicaciones detalladas para que entiendas el resultado, no solo el número. Todas las fórmulas siguen los estándares bancarios y la legislación fiscal vigente en España.",
      en: "TheCalculator's financial calculators help you plan your personal finances with data updated for 2026. From working out your monthly mortgage payment or the true cost of a loan to estimating your net take-home pay after income tax and Social Security, each tool includes detailed explanations so you understand the result, not just the number. All formulas follow standard banking conventions and current Spanish tax legislation.",
    },
    intro2: {
      es: "Antes de usar cualquiera de estas herramientas conviene tener claro un principio: el resultado de una calculadora es un punto de partida para decidir, no una cifra definitiva. Una hipoteca depende de la tasación del inmueble y del perfil de riesgo que te asigne el banco; una nómina, de tu situación familiar y de tu comunidad autónoma. Por eso cada calculadora incluye un apartado que explica cómo interpretar el número obtenido y qué factores pueden desviarlo en tu caso concreto, además de un ejemplo resuelto paso a paso con la fórmula desarrollada.",
      en: "Before using any of these tools it is worth being clear about one principle: a calculator's result is a starting point for a decision, not a definitive figure. A mortgage depends on the property valuation and the risk profile the bank assigns you; a payslip depends on your family situation and your autonomous region. That is why each calculator includes a section explaining how to interpret the number obtained and which factors can shift it in your particular case, along with a step-by-step worked example showing the formula.",
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
      {
        q: { es: "¿Estas calculadoras guardan mis datos?", en: "Do these calculators store my data?" },
        a: { es: "No. Todos los cálculos se ejecutan íntegramente en tu navegador mediante JavaScript, sin enviar información a ningún servidor. Los datos que introduces —salario, importe de la hipoteca, ingresos— no salen de tu dispositivo y desaparecen al cerrar la pestaña. La única información que se almacena localmente es la lista de las últimas calculadoras visitadas, guardada en el almacenamiento local del navegador para ofrecerte accesos rápidos, y puedes borrarla en cualquier momento limpiando los datos del sitio.", en: "No. All calculations run entirely in your browser using JavaScript, with no information sent to any server. The data you enter — salary, mortgage amount, income — never leaves your device and disappears when you close the tab. The only information stored locally is the list of calculators you last visited, kept in browser local storage to offer you quick links, and you can delete it at any time by clearing the site data." },
      },
      {
        q: { es: "¿Qué calculadora uso para comparar dos préstamos?", en: "Which calculator should I use to compare two loans?" },
        a: { es: "Para comparar préstamos con condiciones distintas, la herramienta adecuada es la calculadora de TAE, porque convierte tipos nominales con diferentes frecuencias de capitalización a una cifra homogénea y comparable. Si además quieres ver el impacto en tu presupuesto mensual, combínala con la calculadora de préstamo personal, que te da la cuota y el total de intereses. Y si estás valorando amortizar una hipoteca ya existente, la calculadora de amortización anticipada te muestra cuánto ahorrarías reduciendo cuota frente a reducir plazo.", en: "To compare loans with different conditions, the right tool is the APR calculator, because it converts nominal rates with different compounding frequencies into a single comparable figure. If you also want to see the impact on your monthly budget, combine it with the personal loan calculator, which gives you the payment and total interest. And if you are considering repaying an existing mortgage early, the early repayment calculator shows how much you would save by reducing the payment versus reducing the term." },
      },
    ],
  },
  hogar: {
    intro: {
      es: "Las calculadoras de hogar de TheCalculator te permiten desglosar y controlar los dos grandes gastos variables del día a día: el coche y la electricidad. Conocer el coste real anual de tu vehículo —sumando combustible, seguro, mantenimiento, impuestos y amortización— o saber qué electrodomésticos disparan tu factura de la luz son el punto de partida para tomar decisiones de ahorro con datos reales.",
      en: "TheCalculator's home calculators let you break down and control the two biggest variable day-to-day expenses: your car and your electricity. Knowing the true annual cost of your vehicle—adding fuel, insurance, maintenance, taxes and depreciation—or understanding which appliances are driving up your electricity bill are the starting point for making genuine savings decisions based on real data.",
    },
    intro2: {
      es: "El valor de estas herramientas está en convertir gastos difusos en cifras concretas. La mayoría de conductores infravalora lo que le cuesta su coche porque solo cuenta la gasolina, y muy pocos hogares saben qué proporción de su factura eléctrica se va en un solo electrodoméstico. Poner números sobre la mesa es lo que permite decidir con criterio si compensa cambiar de vehículo, si merece la pena sustituir un aparato antiguo o si desplazar ciertos consumos a la franja horaria valle supone un ahorro apreciable a final de año.",
      en: "The value of these tools lies in turning vague expenses into concrete figures. Most drivers underestimate what their car costs them because they only count fuel, and very few households know what share of their electricity bill goes on a single appliance. Putting numbers on the table is what lets you judge sensibly whether changing vehicle pays off, whether replacing an old appliance is worthwhile, or whether shifting certain consumption to off-peak hours makes an appreciable saving by year end.",
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
      {
        q: { es: "¿Con qué frecuencia debo revisar estos cálculos?", en: "How often should I review these calculations?" },
        a: { es: "Al menos una vez al año, y siempre que cambie alguna condición relevante. El precio del combustible y el del kilowatio-hora fluctúan de forma notable a lo largo del año, y la prima del seguro se renueva anualmente, a menudo con subidas que pasan desapercibidas si tienes domiciliado el recibo. Un repaso anual con los precios actualizados te permite detectar desviaciones y decidir si conviene cambiar de compañía, ajustar la potencia contratada o revisar hábitos de consumo antes de que el sobrecoste se consolide.", en: "At least once a year, and whenever a relevant condition changes. Fuel and kilowatt-hour prices fluctuate considerably over the year, and insurance premiums renew annually, often with increases that go unnoticed if you pay by direct debit. An annual review with updated prices lets you spot deviations and decide whether to switch provider, adjust your contracted power or review consumption habits before the extra cost becomes entrenched." },
      },
      {
        q: { es: "¿Incluyen estas calculadoras la depreciación del vehículo?", en: "Do these calculators include vehicle depreciation?" },
        a: { es: "No, y es importante tenerlo presente. La calculadora de gasto de coche se centra en los desembolsos corrientes que realizas cada mes: combustible, seguro, mantenimiento, impuestos y aparcamiento. La depreciación, es decir, la pérdida de valor del vehículo con el tiempo, no se paga mes a mes pero suele ser el mayor coste real de tener coche: un turismo nuevo pierde en torno al 20-25 % de su valor el primer año. Si quieres el coste total de propiedad, súmale la depreciación anual estimada al resultado que obtengas.", en: "No, and this is important to bear in mind. The car cost calculator focuses on the running costs you pay each month: fuel, insurance, maintenance, taxes and parking. Depreciation — the vehicle's loss of value over time — is not paid monthly but is usually the biggest real cost of car ownership: a new car loses around 20-25% of its value in the first year. If you want the total cost of ownership, add the estimated annual depreciation to the result you obtain." },
      },
      {
        q: { es: "¿De dónde salen los precios de referencia?", en: "Where do the reference prices come from?" },
        a: { es: "Los valores que aparecen por defecto son medias orientativas del mercado español, tomadas de fuentes públicas como los informes de la OCU y la DGT para los costes de automoción y los precios medios del mercado eléctrico para el kilovatio-hora. Están pensados como punto de partida cuando no conoces tus cifras exactas, pero el resultado será mucho más útil si los sustituyes por tus datos reales: el consumo medio que marca el ordenador de a bordo de tu coche y el precio del kWh que figura en tu última factura.", en: "The default values are indicative averages for the Spanish market, taken from public sources such as OCU and DGT reports for motoring costs and average electricity market prices for the kilowatt-hour. They are intended as a starting point when you do not know your exact figures, but the result will be far more useful if you replace them with your real data: the average consumption shown by your car's trip computer and the kWh price on your latest bill." },
      },
    ],
  },
  trabajo: {
    intro: {
      es: "Las calculadoras de trabajo de TheCalculator cubren los aspectos laborales más habituales en España: calcular el paro al que tienes derecho tras un despido o ERTE, estimar el finiquito que te corresponde, llevar el registro de horas trabajadas o simular tu cuota como autónomo en el nuevo sistema de cotización por ingresos reales. Todas las herramientas incorporan la legislación laboral vigente en 2026.",
      en: "TheCalculator's work calculators cover the most common employment situations in Spain: calculating the unemployment benefit you are entitled to after a dismissal or furlough, estimating your severance pay, tracking your working hours or simulating your self-employed contribution under the new real-income-based system. All tools incorporate current 2026 labour legislation.",
    },
    intro2: {
      es: "Los cálculos laborales tienen una particularidad: casi siempre hay un plazo legal asociado y perderlo puede costarte un derecho. Reclamar un despido son 20 días hábiles, solicitar la prestación por desempleo son 15, y el registro de jornada es obligatorio desde 2019 con sanciones de hasta 7.500 euros. Por eso estas calculadoras no se limitan a dar un número: cada una explica la normativa aplicable, los plazos que debes respetar y los conceptos que conviene revisar antes de firmar cualquier documento que te presente la empresa.",
      en: "Employment calculations have one particularity: there is almost always an associated legal deadline, and missing it can cost you a right. Contesting a dismissal takes 20 working days, claiming unemployment benefit 15, and time tracking has been compulsory since 2019 with fines of up to €7,500. That is why these calculators do not simply give a number: each one explains the applicable rules, the deadlines you must respect and the items worth checking before signing any document the company puts in front of you.",
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
      {
        q: { es: "¿Estos cálculos tienen validez legal?", en: "Do these calculations have legal validity?" },
        a: { es: "No. Son estimaciones orientativas basadas en la normativa vigente y sirven para que sepas aproximadamente qué esperar y puedas detectar si una cifra que te presentan se desvía de lo razonable. No sustituyen al cálculo oficial de la empresa, del SEPE o de la Seguridad Social, ni tienen valor probatorio ante un juzgado. Si detectas una discrepancia significativa respecto a lo que te ofrecen, lo procedente es acudir al sindicato, a un graduado social o a un abogado laboralista antes de firmar nada.", en: "No. They are indicative estimates based on current legislation, useful so you roughly know what to expect and can spot whether a figure presented to you departs from what is reasonable. They do not replace the official calculation by your employer, the employment service or Social Security, nor do they have evidential value in court. If you find a significant discrepancy against what you are offered, the right step is to consult your union, a labour advisor or an employment lawyer before signing anything." },
      },
      {
        q: { es: "¿Se actualizan con los cambios de normativa?", en: "Are they updated with legislative changes?" },
        a: { es: "Sí. Revisamos los parámetros al inicio de cada año y cuando entra en vigor una reforma relevante: tramos de cotización del RETA, cuantías del IPREM, escala de porcentajes de la pensión, topes de indemnización por despido o la reducción prevista de la jornada máxima semanal. Aun así, la legislación laboral española cambia con frecuencia y algunos parámetros dependen del convenio colectivo aplicable a tu sector, que puede establecer condiciones más favorables que el Estatuto de los Trabajadores.", en: "Yes. We review the parameters at the start of each year and whenever a relevant reform comes into force: self-employed contribution brackets, IPREM amounts, the pension percentage scale, dismissal indemnity caps or the planned reduction of the maximum working week. Even so, Spanish employment law changes frequently and some parameters depend on the collective agreement applying to your sector, which may set more favourable conditions than the Workers' Statute." },
      },
    ],
  },
  educacion: {
    intro: {
      es: "Las calculadoras de educación de TheCalculator resuelven problemas de matemáticas, física y conversión de unidades de forma inmediata. Desde el teorema de Pitágoras y la regla de tres hasta el movimiento uniformemente acelerado o la conversión entre sistemas de unidades internacionales, cada herramienta explica el procedimiento y la fórmula utilizada para que puedas entender —y aprender— cómo se llega al resultado.",
      en: "TheCalculator's education calculators solve maths, physics and unit conversion problems instantly. From the Pythagorean theorem and the rule of three to uniformly accelerated motion or conversion between international unit systems, each tool explains the procedure and formula used so you can understand—and learn—how the result is reached.",
    },
    intro2: {
      es: "Estas herramientas están pensadas tanto para resolver un ejercicio concreto como para entender el procedimiento que hay detrás. Cada calculadora muestra la fórmula aplicada y desarrolla un ejemplo paso a paso, porque en un examen no basta con acertar el resultado: hay que saber justificar el planteamiento. Encontrarás además tablas de referencia con los datos que suelen pedirse de memoria, como las ternas pitagóricas, los factores de conversión entre unidades o las equivalencias entre nota numérica y calificación cualitativa.",
      en: "These tools are designed both to solve a specific exercise and to understand the procedure behind it. Each calculator shows the formula applied and works through an example step by step, because in an exam getting the right answer is not enough: you need to be able to justify the approach. You will also find reference tables with the data usually expected from memory, such as Pythagorean triples, unit conversion factors or the equivalence between numeric grades and qualitative marks.",
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
      {
        q: { es: "¿Puedo usar estas calculadoras para comprobar mis deberes?", en: "Can I use these calculators to check my homework?" },
        a: { es: "Sí, y es uno de sus usos más habituales. Cada herramienta muestra la fórmula aplicada y desarrolla el procedimiento, de modo que puedes contrastar no solo el resultado final sino también los pasos intermedios de tu planteamiento. Eso es especialmente útil cuando el resultado no coincide: comparando paso a paso suele identificarse enseguida dónde está el error, que en física y matemáticas de bachillerato casi siempre es una conversión de unidades mal hecha o una fórmula despejada de forma incorrecta.", en: "Yes, and it is one of their most common uses. Each tool shows the formula applied and works through the procedure, so you can check not only the final result but also the intermediate steps of your approach. That is especially useful when the result does not match: comparing step by step usually identifies the error straight away, which in secondary-school physics and maths is almost always a botched unit conversion or an incorrectly rearranged formula." },
      },
      {
        q: { es: "¿Los resultados llevan las unidades del Sistema Internacional?", en: "Do results use International System units?" },
        a: { es: "Las calculadoras de física trabajan internamente en unidades del Sistema Internacional —metros, segundos, kilogramos— pero te permiten introducir y obtener los datos en las unidades que prefieras, incluidas kilómetros por hora, minutos o millas. Esa flexibilidad es cómoda, pero conviene recordar que en un examen se suele exigir el resultado en unidades del SI y con el número de cifras significativas adecuado. El conversor de unidades te ayuda a pasar de unas a otras cuando el enunciado y la respuesta pedida no coinciden.", en: "The physics calculators work internally in International System units — metres, seconds, kilograms — but let you enter and obtain data in whichever units you prefer, including kilometres per hour, minutes or miles. That flexibility is convenient, but remember that exams usually require the result in SI units with the appropriate number of significant figures. The unit converter helps you move between them when the question and the required answer do not match." },
      },
      {
        q: { es: "¿Sirven para preparar la EBAU o exámenes oficiales?", en: "Are they useful for preparing official exams?" },
        a: { es: "Son un buen apoyo para practicar y verificar, pero no sustituyen al trabajo con el temario y los exámenes de convocatorias anteriores. En pruebas como la EBAU se valora el procedimiento tanto como el resultado, y buena parte de la puntuación se asigna al planteamiento, la justificación de las fórmulas empleadas y la coherencia de las unidades. Usa estas herramientas para comprobar tus soluciones y para entender por qué un método funciona, no como atajo para saltarte el razonamiento.", en: "They are good support for practising and checking, but do not replace working through the syllabus and past papers. In exams like the Spanish university entrance test, the procedure counts as much as the result, and much of the mark is awarded for the setup, the justification of the formulas used and unit consistency. Use these tools to verify your solutions and to understand why a method works, not as a shortcut around the reasoning." },
      },
    ],
  },
  salud: {
    intro: {
      es: "Las calculadoras de salud de TheCalculator ofrecen referencias rápidas sobre tu composición corporal y necesidades energéticas diarias, basadas en fórmulas clínicas validadas. El Índice de Masa Corporal (IMC) sigue los criterios de clasificación de la Organización Mundial de la Salud y la calculadora de calorías utiliza la ecuación de Mifflin-St Jeor (1990), considerada la más precisa para adultos no deportistas de alto rendimiento según la evidencia científica actual.",
      en: "TheCalculator's health calculators provide quick references on your body composition and daily energy needs, based on validated clinical formulas. The Body Mass Index (BMI) follows World Health Organisation classification criteria and the calorie calculator uses the Mifflin-St Jeor equation (1990), considered the most accurate for non-elite-athlete adults according to current scientific evidence.",
    },
    intro2: {
      es: "Conviene subrayar algo antes de usar estas calculadoras: todas ofrecen estimaciones basadas en fórmulas poblacionales, no diagnósticos. El IMC fue diseñado para estudiar poblaciones y no distingue músculo de grasa; las fórmulas de calorías y de frecuencia cardíaca máxima presentan desviaciones individuales de hasta un 10 % o más entre personas de la misma edad y complexión. Son útiles como punto de partida y para seguir tu propia evolución en el tiempo, pero cualquier decisión relevante sobre tu alimentación, tu entrenamiento o tu salud debe consultarse con un profesional sanitario.",
      en: "One thing should be stressed before using these calculators: they all provide estimates based on population formulas, not diagnoses. BMI was designed to study populations and does not distinguish muscle from fat; calorie and maximum heart rate formulas show individual deviations of up to 10% or more between people of the same age and build. They are useful as a starting point and for tracking your own progress over time, but any significant decision about your diet, your training or your health should be discussed with a healthcare professional.",
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
      {
        q: { es: "¿Sustituyen estas calculadoras a una consulta médica?", en: "Do these calculators replace a medical consultation?" },
        a: { es: "En ningún caso. Son herramientas informativas basadas en fórmulas validadas para población general, pero no valoran tu historial clínico, tu medicación, tus analíticas ni condiciones concretas que modifican por completo las recomendaciones, como el embarazo, la diabetes, una insuficiencia renal o una cardiopatía. Si tienes cualquier duda sobre tu peso, tu alimentación, tu hidratación o la intensidad a la que puedes entrenar con seguridad, consulta con tu médico de familia, un dietista-nutricionista colegiado o un especialista en medicina deportiva.", en: "Under no circumstances. They are informational tools based on formulas validated for the general population, but they do not assess your medical history, your medication, your blood tests or specific conditions that completely change the recommendations, such as pregnancy, diabetes, kidney failure or heart disease. If you have any doubt about your weight, your diet, your hydration or the intensity at which you can safely train, consult your GP, a registered dietitian or a sports medicine specialist." },
      },
      {
        q: { es: "¿Por qué distintas calculadoras dan resultados diferentes?", en: "Why do different calculators give different results?" },
        a: { es: "Porque existen varias fórmulas validadas para la misma magnitud y cada una se obtuvo estudiando poblaciones distintas. Para la frecuencia cardíaca máxima conviven la clásica «220 − edad» y la de Tanaka, más precisa; para el gasto energético están Mifflin-St Jeor, Harris-Benedict y Katch-McArdle, que además requiere conocer tu porcentaje de grasa corporal. Las diferencias entre ellas pueden alcanzar el 10 %. Lo importante no es cuál da el número más favorable, sino usar siempre la misma fórmula para poder comparar tu evolución de forma coherente en el tiempo.", en: "Because several validated formulas exist for the same quantity and each was derived by studying different populations. For maximum heart rate, the classic '220 − age' coexists with the more accurate Tanaka formula; for energy expenditure there are Mifflin-St Jeor, Harris-Benedict and Katch-McArdle, the latter also requiring your body fat percentage. Differences between them can reach 10%. What matters is not which gives the most favourable number, but always using the same formula so you can track your progress consistently over time." },
      },
      {
        q: { es: "¿Son válidas estas fórmulas para niños y adolescentes?", en: "Are these formulas valid for children and adolescents?" },
        a: { es: "No. Todas las calculadoras de esta sección están diseñadas para población adulta. En menores de 18 años, el IMC no se interpreta con los rangos fijos de la OMS para adultos, sino mediante percentiles ajustados por edad y sexo, porque la composición corporal cambia de forma acusada durante el crecimiento. Lo mismo ocurre con las necesidades calóricas y de hidratación, que dependen de la fase de desarrollo. Para valorar la salud de un niño o adolescente hay que acudir siempre a las tablas pediátricas y a la consulta de su pediatra.", en: "No. All the calculators in this section are designed for adults. In under-18s, BMI is not interpreted with the WHO's fixed adult ranges but through percentiles adjusted for age and sex, because body composition changes markedly during growth. The same applies to calorie and hydration needs, which depend on the stage of development. To assess a child's or adolescent's health you must always use paediatric charts and consult their paediatrician." },
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
  const intro2 = content ? (isEn ? content.intro2.en : content.intro2.es) : null;
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
        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>{intro}</p>
          {intro2 && <p>{intro2}</p>}
        </div>
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
