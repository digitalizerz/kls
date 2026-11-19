"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { EmergencyLink } from "@/components/marketing/emergency-link";
import { publicNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white">
      <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between gap-4 px-4 lg:px-8">
        <Logo tone="public" />
        <nav className="hidden items-center gap-8 xl:flex" aria-label="Primary">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[15px] font-semibold tracking-[-0.01em] transition-colors hover:text-pine",
                pathname === item.href ? "text-pine" : "text-inkwell",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <EmergencyLink className="h-11 rounded-md px-3 text-[11px] sm:px-4 sm:text-xs" />
          <Link
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center rounded-md border border-inkwell/15 px-4 text-xs font-bold uppercase tracking-[0.08em] text-inkwell transition-colors hover:border-inkwell hover:bg-sand lg:inline-flex"
          >
            Client Portal
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-inkwell xl:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div id="mobile-navigation" className="border-t border-black/5 bg-white px-4 py-4 xl:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center text-base font-semibold text-inkwell"
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center text-base font-semibold text-pine"
              onClick={() => setOpen(false)}
            >
              Client Portal
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
