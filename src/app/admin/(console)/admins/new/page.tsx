import { createAdminAccount } from "@/actions/staff";
import { StaffAccountForm } from "@/components/forms/staff-account-form";
import { requireSuperAdmin } from "@/lib/session";

export default async function AdminNewAdminPage() {
  await requireSuperAdmin();
  return <StaffAccountForm kind="admin" action={createAdminAccount} />;
}
