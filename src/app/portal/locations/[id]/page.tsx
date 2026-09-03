import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatAddress, formatDate, formatFrequency } from "@/lib/format";
import Link from "next/link";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { customer } = await requirePortalContext();
  const location = await prisma.location.findFirst({
    where: { id, customerId: customer.id },
    include: {
      greaseTraps: { orderBy: { nameOrIdentifier: "asc" } },
      serviceJobs: {
        orderBy: { scheduledAt: "desc" },
        take: 8,
        include: { traps: { include: { greaseTrap: true } } },
      },
      documents: { orderBy: { createdAt: "desc" }, take: 8 },
    },
  });

  if (!location) notFound();

  const lastCleaning = location.greaseTraps
    .map((trap) => trap.lastCleanedAt)
    .filter(Boolean)
    .sort((a, b) => (b?.getTime() ?? 0) - (a?.getTime() ?? 0))[0];
  const nextDue = location.greaseTraps
    .map((trap) => trap.nextRecommendedServiceAt)
    .filter(Boolean)
    .sort((a, b) => (a?.getTime() ?? 0) - (b?.getTime() ?? 0))[0];
  const upcoming = location.serviceJobs.find((job) => job.status === "SCHEDULED");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Location"
        title={location.locationName}
        description={formatAddress(location)}
        actions={
          <>
            <ButtonLink href={`/portal/locations/${location.id}/edit`} variant="secondary" size="sm">
              Edit location
            </ButtonLink>
            <ButtonLink href={`/portal/locations/${location.id}/traps/new`} size="sm">
              Add grease trap
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Water purveyor</p>
          <p className="mt-2 font-medium">{location.waterPurveyor ?? "—"}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Contact</p>
          <p className="mt-2 font-medium">{location.contactName ?? "—"}</p>
          <p className="text-sm text-muted">{location.contactPhone}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Cleaning window</p>
          <p className="mt-2 text-sm">Last: {formatDate(lastCleaning)}</p>
          <p className="text-sm">Next recommended: {formatDate(nextDue)}</p>
          <p className="text-sm">Upcoming job: {upcoming ? formatDate(upcoming.scheduledAt) : "—"}</p>
        </Card>
      </div>

      <Card>
        <CardTitle>Grease traps</CardTitle>
        <Table className="mt-4 border-0">
          <thead>
            <tr>
              <Th>Identifier</Th>
              <Th>Capacity</Th>
              <Th>On-site location</Th>
              <Th>Frequency</Th>
              <Th>Last service</Th>
              <Th>Next recommended</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {location.greaseTraps.map((trap) => (
              <tr key={trap.id}>
                <Td className="font-medium">{trap.nameOrIdentifier}</Td>
                <Td>{trap.capacityGallons ? `${trap.capacityGallons} gal` : "—"}</Td>
                <Td>{trap.onsiteLocationDescription ?? "—"}</Td>
                <Td>{formatFrequency(trap.cleaningFrequency, trap.customFrequencyDays)}</Td>
                <Td>{formatDate(trap.lastCleanedAt)}</Td>
                <Td>{formatDate(trap.nextRecommendedServiceAt)}</Td>
                <Td>
                  <Link href={`/portal/locations/${location.id}/traps/${trap.id}/edit`} className="text-sm text-forest">
                    Edit
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Service history</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {location.serviceJobs.length === 0 ? (
              <li className="py-3 text-sm text-muted">No jobs recorded for this location.</li>
            ) : (
              location.serviceJobs.map((job) => (
                <li key={job.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{formatDate(job.scheduledAt)}</p>
                    <p className="text-xs text-muted">
                      {job.traps.map((item) => item.greaseTrap.nameOrIdentifier).join(", ") || "—"}
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
                </li>
              ))
            )}
          </ul>
        </Card>
        <Card>
          <CardTitle>Documents</CardTitle>
          <ul className="mt-4 divide-y divide-line">
            {location.documents.length === 0 ? (
              <li className="py-3 text-sm text-muted">No documents for this location.</li>
            ) : (
              location.documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted">{doc.type.replaceAll("_", " ")}</p>
                  </div>
                  <a href={`/api/documents/${doc.id}`} className="text-sm text-forest">
                    Download
                  </a>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
