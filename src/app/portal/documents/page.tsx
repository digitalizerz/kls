import { prisma } from "@/lib/db";
import { requirePortalContext } from "@/lib/session";
import { uploadPortalDocument } from "@/actions/documents";
import { DocumentUploadForm } from "@/components/forms/document-upload-form";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate, formatServiceType } from "@/lib/format";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; type?: string }>;
}) {
  const { location, type } = await searchParams;
  const { customer } = await requirePortalContext();
  const locations = await prisma.location.findMany({
    where: { customerId: customer.id },
    select: { id: true, locationName: true },
    orderBy: { locationName: "asc" },
  });

  const documents = await prisma.document.findMany({
    where: {
      customerId: customer.id,
      visibility: "CUSTOMER_VISIBLE",
      ...(location ? { locationId: location } : {}),
      ...(type ? { type: type as "COMPLIANCE_MANIFEST" | "CLEANING_REPORT" | "PREVIOUS_SERVICE_REPORT" | "PHOTO" | "OTHER" } : {}),
    },
    include: { location: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Upload previous reports or photos. Download works for files stored in this system. Seed example files are metadata-only."
      />
      <DocumentUploadForm
        action={uploadPortalDocument}
        locations={locations}
        defaultLocationId={location}
      />
      <form className="flex flex-col gap-3 sm:flex-row">
        <select name="location" defaultValue={location ?? ""} className="h-11 border border-line bg-white px-3 text-sm">
          <option value="">All locations</option>
          {locations.map((item) => (
            <option key={item.id} value={item.id}>
              {item.locationName}
            </option>
          ))}
        </select>
        <select name="type" defaultValue={type ?? ""} className="h-11 border border-line bg-white px-3 text-sm">
          <option value="">All types</option>
          <option value="COMPLIANCE_MANIFEST">Compliance manifest</option>
          <option value="CLEANING_REPORT">Cleaning report</option>
          <option value="PREVIOUS_SERVICE_REPORT">Previous service report</option>
          <option value="PHOTO">Photo</option>
          <option value="OTHER">Other</option>
        </select>
        <button type="submit" className="h-11 border border-forest bg-forest px-4 text-sm text-cream">
          Filter
        </button>
      </form>
      {documents.length === 0 ? (
        <EmptyState title="No documents match these filters" />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Type</Th>
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
                <Td>{doc.location?.locationName ?? "Account"}</Td>
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
      )}
    </div>
  );
}
