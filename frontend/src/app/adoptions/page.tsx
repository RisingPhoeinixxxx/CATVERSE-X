import Background from "@/components/background/Background";
import Navbar from "@/components/Navbar/Navbar";

import AdoptionHero from "@/components/adoptions/AdoptionHero";
import AdoptionStats from "@/components/adoptions/AdoptionStats";
import AdoptionGrid from "@/components/adoptions/AdoptionGrid";

export default function AdoptionPage() {
  return (
    <>
      <Background />
      <Navbar />

      <AdoptionHero />

      <AdoptionStats />

      <AdoptionGrid />

    </>
  );
}