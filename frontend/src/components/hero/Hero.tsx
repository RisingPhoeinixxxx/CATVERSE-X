"use client";

import "./Hero.css";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";

export default function Hero() {
  return (
    <section className="hero">
      <HeroLeft />
      <HeroRight />
    </section>
  );
}