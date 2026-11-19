"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FileUp, X } from "lucide-react";
import type { RecordActionState } from "@/actions/locations";
import { FormSection } from "@/components/forms/admin-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initial: RecordActionState = {};

type LocationOption = { id: string; locationName: string; customerId?: string };

export function DocumentUploadForm({
  action,
  locations,
  customers,
  defaultLocationId,
  defaultCustomerId,
  showVisibility = false,
  cancelHref,
}: {
  action: (prev: RecordActionState, formData: FormData) => Promise<RecordActionState>;
  locations: LocationOption[];
  customers?: { id: string; companyName: string }[];
  defaultLocationId?: string;
  defaultCustomerId?: string;
  showVisibility?: boolean;
  cancelHref?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerId, setCustomerId] = useState(defaultCustomerId ?? (cancelHref ? "" : customers?.[0]?.id ?? ""));
  const [locationId, setLocationId] = useState(defaultLocationId ?? "");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const customerOptions = useMemo(() => {
    if (!customers) return [];
    const query = customerQuery.trim().toLowerCase();
    return customers.filter(
      (customer) => customer.id === customerId || customer.companyName.toLowerCase().includes(query),
    );
  }, [customerId, customerQuery, customers]);

  const locationOptions = customers
    ? locations.filter((location) => Boolean(customerId) && location.customerId === customerId)
    : locations.filter((location) => !location.customerId || !customerId || location.customerId === customerId);

  function chooseFile(file: File | undefined) {
    if (!file || !fileRef.current) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileRef.current.files = transfer.files;
    setFileName(file.name);
  }

  const form = (
    <form action={formAction} className="dash-fields space-y-4">
      {state.error ? <Alert>{state.error}</Alert> : null}
      {defaultCustomerId && !customers ? <input type="hidden" name="customerId" value={defaultCustomerId} /> : null}
      <FormSection
        icon={<FileUp className="h-4 w-4" aria-hidden="true" />}
        title={cancelHref ? "Document details" : "Upload a document"}
        description={
          cancelHref
            ? "Where this document belongs and how it should be categorized."
            : "Files stay on the customer account. Downloads use the storage adapter. Seed rows without a real file return a 404."
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {customers ? (
            <Field label="Customer" htmlFor="customerId" className="sm:col-span-2">
              <Input
                value={customerQuery}
                onChange={(event) => setCustomerQuery(event.target.value)}
                placeholder="Search customers..."
                aria-label="Search customers"
                className="mb-2"
              />
              <Select
                id="customerId"
                name="customerId"
                value={customerId}
                required
                onChange={(event) => {
                  const next = event.target.value;
                  setCustomerId(next);
                  const stillValid = locations.some(
                    (location) => location.id === locationId && (!location.customerId || location.customerId === next),
                  );
                  if (!stillValid) setLocationId("");
                }}
              >
                {cancelHref ? <option value="">Select a customer</option> : null}
                {customerOptions.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <Field label="Title" htmlFor="title">
            <Input id="title" name="title" placeholder="Optional — defaults to the file name" />
          </Field>
          <Field label="Type" htmlFor="type">
            <Select id="type" name="type" defaultValue={cancelHref ? "" : "OTHER"} required={Boolean(cancelHref)}>
              {cancelHref ? <option value="">Select document type</option> : null}
              <option value="CLEANING_REPORT">Cleaning report</option>
              <option value="COMPLIANCE_MANIFEST">Compliance manifest</option>
              <option value="PREVIOUS_SERVICE_REPORT">Previous service report</option>
              <option value="PHOTO">Photo</option>
              <option value="OTHER">Other</option>
            </Select>
          </Field>
          <Field label="Location" htmlFor="locationId">
            <Select id="locationId" name="locationId" value={locationId} onChange={(event) => setLocationId(event.target.value)}>
              <option value="">Account-level (no location)</option>
              {locationOptions.map((location) => (
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
          <Field label="File" htmlFor="file" className="sm:col-span-2" hint="Up to 50 MB. Plans and multi-page PDFs are expected.">
            <label
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-dash-rich/30 bg-[#f3faf6] px-4 py-8 text-center"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                chooseFile(event.dataTransfer.files?.[0]);
              }}
            >
              <FileUp className="h-5 w-5 text-dash-rich" aria-hidden="true" />
              <span className="mt-2 text-sm font-semibold text-dash-ink">
                {fileName || "Drag and drop a file here, or browse files"}
              </span>
              <span className="mt-1 text-xs text-dash-muted">Up to 50 MB. Plans and multi-page PDFs are supported.</span>
              <input
                ref={fileRef}
                id="file"
                name="file"
                type="file"
                required
                className="sr-only"
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
              />
            </label>
          </Field>
          <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
            <Textarea id="notes" name="notes" />
          </Field>
        </div>
        <div className="mt-5 flex flex-col gap-3 border-t border-dash-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-dash-muted">
            All uploaded documentation is kept strictly confidential and is available only to your organization and KLS.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            {cancelHref ? (
              <ButtonLink href={cancelHref} variant="secondary" className="border-dash-line bg-white text-dash-ink hover:border-dash-rich">
                Cancel
              </ButtonLink>
            ) : null}
            <Button type="submit" disabled={pending} className="bg-dash-green text-white hover:bg-dash-forest">
              <FileUp className="h-4 w-4" aria-hidden="true" />
              {pending ? "Uploading…" : "Upload document"}
            </Button>
          </div>
        </div>
      </FormSection>
    </form>
  );

  if (!cancelHref) return form;

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-[#d7eadf] bg-[#f3faf6]">
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-dash-rich">
            <FileUp className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-dash-ink">Add Document</h2>
            <p className="mt-0.5 text-sm text-dash-muted">Upload a file and attach it to a customer or location.</p>
          </div>
        </div>
        <Link
          href={cancelHref}
          aria-label="Close"
          className="grid h-8 w-8 place-items-center rounded-full text-dash-muted hover:bg-white hover:text-dash-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="px-3 pb-3">{form}</div>
    </div>
  );
}
