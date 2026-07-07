"use client";

import { useEffect, useState } from "react";

import "./AdoptionStats.css";

const API = "http://127.0.0.1:8000";

export default function AdoptionStats() {

  const [stats, setStats] = useState({

    available: 0,

    adopted: 0,

    success: 0,

  });

  useEffect(() => {

    fetch(`${API}/adoptions/stats`)
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);

  }, []);

  return (

    <section className="adoption-stats">

      <div className="adoption-card">

        <p>AVAILABLE</p>

        <h2>{stats.available}</h2>

      </div>

      <div className="adoption-card">

        <p>ADOPTED</p>

        <h2>{stats.adopted}</h2>

      </div>

      <div className="adoption-card">

        <p>SUCCESS</p>

        <h2>{stats.success}%</h2>

      </div>

    </section>

  );

}