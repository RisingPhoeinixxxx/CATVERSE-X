import Background from "@/components/background/Background";
import Navbar from "@/components/Navbar/Navbar";

import ShelterHero from "@/components/shelters/ShelterHero";
import ShelterStats from "@/components/shelters/ShelterStats";
import ShelterGrid from "@/components/shelters/ShelterGrid";

export default function ShelterPage() {
  return (
    <>
      <Background />
      <Navbar />

      <ShelterHero />

      <ShelterStats />

      <ShelterGrid />

    </>
  );
}