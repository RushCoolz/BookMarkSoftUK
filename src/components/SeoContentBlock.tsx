import React from 'react';
import { ShieldCheck, Zap, Globe2 } from 'lucide-react';

interface SeoContentBlockProps {
  title: string;
  subtitle: string;
  categoryTitle?: string;
}

export function SeoContentBlock({ title, subtitle, categoryTitle }: SeoContentBlockProps) {
  // Generate structured data for Google Search (Rich Snippets)
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${title} | BookmarkSoft`,
    "description": subtitle,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is the ${title} safe to use?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Absolutely. BookmarkSoft uses client-side processing for the ${title}, meaning your data is processed directly on your device. We do not store or transmit your sensitive information to our servers.`
        }
      },
      {
        "@type": "Question",
        "name": `Do I need to download any software to use the ${title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `No! The ${title} works entirely in your web browser. There are no plugins, extensions, or software installations required.`
        }
      },
      {
        "@type": "Question",
        "name": `Can I use the ${title} on my mobile phone?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, BookmarkSoft is fully responsive. You can use the ${title} seamlessly on your desktop, tablet, or mobile device.`
        }
      }
    ]
  };

  const renderCategoryContent = () => {
    switch (categoryTitle) {
      case "Developer & Code Tools":
        return (
          <>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">Essential for Modern Development</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Writing code, debugging APIs, and managing data structures are daily tasks for any software engineer. The {title} is specifically built to integrate seamlessly into your development workflow. Rather than relying on slow, server-based tools that might expose your proprietary code or sensitive API tokens, this utility runs entirely in your browser. This ensures maximum security, instant execution, and zero downtime. Whether you are dealing with massive JSON payloads, minified CSS, or complex SQL queries, having the right tool at your fingertips saves valuable time and reduces syntax errors.
            </p>
          </>
        );
      case "Security & Privacy Tools":
        return (
          <>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">Protecting Your Digital Footprint</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              In an era of frequent data breaches and aggressive online tracking, securing your digital assets is paramount. The {title} was engineered with a privacy-first approach. By performing all cryptographic operations, IP checks, or hashing functions locally within your client environment, we guarantee that your sensitive information never leaves your device. This utility empowers you to adopt robust security practices—such as using high-entropy passwords, encrypting private text, and monitoring your network exposure—without relying on untrusted third-party servers.
            </p>
          </>
        );
      case "Image & Media Tools":
        return (
          <>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">Optimized for Web Performance</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Large, unoptimized media files are the leading cause of slow website loading times and poor user experiences. The {title} gives you professional-grade control over your media assets directly in the browser. You can rapidly compress, convert, or resize images to modern formats like WebP without the need for expensive desktop software like Photoshop. By optimizing your media files before uploading them to your server, you significantly improve your website's Core Web Vitals, boost your SEO rankings, and reduce your bandwidth costs.
            </p>
          </>
        );
      case "Document & Text Tools":
        return (
          <>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">Streamline Your Writing Workflow</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Whether you are drafting a technical blog post, formatting a legal document, or organizing large lists of data, the {title} eliminates the friction in text processing. Copy-pasting text between different applications often leads to formatting errors or hidden characters. This utility provides a clean, distraction-free environment to manipulate text exactly how you need it. From converting cases and removing duplicates to rendering Markdown in real-time, this tool ensures your content is perfectly formatted and ready for publication or distribution.
            </p>
          </>
        );
      case "Math & Finance":
        return (
          <>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">Accurate and Instant Calculations</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Navigating complex financial formulas or unit conversions shouldn't require a spreadsheet or a dedicated accountant. The {title} provides instant, precise calculations to help you make informed decisions. Whether you are a freelancer estimating profit margins, a homeowner calculating mortgage rates, or an investor tracking compound interest, this tool offers a highly intuitive interface. Because all computations are performed via client-side JavaScript, you get immediate results without any loading screens or page refreshes.
            </p>
          </>
        );
      case "Web, SEO & Social":
        return (
          <>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">Boost Your Online Visibility</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Ranking high on search engines and maintaining a strong social media presence requires meticulous attention to detail. The {title} is designed to help marketers, bloggers, and webmasters optimize their digital footprint. By generating accurate meta tags, crafting trackable UTM links, and previewing Open Graph cards, you can ensure your content looks perfect when shared across platforms like Twitter, LinkedIn, and Facebook. This utility removes the guesswork from SEO, helping you drive more organic traffic to your projects.
            </p>
          </>
        );
      default:
        return (
          <>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">Why Use the {title}?</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              The {title} is a versatile utility designed to simplify complex tasks and improve your daily productivity. Whether you are tackling professional projects or managing personal tasks, this tool offers an intuitive, browser-based solution that requires no downloads or installations. By leveraging modern web technologies, it ensures your data remains secure while delivering instantaneous results, making it an essential addition to your digital toolkit.
            </p>
          </>
        );
    }
  };

  return (
    <>
      {/* Inject JSON-LD Scripts for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto mt-16 px-4 pb-16 space-y-12">
        {/* What is section */}
        <section className="bg-white dark:bg-slate-900/30 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4 tracking-tight">
            What is the {title}?
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              The {title} is a powerful, free online utility designed to help you {subtitle.toLowerCase().replace(/\.$/, '')}. 
              Whether you are a developer, designer, or everyday user, our {title.toLowerCase()} provides an intuitive interface 
              to get the job done quickly and efficiently without the need to install complex software.
            </p>
            {renderCategoryContent()}
          </div>
        </section>

        {/* Why use section */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 tracking-tight text-center mb-8">
            Why use BookmarkSoft's {title}?
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">100% Secure</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">All processing happens locally in your browser. Your data never leaves your device.</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Lightning Fast</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">No server roundtrips means instant results, no matter the file size.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Always Free</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Access our entire suite of premium tools completely free of charge, with no registration required.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-50 dark:bg-slate-900/20 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 tracking-tight text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Is the {title} safe to use?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Absolutely. BookmarkSoft uses client-side processing for the {title}, meaning your data is processed directly on your device. We do not store or transmit your sensitive information to our servers.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Do I need to download any software to use the {title}?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No! The {title} works entirely in your web browser. There are no plugins, extensions, or software installations required.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Can I use the {title} on my mobile phone?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Yes, BookmarkSoft is fully responsive. You can use the {title} seamlessly on your desktop, tablet, or mobile device.
              </p>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
