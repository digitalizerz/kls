import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { nextServiceFromFrequency } from "@/lib/format";
import { notifyJobCompleted } from "@/lib/reminders";
import type { completeJobSchema } from "@/lib/validators/records";
import type { z } from "zod";

type CompletionInput = z.infer<typeof completeJobSchema>;

const completableInclude = {
  traps: { include: { greaseTrap: true } },
  serviceRecord: true,
} satisfies Prisma.ServiceJobInclude;

export type CompletableJob = Prisma.ServiceJobGetPayload<{ include: typeof completableInclude }>;

export async function loadCompletableJob(jobId: string) {
  return prisma.serviceJob.findUnique({
    where: { id: jobId },
    include: completableInclude,
  });
}

export async function markJobInProgress(actorId: string, jobId: string) {
  const job = await prisma.serviceJob.findUnique({ where: { id: jobId } });
  if (!job || job.status === "COMPLETED" || job.status === "CANCELLED") {
    return { error: "This job cannot be started." as const };
  }

  if (job.status !== "IN_PROGRESS") {
    await prisma.serviceJob.update({
      where: { id: jobId },
      data: { status: "IN_PROGRESS", startedAt: job.startedAt ?? new Date() },
    });
    await prisma.serviceRequest.updateMany({
      where: { jobId },
      data: { status: "IN_PROGRESS" },
    });
    await prisma.auditLog.create({
      data: {
        actorId,
        action: "SERVICE_JOB_STARTED",
        entityType: "ServiceJob",
        entityId: jobId,
      },
    });
  }

  return { ok: true as const };
}

export async function writeJobCompletion(
  actorId: string,
  job: CompletableJob,
  data: CompletionInput,
) {
  if (job.status === "CANCELLED") {
    return { error: "A cancelled job cannot be completed." as const };
  }
  if (job.serviceRecord) {
    return { alreadyComplete: true as const };
  }

  const completedAt = new Date();
  const jobId = job.id;

  await prisma.$transaction(async (tx) => {
    await tx.serviceJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        startedAt: job.startedAt ?? completedAt,
        completedAt,
      },
    });

    await tx.serviceRequest.updateMany({
      where: { jobId },
      data: { status: "COMPLETED" },
    });

    const record = await tx.serviceRecord.create({
      data: {
        jobId,
        completedByUserId: actorId,
        completedAt,
        gallonsRemoved: data.gallonsRemoved,
        wasteHauler: data.wasteHauler ?? "KLS Environmental LLC",
        wasteDestination: data.wasteDestination,
        discrepancies: data.discrepancies,
        technicianNotes: data.technicianNotes,
        customerSignatureName: data.customerSignatureName,
        customerSignedAt: data.customerSignatureName ? completedAt : null,
      },
    });

    await tx.document.updateMany({
      where: { serviceJobId: jobId, serviceRecordId: null },
      data: { serviceRecordId: record.id },
    });

    await tx.cleaningReport.create({
      data: {
        serviceRecordId: record.id,
        status: "ISSUED",
        generatedAt: completedAt,
        notes: "Placeholder cleaning report. Official PDF mapping comes later.",
      },
    });

    await tx.complianceManifest.create({
      data: {
        serviceRecordId: record.id,
        status: "READY_FOR_GENERATION",
        jurisdiction: "Pending official template",
        fieldSnapshot: {
          customerId: job.customerId,
          locationId: job.locationId,
          completedAt: completedAt.toISOString(),
          gallonsRemoved: data.gallonsRemoved ?? null,
          trapIds: job.traps.map((item) => item.greaseTrapId),
          customerSignatureName: data.customerSignatureName ?? null,
          completedByUserId: actorId,
        },
        notes: "Structured service data is stored for later mapping into the official manifest.",
      },
    });

    for (const item of job.traps) {
      const trap = item.greaseTrap;
      await tx.greaseTrap.update({
        where: { id: trap.id },
        data: {
          lastCleanedAt: completedAt,
          nextRecommendedServiceAt: nextServiceFromFrequency(
            completedAt,
            trap.cleaningFrequency,
            trap.customFrequencyDays,
          ),
        },
      });
    }

    await tx.auditLog.create({
      data: {
        actorId,
        action: "SERVICE_RECORD_COMPLETED",
        entityType: "ServiceRecord",
        entityId: record.id,
        metadata: { jobId },
      },
    });
  });

  await notifyJobCompleted(jobId);
  return { ok: true as const };
}
