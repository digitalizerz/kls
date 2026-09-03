import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/forms/customer-form";
import { PageHeader } from "@/components/ui/page-header";
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

  return (
    <div className="space-y-6">
      <PageHeader title="Edit customer" description={customer.companyName} />
      <CustomerForm customer={customer} />
    </div>
  );
}
