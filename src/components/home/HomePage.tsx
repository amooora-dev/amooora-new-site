import { Faq } from "@/components/home/FAQ";
import { HeroA } from "@/components/home/HeroA";
import { Manifesto } from "@/components/home/Manifesto";
import { Newsletter } from "@/components/home/Newsletter";
import { Values } from "@/components/home/Values";
import { VideoSection } from "@/components/home/VideoSection";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function HomePage() {
  return (
    <div>
      <HeroA />
      <VideoSection />
      <Manifesto />
      <Values />
      <Faq />
      <Newsletter />
      <SiteFooter />
    </div>
  );
}
