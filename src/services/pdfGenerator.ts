import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ATSAnalysisResult } from '../types/career';

/**
 * Trigger immediate browser download of PDF bytes
 */
export function downloadPdfBlob(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate a 100% ATS-Compliant, Single-Column PDF on-site in the browser (Zero R2/S3 needed)
 */
export async function generateCleanAtsCvPdf(candidateData?: {
  name: string;
  roleHeadline: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  rightToWork: string;
  summary: string;
  experience: Array<{
    role: string;
    company: string;
    dates: string;
    location: string;
    bullets: string[];
    verifiedBy?: string;
  }>;
  skills: {
    languages: string;
    cloud: string;
    frameworks: string;
  };
  education: string;
  accentHex?: string;
}) {
  const candidate = candidateData || {
    name: "ALEX TURNER",
    roleHeadline: "Lead Software Engineer • Distributed Systems & Payments",
    location: "London, UK",
    email: "alex.turner@example.co.uk",
    phone: "+44 7700 900123",
    github: "github.com/alexturner-uk",
    linkedin: "linkedin.com/in/alexturner-dev",
    rightToWork: "UK Citizen (No Visa Sponsorship Needed)",
    summary: "Results-driven Lead Software Engineer with 7+ years designing high-throughput UK financial and healthcare platforms handling £42M/day volume.",
    experience: [
      {
        role: "Senior Full Stack Engineer",
        company: "Acme Fintech UK",
        dates: "March 2022 - Present",
        location: "London, UK (Hybrid)",
        verifiedBy: "Marcus Sterling (VP of Engineering at Acme Fintech UK)",
        bullets: [
          "Architected event-driven UK Faster Payments gateway handling £42M/day with 99.99% availability.",
          "Decreased median API authorization latency from 420ms to 68ms using Redis clustering.",
          "Mentored team of 6 engineers and drove full ISO 27001 data compliance certification.",
        ],
      },
      {
        role: "Software Engineer",
        company: "British Health Digital",
        dates: "Sept 2019 - Feb 2022",
        location: "Manchester, UK",
        verifiedBy: "Dr. Rachel Ward (Clinical Tech Director)",
        bullets: [
          "Delivered patient appointment scheduling service across 45 NHS trusts under HL7 FHIR standards.",
          "Integrated NHS Login OAuth2 authentication for over 220,000 active NHS users.",
          "Reduced server infrastructure costs by 28% through Docker containerisation on AWS ECS.",
        ],
      },
    ],
    skills: {
      languages: "TypeScript, JavaScript, Python, Node.js, SQL, Go",
      cloud: "AWS (ECS, Lambda, RDS, S3), Docker, Terraform, CI/CD",
      frameworks: "React, Next.js, Express, PostgreSQL, Redis, Kafka",
    },
    education: "BSc (Hons) Computer Science | First Class Honours (1st) | University of Manchester (2015 - 2018)",
    accentHex: "#1e3a8a",
  };

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size (points)
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const hexToRgb = (hex: string, fallback = rgb(0.12, 0.23, 0.54)) => {
    try {
      const clean = hex.replace('#', '');
      if (clean.length !== 6) return fallback;
      const r = parseInt(clean.substring(0, 2), 16) / 255;
      const g = parseInt(clean.substring(2, 4), 16) / 255;
      const b = parseInt(clean.substring(4, 6), 16) / 255;
      return rgb(r, g, b);
    } catch {
      return fallback;
    }
  };

  const primaryColor = rgb(0.12, 0.16, 0.22); // Deep Charcoal #1f2937
  const accentColor = candidate.accentHex ? hexToRgb(candidate.accentHex) : rgb(0.12, 0.23, 0.54); // Theme Accent
  const textMuted = rgb(0.35, 0.40, 0.48); // Slate 600
  const verifiedGreen = rgb(0.04, 0.60, 0.38); // Emerald #059669

  let y = height - 48;
  const margin = 50;
  const contentWidth = width - margin * 2;

  // Header Name
  page.drawText(candidate.name, {
    x: margin,
    y,
    size: 20,
    font: fontBold,
    color: primaryColor,
  });

  y -= 16;
  page.drawText(candidate.roleHeadline, {
    x: margin,
    y,
    size: 10,
    font: fontBold,
    color: accentColor,
  });

  y -= 14;
  const contactLine = `${candidate.location}  |  ${candidate.email}  |  ${candidate.phone}  |  ${candidate.github}`;
  page.drawText(contactLine, {
    x: margin,
    y,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });

  y -= 12;
  page.drawText(`UK Right to Work: ${candidate.rightToWork}`, {
    x: margin,
    y,
    size: 8.5,
    font: fontBold,
    color: verifiedGreen,
  });

  // Divider
  y -= 14;
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.85, 0.88, 0.92),
  });

  // Section Helper
  const drawSectionHeader = (title: string) => {
    y -= 18;
    page.drawText(title.toUpperCase(), {
      x: margin,
      y,
      size: 10.5,
      font: fontBold,
      color: primaryColor,
    });
    y -= 5;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.75,
      color: rgb(0.88, 0.90, 0.94),
    });
    y -= 12;
  };

  // Professional Summary
  drawSectionHeader("Professional Summary");
  page.drawText(candidate.summary, {
    x: margin,
    y,
    size: 9,
    font: fontRegular,
    color: primaryColor,
    maxWidth: contentWidth,
    lineHeight: 13,
  });
  y -= 24;

  // Work Experience
  drawSectionHeader("Employment Experience (Single-Column Linear Flow)");

  for (const exp of candidate.experience) {
    // Role Title & Dates
    page.drawText(exp.role, {
      x: margin,
      y,
      size: 10,
      font: fontBold,
      color: primaryColor,
    });

    const datesWidth = fontRegular.widthOfTextAtSize(exp.dates, 9);
    page.drawText(exp.dates, {
      x: width - margin - datesWidth,
      y,
      size: 9,
      font: fontRegular,
      color: textMuted,
    });

    y -= 13;
    page.drawText(`${exp.company} — ${exp.location}`, {
      x: margin,
      y,
      size: 9,
      font: fontRegular,
      color: textMuted,
    });

    if (exp.verifiedBy) {
      y -= 12;
      page.drawText(`[VOUCH VERIFIED: Confirmed by ${exp.verifiedBy}]`, {
        x: margin,
        y,
        size: 8,
        font: fontBold,
        color: verifiedGreen,
      });
    }

    y -= 12;
    for (const bullet of exp.bullets) {
      page.drawText(`•  ${bullet}`, {
        x: margin + 8,
        y,
        size: 8.5,
        font: fontRegular,
        color: primaryColor,
        maxWidth: contentWidth - 12,
        lineHeight: 12,
      });
      y -= 15;
    }
    y -= 6;
  }

  // Technical Skills
  drawSectionHeader("Technical Skills");
  page.drawText(`Languages & Core:  ${candidate.skills.languages}`, {
    x: margin,
    y,
    size: 8.5,
    font: fontRegular,
    color: primaryColor,
  });
  y -= 14;
  page.drawText(`Frameworks & DBs:  ${candidate.skills.frameworks}`, {
    x: margin,
    y,
    size: 8.5,
    font: fontRegular,
    color: primaryColor,
  });
  y -= 14;
  page.drawText(`Cloud & DevOps:     ${candidate.skills.cloud}`, {
    x: margin,
    y,
    size: 8.5,
    font: fontRegular,
    color: primaryColor,
  });
  y -= 18;

  // Education
  drawSectionHeader("Education & Qualifications");
  page.drawText(candidate.education, {
    x: margin,
    y,
    size: 8.5,
    font: fontRegular,
    color: primaryColor,
  });

  // Footer Note
  y = 35;
  page.drawText("Generated on-site via BookMarkSoft UK • 100% Client-Side & Private • ATS-Friendly Structure", {
    x: margin,
    y,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.6, 0.65, 0.7),
  });

  const pdfBytes = await pdfDoc.save();
  downloadPdfBlob(pdfBytes, `${candidate.name.replace(/\s+/g, '_')}_ATS_Optimized_CV.pdf`);
  return pdfBytes;
}

/**
 * Generate an ATS X-Ray Audit Report PDF on-site
 */
export async function generateAtsAuditReportPdf(result: ATSAnalysisResult) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;
  const margin = 50;

  page.drawText("BOOKMARKSOFT UK — ATS X-RAY AUDIT REPORT", {
    x: margin,
    y,
    size: 14,
    font: fontBold,
    color: rgb(0.12, 0.16, 0.22),
  });

  y -= 20;
  page.drawText(`File Analyzed: ${result.fileName}  |  Score: ${result.atsScore}% (${result.verdict})`, {
    x: margin,
    y,
    size: 10,
    font: fontBold,
    color: result.atsScore >= 75 ? rgb(0.04, 0.6, 0.38) : rgb(0.85, 0.2, 0.2),
  });

  y -= 15;
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.85, 0.88, 0.92),
  });

  y -= 25;
  page.drawText("EXECUTIVE PARSING SUMMARY:", { x: margin, y, size: 9, font: fontBold });
  y -= 14;
  page.drawText(result.summary, {
    x: margin,
    y,
    size: 8.5,
    font: fontRegular,
    maxWidth: width - margin * 2,
    lineHeight: 13,
  });

  y -= 35;
  page.drawText("DETECTED BOUNDING BOX ISSUES:", { x: margin, y, size: 9, font: fontBold });
  y -= 14;
  page.drawText(`• Columns Detected: ${result.columnsDetected} (${result.columnsDetected > 1 ? "Multi-column risk" : "Linear safe"})`, { x: margin, y, size: 8.5, font: fontRegular });
  y -= 13;
  page.drawText(`• Scrambled Lines: ${result.scrambledLinesCount} coordinate collisions`, { x: margin, y, size: 8.5, font: fontRegular });
  y -= 13;
  page.drawText(`• Estimated Lost Characters: ${result.lostCharactersEstimate} chars ignored`, { x: margin, y, size: 8.5, font: fontRegular });

  y -= 30;
  page.drawText("REMEDIATION BLUEPRINT:", { x: margin, y, size: 9, font: fontBold });
  y -= 15;
  for (const advice of result.remediationAdvice) {
    page.drawText(`[${advice.category} - ${advice.severity.toUpperCase()}]: ${advice.issue}`, {
      x: margin,
      y,
      size: 8.5,
      font: fontBold,
      color: rgb(0.2, 0.3, 0.4),
    });
    y -= 12;
    page.drawText(advice.fix, {
      x: margin + 10,
      y,
      size: 8,
      font: fontRegular,
      maxWidth: width - margin * 2 - 10,
      lineHeight: 11,
    });
    y -= 18;
  }

  y = 40;
  page.drawText("Generated 100% on-site with zero server storage. Free for UK job seekers.", {
    x: margin,
    y,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.6, 0.65, 0.7),
  });

  const pdfBytes = await pdfDoc.save();
  downloadPdfBlob(pdfBytes, `ATS_XRay_Report_${result.fileName.replace(/\.pdf|\.txt/g, '')}.pdf`);
  return pdfBytes;
}
