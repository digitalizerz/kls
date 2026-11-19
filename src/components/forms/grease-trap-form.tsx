"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CalendarClock, Droplets } from "lucide-react";
import type { GreaseTrap } from "@prisma/client";
import type { RecordActionState } from "@/actions/locations";
import { AdminFormFrame, FormActions, FormSection, type FormCrumb, type FormGuidance } from "@/components/forms/admin-form";
import { CapacitySelect } from "@/components/forms/capacity-select";
import { UnsavedChanges } from "@/components/forms/unsaved-changes";
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
  shell,
}: {
  action: (prev: RecordActionState, formData: FormData) => Promise<RecordActionState>;
  locationId: string;
  trap?: GreaseTrap;
  showStatus?: boolean;
  cancelHref: string;
  submitLabel: string;
  shell?: {
    breadcrumbs: FormCrumb[];
    title: string;
    description?: string;
    guidance?: FormGuidance;
  };
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const [dirty, setDirty] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.error) alertRef.current?.focus();
  }, [state.error]);

  const fields = (
    <>
      <input type="hidden" name="locationId" value={locationId} />
      {trap ? <input type="hidden" name="trapId" value={trap.id} /> : null}
      {state.error ? (
        <div ref={alertRef} tabIndex={-1} className="outline-none">
          <Alert>{state.error}</Alert>
        </div>
      ) : null}
      <FormSection
        icon={<Droplets className="h-4 w-4" aria-hidden="true" />}
        title="Interceptor details"
        description="Identity, capacity, and where the trap sits on site."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Trap name / identifier" htmlFor="nameOrIdentifier" className="sm:col-span-2">
            <Input
              id="nameOrIdentifier"
              name="nameOrIdentifier"
              defaultValue={trap?.nameOrIdentifier ?? ""}
              placeholder="Main interceptor — 1,000 gal"
              required
            />
          </Field>
          <Field label="Capacity (gallons)" htmlFor="capacityGallons" hint="100 to 5,000 gallons, in steps of 50.">
            <CapacitySelect id="capacityGallons" name="capacityGallons" defaultValue={trap?.capacityGallons} />
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
        </div>
      </FormSection>
      <FormSection
        icon={<CalendarClock className="h-4 w-4" aria-hidden="true" />}
        title="Service schedule"
        description="Frequency and the last cleaning date. The next recommended date is calculated from these when a last cleaning date is saved."
      >
        <div className="grid gap-4 sm:grid-cols-2">
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
            <Input id="lastCleanedAt" name="lastCleanedAt" type="date" defaultValue={toDateInput(trap?.lastCleanedAt)} />
          </Field>
        </div>
      </FormSection>
      <FormSection
        icon={<Droplets className="h-4 w-4" aria-hidden="true" />}
        title="Notes"
        description="Internal notes for this interceptor."
      >
        <Field label="Notes" htmlFor="notes">
          <Textarea id="notes" name="notes" defaultValue={trap?.notes ?? ""} />
        </Field>
      </FormSection>
    </>
  );

  const actions = shell ? (
    <FormActions pending={pending} submitLabel={submitLabel} pendingLabel="Saving…" cancelHref={cancelHref} />
  ) : (
    <div className="flex flex-wrap gap-2">
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
      <ButtonLink href={cancelHref} variant="secondary">
        Cancel
      </ButtonLink>
    </div>
  );

  return (
    <form
      action={formAction}
      className="dash-fields space-y-4"
      onInput={() => setDirty(true)}
      onSubmit={() => setDirty(false)}
    >
      {shell ? <UnsavedChanges dirty={dirty && !pending} /> : null}
      {shell ? (
        <AdminFormFrame
          breadcrumbs={shell.breadcrumbs}
          icon={<Droplets className="h-5 w-5" aria-hidden="true" />}
          title={shell.title}
          description={shell.description}
          guidance={shell.guidance}
        >
          {fields}
          {actions}
        </AdminFormFrame>
      ) : (
        <>
          {fields}
          {actions}
        </>
      )}
    </form>
  );
}
