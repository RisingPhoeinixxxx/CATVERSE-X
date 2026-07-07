"use client";

import { useEffect, useState } from "react";

import "./AnalyticsStats.css";

const API = "http://127.0.0.1:8000";

export default function AnalyticsStats() {

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {

    fetch(`${API}/dashboard/stats`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStats(data);
      })
      .catch(console.error);

  }, []);

  if (!stats) {

    return (

      <section className="analytics-stats">

        <div className="analytics-card">
          <p>Loading...</p>
        </div>

      </section>

    );

  }

  return (

    <section className="analytics-stats">

      <div className="analytics-card">
        <p>ACTIVE GUARDIANS</p>
        <h2>{stats.active_guardians}</h2>
      </div>

      <div className="analytics-card">
        <p>TOTAL CATS</p>
        <h2>{stats.total_cats}</h2>
      </div>

      <div className="analytics-card">
        <p>CRITICAL CATS</p>
        <h2>{stats.critical_cats}</h2>
      </div>

      <div className="analytics-card">
        <p>RESCUED CATS</p>
        <h2>{stats.rescued_cats}</h2>
      </div>

      <div className="analytics-card">
        <p>ADOPTED CATS</p>
        <h2>{stats.adopted_cats}</h2>
      </div>

      <div className="analytics-card">
        <p>RESCUE REPORTS</p>
        <h2>{stats.rescue_reports}</h2>
      </div>

      <div className="analytics-card">
        <p>AVERAGE HEALTH</p>
        <h2>{stats.average_health}%</h2>
      </div>

      <div className="analytics-card">
        <p>AVERAGE AI SCORE</p>
        <h2>{stats.average_ai}%</h2>
      </div>

    </section>

  );

}