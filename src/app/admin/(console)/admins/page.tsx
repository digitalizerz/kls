import { Plus, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { deleteAdminAccount } from "@/actions/delete";
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

const path = "/admin/admins";
const sorts = ["name", "role"] as const;
const roles = ["ADMIN", "SUPER_ADMIN"] as const;

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const actor = await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const role = oneOf(sp.role, roles);
  const sort = pickSort(sp.sort, sorts);
  const dir = parseDir(sp.dir);
  const pageSize = parsePageSize(sp.pageSize);
  const requested = parsePage(sp.page);
  const current = compactParams({
    q,
    role,
    sort: sp.sort,
    dir: sp.dir,
    page: sp.page,
    pageSize: sp.pageSize,
  });
  const where: Prisma.UserWhereInput = {
    role: role ?? { in: [...roles] },
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const orderBy: Prisma.UserOrderByWithRelationInput = !sort
    ? { name: "asc" }
    : sort === "role"
      ? { role: dir }
      : { name: dir };

  const [total, superCount] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.count({ where: { role: "SUPER_ADMIN", isActive: true } }),
  ]);
  const list = pageWindow(requested, pageSize, total);
  const fix = pageRedirect(path, current, requested, list.page);
  if (fix) redirect(fix);
  const admins = await prisma.user.findMany({
    where,
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || role);
  const canEdit = actor.role === "SUPER_ADMIN";
  const deletableIds = canEdit
    ? admins
        .filter((admin) => admin.id !== actor.id && !(admin.role === "SUPER_ADMIN" && superCount <= 1))
        .map((admin) => admin.id)
    : [];
  const columns = 5 + (deletableIds.length > 0 ? 1 : 0) + (canEdit ? 1 : 0);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
        title="Admins"
        description="Operations accounts that can sign in to this console. Only a super admin can add another admin."
        actions={
          actor.role === "SUPER_ADMIN" ? (
            <ButtonLink href="/admin/admins/new" variant="lime" size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add admin
            </ButtonLink>
          ) : null
        }
      />
      <DataTableToolbar
        pathname={path}
        current={current}
        placeholder="Search admins..."
        filters={[
          {
            name: "role",
            label: "Role",
            options: roles.map((value) => ({ value, label: formatStatus(value) })),
          },
        ]}
      />
      <TableSelection
        ids={deletableIds}
        action={deleteAdminAccount}
        returnTo="/admin/admins"
        noun="admin"
        nouns="admins"
        confirm="The selected admins can no longer sign in to the operations console. This cannot be undone."
      >
      <Table
        footer={
          <DataTablePagination pathname={path} current={current} page={list.page} pages={list.pages} pageSize={pageSize} start={list.start} end={list.end} total={total} label="admins" />
        }
      >
        <thead>
          <tr>
            {deletableIds.length > 0 ? (
              <Th className="w-12">
                <SelectAll />
              </Th>
            ) : null}
            <Th aria-sort={sort === "name" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Name" href={sortHref(path, current, "name", sort, dir)} active={sort === "name"} dir={dir} />
            </Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th aria-sort={sort === "role" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Role" href={sortHref(path, current, "role", sort, dir)} active={sort === "role"} dir={dir} />
            </Th>
            <Th>Status</Th>
            {canEdit ? (
              <Th className="w-28">
                <span className="sr-only">Actions</span>
              </Th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {admins.length === 0 ? (
            <tr>
              <Td colSpan={columns} className="py-12 text-center text-dash-muted">
                {filtered ? "No admins match these filters." : "No admins yet."}
              </Td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin.id}>
                {deletableIds.length > 0 ? (
                  <Td>{deletableIds.includes(admin.id) ? <SelectRow id={admin.id} label={admin.name ?? "admin"} /> : null}</Td>
                ) : null}
                <Td className="font-semibold">{admin.name ?? "—"}</Td>
                <Td className="text-dash-muted">{admin.email}</Td>
                <Td>{admin.phone ?? "—"}</Td>
                <Td>
                  <StatusBadge status={admin.role} />
                </Td>
                <Td>
                  <StatusBadge status={admin.isActive ? "ACTIVE" : "INACTIVE"} />
                </Td>
                {canEdit ? (
                  <Td>
                    <RowIcons
                      label={admin.name ?? "admin"}
                      editHref={`/admin/admins/${admin.id}/edit`}
                      deleteId={deletableIds.includes(admin.id) ? admin.id : undefined}
                    />
                  </Td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </Table>
      </TableSelection>
    </div>
  );
}
