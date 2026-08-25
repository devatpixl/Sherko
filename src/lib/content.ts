import type { Bi } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   All site copy, bilingual. Norwegian is the primary voice — it was
   written first and English is the translation, not the other way
   round, so the Norwegian never reads like a machine turned it over.
   ═══════════════════════════════════════════════════════════════════ */

export const brand = {
  name: "Nordre",
  /* The logotype splits so the word ORDRE hiding inside the name is
     visible: N·ORDRE. That is the whole brand idea in one glyph. */
  markPrefix: "N",
  markStem: "ordre",
  parent: "Pixl Media",
};

export const nav: { id: string; label: Bi }[] = [
  { id: "hvordan", label: { no: "Slik virker det", en: "How it works" } },
  { id: "kanaler", label: { no: "Kanaler", en: "Channels" } },
  { id: "kapasiteter", label: { no: "Hva den gjør", en: "What it does" } },
  { id: "kontroll", label: { no: "Kontroll", en: "Control" } },
];

export const cta = {
  primary: { no: "Book en demo", en: "Book a demo" },
  secondary: { no: "Se den jobbe", en: "Watch it work" },
  login: { no: "Logg inn", en: "Log in" },
};

/* ── Hero ─────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: {
    no: "AI-ordredesk for grossister",
    en: "AI order desk for wholesalers",
  },
  /* Line 2 carries the aurora gradient.
     Both lines are deliberately short words — a single long word cannot wrap
     and would overflow the column into the panel beside it. */
  headline: {
    l1: { no: "Ordrer som", en: "Orders that" },
    l2: { no: "fyller seg selv.", en: "fill themselves in." },
  },
  lede: {
    no: "Melding, PDF, Excel eller et bilde av en lapp. Nordre leser det og fyller ut ordren.",
    en: "A message, a PDF, an Excel sheet or a photo of a note. Nordre reads it and fills in the order.",
  },
  ledeEmphasis: { no: "Du godkjenner.", en: "You approve." },
  footnote: {
    no: "Ingen app å laste ned. Ingen mal å fylle ut.",
    en: "No app to install. No template to fill in.",
  },
};

/* ── Channel strip ────────────────────────────────────────────────── */

export const channels = {
  eyebrow: { no: "Kanaler inn", en: "Inbound channels" },
  title: {
    no: "Ordren kommer som kunden vil sende den",
    en: "The order arrives however the customer wants to send it",
  },
  body: {
    no: "Grossistkunder bestiller ikke i et skjema. De sender en melding klokka 22, videresender en e-post fra kjøkkensjefen, eller knipser et bilde av lappen på oppslagstavla. Nordre tar imot alt sammen.",
    en: "Wholesale customers do not order through a form. They fire off a message at 10pm, forward an email from the head chef, or snap a photo of the note on the noticeboard. Nordre takes all of it.",
  },
  items: [
    {
      key: "whatsapp",
      label: { no: "WhatsApp", en: "WhatsApp" },
      note: { no: "Tekst, tale, bilde, dokument", en: "Text, voice, image, document" },
    },
    {
      key: "email",
      label: { no: "E-post", en: "Email" },
      note: { no: "Videresendt eller sendt direkte", en: "Forwarded or sent direct" },
    },
    {
      key: "pdf",
      label: { no: "PDF", en: "PDF" },
      note: { no: "Digital eller skannet", en: "Digital or scanned" },
    },
    {
      key: "excel",
      label: { no: "Excel", en: "Excel" },
      note: { no: "Hvilket som helst oppsett", en: "Any layout" },
    },
    {
      key: "photo",
      label: { no: "Foto", en: "Photo" },
      note: { no: "Håndskrift, tavle, kvittering", en: "Handwriting, whiteboard, receipt" },
    },
    {
      key: "text",
      label: { no: "Fritekst", en: "Free text" },
      note: { no: "Slik folk faktisk skriver", en: "The way people actually write" },
    },
  ],
};

/* ── Problem ──────────────────────────────────────────────────────── */

export const problem = {
  eyebrow: { no: "Problemet", en: "The problem" },
  title: {
    no: "Ordren er allerede skrevet. Noen skriver den bare inn på nytt.",
    en: "The order is already written. Someone just types it in again.",
  },
  body: {
    no: "Ingen grossist mangler bestillinger. De mangler timene det tar å flytte dem fra en melding til et system — og de tåler ikke feilene som oppstår underveis.",
    en: "No wholesaler is short of orders. They are short of the hours it takes to move them from a message into a system — and they cannot afford the mistakes made on the way.",
  },
  before: {
    label: { no: "I dag", en: "Today" },
    rows: [
      { no: "Melding kommer 22:14 på en søndag", en: "Message lands 22:14 on a Sunday" },
      { no: "Leses mandag morgen", en: "Read Monday morning" },
      { no: "Tastes inn i regnearket for hånd", en: "Retyped into the spreadsheet by hand" },
      { no: "«Mente de 500 g eller 1 kg?»", en: "“Did they mean 500 g or 1 kg?”" },
      { no: "Ringer kunden tilbake", en: "Call the customer back" },
      { no: "Regnearket limes inn i ERP", en: "Spreadsheet pasted into the ERP" },
    ],
  },
  after: {
    label: { no: "Med Nordre", en: "With Nordre" },
    rows: [
      { no: "Melding kommer 22:14 på en søndag", en: "Message lands 22:14 on a Sunday" },
      { no: "Lest og forstått på sekunder", en: "Read and understood in seconds" },
      { no: "Kunde og varelinjer slått opp i katalogen", en: "Customer and lines resolved against the catalogue" },
      { no: "Uklar linje? Nordre spør kunden med én gang", en: "Line unclear? Nordre asks the customer right away" },
      { no: "Ordreutkast ligger klart", en: "Draft order waiting" },
      { no: "Du godkjenner mandag. Ett klikk.", en: "You approve Monday. One click." },
    ],
  },
};

/* ── How it works ─────────────────────────────────────────────────── */

export const how = {
  eyebrow: { no: "Slik virker det", en: "How it works" },
  title: {
    no: "Fire steg. Det siste er ditt.",
    en: "Four steps. The last one is yours.",
  },
  steps: [
    {
      n: "01",
      key: "mottar",
      title: { no: "Tar imot", en: "Receives" },
      body: {
        no: "Nordre lytter på WhatsApp-nummeret og ordre-innboksen din. Døgnet rundt — også når bestillingen kommer klokka 22 på en søndag.",
        en: "Nordre listens on your WhatsApp number and your order inbox. Around the clock — including when the order comes in at 10pm on a Sunday.",
      },
    },
    {
      n: "02",
      key: "leser",
      title: { no: "Leser", en: "Reads" },
      body: {
        no: "Fritekst, PDF, Excel eller et bilde av en håndskrevet lapp. Vedlegget leses direkte, som det er — ingen mal kunden må følge, ingen skjema de må fylle ut.",
        en: "Free text, a PDF, an Excel sheet or a photo of a handwritten note. The attachment is read directly, as it is — no template the customer has to follow, no form to fill in.",
      },
    },
    {
      n: "03",
      key: "matcher",
      title: { no: "Matcher", en: "Matches" },
      body: {
        no: "Hver linje slås opp mot din faktiske katalog — varenummer, merke, leverandør, pakningsstørrelse. Er to varer like nok til å forveksles, gjetter den ikke. Da spør den.",
        en: "Every line is resolved against your real catalogue — article number, brand, supplier, pack size. If two products are close enough to confuse, it does not guess. It asks.",
      },
    },
    {
      n: "04",
      key: "utkast",
      title: { no: "Legger inn utkast", en: "Files a draft" },
      body: {
        no: "Ordren opprettes som utkast med status «venter på godkjenning». Kunden får en kvittering på hva som er forstått. Du tar den siste avgjørelsen.",
        en: "The order is created as a draft marked “pending approval”. The customer gets a receipt of exactly what was understood. You make the final call.",
      },
    },
  ],
};

/* ── Capabilities ─────────────────────────────────────────────────── */

export const capabilities = {
  eyebrow: { no: "Hva den gjør", en: "What it does" },
  title: {
    no: "En kollega på ordredesken, ikke en chatbot",
    en: "A colleague on the order desk, not a chatbot",
  },
  body: {
    no: "Nordre er bygget rundt én jobb — å få ordren riktig inn i systemet — og alt den kan, tjener den jobben.",
    en: "Nordre is built around one job — getting the order into the system correctly — and everything it does serves that job.",
  },
  tiles: [
    {
      key: "intake",
      span: "lg",
      title: { no: "Ordremottak", en: "Order intake" },
      body: {
        no: "Fra melding til ordreutkast uten et eneste tastetrykk. Nordre viser alltid hva den har forstått og venter på et ja før den legger noe inn.",
        en: "From message to draft order without a single keystroke. Nordre always shows what it understood and waits for a yes before filing anything.",
      },
    },
    {
      key: "documents",
      span: "sm",
      title: { no: "Dokumentlesing", en: "Document reading" },
      body: {
        no: "PDF, Excel og foto leses direkte — også skannede ark og håndskrift.",
        en: "PDFs, Excel and photos are read directly — including scanned sheets and handwriting.",
      },
    },
    {
      key: "matching",
      span: "sm",
      title: { no: "Katalogmatching", en: "Catalogue matching" },
      body: {
        no: "Varenummer, merke og pakningsstørrelse veies opp mot hverandre før en linje låses.",
        en: "Article number, brand and pack size are weighed against each other before a line is locked.",
      },
    },
    {
      key: "stats",
      span: "sm",
      title: { no: "Tall på sparket", en: "Numbers on demand" },
      body: {
        no: "«Hva er omsetningen denne uka?» Svar hentet fra dine data — aldri anslått.",
        en: "“What is revenue this week?” Answers pulled from your data — never estimated.",
      },
    },
    {
      key: "feed",
      span: "sm",
      title: { no: "Aktivitetsfeed", en: "Activity feed" },
      body: {
        no: "«Hva kom inn sist?» Hele ordredesken oppsummert i én melding.",
        en: "“What came in last?” The whole order desk summarised in one message.",
      },
    },
    {
      key: "bilingual",
      span: "md",
      title: { no: "Norsk og engelsk", en: "Norwegian and English" },
      body: {
        no: "Språket oppdages fra meldingen og holdes gjennom hele samtalen. Skriver kunden på engelsk, svarer Nordre på engelsk.",
        en: "The language is detected from the message and held for the whole conversation. If the customer writes in English, Nordre answers in English.",
      },
    },
  ],
};

/* ── Control / human in the loop ──────────────────────────────────── */

export const control = {
  eyebrow: { no: "Kontroll", en: "Control" },
  title: {
    no: "Nordre godkjenner aldri en ordre",
    en: "Nordre never approves an order",
  },
  body: {
    no: "Det er ikke en innstilling du kan skru av. Det er slik systemet er bygget — fordi en feilsendt pall koster mer enn de minuttene den skulle spare.",
    en: "That is not a setting you can switch off. It is how the system is built — because one pallet sent to the wrong place costs more than the minutes it was meant to save.",
  },
  guarantees: [
    {
      key: "draft",
      title: { no: "Alltid utkast", en: "Always a draft" },
      body: {
        no: "Hver ordre opprettes med status «venter på godkjenning». Uten unntak.",
        en: "Every order is created with the status “pending approval”. Without exception.",
      },
    },
    {
      key: "stock",
      title: { no: "Rører aldri lager", en: "Never touches stock" },
      body: {
        no: "Nordre kan ikke reservere, plukke eller sende. Den skriver et utkast, ingenting mer.",
        en: "Nordre cannot reserve, pick or ship. It writes a draft, nothing more.",
      },
    },
    {
      key: "ask",
      title: { no: "Spør heller enn å gjette", en: "Asks rather than guesses" },
      body: {
        no: "Er den i tvil, stiller den ett konkret spørsmål med navngitte alternativer — aldri «kan du presisere».",
        en: "In doubt, it asks one concrete question naming the actual options — never “could you clarify”.",
      },
    },
    {
      key: "grounded",
      title: { no: "Finner aldri på", en: "Never invents" },
      body: {
        no: "Hver vare, pris og kunde kommer fra et faktisk oppslag i systemet ditt. Fant den ingenting, sier den det.",
        en: "Every product, price and customer comes from a real lookup in your system. If it found nothing, it says so.",
      },
    },
    {
      key: "honest",
      title: { no: "Ærlig om hva den er", en: "Honest about what it is" },
      body: {
        no: "Spør kunden om de snakker med en robot, svarer Nordre ja. Hver gang.",
        en: "If a customer asks whether they are talking to a bot, Nordre says yes. Every time.",
      },
    },
    {
      key: "destructive",
      title: { no: "Bekreftelse før endring", en: "Confirmation before changes" },
      body: {
        no: "Endre, slette eller kansellere en ordre krever et uttrykkelig ja fra et menneske først.",
        en: "Editing, deleting or cancelling an order requires an explicit yes from a human first.",
      },
    },
  ],
};

/* ── Facts (capability facts, not invented customer results) ──────── */

export const facts = [
  {
    value: "24/7",
    label: { no: "Ordredesken er åpen", en: "The order desk is open" },
    note: { no: "Også søndag 22:14", en: "Sundays at 22:14 included" },
  },
  {
    value: "0",
    label: { no: "Auto-godkjente ordrer", en: "Auto-approved orders" },
    note: { no: "Et menneske godkjenner alltid", en: "A human always approves" },
  },
  {
    value: "6",
    label: { no: "Formater inn", en: "Inbound formats" },
    note: { no: "Tekst, PDF, Excel, foto, e-post, CSV", en: "Text, PDF, Excel, photo, email, CSV" },
  },
  {
    value: "2",
    label: { no: "Språk, automatisk", en: "Languages, automatic" },
    note: { no: "Norsk og engelsk", en: "Norwegian and English" },
  },
];

/* ── Integrations ─────────────────────────────────────────────────── */

export const integrations = {
  eyebrow: { no: "Integrasjoner", en: "Integrations" },
  title: {
    no: "Legger seg oppå systemet du allerede har",
    en: "Sits on top of the system you already run",
  },
  body: {
    no: "Nordre er ikke et nytt ERP. Den er laget for å snakke med det du kjører i dag, over API — og skrive ordreutkast rett inn der ordrene dine allerede bor.",
    en: "Nordre is not another ERP. It is built to talk to what you run today, over an API — and to write draft orders straight into wherever your orders already live.",
  },
  items: [
    { key: "whatsapp", name: { no: "WhatsApp Business", en: "WhatsApp Business" }, note: { no: "Ditt eget nummer", en: "Your own number" } },
    { key: "outlook", name: { no: "Microsoft 365", en: "Microsoft 365" }, note: { no: "Ordre-innboksen", en: "The order inbox" } },
    { key: "erp", name: { no: "ERP / ordresystem", en: "ERP / order system" }, note: { no: "Via REST", en: "Over REST" } },
    { key: "catalog", name: { no: "Vare- og kunderegister", en: "Product & customer registry" }, note: { no: "Sanntidsoppslag", en: "Live lookups" } },
    { key: "accounting", name: { no: "Regnskap", en: "Accounting" }, note: { no: "Prisavtaler respekteres", en: "Price agreements respected" } },
    { key: "api", name: { no: "Eget API", en: "Your own API" }, note: { no: "Vi bygger koblingen", en: "We build the connector" } },
  ],
};

/* ── FAQ ──────────────────────────────────────────────────────────── */

export const faq = {
  eyebrow: { no: "Spørsmål", en: "Questions" },
  title: { no: "Det folk spør om først", en: "What people ask first" },
  items: [
    {
      q: { no: "Hva om den forstår ordren feil?", en: "What if it misreads the order?" },
      a: {
        no: "Da fanger du det opp før noe skjer. Nordre viser alltid kunden hva den har forstått — linje for linje, med antall og enhet — og legger ingenting inn før kunden sier ja. Deretter ligger ordren som utkast til du godkjenner den. Det er to menneskelige sjekkpunkter før noe blir reelt.",
        en: "You catch it before anything happens. Nordre always shows the customer what it understood — line by line, with quantity and unit — and files nothing until the customer says yes. After that the order sits as a draft until you approve it. That is two human checkpoints before anything becomes real.",
      },
    },
    {
      q: { no: "Må kundene våre lære seg noe nytt?", en: "Do our customers have to learn anything new?" },
      a: {
        no: "Nei. De sender bestillingen akkurat som i dag — samme WhatsApp-nummer, samme e-postadresse, samme rotete format. Hele poenget er at endringen skjer på din side, ikke deres.",
        en: "No. They send the order exactly as they do today — same WhatsApp number, same email address, same messy format. The entire point is that the change happens on your side, not theirs.",
      },
    },
    {
      q: { no: "Leser den virkelig håndskrift?", en: "Does it really read handwriting?" },
      a: {
        no: "Ja. Et bilde av en håndskrevet lapp, en tavle eller et utfylt ordreskjema leses direkte som bilde — ikke gjennom et tekstuttrekk som mister halvparten. Er skriften uleselig på en linje, gjetter den ikke: den viser deg linjen og spør.",
        en: "Yes. A photo of a handwritten note, a whiteboard or a filled-in order form is read directly as an image — not through a text extraction step that loses half of it. If one line is genuinely illegible it does not guess: it shows you the line and asks.",
      },
    },
    {
      q: { no: "Hvor havner dataene våre?", en: "Where does our data go?" },
      a: {
        no: "Ordrene skrives inn i ditt eget system over API. Nordre holder sin egen samtaletilstand i din database, i et eget skjema. Vi setter opp tjenesten på infrastruktur du er komfortabel med, og går gjennom databehandleravtale og oppbevaring før noe settes i drift.",
        en: "Orders are written into your own system over an API. Nordre keeps its own conversation state in your database, in a schema of its own. We deploy on infrastructure you are comfortable with, and we work through the data processing agreement and retention rules before anything goes live.",
      },
    },
    {
      q: { no: "Hva om den ikke finner varen?", en: "What if it cannot find the product?" },
      a: {
        no: "Da prøver den et annet søk — merkenavn, varenummer, et mer treffende ord — før den gir seg. Finner den fortsatt ingenting, legger den inn resten av ordren og flagger den ene linja tydelig, slik at en kollega legger den til manuelt. Én uklar linje stopper aldri hele ordren.",
        en: "It tries a different search — the brand, the article number, a more distinctive word — before giving up. If it still finds nothing, it files the rest of the order and flags that one line clearly so a colleague can add it manually. One unclear line never blocks the whole order.",
      },
    },
    {
      q: { no: "Hvor lang tid tar det å komme i gang?", en: "How long does it take to get going?" },
      a: {
        no: "Det avhenger av hvor tilgjengelig vare- og kunderegisteret ditt er. Har du et API vi kan lese fra, snakker vi uker, ikke måneder. Vi starter alltid med å kjøre Nordre i skyggen på ekte innkommende ordrer, så du ser treffsikkerheten før den svarer en eneste kunde.",
        en: "It depends on how reachable your product and customer registry is. If there is an API we can read, we are talking weeks rather than months. We always start by running Nordre in shadow mode on real incoming orders, so you see its accuracy before it replies to a single customer.",
      },
    },
  ],
};

/* ── Closing CTA ──────────────────────────────────────────────────── */

export const closing = {
  eyebrow: { no: "Neste steg", en: "Next step" },
  title: {
    no: "Send oss en ordre du fikk i går",
    en: "Send us an order you got yesterday",
  },
  body: {
    no: "Den rotete meldingen, den uskarpe lappen, det Excel-arket ingen klarer å lese. Vi kjører den gjennom Nordre og viser deg nøyaktig hva den fikk ut av den — på et tjue minutters møte, uten at du har koblet opp noe som helst.",
    en: "The messy message, the blurry note, the Excel sheet nobody can read. We run it through Nordre and show you exactly what it made of it — in a twenty minute call, with nothing connected on your side.",
  },
  reassure: {
    no: "Tjue minutter. Ingen integrasjon. Din egen ordre.",
    en: "Twenty minutes. No integration. Your own order.",
  },
};

/* ── Contact form ─────────────────────────────────────────────────── */

export const contact = {
  fields: {
    name: {
      label: { no: "Navn", en: "Name" },
      error: { no: "Skriv inn navnet ditt", en: "Please enter your name" },
    },
    company: {
      label: { no: "Bedrift", en: "Company" },
      error: { no: "Skriv inn bedriftsnavnet", en: "Please enter your company" },
    },
    phone: {
      label: { no: "Telefon", en: "Phone" },
      error: { no: "Skriv inn et gyldig telefonnummer", en: "Please enter a valid phone number" },
    },
    email: {
      label: { no: "E-post", en: "Email" },
      error: { no: "Skriv inn en gyldig e-postadresse", en: "Please enter a valid email address" },
    },
  },
  submit: { no: "Book en demo", en: "Book a demo" },
  submitting: { no: "Sender", en: "Sending" },
  success: {
    title: { no: "Takk — vi tar kontakt.", en: "Thank you — we'll be in touch." },
    body: {
      no: "Vi svarer normalt innen én arbeidsdag. Ha gjerne en ordre klar som vi kan kjøre gjennom.",
      en: "We normally reply within one working day. Have an order ready for us to run through if you can.",
    },
    again: { no: "Send en til", en: "Send another" },
  },
  privacy: {
    no: "Vi bruker opplysningene kun til å ta kontakt om Nordre.",
    en: "We use these details only to contact you about Nordre.",
  },
};

export const footer = {
  tagline: {
    no: "Ordremottak uten regneark.",
    en: "Order intake without spreadsheets.",
  },
  builtBy: { no: "Et produkt fra", en: "A product by" },
  columns: [
    {
      title: { no: "Produkt", en: "Product" },
      links: [
        { label: { no: "Slik virker det", en: "How it works" }, href: "#hvordan" },
        { label: { no: "Kanaler", en: "Channels" }, href: "#kanaler" },
        { label: { no: "Hva den gjør", en: "What it does" }, href: "#kapasiteter" },
        { label: { no: "Kontroll", en: "Control" }, href: "#kontroll" },
      ],
    },
    {
      title: { no: "Selskap", en: "Company" },
      links: [
        { label: { no: "Om Pixl Media", en: "About Pixl Media" }, href: "#" },
        { label: { no: "Kontakt", en: "Contact" }, href: "#kontakt" },
        { label: { no: "Personvern", en: "Privacy" }, href: "#" },
        { label: { no: "Vilkår", en: "Terms" }, href: "#" },
      ],
    },
  ],
  rights: { no: "Alle rettigheter forbeholdt.", en: "All rights reserved." },
};
