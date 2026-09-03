import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { uploadAdminDocument } from "@/actions/documents";
import { DocumentUploadForm } from "@/components/forms/document-upload-form";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate, formatServiceType } from "@/lib/format";

export default async function AdminDocumentsPage() {
  await requireAdmin();
  const [documents, customers, locations] = await Promise.all([
    prisma.document.findMany({
      include: { customer: true, location: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.findMany({
      where: { status: { not: "INACTIVE" } },
      select: { id: true, companyName: true },
      orderBy: { companyName: "asc" },
    }),
    prisma.location.findMany({
      include: { customer: true },
      orderBy: { locationName: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Upload files against a customer. Download uses the storage adapter. Seed rows without a real file will return a 404."
      />
      <DocumentUploadForm
        action={uploadAdminDocument}
        customers={customers}
        locations={locations.map((location) => ({
          id: location.id,
          locationName: `${location.customer.companyName} — ${location.locationName}`,
        }))}
        showVisibility
      />
      <Table>
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Type</Th>
            <Th>Customer</Th>
            <Th>Location</Th>
            <Th>Date</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <Td className="font-medium">{doc.title}</Td>
              <Td>{formatServiceType(doc.type)}</Td>
              <Td>{doc.customer?.companyName ?? "—"}</Td>
              <Td>{doc.location?.locationName ?? "—"}</Td>
              <Td>{formatDate(doc.createdAt)}</Td>
              <Td>
                <a href={`/api/documents/${doc.id}`} className="text-sm text-forest">
                  Download
                </a>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
