"use client";

import { useActionState } from "react";
import type { Location } from "@prisma/client";
import type { RecordActionState } from "@/actions/locations";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initial: RecordActionState = {};

type LocationValues = Pick<
  Location,
  | "locationName"
  | "addressLine1"
  | "addressLine2"
  | "city"
  | "state"
  | "zipCode"
  | "contactName"
  | "contactPhone"
  | "contactEmail"
  | "waterPurveyor"
  | "notes"
  | "status"
>;

export function LocationForm({
  action,
  location,
  customerId,
  showStatus = false,
  cancelHref,
  submitLabel,
}: {
  action: (prev: RecordActionState, formData: FormData) => Promise<RecordActionState>;
  location?: LocationValues & { id?: string };
  customerId?: string;
  showStatus?: boolean;
  cancelHref: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-4 border border-line bg-panel p-5">
      {location?.id ? <input type="hidden" name="locationId" value={location.id} /> : null}
      {customerId ? <input type="hidden" name="customerId" value={customerId} /> : null}
      {state.error ? <Alert>{state.error}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location name" htmlFor="locationName" className="sm:col-span-2">
          <Input id="locationName" name="locationName" defaultValue={location?.locationName ?? ""} required />
        </Field>
        <Field label="Street address" htmlFor="addressLine1" className="sm:col-span-2">
          <Input id="addressLine1" name="addressLine1" defaultValue={location?.addressLine1 ?? ""} required />
        </Field>
        <Field label="Address line 2" htmlFor="addressLine2" className="sm:col-span-2">
          <Input id="addressLine2" name="addressLine2" defaultValue={location?.addressLine2 ?? ""} />
        </Field>
        <Field label="City" htmlFor="city">
          <Input id="city" name="city" defaultValue={location?.city ?? ""} required />
        </Field>
        <Field label="State" htmlFor="state">
          <Input id="state" name="state" maxLength={2} defaultValue={location?.state ?? ""} required />
        </Field>
        <Field label="ZIP" htmlFor="zipCode">
          <Input id="zipCode" name="zipCode" defaultValue={location?.zipCode ?? ""} required />
        </Field>
        <Field label="Site contact" htmlFor="contactName">
          <Input id="contactName" name="contactName" defaultValue={location?.contactName ?? ""} />
        </Field>
        <Field label="Contact phone" htmlFor="contactPhone">
          <Input id="contactPhone" name="contactPhone" defaultValue={location?.contactPhone ?? ""} />
        </Field>
        <Field label="Contact email" htmlFor="contactEmail">
          <Input id="contactEmail" name="contactEmail" type="email" defaultValue={location?.contactEmail ?? ""} />
        </Field>
        <Field label="Water purveyor" htmlFor="waterPurveyor">
          <Input id="waterPurveyor" name="waterPurveyor" defaultValue={location?.waterPurveyor ?? ""} />
        </Field>
        {showStatus ? (
          <Field label="Status" htmlFor="status">
            <Select id="status" name="status" defaultValue={location?.status ?? "ACTIVE"}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </Field>
        ) : null}
        <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
          <Textarea id="notes" name="notes" defaultValue={location?.notes ?? ""} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="clay" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        <ButtonLink href={cancelHref} variant="secondary">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
