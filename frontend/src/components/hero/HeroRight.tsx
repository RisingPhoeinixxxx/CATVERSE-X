"use client";

import Image from "next/image";

import "./HeroRight.css";

import HudPanel from "../hud/HudPanel";

import CatEffects from "./CatEffects";


export default function HeroRight() {
  return (
    <div className="hero-right">

      {/* Glow */}
      <div className="cat-glow"></div>
      <CatEffects />
      <div className="ring ring1"></div>

      {/* Rings */}
      <div className="ring ring1"></div>
      <div className="ring ring2"></div>
      <div className="ring ring3"></div>

      {/* Cyber Cat */}
      <Image
        src="/images/hero/cyber-cat.png"
        alt="Cyber Cat"
        width={760}
        height={760}
        priority
        className="cyber-cat"
      />
      

      {/* HUD PANELS */}

      <div className="hud hud1">
        <HudPanel
          title="CAT ID"
          value="CX-2048"
          footer="LUNA"
        />
      </div>

      <div className="hud hud2">
        <HudPanel
          title="HEALTH"
          value="98%"
          footer="Excellent"
        />
      </div>

      <div className="hud hud3">
        <HudPanel
          title="RISK"
          value="LOW"
          footer="AI Protected"
        />
      </div>

      <div className="hud hud4">
        <HudPanel
          title="LAST SEEN"
          value="2h"
          footer="Cubbon Park"
        />
      </div>

      {/* Scan Line */}
      <div className="scan-line"></div>

    </div>
  );
}