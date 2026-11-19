import Link from "next/link";
import { Bell, ChevronDown, LogOut, Settings } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import type { ShellNotice } from "@/lib/shell-notices";

function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "K";
}

const menuClass =
  "absolute right-0 top-[calc(100%+0.5rem)] z-[80] rounded-2xl border border-dash-line bg-white shadow-[0_18px_40px_-24px_rgba(17,23,20,0.45)]";

export function NotificationMenu({
  notices,
  href,
}: {
  notices: ShellNotice[];
  href?: string;
}) {
  return (
    <details className="relative">
      <summary
        className="relative flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-dash-line bg-white text-dash-ink hover:border-dash-rich"
        aria-label={notices.length > 0 ? "Notifications, unread" : "Notifications"}
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {notices.length > 0 ? <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emergency" aria-hidden="true" /> : null}
      </summary>
      <div className={`${menuClass} w-80 p-2`}>
        <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-dash-muted">Notifications</p>
        {notices.length === 0 ? (
          <p className="px-3 py-4 text-sm text-dash-muted">No notifications</p>
        ) : (
          <ul>
            {notices.map((notice) => (
              <li key={notice.id}>
                {href ? (
                  <Link href={href} className="block rounded-xl px-3 py-2 hover:bg-dash-bg">
                    <span className="block truncate text-sm font-semibold text-dash-ink">{notice.title}</span>
                    <span className="block truncate text-xs text-dash-muted">{notice.detail}</span>
                  </Link>
                ) : (
                  <div className="px-3 py-2">
                    <span className="block truncate text-sm font-semibold text-dash-ink">{notice.title}</span>
                    <span className="block truncate text-xs text-dash-muted">{notice.detail}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {href ? (
          <Link href={href} className="mt-1 block rounded-xl px-3 py-2 text-sm font-semibold text-dash-rich hover:bg-dash-bg">
            View all
          </Link>
        ) : null}
      </div>
    </details>
  );
}

export function ProfileMenu({
  name,
  email,
  settingsHref,
}: {
  name: string;
  email: string;
  settingsHref?: string;
}) {
  return (
    <details className="relative">
      <summary
        className="flex h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-dash-line bg-white pr-2 pl-1 text-left hover:border-dash-rich"
        aria-label="Account menu"
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-dash-green text-xs font-bold text-white">
          {initials(name)}
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-ok" aria-hidden="true" />
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-[9rem] truncate text-sm font-semibold text-dash-ink">{name}</span>
          {email ? <span className="block max-w-[9rem] truncate text-xs text-dash-muted">{email}</span> : null}
        </span>
        <ChevronDown className="h-4 w-4 text-dash-muted" aria-hidden="true" />
      </summary>
      <div className={`${menuClass} w-52 p-1`}>
        {settingsHref ? (
          <Link href={settingsHref} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-dash-ink hover:bg-dash-bg">
            <Settings className="h-4 w-4" aria-hidden="true" />
            User settings
          </Link>
        ) : null}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-dash-ink hover:bg-dash-bg"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}
