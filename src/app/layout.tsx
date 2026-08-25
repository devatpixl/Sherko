import type { Metadata, Viewport } from "next";
import { Caveat, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
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

/* Only used inside the simulated handwritten note. */
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nordre.no"),
  title: {
    default: "Nordre — Ordremottak uten regneark",
    template: "%s · Nordre",
  },
  description:
    "Nordre tar imot ordrer på WhatsApp og e-post — fritekst, PDF, Excel eller et bilde av en håndskrevet lapp — matcher dem mot katalogen din og legger inn ordreutkast til godkjenning.",
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
    siteName: "Nordre",
    title: "Nordre — Ordremottak uten regneark",
    description:
      "Kundene sender ordren der de allerede er. Nordre leser den, matcher katalogen og legger inn utkastet. Du godkjenner.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nordre — Ordremottak uten regneark",
    description:
      "AI-ordredesk for grossister. WhatsApp, e-post, PDF, Excel og håndskrevne lapper inn — ordreutkast ut.",
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
  name: "Nordre",
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
    <html lang="nb" className={`${schibsted.variable} ${jbMono.variable} ${caveat.variable}`}>
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
