import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { daysUntil, formatAddress, formatDate, formatFrequency } from "@/lib/format";
import { syncCustomerReminders } from "@/lib/reminders";
import Link from "next/link";

export default async function PortalDashboardPage() {
  const { user, customer } = await requirePortalContext();
  await syncCustomerReminders(customer.id);
  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 14);

  const [locations, traps, jobs, documents, unreadCount, unreadReminders] = await Promise.all([
    prisma.location.findMany({
      where: { customerId: customer.id },
      include: { greaseTraps: true },
      orderBy: { locationName: "asc" },
    }),
    prisma.greaseTrap.findMany({
      where: { location: { customerId: customer.id }, status: "ACTIVE" },
      include: { location: true },
      orderBy: { nextRecommendedServiceAt: "asc" },
    }),
    prisma.serviceJob.findMany({
      where: { customerId: customer.id },
      include: { location: true },
      orderBy: { scheduledAt: "desc" },
      take: 5,
    }),
    prisma.document.findMany({
      where: { customerId: customer.id, visibility: "CUSTOMER_VISIBLE" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.notification.count({
      where: {
        customerId: customer.id,
        channel: "IN_APP",
        status: { in: ["PENDING", "SENT"] },
        readAt: null,
        OR: [{ userId: user.id }, { userId: null }],
      },
    }),
    prisma.notification.findMany({
      where: {
        customerId: customer.id,
        channel: "IN_APP",
        status: { in: ["PENDING", "SENT"] },
        readAt: null,
        OR: [{ userId: user.id }, { userId: null }],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const dueSoon = traps.filter((trap) => {
    if (!trap.nextRecommendedServiceAt) return false;
    return trap.nextRecommendedServiceAt <= soon;
  });
  const nextJob = jobs
    .filter((job) => job.status === "SCHEDULED" && job.scheduledAt >= now)
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={customer.companyName}
        title={`Hello, ${customer.contactName.split(" ")[0]}`}
        description="Upcoming service, locations that need attention, and recent records."
        actions={
          <ButtonLink href="/portal/schedule" variant="clay">
            Schedule cleaning
          </ButtonLink>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Next scheduled service</p>
          <p className="mt-2 font-serif text-2xl">
            {nextJob ? formatDate(nextJob.scheduledAt) : "None on the calendar"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {nextJob ? nextJob.location.locationName : "Submit a request when a trap is due."}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Locations</p>
          <p className="mt-2 font-serif text-2xl">{locations.length}</p>
          <p className="mt-1 text-sm text-muted">{traps.length} active grease traps</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Unread reminders</p>
          <p className="mt-2 font-serif text-2xl">{unreadCount}</p>
          <p className="mt-1 text-sm text-muted">
            <Link href="/portal/reminders" className="text-forest">
              View reminder schedule
            </Link>
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Reminders</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {unreadReminders.length === 0 ? (
              <li className="py-3 text-sm text-muted">No unread reminders.</li>
            ) : (
              unreadReminders.map((reminder) => (
                <li key={reminder.id} className="py-3">
                  <Link href="/portal/reminders" className="text-sm font-medium hover:text-forest">
                    {reminder.title}
                  </Link>
                  <p className="text-xs text-muted">{reminder.body}</p>
                </li>
              ))
            )}
          </ul>
        </Card>
        <Card>
          <CardTitle>Grease traps due soon</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {dueSoon.length === 0 ? (
              <li className="py-3 text-sm text-muted">No traps due in the next 14 days.</li>
            ) : (
              dueSoon.slice(0, 6).map((trap) => {
                const due = daysUntil(trap.nextRecommendedServiceAt);
                return (
                  <li key={trap.id} className="flex items-start justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium">{trap.nameOrIdentifier}</p>
                      <p className="text-xs text-muted">
                        {trap.location.locationName} · {formatFrequency(trap.cleaningFrequency, trap.customFrequencyDays)}
                      </p>
                    </div>
                    <StatusBadge status={due !== null && due < 0 ? "OVERDUE" : "DUE_SOON"} />
                  </li>
                );
              })
            )}
          </ul>
        </Card>
        <Card>
          <CardTitle>Locations</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {locations.map((location) => (
              <li key={location.id} className="py-3">
                <Link href={`/portal/locations/${location.id}`} className="text-sm font-medium hover:text-forest">
                  {location.locationName}
                </Link>
                <p className="text-xs text-muted">{formatAddress(location)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Recent service</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {jobs.length === 0 ? (
              <li className="py-3 text-sm text-muted">No service history yet.</li>
            ) : (
              jobs.map((job) => (
                <li key={job.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{job.location.locationName}</p>
                    <p className="text-xs text-muted">{formatDate(job.scheduledAt)}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </li>
              ))
            )}
          </ul>
        </Card>
        <Card>
          <CardTitle>Recent documents</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {documents.length === 0 ? (
              <li className="py-3 text-sm text-muted">No documents uploaded yet.</li>
            ) : (
              documents.map((doc) => (
                <li key={doc.id} className="py-3">
                  <p className="text-sm font-medium">{doc.title}</p>
                  <p className="text-xs text-muted">{formatDate(doc.createdAt)}</p>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
