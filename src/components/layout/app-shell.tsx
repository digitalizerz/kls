"use client";

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
  ExternalLink,
  FileCheck,
  FolderOpen,
  HardHat,
  Inbox,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import type { NavItem } from "@/types/navigation";
import { Logo } from "@/components/layout/logo";
import { DashboardSearch } from "@/components/layout/dashboard-search";
import { NotificationMenu, ProfileMenu } from "@/components/layout/shell-account";
import type { ShellNotice } from "@/lib/shell-notices";
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
  ShieldCheck,
  Settings,
};

export type { NavItem };

export function AppShell({
  title,
  nav,
  homeHref,
  userName,
  userEmail,
  settingsHref,
  notices,
  noticesHref,
  searchScope,
  fontClassName,
  children,
}: {
  title: string;
  nav: NavItem[];
  homeHref: string;
  userName: string;
  userEmail: string;
  settingsHref?: string;
  notices: ShellNotice[];
  noticesHref?: string;
  searchScope: "admin" | "portal" | "technician";
  fontClassName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={`${fontClassName} dash-shell min-h-screen bg-dash-bg text-dash-ink`}>
      <input id="kls-nav-drawer" type="checkbox" className="peer sr-only" />
      <input id="kls-nav-collapse" type="checkbox" className="peer sr-only" />
      <div className="dash-frame flex min-h-screen">
        <aside
          id="dashboard-nav"
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-[260px] shrink-0 -translate-x-full flex-col overflow-hidden bg-dash-forest text-white transition-[width,transform] duration-200 motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          )}
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,243,91,0.18),transparent_62%),radial-gradient(ellipse_at_bottom_right,rgba(20,107,70,0.55),transparent_58%)]" aria-hidden="true" />
          <div className="nav-brand relative flex h-[4.5rem] items-center gap-2 px-4">
            <span className="nav-logo-full">
              <Logo href={homeHref} tone="light" />
            </span>
            <span className="nav-logo-mark hidden">
              <Logo href={homeHref} tone="light" compact />
            </span>
            <label
              htmlFor="kls-nav-drawer"
              className="ml-auto inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-white/80 hover:bg-white/10 lg:hidden"
            >
              <X className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Close menu</span>
            </label>
          </div>
          <nav className="relative flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4" aria-label="Dashboard">
            {nav.map((item) => {
              const Icon = icons[item.icon];
              const active = item.href === homeHref ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                  title={item.label}
                  className={cn(
                    "nav-item flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-lime",
                    active ? "bg-dash-rich text-white" : "text-white/70 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="nav-copy truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-50 flex h-[4.5rem] items-center gap-3 overflow-visible bg-dash-bg px-4 lg:px-6">
            <label
              htmlFor="kls-nav-drawer"
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-dash-line bg-white lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </label>
            <label
              htmlFor="kls-nav-collapse"
              className="hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-dash-line bg-white text-dash-ink hover:border-dash-rich lg:inline-flex"
            >
              <PanelLeftClose className="collapse-when-open h-5 w-5" aria-hidden="true" />
              <PanelLeftOpen className="collapse-when-closed hidden h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Collapse navigation</span>
            </label>
            <p className="hidden shrink-0 text-sm font-semibold text-dash-ink xl:block">{title}</p>
            <DashboardSearch scope={searchScope} />
            <NotificationMenu notices={notices} href={noticesHref} />
            <ProfileMenu name={userName} email={userEmail} settingsHref={settingsHref} />
            {searchScope === "admin" ? null : (
              <Link
                href="/"
                aria-label="Public site"
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-dash-line bg-white px-3 text-xs font-semibold text-dash-ink transition-colors hover:border-dash-rich"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden md:inline">Public site</span>
              </Link>
            )}
          </header>
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
      <label htmlFor="kls-nav-drawer" className="nav-overlay fixed inset-0 z-30 hidden bg-dash-ink/40 lg:hidden">
        <span className="sr-only">Close menu</span>
      </label>
    </div>
  );
}
