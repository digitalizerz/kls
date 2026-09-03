import { requireAdmin } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="System configuration for later: email provider, storage driver, and jurisdiction templates." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="font-medium">File storage</p>
          <p className="mt-2 text-sm text-muted">
            Driver: {process.env.FILE_STORAGE_DRIVER ?? "local"}. Swap the adapter in{" "}
            <code>src/lib/storage</code> when cloud storage is selected.
          </p>
        </Card>
        <Card>
          <p className="font-medium">Notifications</p>
          <p className="mt-2 text-sm text-muted">
            Due-date reminders are in-app only for now. Email delivery can be wired later without changing the
            reminder schedule. SMS stays deferred until a provider is chosen.
          </p>
        </Card>
        <Card>
          <p className="font-medium">Authentication</p>
          <p className="mt-2 text-sm text-muted">
            Portal, admin, and technician areas require a signed-in session. Public registration creates
            customer accounts only. Password reset email waits on an email provider.
          </p>
        </Card>
        <Card>
          <p className="font-medium">Compliance templates</p>
          <p className="mt-2 text-sm text-muted">
            Do not generate official manifests until the client PDF is mapped onto ComplianceManifest.fieldSnapshot.
          </p>
        </Card>
      </div>
    </div>
  );
}
