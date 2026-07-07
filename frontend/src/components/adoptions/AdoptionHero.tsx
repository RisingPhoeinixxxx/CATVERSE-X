"use client";

import "./AdoptionHero.css";

export default function AdoptionHero() {
  return (
    <section className="adoption-hero">

      <div className="adoption-badge">

        ❤️ FIND FOREVER HOMES

      </div>

      <h1>

        CAT <span>ADOPTIONS</span>

      </h1>

      <p>

        Connect loving families with rescued cats.
        Browse verified adoption profiles,
        monitor applications and create
        successful forever homes.

      </p>

      <div className="adoption-buttons">

        <button>

          Browse Cats

        </button>

        <button className="secondary">

          Become Adopter

        </button>

      </div>

    </section>
  );
}