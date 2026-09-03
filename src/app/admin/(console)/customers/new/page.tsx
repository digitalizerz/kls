import { CustomerForm } from "@/components/forms/customer-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/lib/session";

export default async function NewCustomerPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create customer"
        description="Creates the business account first. Add locations and traps next. Optional portal login can be issued here."
      />
      <CustomerForm />
    </div>
  );
}
