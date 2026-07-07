import Background from "@/components/background/Background";
import Navbar from "@/components/Navbar/Navbar";

import AboutHero from "@/components/about/AboutHero";
import AboutVision from "@/components/about/AboutVision";
import AboutFeatures from "@/components/about/AboutFeatures";

export default function AboutPage() {
  return (
    <>
      <Background />
      <Navbar />

      <AboutHero />

      <AboutVision />

      <AboutFeatures />

    </>
  );
}