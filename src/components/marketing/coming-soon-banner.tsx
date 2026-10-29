import { siteConfig } from "@/config/site";

export function ComingSoonBanner() {
  if (siteConfig.acceptingRequests) return null;

  return (
    <div className="bg-charcoal text-white">
      <p className="mx-auto max-w-7xl px-4 py-3 text-center text-sm font-semibold leading-6 lg:px-6">
        Coming soon. KLS is completing regulatory approval and is not yet accepting service requests.
      </p>
    </div>
  );
}
