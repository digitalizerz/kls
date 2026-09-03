"use client";

import { useActionState } from "react";
import type { GreaseTrap } from "@prisma/client";
import type { RecordActionState } from "@/actions/locations";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toDateInput } from "@/lib/format";

const initial: RecordActionState = {};

export function GreaseTrapForm({
  action,
  locationId,
  trap,
  showStatus = false,
  cancelHref,
  submitLabel,
}: {
  action: (prev: RecordActionState, formData: FormData) => Promise<RecordActionState>;
  locationId: string;
  trap?: GreaseTrap;
  showStatus?: boolean;
  cancelHref: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-4 border border-line bg-panel p-5">
      <input type="hidden" name="locationId" value={locationId} />
      {trap ? <input type="hidden" name="trapId" value={trap.id} /> : null}
      {state.error ? <Alert>{state.error}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Trap name / identifier" htmlFor="nameOrIdentifier" className="sm:col-span-2">
          <Input
            id="nameOrIdentifier"
            name="nameOrIdentifier"
            defaultValue={trap?.nameOrIdentifier ?? ""}
            placeholder="Kitchen interceptor — 1000 gal"
            required
          />
        </Field>
        <Field label="Capacity (gallons)" htmlFor="capacityGallons">
          <Input
            id="capacityGallons"
            name="capacityGallons"
            type="number"
            min={1}
            defaultValue={trap?.capacityGallons ?? ""}
          />
        </Field>
        <Field label="Cleaning frequency" htmlFor="cleaningFrequency">
          <Select id="cleaningFrequency" name="cleaningFrequency" defaultValue={trap?.cleaningFrequency ?? "MONTHLY"}>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
            <option value="CUSTOM">Custom</option>
          </Select>
        </Field>
        <Field label="Custom frequency (days)" htmlFor="customFrequencyDays" hint="Required only if frequency is custom.">
          <Input
            id="customFrequencyDays"
            name="customFrequencyDays"
            type="number"
            min={1}
            defaultValue={trap?.customFrequencyDays ?? ""}
          />
        </Field>
        <Field label="Last cleaning date" htmlFor="lastCleanedAt">
          <Input
            id="lastCleanedAt"
            name="lastCleanedAt"
            type="date"
            defaultValue={toDateInput(trap?.lastCleanedAt)}
          />
        </Field>
        {showStatus ? (
          <Field label="Status" htmlFor="status">
            <Select id="status" name="status" defaultValue={trap?.status ?? "ACTIVE"}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </Field>
        ) : null}
        <Field label="On-site location" htmlFor="onsiteLocationDescription" className="sm:col-span-2">
          <Input
            id="onsiteLocationDescription"
            name="onsiteLocationDescription"
            defaultValue={trap?.onsiteLocationDescription ?? ""}
            placeholder="Alley vault, west wall"
          />
        </Field>
        <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
          <Textarea id="notes" name="notes" defaultValue={trap?.notes ?? ""} />
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
