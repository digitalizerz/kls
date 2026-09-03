import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

export function PublicFooter() {
  return (
    <footer className="bg-forest text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4 lg:px-6">
        <div className="md:col-span-2">
          <Logo tone="light" />
          <p className="mt-4 max-w-md text-sm leading-6 text-cream/75">
            Grease trap pumping, cleaning, and service records for restaurants,
            hotels, and other commercial kitchens.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/60">
            Company
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/#services" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="hover:text-white">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white">
                Create an account
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Client portal
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/60">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li>
              <a href={`tel:${siteConfig.phone}`} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li>{siteConfig.hours}</li>
            <li>{siteConfig.serviceArea}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-cream/55 sm:flex-row sm:justify-between lg:px-6">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
          <p>Grease trap service for commercial food operations.</p>
        </div>
      </div>
    </footer>
  );
}
