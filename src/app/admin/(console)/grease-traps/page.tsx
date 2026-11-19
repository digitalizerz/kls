import Link from "next/link";
import { Droplets } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { deleteGreaseTrap } from "@/actions/delete";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { DataTablePagination } from "@/components/data-table/pagination";
import { RowIcons, SelectAll, SelectRow, TableSelection } from "@/components/data-table/row-actions";
import { SortHeader } from "@/components/data-table/sort-header";
import { DataTableToolbar } from "@/components/data-table/toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { daysUntil, formatDate, formatFrequency, formatStatus } from "@/lib/format";
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
  startOfToday,
} from "@/lib/table-query";

const path = "/admin/grease-traps";
const sorts = ["trap", "customer", "capacity", "due", "status"] as const;
const statuses = ["ACTIVE", "INACTIVE"] as const;
const dues = ["overdue", "upcoming"] as const;

export default async function AdminGreaseTrapsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const status = oneOf(sp.status, statuses);
  const customerId = sp.customer || undefined;
  const locationId = sp.location || undefined;
  const due = oneOf(sp.due, dues);
  const sort = pickSort(sp.sort, sorts) ?? "due";
  const dir = parseDir(sp.dir, sort === "due" && !sp.dir ? "asc" : "asc");
  const pageSize = parsePageSize(sp.pageSize);
  const requested = parsePage(sp.page);
  const current = compactParams({
    q,
    status,
    customer: customerId,
    location: locationId,
    due,
    sort: sp.sort,
    dir: sp.dir,
    page: sp.page,
    pageSize: sp.pageSize,
  });
  const today = startOfToday();
  const where: Prisma.GreaseTrapWhereInput = {
    ...(q
      ? {
          OR: [
            { nameOrIdentifier: { contains: q, mode: "insensitive" } },
            { location: { locationName: { contains: q, mode: "insensitive" } } },
            { location: { customer: { companyName: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(due === "overdue" ? { nextRecommendedServiceAt: { lt: today } } : {}),
    ...(due === "upcoming" ? { nextRecommendedServiceAt: { gte: today } } : {}),
    ...(locationId || customerId
      ? {
          location: {
            ...(locationId ? { id: locationId } : {}),
            ...(customerId ? { customerId } : {}),
          },
        }
      : {}),
  };
  const orderBy: Prisma.GreaseTrapOrderByWithRelationInput =
    sort === "customer"
      ? { location: { customer: { companyName: dir } } }
      : sort === "capacity"
        ? { capacityGallons: dir }
        : sort === "status"
          ? { status: dir }
          : sort === "trap"
            ? { nameOrIdentifier: dir }
            : { nextRecommendedServiceAt: dir };

  const [total, customers, locations] = await Promise.all([
    prisma.greaseTrap.count({ where }),
    prisma.customer.findMany({ select: { id: true, companyName: true }, orderBy: { companyName: "asc" } }),
    prisma.location.findMany({
      where: customerId ? { customerId } : undefined,
      select: { id: true, locationName: true, customer: { select: { companyName: true } } },
      orderBy: { locationName: "asc" },
    }),
  ]);
  const list = pageWindow(requested, pageSize, total);
  const fix = pageRedirect(path, current, requested, list.page);
  if (fix) redirect(fix);
  const traps = await prisma.greaseTrap.findMany({
    where,
    include: { location: { include: { customer: true } } },
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || status || customerId || locationId || due);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<Droplets className="h-5 w-5" aria-hidden="true" />}
        title="Grease traps"
        description="Inventory across all customer locations."
      />
      <DataTableToolbar
        pathname={path}
        current={current}
        placeholder="Search interceptors..."
        filters={[
          {
            name: "customer",
            label: "Customer",
            clears: ["location"],
            options: customers.map((customer) => ({ value: customer.id, label: customer.companyName })),
          },
          {
            name: "location",
            label: "Location",
            options: locations.map((location) => ({
              value: location.id,
              label: customerId ? location.locationName : `${location.customer.companyName} — ${location.locationName}`,
            })),
          },
          {
            name: "status",
            label: "Status",
            options: statuses.map((value) => ({ value, label: formatStatus(value) })),
          },
          {
            name: "due",
            label: "Service",
            options: [
              { value: "overdue", label: "Overdue" },
              { value: "upcoming", label: "Upcoming" },
            ],
          },
        ]}
      />
      <TableSelection
        ids={traps.map((trap) => trap.id)}
        action={deleteGreaseTrap}
        returnTo="/admin/grease-traps"
        noun="grease trap"
        nouns="grease traps"
        confirm="The selected grease traps are removed from service requests and jobs. This cannot be undone."
      >
      <Table
        footer={
          <DataTablePagination pathname={path} current={current} page={list.page} pages={list.pages} pageSize={pageSize} start={list.start} end={list.end} total={total} label="traps" />
        }
      >
        <thead>
          <tr>
            <Th className="w-12">
              <SelectAll />
            </Th>
            <Th aria-sort={sort === "trap" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Trap" href={sortHref(path, current, "trap", sort, dir)} active={sort === "trap"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "customer" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Customer / location" href={sortHref(path, current, "customer", sort, dir)} active={sort === "customer"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "capacity" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Capacity" href={sortHref(path, current, "capacity", sort, dir)} active={sort === "capacity"} dir={dir} />
            </Th>
            <Th>Frequency</Th>
            <Th aria-sort={sort === "due" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Next due" href={sortHref(path, current, "due", sort, dir)} active={sort === "due"} dir={dir} />
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
          {traps.length === 0 ? (
            <tr>
              <Td colSpan={8} className="py-12 text-center text-dash-muted">
                {filtered ? "No grease traps match these filters." : "No grease traps yet."}
              </Td>
            </tr>
          ) : (
            traps.map((trap) => {
              const days = daysUntil(trap.nextRecommendedServiceAt);
              return (
                <tr key={trap.id}>
                  <Td>
                    <SelectRow id={trap.id} label={trap.nameOrIdentifier} />
                  </Td>
                  <Td>
                    <Link href={`/admin/locations/${trap.locationId}/traps/${trap.id}/edit`} className="font-semibold text-dash-ink hover:text-dash-rich">
                      {trap.nameOrIdentifier}
                    </Link>
                  </Td>
                  <Td>
                    <p className="font-medium">{trap.location.customer.companyName}</p>
                    <p className="text-xs text-dash-muted">{trap.location.locationName}</p>
                  </Td>
                  <Td>{trap.capacityGallons ? `${trap.capacityGallons} gal` : "—"}</Td>
                  <Td>{formatFrequency(trap.cleaningFrequency, trap.customFrequencyDays)}</Td>
                  <Td>
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{formatDate(trap.nextRecommendedServiceAt)}</span>
                      {days !== null && days < 0 ? <StatusBadge status="OVERDUE" /> : null}
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge status={trap.status} />
                  </Td>
                  <Td>
                    <RowIcons
                      label={trap.nameOrIdentifier}
                      editHref={`/admin/locations/${trap.locationId}/traps/${trap.id}/edit`}
                      deleteId={trap.id}
                    />
                  </Td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
      </TableSelection>
    </div>
  );
}
