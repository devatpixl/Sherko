"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { contact } from "@/lib/content";
import { useLocale } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   ⚠️  FRONT END ONLY — this form does not send anything yet.

   handleSubmit fakes a network round-trip and shows the success state.
   Before this goes live, point `deliver()` at a real endpoint (a route
   handler, a form service, whatever you land on) — otherwise the page
   tells people "we'll be in touch" while dropping their details.
   ═══════════════════════════════════════════════════════════════════ */

const EASE = [0.16, 1, 0.3, 1] as const;

type FieldKey = "name" | "company" | "phone" | "email";
type Values = Record<FieldKey, string>;
type Errors = Partial<Record<FieldKey, boolean>>;

const EMPTY: Values = { name: "", company: "", phone: "", email: "" };

/* Deliberately permissive: a form should not argue with someone about the
   shape of their own phone number. We only reject what is obviously wrong. */
const validators: Record<FieldKey, (v: string) => boolean> = {
  name: (v) => v.trim().length >= 2,
  company: (v) => v.trim().length >= 2,
  phone: (v) => (v.replace(/[^\d]/g, "").length >= 8),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
};

const ORDER: FieldKey[] = ["name", "company", "phone", "email"];

const AUTOCOMPLETE: Record<FieldKey, string> = {
  name: "name",
  company: "organization",
  phone: "tel",
  email: "email",
};

const INPUT_TYPE: Record<FieldKey, string> = {
  name: "text",
  company: "text",
  phone: "tel",
  email: "email",
};

function Field({
  fieldKey,
  value,
  invalid,
  onChange,
  onBlur,
}: {
  fieldKey: FieldKey;
  value: string;
  invalid: boolean;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const { locale } = useLocale();
  const [focused, setFocused] = useState(false);
  const id = useId();
  const errId = `${id}-err`;

  const spec = contact.fields[fieldKey];
  const floated = focused || value.length > 0;

  return (
    <div className="relative pt-6">
      {/* The label starts life as the placeholder and rises out of the way. */}
      <motion.label
        htmlFor={id}
        initial={false}
        animate={{
          y: floated ? 0 : 26,
          fontSize: floated ? "0.6875rem" : "1rem",
          letterSpacing: floated ? "0.14em" : "0em",
        }}
        transition={{ duration: 0.28, ease: EASE }}
        className={`pointer-events-none absolute top-0 left-0 origin-left font-mono uppercase transition-colors duration-200 ${
          invalid ? "text-signal" : focused ? "text-accent" : "text-fg-3"
        }`}
      >
        {spec.label[locale]}
      </motion.label>

      <input
        id={id}
        name={fieldKey}
        type={INPUT_TYPE[fieldKey]}
        autoComplete={AUTOCOMPLETE[fieldKey]}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur();
        }}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errId : undefined}
        className="w-full appearance-none rounded-none border-0 bg-transparent pt-1 pb-2.5 text-[1rem] text-fg outline-none placeholder:text-transparent"
      />

      {/* Base rule, then the aurora rule that draws in on focus */}
      <span
        className={`absolute inset-x-0 bottom-0 h-px transition-colors duration-200 ${
          invalid ? "bg-signal/60" : "bg-line-2"
        }`}
      />
      <motion.span
        initial={false}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
      />

      <AnimatePresence>
        {invalid && (
          <motion.p
            id={errId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute -bottom-5 left-0 text-[11.5px] text-signal"
          >
            {spec.error[locale]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactForm() {
  const { locale } = useLocale();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const firstInvalid = useRef<FieldKey | null>(null);

  const set = (k: FieldKey) => (v: string) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    // Clear an error as soon as the field becomes valid — never scold while typing.
    if (errors[k] && validators[k](v)) setErrors((prev) => ({ ...prev, [k]: false }));
  };

  const validateOne = (k: FieldKey) => () => {
    if (values[k].length === 0) return; // don't fault an untouched field on blur
    setErrors((prev) => ({ ...prev, [k]: !validators[k](values[k]) }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state !== "idle") return;

    const next: Errors = {};
    firstInvalid.current = null;
    for (const k of ORDER) {
      const bad = !validators[k](values[k]);
      next[k] = bad;
      if (bad && !firstInvalid.current) firstInvalid.current = k;
    }
    setErrors(next);
    if (firstInvalid.current) {
      document.getElementsByName(firstInvalid.current)[0]?.focus();
      return;
    }

    setState("sending");
    // TODO: replace with a real submission. Nothing is delivered right now.
    await new Promise((r) => setTimeout(r, 900));
    setState("done");
  }

  return (
    <div className="mx-auto mt-12 max-w-xl md:mt-14">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="card p-10 text-center"
          >
            <svg viewBox="0 0 48 48" className="mx-auto h-12 w-12 text-accent" aria-hidden>
              <motion.circle
                cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
              <motion.path
                d="M15 24.5l6.5 6.5L33 19" fill="none" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.25, ease: EASE }}
              />
            </svg>
            <h3 className="display mt-6 text-[1.5rem] text-fg">{contact.success.title[locale]}</h3>
            <p className="lede mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-fg-2">
              {contact.success.body[locale]}
            </p>
            <button
              type="button"
              onClick={() => {
                setValues(EMPTY);
                setErrors({});
                setState("idle");
              }}
              className="mt-7 font-mono text-[11px] tracking-[0.14em] text-fg-3 uppercase underline decoration-line-2 underline-offset-4 transition-colors hover:text-fg"
            >
              {contact.success.again[locale]}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-left"
          >
            <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
              {ORDER.map((k) => (
                <Field
                  key={k}
                  fieldKey={k}
                  value={values[k]}
                  invalid={Boolean(errors[k])}
                  onChange={set(k)}
                  onBlur={validateOne(k)}
                />
              ))}
            </div>

            <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <button
                type="submit"
                disabled={state === "sending"}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-4 text-[0.9375rem] font-medium tracking-tight text-white transition-[transform,background-color] duration-300 hover:scale-[1.02] hover:bg-accent-dim active:scale-[0.99] disabled:cursor-wait disabled:hover:scale-100 sm:w-auto"
              >
                <span className="relative">
                  {state === "sending" ? contact.submitting[locale] : contact.submit[locale]}
                </span>
                {state === "sending" ? (
                  <span className="relative flex gap-1" aria-hidden>
                    {[0, 0.15, 0.3].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1 w-1 rounded-full bg-canvas"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: d }}
                      />
                    ))}
                  </span>
                ) : (
                  <svg viewBox="0 0 16 16" className="relative h-3.5 w-3.5" aria-hidden>
                    <path
                      d="M2 8h11M9 4l4 4-4 4"
                      fill="none" stroke="currentColor" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-[2px]"
                    />
                  </svg>
                )}
              </button>

              <p className="max-w-[18rem] text-center text-[11.5px] leading-[16px] text-fg-4 sm:text-right">
                {contact.privacy[locale]}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
