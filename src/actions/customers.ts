"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { customerSchema } from "@/lib/validators/records";
import type { RecordActionState } from "@/actions/locations";

function customerPayload(formData: FormData) {
  return customerSchema.safeParse({
    companyName: formData.get("companyName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    billingAddressLine1: formData.get("billingAddressLine1"),
    billingAddressLine2: formData.get("billingAddressLine2"),
    billingCity: formData.get("billingCity"),
    billingState: formData.get("billingState"),
    billingZipCode: formData.get("billingZipCode"),
    notes: formData.get("notes"),
    status: formData.get("status") || undefined,
    portalUserName: formData.get("portalUserName"),
    portalUserEmail: formData.get("portalUserEmail"),
    portalPassword: formData.get("portalPassword"),
  });
}

export async function createCustomer(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const admin = await requireAdmin();
  const parsed = customerPayload(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the customer details." };
  }

  if (parsed.data.portalPassword && !parsed.data.portalUserEmail) {
    return { error: "A portal login needs an email address." };
  }

  if (parsed.data.portalUserEmail) {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.portalUserEmail.toLowerCase() },
    });
    if (existing) return { error: "A user with that portal email already exists." };
  }

  const customer = await prisma.customer.create({
    data: {
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      billingAddressLine1: parsed.data.billingAddressLine1,
      billingAddressLine2: parsed.data.billingAddressLine2,
      billingCity: parsed.data.billingCity,
      billingState: parsed.data.billingState?.toUpperCase(),
      billingZipCode: parsed.data.billingZipCode,
      notes: parsed.data.notes,
      status: parsed.data.status ?? "ACTIVE",
      onboardingCompletedAt: new Date(),
    },
  });

  if (parsed.data.portalUserEmail && parsed.data.portalPassword) {
    await prisma.user.create({
      data: {
        name: parsed.data.portalUserName ?? parsed.data.contactName,
        email: parsed.data.portalUserEmail.toLowerCase(),
        phone: parsed.data.phone,
        passwordHash: await bcrypt.hash(parsed.data.portalPassword, 12),
        role: "CUSTOMER",
        customerId: customer.id,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "CUSTOMER_CREATED",
      entityType: "Customer",
      entityId: customer.id,
    },
  });

  redirect(`/admin/customers/${customer.id}`);
}

export async function updateCustomer(
  _prev: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  const admin = await requireAdmin();
  const customerId = String(formData.get("customerId") ?? "");
  const parsed = customerPayload(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the customer details." };
  }

  await prisma.customer.update({
    where: { id: customerId },
    data: {
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      billingAddressLine1: parsed.data.billingAddressLine1,
      billingAddressLine2: parsed.data.billingAddressLine2,
      billingCity: parsed.data.billingCity,
      billingState: parsed.data.billingState?.toUpperCase(),
      billingZipCode: parsed.data.billingZipCode,
      notes: parsed.data.notes,
      status: parsed.data.status ?? "ACTIVE",
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "CUSTOMER_UPDATED",
      entityType: "Customer",
      entityId: customerId,
    },
  });

  redirect(`/admin/customers/${customerId}`);
}
