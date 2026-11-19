"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Building2, MapPin, UserRound } from "lucide-react";
import type { Location } from "@prisma/client";
import type { RecordActionState } from "@/actions/locations";
import { AdminFormFrame, FormActions, FormSection, type FormCrumb, type FormGuidance } from "@/components/forms/admin-form";
import { UnsavedChanges } from "@/components/forms/unsaved-changes";
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
  customerName,
  customers,
  defaultCustomerId,
  showStatus = false,
  cancelHref,
  submitLabel,
  shell,
}: {
  action: (prev: RecordActionState, formData: FormData) => Promise<RecordActionState>;
  location?: LocationValues & { id?: string };
  customerId?: string;
  customerName?: string;
  customers?: { id: string; companyName: string }[];
  defaultCustomerId?: string;
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
  const [customerQuery, setCustomerQuery] = useState("");
  const alertRef = useRef<HTMLDivElement>(null);
  const customerChoices = (customers ?? []).filter((customer) => {
    const query = customerQuery.trim().toLowerCase();
    return !query || customer.companyName.toLowerCase().includes(query) || customer.id === defaultCustomerId;
  });

  useEffect(() => {
    if (state.error) alertRef.current?.focus();
  }, [state.error]);

  const fields = (
    <>
      {location?.id ? <input type="hidden" name="locationId" value={location.id} /> : null}
      {customerId ? <input type="hidden" name="customerId" value={customerId} /> : null}
      {state.error ? (
        <div ref={alertRef} tabIndex={-1} className="outline-none">
          <Alert>{state.error}</Alert>
        </div>
      ) : null}
      <FormSection
        icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
        title="Location details"
        description="Basic information about this service site."
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
              <Select id="customerId" name="customerId" defaultValue={defaultCustomerId ?? ""} required>
                <option value="">Select a customer</option>
                {customerChoices.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName}
                  </option>
                ))}
              </Select>
            </Field>
          ) : customerName ? (
            <Field label="Customer" className="sm:col-span-2">
              <Input value={customerName} readOnly aria-readonly="true" />
            </Field>
          ) : null}
          <Field label="Location name" htmlFor="locationName" className={showStatus ? undefined : "sm:col-span-2"}>
            <Input id="locationName" name="locationName" defaultValue={location?.locationName ?? ""} placeholder="e.g. Main Kitchen" required />
          </Field>
          {showStatus ? (
            <Field label="Location status" htmlFor="status">
              <Select id="status" name="status" defaultValue={location?.status ?? "ACTIVE"}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
            </Field>
          ) : null}
        </div>
      </FormSection>
      <FormSection
        icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
        title="Service address"
        description="Where technicians will perform service."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Street address" htmlFor="addressLine1" className="sm:col-span-2">
            <Input id="addressLine1" name="addressLine1" defaultValue={location?.addressLine1 ?? ""} placeholder="Enter street address" autoComplete="street-address" required />
          </Field>
          <Field label="Address line 2" htmlFor="addressLine2" className="sm:col-span-2">
            <Input id="addressLine2" name="addressLine2" defaultValue={location?.addressLine2 ?? ""} placeholder="Suite, unit, or building" autoComplete="address-line2" />
          </Field>
          <Field label="City" htmlFor="city">
            <Input id="city" name="city" defaultValue={location?.city ?? ""} autoComplete="address-level2" required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="State" htmlFor="state">
              <Input id="state" name="state" maxLength={2} defaultValue={location?.state ?? ""} placeholder="TX" autoComplete="address-level1" required />
            </Field>
            <Field label="ZIP code" htmlFor="zipCode">
              <Input id="zipCode" name="zipCode" defaultValue={location?.zipCode ?? ""} placeholder="78704" inputMode="numeric" autoComplete="postal-code" required />
            </Field>
          </div>
        </div>
      </FormSection>
      <FormSection
        icon={<UserRound className="h-4 w-4" aria-hidden="true" />}
        title="Site contact"
        description="Optional on-site contact, water purveyor, and notes."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Site contact" htmlFor="contactName">
            <Input id="contactName" name="contactName" defaultValue={location?.contactName ?? ""} autoComplete="name" />
          </Field>
          <Field label="Contact phone" htmlFor="contactPhone">
            <Input id="contactPhone" name="contactPhone" type="tel" defaultValue={location?.contactPhone ?? ""} autoComplete="tel" />
          </Field>
          <Field label="Contact email" htmlFor="contactEmail">
            <Input id="contactEmail" name="contactEmail" type="email" defaultValue={location?.contactEmail ?? ""} autoComplete="email" />
          </Field>
          <Field label="Water purveyor" htmlFor="waterPurveyor">
            <Input id="waterPurveyor" name="waterPurveyor" defaultValue={location?.waterPurveyor ?? ""} />
          </Field>
          <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
            <Textarea id="notes" name="notes" defaultValue={location?.notes ?? ""} />
          </Field>
        </div>
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
          icon={<Building2 className="h-5 w-5" aria-hidden="true" />}
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
