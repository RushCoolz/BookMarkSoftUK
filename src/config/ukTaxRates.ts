/**
 * BookMarkSoft UK - Centralized Tax & Legislation Config
 * Tax Year: 2024/25, 2025/26 & 2026/27
 * Last Checked: April 2026
 * 
 * IMPORTANT: All calculators must reference this file to avoid hardcoded rates.
 * All calculators must display an estimate disclaimer and official GOV.UK link.
 */

export interface UkTaxYearConfig {
  taxYear: string;
  lastChecked: string;
  sourceLabel: string;
  sourceUrl: string;
  
  // Income Tax England, Wales & Northern Ireland
  personalAllowance: number;
  personalAllowanceTaperThreshold: number; // £100,000
  englandBands: {
    basic: { max: number; rate: number };
    higher: { max: number; rate: number };
    additional: { rate: number };
  };

  // Income Tax Scotland
  scotlandBands: {
    starter: { max: number; rate: number };
    basic: { max: number; rate: number };
    intermediate: { max: number; rate: number };
    higher: { max: number; rate: number };
    advanced: { max: number; rate: number };
    top: { rate: number };
  };

  // National Insurance (Class 1 Employee)
  nationalInsurance: {
    primaryThresholdYearly: number; // £12,570
    upperEarningsLimitYearly: number; // £50,270
    mainRate: number; // 0.08 (8%)
    upperRate: number; // 0.02 (2%)
  };

  // Self-Employed National Insurance
  selfEmployedNI: {
    smallProfitsThreshold: number; // £6,725
    lowerProfitsLimit: number; // £12,570
    upperProfitsLimit: number; // £50,270
    class4MainRate: number; // 0.06 (6%)
    class4UpperRate: number; // 0.02 (2%)
  };

  // Student Loans
  studentLoans: {
    plan1: { threshold: number; rate: number };
    plan2: { threshold: number; rate: number };
    plan4: { threshold: number; rate: number }; // Scotland
    plan5: { threshold: number; rate: number };
    postgraduate: { threshold: number; rate: number };
  };

  // Workplace Pension Auto-Enrolment
  pension: {
    qualifyingEarningsLower: number; // £6,240
    qualifyingEarningsUpper: number; // £50,270
    defaultEmployeeMinPercent: number; // 5%
    defaultEmployerMinPercent: number; // 3%
  };

  // Minimum Wage & Living Wage (hourly)
  minimumWage: {
    nationalLivingWage21Plus: number; // £11.44 -> £12.21
    age18to20: number; // £8.60 -> £10.00
    under18: number; // £6.40 -> £7.55
    apprentice: number; // £6.40 -> £7.55
    realLivingWageUK: number; // £12.60
    realLivingWageLondon: number; // £13.85
  };

  // Statutory Rates
  statutory: {
    redundancyWeeklyCap: number; // £700
    redundancyMaxYears: number; // 20
    sickPayWeekly: number; // £116.75
    maternityStandardWeekly: number; // £184.03
  };

  // Corporation Tax & Dividends
  business: {
    corpTaxSmallRate: number; // 0.19 (up to £50k)
    corpTaxMainRate: number; // 0.25 (over £250k)
    dividendAllowance: number; // £500
    dividendBasicRate: number; // 0.0875
    dividendHigherRate: number; // 0.3375
    dividendAdditionalRate: number; // 0.3935
  };

  // ISA & Savings
  savings: {
    annualIsaAllowance: number; // £20,000
    lifetimeIsaAnnualMax: number; // £4,000
    psaBasicRate: number; // £1,000
    psaHigherRate: number; // £500
    psaAdditionalRate: number; // £0
  };

  // Stamp Duty (SDLT England/NI)
  sdlt: {
    standardBands: Array<{ threshold: number; rate: number }>;
    firstTimeBuyerMaxPrice: number; // £625,000
    firstTimeBuyerNilBand: number; // £425,000
    additionalPropertySurcharge: number; // 0.05 (5%)
  };

  // Ofgem Energy Price Cap (Standard Variable Tariff)
  ofgemPriceCap: {
    period: string;
    electricityUnitRatePence: number; // ~24.5p / kWh
    electricityStandingChargePence: number; // ~60.1p / day
    gasUnitRatePence: number; // ~6.2p / kWh
    gasStandingChargePence: number; // ~31.4p / day
    annualDualFuelAverage: number; // ~£1,717
  };

  // Skilled Worker Visa Thresholds
  visaThresholds: {
    skilledWorkerGeneralThreshold: number; // £38,700
    healthAndCareThreshold: number; // £29,000
    sourceUrl: string;
  };
}

export const UK_TAX_CONFIG: UkTaxYearConfig = {
  taxYear: "2025/2026 (Applicable 2026/2027)",
  lastChecked: "April 2026",
  sourceLabel: "GOV.UK Rates & Thresholds",
  sourceUrl: "https://www.gov.uk/income-tax-rates",

  personalAllowance: 12570,
  personalAllowanceTaperThreshold: 100000,

  englandBands: {
    basic: { max: 50270, rate: 0.20 },
    higher: { max: 125140, rate: 0.40 },
    additional: { rate: 0.45 },
  },

  scotlandBands: {
    starter: { max: 14876, rate: 0.19 },
    basic: { max: 26561, rate: 0.20 },
    intermediate: { max: 43662, rate: 0.21 },
    higher: { max: 75000, rate: 0.42 },
    advanced: { max: 125140, rate: 0.45 },
    top: { rate: 0.48 },
  },

  nationalInsurance: {
    primaryThresholdYearly: 12570,
    upperEarningsLimitYearly: 50270,
    mainRate: 0.08, // 8% Class 1 Employee rate
    upperRate: 0.02, // 2% above upper earnings limit
  },

  selfEmployedNI: {
    smallProfitsThreshold: 6725,
    lowerProfitsLimit: 12570,
    upperProfitsLimit: 50270,
    class4MainRate: 0.06, // 6%
    class4UpperRate: 0.02, // 2%
  },

  studentLoans: {
    plan1: { threshold: 24990, rate: 0.09 },
    plan2: { threshold: 27295, rate: 0.09 },
    plan4: { threshold: 31395, rate: 0.09 },
    plan5: { threshold: 25000, rate: 0.09 },
    postgraduate: { threshold: 21000, rate: 0.06 },
  },

  pension: {
    qualifyingEarningsLower: 6240,
    qualifyingEarningsUpper: 50270,
    defaultEmployeeMinPercent: 5,
    defaultEmployerMinPercent: 3,
  },

  minimumWage: {
    nationalLivingWage21Plus: 12.21,
    age18to20: 10.00,
    under18: 7.55,
    apprentice: 7.55,
    realLivingWageUK: 12.60,
    realLivingWageLondon: 13.85,
  },

  statutory: {
    redundancyWeeklyCap: 700,
    redundancyMaxYears: 20,
    sickPayWeekly: 116.75,
    maternityStandardWeekly: 184.03,
  },

  business: {
    corpTaxSmallRate: 0.19,
    corpTaxMainRate: 0.25,
    dividendAllowance: 500,
    dividendBasicRate: 0.0875,
    dividendHigherRate: 0.3375,
    dividendAdditionalRate: 0.3935,
  },

  savings: {
    annualIsaAllowance: 20000,
    lifetimeIsaAnnualMax: 4000,
    psaBasicRate: 1000,
    psaHigherRate: 500,
    psaAdditionalRate: 0,
  },

  sdlt: {
    standardBands: [
      { threshold: 250000, rate: 0.00 },
      { threshold: 925000, rate: 0.05 },
      { threshold: 1500000, rate: 0.10 },
      { threshold: Infinity, rate: 0.12 },
    ],
    firstTimeBuyerMaxPrice: 625000,
    firstTimeBuyerNilBand: 425000,
    additionalPropertySurcharge: 0.05, // 5% surcharge
  },

  ofgemPriceCap: {
    period: "2026 Q1/Q2 Price Cap (Standard Variable Tariff)",
    electricityUnitRatePence: 24.50,
    electricityStandingChargePence: 60.10,
    gasUnitRatePence: 6.24,
    gasStandingChargePence: 31.40,
    annualDualFuelAverage: 1717,
  },

  visaThresholds: {
    skilledWorkerGeneralThreshold: 38700,
    healthAndCareThreshold: 29000,
    sourceUrl: "https://www.gov.uk/skilled-worker-visa/your-job",
  },
};
