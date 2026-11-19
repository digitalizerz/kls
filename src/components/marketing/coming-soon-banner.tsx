import { Info } from "lucide-react";
import { siteConfig } from "@/config/site";

export function ComingSoonBanner() {
  if (siteConfig.acceptingRequests) return null;

  return (
    <div className="border-b border-black/10 bg-sand text-inkwell">
      <p className="mx-auto flex max-w-[90rem] items-start justify-center gap-2 px-4 py-2.5 text-center text-sm font-semibold leading-6 lg:px-8">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-pine" aria-hidden="true" />
        <span>Coming soon. KLS is completing regulatory approval and is not yet accepting service requests.</span>
      </p>
    </div>
  );
}
