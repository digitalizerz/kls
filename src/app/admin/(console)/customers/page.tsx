import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { ButtonLink } from "@/components/ui/button-link";
import { formatDate } from "@/lib/format";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q } = await searchParams;
  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { companyName: { contains: q, mode: "insensitive" } },
            { contactName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { _count: { select: { locations: true } } },
    orderBy: { companyName: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Commercial accounts. Traps and jobs hang off locations, not the login."
        actions={<ButtonLink href="/admin/customers/new">Create customer</ButtonLink>}
      />
      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search company, contact, or email"
          className="h-11 w-full max-w-md border border-line bg-white px-3 text-sm"
        />
        <button type="submit" className="h-11 bg-forest px-4 text-sm text-cream">
          Search
        </button>
      </form>
      <Table>
        <thead>
          <tr>
            <Th>Company</Th>
            <Th>Contact</Th>
            <Th>Locations</Th>
            <Th>Status</Th>
            <Th>Created</Th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <Td>
                <Link href={`/admin/customers/${customer.id}`} className="font-medium hover:text-forest">
                  {customer.companyName}
                </Link>
              </Td>
              <Td>
                {customer.contactName}
                <div className="text-xs text-muted">{customer.email}</div>
              </Td>
              <Td>{customer._count.locations}</Td>
              <Td>
                <StatusBadge status={customer.status} />
              </Td>
              <Td>{formatDate(customer.createdAt)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
