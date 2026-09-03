"use server";

import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validators/contact";

export type ContactState = {
  error?: string;
  success?: string;
};

export async function submitContactInquiry(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    serviceNeed: formData.get("serviceNeed"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  await prisma.contactInquiry.create({
    data: parsed.data,
  });

  return {
    success: "Thanks. A KLS team member will follow up shortly.",
  };
}
