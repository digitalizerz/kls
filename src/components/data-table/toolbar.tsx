"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { withParams } from "@/lib/table-query";

export type TableFilter = {
  name: string;
  label: string;
  options?: { value: string; label: string }[];
  type?: "select" | "date";
  clears?: string[];
};

export function DataTableToolbar({
  pathname,
  current,
  placeholder,
  filters = [],
}: {
  pathname: string;
  current: Record<string, string>;
  placeholder: string;
  filters?: TableFilter[];
}) {
  const router = useRouter();
  const urlQuery = current.q ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [trackedQuery, setTrackedQuery] = useState(urlQuery);
  const [focused, setFocused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (urlQuery !== trackedQuery) {
    setTrackedQuery(urlQuery);
    if (!focused) setQuery(urlQuery);
  }

  function commit(patch: Record<string, string | null>) {
    const href = withParams(pathname, current, { ...patch, page: null });
    router.replace(href, { scroll: false });
  }

  const commitRef = useRef(commit);
  useEffect(() => {
    commitRef.current = commit;
  });

  const filterNames = filters.map((filter) => filter.name);
  const active = Boolean(urlQuery || filterNames.some((name) => current[name]));
  const clearHref = withParams(pathname, current, {
    q: null,
    page: null,
    ...Object.fromEntries(filterNames.map((name) => [name, null])),
  });

  function onSearch(value: string) {
    setQuery(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      commitRef.current({ q: value.trim() || null });
    }, 300);
  }

  function onFilter(name: string, value: string, clears: string[] = []) {
    if (timer.current) clearTimeout(timer.current);
    const patch: Record<string, string | null> = {
      [name]: value || null,
      q: query.trim() || null,
    };
    for (const key of clears) patch[key] = null;
    commit(patch);
  }

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">{placeholder}</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-dash-muted" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => onSearch(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              if (timer.current) clearTimeout(timer.current);
              commit({ q: query.trim() || null });
            }
          }}
          placeholder={placeholder}
          className="h-11 w-full rounded-full border border-dash-line bg-white pr-4 pl-10 text-sm text-dash-ink outline-none placeholder:text-dash-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-rich"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) =>
          filter.type === "date" ? (
            <label key={filter.name} className="inline-flex h-11 items-center gap-2 rounded-full border border-dash-line bg-white px-3 text-sm">
              <span className="text-dash-muted">{filter.label}</span>
              <input
                type="date"
                value={current[filter.name] ?? ""}
                aria-label={filter.label}
                onChange={(event) => onFilter(filter.name, event.target.value, filter.clears)}
                className="bg-transparent font-medium text-dash-ink outline-none"
              />
            </label>
          ) : (
            <label key={filter.name} className="inline-flex h-11 items-center gap-2 rounded-full border border-dash-line bg-white px-3 text-sm">
              <span className="text-dash-muted">{filter.label}</span>
              <select
                value={current[filter.name] ?? ""}
                aria-label={filter.label}
                onChange={(event) => onFilter(filter.name, event.target.value, filter.clears)}
                className="select-caret-sm max-w-[12rem] bg-transparent font-medium text-dash-ink outline-none"
              >
                <option value="">All</option>
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ),
        )}
        {active ? (
          <Link
            href={clearHref}
            scroll={false}
            className="inline-flex h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-dash-rich hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-rich"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </Link>
        ) : null}
      </div>
    </div>
  );
}
