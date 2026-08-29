import type { Metadata, Viewport } from "next";
import {
  Caveat,
  Geist,
  Geist_Mono,
  JetBrains_Mono,
  Schibsted_Grotesk,
} from "next/font/google";
import { LocaleProvider } from "@/lib/i18n";
import "./globals.css";

/* Schibsted Grotesk is a Norwegian typeface — the right provenance for a
   product sold to Norwegian wholesalers, and a better display face than
   the usual Inter default. */
const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
  weight: ["400", "500"],
});

/* Geist is what the real admin portal runs on. Used only inside the
   simulated portal, so those screens are set in the product's own type
   rather than the marketing site's. */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/* Only used inside the simulated handwritten note. */
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sherko.no"),
  title: {
    default: "Sherko — AI-ordredesk for grossister",
    template: "%s · Sherko",
  },
  description:
    "Sherko tar imot ordrer på WhatsApp og e-post — fritekst, PDF, Excel eller et bilde av en håndskrevet lapp — matcher dem mot katalogen din og legger inn ordreutkast til godkjenning.",
  keywords: [
    "ordremottak",
    "AI ordredesk",
    "grossist",
    "WhatsApp ordre",
    "ordrebehandling",
    "order intake automation",
  ],
  openGraph: {
    type: "website",
    locale: "nb_NO",
    alternateLocale: ["en_US"],
    siteName: "Sherko",
    title: "Sherko — AI-ordredesk for grossister",
    description:
      "Kundene sender ordren der de allerede er. Sherko leser den, matcher katalogen og legger inn utkastet. Du godkjenner.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sherko — AI-ordredesk for grossister",
    description:
      "Bygget for grossister, ikke for alle. WhatsApp, e-post, PDF, Excel og håndskrevne lapper inn — ordreutkast ut.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07080A",
  colorScheme: "dark",
};


/* Structured data — helps the product show up as a product, not a blog post. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sherko",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, WhatsApp, Email",
  description:
    "AI order desk for wholesalers. Takes orders on WhatsApp and email — free text, PDF, Excel or a photo of a handwritten note — matches them against your catalogue and files draft orders for human approval.",
  inLanguage: ["nb-NO", "en"],
  author: { "@type": "Organization", name: "Pixl Media", url: "https://pixlmedia.no" },
  offers: { "@type": "Offer", availability: "https://schema.org/PreOrder" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="nb"
      className={`${schibsted.variable} ${jbMono.variable} ${caveat.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
