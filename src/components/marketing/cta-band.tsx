import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";

export function CtaBand() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div>
          <h2 className="font-serif text-3xl text-ink">Need a trap pumped before it becomes a problem?</h2>
          <p className="mt-2 text-sm text-muted">
            Call {siteConfig.phone} or send the form. Existing customers can request service from the portal.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/#contact" variant="clay">
            Request service
          </ButtonLink>
          <ButtonLink href="/login" variant="secondary">
            Client portal
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
