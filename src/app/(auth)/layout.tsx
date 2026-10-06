import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${manrope.className} marketing-site min-h-screen bg-white text-charcoal`}>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 flex justify-center">
          <Logo tone="public" />
        </div>
        <div className="border border-rule bg-white p-6">{children}</div>
      </div>
    </div>
  );
}
