import { createTechnician } from "@/actions/staff";
import { StaffAccountForm } from "@/components/forms/staff-account-form";
import { requireAdmin } from "@/lib/session";

export default async function AdminNewTechnicianPage() {
  await requireAdmin();
  return <StaffAccountForm kind="technician" action={createTechnician} />;
}
