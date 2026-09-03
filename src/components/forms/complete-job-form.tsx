"use client";

import { useActionState } from "react";
import type { completeServiceJob } from "@/actions/jobs";
import type { completeTechnicianJob } from "@/actions/technician";
import type { RecordActionState } from "@/actions/locations";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="jobId" value={jobId} />
      {state.error ? <Alert>{state.error}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Gallons removed" htmlFor="gallonsRemoved">
          <Input id="gallonsRemoved" name="gallonsRemoved" type="number" min={0} />
        </Field>
        <Field label="Waste hauler" htmlFor="wasteHauler">
          <Input id="wasteHauler" name="wasteHauler" defaultValue="KLS Environmental LLC" />
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
        <Field
          label="Customer signature name"
          htmlFor="customerSignatureName"
          className="sm:col-span-2"
        >
          <Input
            id="customerSignatureName"
            name="customerSignatureName"
            required={requireSignature}
            placeholder={requireSignature ? "Printed name of the on-site contact" : undefined}
          />
        </Field>
      </div>
      <Button type="submit" variant="clay" disabled={pending}>
        {pending ? "Completing…" : submitLabel}
      </Button>
    </form>
  );
}
