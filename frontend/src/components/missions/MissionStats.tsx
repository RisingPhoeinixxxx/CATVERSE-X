"use client";

import { useEffect, useState } from "react";

import "./MissionStats.css";

const API = "http://127.0.0.1:8000";

export default function MissionStats() {

  const [stats, setStats] = useState({

    active: 0,

    rescues: 0,

    success: 0,

    volunteers: 0,

  });

  useEffect(() => {

    fetch(`${API}/missions/stats`)
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);

  }, []);

  return (

    <section className="mission-stats">

      <div className="stat-card">
        <p>ACTIVE MISSIONS</p>
        <h2>{stats.active}</h2>
      </div>

      <div className="stat-card">
        <p>RESCUED TODAY</p>
        <h2>{stats.rescues}</h2>
      </div>

      <div className="stat-card">
        <p>SUCCESS RATE</p>
        <h2>{stats.success}%</h2>
      </div>

      <div className="stat-card">
        <p>VOLUNTEERS</p>
        <h2>{stats.volunteers}</h2>
      </div>

    </section>

  );

}