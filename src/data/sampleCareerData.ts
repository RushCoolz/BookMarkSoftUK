import { 
  ATSAnalysisResult, 
  ApplicationLink, 
  VouchClaim, 
  CVLabExperiment, 
  GhostTrackerApp, 
  JobAdGapItem, 
  InterviewStarStory, 
  OfferComparison 
} from '../types/career';

export const SAMPLE_CANVA_TWO_COLUMN_CV = `ALEX TURNER
Lead Software Engineer | London, UK | alex.turner@example.co.uk | +44 7700 900123
LinkedIn: linkedin.com/in/alexturner-dev | GitHub: github.com/alexturner-uk | UK Citizen (No sponsorship needed)

[COLUMN 1: SIDEBAR]                [COLUMN 2: MAIN EXPERIENCE]
CORE SKILLS                       SENIOR FULL STACK ENGINEER | ACME FINTECH UK
- TypeScript, Node.js, React      March 2022 - Present | London, UK (Hybrid)
- Python, PostgreSQL, Redis       - Architected event-driven UK Faster Payments gateway handling £42M/day.
- AWS (ECS, Lambda, RDS)          - Decreased median API latency from 420ms to 68ms using Redis caching.
- Docker, CI/CD, Terraform        - Mentored team of 6 engineers and drove ISO 27001 compliance standards.

CERTIFICATIONS                    SOFTWARE ENGINEER | BRITISH HEALTH DIGITAL
- AWS Solutions Architect Pro     Sept 2019 - Feb 2022 | Manchester, UK
- Certified Scrum Master (PSM I)  - Delivered patient appointment scheduling service across 45 NHS trusts.
                                  - Integrated NHS Login OAuth2 and HL7 FHIR healthcare data schemas.
EDUCATION                         - Reduced server infrastructure costs by 28% via containerisation.
BSc (Hons) Computer Science
First Class Honours (1st)         JUNIOR DEVELOPER | TECHSTART LONDON
University of Manchester          July 2018 - August 2019
2015 - 2018                       - Built React components and RESTful Node microservices.`;

export const SAMPLE_ATS_XRAY_RESULT: ATSAnalysisResult = {
  fileName: "Alex_Turner_Canva_Design_CV.pdf",
  fileSizeKb: 142,
  atsScore: 54, // Medium/Risky due to column scrambling
  verdict: "Risky",
  summary: "Standard ATS parsers read PDF bounding boxes horizontally top-to-bottom. Your two-column Canva layout caused your technical skills sidebar to interlace with your work experience bullet points, truncating job titles and confusing the date parser.",
  columnsDetected: 2,
  scrambledLinesCount: 7,
  lostCharactersEstimate: 184,
  extractedLines: [
    {
      id: "l-1",
      originalLineNumber: 1,
      extractedText: "ALEX TURNER",
      detectedSection: "contact",
      status: "safe",
    },
    {
      id: "l-2",
      originalLineNumber: 2,
      extractedText: "Lead Software Engineer | London, UK | alex.turner@example.co.uk | +44 7700 900123",
      detectedSection: "contact",
      status: "safe",
    },
    {
      id: "l-3",
      originalLineNumber: 3,
      extractedText: "CORE SKILLS SENIOR FULL STACK ENGINEER | ACME FINTECH UK",
      detectedSection: "experience",
      status: "scrambled_column",
      note: "Left-column header 'CORE SKILLS' merged with right-column Job Title into a single incoherent line.",
    },
    {
      id: "l-4",
      originalLineNumber: 4,
      extractedText: "- TypeScript, Node.js, React March 2022 - Present | London, UK",
      detectedSection: "skills",
      status: "scrambled_column",
      note: "Skills list merged with Employment Dates. Most ATS will discard this entire date entry.",
    },
    {
      id: "l-5",
      originalLineNumber: 5,
      extractedText: "- Python, PostgreSQL, Redis - Architected event-driven UK Faster Payments gateway handling £42M/day.",
      detectedSection: "experience",
      status: "scrambled_column",
      note: "Bullet points from sidebar and main column concatenated.",
    },
    {
      id: "l-6",
      originalLineNumber: 6,
      extractedText: "- AWS (ECS, Lambda, RDS) - Decreased median API latency from 420ms to 68ms using Redis caching.",
      detectedSection: "experience",
      status: "scrambled_column",
      note: "Multi-column horizontal read error.",
    },
    {
      id: "l-7",
      originalLineNumber: 7,
      extractedText: "- Docker, CI/CD, Terraform - Mentored team of 6 engineers and drove ISO 27001 compliance standards.",
      detectedSection: "experience",
      status: "scrambled_column",
      note: "Skills combined into job accomplishments.",
    },
    {
      id: "l-8",
      originalLineNumber: 8,
      extractedText: "CERTIFICATIONS SOFTWARE ENGINEER | BRITISH HEALTH DIGITAL",
      detectedSection: "experience",
      status: "scrambled_column",
      note: "'CERTIFICATIONS' parsed as part of British Health Digital company name.",
    },
    {
      id: "l-9",
      originalLineNumber: 9,
      extractedText: "EDUCATION BSc (Hons) Computer Science First Class Honours (1st)",
      detectedSection: "education",
      status: "table_flattened",
      note: "Education table formatting lost; graduation year misplaced.",
    },
  ],
  parsedData: {
    name: "Alex Turner",
    email: "alex.turner@example.co.uk",
    phone: "+44 7700 900123",
    location: "London, UK",
    linkedin: "linkedin.com/in/alexturner-dev",
    github: "github.com/alexturner-uk",
    skillsExtracted: ["TypeScript", "Node.js", "React", "Python", "Docker", "AWS"],
    rolesFound: ["Lead Software Engineer", "Core Skills Senior Full Stack Engineer (Malformed)"],
    degreesFound: ["BSc (Hons) Computer Science"],
  },
  remediationAdvice: [
    {
      category: "Layout",
      severity: "critical",
      issue: "Two-Column Canva Grid Collapsed",
      fix: "Switch to a single-column layout for ATS applications. Keep the two-column version only for in-person interviews or direct human email outreach.",
    },
    {
      category: "Headers",
      severity: "warning",
      issue: "Sidebar Headers Interlaced With Job Titles",
      fix: "Ensure each major section (Work Experience, Skills, Education) spans 100% of the line width with standard headings like 'Work Experience' or 'Employment History'.",
    },
    {
      category: "Structure",
      severity: "tip",
      issue: "Date format merged into skill list",
      fix: "Place employment dates on their own line or right-aligned using standard text tabs rather than floating graphic boxes.",
    },
  ],
};

export const SAMPLE_APPLICATION_LINKS: ApplicationLink[] = [
  {
    id: "link-1",
    companyName: "Monzo Bank",
    jobRole: "Senior Backend / Distributed Systems Engineer",
    recipientName: "Charlotte Evans (Talent Lead)",
    customSlug: "alex-turner/monzo-backend",
    cvVersionVariant: "A",
    createdAt: "2026-10-12T09:30:00Z",
    status: "active",
    expiresAt: "2026-11-12T09:30:00Z",
    totalViews: 9,
    uniqueOpenCount: 4,
    lastOpenedAt: "2026-10-16T14:18:22Z",
    dwellTimeSeconds: 142,
    sectionEngagement: {
      summary: 12,
      experience: 64,
      skills: 18,
      projects: 32,
      vouches: 16,
    },
    recentActivities: [
      { id: "act-1", timestamp: "2026-10-16 14:18", location: "London EC2, UK", action: "Opened tailored link (Desktop, macOS Chrome)", durationSeconds: 58 },
      { id: "act-2", timestamp: "2026-10-16 14:19", location: "London EC2, UK", action: "Expanded 'Acme Payments Gateway' proof-of-work project", durationSeconds: 26 },
      { id: "act-3", timestamp: "2026-10-16 14:20", location: "London EC2, UK", action: "Viewed Vouch Badge: 'Verified by CTO at Acme'", durationSeconds: 14 },
      { id: "act-4", timestamp: "2026-10-14 11:05", location: "London EC2, UK", action: "First opened from Monzo internal network", durationSeconds: 44 },
    ],
    notes: "Charlotte shared link with hiring manager David Miller on Slack.",
  },
  {
    id: "link-2",
    companyName: "Revolut",
    jobRole: "Staff Platform Engineer",
    recipientName: "Liam Davies (Engineering Director)",
    customSlug: "alex-turner/revolut-platform",
    cvVersionVariant: "B",
    createdAt: "2026-10-08T16:00:00Z",
    status: "active",
    expiresAt: "2026-11-08T16:00:00Z",
    totalViews: 4,
    uniqueOpenCount: 2,
    lastOpenedAt: "2026-10-10T11:42:00Z",
    dwellTimeSeconds: 88,
    sectionEngagement: {
      summary: 10,
      experience: 42,
      skills: 20,
      projects: 10,
      vouches: 6,
    },
    recentActivities: [
      { id: "act-5", timestamp: "2026-10-10 11:42", location: "Canary Wharf, London", action: "Opened tailored link (Mobile Safari)", durationSeconds: 38 },
      { id: "act-6", timestamp: "2026-10-09 09:12", location: "Canary Wharf, London", action: "Opened tailored link (Desktop)", durationSeconds: 50 },
    ],
    notes: "Read twice. No reply after 6 days.",
  },
  {
    id: "link-3",
    companyName: "Deliveroo",
    jobRole: "Lead Full Stack Engineer",
    recipientName: "Sophie Taylor",
    customSlug: "alex-turner/deliveroo-lead",
    cvVersionVariant: "A",
    createdAt: "2026-09-25T10:00:00Z",
    status: "active",
    expiresAt: "2026-10-25T10:00:00Z",
    totalViews: 0,
    uniqueOpenCount: 0,
    dwellTimeSeconds: 0,
    sectionEngagement: {
      summary: 0,
      experience: 0,
      skills: 0,
      projects: 0,
      vouches: 0,
    },
    recentActivities: [],
    notes: "Applied 21 days ago via portal. Never opened.",
  },
];

export const SAMPLE_VOUCHES: VouchClaim[] = [
  {
    id: "vouch-1",
    candidateName: "Alex Turner",
    roleTitle: "Senior Full Stack Engineer",
    companyName: "Acme Fintech UK",
    employmentPeriod: "March 2022 - Present",
    refereeName: "Marcus Sterling",
    refereeEmail: "m.sterling@acme-fintech.co.uk",
    refereeRole: "VP of Engineering at Acme Fintech UK",
    skillsClaimed: ["TypeScript / Node.js", "Payment Gateway Architecture", "Distributed Systems", "Team Leadership"],
    status: "verified",
    token: "v-83921",
    verifiedAt: "2026-09-18T14:32:00Z",
    refereeQuote: "Alex is in the top 5% of engineers I've managed. Delivered our Faster Payments pipeline on schedule with zero regulatory downtime.",
    auditHash: "SHA256:8f4c219a9301e748b9f1a23e981",
  },
  {
    id: "vouch-2",
    candidateName: "Alex Turner",
    roleTitle: "Software Engineer",
    companyName: "British Health Digital",
    employmentPeriod: "Sept 2019 - Feb 2022",
    refereeName: "Dr. Rachel Ward",
    refereeEmail: "r.ward@britishhealth.nhs.uk",
    refereeRole: "Clinical Tech Director",
    skillsClaimed: ["NHS Login OAuth2", "HL7 FHIR Schemas", "PostgreSQL", "Information Governance"],
    status: "verified",
    token: "v-41092",
    verifiedAt: "2026-09-22T10:15:00Z",
    refereeQuote: "Exceptional diligence with NHS patient privacy standards and high-throughput microservices.",
    auditHash: "SHA256:3d7a8120b4142f11c8e90a56d2",
  },
  {
    id: "vouch-3",
    candidateName: "Alex Turner",
    roleTitle: "Junior Developer",
    companyName: "TechStart London",
    employmentPeriod: "July 2018 - August 2019",
    refereeName: "James O'Connor",
    refereeEmail: "james@techstart.io",
    refereeRole: "Head of Product",
    skillsClaimed: ["React.js", "REST APIs", "Agile Sprints"],
    status: "pending",
    token: "v-55219",
  },
];

export const SAMPLE_CV_LAB_EXPERIMENT: CVLabExperiment = {
  id: "exp-1",
  title: "Revenue & Metrics vs Architecture & Scale Wording",
  description: "Comparing whether UK FinTech hiring managers engage more with high-level financial impact figures (£42M/day) versus specific engineering architecture descriptions (Kafka, Redis, p99 latency).",
  variantA: {
    name: "Variant A: Revenue & Commercial Impact",
    focus: "Highlights business metrics, revenue throughput (£42M/day), and team growth.",
    views: 18,
    skimmed: 14,
    deepReads: 9,
    replies: 5,
    interviews: 3,
  },
  variantB: {
    name: "Variant B: Deep Technical & Architecture",
    focus: "Highlights event-driven architecture, zero-downtime database migrations, and microservice benchmarks.",
    views: 16,
    skimmed: 10,
    deepReads: 6,
    replies: 2,
    interviews: 1,
  },
  notes: "Early trend shows FinTech hiring managers prefer Variant A (27% reply rate) over Variant B (12.5% reply rate). Note: Sample size (N=34) provides preliminary signal, not statistical proof.",
};

export const SAMPLE_GHOST_TRACKER_APPS: GhostTrackerApp[] = [
  {
    id: "gt-1",
    companyName: "Monzo Bank",
    roleTitle: "Senior Backend Engineer",
    salaryOfferedRange: "£95,000 - £110,000",
    location: "London (Hybrid)",
    appliedDate: "2026-10-12",
    lastContactDate: "2026-10-16",
    currentStage: "tech_interview",
    daysSilent: 1,
    tailoredLinkSlug: "alex-turner/monzo-backend",
    contactPerson: "Charlotte Evans",
    contactEmail: "charlotte.evans@monzo.com",
    followUpSentCount: 0,
    notes: "Technical take-home review scheduled for Tuesday.",
  },
  {
    id: "gt-2",
    companyName: "Revolut",
    roleTitle: "Staff Platform Engineer",
    salaryOfferedRange: "£115,000 - £130,000",
    location: "Canary Wharf, London",
    appliedDate: "2026-10-08",
    lastContactDate: "2026-10-10",
    currentStage: "opened",
    daysSilent: 7,
    tailoredLinkSlug: "alex-turner/revolut-platform",
    contactPerson: "Liam Davies",
    contactEmail: "liam.davies@revolut.com",
    followUpSentCount: 0,
    notes: "Opened twice on Oct 10. 7 days silent: Gentle follow-up recommended now.",
  },
  {
    id: "gt-3",
    companyName: "Deliveroo",
    roleTitle: "Lead Full Stack Engineer",
    salaryOfferedRange: "£90,000 - £105,000",
    location: "London (Remote)",
    appliedDate: "2026-09-25",
    lastContactDate: "2026-09-25",
    currentStage: "ghosted",
    daysSilent: 22,
    tailoredLinkSlug: "alex-turner/deliveroo-lead",
    followUpSentCount: 1,
    notes: "Silence for 22 days after initial portal application. Marked as ghosted in pipeline stats.",
  },
  {
    id: "gt-4",
    companyName: "BBC Digital / iPlayer",
    roleTitle: "Principal Systems Developer",
    salaryOfferedRange: "£85,000 - £92,000 + BBC DB Pension",
    location: "Salford / Manchester",
    appliedDate: "2026-10-02",
    lastContactDate: "2026-10-07",
    currentStage: "phone_screen",
    daysSilent: 10,
    tailoredLinkSlug: "alex-turner/bbc-digital",
    contactPerson: "Sarah Jenkins",
    followUpSentCount: 1,
    notes: "HR screen completed 10 days ago. Sent 1st polite nudge.",
  },
];

export const SAMPLE_JOB_GAP_ITEMS: JobAdGapItem[] = [
  {
    id: "gap-1",
    requirement: "Demonstrated experience designing high-throughput event streaming systems with Apache Kafka or AWS Kinesis.",
    category: "hard_skill",
    evidenceInCv: "strong",
    matchedSnippet: "Architected event-driven UK Faster Payments gateway handling £42M/day using Redis & AWS Lambda.",
    honestRecommendation: "Your experience with event-driven message architectures is evident, but the job explicitly names Kafka. State whether you used Kafka, RabbitMQ, or AWS EventBridge/SNS to avoid ATS keyword dropouts.",
  },
  {
    id: "gap-2",
    requirement: "Hands-on experience with Kubernetes (EKS/GKE) and Helm charts in production environments.",
    category: "hard_skill",
    evidenceInCv: "partial",
    matchedSnippet: "Docker, CI/CD, Terraform, AWS ECS.",
    honestRecommendation: "You list Docker, ECS, and Terraform, but not Kubernetes or Helm directly. If you have run containers on k8s or collaborated on manifests, mention 'Container orchestration (ECS & Kubernetes)' honestly without inventing unsupported experience.",
  },
  {
    id: "gap-3",
    requirement: "UK Right to Work: Must have valid permanent right to work in the UK without visa sponsorship.",
    category: "right_to_work",
    evidenceInCv: "strong",
    matchedSnippet: "UK Citizen (No sponsorship needed)",
    honestRecommendation: "Confirmed. Explicitly shown on your header to stop UK automated filters from discarding your CV.",
  },
  {
    id: "gap-4",
    requirement: "FCA regulatory compliance or Open Banking API specifications (PSD2/CDR).",
    category: "domain",
    evidenceInCv: "partial",
    matchedSnippet: "UK Faster Payments gateway handling £42M/day; ISO 27001 compliance standards.",
    honestRecommendation: "You evidenced ISO 27001 and Faster Payments. Add a brief mention if you touched Open Banking / Confirmation of Payee APIs during that project.",
  },
];

export const SAMPLE_STAR_STORIES: InterviewStarStory[] = [
  {
    id: "star-1",
    question: "Tell me about a time you had to optimize a critical production system under extreme load.",
    competency: "Technical Problem Solving & Scalability",
    linkedCvBullet: "Decreased median API latency from 420ms to 68ms using Redis caching on £42M/day gateway.",
    star: {
      situation: "At Acme Fintech, our payment authorization API latency spiked to 420ms during Black Friday peak trading, approaching the 500ms bank timeout threshold.",
      task: "As the Senior Engineer, I was tasked with bringing p99 response times below 100ms within two sprint cycles without altering underlying bank reconciliation database schemas.",
      action: "I profiled our SQL queries and discovered repetitive token and exchange-rate lookups. I implemented a write-through Redis cluster with TTL jitter, connection pooling in Node.js, and circuit-breakers.",
      result: "Median latency plunged from 420ms to 68ms (an 83% reduction) and throughput doubled to 1,400 requests/sec with zero customer timeout errors.",
    },
  },
  {
    id: "star-2",
    question: "Describe a situation where you had to push back on unrealistic deadlines or architectural debt.",
    competency: "Stakeholder Management & Integrity",
    linkedCvBullet: "Mentored team of 6 engineers and drove ISO 27001 compliance standards.",
    star: {
      situation: "A product manager requested bypassing security audit logging to launch an international payout feature 3 weeks ahead of a partner press announcement.",
      task: "I needed to safeguard our upcoming ISO 27001 certification and customer fund security while helping the commercial team meet their business goal.",
      action: "Instead of a blanket 'no', I mapped the regulatory risk for executive stakeholders, then proposed a phased rollout: launch in beta with automated audit streams, deferring secondary analytics to phase 2.",
      result: "We launched on the promised date with 100% compliant security logs, and our subsequent external ISO 27001 audit passed with zero non-conformances.",
    },
  },
];

export const SAMPLE_OFFER_COMPARISONS: OfferComparison[] = [
  {
    id: "off-1",
    companyName: "Monzo Bank",
    jobTitle: "Senior Backend Engineer",
    baseSalary: 100000,
    bonusExpected: 10000,
    pensionEmployerPercent: 8,
    pensionEmployeePercent: 5,
    isScottishTax: false,
    studentLoanPlan: "plan2",
    annualCommuteCost: 1800, // TFL Zone 1-3 travelcard
    annualPrivateHealthcareTaxBenefit: 750,
    annualHolidayDays: 28,
    noticePeriodWeeks: 4,
    remotePolicy: "hybrid_2_days",
  },
  {
    id: "off-2",
    companyName: "Revolut",
    jobTitle: "Staff Platform Engineer",
    baseSalary: 120000,
    bonusExpected: 20000,
    pensionEmployerPercent: 3,
    pensionEmployeePercent: 5,
    isScottishTax: false,
    studentLoanPlan: "plan2",
    annualCommuteCost: 2400, // Canary Wharf travel
    annualPrivateHealthcareTaxBenefit: 1100,
    annualHolidayDays: 25,
    noticePeriodWeeks: 12, // 3-month notice
    remotePolicy: "hybrid_3_days",
  },
  {
    id: "off-3",
    companyName: "BBC Digital",
    jobTitle: "Principal Systems Developer",
    baseSalary: 88000,
    bonusExpected: 0,
    pensionEmployerPercent: 12, // High DB style workplace pension
    pensionEmployeePercent: 6,
    isScottishTax: false,
    studentLoanPlan: "plan2",
    annualCommuteCost: 450, // Mostly remote / Manchester tram
    annualPrivateHealthcareTaxBenefit: 0,
    annualHolidayDays: 32,
    noticePeriodWeeks: 8,
    remotePolicy: "fully_remote",
  },
];
