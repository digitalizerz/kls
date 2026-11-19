"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchOperations, type SearchHit } from "@/actions/search";
import { cn } from "@/lib/utils";

const placeholders = {
  admin: "Search customers, locations, traps...",
  portal: "Search locations and traps...",
  technician: "Search jobs...",
};

export function DashboardSearch({ scope }: { scope: keyof typeof placeholders }) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;

    const current = ++requestId.current;
    const timer = window.setTimeout(async () => {
      setStatus("Searching");
      const next = await searchOperations(term);
      if (current !== requestId.current) return;
      setHits(next);
      setActive(0);
      setOpen(true);
      setStatus(next.length === 0 ? "No matches" : `${next.length} results`);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(hit: SearchHit) {
    setOpen(false);
    setQuery("");
    setHits([]);
    router.push(hit.href);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || hits.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % hits.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + hits.length) % hits.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const hit = hits[active] ?? hits[0];
      if (hit) go(hit);
    }
  }

  const showList = open && query.trim().length >= 2;

  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={`${listId}-input`} className="sr-only">
        {placeholders[scope]}
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-dash-muted" aria-hidden="true" />
      <input
        ref={inputRef}
        id={`${listId}-input`}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && hits[active] ? `${listId}-${active}` : undefined}
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          setOpen(true);
          if (value.trim().length < 2) {
            setHits([]);
            setStatus("");
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
        placeholder={placeholders[scope]}
        className="h-11 w-full rounded-full border border-dash-line bg-white pr-16 pl-10 text-sm text-dash-ink outline-none placeholder:text-dash-muted focus-visible:border-dash-rich focus-visible:ring-2 focus-visible:ring-dash-rich/20"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-dash-line px-1.5 py-0.5 text-[10px] font-semibold text-dash-muted sm:inline">
        ⌘K
      </kbd>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+0.5rem)] right-0 left-0 z-30 max-h-80 overflow-auto rounded-2xl border border-dash-line bg-white p-1 shadow-[0_18px_40px_-24px_rgba(17,23,20,0.45)]"
        >
          {hits.length === 0 ? (
            <li className="px-3 py-3 text-sm text-dash-muted">No matches</li>
          ) : (
            hits.map((hit, index) => (
              <li key={`${hit.kind}-${hit.href}`} id={`${listId}-${index}`} role="option" aria-selected={index === active}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => go(hit)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left",
                    index === active ? "bg-dash-bg" : "hover:bg-dash-bg",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-dash-ink">{hit.label}</span>
                    <span className="block truncate text-xs text-dash-muted">{hit.detail}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-dash-muted">{hit.kind}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
