import { notFound } from "next/navigation";
import { updateAdminAccount } from "@/actions/staff";
import { StaffAccountForm } from "@/components/forms/staff-account-form";
import { prisma } from "@/lib/db";
import { formatStatus } from "@/lib/format";
import { requireSuperAdmin } from "@/lib/session";

export default async function AdminEditAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSuperAdmin();
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) notFound();

  return (
    <StaffAccountForm
      kind="admin"
      action={updateAdminAccount}
      account={{
        id: user.id,
        name: user.name ?? "",
        email: user.email,
        phone: user.phone ?? "",
        employeeId: "",
        status: user.isActive ? "ACTIVE" : "INACTIVE",
        notes: "",
        roleLabel: formatStatus(user.role),
      }}
    />
  );
}
