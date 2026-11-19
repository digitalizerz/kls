"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZES, pageHref, withParams } from "@/lib/table-query";

export function DataTablePagination({
  pathname,
  current,
  page,
  pages,
  pageSize,
  start,
  end,
  total,
  label,
}: {
  pathname: string;
  current: Record<string, string>;
  page: number;
  pages: number;
  pageSize: number;
  start: number;
  end: number;
  total: number;
  label: string;
}) {
  const router = useRouter();
  const prev = page > 1 ? pageHref(pathname, current, page - 1) : null;
  const next = page < pages ? pageHref(pathname, current, page + 1) : null;

  return (
    <div className="flex flex-col gap-3 border-t border-dash-line px-4 py-3 text-sm text-dash-muted sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing <span className="font-semibold text-dash-ink">{start}</span>–<span className="font-semibold text-dash-ink">{end}</span> of{" "}
        <span className="font-semibold text-dash-ink">{total}</span> {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2">
          <span>Rows per page</span>
          <select
            aria-label="Rows per page"
            value={String(pageSize)}
            onChange={(event) => {
              const href = withParams(pathname, current, {
                page: null,
                pageSize: event.target.value === "25" ? null : event.target.value,
              });
              router.replace(href, { scroll: false });
            }}
            className="select-caret-sm h-9 rounded-lg border border-dash-line bg-white px-2 font-medium text-dash-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-rich"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <nav className="flex items-center gap-1" aria-label="Pagination">
          {prev ? (
            <Link href={prev} scroll={false} aria-label="Previous page" className="grid h-9 w-9 place-items-center rounded-lg border border-dash-line bg-white text-dash-ink hover:border-dash-rich focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-rich">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-dash-line text-dash-muted/50" aria-hidden="true">
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}
          <span className="grid h-9 min-w-9 place-items-center rounded-lg bg-dash-green px-2 font-semibold text-white" aria-current="page">
            {page}
          </span>
          {next ? (
            <Link href={next} scroll={false} aria-label="Next page" className="grid h-9 w-9 place-items-center rounded-lg border border-dash-line bg-white text-dash-ink hover:border-dash-rich focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-rich">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-dash-line text-dash-muted/50" aria-hidden="true">
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      </div>
    </div>
  );
}
