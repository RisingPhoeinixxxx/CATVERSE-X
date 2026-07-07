"use client";

import { useEffect, useState } from "react";

import ShelterCard from "./ShelterCard";
import "./ShelterGrid.css";

const API = "http://127.0.0.1:8000";

export default function ShelterGrid() {

  const [shelters, setShelters] = useState<any[]>([]);

  useEffect(() => {

    fetch(`${API}/shelters/`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setShelters(data);
      })
      .catch(console.error);

  }, []);

  return (

    <section className="shelter-grid">

      {shelters.map((shelter) => (

        <ShelterCard
          key={shelter.id}
          shelter={shelter}
        />

      ))}

    </section>

  );

}