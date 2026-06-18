export interface TaxBracket {
  from: number;
  to: number;
  rate: number; // percentage, e.g. 21
}

export interface CountryData {
  code: string;
  nameEs: string;
  nameEn: string;
  currency: string;       // ISO code, e.g. "EUR"
  currencySymbol: string; // e.g. "€"
  numberLocale: string;   // e.g. "es-ES"
  // VAT
  vatRates: number[];         // all available rates, e.g. [21, 10, 4, 0]
  vatNameEs: string;          // e.g. "IVA"
  vatNameEn: string;          // e.g. "VAT"
  // Electricity
  electricityKwh: number;     // avg price per kWh in local currency
  // Fuel
  fuelPerLiter: number;       // avg gasoline price per liter in local currency
  // Income tax (simplified brackets, annual local currency)
  incomeTaxBrackets: TaxBracket[];
  // Social security (employee share)
  ssRate: number;             // percentage, e.g. 6.35
  ssCap?: number;             // annual cap in local currency (optional)
  // Default annual salary for display
  defaultSalary: number;
}

export const COUNTRIES: CountryData[] = [
  {
    code: "es",
    nameEs: "España",
    nameEn: "Spain",
    currency: "EUR",
    currencySymbol: "€",
    numberLocale: "es-ES",
    vatRates: [21, 10, 4, 0],
    vatNameEs: "IVA",
    vatNameEn: "VAT",
    electricityKwh: 0.15,
    fuelPerLiter: 1.65,
    incomeTaxBrackets: [
      { from: 0,       to: 12450,   rate: 19 },
      { from: 12450,   to: 20200,   rate: 24 },
      { from: 20200,   to: 35200,   rate: 30 },
      { from: 35200,   to: 60000,   rate: 37 },
      { from: 60000,   to: 300000,  rate: 45 },
      { from: 300000,  to: Infinity, rate: 47 },
    ],
    ssRate: 6.35,
    defaultSalary: 30000,
  },
  {
    code: "us",
    nameEs: "Estados Unidos",
    nameEn: "United States",
    currency: "USD",
    currencySymbol: "$",
    numberLocale: "en-US",
    vatRates: [7, 0],
    vatNameEs: "Sales Tax",
    vatNameEn: "Sales Tax",
    electricityKwh: 0.17,
    fuelPerLiter: 0.95,
    // Federal brackets 2024 (single filer). Standard deduction $14,600 applied as 0% band.
    incomeTaxBrackets: [
      { from: 0,       to: 14600,   rate: 0  },
      { from: 14600,   to: 26200,   rate: 10 },
      { from: 26200,   to: 61750,   rate: 12 },
      { from: 61750,   to: 115125,  rate: 22 },
      { from: 115125,  to: 206525,  rate: 24 },
      { from: 206525,  to: 258425,  rate: 32 },
      { from: 258425,  to: 623950,  rate: 35 },
      { from: 623950,  to: Infinity, rate: 37 },
    ],
    ssRate: 7.65, // Social Security 6.2% + Medicare 1.45%
    ssCap: 168600, // SS portion capped; Medicare uncapped — approximation
    defaultSalary: 65000,
  },
  {
    code: "de",
    nameEs: "Alemania",
    nameEn: "Germany",
    currency: "EUR",
    currencySymbol: "€",
    numberLocale: "de-DE",
    vatRates: [19, 7, 0],
    vatNameEs: "IVA (MwSt)",
    vatNameEn: "VAT (MwSt)",
    electricityKwh: 0.33,
    fuelPerLiter: 1.80,
    // Simplified approximation of the German progressive formula
    incomeTaxBrackets: [
      { from: 0,       to: 11604,   rate: 0  },
      { from: 11604,   to: 17006,   rate: 14 },
      { from: 17006,   to: 66761,   rate: 30 },
      { from: 66761,   to: 277826,  rate: 42 },
      { from: 277826,  to: Infinity, rate: 45 },
    ],
    ssRate: 20.0, // pension 9.3% + health 7.3% + unemp 1.3% + nursing 2.05% ≈ 20%
    defaultSalary: 45000,
  },
  {
    code: "ch",
    nameEs: "Suiza",
    nameEn: "Switzerland",
    currency: "CHF",
    currencySymbol: "Fr",
    numberLocale: "de-CH",
    vatRates: [8.1, 3.8, 2.6, 0],
    vatNameEs: "IVA (MWST)",
    vatNameEn: "VAT (MWST)",
    electricityKwh: 0.28,
    fuelPerLiter: 1.75,
    // Federal + avg cantonal (simplified)
    incomeTaxBrackets: [
      { from: 0,       to: 17800,   rate: 0  },
      { from: 17800,   to: 50000,   rate: 7  },
      { from: 50000,   to: 100000,  rate: 13 },
      { from: 100000,  to: 200000,  rate: 21 },
      { from: 200000,  to: Infinity, rate: 26 },
    ],
    ssRate: 6.4, // AHV/IV/EO 5.3% + unemployment 1.1%
    defaultSalary: 95000,
  },
  {
    code: "ca",
    nameEs: "Canadá",
    nameEn: "Canada",
    currency: "CAD",
    currencySymbol: "CA$",
    numberLocale: "en-CA",
    vatRates: [13, 5, 0],
    vatNameEs: "GST/HST",
    vatNameEn: "GST/HST",
    electricityKwh: 0.15,
    fuelPerLiter: 1.60,
    // Federal brackets 2024. Basic personal amount $15,705 applied as 0% band.
    incomeTaxBrackets: [
      { from: 0,       to: 15705,   rate: 0  },
      { from: 15705,   to: 57375,   rate: 15 },
      { from: 57375,   to: 114750,  rate: 20.5 },
      { from: 114750,  to: 177882,  rate: 26 },
      { from: 177882,  to: 253414,  rate: 29 },
      { from: 253414,  to: Infinity, rate: 33 },
    ],
    ssRate: 7.61, // CPP 5.95% + EI 1.66%
    ssCap: 66600,
    defaultSalary: 70000,
  },
  {
    code: "nl",
    nameEs: "Países Bajos",
    nameEn: "Netherlands",
    currency: "EUR",
    currencySymbol: "€",
    numberLocale: "nl-NL",
    vatRates: [21, 9, 0],
    vatNameEs: "IVA (BTW)",
    vatNameEn: "VAT (BTW)",
    electricityKwh: 0.34,
    fuelPerLiter: 2.00,
    // Dutch box 1 (includes social premiums)
    incomeTaxBrackets: [
      { from: 0,       to: 73031,   rate: 37.07 },
      { from: 73031,   to: Infinity, rate: 49.5  },
    ],
    ssRate: 0, // included in the brackets above
    defaultSalary: 55000,
  },
  {
    code: "cn",
    nameEs: "China",
    nameEn: "China",
    currency: "CNY",
    currencySymbol: "¥",
    numberLocale: "zh-CN",
    vatRates: [13, 9, 6, 0],
    vatNameEs: "IVA (增值税)",
    vatNameEn: "VAT (增值税)",
    electricityKwh: 0.60,
    fuelPerLiter: 7.50,
    // After standard deduction 60,000 CNY
    incomeTaxBrackets: [
      { from: 0,       to: 60000,   rate: 0  },
      { from: 60000,   to: 96000,   rate: 3  },
      { from: 96000,   to: 204000,  rate: 10 },
      { from: 204000,  to: 360000,  rate: 20 },
      { from: 360000,  to: 480000,  rate: 25 },
      { from: 480000,  to: 720000,  rate: 30 },
      { from: 720000,  to: 1020000, rate: 35 },
      { from: 1020000, to: Infinity, rate: 45 },
    ],
    ssRate: 10.5, // pension 8% + medical 2% + unemployment 0.5%
    defaultSalary: 150000,
  },
  {
    code: "br",
    nameEs: "Brasil",
    nameEn: "Brazil",
    currency: "BRL",
    currencySymbol: "R$",
    numberLocale: "pt-BR",
    vatRates: [17, 12, 7, 0],
    vatNameEs: "ICMS/IVA",
    vatNameEn: "ICMS/VAT",
    electricityKwh: 0.70,
    fuelPerLiter: 6.50,
    incomeTaxBrackets: [
      { from: 0,         to: 28559.70,  rate: 0    },
      { from: 28559.70,  to: 33919.80,  rate: 7.5  },
      { from: 33919.80,  to: 45012.60,  rate: 15   },
      { from: 45012.60,  to: 55976.16,  rate: 22.5 },
      { from: 55976.16,  to: Infinity,  rate: 27.5 },
    ],
    ssRate: 9.0,
    defaultSalary: 60000,
  },
  {
    code: "sg",
    nameEs: "Singapur",
    nameEn: "Singapore",
    currency: "SGD",
    currencySymbol: "S$",
    numberLocale: "en-SG",
    vatRates: [9, 0],
    vatNameEs: "GST",
    vatNameEn: "GST",
    electricityKwh: 0.29,
    fuelPerLiter: 3.00,
    incomeTaxBrackets: [
      { from: 0,       to: 20000,   rate: 0    },
      { from: 20000,   to: 30000,   rate: 2    },
      { from: 30000,   to: 40000,   rate: 3.5  },
      { from: 40000,   to: 80000,   rate: 7    },
      { from: 80000,   to: 120000,  rate: 11.5 },
      { from: 120000,  to: 160000,  rate: 15   },
      { from: 160000,  to: 200000,  rate: 18   },
      { from: 200000,  to: 240000,  rate: 19   },
      { from: 240000,  to: 280000,  rate: 19.5 },
      { from: 280000,  to: 320000,  rate: 20   },
      { from: 320000,  to: Infinity, rate: 22  },
    ],
    ssRate: 20,    // CPF employee contribution (age ≤55)
    ssCap: 72000,  // annual ordinary wage ceiling
    defaultSalary: 80000,
  },
  {
    code: "fr",
    nameEs: "Francia",
    nameEn: "France",
    currency: "EUR",
    currencySymbol: "€",
    numberLocale: "fr-FR",
    vatRates: [20, 10, 5.5, 2.1, 0],
    vatNameEs: "IVA (TVA)",
    vatNameEn: "VAT (TVA)",
    electricityKwh: 0.24,
    fuelPerLiter: 1.85,
    incomeTaxBrackets: [
      { from: 0,       to: 10777,   rate: 0  },
      { from: 10777,   to: 27478,   rate: 11 },
      { from: 27478,   to: 78570,   rate: 30 },
      { from: 78570,   to: 168994,  rate: 41 },
      { from: 168994,  to: Infinity, rate: 45 },
    ],
    ssRate: 22.0,
    defaultSalary: 40000,
  },
  {
    code: "ru",
    nameEs: "Rusia",
    nameEn: "Russia",
    currency: "RUB",
    currencySymbol: "₽",
    numberLocale: "ru-RU",
    vatRates: [20, 10, 0],
    vatNameEs: "IVA (НДС)",
    vatNameEn: "VAT (НДС)",
    electricityKwh: 4.5,
    fuelPerLiter: 55,
    incomeTaxBrackets: [
      { from: 0,          to: 5000000,  rate: 13 },
      { from: 5000000,    to: Infinity, rate: 15 },
    ],
    ssRate: 0, // employer-paid in Russia; employee pays only income tax
    defaultSalary: 1200000,
  },
  {
    code: "gb",
    nameEs: "Reino Unido",
    nameEn: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    numberLocale: "en-GB",
    vatRates: [20, 5, 0],
    vatNameEs: "VAT",
    vatNameEn: "VAT",
    electricityKwh: 0.28,
    fuelPerLiter: 1.45,
    // Personal allowance £12,570 + NI modelled within SS
    incomeTaxBrackets: [
      { from: 0,       to: 12570,   rate: 0  },
      { from: 12570,   to: 50270,   rate: 20 },
      { from: 50270,   to: 125140,  rate: 40 },
      { from: 125140,  to: Infinity, rate: 45 },
    ],
    ssRate: 8.0, // National Insurance Class 1 (simplified avg rate)
    ssCap: 50270,
    defaultSalary: 40000,
  },
  {
    code: "jp",
    nameEs: "Japón",
    nameEn: "Japan",
    currency: "JPY",
    currencySymbol: "¥",
    numberLocale: "ja-JP",
    vatRates: [10, 8, 0],
    vatNameEs: "Impuesto al consumo",
    vatNameEn: "Consumption Tax",
    electricityKwh: 35,
    fuelPerLiter: 180,
    // National + resident tax (approx combined)
    incomeTaxBrackets: [
      { from: 0,          to: 1950000,  rate: 15 },
      { from: 1950000,    to: 3300000,  rate: 20 },
      { from: 3300000,    to: 6950000,  rate: 30 },
      { from: 6950000,    to: 9000000,  rate: 33 },
      { from: 9000000,    to: 18000000, rate: 43 },
      { from: 18000000,   to: 40000000, rate: 50 },
      { from: 40000000,   to: Infinity, rate: 55 },
    ],
    ssRate: 14.0, // pension 9.15% + health ~4.85%
    defaultSalary: 5000000,
  },
  {
    code: "th",
    nameEs: "Tailandia",
    nameEn: "Thailand",
    currency: "THB",
    currencySymbol: "฿",
    numberLocale: "th-TH",
    vatRates: [7, 0],
    vatNameEs: "IVA (VAT)",
    vatNameEn: "VAT",
    electricityKwh: 4.5,
    fuelPerLiter: 40,
    incomeTaxBrackets: [
      { from: 0,         to: 150000,   rate: 0  },
      { from: 150000,    to: 300000,   rate: 5  },
      { from: 300000,    to: 500000,   rate: 10 },
      { from: 500000,    to: 750000,   rate: 15 },
      { from: 750000,    to: 1000000,  rate: 20 },
      { from: 1000000,   to: 2000000,  rate: 25 },
      { from: 2000000,   to: 5000000,  rate: 30 },
      { from: 5000000,   to: Infinity, rate: 35 },
    ],
    ssRate: 5.0,
    ssCap: 9000, // 750 THB/month × 12
    defaultSalary: 600000,
  },
  {
    code: "be",
    nameEs: "Bélgica",
    nameEn: "Belgium",
    currency: "EUR",
    currencySymbol: "€",
    numberLocale: "fr-BE",
    vatRates: [21, 12, 6, 0],
    vatNameEs: "IVA (BTW/TVA)",
    vatNameEn: "VAT (BTW/TVA)",
    electricityKwh: 0.31,
    fuelPerLiter: 1.70,
    // Basic exemption ~€9,270 added as 0% band
    incomeTaxBrackets: [
      { from: 0,       to: 9270,    rate: 0  },
      { from: 9270,    to: 15200,   rate: 25 },
      { from: 15200,   to: 26830,   rate: 40 },
      { from: 26830,   to: 46440,   rate: 45 },
      { from: 46440,   to: Infinity, rate: 50 },
    ],
    ssRate: 13.07,
    defaultSalary: 45000,
  },
  {
    code: "kr",
    nameEs: "Corea del Sur",
    nameEn: "South Korea",
    currency: "KRW",
    currencySymbol: "₩",
    numberLocale: "ko-KR",
    vatRates: [10, 0],
    vatNameEs: "IVA (부가가치세)",
    vatNameEn: "VAT (부가가치세)",
    electricityKwh: 140,
    fuelPerLiter: 1700,
    incomeTaxBrackets: [
      { from: 0,           to: 14000000,   rate: 6  },
      { from: 14000000,    to: 50000000,   rate: 15 },
      { from: 50000000,    to: 88000000,   rate: 24 },
      { from: 88000000,    to: 150000000,  rate: 35 },
      { from: 150000000,   to: 300000000,  rate: 38 },
      { from: 300000000,   to: 500000000,  rate: 40 },
      { from: 500000000,   to: 1000000000, rate: 42 },
      { from: 1000000000,  to: Infinity,   rate: 45 },
    ],
    ssRate: 9.23, // health 3.545% + pension 4.5% + employment 0.9% + nursing 0.2835%
    defaultSalary: 50000000,
  },
  {
    code: "in",
    nameEs: "India",
    nameEn: "India",
    currency: "INR",
    currencySymbol: "₹",
    numberLocale: "en-IN",
    vatRates: [18, 12, 5, 0],
    vatNameEs: "GST",
    vatNameEn: "GST",
    electricityKwh: 8,
    fuelPerLiter: 105,
    // New tax regime 2024 (with rebate u/s 87A: income ≤7L = 0 effective)
    incomeTaxBrackets: [
      { from: 0,         to: 300000,   rate: 0  },
      { from: 300000,    to: 700000,   rate: 5  },
      { from: 700000,    to: 1000000,  rate: 10 },
      { from: 1000000,   to: 1200000,  rate: 15 },
      { from: 1200000,   to: 1500000,  rate: 20 },
      { from: 1500000,   to: Infinity, rate: 30 },
    ],
    ssRate: 12.0, // EPF employee contribution (12% of basic, assume basic = 50% gross → 6% net; using 6 as effective)
    defaultSalary: 800000,
  },
];

export function getCountry(code: string): CountryData {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export function calcIncomeTax(gross: number, brackets: TaxBracket[]): number {
  let tax = 0;
  for (const b of brackets) {
    if (gross <= b.from) break;
    tax += (Math.min(gross, b.to) - b.from) * (b.rate / 100);
  }
  return tax;
}

export function calcSS(gross: number, rate: number, cap?: number): number {
  const base = cap !== undefined ? Math.min(gross, cap) : gross;
  return base * (rate / 100);
}

export function fmtCurrency(amount: number, currency: string, locale: string): string {
  return amount.toLocaleString(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" || currency === "KRW" ? 0 : 2,
  });
}
