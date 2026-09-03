import { cn } from "@/lib/utils";

const tones = {
  default: "bg-paper text-ink",
  forest: "bg-forest/10 text-forest",
  warn: "bg-amber-100 text-warn",
  danger: "bg-red-100 text-danger",
  ok: "bg-emerald-100 text-ok",
  muted: "bg-stone-100 text-muted",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
