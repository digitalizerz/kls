"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import type { RecordActionState } from "@/actions/locations";
import { prisma } from "@/lib/db";
import { requireAdmin, requireSuperAdmin } from "@/lib/session";
import { adminAccountSchema, adminUpdateSchema, technicianAccountSchema, technicianUpdateSchema } from "@/lib/validators/records";

function takenEmail(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createTechnician(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const admin = await requireAdmin();
  const parsed = technicianAccountSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    employeeId: formData.get("employeeId"),
    password: formData.get("password"),
    status: formData.get("status") || undefined,
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the technician details." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "A user with that email already exists." };

  const status = parsed.data.status ?? "ACTIVE";
  let technicianId = "";
  try {
    const technician = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: parsed.data.name,
          email,
          phone: parsed.data.phone,
          passwordHash: await bcrypt.hash(parsed.data.password, 12),
          role: "TECHNICIAN",
          isActive: status === "ACTIVE",
        },
      });
      return tx.technician.create({
        data: {
          userId: user.id,
          employeeId: parsed.data.employeeId,
          status,
          notes: parsed.data.notes,
        },
      });
    });
    technicianId = technician.id;
  } catch (error) {
    if (takenEmail(error)) return { error: "A user with that email already exists." };
    throw error;
  }

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "TECHNICIAN_CREATED",
      entityType: "Technician",
      entityId: technicianId,
    },
  });

  redirect("/admin/technicians");
}

export async function updateTechnician(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = technicianUpdateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    employeeId: formData.get("employeeId"),
    password: formData.get("password"),
    status: formData.get("status") || undefined,
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the technician details." };
  }

  const technician = await prisma.technician.findUnique({
    where: { id },
    select: { userId: true, user: { select: { role: true } } },
  });
  if (!technician || technician.user.role !== "TECHNICIAN") {
    return { error: "That technician was not found." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== technician.userId) {
    return { error: "A user with that email already exists." };
  }

  const status = parsed.data.status ?? "ACTIVE";
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: technician.userId },
        data: {
          name: parsed.data.name,
          email,
          phone: parsed.data.phone ?? null,
          isActive: status === "ACTIVE",
          ...(parsed.data.password ? { passwordHash: await bcrypt.hash(parsed.data.password, 12) } : {}),
        },
      });
      await tx.technician.update({
        where: { id },
        data: {
          employeeId: parsed.data.employeeId ?? null,
          status,
          notes: parsed.data.notes ?? null,
        },
      });
    });
  } catch (error) {
    if (takenEmail(error)) return { error: "A user with that email already exists." };
    throw error;
  }

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "TECHNICIAN_UPDATED",
      entityType: "Technician",
      entityId: id,
    },
  });

  redirect("/admin/technicians");
}

export async function createAdminAccount(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const actor = await requireSuperAdmin();
  const parsed = adminAccountSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the admin details." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "A user with that email already exists." };

  let userId = "";
  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        phone: parsed.data.phone,
        passwordHash: await bcrypt.hash(parsed.data.password, 12),
        role: "ADMIN",
      },
    });
    userId = user.id;
  } catch (error) {
    if (takenEmail(error)) return { error: "A user with that email already exists." };
    throw error;
  }

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      action: "ADMIN_CREATED",
      entityType: "User",
      entityId: userId,
    },
  });

  redirect("/admin/admins");
}

export async function updateAdminAccount(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const actor = await requireSuperAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = adminUpdateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the admin details." };
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { error: "That admin was not found." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== id) return { error: "A user with that email already exists." };

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: parsed.data.name,
        email,
        phone: parsed.data.phone ?? null,
        ...(parsed.data.password ? { passwordHash: await bcrypt.hash(parsed.data.password, 12) } : {}),
      },
    });
  } catch (error) {
    if (takenEmail(error)) return { error: "A user with that email already exists." };
    throw error;
  }

  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      action: "ADMIN_UPDATED",
      entityType: "User",
      entityId: id,
    },
  });

  redirect("/admin/admins");
}
