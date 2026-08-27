import { AppSection } from "@/components/home/AppSection";
import { Faq } from "@/components/home/FAQ";
import { HeroA } from "@/components/home/HeroA";
import { Manifesto } from "@/components/home/Manifesto";
import { Newsletter } from "@/components/home/Newsletter";
import { Values } from "@/components/home/Values";
import { VideoSection } from "@/components/home/VideoSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Gallery } from "./Gallery";

export default function HomePage() {
  const env = process.env.NODE_ENV || "production";
  return (
    <div>
      <HeroA />
      <VideoSection />
      <Manifesto />
      <AppSection />
      <Values />
      {env !== "production" ? <Gallery /> : null}
      <Faq />
      <Newsletter />
      <SiteFooter />
    </div>
  );
}
