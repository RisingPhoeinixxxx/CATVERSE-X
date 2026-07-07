"use client";

import "./MissionHero.css";

export default function MissionHero() {
  return (
    <section className="mission-hero">

      <div className="mission-badge">
        ● LIVE RESCUE NETWORK
      </div>

      <h1 className="mission-title">
        RESCUE <span>MISSIONS</span>
      </h1>

      <p className="mission-description">
        Monitor every rescue mission in real time.
        Dispatch volunteers, track rescue progress,
        predict success rates and coordinate shelters
        across the CATVERSE X network.
      </p>

      <div className="mission-buttons">

        <button className="mission-primary">
          Launch Mission Control
        </button>

        <button className="mission-secondary">
          View Live Missions
        </button>

      </div>

    </section>
  );
}