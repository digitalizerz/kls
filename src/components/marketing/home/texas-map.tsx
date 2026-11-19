export function TexasMap({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 270" className={className} aria-hidden="true">
      <defs>
        <pattern id="kls-texas-grid" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M14 0H0V14" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6" />
        </pattern>
        <clipPath id="kls-texas-clip">
          <path d="M38 16H92V58H168L186 80L174 122L194 160L178 196L146 232L132 252L96 208L68 168L44 118L40 76L56 58H38Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#kls-texas-clip)">
        <rect width="220" height="270" fill="url(#kls-texas-grid)" />
      </g>
      <path
        d="M38 16H92V58H168L186 80L174 122L194 160L178 196L146 232L132 252L96 208L68 168L44 118L40 76L56 58H38Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
