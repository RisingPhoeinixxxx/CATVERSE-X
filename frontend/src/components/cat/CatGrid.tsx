"use client";

import { useEffect, useState } from "react";

import "./CatGrid.css";
import CatCard from "./CatCard";

const API = "http://127.0.0.1:8000";

type Props = {
  search: string;
  filter: string;
};

export default function CatGrid({
  search,
  filter,
}: Props) {

  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {

    fetch(`${API}/cats/`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Cats:", data);
        setCats(data);
      })
      .catch(console.error);

  }, []);

  const filteredCats = cats.filter((cat) => {

  const keyword = search.trim().toLowerCase();

  const matchesSearch =
  keyword === "" ||

  cat.name?.toLowerCase().includes(keyword) ||

  (`cx-${cat.id}`).toLowerCase().includes(keyword) ||

  cat.status?.toLowerCase().includes(keyword) ||

  cat.breed?.toLowerCase().includes(keyword) ||

  cat.color?.toLowerCase().includes(keyword) ||

  cat.gender?.toLowerCase().includes(keyword) ||

  cat.age?.toLowerCase().includes(keyword) ||

  `${cat.latitude}, ${cat.longitude}`.toLowerCase().includes(keyword);

  const matchesFilter =
    filter === "All" ||
    cat.status?.toLowerCase() === filter.toLowerCase();

  return matchesSearch && matchesFilter;

});

  return (

    <section className="cat-grid">

      {filteredCats.map((cat) => (

        <CatCard
          key={cat.id}
          id={`CX-${cat.id}`}
          name={cat.name}
          status={cat.status}
          health={Math.round(cat.health_score)}
          confidence={Math.round(cat.ai_score)}
          location={`${cat.latitude}, ${cat.longitude}`}
        />

      ))}

    </section>

  );

}