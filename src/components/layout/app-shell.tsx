"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  CalendarClock,
  CalendarPlus,
  CircleUser,
  ClipboardList,
  Droplets,
  FileCheck,
  FolderOpen,
  HardHat,
  Inbox,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import type { NavItem } from "@/types/navigation";
import { Logo } from "@/components/layout/logo";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const icons = {
  LayoutDashboard,
  Bell,
  Building2,
  CalendarPlus,
  ClipboardList,
  FolderOpen,
  CircleUser,
  Users,
  Droplets,
  Inbox,
  CalendarClock,
  FileCheck,
  HardHat,
  Settings,
};

export type { NavItem };

export function AppShell({
  title,
  nav,
  homeHref,
  userName,
  userDetail,
  children,
}: {
  title: string;
  nav: NavItem[];
  homeHref: string;
  userName: string;
  userDetail?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r border-line bg-forest text-cream transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <Logo href={homeHref} tone="light" />
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {nav.map((item) => {
              const Icon = icons[item.icon];
              const active =
                item.href === homeHref
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm",
                    active ? "bg-cream/15 text-white" : "text-cream/75 hover:bg-white/5 hover:text-cream",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
            <p className="truncate text-sm font-medium">{userName}</p>
            {userDetail ? <p className="truncate text-xs text-cream/60">{userDetail}</p> : null}
            <form action={logoutAction}>
              <button type="submit" className="mt-3 text-xs uppercase tracking-[0.14em] text-cream/70 hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-line bg-panel px-4 lg:px-8">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-line lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm font-medium text-muted">{title}</p>
            <Link href="/" className="text-xs uppercase tracking-[0.14em] text-muted hover:text-ink">
              Public site
            </Link>
          </header>
          <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
