"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";

type SelectionContextValue = {
  ids: string[];
  selected: string[];
  toggle: (id: string) => void;
  toggleAll: () => void;
  ask: (ids: string[]) => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

function useSelection() {
  const value = useContext(SelectionContext);
  if (!value) throw new Error("Row selection is only available inside a selectable table.");
  return value;
}

const iconClass =
  "grid h-9 w-9 place-items-center rounded-full text-dash-muted hover:bg-dash-bg hover:text-dash-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-rich";

export function TableSelection({
  ids,
  action,
  returnTo,
  noun,
  nouns,
  confirm,
  children,
}: {
  ids: string[];
  action: (formData: FormData) => Promise<void>;
  returnTo: string;
  noun: string;
  nouns: string;
  confirm: string;
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, setPending] = useState<string[] | null>(null);
  const key = ids.join("\n");
  const [seen, setSeen] = useState(key);
  if (seen !== key) {
    setSeen(key);
    setSelected([]);
  }

  const value: SelectionContextValue = {
    ids,
    selected,
    toggle(id) {
      setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    },
    toggleAll() {
      setSelected((current) => (current.length === ids.length ? [] : ids));
    },
    ask(next) {
      if (next.length > 0) setPending(next);
    },
  };

  const count = pending?.length ?? 0;

  return (
    <SelectionContext.Provider value={value}>
      {selected.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dash-line bg-white px-4 py-3">
          <p className="text-sm font-semibold text-dash-ink">
            {selected.length} selected
          </p>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-danger px-3 text-sm font-semibold text-white hover:bg-danger/90"
            onClick={() => value.ask(selected)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete selected
          </button>
        </div>
      ) : null}
      {children}
      <DeleteDialog
        open={pending !== null}
        title={count === 1 ? `Delete this ${noun}?` : `Delete ${count} ${nouns}?`}
        confirm={confirm}
        action={action}
        ids={pending ?? []}
        returnTo={returnTo}
        onClose={() => setPending(null)}
      />
    </SelectionContext.Provider>
  );
}

export function SelectAll() {
  const { ids, selected, toggleAll } = useSelection();
  const ref = useRef<HTMLInputElement>(null);
  const all = ids.length > 0 && selected.length === ids.length;
  const some = selected.length > 0 && !all;

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = some;
  }, [some]);

  if (ids.length === 0) return null;

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={all}
      onChange={toggleAll}
      aria-label="Select all on this page"
      className="h-4 w-4 accent-dash-green"
    />
  );
}

export function SelectRow({ id, label }: { id: string; label: string }) {
  const { selected, toggle } = useSelection();
  return (
    <input
      type="checkbox"
      checked={selected.includes(id)}
      onChange={() => toggle(id)}
      aria-label={`Select ${label}`}
      className="h-4 w-4 accent-dash-green"
    />
  );
}

export function RowIcons({
  label,
  viewHref,
  editHref,
  downloadHref,
  deleteId,
}: {
  label: string;
  viewHref?: string;
  editHref?: string;
  downloadHref?: string;
  deleteId?: string;
}) {
  const selection = useContext(SelectionContext);

  return (
    <div className="flex items-center justify-end gap-1">
      {viewHref ? (
        <Link href={viewHref} aria-label={`View ${label}`} className={iconClass}>
          <Eye className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
      {editHref ? (
        <Link href={editHref} aria-label={`Edit ${label}`} className={iconClass}>
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
      {downloadHref ? (
        <a href={downloadHref} aria-label={`Download ${label}`} className={iconClass}>
          <Download className="h-4 w-4" aria-hidden="true" />
        </a>
      ) : null}
      {deleteId && selection ? (
        <button type="button" aria-label={`Delete ${label}`} className={`${iconClass} hover:bg-red-50 hover:text-danger`} onClick={() => selection.ask([deleteId])}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function DeleteSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center rounded-full bg-danger px-4 text-sm font-semibold text-white hover:bg-danger/90 disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function DeleteDialog({
  open,
  title,
  confirm,
  action,
  ids,
  returnTo,
  onClose,
}: {
  open: boolean;
  title: string;
  confirm: string;
  action: (formData: FormData) => Promise<void>;
  ids: string[];
  returnTo: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeRef.current();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] grid place-items-center bg-[#111714]/40 p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl border border-dash-line bg-white p-6 shadow-[0_24px_60px_-28px_rgba(17,23,20,0.55)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-dash-ink">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-dash-muted">{confirm}</p>
        <form action={action} className="mt-5 flex justify-end gap-2">
          {ids.map((id) => (
            <input key={id} type="hidden" name="id" value={id} />
          ))}
          <input type="hidden" name="returnTo" value={returnTo} />
          <button
            ref={cancelRef}
            type="button"
            className="inline-flex h-10 items-center rounded-full border border-dash-line bg-white px-4 text-sm font-semibold text-dash-ink hover:bg-dash-bg"
            onClick={onClose}
          >
            Cancel
          </button>
          <DeleteSubmit />
        </form>
      </div>
    </div>,
    document.body,
  );
}
