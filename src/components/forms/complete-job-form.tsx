"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import type { completeServiceJob } from "@/actions/jobs";
import type { completeTechnicianJob } from "@/actions/technician";
import type { RecordActionState } from "@/actions/locations";
import { FormActions, FormSection } from "@/components/forms/admin-form";
import { UnsavedChanges } from "@/components/forms/unsaved-changes";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";

const initial: RecordActionState = {};

export function CompleteJobForm({
  jobId,
  action,
  submitLabel = "Complete job and write service record",
  requireSignature = false,
}: {
  jobId: string;
  action: typeof completeServiceJob | typeof completeTechnicianJob;
  submitLabel?: string;
  requireSignature?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const [dirty, setDirty] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.error) alertRef.current?.focus();
  }, [state.error]);

  return (
    <form
      action={formAction}
      className="dash-fields space-y-4"
      onInput={() => setDirty(true)}
      onSubmit={() => setDirty(false)}
    >
      <UnsavedChanges dirty={dirty && !pending} />
      <input type="hidden" name="jobId" value={jobId} />
      {state.error ? (
        <div ref={alertRef} tabIndex={-1} className="outline-none">
          <Alert>{state.error}</Alert>
        </div>
      ) : null}
      <FormSection
        icon={<ClipboardCheck className="h-4 w-4" aria-hidden="true" />}
        title="Completion details"
        description="These values are written to the service record when the job is completed."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gallons removed" htmlFor="gallonsRemoved">
            <Input id="gallonsRemoved" name="gallonsRemoved" type="number" min={0} inputMode="numeric" />
          </Field>
          <Field label="Waste hauler" htmlFor="wasteHauler">
            <Input id="wasteHauler" name="wasteHauler" defaultValue={siteConfig.legalName} />
          </Field>
          <Field label="Waste destination" htmlFor="wasteDestination" className="sm:col-span-2">
            <Input id="wasteDestination" name="wasteDestination" placeholder="Licensed FOG receiving facility" />
          </Field>
          <Field label="Discrepancies" htmlFor="discrepancies" className="sm:col-span-2">
            <Textarea id="discrepancies" name="discrepancies" />
          </Field>
          <Field label="Technician notes" htmlFor="technicianNotes" className="sm:col-span-2">
            <Textarea id="technicianNotes" name="technicianNotes" />
          </Field>
          <Field label="Customer signature name" htmlFor="customerSignatureName" className="sm:col-span-2">
            <Input
              id="customerSignatureName"
              name="customerSignatureName"
              required={requireSignature}
              autoComplete="name"
              placeholder={requireSignature ? "Printed name of the on-site contact" : undefined}
            />
          </Field>
        </div>
      </FormSection>
      <FormActions pending={pending} submitLabel={submitLabel} pendingLabel="Completing…" />
    </form>
  );
}
