import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatAddress } from "@/lib/format";

export default async function AdminLocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q } = await searchParams;
  const locations = await prisma.location.findMany({
    where: q
      ? {
          OR: [
            { locationName: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { customer: { companyName: { contains: q, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: { customer: true, _count: { select: { greaseTraps: true } } },
    orderBy: { locationName: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Locations" description="All service sites across customer accounts." />
      <form>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search location, city, or customer"
          className="h-11 w-full max-w-md border border-line bg-white px-3 text-sm"
        />
      </form>
      <Table>
        <thead>
          <tr>
            <Th>Location</Th>
            <Th>Customer</Th>
            <Th>Address</Th>
            <Th>Traps</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <Td>
                <Link href={`/admin/locations/${location.id}`} className="font-medium hover:text-forest">
                  {location.locationName}
                </Link>
              </Td>
              <Td>{location.customer.companyName}</Td>
              <Td className="text-muted">{formatAddress(location)}</Td>
              <Td>{location._count.greaseTraps}</Td>
              <Td>
                <StatusBadge status={location.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
