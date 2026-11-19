import { notFound } from "next/navigation";
import { updateTechnician } from "@/actions/staff";
import { StaffAccountForm } from "@/components/forms/staff-account-form";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminEditTechnicianPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const technician = await prisma.technician.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!technician || technician.user.role !== "TECHNICIAN") notFound();

  return (
    <StaffAccountForm
      kind="technician"
      action={updateTechnician}
      account={{
        id: technician.id,
        name: technician.user.name ?? "",
        email: technician.user.email,
        phone: technician.user.phone ?? "",
        employeeId: technician.employeeId ?? "",
        status: technician.status,
        notes: technician.notes ?? "",
        roleLabel: "Technician",
      }}
    />
  );
}
