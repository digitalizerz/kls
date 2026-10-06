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
    <header className="sticky top-0 z-40 border-b border-rule bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
        <Logo tone="public" />
        <nav className="hidden items-center gap-6 xl:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-semibold hover:text-brand",
                pathname === item.href ? "text-brand" : "text-charcoal",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <EmergencyLink className="h-10 px-2.5 text-[11px] sm:px-3 sm:text-xs" />
          <Link
            href="/login"
            className="hidden h-10 items-center border border-rule px-3 text-sm font-bold text-charcoal hover:border-charcoal md:inline-flex"
          >
            Client portal
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-rule xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-rule bg-white px-4 py-4 xl:hidden">
          <div className="flex flex-col gap-3">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold"
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="text-sm font-semibold text-brand" onClick={() => setOpen(false)}>
              Client portal
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
