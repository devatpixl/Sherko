/* A spreadsheet mark in Excel's green.

   Deliberately our own drawing rather than Microsoft's registered logo — it
   reads instantly as "the spreadsheet you're still using" without putting a
   competitor's trademark on our marketing site. */

export function SpreadsheetMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {/* Sheet */}
      <path
        d="M4.5 2.5h9.6L19.5 7.9V21a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path d="M14 2.6V8h5.3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity="0.55" />
      {/* The green tile with the X */}
      <rect x="1.5" y="8.5" width="12" height="11" rx="1.6" fill="var(--color-xls)" />
      <path
        d="M4.6 11.4 10.4 16.6M10.4 11.4 4.6 16.6"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
