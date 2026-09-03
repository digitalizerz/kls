import { AppShell } from "@/components/layout/app-shell";
import { technicianNav } from "@/config/navigation";
import { requireTechnicianContext } from "@/lib/session";

export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireTechnicianContext();

  return (
    <AppShell
      title="Field portal"
      nav={technicianNav}
      homeHref="/technician"
      userName={user.name ?? "Technician"}
      userDetail="KLS technician"
    >
      {children}
    </AppShell>
  );
}
