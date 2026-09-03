"use client";

import { useActionState, useMemo, useState } from "react";
import { submitServiceRequest, type ServiceRequestState } from "@/actions/service-request";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type LocationOption = {
  id: string;
  locationName: string;
  traps: { id: string; nameOrIdentifier: string }[];
};

const initial: ServiceRequestState = {};

export function ServiceRequestForm({
  locations,
  contact,
}: {
  locations: LocationOption[];
  contact: { name: string; phone: string; email: string };
}) {
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [state, action, pending] = useActionState(submitServiceRequest, initial);
  const traps = useMemo(
    () => locations.find((location) => location.id === locationId)?.traps ?? [],
    [locationId, locations],
  );

  return (
    <form action={action} className="space-y-4 border border-line bg-panel p-5">
      {state.error ? <Alert>{state.error}</Alert> : null}
      <Field label="Location" htmlFor="locationId">
        <Select
          id="locationId"
          name="locationId"
          value={locationId}
          onChange={(event) => setLocationId(event.target.value)}
          required
        >
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.locationName}
            </option>
          ))}
        </Select>
      </Field>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Grease traps</legend>
        <div className="space-y-2">
          {traps.map((trap) => (
            <label key={trap.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="trapIds" value={trap.id} defaultChecked={traps.length === 1} />
              {trap.nameOrIdentifier}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Service type" htmlFor="serviceType">
          <Select id="serviceType" name="serviceType" defaultValue="ROUTINE_CLEANING">
            <option value="ROUTINE_CLEANING">Routine cleaning</option>
            <option value="EMERGENCY_CLEANING">Emergency cleaning</option>
            <option value="INSPECTION">Inspection</option>
            <option value="REPAIR_COORDINATION">Repair coordination</option>
            <option value="OTHER">Other</option>
          </Select>
        </Field>
        <Field label="Preferred date" htmlFor="preferredDate">
          <Input id="preferredDate" name="preferredDate" type="date" required />
        </Field>
        <Field label="Alternative date" htmlFor="alternativeDate">
          <Input id="alternativeDate" name="alternativeDate" type="date" />
        </Field>
      </div>
      <Field label="Notes" htmlFor="notes">
        <Textarea id="notes" name="notes" placeholder="Access notes, hours to avoid, backup symptoms…" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Contact name" htmlFor="contactName">
          <Input id="contactName" name="contactName" defaultValue={contact.name} required />
        </Field>
        <Field label="Phone" htmlFor="contactPhone">
          <Input id="contactPhone" name="contactPhone" defaultValue={contact.phone} required />
        </Field>
        <Field label="Email" htmlFor="contactEmail">
          <Input id="contactEmail" name="contactEmail" type="email" defaultValue={contact.email} required />
        </Field>
      </div>
      <Button type="submit" variant="clay" disabled={pending || locations.length === 0}>
        {pending ? "Submitting…" : "Submit service request"}
      </Button>
    </form>
  );
}
