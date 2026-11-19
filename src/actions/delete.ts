"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, requireSuperAdmin } from "@/lib/session";
import { getFileStorage } from "@/lib/storage";

function destination(formData: FormData, fallback: string) {
  const value = String(formData.get("returnTo") ?? "");
  if (value.startsWith("/admin/") && !value.includes("://") && !value.startsWith("//")) return value;
  return fallback;
}

function targetIds(formData: FormData) {
  return [...new Set(formData.getAll("id").map((value) => String(value)).filter(Boolean))];
}

async function removeFiles(keys: string[]) {
  const storage = getFileStorage();
  await Promise.all(keys.map((key) => storage.delete(key).catch(() => undefined)));
}

export async function deleteCustomer(formData: FormData) {
  const admin = await requireAdmin();
  const ids = targetIds(formData);
  const returnTo = destination(formData, "/admin/customers");
  if (ids.length === 0) redirect(returnTo);

  const customers = await prisma.customer.findMany({
    where: { id: { in: ids } },
    select: { id: true, documents: { select: { storageKey: true } } },
  });
  if (customers.length === 0) redirect(returnTo);
  const found = customers.map((customer) => customer.id);

  await prisma.$transaction([
    prisma.user.deleteMany({ where: { customerId: { in: found }, role: "CUSTOMER" } }),
    prisma.customer.deleteMany({ where: { id: { in: found } } }),
    prisma.auditLog.createMany({
      data: found.map((id) => ({
        actorId: admin.id,
        action: "CUSTOMER_DELETED",
        entityType: "Customer",
        entityId: id,
      })),
    }),
  ]);
  await removeFiles(customers.flatMap((customer) => customer.documents.map((document) => document.storageKey)));
  redirect(returnTo);
}

export async function deleteLocation(formData: FormData) {
  const admin = await requireAdmin();
  const ids = targetIds(formData);
  const returnTo = destination(formData, "/admin/locations");
  if (ids.length === 0) redirect(returnTo);

  const rows = await prisma.location.findMany({ where: { id: { in: ids } }, select: { id: true } });
  if (rows.length === 0) redirect(returnTo);
  const found = rows.map((row) => row.id);
  await prisma.$transaction([
    prisma.location.deleteMany({ where: { id: { in: found } } }),
    prisma.auditLog.createMany({
      data: found.map((id) => ({
        actorId: admin.id,
        action: "LOCATION_DELETED",
        entityType: "Location",
        entityId: id,
      })),
    }),
  ]);
  redirect(returnTo);
}

export async function deleteGreaseTrap(formData: FormData) {
  const admin = await requireAdmin();
  const ids = targetIds(formData);
  const returnTo = destination(formData, "/admin/grease-traps");
  if (ids.length === 0) redirect(returnTo);

  const rows = await prisma.greaseTrap.findMany({ where: { id: { in: ids } }, select: { id: true } });
  if (rows.length === 0) redirect(returnTo);
  const found = rows.map((row) => row.id);
  await prisma.$transaction([
    prisma.greaseTrap.deleteMany({ where: { id: { in: found } } }),
    prisma.auditLog.createMany({
      data: found.map((id) => ({
        actorId: admin.id,
        action: "GREASE_TRAP_DELETED",
        entityType: "GreaseTrap",
        entityId: id,
      })),
    }),
  ]);
  redirect(returnTo);
}

export async function deleteDocument(formData: FormData) {
  const admin = await requireAdmin();
  const ids = targetIds(formData);
  const returnTo = destination(formData, "/admin/documents");
  if (ids.length === 0) redirect(returnTo);

  const documents = await prisma.document.findMany({
    where: { id: { in: ids } },
    select: { id: true, storageKey: true },
  });
  if (documents.length === 0) redirect(returnTo);
  const found = documents.map((document) => document.id);
  await prisma.$transaction([
    prisma.document.deleteMany({ where: { id: { in: found } } }),
    prisma.auditLog.createMany({
      data: found.map((id) => ({
        actorId: admin.id,
        action: "DOCUMENT_DELETED",
        entityType: "Document",
        entityId: id,
      })),
    }),
  ]);
  await removeFiles(documents.map((document) => document.storageKey));
  redirect(returnTo);
}

export async function deleteServiceRequest(formData: FormData) {
  const admin = await requireAdmin();
  const ids = targetIds(formData);
  const returnTo = destination(formData, "/admin/service-requests");
  if (ids.length === 0) redirect(returnTo);

  const rows = await prisma.serviceRequest.findMany({ where: { id: { in: ids } }, select: { id: true } });
  if (rows.length === 0) redirect(returnTo);
  const found = rows.map((row) => row.id);
  await prisma.$transaction([
    prisma.serviceRequest.deleteMany({ where: { id: { in: found } } }),
    prisma.auditLog.createMany({
      data: found.map((id) => ({
        actorId: admin.id,
        action: "SERVICE_REQUEST_DELETED",
        entityType: "ServiceRequest",
        entityId: id,
      })),
    }),
  ]);
  redirect(returnTo);
}

export async function deleteServiceJob(formData: FormData) {
  const admin = await requireAdmin();
  const ids = targetIds(formData);
  const returnTo = destination(formData, "/admin/jobs");
  if (ids.length === 0) redirect(returnTo);

  const rows = await prisma.serviceJob.findMany({ where: { id: { in: ids } }, select: { id: true } });
  if (rows.length === 0) redirect(returnTo);
  const found = rows.map((row) => row.id);
  await prisma.$transaction([
    prisma.serviceJob.deleteMany({ where: { id: { in: found } } }),
    prisma.auditLog.createMany({
      data: found.map((id) => ({
        actorId: admin.id,
        action: "SERVICE_JOB_DELETED",
        entityType: "ServiceJob",
        entityId: id,
      })),
    }),
  ]);
  redirect(returnTo);
}

export async function deleteTechnician(formData: FormData) {
  const admin = await requireAdmin();
  const ids = targetIds(formData);
  const returnTo = destination(formData, "/admin/technicians");
  if (ids.length === 0) redirect(returnTo);

  const technicians = await prisma.technician.findMany({
    where: { id: { in: ids }, user: { role: "TECHNICIAN" } },
    select: { id: true, userId: true },
  });
  if (technicians.length === 0) redirect(returnTo);
  await prisma.$transaction([
    prisma.user.deleteMany({ where: { id: { in: technicians.map((tech) => tech.userId) } } }),
    prisma.auditLog.createMany({
      data: technicians.map((tech) => ({
        actorId: admin.id,
        action: "TECHNICIAN_DELETED",
        entityType: "Technician",
        entityId: tech.id,
      })),
    }),
  ]);
  redirect(returnTo);
}

export async function deleteAdminAccount(formData: FormData) {
  const actor = await requireSuperAdmin();
  const ids = targetIds(formData).filter((id) => id !== actor.id);
  const returnTo = destination(formData, "/admin/admins");
  if (ids.length === 0) redirect(returnTo);

  const users = await prisma.user.findMany({
    where: { id: { in: ids }, role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    select: { id: true, role: true, isActive: true },
  });
  const activeSupers = await prisma.user.count({ where: { role: "SUPER_ADMIN", isActive: true } });
  let spare = activeSupers - 1;
  const found: string[] = [];
  for (const user of users) {
    if (user.role === "SUPER_ADMIN" && user.isActive) {
      if (spare <= 0) continue;
      spare -= 1;
    }
    found.push(user.id);
  }
  if (found.length === 0) redirect(returnTo);

  await prisma.$transaction([
    prisma.user.deleteMany({ where: { id: { in: found } } }),
    prisma.auditLog.createMany({
      data: found.map((id) => ({
        actorId: actor.id,
        action: "ADMIN_DELETED",
        entityType: "User",
        entityId: id,
      })),
    }),
  ]);
  redirect(returnTo);
}
