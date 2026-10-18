export type ATSSectionType = 
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'unparsed_or_lost';

export interface ATSExtractedLine {
  id: string;
  originalLineNumber: number;
  extractedText: string;
  detectedSection: ATSSectionType;
  status: 'safe' | 'scrambled_column' | 'lost_formatting' | 'table_flattened' | 'graphic_stripped';
  note?: string;
}

export interface ATSAnalysisResult {
  fileName: string;
  fileSizeKb: number;
  atsScore: number; // 0 - 100
  verdict: 'Excellent' | 'Good' | 'Risky' | 'Critical Failure';
  summary: string;
  columnsDetected: number;
  scrambledLinesCount: number;
  lostCharactersEstimate: number;
  extractedLines: ATSExtractedLine[];
  parsedData: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    skillsExtracted: string[];
    rolesFound: string[];
    degreesFound: string[];
  };
  remediationAdvice: {
    category: 'Layout' | 'Fonts' | 'Headers' | 'Structure';
    severity: 'critical' | 'warning' | 'tip';
    issue: string;
    fix: string;
  }[];
}

export interface ApplicationLink {
  id: string;
  companyName: string;
  jobRole: string;
  recipientName: string;
  customSlug: string; // e.g. alex/monzo-senior-engineer
  cvVersionVariant: 'A' | 'B';
  createdAt: string;
  status: 'active' | 'expired' | 'revoked';
  expiresAt: string;
  totalViews: number;
  uniqueOpenCount: number;
  lastOpenedAt?: string;
  dwellTimeSeconds: number;
  sectionEngagement: {
    summary: number;
    experience: number;
    skills: number;
    projects: number;
    vouches: number;
  };
  recentActivities: {
    id: string;
    timestamp: string;
    location: string;
    action: string;
    durationSeconds?: number;
  }[];
  notes?: string;
}

export interface VouchClaim {
  id: string;
  candidateName: string;
  roleTitle: string;
  companyName: string;
  employmentPeriod: string;
  refereeName: string;
  refereeEmail: string;
  refereeRole: string;
  skillsClaimed: string[];
  status: 'verified' | 'pending' | 'declined';
  token: string;
  verifiedAt?: string;
  refereeQuote?: string;
  auditHash?: string;
}

export interface CVLabExperiment {
  id: string;
  title: string;
  description: string;
  variantA: {
    name: string;
    focus: string; // e.g. "Revenue & Metric Heavy"
    views: number;
    skimmed: number; // >15s
    deepReads: number; // >60s
    replies: number;
    interviews: number;
  };
  variantB: {
    name: string;
    focus: string; // e.g. "Technical Architecture & Scale"
    views: number;
    skimmed: number;
    deepReads: number;
    replies: number;
    interviews: number;
  };
  notes: string;
}

export type ApplicationStage = 
  | 'applied'
  | 'opened'
  | 'phone_screen'
  | 'tech_interview'
  | 'final_round'
  | 'offer'
  | 'ghosted'
  | 'rejected';

export interface GhostTrackerApp {
  id: string;
  companyName: string;
  roleTitle: string;
  salaryOfferedRange?: string;
  location: string;
  appliedDate: string;
  lastContactDate: string;
  currentStage: ApplicationStage;
  daysSilent: number;
  tailoredLinkSlug: string;
  contactPerson?: string;
  contactEmail?: string;
  followUpSentCount: number;
  notes?: string;
}

export interface JobAdGapItem {
  id: string;
  requirement: string;
  category: 'hard_skill' | 'soft_skill' | 'experience_level' | 'domain' | 'right_to_work';
  evidenceInCv: 'strong' | 'partial' | 'missing';
  matchedSnippet?: string;
  honestRecommendation: string;
}

export interface InterviewStarStory {
  id: string;
  question: string;
  competency: string;
  linkedCvBullet: string;
  star: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface OfferComparison {
  id: string;
  companyName: string;
  jobTitle: string;
  baseSalary: number;
  bonusExpected: number;
  pensionEmployerPercent: number;
  pensionEmployeePercent: number;
  isScottishTax: boolean;
  studentLoanPlan: 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgraduate';
  annualCommuteCost: number;
  annualPrivateHealthcareTaxBenefit: number;
  annualHolidayDays: number;
  noticePeriodWeeks: number;
  remotePolicy: 'fully_remote' | 'hybrid_2_days' | 'hybrid_3_days' | 'full_onsite';
}
