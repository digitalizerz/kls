import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-forest text-cream hover:bg-forest-mid border-transparent",
  secondary:
    "bg-transparent text-forest border-forest/25 hover:border-forest hover:bg-forest/5",
  clay: "bg-clay text-white hover:bg-clay-hover border-transparent",
  ghost: "bg-transparent text-ink border-transparent hover:bg-black/5",
  danger: "bg-danger text-white hover:bg-danger/90 border-transparent",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
