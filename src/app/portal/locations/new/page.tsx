import { createPortalLocation } from "@/actions/locations";
import { LocationForm } from "@/components/forms/location-form";
import { PageHeader } from "@/components/ui/page-header";
import { requirePortalContext } from "@/lib/session";

export default async function NewLocationPage() {
  await requirePortalContext();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add location"
        description="Traps belong to a location. Add grease traps after this site is saved."
      />
      <LocationForm
        action={createPortalLocation}
        cancelHref="/portal/locations"
        submitLabel="Save location"
      />
    </div>
  );
}
