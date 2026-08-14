import { AppSection } from "@/components/home/AppSection";
import { Faq } from "@/components/home/FAQ";
import { Gallery } from "@/components/home/Gallery";
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
      <AppSection />
      <Values />
      <Gallery />
      <Faq />
      <Newsletter />
      <SiteFooter />
    </div>
  );
}
