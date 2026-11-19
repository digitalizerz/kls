import { HardHat, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { deleteTechnician } from "@/actions/delete";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { DataTablePagination } from "@/components/data-table/pagination";
import { RowIcons, SelectAll, SelectRow, TableSelection } from "@/components/data-table/row-actions";
import { SortHeader } from "@/components/data-table/sort-header";
import { DataTableToolbar } from "@/components/data-table/toolbar";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatStatus } from "@/lib/format";
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

const path = "/admin/technicians";
const sorts = ["name", "jobs", "status"] as const;
const statuses = ["ACTIVE", "INACTIVE"] as const;

export default async function AdminTechniciansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const status = oneOf(sp.status, statuses);
  const sort = pickSort(sp.sort, sorts);
  const dir = parseDir(sp.dir);
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
  const where: Prisma.TechnicianWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { user: { name: { contains: q, mode: "insensitive" } } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { employeeId: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const orderBy: Prisma.TechnicianOrderByWithRelationInput = !sort
    ? { createdAt: "asc" }
    : sort === "jobs"
      ? { jobs: { _count: dir } }
      : sort === "status"
        ? { status: dir }
        : { user: { name: dir } };

  const total = await prisma.technician.count({ where });
  const list = pageWindow(requested, pageSize, total);
  const fix = pageRedirect(path, current, requested, list.page);
  if (fix) redirect(fix);
  const technicians = await prisma.technician.findMany({
    where,
    include: { user: true, _count: { select: { jobs: true } } },
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || status);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<HardHat className="h-5 w-5" aria-hidden="true" />}
        title="Technicians"
        description="Field logins use the same credentials as the technician portal. Assigned jobs show there for start, photos, and completion."
        actions={
          <ButtonLink href="/admin/technicians/new" variant="lime" size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add technician
          </ButtonLink>
        }
      />
      <DataTableToolbar
        pathname={path}
        current={current}
        placeholder="Search technicians..."
        filters={[
          {
            name: "status",
            label: "Status",
            options: statuses.map((value) => ({ value, label: formatStatus(value) })),
          },
        ]}
      />
      <TableSelection
        ids={technicians.map((tech) => tech.id)}
        action={deleteTechnician}
        returnTo="/admin/technicians"
        noun="technician"
        nouns="technicians"
        confirm="The selected technician logins are removed. Jobs already assigned stay on the schedule without a technician. This cannot be undone."
      >
      <Table
        footer={
          <DataTablePagination pathname={path} current={current} page={list.page} pages={list.pages} pageSize={pageSize} start={list.start} end={list.end} total={total} label="technicians" />
        }
      >
        <thead>
          <tr>
            <Th className="w-12">
              <SelectAll />
            </Th>
            <Th aria-sort={sort === "name" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Name" href={sortHref(path, current, "name", sort, dir)} active={sort === "name"} dir={dir} />
            </Th>
            <Th>Email</Th>
            <Th>Employee ID</Th>
            <Th aria-sort={sort === "jobs" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Jobs" href={sortHref(path, current, "jobs", sort, dir)} active={sort === "jobs"} dir={dir} />
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
          {technicians.length === 0 ? (
            <tr>
              <Td colSpan={7} className="py-12 text-center text-dash-muted">
                {filtered ? "No technicians match these filters." : "No technicians yet."}
              </Td>
            </tr>
          ) : (
            technicians.map((tech) => (
              <tr key={tech.id}>
                <Td>
                  <SelectRow id={tech.id} label={tech.user.name ?? "technician"} />
                </Td>
                <Td className="font-semibold">{tech.user.name}</Td>
                <Td className="text-dash-muted">{tech.user.email}</Td>
                <Td>{tech.employeeId ?? "—"}</Td>
                <Td className="font-semibold">{tech._count.jobs}</Td>
                <Td>
                  <StatusBadge status={tech.status} />
                </Td>
                <Td>
                  <RowIcons
                    label={tech.user.name ?? "technician"}
                    editHref={`/admin/technicians/${tech.id}/edit`}
                    deleteId={tech.id}
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
