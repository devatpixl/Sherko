"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Locale = "no" | "en";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
};

const LocaleContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "sherko.locale";
/* localStorage fires no event in the tab that wrote it, so we raise our own. */
const CHANGE_EVENT = "sherko:locale";

/* Norwegian is the default — the buyer is a Norwegian wholesaler. */
const DEFAULT: Locale = "no";

function readLocale(): Locale {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "en" || v === "no" ? v : DEFAULT;
  } catch {
    // Private mode or blocked storage — the default stands.
    return DEFAULT;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  /* localStorage *is* the store. Server renders Norwegian; the client
     re-renders with the stored preference right after hydration. */
  const locale = useSyncExternalStore(subscribe, readLocale, () => DEFAULT);

  const setLocale = useCallback((l: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* non-fatal — the toggle still works for this render pass */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const toggle = useCallback(
    () => setLocale(locale === "no" ? "en" : "no"),
    [locale, setLocale],
  );

  /* Keep the document language in sync for screen readers and hyphenation. */
  useEffect(() => {
    document.documentElement.lang = locale === "no" ? "nb" : "en";
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggle }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}

/** Pick the active side of a bilingual pair. */
export type Bi<T = string> = { no: T; en: T };

export function useT() {
  const { locale } = useLocale();
  return useCallback(<T,>(pair: Bi<T>): T => pair[locale], [locale]);
}
