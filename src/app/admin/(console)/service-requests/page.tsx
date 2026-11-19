import Link from "next/link";
import { Inbox } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { deleteServiceRequest } from "@/actions/delete";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { DataTablePagination } from "@/components/data-table/pagination";
import { RowIcons, SelectAll, SelectRow, TableSelection } from "@/components/data-table/row-actions";
import { SortHeader } from "@/components/data-table/sort-header";
import { DataTableToolbar } from "@/components/data-table/toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate, formatServiceType, formatStatus } from "@/lib/format";
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

const path = "/admin/service-requests";
const sorts = ["submitted", "customer", "preferred", "status"] as const;
const statuses = ["REQUESTED", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

export default async function AdminServiceRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const status = oneOf(sp.status, statuses);
  const customerId = sp.customer || undefined;
  const submitted = dayBounds(sp.date);
  const sort = pickSort(sp.sort, sorts) ?? "submitted";
  const dir = parseDir(sp.dir, "desc");
  const pageSize = parsePageSize(sp.pageSize);
  const requestedPage = parsePage(sp.page);
  const current = compactParams({
    q,
    status,
    customer: customerId,
    date: submitted ? sp.date : undefined,
    sort: sp.sort,
    dir: sp.dir,
    page: sp.page,
    pageSize: sp.pageSize,
  });
  const where: Prisma.ServiceRequestWhereInput = {
    ...(q
      ? {
          OR: [
            { customer: { companyName: { contains: q, mode: "insensitive" } } },
            { location: { locationName: { contains: q, mode: "insensitive" } } },
            { contactName: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(customerId ? { customerId } : {}),
    ...(submitted ? { createdAt: submitted } : {}),
  };
  const orderBy: Prisma.ServiceRequestOrderByWithRelationInput =
    sort === "customer"
      ? { customer: { companyName: dir } }
      : sort === "preferred"
        ? { preferredDate: dir }
        : sort === "status"
          ? { status: dir }
          : { createdAt: dir };

  const [total, customers] = await Promise.all([
    prisma.serviceRequest.count({ where }),
    prisma.customer.findMany({ select: { id: true, companyName: true }, orderBy: { companyName: "asc" } }),
  ]);
  const list = pageWindow(requestedPage, pageSize, total);
  const fix = pageRedirect(path, current, requestedPage, list.page);
  if (fix) redirect(fix);
  const requests = await prisma.serviceRequest.findMany({
    where,
    include: { customer: true, location: true },
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || status || customerId || submitted);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<Inbox className="h-5 w-5" aria-hidden="true" />}
        title="Service requests"
        description="Customer-submitted work. Scheduling a request creates a service job."
      />
      <DataTableToolbar
        pathname={path}
        current={current}
        placeholder="Search requests..."
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
          { name: "date", label: "Submitted", type: "date" },
        ]}
      />
      <TableSelection
        ids={requests.map((request) => request.id)}
        action={deleteServiceRequest}
        returnTo="/admin/service-requests"
        noun="service request"
        nouns="service requests"
        confirm="The selected requests are removed. A job already created from a request stays on the schedule. This cannot be undone."
      >
      <Table
        footer={
          <DataTablePagination pathname={path} current={current} page={list.page} pages={list.pages} pageSize={pageSize} start={list.start} end={list.end} total={total} label="requests" />
        }
      >
        <thead>
          <tr>
            <Th className="w-12">
              <SelectAll />
            </Th>
            <Th aria-sort={sort === "submitted" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Submitted" href={sortHref(path, current, "submitted", sort, dir, "desc")} active={sort === "submitted"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "customer" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Customer" href={sortHref(path, current, "customer", sort, dir)} active={sort === "customer"} dir={dir} />
            </Th>
            <Th>Location</Th>
            <Th>Type</Th>
            <Th aria-sort={sort === "preferred" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Preferred" href={sortHref(path, current, "preferred", sort, dir)} active={sort === "preferred"} dir={dir} />
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
          {requests.length === 0 ? (
            <tr>
              <Td colSpan={8} className="py-12 text-center text-dash-muted">
                {filtered ? "No requests match these filters." : "No service requests yet."}
              </Td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request.id}>
                <Td>
                  <SelectRow id={request.id} label={request.customer.companyName} />
                </Td>
                <Td className="text-dash-muted">{formatDate(request.createdAt)}</Td>
                <Td>
                  <Link href={`/admin/service-requests/${request.id}`} className="font-semibold text-dash-ink hover:text-dash-rich">
                    {request.customer.companyName}
                  </Link>
                </Td>
                <Td>{request.location.locationName}</Td>
                <Td>{formatServiceType(request.serviceType)}</Td>
                <Td className="text-dash-muted">{formatDate(request.preferredDate)}</Td>
                <Td>
                  <StatusBadge status={request.status} />
                </Td>
                <Td>
                  <RowIcons
                    label={request.customer.companyName}
                    viewHref={`/admin/service-requests/${request.id}`}
                    deleteId={request.id}
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
