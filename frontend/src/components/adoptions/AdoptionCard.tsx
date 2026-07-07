"use client";

import "./AdoptionCard.css";

export default function AdoptionCard({
  cat,
}: {
  cat: any;
}) {

  return (

    <div className="adoption-card">

      <h2>{cat.name}</h2>

      <p>🐈 Breed: {cat.breed}</p>

      <p>🎂 Age: {cat.age}</p>

      <p>⚧ Gender: {cat.gender}</p>

      <p>❤️ Health: {cat.health_score}%</p>

      <p>🤖 AI Score: {cat.ai_score}%</p>

      <button>

        Adopt Me ❤️

      </button>

    </div>

  );

}