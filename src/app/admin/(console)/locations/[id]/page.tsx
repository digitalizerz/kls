import { notFound } from "next/navigation";
import { deleteGreaseTrap, deleteLocation } from "@/actions/delete";
import { RowIcons, SelectAll, SelectRow, TableSelection } from "@/components/data-table/row-actions";
import { DeleteButton } from "@/components/forms/delete-button";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatAddress, formatDate, formatFrequency } from "@/lib/format";

export default async function AdminLocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      customer: true,
      greaseTraps: true,
      serviceJobs: { orderBy: { scheduledAt: "desc" }, take: 10 },
      documents: { orderBy: { createdAt: "desc" }, take: 8 },
    },
  });
  if (!location) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={location.customer.companyName}
        title={location.locationName}
        description={formatAddress(location)}
        actions={
          <>
            <ButtonLink href={`/admin/locations/${location.id}/edit`} variant="secondary" size="sm">
              Edit location
            </ButtonLink>
            <ButtonLink href={`/admin/locations/${location.id}/traps/new`} size="sm">
              Add grease trap
            </ButtonLink>
            <DeleteButton
              action={deleteLocation}
              fields={{ id: location.id, returnTo: "/admin/locations" }}
              title="Delete this location?"
              confirm="Delete this location? Its grease traps, service requests, and jobs are removed. Documents stay on the customer account."
            />
          </>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Water purveyor</p>
          <p className="mt-2 font-medium">{location.waterPurveyor ?? "—"}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Site contact</p>
          <p className="mt-2 font-medium">{location.contactName ?? "—"}</p>
          <p className="text-sm text-muted">{location.contactPhone}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Status</p>
          <div className="mt-2">
            <StatusBadge status={location.status} />
          </div>
        </Card>
      </div>
      <Card>
        <CardTitle>Grease traps</CardTitle>
        <TableSelection
          ids={location.greaseTraps.map((trap) => trap.id)}
          action={deleteGreaseTrap}
          returnTo={`/admin/locations/${location.id}`}
          noun="grease trap"
          nouns="grease traps"
          confirm="The selected grease traps are removed from service requests and jobs. This cannot be undone."
        >
        <Table className="mt-4 rounded-none border-0 shadow-none">
          <thead>
            <tr>
              {location.greaseTraps.length > 0 ? (
                <Th className="w-12">
                  <SelectAll />
                </Th>
              ) : null}
              <Th>Identifier</Th>
              <Th>Capacity</Th>
              <Th>Frequency</Th>
              <Th>Last cleaned</Th>
              <Th>Next due</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {location.greaseTraps.map((trap) => (
              <tr key={trap.id}>
                <Td>
                  <SelectRow id={trap.id} label={trap.nameOrIdentifier} />
                </Td>
                <Td className="font-medium">{trap.nameOrIdentifier}</Td>
                <Td>{trap.capacityGallons ? `${trap.capacityGallons} gal` : "—"}</Td>
                <Td>{formatFrequency(trap.cleaningFrequency, trap.customFrequencyDays)}</Td>
                <Td>{formatDate(trap.lastCleanedAt)}</Td>
                <Td>{formatDate(trap.nextRecommendedServiceAt)}</Td>
                <Td>
                  <RowIcons
                    label={trap.nameOrIdentifier}
                    editHref={`/admin/locations/${location.id}/traps/${trap.id}/edit`}
                    deleteId={trap.id}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        </TableSelection>
      </Card>
    </div>
  );
}
