"use client";

import "./CatCard.css";

type Props = {
  id: string;
  name: string;
  status: string;
  health: number;
  confidence: number;
  location: string;
};

export default function CatCard({
  id,
  name,
  status,
  health,
  confidence,
  location,
}: Props) {

  return (

    <div className="cat-card">

      <div className="cat-image">
        🐈
      </div>

      <div className="cat-info">
        <h2>{name}</h2>
        <p>{id}</p>
      </div>

      <div className="cat-details">

        <div>
          <span>Health</span>
          <h3>{health}%</h3>
        </div>

        <div>
          <span>AI</span>
          <h3>{confidence}%</h3>
        </div>

      </div>

      <div className="cat-status">
        <span>{status}</span>
        <p>{location}</p>
      </div>

      <button>
        View Digital Twin →
      </button>

    </div>

  );

}