import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { deleteCustomer } from "@/actions/delete";
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

const path = "/admin/customers";
const sorts = ["company", "contact", "locations", "status", "created"] as const;
const statuses = ["PENDING_ONBOARDING", "ACTIVE", "INACTIVE", "SUSPENDED"] as const;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const status = oneOf(sp.status, statuses);
  const sort = pickSort(sp.sort, sorts) ?? "company";
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
  const where: Prisma.CustomerWhereInput = {
    ...(q
      ? {
          OR: [
            { companyName: { contains: q, mode: "insensitive" } },
            { contactName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
  };
  const orderBy: Prisma.CustomerOrderByWithRelationInput =
    sort === "contact"
      ? { contactName: dir }
      : sort === "locations"
        ? { locations: { _count: dir } }
        : sort === "status"
          ? { status: dir }
          : sort === "created"
            ? { createdAt: dir }
            : { companyName: dir };

  const total = await prisma.customer.count({ where });
  const list = pageWindow(requested, pageSize, total);
  const fix = pageRedirect(path, current, requested, list.page);
  if (fix) redirect(fix);
  const customers = await prisma.customer.findMany({
    where,
    include: { _count: { select: { locations: true } } },
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || status);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<Users className="h-5 w-5" aria-hidden="true" />}
        title="Customers"
        description="Commercial accounts. Traps and jobs hang off locations, not the login."
        actions={
          <ButtonLink href="/admin/customers/new" variant="lime" size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create customer
          </ButtonLink>
        }
      />
      <DataTableToolbar
        pathname={path}
        current={current}
        placeholder="Search customers..."
        filters={[
          {
            name: "status",
            label: "Status",
            options: statuses.map((value) => ({ value, label: formatStatus(value) })),
          },
        ]}
      />
      <TableSelection
        ids={customers.map((customer) => customer.id)}
        action={deleteCustomer}
        returnTo="/admin/customers"
        noun="customer"
        nouns="customers"
        confirm="Locations, grease traps, requests, jobs, service records, documents, and portal logins for the selected accounts are removed. This cannot be undone."
      >
      <Table
        footer={
          <DataTablePagination pathname={path} current={current} page={list.page} pages={list.pages} pageSize={pageSize} start={list.start} end={list.end} total={total} label="customers" />
        }
      >
        <thead>
          <tr>
            <Th className="w-12">
              <SelectAll />
            </Th>
            <Th aria-sort={sort === "company" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Company" href={sortHref(path, current, "company", sort, dir)} active={sort === "company"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "contact" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Contact" href={sortHref(path, current, "contact", sort, dir)} active={sort === "contact"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "locations" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Locations" href={sortHref(path, current, "locations", sort, dir)} active={sort === "locations"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "status" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Status" href={sortHref(path, current, "status", sort, dir)} active={sort === "status"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "created" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Created" href={sortHref(path, current, "created", sort, dir, "desc")} active={sort === "created"} dir={dir} />
            </Th>
            <Th className="w-36">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <Td colSpan={7} className="py-12 text-center text-dash-muted">
                {filtered ? "No customers match these filters." : "No customers yet."}
              </Td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id}>
                <Td>
                  <SelectRow id={customer.id} label={customer.companyName} />
                </Td>
                <Td>
                  <Link href={`/admin/customers/${customer.id}`} className="font-semibold text-dash-ink hover:text-dash-rich">
                    {customer.companyName}
                  </Link>
                </Td>
                <Td>
                  <p className="font-medium">{customer.contactName}</p>
                  <p className="text-xs text-dash-muted">{customer.email}</p>
                  <p className="text-xs text-dash-muted">{customer.phone}</p>
                </Td>
                <Td className="font-semibold">{customer._count.locations}</Td>
                <Td>
                  <StatusBadge status={customer.status} />
                </Td>
                <Td className="text-dash-muted">{formatDate(customer.createdAt)}</Td>
                <Td>
                  <RowIcons
                    label={customer.companyName}
                    viewHref={`/admin/customers/${customer.id}`}
                    editHref={`/admin/customers/${customer.id}/edit`}
                    deleteId={customer.id}
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
