import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
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
    { label: "Services today", value: servicesToday },
    { label: "Upcoming services", value: upcoming },
    { label: "Pending requests", value: pendingRequests },
    { label: "Customers", value: customers },
    { label: "Locations", value: locations },
    { label: "Traps due for cleaning", value: trapsDue },
    { label: "Manifests needing attention", value: manifestsNeedingWork },
    { label: "Unread due reminders", value: openReminders },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations dashboard"
        description="Today’s work, open requests, and traps coming due."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{metric.label}</p>
            <p className="mt-2 font-serif text-3xl">{metric.value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardTitle>Today’s schedule</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {todayJobs.length === 0 ? (
              <li className="py-3 text-sm text-muted">No jobs on today’s calendar.</li>
            ) : (
              todayJobs.map((job) => (
                <li key={job.id} className="py-3">
                  <p className="text-sm font-medium">{job.customer.companyName}</p>
                  <p className="text-xs text-muted">
                    {formatDateTime(job.scheduledAt)} · {job.location.locationName}
                  </p>
                  <p className="text-xs text-muted">
                    {job.technician?.user.name ?? "Unassigned"}
                  </p>
                </li>
              ))
            )}
          </ul>
        </Card>
        <Card>
          <CardTitle>Recent service requests</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {recentRequests.map((request) => (
              <li key={request.id} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <Link href={`/admin/service-requests/${request.id}`} className="text-sm font-medium hover:text-forest">
                    {request.customer.companyName}
                  </Link>
                  <p className="text-xs text-muted">{request.location.locationName}</p>
                </div>
                <StatusBadge status={request.status} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle>Upcoming service due dates</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {dueTraps.map((trap) => (
              <li key={trap.id} className="py-3">
                <p className="text-sm font-medium">{trap.nameOrIdentifier}</p>
                <p className="text-xs text-muted">
                  {trap.location.customer.companyName} · {trap.location.locationName}
                </p>
                <p className="text-xs text-muted">{formatDate(trap.nextRecommendedServiceAt)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
