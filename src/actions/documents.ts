"use server";

import { redirect } from "next/navigation";
import type { DocumentType, DocumentVisibility } from "@prisma/client";
import { prisma } from "@/lib/db";
import { buildStorageKey, getFileStorage } from "@/lib/storage";
import { requireAdmin, requirePortalContext } from "@/lib/session";
import { documentUploadSchema } from "@/lib/validators/records";
import type { RecordActionState } from "@/actions/locations";

async function storeUpload(formData: FormData, options: {
  customerId: string;
  uploadedById: string;
  visibility: DocumentVisibility;
}) {
  const parsed = documentUploadSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    locationId: formData.get("locationId"),
    notes: formData.get("notes"),
    visibility: formData.get("visibility") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the document details." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }

  const locationId = parsed.data.locationId ?? null;
  if (locationId) {
    const location = await prisma.location.findFirst({
      where: { id: locationId, customerId: options.customerId },
    });
    if (!location) return { error: "That location is not on this account." };
  }

  const storage = getFileStorage();
  const bytes = Buffer.from(await file.arrayBuffer());
  const key = buildStorageKey(["customers", options.customerId, "documents", file.name]);
  await storage.put({ key, bytes, mimeType: file.type || "application/octet-stream" });

  await prisma.document.create({
    data: {
      customerId: options.customerId,
      locationId,
      uploadedById: options.uploadedById,
      type: parsed.data.type as DocumentType,
      visibility: parsed.data.visibility ?? options.visibility,
      title: parsed.data.title || file.name,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      storageKey: key,
      notes: parsed.data.notes,
    },
  });

  return { ok: true as const };
}

export async function uploadPortalDocument(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const { user, customer } = await requirePortalContext();
  const result = await storeUpload(formData, {
    customerId: customer.id,
    uploadedById: user.id,
    visibility: "CUSTOMER_VISIBLE",
  });
  if ("error" in result && result.error) return { error: result.error };

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "DOCUMENT_UPLOADED",
      entityType: "Document",
      entityId: customer.id,
    },
  });

  redirect("/portal/documents");
}

export async function uploadAdminDocument(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const admin = await requireAdmin();
  const customerId = String(formData.get("customerId") ?? "");
  if (!customerId) return { error: "Select a customer." };

  const result = await storeUpload(formData, {
    customerId,
    uploadedById: admin.id,
    visibility: (formData.get("visibility") as DocumentVisibility) || "CUSTOMER_VISIBLE",
  });
  if ("error" in result && result.error) return { error: result.error };

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "DOCUMENT_UPLOADED",
      entityType: "Document",
      entityId: customerId,
    },
  });

  redirect("/admin/documents");
}
