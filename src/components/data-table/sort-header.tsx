import Link from "next/link";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

export function SortHeader({
  label,
  href,
  active,
  dir,
}: {
  label: string;
  href: string;
  active: boolean;
  dir: "asc" | "desc";
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className="inline-flex items-center gap-1 rounded text-dash-muted hover:text-dash-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-rich"
    >
      {label}
      {active ? (
        dir === "asc" ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
      )}
    </Link>
  );
}
