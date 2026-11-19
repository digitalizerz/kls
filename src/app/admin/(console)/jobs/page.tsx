import Link from "next/link";
import { CalendarClock } from "lucide-react";
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
import { formatDateTime, formatServiceType, formatStatus } from "@/lib/format";
import {
  compactParams,
  dayBounds,
  oneOf,
  pageRedirect,
  pageWindow,
  parseDir,
  parsePage,
  parsePageSize,
  pickSort,
  sortHref,
} from "@/lib/table-query";

const path = "/admin/jobs";
const sorts = ["when", "customer", "technician", "status"] as const;
const statuses = ["REQUESTED", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const status = oneOf(sp.status, statuses);
  const technicianId = sp.tech || undefined;
  const scheduled = dayBounds(sp.date);
  const sort = pickSort(sp.sort, sorts) ?? "when";
  const dir = parseDir(sp.dir);
  const pageSize = parsePageSize(sp.pageSize);
  const requested = parsePage(sp.page);
  const current = compactParams({
    q,
    status,
    tech: technicianId,
    date: scheduled ? sp.date : undefined,
    sort: sp.sort,
    dir: sp.dir,
    page: sp.page,
    pageSize: sp.pageSize,
  });
  const where: Prisma.ServiceJobWhereInput = {
    ...(q
      ? {
          OR: [
            { customer: { companyName: { contains: q, mode: "insensitive" } } },
            { location: { locationName: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(technicianId ? { technicianId } : {}),
    ...(scheduled ? { scheduledAt: scheduled } : {}),
  };
  const orderBy: Prisma.ServiceJobOrderByWithRelationInput =
    sort === "customer"
      ? { customer: { companyName: dir } }
      : sort === "technician"
        ? { technician: { user: { name: dir } } }
        : sort === "status"
          ? { status: dir }
          : { scheduledAt: dir };

  const [total, technicians] = await Promise.all([
    prisma.serviceJob.count({ where }),
    prisma.technician.findMany({
      select: { id: true, user: { select: { name: true } } },
      orderBy: { user: { name: "asc" } },
    }),
  ]);
  const list = pageWindow(requested, pageSize, total);
  const fix = pageRedirect(path, current, requested, list.page);
  if (fix) redirect(fix);
  const jobs = await prisma.serviceJob.findMany({
    where,
    include: { customer: true, location: true, technician: { include: { user: true } } },
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || status || technicianId || scheduled);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<CalendarClock className="h-5 w-5" aria-hidden="true" />}
        title="Schedule / jobs"
        description="Confirmed work. Assign a technician so the job appears in the field portal."
      />
      <DataTableToolbar
        pathname={path}
        current={current}
        placeholder="Search customer or location..."
        filters={[
          {
            name: "status",
            label: "Status",
            options: statuses.map((value) => ({ value, label: formatStatus(value) })),
          },
          { name: "date", label: "Scheduled", type: "date" },
          {
            name: "tech",
            label: "Technician",
            options: technicians.map((tech) => ({ value: tech.id, label: tech.user.name ?? "Unnamed technician" })),
          },
        ]}
      />
      <TableSelection
        ids={jobs.map((job) => job.id)}
        action={deleteServiceJob}
        returnTo="/admin/jobs"
        noun="job"
        nouns="jobs"
        confirm="The selected jobs are removed, including their service records, cleaning reports, and compliance manifests. Uploaded documents stay on the customer. This cannot be undone."
      >
      <Table
        footer={
          <DataTablePagination pathname={path} current={current} page={list.page} pages={list.pages} pageSize={pageSize} start={list.start} end={list.end} total={total} label="jobs" />
        }
      >
        <thead>
          <tr>
            <Th className="w-12">
              <SelectAll />
            </Th>
            <Th aria-sort={sort === "when" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="When" href={sortHref(path, current, "when", sort, dir)} active={sort === "when"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "customer" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Customer" href={sortHref(path, current, "customer", sort, dir)} active={sort === "customer"} dir={dir} />
            </Th>
            <Th>Location</Th>
            <Th>Type</Th>
            <Th aria-sort={sort === "technician" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Technician" href={sortHref(path, current, "technician", sort, dir)} active={sort === "technician"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "status" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Status" href={sortHref(path, current, "status", sort, dir)} active={sort === "status"} dir={dir} />
            </Th>
            <Th className="w-28">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <Td colSpan={8} className="py-12 text-center text-dash-muted">
                {filtered ? "No jobs match these filters." : "No jobs yet."}
              </Td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job.id}>
                <Td>
                  <SelectRow id={job.id} label={job.customer.companyName} />
                </Td>
                <Td className="text-dash-muted">{formatDateTime(job.scheduledAt)}</Td>
                <Td>
                  <Link href={`/admin/jobs/${job.id}`} className="font-semibold text-dash-ink hover:text-dash-rich">
                    {job.customer.companyName}
                  </Link>
                </Td>
                <Td>{job.location.locationName}</Td>
                <Td>{formatServiceType(job.serviceType)}</Td>
                <Td>{job.technician?.user.name ?? "Unassigned"}</Td>
                <Td>
                  <StatusBadge status={job.status} />
                </Td>
                <Td>
                  <RowIcons label={job.customer.companyName} viewHref={`/admin/jobs/${job.id}`} deleteId={job.id} />
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
