import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | BookmarkSoft',
    default: 'BookmarkSoft - Free Developer & Utility Tools',
  },
  description: "A comprehensive suite of free, secure, browser-based developer tools, formatters, calculators, and generators.",
  keywords: ["developer tools", "JSON formatter", "XML formatter", "base64 decode", "calculators", "free online tools"],
  openGraph: {
    title: 'BookmarkSoft - Free Developer & Utility Tools',
    description: 'A comprehensive suite of free, secure, browser-based developer tools, formatters, calculators, and generators.',
    url: 'https://bookmarksoft.com',
    siteName: 'BookmarkSoft',
    locale: 'en_US',
    type: 'website',
  },
  verification: {
    google: "esa_sH6hOXnX3OmwTH3RuESPhwjUqWX-ipWYJhkx2ZY",
  },
  other: {
    "google-adsense-account": "ca-pub-4257357969102087"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              `,
            }}
          />
        </head>
        <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-50 transition-colors duration-300">
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/20 to-transparent dark:from-blue-900/10 dark:via-[#0B1120] dark:to-[#0B1120]" />
          <AnalyticsProvider gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} clarityId={process.env.NEXT_PUBLIC_CLARITY_ID || ''} />
          <ThemeProvider>
            <AuthProvider>
              <FavoritesProvider>
                <Sidebar />
                <Topbar />
                <main className="xl:ml-64 min-h-screen px-4 pb-4 pt-20 xl:px-8 xl:pb-8 xl:pt-24 flex flex-col">
                  <div className="max-w-7xl mx-auto flex-1 w-full">
                    {children}
                  </div>
                  <Footer />
                </main>
              </FavoritesProvider>
            </AuthProvider>
          </ThemeProvider>
          <CookieConsent />
        </body>
      </html>
    </ClerkProvider>
  );
}
