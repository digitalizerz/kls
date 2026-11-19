import Link from "next/link";
import { siteConfig } from "@/config/site";
import { TexasMap } from "@/components/marketing/home/texas-map";

export function HomeClosing() {
  return (
    <section className="bg-pine text-white">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-2">
        <div className="grid items-center gap-10 px-4 py-20 sm:grid-cols-[0.8fr_1.1fr] lg:px-10 lg:py-28">
          <TexasMap className="mx-auto h-56 w-full max-w-[240px] text-lime sm:h-72 sm:max-w-none" />
          <div className="max-w-md">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-lime">Service area</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">Service across Texas.</h2>
            <p className="mt-5 text-base leading-7 text-white/75">{siteConfig.description}</p>
          </div>
        </div>
        <div className="flex items-center bg-pine-mid px-4 py-20 lg:px-16 lg:py-28">
          <div className="max-w-md">
            <h2 className="text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">Ready to get started?</h2>
            <p className="mt-5 text-base leading-7 text-white/75">
              Create your account today and be ready for service once regulatory approval is complete.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-lime px-6 text-sm font-bold uppercase tracking-[0.06em] text-inkwell transition-colors hover:bg-white"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
