import type { CleaningFrequency, NotificationType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { daysUntil, formatDate, formatFrequency } from "@/lib/format";

type Db = Prisma.TransactionClient | typeof prisma;

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function leadDays(frequency: CleaningFrequency, customDays?: number | null) {
  switch (frequency) {
    case "MONTHLY":
      return 7;
    case "QUARTERLY":
      return 14;
    case "YEARLY":
      return 30;
    case "CUSTOM":
      return Math.min(14, Math.max(3, Math.floor((customDays ?? 30) / 4)));
  }
}

async function customerRecipients(customerId: string) {
  const users = await prisma.user.findMany({
    where: { customerId, role: "CUSTOMER", isActive: true },
    select: { id: true },
  });
  return users.length > 0 ? users.map((user) => user.id) : [null];
}

async function createIfMissing(
  db: Db,
  input: {
    userId: string | null;
    customerId: string;
    type: NotificationType;
    title: string;
    body: string;
    scheduledFor: Date | null;
    relatedEntityType: string;
    relatedEntityId: string;
  },
) {
  const existing = await db.notification.findFirst({
    where: {
      userId: input.userId,
      customerId: input.customerId,
      type: input.type,
      channel: "IN_APP",
      status: { in: ["PENDING", "SENT"] },
      relatedEntityType: input.relatedEntityType,
      relatedEntityId: input.relatedEntityId,
      scheduledFor: input.scheduledFor,
    },
  });
  if (existing) return existing;

  return db.notification.create({
    data: {
      userId: input.userId,
      customerId: input.customerId,
      type: input.type,
      channel: "IN_APP",
      status: "SENT",
      sentAt: new Date(),
      title: input.title,
      body: input.body,
      scheduledFor: input.scheduledFor,
      relatedEntityType: input.relatedEntityType,
      relatedEntityId: input.relatedEntityId,
    },
  });
}

export async function cancelDueRemindersForTrap(trapId: string, db: Db = prisma) {
  await db.notification.updateMany({
    where: {
      relatedEntityType: "GreaseTrap",
      relatedEntityId: trapId,
      type: { in: ["UPCOMING_SERVICE", "OVERDUE_SERVICE"] },
      status: { in: ["PENDING", "SENT"] },
    },
    data: { status: "CANCELLED" },
  });
}

export async function syncTrapReminders(trapId: string) {
  const trap = await prisma.greaseTrap.findUnique({
    where: { id: trapId },
    include: { location: true },
  });

  if (!trap || trap.status !== "ACTIVE" || !trap.nextRecommendedServiceAt) {
    await cancelDueRemindersForTrap(trapId);
    return;
  }

  const openJob = await prisma.serviceJob.findFirst({
    where: {
      status: { in: ["SCHEDULED", "IN_PROGRESS"] },
      traps: { some: { greaseTrapId: trap.id } },
    },
  });

  if (openJob) {
    await cancelDueRemindersForTrap(trapId);
    return;
  }

  const due = startOfDay(trap.nextRecommendedServiceAt);
  const remaining = daysUntil(due) ?? 0;
  const lead = leadDays(trap.cleaningFrequency, trap.customFrequencyDays);
  const overdue = remaining < 0;
  const upcoming = remaining >= 0 && remaining <= lead;

  await prisma.notification.updateMany({
    where: {
      relatedEntityType: "GreaseTrap",
      relatedEntityId: trap.id,
      type: { in: ["UPCOMING_SERVICE", "OVERDUE_SERVICE"] },
      status: { in: ["PENDING", "SENT"] },
      NOT: { scheduledFor: due },
    },
    data: { status: "CANCELLED" },
  });

  if (!overdue && !upcoming) return;

  const type: NotificationType = overdue ? "OVERDUE_SERVICE" : "UPCOMING_SERVICE";
  const frequency = formatFrequency(trap.cleaningFrequency, trap.customFrequencyDays);
  const title = overdue
    ? `${trap.location.locationName} is past due`
    : `${trap.location.locationName} is due for cleaning`;
  const body = overdue
    ? `${trap.nameOrIdentifier} was recommended for service on ${formatDate(due)} (${frequency}). Schedule a cleaning to stay inspection-ready.`
    : `${trap.nameOrIdentifier} is recommended for service on ${formatDate(due)} (${frequency}).`;

  const recipients = await customerRecipients(trap.location.customerId);
  for (const userId of recipients) {
    await createIfMissing(prisma, {
      userId,
      customerId: trap.location.customerId,
      type,
      title,
      body,
      scheduledFor: due,
      relatedEntityType: "GreaseTrap",
      relatedEntityId: trap.id,
    });
  }

  if (overdue) {
    await prisma.notification.updateMany({
      where: {
        relatedEntityType: "GreaseTrap",
        relatedEntityId: trap.id,
        type: "UPCOMING_SERVICE",
        status: { in: ["PENDING", "SENT"] },
        scheduledFor: due,
      },
      data: { status: "CANCELLED" },
    });
  }
}

export async function syncCustomerReminders(customerId: string) {
  const traps = await prisma.greaseTrap.findMany({
    where: { location: { customerId }, status: "ACTIVE" },
    select: { id: true },
  });
  for (const trap of traps) {
    await syncTrapReminders(trap.id);
  }
}

export async function syncAllReminders() {
  const traps = await prisma.greaseTrap.findMany({
    where: { status: "ACTIVE", nextRecommendedServiceAt: { not: null } },
    select: { id: true },
  });
  for (const trap of traps) {
    await syncTrapReminders(trap.id);
  }
}

export async function notifyJobScheduled(jobId: string) {
  const job = await prisma.serviceJob.findUnique({
    where: { id: jobId },
    include: { location: true, traps: { include: { greaseTrap: true } } },
  });
  if (!job) return;

  for (const item of job.traps) {
    await cancelDueRemindersForTrap(item.greaseTrapId);
  }

  const trapNames = job.traps.map((item) => item.greaseTrap.nameOrIdentifier).join(", ");
  const recipients = await customerRecipients(job.customerId);
  for (const userId of recipients) {
    await createIfMissing(prisma, {
      userId,
      customerId: job.customerId,
      type: "SCHEDULED_SERVICE",
      title: `Cleaning scheduled at ${job.location.locationName}`,
      body: `KLS confirmed service for ${formatDate(job.scheduledAt)}${trapNames ? `: ${trapNames}` : ""}.`,
      scheduledFor: job.scheduledAt,
      relatedEntityType: "ServiceJob",
      relatedEntityId: job.id,
    });
  }
}

export async function notifyJobCancelled(jobId: string) {
  const job = await prisma.serviceJob.findUnique({
    where: { id: jobId },
    include: { traps: true },
  });
  if (!job) return;

  await prisma.notification.updateMany({
    where: {
      relatedEntityType: "ServiceJob",
      relatedEntityId: jobId,
      type: "SCHEDULED_SERVICE",
      status: { in: ["PENDING", "SENT"] },
    },
    data: { status: "CANCELLED" },
  });

  for (const item of job.traps) {
    await syncTrapReminders(item.greaseTrapId);
  }
}

export async function notifyJobCompleted(jobId: string) {
  const job = await prisma.serviceJob.findUnique({
    where: { id: jobId },
    include: { location: true, traps: true },
  });
  if (!job) return;

  for (const item of job.traps) {
    await cancelDueRemindersForTrap(item.greaseTrapId);
    await syncTrapReminders(item.greaseTrapId);
  }

  const recipients = await customerRecipients(job.customerId);
  for (const userId of recipients) {
    await createIfMissing(prisma, {
      userId,
      customerId: job.customerId,
      type: "SERVICE_COMPLETED",
      title: `Service completed at ${job.location.locationName}`,
      body: `Cleaning was recorded on ${formatDate(job.completedAt ?? new Date())}. Reports and compliance placeholders are attached to this service.`,
      scheduledFor: job.completedAt,
      relatedEntityType: "ServiceJob",
      relatedEntityId: job.id,
    });
  }
}

export function reminderHref(relatedEntityType?: string | null, relatedEntityId?: string | null, forAdmin = false) {
  if (relatedEntityType === "ServiceJob" && relatedEntityId) {
    return forAdmin ? `/admin/jobs/${relatedEntityId}` : "/portal/history";
  }
  if (relatedEntityType === "GreaseTrap") {
    return forAdmin ? "/admin/grease-traps" : "/portal/schedule";
  }
  return forAdmin ? "/admin" : "/portal/dashboard";
}
