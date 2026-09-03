import { ContactSection } from "@/components/marketing/contact-section";
import { CtaBand } from "@/components/marketing/cta-band";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ServiceOptions } from "@/components/marketing/service-options";
import { Services } from "@/components/marketing/services";
import { Testimonials } from "@/components/marketing/testimonials";
import { WhyKls } from "@/components/marketing/why-kls";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <WhyKls />
      <ServiceOptions />
      <Testimonials />
      <CtaBand />
      <ContactSection />
    </>
  );
}
