import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { DataTablePagination } from "@/components/data-table/pagination";
import { SortHeader } from "@/components/data-table/sort-header";
import { DataTableToolbar } from "@/components/data-table/toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate, formatStatus } from "@/lib/format";
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
} from "@/lib/table-query";

const path = "/admin/compliance";
const sorts = ["customer", "status", "service"] as const;
const statuses = ["DRAFT", "READY_FOR_GENERATION", "ISSUED", "SIGNED"] as const;

export default async function AdminCompliancePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const status = oneOf(sp.status, statuses);
  const sort = pickSort(sp.sort, sorts);
  const dir = parseDir(sp.dir, "desc");
  const pageSize = parsePageSize(sp.pageSize);
  const requested = parsePage(sp.page);
  const current = compactParams({
    q,
    status,
    sort: sp.sort,
    dir: sp.dir,
    page: sp.page,
    pageSize: sp.pageSize,
  });
  const where: Prisma.ComplianceManifestWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          serviceRecord: {
            job: {
              OR: [
                { customer: { companyName: { contains: q, mode: "insensitive" } } },
                { location: { locationName: { contains: q, mode: "insensitive" } } },
              ],
            },
          },
        }
      : {}),
  };
  const orderBy: Prisma.ComplianceManifestOrderByWithRelationInput = !sort
    ? { createdAt: "desc" }
    : sort === "customer"
      ? { serviceRecord: { job: { customer: { companyName: dir } } } }
      : sort === "status"
        ? { status: dir }
        : { serviceRecord: { completedAt: dir } };

  const total = await prisma.complianceManifest.count({ where });
  const list = pageWindow(requested, pageSize, total);
  const fix = pageRedirect(path, current, requested, list.page);
  if (fix) redirect(fix);
  const manifests = await prisma.complianceManifest.findMany({
    where,
    include: {
      serviceRecord: { include: { job: { include: { customer: true, location: true } } } },
    },
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || status);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
        title="Compliance"
        description="Placeholder records only. Official manifests will be generated from stored service data once the client template is provided. This is not a legal form."
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
        ]}
      />
      <Table
        footer={
          <DataTablePagination pathname={path} current={current} page={list.page} pages={list.pages} pageSize={pageSize} start={list.start} end={list.end} total={total} label="records" />
        }
      >
        <thead>
          <tr>
            <Th aria-sort={sort === "customer" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Customer" href={sortHref(path, current, "customer", sort, dir)} active={sort === "customer"} dir={dir} />
            </Th>
            <Th>Location</Th>
            <Th>Jurisdiction</Th>
            <Th aria-sort={sort === "status" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Status" href={sortHref(path, current, "status", sort, dir)} active={sort === "status"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "service" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Service date" href={sortHref(path, current, "service", sort, dir, "desc")} active={sort === "service"} dir={dir} />
            </Th>
          </tr>
        </thead>
        <tbody>
          {manifests.length === 0 ? (
            <tr>
              <Td colSpan={5} className="py-12 text-center text-dash-muted">
                {filtered ? "No compliance records match these filters." : "No compliance records yet."}
              </Td>
            </tr>
          ) : (
            manifests.map((manifest) => (
              <tr key={manifest.id}>
                <Td className="font-semibold">{manifest.serviceRecord.job.customer.companyName}</Td>
                <Td>{manifest.serviceRecord.job.location.locationName}</Td>
                <Td>{manifest.jurisdiction ?? "—"}</Td>
                <Td>
                  <StatusBadge status={manifest.status} />
                </Td>
                <Td className="text-dash-muted">{formatDate(manifest.serviceRecord.completedAt)}</Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
