import { cn } from "@/lib/utils";

export function Table({
  children,
  className,
  footer,
}: {
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className={cn("overflow-hidden rounded-[1.25rem] border border-dash-line bg-white shadow-[0_10px_30px_-24px_rgba(17,23,20,0.45)]", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-separate border-spacing-0 text-left text-sm [&_tbody_tr]:transition-colors [&_tbody_tr]:hover:bg-[#fbfbf9] motion-reduce:[&_tbody_tr]:transition-none">
          {children}
        </table>
      </div>
      {footer}
    </div>
  );
}

export function Th({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "bg-dash-bg px-4 py-3 text-left text-[11px] font-semibold tracking-[0.08em] text-dash-muted uppercase whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={cn("border-t border-dash-line px-4 py-3.5 align-middle text-sm text-dash-ink", className)}>
      {children}
    </td>
  );
}
