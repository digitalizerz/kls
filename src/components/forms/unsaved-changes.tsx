"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function UnsavedChanges({ dirty }: { dirty: boolean }) {
  const router = useRouter();
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!dirty || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = anchor.getAttribute("href");
      if (!url || url.startsWith("#")) return;
      event.preventDefault();
      event.stopPropagation();
      setHref(url);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [dirty]);

  useEffect(() => {
    if (!href) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setHref(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [href]);

  if (!href) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-dash-ink/40 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsaved-title"
        className="w-full max-w-md rounded-2xl border border-dash-line bg-white p-6 shadow-[0_18px_40px_-24px_rgba(17,23,20,0.45)]"
      >
        <h2 id="unsaved-title" className="text-lg font-semibold text-dash-ink">
          Leave without saving?
        </h2>
        <p className="mt-2 text-sm leading-6 text-dash-muted">Your changes on this form have not been saved.</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => setHref(null)}>
            Keep editing
          </Button>
          <Button type="button" variant="danger" onClick={() => router.push(href)}>
            Leave page
          </Button>
        </div>
      </div>
    </div>
  );
}
