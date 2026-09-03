import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate, formatServiceType } from "@/lib/format";

export default async function AdminServiceRequestsPage() {
  await requireAdmin();
  const requests = await prisma.serviceRequest.findMany({
    include: { customer: true, location: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service requests"
        description="Customer-submitted work. Scheduling a request creates a service job."
      />
      <Table>
        <thead>
          <tr>
            <Th>Submitted</Th>
            <Th>Customer</Th>
            <Th>Location</Th>
            <Th>Type</Th>
            <Th>Preferred</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <Td>{formatDate(request.createdAt)}</Td>
              <Td>
                <Link href={`/admin/service-requests/${request.id}`} className="font-medium hover:text-forest">
                  {request.customer.companyName}
                </Link>
              </Td>
              <Td>{request.location.locationName}</Td>
              <Td>{formatServiceType(request.serviceType)}</Td>
              <Td>{formatDate(request.preferredDate)}</Td>
              <Td>
                <StatusBadge status={request.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
