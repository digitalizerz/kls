import { ClipboardList } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { deleteServiceJob } from "@/actions/delete";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { DataTablePagination } from "@/components/data-table/pagination";
import { RowIcons, SelectAll, SelectRow, TableSelection } from "@/components/data-table/row-actions";
import { SortHeader } from "@/components/data-table/sort-header";
import { DataTableToolbar } from "@/components/data-table/toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import {
  compactParams,
  pageRedirect,
  pageWindow,
  parseDir,
  parsePage,
  parsePageSize,
  pickSort,
  sortHref,
} from "@/lib/table-query";

const path = "/admin/service-records";
const sorts = ["completed", "customer"] as const;

export default async function AdminServiceRecordsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const customerId = sp.customer || undefined;
  const sort = pickSort(sp.sort, sorts) ?? "completed";
  const dir = parseDir(sp.dir, "desc");
  const pageSize = parsePageSize(sp.pageSize);
  const requested = parsePage(sp.page);
  const current = compactParams({
    q,
    customer: customerId,
    sort: sp.sort,
    dir: sp.dir,
    page: sp.page,
    pageSize: sp.pageSize,
  });
  const where: Prisma.ServiceRecordWhereInput = {
    ...(customerId ? { job: { customerId } } : {}),
    ...(q
      ? {
          job: {
            ...(customerId ? { customerId } : {}),
            OR: [
              { customer: { companyName: { contains: q, mode: "insensitive" } } },
              { location: { locationName: { contains: q, mode: "insensitive" } } },
            ],
          },
        }
      : {}),
  };
  const orderBy: Prisma.ServiceRecordOrderByWithRelationInput =
    sort === "customer" ? { job: { customer: { companyName: dir } } } : { completedAt: dir };

  const [total, customers] = await Promise.all([
    prisma.serviceRecord.count({ where }),
    prisma.customer.findMany({ select: { id: true, companyName: true }, orderBy: { companyName: "asc" } }),
  ]);
  const list = pageWindow(requested, pageSize, total);
  const fix = pageRedirect(path, current, requested, list.page);
  if (fix) redirect(fix);
  const records = await prisma.serviceRecord.findMany({
    where,
    include: {
      job: { include: { customer: true, location: true } },
      cleaningReport: true,
      complianceManifest: true,
    },
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || customerId);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
        title="Service records"
        description="Completion data captured on a job. This is what future reports and manifests will read from."
      />
      <DataTableToolbar
        pathname={path}
        current={current}
        placeholder="Search customer or facility..."
        filters={[
          {
            name: "customer",
            label: "Customer",
            options: customers.map((customer) => ({ value: customer.id, label: customer.companyName })),
          },
        ]}
      />
      <TableSelection
        ids={records.map((record) => record.jobId)}
        action={deleteServiceJob}
        returnTo="/admin/service-records"
        noun="service record"
        nouns="service records"
        confirm="The selected records are removed with their completed jobs, cleaning reports, and compliance manifests. Uploaded documents stay on the customer. This cannot be undone."
      >
      <Table
        footer={
          <DataTablePagination pathname={path} current={current} page={list.page} pages={list.pages} pageSize={pageSize} start={list.start} end={list.end} total={total} label="records" />
        }
      >
        <thead>
          <tr>
            <Th className="w-12">
              <SelectAll />
            </Th>
            <Th aria-sort={sort === "completed" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Completed" href={sortHref(path, current, "completed", sort, dir, "desc")} active={sort === "completed"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "customer" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Customer" href={sortHref(path, current, "customer", sort, dir)} active={sort === "customer"} dir={dir} />
            </Th>
            <Th>Location</Th>
            <Th>Gallons</Th>
            <Th>Report</Th>
            <Th>Manifest</Th>
            <Th className="w-28">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <Td colSpan={8} className="py-12 text-center text-dash-muted">
                {filtered ? "No service records match these filters." : "No service records yet."}
              </Td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id}>
                <Td>
                  <SelectRow id={record.jobId} label={record.job.customer.companyName} />
                </Td>
                <Td className="text-dash-muted">{formatDate(record.completedAt)}</Td>
                <Td className="font-semibold">{record.job.customer.companyName}</Td>
                <Td>{record.job.location.locationName}</Td>
                <Td>{record.gallonsRemoved ?? "—"}</Td>
                <Td>{record.cleaningReport ? <StatusBadge status={record.cleaningReport.status} /> : "—"}</Td>
                <Td>{record.complianceManifest ? <StatusBadge status={record.complianceManifest.status} /> : "—"}</Td>
                <Td>
                  <RowIcons
                    label={record.job.customer.companyName}
                    viewHref={`/admin/jobs/${record.jobId}`}
                    deleteId={record.jobId}
                  />
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
