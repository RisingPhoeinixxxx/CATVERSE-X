"use client";

import { useEffect, useState } from "react";

import "./MissionGrid.css";
import MissionCard from "./MissionCard";

const API = "http://127.0.0.1:8000";

export default function MissionGrid() {

  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {

    fetch(`${API}/missions/`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMissions(data);
      })
      .catch(console.error);

  }, []);

  return (

    <section className="mission-grid">

      {missions.map((mission) => (

        <MissionCard
          key={mission.id}
          {...mission}
        />

      ))}

    </section>

  );

}