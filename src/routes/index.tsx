import { createFileRoute } from "@tanstack/react-router";

// TODO: After your first Vercel deploy, set this to your live URL
// (e.g. "https://dksh-editz.vercel.app" or your custom domain — no trailing slash).
const SITE_URL = "https://dksh-editz.vercel.app";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
import { useState, useEffect } from "react";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CustomCursor } from "@/components/cursor";
import { Loader } from "@/components/loader";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { QuietpressHero } from "@/components/quietpress-hero";
import { Work } from "@/components/work";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Clients } from "@/components/clients";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DKSH | Video Editor & Motion Designer" },
      { name: "description", content: "DKSH — freelance video editor and motion designer crafting high-retention edits, cinematic storytelling and motion graphics." },
      { property: "og:title", content: "DKSH | Video Editor & Motion Designer" },
      { property: "og:description", content: "High-retention edits, cinematic storytelling and motion graphics." },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
  }, [ready]);

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <CustomCursor />
      <SmoothScroll>
        <Navbar />
        <main className="relative overflow-x-clip">
          <Hero />
          <QuietpressHero />
          <Work />
          <About />
          <Skills />
          <Clients />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
