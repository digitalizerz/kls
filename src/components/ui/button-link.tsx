import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "clay" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "bg-forest text-cream hover:bg-forest-mid border-transparent",
  secondary: "bg-transparent text-forest border-forest/25 hover:border-forest hover:bg-forest/5",
  clay: "bg-clay text-white hover:bg-clay-hover border-transparent",
  ghost: "bg-transparent text-ink border-transparent hover:bg-black/5",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-medium tracking-wide transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
