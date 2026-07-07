"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import "./RescueMap.css";

const API = "http://127.0.0.1:8000";

const LeafletMap = dynamic(
  () => import("./LeafletMap"),
  {
    ssr: false,
  }
);

export default function RescueMap() {

  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {

    fetch(`${API}/map/`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCats(data);
      })
      .catch(console.error);

  }, []);

  return (

    <section className="map-box">

      <LeafletMap cats={cats} />

    </section>

  );

}