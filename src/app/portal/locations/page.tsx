import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatAddress, formatDate } from "@/lib/format";
import Link from "next/link";

export default async function LocationsPage() {
  const { customer } = await requirePortalContext();
  const locations = await prisma.location.findMany({
    where: { customerId: customer.id },
    include: {
      greaseTraps: true,
      serviceJobs: {
        where: { status: { in: ["SCHEDULED", "IN_PROGRESS"] } },
        orderBy: { scheduledAt: "asc" },
        take: 1,
      },
    },
    orderBy: { locationName: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Locations"
        description="Each site has its own traps, service history, and documents."
        actions={<ButtonLink href="/portal/locations/new">Add location</ButtonLink>}
      />
      {locations.length === 0 ? (
        <EmptyState title="No locations yet" description="Add the first service location for this account." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {locations.map((location) => (
            <Card key={location.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/portal/locations/${location.id}`} className="text-lg font-semibold hover:text-forest">
                    {location.locationName}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{formatAddress(location)}</p>
                </div>
                <StatusBadge status={location.status} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted">Grease traps</dt>
                  <dd className="mt-1 font-medium">{location.greaseTraps.length}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted">Next service</dt>
                  <dd className="mt-1 font-medium">
                    {location.serviceJobs[0] ? formatDate(location.serviceJobs[0].scheduledAt) : "—"}
                  </dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
