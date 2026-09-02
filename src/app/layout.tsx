import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/lib/i18n";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

/* Geist sets the whole site: the marketing pages and the simulated portal.
   It is the closest open face to the grotesque cursor.com is set in — within
   0.13% on width for the same string — and it is already what the real admin
   portal runs on, so the simulations and the marketing page now agree. */
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
    default: "Sherko - AI-ordredesk for grossister",
    template: "%s · Sherko",
  },
  description:
    "Sherko tar imot ordrer på WhatsApp og e-post, fritekst, PDF, Excel eller et bilde av en håndskrevet lapp, matcher dem mot katalogen din og legger inn ordreutkast til godkjenning.",
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
    title: "Sherko - AI-ordredesk for grossister",
    description:
      "Kundene sender ordren der de allerede er. Sherko leser den, matcher katalogen og legger inn utkastet. Du godkjenner.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sherko - AI-ordredesk for grossister",
    description:
      "Bygget for grossister, ikke for alle. WhatsApp, e-post, PDF, Excel og håndskrevne lapper inn, ordreutkast ut.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#14120B",
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
    "AI order desk for wholesalers. Takes orders on WhatsApp and email, free text, PDF, Excel or a photo of a handwritten note, matches them against your catalogue and files draft orders for human approval.",
  inLanguage: ["nb-NO", "en"],
  author: { "@type": "Organization", name: "Pixl Media", url: "https://pixlmedia.no" },
  offers: { "@type": "Offer", availability: "https://schema.org/PreOrder" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="nb"
      className={`${geist.variable} ${geistMono.variable} ${caveat.variable}`}
      /* THEME_INIT_SCRIPT stamps data-theme and color-scheme on this element
         before React hydrates, so the client tree legitimately carries two
         attributes the server HTML cannot know. The theme is per-visitor
         localStorage, so it can never be rendered on the server. Scoped to
         this element only: children still warn normally. */
      suppressHydrationWarning
    >
      <head>
        {/* Sets data-theme before first paint, so a light-mode visitor never
            sees a dark flash. Must run before React loads, hence inline. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
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
