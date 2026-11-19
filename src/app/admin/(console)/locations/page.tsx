import Link from "next/link";
import { Building2, MapPin, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { deleteLocation } from "@/actions/delete";
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
import { formatAddress, formatStatus } from "@/lib/format";
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

const path = "/admin/locations";
const sorts = ["location", "customer", "address", "traps", "status"] as const;
const statuses = ["ACTIVE", "INACTIVE"] as const;

export default async function AdminLocationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const status = oneOf(sp.status, statuses);
  const customerId = sp.customer || undefined;
  const traps = oneOf(sp.traps, ["with", "without"] as const);
  const sort = pickSort(sp.sort, sorts) ?? "location";
  const dir = parseDir(sp.dir);
  const pageSize = parsePageSize(sp.pageSize);
  const requested = parsePage(sp.page);
  const current = compactParams({
    q,
    status,
    customer: customerId,
    traps,
    sort: sp.sort,
    dir: sp.dir,
    page: sp.page,
    pageSize: sp.pageSize,
  });

  const where: Prisma.LocationWhereInput = {
    ...(q
      ? {
          OR: [
            { locationName: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { customer: { companyName: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(customerId ? { customerId } : {}),
    ...(traps === "with" ? { greaseTraps: { some: {} } } : {}),
    ...(traps === "without" ? { greaseTraps: { none: {} } } : {}),
  };
  const orderBy: Prisma.LocationOrderByWithRelationInput =
    sort === "customer"
      ? { customer: { companyName: dir } }
      : sort === "address"
        ? { city: dir }
        : sort === "traps"
          ? { greaseTraps: { _count: dir } }
          : sort === "status"
            ? { status: dir }
            : { locationName: dir };

  const [total, customers] = await Promise.all([
    prisma.location.count({ where }),
    prisma.customer.findMany({
      select: { id: true, companyName: true },
      orderBy: { companyName: "asc" },
    }),
  ]);
  const list = pageWindow(requested, pageSize, total);
  const fix = pageRedirect(path, current, requested, list.page);
  if (fix) redirect(fix);

  const locations = await prisma.location.findMany({
    where,
    include: { customer: true, _count: { select: { greaseTraps: true } } },
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || status || customerId || traps);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<Building2 className="h-5 w-5" aria-hidden="true" />}
        title="Locations"
        description="All service sites across customer accounts."
        actions={
          <ButtonLink href={customerId ? `/admin/locations/new?customer=${customerId}` : "/admin/locations/new"} variant="lime" size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add location
          </ButtonLink>
        }
      />
      <DataTableToolbar
        pathname={path}
        current={current}
        placeholder="Search location, city, or customer..."
        filters={[
          {
            name: "status",
            label: "Status",
            options: statuses.map((value) => ({ value, label: formatStatus(value) })),
          },
          {
            name: "customer",
            label: "Customer",
            options: customers.map((customer) => ({ value: customer.id, label: customer.companyName })),
          },
          {
            name: "traps",
            label: "Traps",
            options: [
              { value: "with", label: "Has traps" },
              { value: "without", label: "No traps" },
            ],
          },
        ]}
      />
      <TableSelection
        ids={locations.map((location) => location.id)}
        action={deleteLocation}
        returnTo="/admin/locations"
        noun="location"
        nouns="locations"
        confirm="Grease traps, service requests, and jobs for the selected locations are removed. Documents stay on the customer account. This cannot be undone."
      >
      <Table
        footer={
          <DataTablePagination
            pathname={path}
            current={current}
            page={list.page}
            pages={list.pages}
            pageSize={pageSize}
            start={list.start}
            end={list.end}
            total={total}
            label="locations"
          />
        }
      >
        <thead>
          <tr>
            <Th className="w-12">
              <SelectAll />
            </Th>
            <Th aria-sort={sort === "location" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Location" href={sortHref(path, current, "location", sort, dir)} active={sort === "location"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "customer" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Customer" href={sortHref(path, current, "customer", sort, dir)} active={sort === "customer"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "address" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Address" href={sortHref(path, current, "address", sort, dir)} active={sort === "address"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "traps" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Traps" href={sortHref(path, current, "traps", sort, dir)} active={sort === "traps"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "status" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Status" href={sortHref(path, current, "status", sort, dir)} active={sort === "status"} dir={dir} />
            </Th>
            <Th className="w-36">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {locations.length === 0 ? (
            <tr>
              <Td colSpan={7} className="py-12 text-center text-dash-muted">
                {filtered ? "No locations match these filters." : "No locations yet."}
              </Td>
            </tr>
          ) : (
            locations.map((location) => (
              <tr key={location.id}>
                <Td>
                  <SelectRow id={location.id} label={location.locationName} />
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e7f5ee] text-dash-rich">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <Link href={`/admin/locations/${location.id}`} className="font-semibold text-dash-ink hover:text-dash-rich">
                      {location.locationName}
                    </Link>
                  </div>
                </Td>
                <Td>{location.customer.companyName}</Td>
                <Td>
                  <span className="inline-flex items-start gap-2 text-dash-muted">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{formatAddress(location)}</span>
                  </span>
                </Td>
                <Td className="font-semibold">{location._count.greaseTraps}</Td>
                <Td>
                  <StatusBadge status={location.status} />
                </Td>
                <Td>
                  <RowIcons
                    label={location.locationName}
                    viewHref={`/admin/locations/${location.id}`}
                    editHref={`/admin/locations/${location.id}/edit`}
                    deleteId={location.id}
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
