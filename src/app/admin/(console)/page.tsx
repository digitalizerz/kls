import Link from "next/link";
import { Bell, CalendarCheck, CalendarClock, Droplets, FileText, Inbox, MapPin, Truck, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { DashboardPanel } from "@/components/admin/dashboard-panel";
import { MetricCard } from "@/components/admin/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDateTime } from "@/lib/format";
import { syncAllReminders } from "@/lib/reminders";

export default async function AdminDashboardPage() {
  await requireAdmin();
  await syncAllReminders();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const soon = new Date();
  soon.setDate(soon.getDate() + 14);

  const [
    servicesToday,
    upcoming,
    pendingRequests,
    customers,
    locations,
    trapsDue,
    manifestsNeedingWork,
    todayJobs,
    recentRequests,
    dueTraps,
    openReminders,
  ] = await Promise.all([
    prisma.serviceJob.count({
      where: { scheduledAt: { gte: start, lt: end }, status: { not: "CANCELLED" } },
    }),
    prisma.serviceJob.count({
      where: { scheduledAt: { gte: end }, status: "SCHEDULED" },
    }),
    prisma.serviceRequest.count({ where: { status: "REQUESTED" } }),
    prisma.customer.count({ where: { status: { in: ["ACTIVE", "PENDING_ONBOARDING"] } } }),
    prisma.location.count({ where: { status: "ACTIVE" } }),
    prisma.greaseTrap.count({
      where: { status: "ACTIVE", nextRecommendedServiceAt: { lte: soon } },
    }),
    prisma.complianceManifest.count({
      where: { status: { in: ["DRAFT", "READY_FOR_GENERATION"] } },
    }),
    prisma.serviceJob.findMany({
      where: { scheduledAt: { gte: start, lt: end } },
      include: { location: true, customer: true, technician: { include: { user: true } } },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.serviceRequest.findMany({
      where: { status: "REQUESTED" },
      include: { customer: true, location: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.greaseTrap.findMany({
      where: { status: "ACTIVE", nextRecommendedServiceAt: { lte: soon } },
      include: { location: { include: { customer: true } } },
      orderBy: { nextRecommendedServiceAt: "asc" },
      take: 6,
    }),
    prisma.notification.count({
      where: {
        channel: "IN_APP",
        status: { in: ["PENDING", "SENT"] },
        type: { in: ["UPCOMING_SERVICE", "OVERDUE_SERVICE"] },
        readAt: null,
      },
    }),
  ]);

  const metrics = [
    { label: "Services today", value: servicesToday, href: "/admin/jobs", icon: Truck, featured: true },
    { label: "Upcoming services", value: upcoming, href: "/admin/jobs", icon: CalendarClock },
    { label: "Pending requests", value: pendingRequests, href: "/admin/service-requests", icon: Inbox, attention: true },
    { label: "Customers", value: customers, href: "/admin/customers", icon: Users },
    { label: "Locations", value: locations, href: "/admin/locations", icon: MapPin },
    { label: "Traps due for cleaning", value: trapsDue, href: "/admin/grease-traps", icon: Droplets, attention: true },
    { label: "Manifests needing attention", value: manifestsNeedingWork, href: "/admin/compliance", icon: FileText, attention: true },
    { label: "Unread due reminders", value: openReminders, href: "/admin/reminders", icon: Bell, attention: true },
  ];

  return (
    <div className="space-y-6">
      <header className="relative">
        <div className="pointer-events-none absolute -top-10 right-0 h-32 w-64 rounded-full bg-dash-lime/30 blur-3xl" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-7 w-1.5 -rotate-12 rounded-full bg-dash-lime" />
            <span className="h-7 w-1.5 -rotate-12 rounded-full bg-dash-rich" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-[-0.045em] text-dash-ink sm:text-4xl">Operations dashboard</h1>
        </div>
        <p className="relative mt-2 max-w-2xl text-sm leading-6 text-dash-muted">
          Today’s work, open requests, and traps coming due.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-3">
        <DashboardPanel title="Today’s schedule" href="/admin/jobs">
          {todayJobs.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-10 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-dash-bg text-dash-rich">
                <CalendarCheck className="h-8 w-8" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm text-dash-muted">No jobs on today’s calendar.</p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-dash-line">
              {todayJobs.map((job) => (
                <li key={job.id}>
                  <Link href={`/admin/jobs/${job.id}`} className="-mx-2 block rounded-xl px-2 py-3 transition-colors hover:bg-dash-bg">
                    <p className="text-sm font-semibold text-dash-ink">{job.customer.companyName}</p>
                    <p className="text-xs text-dash-muted">
                      {formatDateTime(job.scheduledAt)} · {job.location.locationName}
                    </p>
                    <p className="text-xs text-dash-muted">{job.technician?.user.name ?? "Unassigned"}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </DashboardPanel>
        <DashboardPanel title="Recent service requests" href="/admin/service-requests">
          <ul className="mt-2 divide-y divide-dash-line">
            {recentRequests.map((request) => (
              <li key={request.id}>
                <Link
                  href={`/admin/service-requests/${request.id}`}
                  className="-mx-2 flex items-start justify-between gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-dash-bg"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-dash-ink">{request.customer.companyName}</span>
                    <span className="block truncate text-xs text-dash-muted">{request.location.locationName}</span>
                  </span>
                  <StatusBadge status={request.status} />
                </Link>
              </li>
            ))}
          </ul>
        </DashboardPanel>
        <DashboardPanel title="Upcoming service due dates" href="/admin/grease-traps">
          <ul className="mt-2 divide-y divide-dash-line">
            {dueTraps.map((trap) => {
              const overdue = trap.nextRecommendedServiceAt != null && trap.nextRecommendedServiceAt < start;
              return (
                <li key={trap.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-dash-ink">{trap.nameOrIdentifier}</p>
                    <p className="truncate text-xs text-dash-muted">
                      {trap.location.customer.companyName} · {trap.location.locationName}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold text-dash-ink">{formatDate(trap.nextRecommendedServiceAt)}</p>
                    {overdue ? (
                      <span className="mt-1 inline-flex">
                        <StatusBadge status="OVERDUE" />
                      </span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </DashboardPanel>
      </div>
    </div>
  );
}
