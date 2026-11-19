import { Manrope } from "next/font/google";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { ComingSoonBanner } from "@/components/marketing/coming-soon-banner";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-json-ld";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${manrope.className} marketing-site flex min-h-screen flex-col bg-white text-charcoal`}>
      <LocalBusinessJsonLd />
      <ComingSoonBanner />
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
