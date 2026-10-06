import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-[13px] font-bold uppercase tracking-[0.14em]",
        light ? "text-white/75" : "text-brand",
      )}
    >
      {children}
    </p>
  );
}
