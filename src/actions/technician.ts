"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildStorageKey, getFileStorage } from "@/lib/storage";
import { loadCompletableJob, markJobInProgress, writeJobCompletion } from "@/lib/service-jobs";
import { requireTechnicianContext } from "@/lib/session";
import { completeJobSchema } from "@/lib/validators/records";
import type { RecordActionState } from "@/actions/locations";

async function loadAssignedJob(jobId: string, technicianId: string) {
  return prisma.serviceJob.findFirst({
    where: { id: jobId, technicianId },
  });
}

export async function startTechnicianJob(formData: FormData) {
  const { user, technician } = await requireTechnicianContext();
  const jobId = String(formData.get("jobId") ?? "");
  const job = await loadAssignedJob(jobId, technician.id);

  if (!job) redirect("/technician");

  const result = await markJobInProgress(user.id, job.id);
  if ("error" in result) redirect("/technician");

  redirect(`/technician/jobs/${job.id}`);
}

export async function completeTechnicianJob(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const { user, technician } = await requireTechnicianContext();
  const jobId = String(formData.get("jobId") ?? "");
  const parsed = completeJobSchema.safeParse({
    gallonsRemoved: formData.get("gallonsRemoved"),
    wasteHauler: formData.get("wasteHauler"),
    wasteDestination: formData.get("wasteDestination"),
    discrepancies: formData.get("discrepancies"),
    technicianNotes: formData.get("technicianNotes"),
    customerSignatureName: formData.get("customerSignatureName"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the completion details." };
  }
  if (!parsed.data.customerSignatureName || parsed.data.customerSignatureName.trim().length < 2) {
    return { error: "Ask the on-site contact to print their name as the customer signature." };
  }

  const assigned = await loadAssignedJob(jobId, technician.id);
  if (!assigned) return { error: "This job is not assigned to you." };

  const job = await loadCompletableJob(jobId);
  if (!job) return { error: "Job not found." };

  const result = await writeJobCompletion(user.id, job, parsed.data);
  if ("error" in result) return { error: result.error };

  redirect(`/technician/jobs/${jobId}`);
}

export async function uploadTechnicianJobPhoto(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const { user, technician } = await requireTechnicianContext();
  const jobId = String(formData.get("jobId") ?? "");
  const job = await prisma.serviceJob.findFirst({
    where: { id: jobId, technicianId: technician.id },
    include: { serviceRecord: true },
  });

  if (!job) return { error: "This job is not assigned to you." };
  if (job.status === "CANCELLED") return { error: "Photos cannot be added to a cancelled job." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a photo to upload." };
  }
  if (file.size > 15 * 1024 * 1024) {
    return { error: "Keep field photos under 15 MB." };
  }

  const mimeType = file.type || "application/octet-stream";
  if (!mimeType.startsWith("image/")) {
    return { error: "Upload a photo (JPEG, PNG, HEIC, or similar)." };
  }

  const title = String(formData.get("title") ?? "").trim() || file.name;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const storage = getFileStorage();
  const bytes = Buffer.from(await file.arrayBuffer());
  const key = buildStorageKey(["customers", job.customerId, "jobs", job.id, "photos", file.name]);
  await storage.put({ key, bytes, mimeType });

  await prisma.document.create({
    data: {
      customerId: job.customerId,
      locationId: job.locationId,
      serviceJobId: job.id,
      serviceRecordId: job.serviceRecord?.id,
      uploadedById: user.id,
      type: "PHOTO",
      visibility: "CUSTOMER_VISIBLE",
      title,
      fileName: file.name,
      mimeType,
      sizeBytes: file.size,
      storageKey: key,
      notes,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "FIELD_PHOTO_UPLOADED",
      entityType: "Document",
      entityId: job.id,
    },
  });

  redirect(`/technician/jobs/${job.id}`);
}
