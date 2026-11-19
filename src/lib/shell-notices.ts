import { prisma } from "@/lib/db";

export type ShellNotice = {
  id: string;
  title: string;
  detail: string;
};

const noticeSelect = { id: true, title: true, body: true } as const;

function toNotice(row: { id: string; title: string; body: string }): ShellNotice {
  return { id: row.id, title: row.title, detail: row.body };
}

export async function adminNotices(): Promise<ShellNotice[]> {
  const rows = await prisma.notification.findMany({
    where: { channel: "IN_APP", status: { in: ["PENDING", "SENT"] }, readAt: null },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: noticeSelect,
  });
  return rows.map(toNotice);
}

export async function portalNotices(customerId: string, userId: string): Promise<ShellNotice[]> {
  const rows = await prisma.notification.findMany({
    where: {
      customerId,
      channel: "IN_APP",
      status: { in: ["PENDING", "SENT"] },
      readAt: null,
      OR: [{ userId }, { userId: null }],
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: noticeSelect,
  });
  return rows.map(toNotice);
}

export async function technicianNotices(userId: string): Promise<ShellNotice[]> {
  const rows = await prisma.notification.findMany({
    where: { userId, channel: "IN_APP", status: { in: ["PENDING", "SENT"] }, readAt: null },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: noticeSelect,
  });
  return rows.map(toNotice);
}
