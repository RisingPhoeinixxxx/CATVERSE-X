"use client";

import { useEffect, useState } from "react";

import "./ShelterStats.css";

const API = "http://127.0.0.1:8000";

export default function ShelterStats() {

  const [stats, setStats] = useState({

    registered: 0,
    beds: 0,
    adoptions: 0,
    vets: 0,

  });

  useEffect(() => {

    fetch(`${API}/shelters/stats`)
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);

  }, []);

  return (

    <section className="shelter-stats">

      <div className="shelter-card">
        <p>REGISTERED</p>
        <h2>{stats.registered}</h2>
      </div>

      <div className="shelter-card">
        <p>AVAILABLE BEDS</p>
        <h2>{stats.beds}</h2>
      </div>

      <div className="shelter-card">
        <p>ADOPTIONS</p>
        <h2>{stats.adoptions}</h2>
      </div>

      <div className="shelter-card">
        <p>VETERINARIANS</p>
        <h2>{stats.vets}</h2>
      </div>

    </section>

  );

}