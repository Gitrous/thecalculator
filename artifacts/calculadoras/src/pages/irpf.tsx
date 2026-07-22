import React, { useState, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { ArrowLeft, Calculator, ChevronsUpDown, Check, Download } from "lucide-react";
import { downloadChart } from "@/lib/chart-download";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale";

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora IRPF",
    subtitle: "Calcula tu sueldo neto y las retenciones del impuesto sobre la renta según tu país y región.",
    intro1: "El IRPF (Impuesto sobre la Renta de las Personas Físicas) es el principal impuesto directo en España y grava los ingresos obtenidos por los residentes: salarios, pensiones, rendimientos del capital, ganancias patrimoniales y actividades económicas. Es un impuesto progresivo, lo que significa que a mayor renta, mayor porcentaje se paga: los tramos oscilan entre el 19% y el 47% en la escala estatal, aunque las comunidades autónomas tienen capacidad para modificarlos.",
    intro2: "Esta calculadora estima el impuesto sobre la renta en España y otros países hispanohablantes (México, Argentina, Colombia), aplicando los tramos nacionales principales. El resultado te muestra la retención estimada, las cotizaciones a la Seguridad Social y el neto mensual y anual. Especialmente útil para negociar un salario, comparar condiciones fiscales entre países o preparar la declaración de la renta.",
    disclaimer: "Los cálculos son estimaciones orientativas. Para una declaración de la renta exacta, utiliza el borrador de la AEAT o consulta a un asesor fiscal.",
    cardTitle: "Tus Datos",
    grossLabel: "Salario bruto anual",
    countryLabel: "País",
    countrySearch: "Buscar país...",
    countryNotFound: "No se encontró ningún país.",
    ccaaPlaceholder: "Selecciona una región...",
    ccaaSearch: "Buscar región...",
    ccaaNotFound: "No se encontró ninguna región.",
    calculateBtn: "Calcular",
    taxLabel: "Impuesto",
    contribLabel: "Cotizaciones",
    formDisclaimer: "Cálculo orientativo basado en tablas fiscales aproximadas de cada país. Las cifras oficiales varían y se actualizan periódicamente: consulta siempre a la agencia tributaria correspondiente (Agencia Tributaria, SAT, AFIP, DIAN).",
    monthlyNet12: "Sueldo Neto Mensual (12 pagas)",
    annualNet: "Sueldo Neto Anual",
    effectiveRate: "Tipo Efectivo",
    chartTitle: "Comparativa Bruto vs Neto",
    net: "Neto",
    taxes: "Impuestos",
    socialSec: "Seg. Social",
    bars: "Barras",
    horizontal: "Horizontal",
    pie: "Tarta",
    radial: "Radial",
    placeholder: "Introduce tu salario bruto para calcular tu sueldo neto y retenciones.",
    faqTitle: "Preguntas Frecuentes sobre el IRPF",
    q1: "¿Qué es el IRPF?",
    a1: "El IRPF (Impuesto sobre la Renta de las Personas Físicas) es un impuesto que pagan todos los residentes en España por los ingresos obtenidos durante un año (salarios, alquileres, inversiones, etc.).",
    q2: "¿Qué diferencia hay entre salario bruto y neto?",
    a2: "El salario bruto es el dinero total que la empresa te paga antes de descontar impuestos y cotizaciones. El salario neto es la cantidad final que recibes en tu cuenta bancaria tras aplicar las retenciones y las cotizaciones sociales.",
    q3: "¿Por qué la calculadora incluye otros países además de España?",
    a3: "Además del IRPF español, esta calculadora estima el impuesto equivalente en México (ISR), Argentina (Impuesto a las Ganancias) y Colombia (Retención en la fuente), aplicando las tablas y tramos de cada país. Son cálculos orientativos: las cifras oficiales cambian con frecuencia, así que conviene confirmarlas con la agencia tributaria local.",
    q4: "Si subo de tramo, ¿pago más impuestos por todo mi salario?",
    a4: "No, y este es probablemente el malentendido más extendido sobre el IRPF. El impuesto es progresivo por tramos, lo que significa que cada porción de tu renta tributa al tipo de su propio tramo, no toda la renta al tipo más alto que alcanzas. Si ganas 21.000 € y el tramo que empieza en 20.200 € tributa al 30 %, solo los 800 € que superan ese umbral pagan el 30 %; el resto sigue tributando al 19 % y al 24 % en sus tramos correspondientes. Por eso nunca puede ocurrir que cobrar más bruto te deje menos neto: subir de tramo siempre compensa.",
    q5: "¿Qué son el mínimo personal y familiar?",
    a5: "Es la parte de tu renta que se considera destinada a cubrir tus necesidades básicas y que, por tanto, no tributa. El mínimo personal general asciende a 5.550 € anuales y aumenta con la edad: aporta 1.150 € adicionales a partir de los 65 años y 1.400 € más a partir de los 75. A eso se suman los mínimos por descendientes (2.400 € por el primer hijo, 2.700 € por el segundo, 4.000 € por el tercero y 4.500 € por el cuarto y siguientes), por ascendientes a cargo y por discapacidad. Estos mínimos reducen la base sobre la que se calcula el impuesto y explican que dos personas con el mismo salario paguen cantidades distintas.",
    q6: "¿Por qué mi declaración sale a devolver o a pagar?",
    a6: "Porque la retención que la empresa te aplica cada mes es un pago a cuenta calculado sobre una previsión, no el impuesto definitivo. A lo largo del año pueden cambiar circunstancias que la empresa desconocía: un aumento de sueldo, un cambio de trabajo, el nacimiento de un hijo, una aportación a un plan de pensiones o ingresos de otro pagador. Cuando presentas la declaración se calcula la cuota real y se compara con lo retenido: si te retuvieron de más, Hacienda devuelve la diferencia; si te retuvieron de menos, debes abonarla. Tener dos pagadores es la causa más habitual de que una declaración salga a pagar.",
    deepTitle: "Cómo se calcula el IRPF paso a paso",
    deep: "El cálculo sigue una secuencia fija. Primero se determinan los rendimientos íntegros del trabajo y se les restan las cotizaciones a la Seguridad Social y la reducción por rendimientos del trabajo, obteniendo la base imponible. A continuación se aplican las reducciones que correspondan, como las aportaciones a planes de pensiones, para llegar a la base liquidable. Sobre ella se aplica la escala progresiva por tramos, que en España se compone de una parte estatal y otra autonómica, y de la cuota resultante se descuenta el efecto del mínimo personal y familiar. Por último se restan las deducciones aplicables y se compara el resultado con las retenciones ya practicadas durante el año.",
    exampleTitle: "Ejemplo resuelto",
    example: "Para un salario bruto de 35.000 € anuales: se restan unos 2.223 € de cotizaciones sociales (6,35 %) y la reducción por rendimientos del trabajo, dejando una base liquidable aproximada de 30.800 €. Aplicando la escala por tramos, los primeros 12.450 € tributan al 19 % (2.365 €), los siguientes 7.750 € hasta 20.200 € al 24 % (1.860 €) y los 10.600 € restantes al 30 % (3.180 €), lo que suma 7.405 € de cuota íntegra. Tras aplicar el mínimo personal de 5.550 €, la cuota se reduce a unos 6.350 €, un tipo efectivo cercano al 18 % pese a que el tipo marginal es del 30 %.",
    tableTitle: "Tipos de la base del ahorro (rentas de capital)",
    tableCol1: "Base del ahorro",
    tableCol2: "Tipo aplicable",
    interpretTitle: "Tipo marginal frente a tipo efectivo",
    interpret: "Conviene distinguir dos conceptos que se confunden a menudo. El tipo marginal es el porcentaje que pagarías por el siguiente euro que ganases, es decir, el del tramo más alto que alcanzas; es el dato relevante para decidir si te compensa una hora extra o una aportación a un plan de pensiones. El tipo efectivo es el resultado de dividir la cuota total entre tu renta y siempre es bastante menor que el marginal, porque los primeros tramos tributan a tipos más bajos. En el ejemplo anterior el marginal es del 30 % pero el efectivo ronda el 18 %. Cuando alguien dice «me quitan un tercio del sueldo» suele estar confundiendo su tipo marginal con lo que realmente paga.",
  },
  en: {
    backHome: "Back to home",
    title: "Income Tax Calculator",
    subtitle: "Calculate your net salary and income tax withholding based on your country and region.",
    intro1: "IRPF (Personal Income Tax) is the main direct tax in Spain and levies income earned by residents: salaries, pensions, capital returns, capital gains and business income. It is a progressive tax, meaning that the higher the income, the higher the percentage paid: bands range from 19% to 47% on the state scale, although the autonomous communities can modify them.",
    intro2: "This calculator estimates income tax in Spain and other Spanish-speaking countries (Mexico, Argentina, Colombia), applying the main national tax bands. The result shows you the estimated withholding, social security contributions and monthly and annual net salary. Particularly useful for negotiating a salary, comparing tax conditions between countries or preparing your tax return.",
    disclaimer: "Calculations are indicative estimates. For an exact tax return, use the AEAT draft or consult a tax adviser.",
    cardTitle: "Your Details",
    grossLabel: "Annual gross salary",
    countryLabel: "Country",
    countrySearch: "Search country...",
    countryNotFound: "No country found.",
    ccaaPlaceholder: "Select a region...",
    ccaaSearch: "Search region...",
    ccaaNotFound: "No region found.",
    calculateBtn: "Calculate",
    taxLabel: "Tax",
    contribLabel: "Contributions",
    formDisclaimer: "Estimate based on approximate tax tables for each country. Official figures vary and are updated periodically: always check with the relevant tax authority (Agencia Tributaria, SAT, AFIP, DIAN).",
    monthlyNet12: "Monthly Net Salary (12 payments)",
    annualNet: "Annual Net Salary",
    effectiveRate: "Effective Rate",
    chartTitle: "Gross vs Net Comparison",
    net: "Net",
    taxes: "Taxes",
    socialSec: "Soc. Security",
    bars: "Bars",
    horizontal: "Horizontal",
    pie: "Pie",
    radial: "Radial",
    placeholder: "Enter your gross salary to calculate your net salary and withholding.",
    faqTitle: "Frequently Asked Questions about Income Tax",
    q1: "What is IRPF?",
    a1: "IRPF (Impuesto sobre la Renta de las Personas Físicas) is the Spanish personal income tax paid by all residents in Spain on income earned during a year (salaries, rents, investments, etc.).",
    q2: "What is the difference between gross and net salary?",
    a2: "Gross salary is the total amount the company pays you before deducting taxes and contributions. Net salary is the final amount you receive in your bank account after applying tax withholding and social security contributions.",
    q3: "Why does the calculator include other countries besides Spain?",
    a3: "Besides Spanish IRPF, this calculator estimates the equivalent tax in Mexico (ISR), Argentina (Impuesto a las Ganancias) and Colombia (Retención en la fuente), applying each country's brackets and rates. These are approximate figures: official numbers change frequently, so it's worth confirming them with your local tax authority.",
    q4: "If I move up a bracket, do I pay more tax on my whole salary?",
    a4: "No, and this is probably the most widespread misunderstanding about income tax. The tax is progressive by brackets, which means each portion of your income is taxed at its own bracket's rate, not the whole income at the highest rate you reach. If you earn €21,000 and the bracket starting at €20,200 is taxed at 30%, only the €800 above that threshold pays 30%; the rest continues to be taxed at 19% and 24% in their respective bracket. That is why earning more gross can never leave you with less net: moving up a bracket always pays off.",
    q5: "What are the personal and family allowances?",
    a5: "This is the portion of your income considered to cover your basic needs and which therefore is not taxed. The general personal allowance is €5,550 a year and increases with age: an extra €1,150 from age 65 and a further €1,400 from age 75. Added to this are allowances for dependent children (€2,400 for the first, €2,700 for the second, €4,000 for the third and €4,500 for the fourth and beyond), for dependent ascendants and for disability. These allowances reduce the base on which tax is calculated and explain why two people on the same salary can pay different amounts.",
    q6: "Why does my tax return end in a refund or a payment?",
    a6: "Because the withholding your employer applies each month is a payment on account calculated from a forecast, not the definitive tax. Over the year, circumstances the employer did not know about can change: a pay rise, a change of job, the birth of a child, a pension plan contribution or income from another payer. When you file your return the real liability is calculated and compared with what was withheld: if too much was withheld, the tax authority refunds the difference; if too little, you must pay it. Having two payers is the most common reason for a return ending in a payment.",
    deepTitle: "How income tax is calculated step by step",
    deep: "The calculation follows a fixed sequence. First, gross earned income is determined and social security contributions and the earned-income reduction are subtracted, giving the taxable base. Next, any applicable reductions are applied, such as pension plan contributions, to arrive at the net taxable base. The progressive bracket scale is applied to that figure — in Spain made up of a state part and a regional part — and the effect of the personal and family allowance is deducted from the resulting liability. Finally, applicable deductions are subtracted and the result is compared with the withholdings already made during the year.",
    exampleTitle: "Worked example",
    example: "For a gross salary of €35,000 a year: around €2,223 of social contributions (6.35%) and the earned-income reduction are subtracted, leaving a net taxable base of roughly €30,800. Applying the bracket scale, the first €12,450 is taxed at 19% (€2,365), the next €7,750 up to €20,200 at 24% (€1,860) and the remaining €10,600 at 30% (€3,180), totalling €7,405 of gross liability. After applying the €5,550 personal allowance, the liability falls to about €6,350 — an effective rate near 18% even though the marginal rate is 30%.",
    tableTitle: "Savings income tax rates (capital income)",
    tableCol1: "Savings base",
    tableCol2: "Rate",
    interpretTitle: "Marginal rate versus effective rate",
    interpret: "It is worth distinguishing two concepts that are often confused. The marginal rate is the percentage you would pay on the next euro you earned, that is, the rate of the highest bracket you reach; it is the relevant figure for deciding whether overtime or a pension contribution is worth it. The effective rate is the total liability divided by your income and is always considerably lower than the marginal rate, because the first brackets are taxed at lower rates. In the example above the marginal rate is 30% but the effective rate is around 18%. When someone says 'they take a third of my salary' they are usually confusing their marginal rate with what they actually pay.",
  },
};

const AHORRO_TABLE = [
  { es: "Hasta 6.000 €", en: "Up to €6,000", tipo: "19 %" },
  { es: "6.000 – 50.000 €", en: "€6,000 – €50,000", tipo: "21 %" },
  { es: "50.000 – 200.000 €", en: "€50,000 – €200,000", tipo: "23 %" },
  { es: "200.000 – 300.000 €", en: "€200,000 – €300,000", tipo: "27 %" },
  { es: "Más de 300.000 €", en: "Over €300,000", tipo: "30 %" },
];

// Suma progresiva por tramos: brackets = [[límite superior, tipo], ...] acumulativo desde 0
function progressiveTax(base: number, brackets: [number, number][]): number {
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of brackets) {
    if (base <= prev) break;
    tax += (Math.min(base, limit) - prev) * rate;
    prev = limit;
  }
  return tax;
}

interface CountryDef {
  id: "es" | "mx" | "ar" | "co" | "us" | "de" | "ch" | "ca" | "nl" | "cn" | "br" | "sg"
    | "fr" | "ru" | "gb" | "jp" | "th" | "be" | "kr" | "in";
  flag: string;
  name: string;
  enName: string;
  currency: string;
  currencyLocale: string;
  taxName: string;
  enTaxName: string;
  regionLabel: string;
  enRegionLabel: string;
  contribLabel: string;
  enContribLabel: string;
  regions: string[];
  calculate: (bruto: number, region: string) => { impuesto: number; contribucion: number };
}

const REGIONES_ES = [
  "Andalucía", "Aragón", "Asturias", "Baleares", "Canarias", "Cantabria",
  "Castilla-La Mancha", "Castilla y León", "Cataluña", "Extremadura",
  "Galicia", "Madrid", "Murcia", "Navarra", "País Vasco", "Rioja", "Valencia",
];

const ESTADOS_MX = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México",
  "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
];

const PROVINCIAS_AR = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Ciudad Autónoma de Buenos Aires",
  "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis",
  "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
];

const DEPARTAMENTOS_CO = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá D.C.", "Bolívar", "Boyacá",
  "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca",
  "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño",
  "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia",
  "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada",
];

const ESTADOS_US = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Carolina del Norte",
  "Carolina del Sur", "Colorado", "Connecticut", "Dakota del Norte", "Dakota del Sur",
  "Delaware", "Distrito de Columbia", "Florida", "Georgia", "Hawái", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Luisiana", "Maine", "Maryland", "Massachusetts",
  "Míchigan", "Minnesota", "Misisipi", "Misuri", "Montana", "Nebraska", "Nevada",
  "Nueva Jersey", "Nueva York", "Nuevo Hampshire", "Nuevo México", "Ohio", "Oklahoma",
  "Oregón", "Pensilvania", "Rhode Island", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Virginia Occidental", "Washington", "Wisconsin", "Wyoming",
];

const LANDER_DE = [
  "Baden-Wurtemberg", "Baviera", "Berlín", "Brandeburgo", "Bremen", "Hamburgo", "Hesse",
  "Mecklemburgo-Pomerania Occidental", "Baja Sajonia", "Renania del Norte-Westfalia",
  "Renania-Palatinado", "Sarre", "Sajonia", "Sajonia-Anhalt", "Schleswig-Holstein", "Turingia",
];

const CANTONES_CH = [
  "Zúrich", "Berna", "Lucerna", "Uri", "Schwyz", "Obwalden", "Nidwalden", "Glaris", "Zug",
  "Friburgo", "Soleura", "Basilea-Ciudad", "Basilea-Campiña", "Schaffhausen",
  "Appenzell Rodas Exteriores", "Appenzell Rodas Interiores", "San Galo", "Grisones",
  "Argovia", "Turgovia", "Tesino", "Vaud", "Valais", "Neuchâtel", "Ginebra", "Jura",
];

const PROVINCIAS_CA = [
  "Alberta", "Columbia Británica", "Manitoba", "Nuevo Brunswick", "Terranova y Labrador",
  "Territorios del Noroeste", "Nueva Escocia", "Nunavut", "Ontario",
  "Isla del Príncipe Eduardo", "Quebec", "Saskatchewan", "Yukón",
];

const PROVINCIAS_NL = [
  "Drenthe", "Flevoland", "Frisia", "Gueldres", "Groninga", "Limburgo",
  "Brabante Septentrional", "Holanda Septentrional", "Holanda Meridional",
  "Overijssel", "Utrecht", "Zelanda",
];

const PROVINCIAS_CN = [
  "Pekín", "Shanghái", "Tianjín", "Chongqing", "Cantón (Guangdong)", "Jiangsu", "Zhejiang",
  "Shandong", "Henan", "Sichuan", "Hubei", "Hunan", "Hebei", "Fujian", "Anhui", "Liaoning",
  "Shaanxi", "Jiangxi", "Heilongjiang", "Shanxi", "Yunnan", "Guangxi", "Guizhou", "Jilin",
  "Gansu", "Mongolia Interior", "Xinjiang", "Hainan", "Ningxia", "Qinghai", "Tíbet",
];

const ESTADOS_BR = [
  "São Paulo", "Río de Janeiro", "Minas Gerais", "Bahía", "Paraná", "Rio Grande do Sul",
  "Pernambuco", "Ceará", "Pará", "Santa Catarina", "Goiás", "Maranhão", "Espírito Santo",
  "Paraíba", "Amazonas", "Mato Grosso", "Rio Grande do Norte", "Alagoas", "Piauí",
  "Distrito Federal", "Mato Grosso do Sul", "Sergipe", "Rondônia", "Tocantins", "Acre",
  "Amapá", "Roraima",
];

const DISTRITOS_SG = [
  "Singapur Central", "Singapur Noreste", "Singapur Noroeste", "Singapur Sureste", "Singapur Suroeste",
];

const REGIONES_FR = [
  "Île-de-France", "Auvernia-Ródano-Alpes", "Occitania", "Nueva Aquitania", "Hauts-de-France",
  "Gran Este", "Provenza-Alpes-Costa Azul", "Bretaña", "Normandía", "Países del Loira",
  "Borgoña-Franco Condado", "Centro-Valle del Loira", "Córcega",
];

const REGIONES_RU = [
  "Moscú", "San Petersburgo", "Krasnodar", "Sverdlovsk", "Tatarstán", "Bashkortostán",
  "Rostov", "Cheliábinsk", "Samara", "Nizhni Nóvgorod", "Krasnoyarsk", "Perm", "Volgogrado",
  "Sarátov", "Vorónezh", "Daguestán", "Irkutsk", "Stávropol", "Oremburgo", "Kemérovo",
  "Novosibirsk", "Omsk", "Tiumén", "Crimea",
];

const REGIONES_UK = [
  "Londres", "Sudeste de Inglaterra", "Sudoeste de Inglaterra", "Este de Inglaterra",
  "Midlands Occidentales", "Midlands Orientales", "Yorkshire y Humber",
  "Noroeste de Inglaterra", "Noreste de Inglaterra", "Escocia", "Gales", "Irlanda del Norte",
];

const PREFECTURAS_JP = [
  "Hokkaidō", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima", "Ibaraki",
  "Tochigi", "Gunma", "Saitama", "Chiba", "Tokio", "Kanagawa", "Niigata", "Toyama",
  "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi", "Mie", "Shiga",
  "Kioto", "Osaka", "Hyōgo", "Nara", "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima",
  "Yamaguchi", "Tokushima", "Kagawa", "Ehime", "Kōchi", "Fukuoka", "Saga", "Nagasaki",
  "Kumamoto", "Ōita", "Miyazaki", "Kagoshima", "Okinawa",
];

const PROVINCIAS_TH = [
  "Bangkok", "Chiang Mai", "Chiang Rai", "Nonthaburi", "Nakhon Ratchasima", "Khon Kaen",
  "Udon Thani", "Chonburi", "Rayong", "Phuket", "Surat Thani", "Songkhla",
  "Nakhon Si Thammarat", "Ubon Ratchathani", "Pathum Thani", "Samut Prakan", "Krabi",
  "Ayutthaya", "Kanchanaburi", "Sukhothai",
];

const PROVINCIAS_BE = [
  "Amberes", "Brabante Flamenco", "Brabante Valón", "Henao", "Lieja", "Limburgo",
  "Luxemburgo", "Namur", "Flandes Oriental", "Flandes Occidental", "Bruselas-Capital",
];

const REGIONES_KR = [
  "Seúl", "Busan", "Daegu", "Incheon", "Gwangju", "Daejeon", "Ulsan", "Sejong",
  "Gyeonggi", "Gangwon", "Chungcheong del Norte", "Chungcheong del Sur",
  "Jeolla del Norte", "Jeolla del Sur", "Gyeongsang del Norte", "Gyeongsang del Sur", "Jeju",
];

const ESTADOS_IN = [
  "Andhra Pradesh", "Assam", "Bengala Occidental", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu y Cachemira", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand",
];

const COUNTRIES: CountryDef[] = [
  {
    id: "es",
    flag: "🇪🇸",
    name: "España",
    enName: "Spain",
    currency: "EUR",
    currencyLocale: "es-ES",
    taxName: "IRPF",
    enTaxName: "IRPF",
    regionLabel: "Comunidad Autónoma",
    enRegionLabel: "Autonomous Community",
    contribLabel: "Seguridad Social",
    enContribLabel: "Social Security",
    regions: REGIONES_ES,
    calculate: (bruto, region) => {
      const minimoPersonal = 5550;
      const baseImponible = Math.max(0, bruto - minimoPersonal);
      const cuota = progressiveTax(baseImponible, [
        [12450, 0.19], [20200, 0.24], [35200, 0.30], [60000, 0.37], [300000, 0.45], [Infinity, 0.47],
      ]);
      let ajuste = 1;
      if (region === "Madrid") ajuste = 0.95;
      else if (region === "Cataluña") ajuste = 1.05;
      else if (region === "Andalucía") ajuste = 0.98;
      else if (region === "País Vasco" || region === "Navarra") ajuste = 0.9;
      return { impuesto: cuota * ajuste, contribucion: bruto * 0.0635 };
    },
  },
  {
    id: "mx",
    flag: "🇲🇽",
    name: "México",
    enName: "Mexico",
    currency: "MXN",
    currencyLocale: "es-MX",
    taxName: "ISR",
    enTaxName: "ISR",
    regionLabel: "Estado",
    enRegionLabel: "State",
    contribLabel: "IMSS (cuota obrera)",
    enContribLabel: "IMSS (employee share)",
    regions: ESTADOS_MX,
    calculate: (bruto) => {
      // Tarifa anual ISR personas físicas (aprox., LISR vigente)
      const brackets: [number, number, number][] = [
        [8952.49, 0, 0.0192],
        [75984.55, 171.88, 0.0640],
        [133536.07, 4461.94, 0.1088],
        [155229.80, 10723.55, 0.1600],
        [185852.57, 14194.54, 0.1792],
        [374837.88, 17895.79, 0.2136],
        [590795.99, 58597.20, 0.2352],
        [1127926.84, 109894.16, 0.3000],
        [1503902.46, 271033.48, 0.3200],
        [4511707.37, 392294.17, 0.3400],
        [Infinity, 1414947.85, 0.3500],
      ];
      let lower = 0;
      let isr = 0;
      for (const [limit, fixed, rate] of brackets) {
        if (bruto <= limit) {
          isr = fixed + (bruto - lower) * rate;
          break;
        }
        lower = limit;
      }
      return { impuesto: Math.max(0, isr), contribucion: bruto * 0.025 };
    },
  },
  {
    id: "ar",
    flag: "🇦🇷",
    name: "Argentina",
    enName: "Argentina",
    currency: "ARS",
    currencyLocale: "es-AR",
    taxName: "Impuesto a las Ganancias",
    enTaxName: "Impuesto a las Ganancias (income tax)",
    regionLabel: "Provincia",
    enRegionLabel: "Province",
    contribLabel: "Aportes jubilatorios y obra social",
    enContribLabel: "Pension & health-fund contributions",
    regions: PROVINCIAS_AR,
    calculate: (bruto) => {
      // Mínimo no imponible + deducciones (estimación orientativa, se actualiza por inflación)
      const deduccionAnual = 25_000_000;
      const baseImponible = Math.max(0, bruto - deduccionAnual);
      const ganancias = progressiveTax(baseImponible, [
        [1_200_000, 0.05], [2_400_000, 0.09], [3_600_000, 0.12], [4_800_000, 0.15],
        [6_000_000, 0.19], [7_200_000, 0.23], [8_400_000, 0.27], [9_600_000, 0.31], [Infinity, 0.35],
      ]);
      // Aportes personales: 11% jubilación + 3% PAMI + 3% obra social
      return { impuesto: ganancias, contribucion: bruto * 0.17 };
    },
  },
  {
    id: "co",
    flag: "🇨🇴",
    name: "Colombia",
    enName: "Colombia",
    currency: "COP",
    currencyLocale: "es-CO",
    taxName: "Retención en la fuente",
    enTaxName: "Retención en la fuente (withholding tax)",
    regionLabel: "Departamento",
    enRegionLabel: "Department",
    contribLabel: "Salud y pensión (aporte del trabajador)",
    enContribLabel: "Health & pension (employee share)",
    regions: DEPARTAMENTOS_CO,
    calculate: (bruto) => {
      // Tabla de retención en la fuente (Art. 383 ET) en UVT; valor UVT aproximado
      const uvt = 49_799;
      const mensual = bruto / 12;
      const aportes = mensual * 0.08; // 4% salud + 4% pensión
      const baseGravable = Math.max(0, mensual - aportes);
      const baseUVT = baseGravable / uvt;

      let retencionUVT = 0;
      if (baseUVT <= 95) retencionUVT = 0;
      else if (baseUVT <= 150) retencionUVT = (baseUVT - 95) * 0.19;
      else if (baseUVT <= 360) retencionUVT = (baseUVT - 150) * 0.28 + 10;
      else if (baseUVT <= 640) retencionUVT = (baseUVT - 360) * 0.33 + 69;
      else if (baseUVT <= 945) retencionUVT = (baseUVT - 640) * 0.35 + 162;
      else if (baseUVT <= 2300) retencionUVT = (baseUVT - 945) * 0.37 + 268;
      else retencionUVT = (baseUVT - 2300) * 0.39 + 770;

      return { impuesto: retencionUVT * uvt * 12, contribucion: aportes * 12 };
    },
  },
  {
    id: "us",
    flag: "🇺🇸",
    name: "Estados Unidos",
    enName: "United States",
    currency: "USD",
    currencyLocale: "en-US",
    taxName: "Federal Income Tax",
    enTaxName: "Federal Income Tax",
    regionLabel: "Estado",
    enRegionLabel: "State",
    contribLabel: "Seguridad Social y Medicare (FICA)",
    enContribLabel: "Social Security & Medicare (FICA)",
    regions: ESTADOS_US,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [11_600, 0.10], [47_150, 0.12], [100_525, 0.22], [191_950, 0.24],
        [243_725, 0.32], [609_350, 0.35], [Infinity, 0.37],
      ]),
      contribucion: bruto * 0.0765,
    }),
  },
  {
    id: "de",
    flag: "🇩🇪",
    name: "Alemania",
    enName: "Germany",
    currency: "EUR",
    currencyLocale: "de-DE",
    taxName: "Einkommensteuer",
    enTaxName: "Einkommensteuer (income tax)",
    regionLabel: "Estado federado",
    enRegionLabel: "State (Land)",
    contribLabel: "Seguros sociales (pensión, sanidad, paro, dependencia)",
    enContribLabel: "Social insurance (pension, health, unemployment, care)",
    regions: LANDER_DE,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [11_604, 0], [66_760, 0.24], [277_825, 0.42], [Infinity, 0.45],
      ]),
      contribucion: bruto * 0.20,
    }),
  },
  {
    id: "ch",
    flag: "🇨🇭",
    name: "Suiza",
    enName: "Switzerland",
    currency: "CHF",
    currencyLocale: "de-CH",
    taxName: "Impuesto federal directo + cantonal",
    enTaxName: "Direct federal + cantonal tax",
    regionLabel: "Cantón",
    enRegionLabel: "Canton",
    contribLabel: "AVS/AI/APG y seguros sociales",
    enContribLabel: "AHV/IV/EO and social insurance",
    regions: CANTONES_CH,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [17_800, 0], [31_600, 0.10], [68_000, 0.20], [148_000, 0.28], [Infinity, 0.33],
      ]),
      contribucion: bruto * 0.12,
    }),
  },
  {
    id: "ca",
    flag: "🇨🇦",
    name: "Canadá",
    enName: "Canada",
    currency: "CAD",
    currencyLocale: "en-CA",
    taxName: "Federal Income Tax",
    enTaxName: "Federal income tax",
    regionLabel: "Provincia",
    enRegionLabel: "Province",
    contribLabel: "CPP y seguro de empleo (EI)",
    enContribLabel: "CPP & Employment Insurance (EI)",
    regions: PROVINCIAS_CA,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [55_867, 0.15], [111_733, 0.205], [173_205, 0.26], [246_752, 0.29], [Infinity, 0.33],
      ]),
      contribucion: bruto * 0.076,
    }),
  },
  {
    id: "nl",
    flag: "🇳🇱",
    name: "Países Bajos",
    enName: "Netherlands",
    currency: "EUR",
    currencyLocale: "nl-NL",
    taxName: "Inkomstenbelasting (Box 1)",
    enTaxName: "Inkomstenbelasting (Box 1 income tax)",
    regionLabel: "Provincia",
    enRegionLabel: "Province",
    contribLabel: "Seguro de salud (Zvw)",
    enContribLabel: "Health insurance contribution (Zvw)",
    regions: PROVINCIAS_NL,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [[75_624, 0.3697], [Infinity, 0.495]]),
      contribucion: bruto * 0.053,
    }),
  },
  {
    id: "cn",
    flag: "🇨🇳",
    name: "China",
    enName: "China",
    currency: "CNY",
    currencyLocale: "zh-CN",
    taxName: "Impuesto sobre la Renta de las Personas Físicas (IIT)",
    enTaxName: "Individual Income Tax (IIT)",
    regionLabel: "Provincia",
    enRegionLabel: "Province",
    contribLabel: "Seguro social (cinco seguros y un fondo)",
    enContribLabel: "Social insurance (five insurances & one fund)",
    regions: PROVINCIAS_CN,
    calculate: (bruto) => {
      const base = Math.max(0, bruto - 60_000);
      return {
        impuesto: progressiveTax(base, [
          [36_000, 0.03], [144_000, 0.10], [300_000, 0.20], [420_000, 0.25],
          [660_000, 0.30], [960_000, 0.35], [Infinity, 0.45],
        ]),
        contribucion: bruto * 0.105,
      };
    },
  },
  {
    id: "br",
    flag: "🇧🇷",
    name: "Brasil",
    enName: "Brazil",
    currency: "BRL",
    currencyLocale: "pt-BR",
    taxName: "Imposto de Renda (IRPF)",
    enTaxName: "Imposto de Renda (Brazilian income tax)",
    regionLabel: "Estado",
    enRegionLabel: "State",
    contribLabel: "INSS",
    enContribLabel: "INSS (social security)",
    regions: ESTADOS_BR,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [27_110, 0], [33_920, 0.075], [45_013, 0.15], [55_976, 0.225], [Infinity, 0.275],
      ]),
      contribucion: bruto * 0.11,
    }),
  },
  {
    id: "sg",
    flag: "🇸🇬",
    name: "Singapur",
    enName: "Singapore",
    currency: "SGD",
    currencyLocale: "en-SG",
    taxName: "Income Tax",
    enTaxName: "Income Tax",
    regionLabel: "Distrito",
    enRegionLabel: "District",
    contribLabel: "CPF (aporte del empleado)",
    enContribLabel: "CPF (employee contribution)",
    regions: DISTRITOS_SG,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [20_000, 0], [30_000, 0.02], [40_000, 0.035], [80_000, 0.07], [120_000, 0.115],
        [160_000, 0.15], [200_000, 0.18], [240_000, 0.19], [280_000, 0.20], [320_000, 0.22],
        [Infinity, 0.24],
      ]),
      contribucion: bruto * 0.20,
    }),
  },
  {
    id: "fr",
    flag: "🇫🇷",
    name: "Francia",
    enName: "France",
    currency: "EUR",
    currencyLocale: "fr-FR",
    taxName: "Impôt sur le revenu",
    enTaxName: "Impôt sur le revenu (income tax)",
    regionLabel: "Región",
    enRegionLabel: "Region",
    contribLabel: "Cotizaciones sociales",
    enContribLabel: "Social security contributions",
    regions: REGIONES_FR,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [11_294, 0], [28_797, 0.11], [82_341, 0.30], [177_106, 0.41], [Infinity, 0.45],
      ]),
      contribucion: bruto * 0.22,
    }),
  },
  {
    id: "ru",
    flag: "🇷🇺",
    name: "Rusia",
    enName: "Russia",
    currency: "RUB",
    currencyLocale: "ru-RU",
    taxName: "НДФЛ (impuesto sobre la renta)",
    enTaxName: "Personal income tax (NDFL)",
    regionLabel: "Región",
    enRegionLabel: "Region",
    contribLabel: "Aportes sociales (a cargo del trabajador)",
    enContribLabel: "Employee social contributions",
    regions: REGIONES_RU,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [2_400_000, 0.13], [5_000_000, 0.15], [20_000_000, 0.18], [50_000_000, 0.20], [Infinity, 0.22],
      ]),
      contribucion: 0,
    }),
  },
  {
    id: "gb",
    flag: "🇬🇧",
    name: "Reino Unido",
    enName: "United Kingdom",
    currency: "GBP",
    currencyLocale: "en-GB",
    taxName: "Income Tax",
    enTaxName: "Income Tax",
    regionLabel: "Región",
    enRegionLabel: "Region",
    contribLabel: "National Insurance",
    enContribLabel: "National Insurance",
    regions: REGIONES_UK,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [12_570, 0], [50_270, 0.20], [125_140, 0.40], [Infinity, 0.45],
      ]),
      contribucion: bruto * 0.09,
    }),
  },
  {
    id: "jp",
    flag: "🇯🇵",
    name: "Japón",
    enName: "Japan",
    currency: "JPY",
    currencyLocale: "ja-JP",
    taxName: "Impuesto sobre la renta nacional",
    enTaxName: "National income tax",
    regionLabel: "Prefectura",
    enRegionLabel: "Prefecture",
    contribLabel: "Seguro social e impuesto de residencia",
    enContribLabel: "Social insurance & resident's tax",
    regions: PREFECTURAS_JP,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [1_950_000, 0.05], [3_300_000, 0.10], [6_950_000, 0.20], [9_000_000, 0.23],
        [18_000_000, 0.33], [40_000_000, 0.40], [Infinity, 0.45],
      ]),
      contribucion: bruto * 0.25,
    }),
  },
  {
    id: "th",
    flag: "🇹🇭",
    name: "Tailandia",
    enName: "Thailand",
    currency: "THB",
    currencyLocale: "th-TH",
    taxName: "Personal Income Tax",
    enTaxName: "Personal Income Tax",
    regionLabel: "Provincia",
    enRegionLabel: "Province",
    contribLabel: "Seguro social",
    enContribLabel: "Social security",
    regions: PROVINCIAS_TH,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [150_000, 0], [300_000, 0.05], [500_000, 0.10], [750_000, 0.15], [1_000_000, 0.20],
        [2_000_000, 0.25], [5_000_000, 0.30], [Infinity, 0.35],
      ]),
      contribucion: bruto * 0.05,
    }),
  },
  {
    id: "be",
    flag: "🇧🇪",
    name: "Bélgica",
    enName: "Belgium",
    currency: "EUR",
    currencyLocale: "fr-BE",
    taxName: "Impôt des personnes physiques (IPP)",
    enTaxName: "Personal income tax (IPP/PB)",
    regionLabel: "Provincia",
    enRegionLabel: "Province",
    contribLabel: "Seguridad social (ONSS/RSZ)",
    enContribLabel: "Social security (ONSS/RSZ)",
    regions: PROVINCIAS_BE,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [15_200, 0.25], [26_830, 0.40], [46_440, 0.45], [Infinity, 0.50],
      ]),
      contribucion: bruto * 0.1307,
    }),
  },
  {
    id: "kr",
    flag: "🇰🇷",
    name: "Corea del Sur",
    enName: "South Korea",
    currency: "KRW",
    currencyLocale: "ko-KR",
    taxName: "Impuesto sobre la renta (종합소득세)",
    enTaxName: "Income tax (종합소득세)",
    regionLabel: "División administrativa",
    enRegionLabel: "Administrative division",
    contribLabel: "Pensión nacional y seguro de salud",
    enContribLabel: "National pension & health insurance",
    regions: REGIONES_KR,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [14_000_000, 0.06], [50_000_000, 0.15], [88_000_000, 0.24], [150_000_000, 0.35],
        [300_000_000, 0.38], [500_000_000, 0.40], [1_000_000_000, 0.42], [Infinity, 0.45],
      ]),
      contribucion: bruto * 0.09,
    }),
  },
  {
    id: "in",
    flag: "🇮🇳",
    name: "India",
    enName: "India",
    currency: "INR",
    currencyLocale: "en-IN",
    taxName: "Income Tax (régimen nuevo)",
    enTaxName: "Income Tax (new regime)",
    regionLabel: "Estado",
    enRegionLabel: "State",
    contribLabel: "EPF (fondo de previsión)",
    enContribLabel: "EPF (provident fund)",
    regions: ESTADOS_IN,
    calculate: (bruto) => ({
      impuesto: progressiveTax(bruto, [
        [300_000, 0], [600_000, 0.05], [900_000, 0.10], [1_200_000, 0.15],
        [1_500_000, 0.20], [Infinity, 0.30],
      ]),
      contribucion: bruto * 0.12,
    }),
  },
];

export default function IRPF() {
  const locale = useLocale();
  const t = T[locale];

  const [bruto, setBruto] = useState("30000");
  const [paisId, setPaisId] = useState<CountryDef["id"]>("es");
  const pais = COUNTRIES.find((c) => c.id === paisId)!;
  const [region, setRegion] = useState("Madrid");
  const [openCountry, setOpenCountry] = useState(false);
  const [openRegion, setOpenRegion] = useState(false);
  const [chartType, setChartType] = useState<"barras" | "tarta" | "horizontal" | "radial">("barras");
  const chartRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<{
    paisId: CountryDef["id"];
    bruto: number;
    netoAnual: number;
    netoMensual12: number;
    retencion: number;
    contribucion: number;
    tipoEfectivo: number;
  } | null>(null);

  const selectCountry = (id: CountryDef["id"]) => {
    setPaisId(id);
    setRegion(COUNTRIES.find((c) => c.id === id)!.regions[0]);
    setResults(null);
  };

  const calculateIRPF = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(bruto);
    if (isNaN(b) || b <= 0) return;

    const { impuesto, contribucion } = pais.calculate(b, region);
    const netoAnual = b - impuesto - contribucion;

    setResults({
      paisId: pais.id,
      bruto: b,
      netoAnual,
      netoMensual12: netoAnual / 12,
      retencion: impuesto,
      contribucion,
      tipoEfectivo: (impuesto / b) * 100
    });
  };

  const chartTypeLabels: Record<"barras" | "tarta" | "horizontal" | "radial", string> = {
    barras: t.bars,
    horizontal: t.horizontal,
    tarta: t.pie,
    radial: t.radial,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> {t.backHome}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Calculator className="w-8 h-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t.subtitle}</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none my-6 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculateIRPF} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pais">{t.countryLabel}</Label>
                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                  <PopoverTrigger asChild>
                    <Button
                      id="pais"
                      data-testid="button-country-selector"
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCountry}
                      className="w-full justify-between font-normal"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg leading-none">{pais.flag}</span>
                        {locale === "en" ? pais.enName : pais.name}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        data-testid="input-country-search"
                        placeholder={t.countrySearch}
                      />
                      <CommandList className="max-h-60 overflow-y-auto">
                        <CommandEmpty>{t.countryNotFound}</CommandEmpty>
                        <CommandGroup>
                          {COUNTRIES.map((c) => {
                            const label = locale === "en" ? c.enName : c.name;
                            return (
                              <CommandItem
                                key={c.id}
                                value={label}
                                data-testid={`option-country-${c.id}`}
                                onSelect={() => {
                                  selectCountry(c.id);
                                  setOpenCountry(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    paisId === c.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <span className="text-lg leading-none mr-2">{c.flag}</span>
                                {label}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-gray-400">
                  {t.taxLabel}: {locale === "en" ? pais.enTaxName : pais.taxName} · {t.contribLabel}: {locale === "en" ? pais.enContribLabel : pais.contribLabel}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bruto">{`${t.grossLabel} (${pais.currency})`}</Label>
                <Input
                  id="bruto"
                  type="number"
                  value={bruto}
                  onChange={(e) => setBruto(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">{locale === "en" ? pais.enRegionLabel : pais.regionLabel}</Label>
                <Popover open={openRegion} onOpenChange={setOpenRegion}>
                  <PopoverTrigger asChild>
                    <Button
                      id="region"
                      data-testid="button-region-selector"
                      variant="outline"
                      role="combobox"
                      aria-expanded={openRegion}
                      className="w-full justify-between font-normal"
                    >
                      {region || t.ccaaPlaceholder}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        data-testid="input-region-search"
                        placeholder={t.ccaaSearch}
                      />
                      <CommandList className="max-h-60 overflow-y-auto">
                        <CommandEmpty>{t.ccaaNotFound}</CommandEmpty>
                        <CommandGroup>
                          {pais.regions.map((r) => (
                            <CommandItem
                              key={r}
                              value={r}
                              onSelect={(val) => {
                                const match = pais.regions.find(x => x.toLowerCase() === val.toLowerCase()) || val;
                                setRegion(match);
                                setOpenRegion(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  region === r ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {r}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="w-full">{t.calculateBtn}</Button>
              <p className="text-xs text-gray-400 leading-relaxed">{t.formDisclaimer}</p>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          {results ? (() => {
            const resultCountry = COUNTRIES.find((c) => c.id === results.paisId)!;
            const fmt = (value: number) =>
              value.toLocaleString(resultCountry.currencyLocale, { style: 'currency', currency: resultCountry.currency, maximumFractionDigits: 0 });
            const contribLabel = locale === "en" ? resultCountry.enContribLabel : resultCountry.contribLabel;
            return (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.monthlyNet12}</p>
                    <p className="text-3xl font-bold text-primary">
                      {fmt(results.netoMensual12)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.annualNet}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {fmt(results.netoAnual)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.effectiveRate}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.tipoEfectivo.toFixed(2)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-lg">{t.chartTitle}</CardTitle>
                  <div className="flex flex-wrap gap-1 rounded-lg border p-1">
                    {(["barras", "horizontal", "tarta", "radial"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={cn(
                          "px-3 py-1 text-xs rounded-md transition-colors capitalize",
                          chartType === type
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                        )}
                      >
                        {chartTypeLabels[type]}
                      </button>
                    ))}
                    <button
                      onClick={() => downloadChart(chartRef.current, "grafico-irpf")}
                      title={locale === "en" ? "Download chart" : "Descargar gráfico"}
                      className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div ref={chartRef} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "barras" ? (
                        <BarChart data={[{
                          name: locale === "en" ? "Salary" : "Salario",
                          [t.net]: results.netoAnual,
                          [t.taxes]: results.retencion,
                          [contribLabel]: results.contribucion
                        }]}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                          <Tooltip formatter={(value: number) => fmt(value)} />
                          <Legend />
                          <Bar dataKey={t.net} stackId="a" fill="#0FA958" />
                          <Bar dataKey={t.taxes} stackId="a" fill="#ef4444" />
                          <Bar dataKey={contribLabel} stackId="a" fill="#f59e0b" />
                        </BarChart>
                      ) : chartType === "horizontal" ? (
                        <BarChart
                          layout="vertical"
                          data={[{
                            name: locale === "en" ? "Salary" : "Salario",
                            [t.net]: results.netoAnual,
                            [t.taxes]: results.retencion,
                            [contribLabel]: results.contribucion
                          }]}
                          margin={{ left: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                          <XAxis type="number" tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                          <YAxis type="category" dataKey="name" width={55} />
                          <Tooltip formatter={(value: number) => fmt(value)} />
                          <Legend />
                          <Bar dataKey={t.net} stackId="a" fill="#0FA958" />
                          <Bar dataKey={t.taxes} stackId="a" fill="#ef4444" />
                          <Bar dataKey={contribLabel} stackId="a" fill="#f59e0b" />
                        </BarChart>
                      ) : chartType === "tarta" ? (
                        <PieChart>
                          <Pie
                            data={[
                              { name: t.net, value: results.netoAnual },
                              { name: t.taxes, value: results.retencion },
                              { name: contribLabel, value: results.contribucion },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={110}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                            labelLine={true}
                          >
                            <Cell fill="#0FA958" />
                            <Cell fill="#ef4444" />
                            <Cell fill="#f59e0b" />
                          </Pie>
                          <Tooltip formatter={(value: number, _name: string, props: { payload?: { name?: string } }) => [fmt(value), props.payload?.name ?? _name]} />
                          <Legend />
                        </PieChart>
                      ) : (
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={120}
                          data={[
                            { name: contribLabel, value: results.contribucion, fill: "#f59e0b" },
                            { name: t.taxes, value: results.retencion, fill: "#ef4444" },
                            { name: t.net, value: results.netoAnual, fill: "#0FA958" },
                          ]}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <RadialBar dataKey="value" label={{ position: "insideStart", fill: "#fff", fontSize: 11 }} />
                          <Tooltip formatter={(value: number, _name: string, props: { payload?: { name?: string } }) => [fmt(value), props.payload?.name ?? _name]} />
                          <Legend />
                        </RadialBarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            );
          })() : (
            <Card className="h-full flex items-center justify-center min-h-[400px] border-dashed">
              <CardContent className="text-center text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>{t.placeholder}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

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
            {AHORRO_TABLE.map((row) => (
              <tr key={row.tipo} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white whitespace-nowrap">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.tipo}</td>
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

      <div className="pt-12 mt-12 border-t">
        <h2 className="text-2xl font-bold mb-6">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t.q1}</AccordionTrigger>
            <AccordionContent>{t.a1}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t.q2}</AccordionTrigger>
            <AccordionContent>{t.a2}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{t.q3}</AccordionTrigger>
            <AccordionContent>{t.a3}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>{t.q4}</AccordionTrigger>
            <AccordionContent>{t.a4}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>{t.q5}</AccordionTrigger>
            <AccordionContent>{t.a5}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>{t.q6}</AccordionTrigger>
            <AccordionContent>{t.a6}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
