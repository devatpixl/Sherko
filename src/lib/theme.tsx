"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "sherko.theme";
/* localStorage fires no event in the tab that wrote it, so we raise our own. */
const CHANGE_EVENT = "sherko:theme";

/* Light is the default: the site is read by wholesalers on office screens in
   daylight, and the buyer wants zapier.com's clean white ground. Dark stays as
   the toggle, and is still the look the product's own admin ships in. */
export const DEFAULT_THEME: Theme = "light";

/** Read from the attribute the pre-paint script already set, not from
 *  localStorage, so the store and the DOM can never disagree. */
function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.colorScheme = t;
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* private mode: the toggle still works for this session */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const toggle = useCallback(
    () => setTheme(readTheme() === "dark" ? "light" : "dark"),
    [setTheme],
  );

  return { theme, setTheme, toggle };
}

/**
 * Runs before first paint, so a light-mode visitor never sees a dark flash.
 * Inlined in <head> as a plain string: it must execute before React loads.
 */
export const THEME_INIT_SCRIPT = `
(function(){try{
  var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
  if(t!=="light"&&t!=="dark")t=${JSON.stringify(DEFAULT_THEME)};
  document.documentElement.setAttribute("data-theme",t);
  document.documentElement.style.colorScheme=t;
}catch(e){
  document.documentElement.setAttribute("data-theme",${JSON.stringify(DEFAULT_THEME)});
}})();
`;
