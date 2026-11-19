import { cn } from "@/lib/utils";

const tones = {
  default: "bg-dash-bg text-dash-ink",
  forest: "bg-[#e7f5ee] text-dash-green",
  warn: "bg-amber-50 text-amber-800",
  danger: "bg-red-50 text-red-700",
  ok: "bg-[#e7f6ee] text-[#146B46]",
  muted: "bg-stone-100 text-stone-500",
  info: "bg-sky-50 text-sky-800",
};

export const badgeDot = {
  default: "bg-dash-muted",
  forest: "bg-dash-rich",
  warn: "bg-amber-500",
  danger: "bg-red-500",
  ok: "bg-emerald-500",
  muted: "bg-stone-400",
  info: "bg-sky-500",
} as const;

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
