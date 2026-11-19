import Link from "next/link";
import { Bell, Building2, ClipboardList, FolderOpen, LayoutDashboard } from "lucide-react";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Reminders", icon: Bell, active: false },
  { label: "Locations", icon: Building2, active: false },
  { label: "Service history", icon: ClipboardList, active: false },
  { label: "Documents", icon: FolderOpen, active: false },
];

const stats = [
  { label: "Locations", value: "5" },
  { label: "Grease traps", value: "12" },
  { label: "Reminders", value: "3" },
];

const activity = [
  { title: "Sample Kitchen", detail: "Interceptor service due" },
  { title: "Demo Cafeteria", detail: "Service history updated" },
  { title: "Example Facility", detail: "Document added" },
];

export function PortalShowcase() {
  return (
    <section className="bg-pine text-white" aria-labelledby="portal-showcase-heading">
      <div className="mx-auto grid max-w-[90rem] items-center gap-14 px-4 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8 lg:py-32">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-lime">The KLS platform</p>
          <h2 id="portal-showcase-heading" className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[3.4rem]">
            A Streamlined Experience for Your Team.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-white/75 sm:text-lg">
            Manage your facilities, interceptor records, documents, and service history through the KLS client portal.
          </p>
          <Link
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-lime px-6 text-sm font-bold uppercase tracking-[0.06em] text-inkwell transition-colors hover:bg-white"
          >
            Access Client Portal
          </Link>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-inkwell p-3 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.65)] sm:p-4">
          <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#071712]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <p className="ml-3 text-xs font-semibold tracking-wide text-white/70">KLS · Client Portal · Sample account</p>
            </div>
            <div className="grid min-h-[420px] sm:grid-cols-[180px_1fr] lg:min-h-[460px]">
              <nav className="hidden border-r border-white/10 p-4 sm:block" aria-label="Sample portal">
                <p className="px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-lime">KLS</p>
                <ul className="mt-4 space-y-1">
                  {nav.map((item) => (
                    <li key={item.label}>
                      <span
                        className={
                          item.active
                            ? "flex items-center gap-2 rounded-md bg-white/10 px-2 py-2 text-sm font-semibold text-white"
                            : "flex items-center gap-2 rounded-md px-2 py-2 text-sm text-white/65"
                        }
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-lime">Dashboard</p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.03em]">Facility overview</p>
                <p className="mt-1 text-sm text-white/55">Fictional demonstration data</p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-4">
                      <p className="text-2xl font-bold tracking-[-0.03em] text-lime">{stat.value}</p>
                      <p className="mt-1 text-[11px] leading-4 text-white/60 sm:text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-white/10">
                  <p className="border-b border-white/10 px-4 py-3 text-sm font-semibold">Recent activity</p>
                  <ul>
                    {activity.map((item) => (
                      <li key={item.title} className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 last:border-b-0">
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="text-right text-xs text-white/55">{item.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
