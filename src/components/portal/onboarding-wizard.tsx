"use client";

import { useActionState, useState } from "react";
import { completeOnboarding, type OnboardingState } from "@/actions/onboarding";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const steps = [
  "Business",
  "Location",
  "Grease trap",
  "Records",
  "Review",
];

const initial: OnboardingState = {};

export function OnboardingWizard({
  defaults,
}: {
  defaults: {
    contactName: string;
    email: string;
    phone: string;
    companyName: string;
  };
}) {
  const [step, setStep] = useState(0);
  const [state, action, pending] = useActionState(completeOnboarding, initial);

  return (
    <form action={action} className="space-y-6">
      <ol className="grid grid-cols-5 gap-2 text-center text-[11px] uppercase tracking-[0.12em]">
        {steps.map((label, index) => (
          <li
            key={label}
            className={cn(
              "border-b-2 pb-2",
              index <= step ? "border-forest text-forest" : "border-line text-muted",
            )}
          >
            {label}
          </li>
        ))}
      </ol>

      {state.error ? <Alert>{state.error}</Alert> : null}

      <div className={cn(step === 0 ? "grid gap-4 sm:grid-cols-2" : "hidden")}>
        <Field label="Company name" htmlFor="companyName" className="sm:col-span-2">
          <Input id="companyName" name="companyName" defaultValue={defaults.companyName.includes("(pending)") ? "" : defaults.companyName} required />
        </Field>
        <Field label="Primary contact" htmlFor="contactName">
          <Input id="contactName" name="contactName" defaultValue={defaults.contactName} required />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" defaultValue={defaults.email} required />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <Input id="phone" name="phone" defaultValue={defaults.phone} required />
        </Field>
        <Field label="Billing street" htmlFor="billingAddressLine1" className="sm:col-span-2">
          <Input id="billingAddressLine1" name="billingAddressLine1" required />
        </Field>
        <Field label="Billing line 2" htmlFor="billingAddressLine2" className="sm:col-span-2">
          <Input id="billingAddressLine2" name="billingAddressLine2" />
        </Field>
        <Field label="City" htmlFor="billingCity">
          <Input id="billingCity" name="billingCity" required />
        </Field>
        <Field label="State" htmlFor="billingState">
          <Input id="billingState" name="billingState" maxLength={2} required />
        </Field>
        <Field label="ZIP" htmlFor="billingZipCode">
          <Input id="billingZipCode" name="billingZipCode" required />
        </Field>
      </div>

      <div className={cn(step === 1 ? "grid gap-4 sm:grid-cols-2" : "hidden")}>
        <Field label="Location name" htmlFor="locationName" className="sm:col-span-2">
          <Input id="locationName" name="locationName" placeholder="Downtown kitchen" required />
        </Field>
        <Field label="Street address" htmlFor="addressLine1" className="sm:col-span-2">
          <Input id="addressLine1" name="addressLine1" required />
        </Field>
        <Field label="Address line 2" htmlFor="addressLine2" className="sm:col-span-2">
          <Input id="addressLine2" name="addressLine2" />
        </Field>
        <Field label="City" htmlFor="city">
          <Input id="city" name="city" required />
        </Field>
        <Field label="State" htmlFor="state">
          <Input id="state" name="state" maxLength={2} required />
        </Field>
        <Field label="ZIP" htmlFor="zipCode">
          <Input id="zipCode" name="zipCode" required />
        </Field>
        <Field label="Location contact" htmlFor="locationContactName">
          <Input id="locationContactName" name="locationContactName" defaultValue={defaults.contactName} required />
        </Field>
        <Field label="Location phone" htmlFor="locationContactPhone">
          <Input id="locationContactPhone" name="locationContactPhone" defaultValue={defaults.phone} required />
        </Field>
        <Field label="Location email" htmlFor="locationContactEmail">
          <Input id="locationContactEmail" name="locationContactEmail" type="email" defaultValue={defaults.email} required />
        </Field>
        <Field label="Water purveyor / utility" htmlFor="waterPurveyor" className="sm:col-span-2">
          <Input id="waterPurveyor" name="waterPurveyor" placeholder="Municipal water utility" required />
        </Field>
      </div>

      <div className={cn(step === 2 ? "grid gap-4 sm:grid-cols-2" : "hidden")}>
        <Field label="Trap name / identifier" htmlFor="trapName" className="sm:col-span-2">
          <Input id="trapName" name="trapName" placeholder="Kitchen interceptor — 1000 gal" required />
        </Field>
        <Field label="Capacity (gallons)" htmlFor="capacityGallons">
          <Input id="capacityGallons" name="capacityGallons" type="number" min={1} />
        </Field>
        <Field label="Cleaning frequency" htmlFor="cleaningFrequency">
          <Select id="cleaningFrequency" name="cleaningFrequency" defaultValue="MONTHLY">
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
            <option value="CUSTOM">Custom</option>
          </Select>
        </Field>
        <Field label="On-site location of trap" htmlFor="onsiteLocationDescription" className="sm:col-span-2">
          <Input id="onsiteLocationDescription" name="onsiteLocationDescription" placeholder="Alley vault, west wall" required />
        </Field>
        <Field label="Last cleaning date (if known)" htmlFor="lastCleanedAt">
          <Input id="lastCleanedAt" name="lastCleanedAt" type="date" />
        </Field>
      </div>

      <div className={cn(step === 3 ? "space-y-3" : "hidden")}>
        <Field
          label="Previous reports, manifests, or photos"
          htmlFor="documents"
          hint="Optional. Files are stored with this location and can be replaced by cloud storage later."
        >
          <Input id="documents" name="documents" type="file" multiple />
        </Field>
      </div>

      <div className={cn(step === 4 ? "space-y-3 text-sm" : "hidden")}>
        <p>
          Review the business, first location, and grease trap details, then finish. You can add more locations after onboarding.
        </p>
        <p className="text-muted">
          Submitting creates the customer profile, location, trap, and any uploaded documents, then opens the dashboard.
        </p>
      </div>

      <div className="flex justify-between gap-3">
        <Button type="button" variant="secondary" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => setStep((value) => value + 1)}>
            Continue
          </Button>
        ) : (
          <Button type="submit" variant="clay" disabled={pending}>
            {pending ? "Saving…" : "Finish and open dashboard"}
          </Button>
        )}
      </div>
    </form>
  );
}
