import { CustomerForm } from "@/components/forms/customer-form";
import { requireAdmin } from "@/lib/session";

export default async function NewCustomerPage() {
  await requireAdmin();
  return <CustomerForm />;
}
