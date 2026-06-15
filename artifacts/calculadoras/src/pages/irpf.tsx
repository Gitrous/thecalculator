import React, { useState } from "react";
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
import { ArrowLeft, Calculator, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale";

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora IRPF",
    subtitle: "Calcula tu sueldo neto y las retenciones del impuesto sobre la renta según tu país y región.",
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
    disclaimer: "Cálculo orientativo basado en tablas fiscales aproximadas de cada país. Las cifras oficiales varían y se actualizan periódicamente: consulta siempre a la agencia tributaria correspondiente (Agencia Tributaria, SAT, AFIP, DIAN).",
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
  },
  en: {
    backHome: "Back to home",
    title: "Income Tax Calculator",
    subtitle: "Calculate your net salary and income tax withholding based on your country and region.",
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
    disclaimer: "Estimate based on approximate tax tables for each country. Official figures vary and are updated periodically: always check with the relevant tax authority (Agencia Tributaria, SAT, AFIP, DIAN).",
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
  },
};

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
              <p className="text-xs text-gray-400 leading-relaxed">{t.disclaimer}</p>
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
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
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
        </Accordion>
      </div>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
