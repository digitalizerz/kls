import { Bell } from "lucide-react";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { reminderHref, syncAllReminders } from "@/lib/reminders";
import { DataTablePagination } from "@/components/data-table/pagination";
import { RowIcons } from "@/components/data-table/row-actions";
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
  startOfToday,
} from "@/lib/table-query";

const path = "/admin/reminders";
const sorts = ["customer", "type", "title", "due", "read"] as const;
const types = ["UPCOMING_SERVICE", "OVERDUE_SERVICE", "SCHEDULED_SERVICE", "SERVICE_COMPLETED", "DOCUMENT_AVAILABLE", "GENERAL"] as const;
const views = ["unread", "read", "overdue"] as const;

export default async function AdminRemindersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  await syncAllReminders();
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const type = oneOf(sp.type, types);
  const view = oneOf(sp.view, views);
  const sort = pickSort(sp.sort, sorts);
  const dir = parseDir(sp.dir, sort === "due" || sort === "read" ? "desc" : "asc");
  const pageSize = parsePageSize(sp.pageSize);
  const requested = parsePage(sp.page);
  const current = compactParams({
    q,
    type,
    view,
    sort: sp.sort,
    dir: sp.dir,
    page: sp.page,
    pageSize: sp.pageSize,
  });
  const today = startOfToday();
  const where: Prisma.NotificationWhereInput = {
    AND: [
      { channel: "IN_APP", status: { in: ["PENDING", "SENT"] } },
      ...(type ? [{ type }] : []),
      ...(view === "unread" ? [{ readAt: null }] : []),
      ...(view === "read" ? [{ readAt: { not: null } }] : []),
      ...(view === "overdue"
        ? [{ OR: [{ type: "OVERDUE_SERVICE" as const }, { scheduledFor: { lt: today } }] }]
        : []),
      ...(q
        ? [
            {
              OR: [
                { title: { contains: q, mode: "insensitive" as const } },
                { customer: { companyName: { contains: q, mode: "insensitive" as const } } },
              ],
            },
          ]
        : []),
    ],
  };
  const orderBy: Prisma.NotificationOrderByWithRelationInput = !sort
    ? { createdAt: "desc" }
    : sort === "customer"
      ? { customer: { companyName: dir } }
      : sort === "type"
        ? { type: dir }
        : sort === "title"
          ? { title: dir }
          : sort === "read"
            ? { readAt: dir }
            : { scheduledFor: dir };

  const total = await prisma.notification.count({ where });
  const list = pageWindow(requested, pageSize, total);
  const fix = pageRedirect(path, current, requested, list.page);
  if (fix) redirect(fix);
  const reminders = await prisma.notification.findMany({
    where,
    include: { customer: true },
    orderBy,
    skip: list.skip,
    take: pageSize,
  });
  const filtered = Boolean(q || type || view);

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<Bell className="h-5 w-5" aria-hidden="true" />}
        title="Reminder schedule"
        description="In-app notices created from trap due dates, scheduled jobs, and completed service. Email is not sent yet."
      />
      <DataTableToolbar
        pathname={path}
        current={current}
        placeholder="Search reminders..."
        filters={[
          {
            name: "view",
            label: "Read",
            options: [
              { value: "unread", label: "Unread" },
              { value: "read", label: "Read" },
              { value: "overdue", label: "Overdue" },
            ],
          },
          {
            name: "type",
            label: "Type",
            options: types.map((value) => ({ value, label: formatStatus(value) })),
          },
        ]}
      />
      <Table
        footer={
          <DataTablePagination pathname={path} current={current} page={list.page} pages={list.pages} pageSize={pageSize} start={list.start} end={list.end} total={total} label="reminders" />
        }
      >
        <thead>
          <tr>
            <Th aria-sort={sort === "customer" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Customer" href={sortHref(path, current, "customer", sort, dir)} active={sort === "customer"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "type" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Type" href={sortHref(path, current, "type", sort, dir)} active={sort === "type"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "title" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Title" href={sortHref(path, current, "title", sort, dir)} active={sort === "title"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "due" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Due / scheduled" href={sortHref(path, current, "due", sort, dir, "desc")} active={sort === "due"} dir={dir} />
            </Th>
            <Th aria-sort={sort === "read" ? (dir === "asc" ? "ascending" : "descending") : "none"}>
              <SortHeader label="Read" href={sortHref(path, current, "read", sort, dir, "desc")} active={sort === "read"} dir={dir} />
            </Th>
            <Th className="w-14">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {reminders.length === 0 ? (
            <tr>
              <Td colSpan={6} className="py-12 text-center text-dash-muted">
                {filtered ? "No reminders match these filters." : "No reminder notices have been generated yet."}
              </Td>
            </tr>
          ) : (
            reminders.map((reminder) => {
              const overdue =
                reminder.type === "OVERDUE_SERVICE" ||
                (reminder.scheduledFor !== null && reminder.scheduledFor < today);
              return (
                <tr key={reminder.id}>
                  <Td className="font-medium">{reminder.customer?.companyName ?? "—"}</Td>
                  <Td>
                    <StatusBadge status={reminder.type} />
                  </Td>
                  <Td>
                    <p className={reminder.readAt ? "font-medium text-dash-muted" : "font-semibold text-dash-ink"}>{reminder.title}</p>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-dash-muted">{formatDate(reminder.scheduledFor ?? reminder.sentAt)}</span>
                      {overdue ? <StatusBadge status="OVERDUE" /> : null}
                    </div>
                  </Td>
                  <Td>
                    {reminder.readAt ? <span className="text-dash-muted">{formatDate(reminder.readAt)}</span> : <StatusBadge status="UNREAD" />}
                  </Td>
                  <Td>
                    <RowIcons label={reminder.title} viewHref={reminderHref(reminder.relatedEntityType, reminder.relatedEntityId, true)} />
                  </Td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
}
