"use client";

import { useActionState } from "react";
import { uploadTechnicianJobPhoto } from "@/actions/technician";
import type { RecordActionState } from "@/actions/locations";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initial: RecordActionState = {};

export function TechnicianPhotoUploadForm({ jobId }: { jobId: string }) {
  const [state, action, pending] = useActionState(uploadTechnicianJobPhoto, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="jobId" value={jobId} />
      {state.error ? <Alert>{state.error}</Alert> : null}
      <Field label="Photo" htmlFor="photo">
        <Input id="photo" name="file" type="file" accept="image/*" capture="environment" required />
      </Field>
      <Field label="Caption (optional)" htmlFor="title">
        <Input id="title" name="title" placeholder="Lid after pump-out" />
      </Field>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Uploading…" : "Upload photo"}
      </Button>
    </form>
  );
}
