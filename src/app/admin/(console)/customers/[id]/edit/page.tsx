import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/forms/customer-form";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) notFound();
  return <CustomerForm customer={customer} />;
}
