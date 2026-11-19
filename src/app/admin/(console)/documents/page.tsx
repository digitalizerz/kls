import { FileText, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { deleteDocument } from "@/actions/delete";
import { uploadAdminDocument } from "@/actions/documents";
import { DataTablePagination } from "@/components/data-table/pagination";
import { RowIcons, SelectAll, SelectRow, TableSelection } from "@/components/data-table/row-actions";
import { SortHeader } from "@/components/data-table/sort-header";
import { DataTableToolbar } from "@/components/data-table/toolbar";
import { DocumentUploadForm } from "@/components/forms/document-upload-form";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate, formatServiceType } from "@/lib/format";
import {
  compactParams,
  oneOf,
  pageRedirect,
  pageWindow,
  parseDir,
  parsePage,
  parsePageSize,
  pickSort,
  sortHref,
  withParams,
} from "@/lib/table-query";

const path = "/admin/documents";
const sorts = ["title", "type", "date"] as const;
const types = ["COMPLIANCE_MANIFEST", "CLEANING_REPORT", "PREVIOUS_SERVICE_REPORT", "PHOTO", "OTHER"] as const;

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const type = oneOf(sp.type, types);
  const customerId = sp.customer || undefined;
  const sort = pickSort(sp.sort, sorts) ?? "date";
  const dir = parseDir(sp.dir, "desc");
  const pageSize = parsePageSize(sp.pageSize);
  const requested = parsePage(sp.page);
  const current = compactParams({
    q,
    type,
    customer: customerId,
    sort: sp.sort,
    dir: sp.dir,
    page: sp.page,
    pageSize: sp.pageSize,
  });
  const where: Prisma.DocumentWhereInput = {
    ...(type ? { type } : {}),
    ...(customerId ? { customerId } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { customer: { companyName: { contains: q, mode: "insensitive" } } },
            { location: { locationName: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };
  const orderBy: Prisma.DocumentOrderByWithRelationInput =
    sort === "title" ? { title: dir } : sort === "type" ? { type: dir } : { createdAt: dir };

  const [total, uploadCustomers, filterCustomers, locations] = await Promise.all([
    prisma.document.count({ where }),
    prisma.customer.findMany({
      where: { status: { not: "INACTIVE" } },
      select: { id: true, companyName: true },
      orderBy: { companyName: "asc" },
    }),
    prisma.customer.findMany({
      select: { id: true, companyName: true },
      orderBy: { companyName: "asc" },
    }),
    prisma.location.findMany({
      include: { customer: true },
      orderBy: { locationName: "asc" },
    }),
  ]);
  const list = pageWindow(requested, pageSize, total);
  const fix = pageRedirect(path, current, requested, list.page);
  if (fix) redirect(fix);
  const rows = await prisma.document.findMany({
    where,
    include: { customer: true, location: true },
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || type || customerId);
  const adding = sp.add === "1";
  const openHref = withParams(path, current, { add: "1" });
  const closeHref = withParams(path, current, { add: null });

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<FileText className="h-5 w-5" aria-hidden="true" />}
        title="Documents"
        description="Upload files against a customer. Download uses the storage adapter. Seed rows without a real file will return a 404."
        actions={
          <ButtonLink href={openHref} variant="lime" size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Document
          </ButtonLink>
        }
      />
      {adding ? (
        <DocumentUploadForm
          action={uploadAdminDocument}
          customers={uploadCustomers}
          locations={locations.map((location) => ({
            id: location.id,
            locationName: location.locationName,
            customerId: location.customerId,
          }))}
          defaultCustomerId={customerId}
          showVisibility
          cancelHref={closeHref}
        />
      ) : null}
      <DataTableToolbar
        pathname={path}
        current={current}
        placeholder="Search documents..."
        filters={[
          {
            name: "type",
            label: "Type",
            options: types.map((value) => ({ value, label: formatServiceType(value) })),
          },
          {
            name: "customer",
            label: "Customer",
            options: filterCustomers.map((customer) => ({ value: customer.id, label: customer.companyName })),
          },
        ]}
      />
      <TableSelection
        ids={rows.map((doc) => doc.id)}
        action={deleteDocument}
        returnTo="/admin/documents"
        noun="document"
        nouns="documents"
        confirm="The selected files are removed. This cannot be undone."
      >
      <Table
        footer={
          <DataTablePagination pathname={path} current={current} page={list.page} pages={list.pages} pageSize={pageSize} start={list.start} end={list.end} total={total} label="documents" />
        }
      >
        <thead>
          <tr>
            <Th className="w-12">
              <SelectAll />
            </Th>
            <Th aria-sort={sort === "title" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Title" href={sortHref(path, current, "title", sort, dir)} active={sort === "title"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "type" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Type" href={sortHref(path, current, "type", sort, dir)} active={sort === "type"} dir={dir} />
            </Th>
            <Th>Customer</Th>
            <Th>Location</Th>
            <Th aria-sort={sort === "date" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Date" href={sortHref(path, current, "date", sort, dir, "desc")} active={sort === "date"} dir={dir} />
            </Th>
            <Th className="w-28">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <Td colSpan={7} className="py-12 text-center text-dash-muted">
                {filtered ? "No documents match these filters." : "No documents yet."}
              </Td>
            </tr>
          ) : (
            rows.map((doc) => (
              <tr key={doc.id}>
                <Td>
                  <SelectRow id={doc.id} label={doc.title} />
                </Td>
                <Td className="font-semibold">{doc.title}</Td>
                <Td>{formatServiceType(doc.type)}</Td>
                <Td>{doc.customer?.companyName ?? "—"}</Td>
                <Td>{doc.location?.locationName ?? "—"}</Td>
                <Td className="text-dash-muted">{formatDate(doc.createdAt)}</Td>
                <Td>
                  <RowIcons label={doc.title} downloadHref={`/api/documents/${doc.id}`} deleteId={doc.id} />
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      </TableSelection>
    </div>
  );
}
