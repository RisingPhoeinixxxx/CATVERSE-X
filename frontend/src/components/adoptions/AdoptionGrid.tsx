"use client";

import { useEffect, useState } from "react";

import "./AdoptionGrid.css";
import AdoptionCard from "./AdoptionCard";

const API = "http://127.0.0.1:8000";

export default function AdoptionGrid() {

  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {

    fetch(`${API}/adoptions/`)
      .then((res) => res.json())
      .then(setCats)
      .catch(console.error);

  }, []);

  return (

    <section className="adoption-grid">

      {cats.map((cat) => (

        <AdoptionCard
          key={cat.id}
          cat={cat}
        />

      ))}

    </section>

  );

}