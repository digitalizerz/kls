"use client";

import { useActionState } from "react";
import type { RecordActionState } from "@/actions/locations";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initial: RecordActionState = {};

export function DocumentUploadForm({
  action,
  locations,
  customers,
  defaultLocationId,
  defaultCustomerId,
  showVisibility = false,
}: {
  action: (prev: RecordActionState, formData: FormData) => Promise<RecordActionState>;
  locations: { id: string; locationName: string }[];
  customers?: { id: string; companyName: string }[];
  defaultLocationId?: string;
  defaultCustomerId?: string;
  showVisibility?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-4 border border-line bg-panel p-5">
      {state.error ? <Alert>{state.error}</Alert> : null}
      {customers ? (
        <Field label="Customer" htmlFor="customerId">
          <Select id="customerId" name="customerId" defaultValue={defaultCustomerId ?? customers[0]?.id ?? ""} required>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.companyName}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}
      {defaultCustomerId && !customers ? (
        <input type="hidden" name="customerId" value={defaultCustomerId} />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="title">
          <Input id="title" name="title" placeholder="Optional — defaults to the file name" />
        </Field>
        <Field label="Type" htmlFor="type">
          <Select id="type" name="type" defaultValue="OTHER">
            <option value="CLEANING_REPORT">Cleaning report</option>
            <option value="COMPLIANCE_MANIFEST">Compliance manifest</option>
            <option value="PREVIOUS_SERVICE_REPORT">Previous service report</option>
            <option value="PHOTO">Photo</option>
            <option value="OTHER">Other</option>
          </Select>
        </Field>
        <Field label="Location" htmlFor="locationId">
          <Select id="locationId" name="locationId" defaultValue={defaultLocationId ?? ""}>
            <option value="">Account-level (no location)</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.locationName}
              </option>
            ))}
          </Select>
        </Field>
        {showVisibility ? (
          <Field label="Visibility" htmlFor="visibility">
            <Select id="visibility" name="visibility" defaultValue="CUSTOMER_VISIBLE">
              <option value="CUSTOMER_VISIBLE">Visible to customer</option>
              <option value="INTERNAL_ONLY">Internal only</option>
            </Select>
          </Field>
        ) : null}
        <Field label="File" htmlFor="file" className="sm:col-span-2">
          <Input id="file" name="file" type="file" required />
        </Field>
        <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
          <Textarea id="notes" name="notes" />
        </Field>
      </div>
      <Button type="submit" variant="clay" disabled={pending}>
        {pending ? "Uploading…" : "Upload document"}
      </Button>
    </form>
  );
}
