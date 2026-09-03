import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { daysUntil, formatDate, formatFrequency } from "@/lib/format";
import Link from "next/link";

export default async function AdminGreaseTrapsPage() {
  await requireAdmin();
  const traps = await prisma.greaseTrap.findMany({
    include: { location: { include: { customer: true } } },
    orderBy: { nextRecommendedServiceAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Grease traps" description="Inventory across all customer locations." />
      <Table>
        <thead>
          <tr>
            <Th>Trap</Th>
            <Th>Customer / location</Th>
            <Th>Capacity</Th>
            <Th>Frequency</Th>
            <Th>Next due</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {traps.map((trap) => {
            const due = daysUntil(trap.nextRecommendedServiceAt);
            return (
              <tr key={trap.id}>
                <Td>
                  <Link href={`/admin/locations/${trap.locationId}/traps/${trap.id}/edit`} className="font-medium hover:text-forest">
                    {trap.nameOrIdentifier}
                  </Link>
                </Td>
                <Td>
                  {trap.location.customer.companyName}
                  <div className="text-xs text-muted">{trap.location.locationName}</div>
                </Td>
                <Td>{trap.capacityGallons ? `${trap.capacityGallons} gal` : "—"}</Td>
                <Td>{formatFrequency(trap.cleaningFrequency, trap.customFrequencyDays)}</Td>
                <Td>
                  {formatDate(trap.nextRecommendedServiceAt)}
                  {due !== null && due < 0 ? (
                    <span className="ml-2 text-xs text-danger">Overdue</span>
                  ) : null}
                </Td>
                <Td>
                  <StatusBadge status={trap.status} />
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
