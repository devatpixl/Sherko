"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { HandwrittenNote } from "@/components/hero/HandwrittenNote";
import {
  ChevronBack,
  IconCall,
  IconCamera,
  IconClip,
  IconEmoji,
  IconKebab,
  IconMic,
  IconSend,
  IconVideo,
  TailIn,
  TailOut,
  TickDouble,
  TickSingle,
} from "@/components/hero/WhatsAppIcons";
import type { ChatItem, ChatView, Tick } from "@/lib/chatScript";
import { useLocale } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════════════════
   Device geometry.

   Real iPhone 16 Pro logical size is 402 × 874 (ratio 2.174). At the width
   a hero can actually afford, a faithful ratio makes the phone taller than
   most viewports, so the screen is 340 × 700 (ratio 2.06) — a hair shorter,
   which nobody reads as wrong, and it keeps the WhatsApp UI at its native
   pixel sizes so the chat stays legible instead of being scaled down.
   ═══════════════════════════════════════════════════════════════════ */
const SCREEN_W = 340;
const SCREEN_H = 700;
const SCREEN_R = 52;
const BEZEL = 12;

const spring = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.9 };

/* ── Ticks ────────────────────────────────────────────────────────── */

function Ticks({ tick, onImage = false }: { tick?: Tick; onImage?: boolean }) {
  if (!tick) return null;
  const read = tick === "read";
  const color = read ? "text-[#53BDEB]" : onImage ? "text-white/90" : "text-[#E9EDEF]/60";
  return (
    <span className={`ml-[3px] inline-flex translate-y-[2px] ${color}`}>
      {tick === "sent" ? <TickSingle /> : <TickDouble />}
    </span>
  );
}

function Meta({
  time,
  tick,
  onImage = false,
}: {
  time: string;
  tick?: Tick;
  onImage?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center text-[11px] leading-[15px] ${
        onImage ? "text-white/95" : "text-[#E9EDEF]/55"
      }`}
    >
      {time}
      <Ticks tick={tick} onImage={onImage} />
    </span>
  );
}

/* ── Bubble shell ─────────────────────────────────────────────────── */

function Bubble({
  from,
  children,
  className = "",
  padded = true,
}: {
  from: "customer" | "nordre";
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  const out = from === "customer";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      className={`flex ${out ? "justify-end pr-2" : "justify-start pl-2"}`}
    >
      <div
        className={`relative max-w-[82%] rounded-[7.5px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
          out ? "rounded-tr-none" : "rounded-tl-none"
        } ${padded ? "px-[9px] pt-[6px] pb-[8px]" : "p-[3px]"} ${className}`}
        style={{ color: out ? "#005C4B" : "#1F2C34", background: out ? "#005C4B" : "#1F2C34" }}
      >
        {/* Tail hangs off the TOP corner — the detail most clones get wrong */}
        {out ? (
          <TailOut className="absolute top-0 -right-[8px]" />
        ) : (
          <TailIn className="absolute top-0 -left-[8px]" />
        )}
        <div className="relative text-[#E9EDEF]">{children}</div>
      </div>
    </motion.div>
  );
}

/* ── Message kinds ────────────────────────────────────────────────── */

function TextMessage({ item, tick }: { item: Extract<ChatItem, { kind: "text" }>; tick?: Tick }) {
  const { locale } = useLocale();
  return (
    <Bubble from={item.from}>
      <p className="text-[15px] leading-[20px] whitespace-pre-wrap">
        {item.text[locale]}
        {/* Zero-width spacer reserves room so the timestamp never collides */}
        <span className="inline-block w-[62px]" aria-hidden />
      </p>
      <span className="absolute right-[9px] bottom-[6px]">
        <Meta time={item.time} tick={tick} />
      </span>
    </Bubble>
  );
}

function PhotoMessage({
  item,
  tick,
  ocr,
}: {
  item: Extract<ChatItem, { kind: "photo" }>;
  tick?: Tick;
  ocr: boolean;
}) {
  const { locale } = useLocale();
  return (
    <Bubble from={item.from} padded={false}>
      <div className="w-[196px]">
        <div className="relative overflow-hidden rounded-[6px]">
          <HandwrittenNote ocr={ocr} />
        </div>
        <div className="relative px-[6px] pt-[5px] pb-[3px]">
          <p className="pr-[62px] text-[14px] leading-[19px]">{item.caption[locale]}</p>
          <span className="absolute right-[6px] bottom-[3px]">
            <Meta time={item.time} tick={tick} />
          </span>
        </div>
      </div>
    </Bubble>
  );
}

function OrderMessage({ item }: { item: Extract<ChatItem, { kind: "order" }> }) {
  const { locale } = useLocale();
  return (
    <Bubble from={item.from}>
      <div className="w-[236px]">
        <p className="text-[15px] leading-[20px]">{item.intro[locale]}</p>

        <ul className="mt-[7px] space-y-[3px]">
          {item.lines.map((l, i) => (
            <motion.li
              key={l.name[locale]}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 + i * 0.14, ...spring }}
              className="flex gap-[6px] text-[15px] leading-[20px]"
            >
              <span className="text-[#E9EDEF]/50 tabular-nums">{i + 1}.</span>
              <span className="flex-1">
                {l.name[locale]}
                {l.flagged && <span className="ml-1 text-[#F0B849]">(?)</span>}
              </span>
              <span className="shrink-0 font-medium">{l.qty[locale]}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-[8px] space-y-[1px] border-t border-[#E9EDEF]/10 pt-[7px]">
          {item.meta.map((m) => (
            <p key={m.label[locale]} className="text-[13.5px] leading-[18px] text-[#E9EDEF]/70">
              {m.label[locale]}: <span className="text-[#E9EDEF]">{m.value[locale]}</span>
            </p>
          ))}
        </div>

        <p className="mt-[8px] pr-[52px] text-[15px] leading-[20px]">{item.question[locale]}</p>
        <span className="absolute right-[9px] bottom-[6px]">
          <Meta time={item.time} />
        </span>
      </div>
    </Bubble>
  );
}

function ReceiptMessage({ item }: { item: Extract<ChatItem, { kind: "receipt" }> }) {
  const { locale } = useLocale();
  return (
    <Bubble from={item.from}>
      <div className="w-[228px]">
        <p className="text-[15px] leading-[20px]">
          <span className="mr-1">✅</span>
          {item.intro[locale]}
        </p>

        {/* The draft-order chip: the moment the whole product is about */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, ...spring }}
          className="mt-[8px] rounded-[6px] border border-[#25D366]/25 bg-[#0B141A]/55 px-[9px] py-[7px]"
        >
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] tracking-wider text-[#E9EDEF]/55 uppercase">
              {locale === "no" ? "Ordrenr" : "Order no"}
            </span>
            <span className="font-mono text-[14px] font-medium tracking-tight">#{item.orderNo}</span>
          </div>
          <div className="mt-[5px] flex items-center gap-[6px]">
            <span className="relative flex h-[6px] w-[6px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F0B849] opacity-70" />
              <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-[#F0B849]" />
            </span>
            <span className="text-[12.5px] leading-[16px] text-[#F0B849]">{item.status[locale]}</span>
          </div>
        </motion.div>

        <p className="mt-[8px] pr-[62px] text-[15px] leading-[20px]">{item.tail[locale]}</p>
        <span className="absolute right-[9px] bottom-[6px]">
          <Meta time={item.time} />
        </span>
      </div>
    </Bubble>
  );
}

function TypingBubble() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.9 }}
      transition={spring}
      className="flex justify-start pl-2"
    >
      <div
        className="relative rounded-[7.5px] rounded-tl-none px-[14px] py-[12px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]"
        style={{ color: "#1F2C34", background: "#1F2C34" }}
      >
        <TailIn className="absolute top-0 -left-[8px]" />
        <div className="flex items-center gap-[5px]">
          {[0, 0.2, 0.4].map((d) => (
            <span
              key={d}
              className="wa-dot h-[7px] w-[7px] rounded-full bg-[#8696A0]"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Chrome ───────────────────────────────────────────────────────── */

function StatusBar() {
  const { locale } = useLocale();
  return (
    <div className="relative flex h-[51px] shrink-0 items-end justify-between px-[26px] pb-[7px] text-[#E9EDEF]">
      <span className="text-[15px] font-semibold tracking-tight tabular-nums">22:17</span>
      {/* Dynamic Island */}
      <div
        className="absolute top-[10px] left-1/2 h-[31px] w-[107px] -translate-x-1/2 rounded-full bg-black"
        aria-hidden
      />
      <div className="flex items-center gap-[5px]" aria-label={locale === "no" ? "Status" : "Status"}>
        {/* Signal */}
        <svg viewBox="0 0 18 12" width="17" height="11" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 4.5}
              y={9 - i * 3}
              width="3"
              height={3 + i * 3}
              rx="0.8"
              fill="currentColor"
              opacity={i === 3 ? 0.35 : 1}
            />
          ))}
        </svg>
        {/* Wi-Fi */}
        <svg viewBox="0 0 16 12" width="15" height="11" aria-hidden>
          <path
            d="M8 10.6l1.9-2.3a2.9 2.9 0 0 0-3.8 0L8 10.6zM8 5.2c1.6 0 3.1.6 4.2 1.6l1.4-1.7A8.4 8.4 0 0 0 8 3a8.4 8.4 0 0 0-5.6 2.1l1.4 1.7A6.3 6.3 0 0 1 8 5.2z"
            fill="currentColor"
          />
        </svg>
        {/* Battery */}
        <svg viewBox="0 0 26 12" width="25" height="11" aria-hidden>
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" fill="none" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="15" height="8" rx="1.9" fill="currentColor" />
          <path d="M23.2 4.2v3.6a2 2 0 0 0 0-3.6z" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

function ChatHeader() {
  const { locale } = useLocale();
  return (
    <div className="flex h-[56px] shrink-0 items-center bg-[#1F2C34] pr-[14px] pl-[8px]">
      <ChevronBack className="shrink-0 text-[#E9EDEF]" />
      <div className="relative ml-[4px] shrink-0">
        <div className="grid h-[40px] w-[40px] place-items-center overflow-hidden rounded-full bg-linear-to-br from-[#5CE1B0] to-[#2E9E77]">
          <span className="font-display text-[17px] font-semibold text-[#041710]">N</span>
        </div>
        <span className="absolute right-0 bottom-0 h-[10px] w-[10px] rounded-full border-2 border-[#1F2C34] bg-[#25D366]" />
      </div>
      <div className="ml-[12px] min-w-0 flex-1">
        <p className="truncate text-[16px] leading-[21px] font-medium text-[#E9EDEF]">Nordre</p>
        <p className="truncate text-[12.5px] leading-[16px] text-[#8696A0]">
          {locale === "no" ? "ordredesk · på nett" : "order desk · online"}
        </p>
      </div>
      <div className="flex items-center gap-[22px] text-[#E9EDEF]">
        <IconVideo />
        <IconCall />
        <IconKebab />
      </div>
    </div>
  );
}

function Composer({ text, done }: { text: string; done: boolean }) {
  const { locale } = useLocale();
  const empty = text.length === 0;
  return (
    <div className="flex min-h-[62px] shrink-0 items-end gap-[8px] bg-[#111B21] px-[8px] pt-[8px] pb-[10px]">
      <div className="flex min-h-[44px] flex-1 items-center gap-[10px] rounded-[22px] bg-[#2A3942] px-[12px] py-[10px]">
        <IconEmoji className="shrink-0 text-[#8696A0]" />
        <p className="min-w-0 flex-1 truncate text-[15px] leading-[20px] text-[#E9EDEF]">
          {empty ? (
            <span className="text-[#8696A0]">{locale === "no" ? "Melding" : "Message"}</span>
          ) : (
            <>
              {text}
              {!done && <span className="caret ml-[1px] inline-block w-[1.5px] bg-[#00A884] align-middle">&nbsp;</span>}
            </>
          )}
        </p>
        <IconClip className="shrink-0 text-[#8696A0]" />
        <IconCamera className="shrink-0 text-[#8696A0]" />
      </div>
      <div className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-[#00A884] text-white">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={empty ? "mic" : "send"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {empty ? <IconMic /> : <IconSend />}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── The phone ────────────────────────────────────────────────────── */

export function PhoneSim({
  view,
  composerText,
  composerDone,
}: {
  view: ChatView;
  composerText: string;
  composerDone: boolean;
}) {
  const { locale } = useLocale();
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in frame, the way a real chat does.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [view.items.length, view.typing, view.ocr]);

  return (
    <div
      className="relative"
      style={{ width: SCREEN_W + BEZEL * 2, height: SCREEN_H + BEZEL * 2 }}
    >
      {/* Titanium shell */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: SCREEN_R + BEZEL,
          padding: BEZEL,
          background:
            "linear-gradient(152deg, #55565B 0%, #2A2B2E 26%, #17181A 44%, #6E7075 62%, #303134 78%, #1B1C1E 100%)",
          boxShadow:
            "0 48px 90px -24px rgba(0,0,0,0.85), 0 12px 32px -8px rgba(0,0,0,0.6), inset 0 0 0 1.5px rgba(255,255,255,0.09)",
        }}
      >
        {/* Screen */}
        <div
          className="relative flex h-full w-full flex-col overflow-hidden bg-[#0B141A]"
          style={{ borderRadius: SCREEN_R }}
        >
          <StatusBar />
          <ChatHeader />

          {/* Wallpaper */}
          <div className="relative min-h-0 flex-1">
            <div className="absolute inset-0 bg-[#0B141A]" />
            <div
              className="absolute inset-0 opacity-[0.045]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' fill='none' stroke='%23E9EDEF' stroke-width='1.1'%3E%3Ccircle cx='14' cy='16' r='5'/%3E%3Cpath d='M40 10h10v9H40z'/%3E%3Cpath d='M56 40l6 8-12 0z'/%3E%3Cpath d='M10 46c4-5 9-5 13 0'/%3E%3Ccircle cx='60' cy='16' r='3'/%3E%3Cpath d='M26 60h12'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Messages */}
            <div
              ref={listRef}
              className="absolute inset-0 flex flex-col justify-end overflow-y-auto overscroll-contain px-[8px] pt-[10px] pb-[14px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Encryption notice — the small truth that makes it feel real */}
              <div className="mx-auto mb-[14px] w-fit max-w-[86%] shrink-0 rounded-[6px] bg-[#182229] px-[10px] py-[6px] text-center text-[11.5px] leading-[15px] text-[#FFD279]">
                {locale === "no"
                  ? "Meldinger er ende-til-ende-kryptert."
                  : "Messages are end-to-end encrypted."}
              </div>

              <div className="flex shrink-0 flex-col gap-[10px]">
                <AnimatePresence initial={false}>
                  {view.items.map((item) => {
                    const tick = view.ticks[item.id];
                    if (item.kind === "text") return <TextMessage key={item.id} item={item} tick={tick} />;
                    if (item.kind === "photo")
                      return <PhotoMessage key={item.id} item={item} tick={tick} ocr={view.ocr} />;
                    if (item.kind === "order") return <OrderMessage key={item.id} item={item} />;
                    return <ReceiptMessage key={item.id} item={item} />;
                  })}
                  {view.typing && <TypingBubble key="typing" />}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <Composer text={composerText} done={composerDone} />

          {/* Home indicator */}
          <div className="flex h-[28px] shrink-0 items-center justify-center">
            <div className="h-[5px] w-[124px] rounded-full bg-white/55" />
          </div>

          {/* Screen glass: a raking specular highlight */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              borderRadius: SCREEN_R,
              background:
                "linear-gradient(128deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.02) 22%, transparent 46%)",
            }}
          />
        </div>
      </div>

      {/* Side buttons */}
      <div className="absolute top-[122px] -left-[3px] h-[30px] w-[3px] rounded-l bg-linear-to-b from-[#6E7075] to-[#3A3B3E]" />
      <div className="absolute top-[172px] -left-[3px] h-[52px] w-[3px] rounded-l bg-linear-to-b from-[#6E7075] to-[#3A3B3E]" />
      <div className="absolute top-[236px] -left-[3px] h-[52px] w-[3px] rounded-l bg-linear-to-b from-[#6E7075] to-[#3A3B3E]" />
      <div className="absolute top-[198px] -right-[3px] h-[74px] w-[3px] rounded-r bg-linear-to-b from-[#6E7075] to-[#3A3B3E]" />
    </div>
  );
}

export { SCREEN_H, SCREEN_W, BEZEL };
